import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getOrders } from "../api/client";
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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate("/login", { replace: true });
      return;
    }
    getOrders()
      .then(setOrders)
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
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
