import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getOrders, getRefundPolicy, requestRefund } from "../api/client";
import type { OrderDto } from "../types";

function formatAddress(addr: OrderDto["address"]) {
  if (!addr) return "\u2014";
  const parts = [
    addr.streetAddress,
    addr.area,
    [addr.city, addr.state].filter(Boolean).join(", "),
    addr.postalCode,
    addr.country,
  ].filter(Boolean);
  return parts.join(", ");
}

function orderStatusColor(status: string) {
  switch (status) {
    case "Delivered":
      return "text-green-700 bg-green-100";
    case "Shipped":
      return "text-blue-700 bg-blue-100";
    case "Processing":
      return "text-amber-700 bg-amber-100";
    default:
      return "text-gray-700 bg-gray-100";
  }
}

export default function OrderHistory() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<OrderDto[]>([]);
  const [refundPolicy, setRefundPolicy] = useState("");
  const [loading, setLoading] = useState(true);
  const [refundOrderId, setRefundOrderId] = useState<string | null>(null);
  const [refundMessage, setRefundMessage] = useState("");
  const [refundSubmitting, setRefundSubmitting] = useState(false);
  const [refundError, setRefundError] = useState("");

  useEffect(() => {
    if (!user) {
      navigate("/login", { replace: true });
      return;
    }
    Promise.all([getOrders(), getRefundPolicy()])
      .then(([ordersList, policy]) => {
        setOrders(ordersList);
        setRefundPolicy(policy);
      })
      .catch(() => setOrders([]))
      .finally(() => setLoading(false));
  }, [user, navigate]);

  if (!user) return null;

  return (
    <main className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Order history</h1>
      <Link to="/account" className="text-[#1e3a5f] hover:underline mb-6 inline-block text-sm">
        &#8592; Back to account
      </Link>

      {refundPolicy && orders.length > 0 && (
        <div className="mb-6 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
          <h3 className="font-semibold mb-2">Refund policy</h3>
          <p className="whitespace-pre-wrap">{refundPolicy}</p>
        </div>
      )}
      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : orders.length === 0 ? (
        <p className="text-gray-600">You haven&apos;t placed any orders yet.</p>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm"
            >
              <div className="bg-gray-50 px-5 py-4 flex flex-wrap items-center justify-between gap-3">
                <span className="font-mono font-semibold text-gray-900">
                  Order #{order.id.slice(0, 8).toUpperCase()}
                </span>
                <span className="text-sm text-gray-500">
                  {new Date(order.createdAt).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </span>
                <span
                  className={`text-xs font-medium rounded-full px-3 py-1 ${orderStatusColor(
                    order.orderStatus
                  )}`}
                >
                  {order.orderStatus}
                </span>
              </div>
              <div className="px-5 py-4 space-y-3">
                <ul className="space-y-1">
                  {order.items.map((item) => (
                    <li
                      key={item.id}
                      className="flex justify-between text-sm"
                    >
                      <span className="text-gray-800">
                        {item.productName} &times; {item.quantity}
                      </span>
                      <span className="text-gray-700">₹{Number(item.subtotal).toLocaleString("en-IN")}</span>
                    </li>
                  ))}
                </ul>
                <p className="text-right font-bold text-gray-900 text-base pt-2 border-t border-gray-100">
                  Total: ₹{Number(order.totalAmount).toLocaleString("en-IN")}
                </p>
                <div className="text-sm text-gray-500 pt-1 flex items-start gap-1.5">
                  <svg className="w-4 h-4 mt-0.5 shrink-0 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {formatAddress(order.address)}
                </div>
                <div className="text-xs text-gray-400">
                  Payment: {order.paymentStatus} &middot; {order.paymentMethod}
                </div>
                <div className="pt-3 mt-3 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => {
                      setRefundOrderId(order.id);
                      setRefundMessage("");
                      setRefundError("");
                    }}
                    className="text-sm text-amber-700 hover:text-amber-800 font-medium"
                  >
                    Request refund
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {refundOrderId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => !refundSubmitting && setRefundOrderId(null)}>
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-5" onClick={(e) => e.stopPropagation()}>
            <h3 className="font-semibold text-gray-900 mb-2">Request refund</h3>
            <p className="text-sm text-gray-600 mb-3">Describe the reason for your refund. The store will review your request.</p>
            {refundError && <p className="text-sm text-red-600 mb-2">{refundError}</p>}
            <textarea
              value={refundMessage}
              onChange={(e) => setRefundMessage(e.target.value)}
              placeholder="e.g. Wrong size, defective item..."
              rows={4}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm resize-y mb-4"
            />
            <div className="flex gap-2 justify-end">
              <button
                type="button"
                onClick={() => setRefundOrderId(null)}
                disabled={refundSubmitting}
                className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={async () => {
                  if (!refundMessage.trim()) {
                    setRefundError("Please describe your reason.");
                    return;
                  }
                  setRefundError("");
                  setRefundSubmitting(true);
                  try {
                    await requestRefund(refundOrderId, refundMessage.trim());
                    setRefundOrderId(null);
                    setRefundMessage("");
                  } catch (err: unknown) {
                    setRefundError(err instanceof Error ? err.message : "Request failed");
                  } finally {
                    setRefundSubmitting(false);
                  }
                }}
                disabled={refundSubmitting}
                className="px-3 py-1.5 text-sm bg-amber-600 text-white rounded-lg hover:bg-amber-700 disabled:opacity-50"
              >
                {refundSubmitting ? "Submitting…" : "Submit request"}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
