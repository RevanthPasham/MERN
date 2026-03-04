import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getOrders } from "../api/client";
import type { OrderDto } from "../types";

function formatAddress(addr: OrderDto["address"]) {
  if (!addr) return "—";
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
      <h1 className="text-2xl font-bold text-gray-900 mb-4">Order history</h1>
      <Link to="/account" className="text-blue-600 hover:underline mb-4 inline-block">
        ← Back to account
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
              className="border border-gray-200 rounded-lg overflow-hidden"
            >
              <div className="bg-gray-50 px-4 py-3 flex flex-wrap items-center justify-between gap-2">
                <span className="font-semibold text-gray-900">
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
                  className={`text-xs font-medium px-2 py-1 rounded ${orderStatusColor(
                    order.orderStatus
                  )}`}
                >
                  {order.orderStatus}
                </span>
              </div>
              <div className="p-4 space-y-3">
                <ul className="space-y-1">
                  {order.items.map((item) => (
                    <li
                      key={item.id}
                      className="flex justify-between text-sm text-gray-700"
                    >
                      <span>
                        {item.productName} × {item.quantity}
                      </span>
                      <span>₹{Number(item.subtotal).toLocaleString("en-IN")}</span>
                    </li>
                  ))}
                </ul>
                <p className="text-right font-semibold text-gray-900 pt-2 border-t border-gray-100">
                  Total: ₹{Number(order.totalAmount).toLocaleString("en-IN")}
                </p>
                <div className="text-sm text-gray-600 pt-1">
                  <span className="font-medium text-gray-700">Delivery address: </span>
                  {formatAddress(order.address)}
                </div>
                <div className="text-xs text-gray-500">
                  Payment: {order.paymentStatus} · {order.paymentMethod}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
