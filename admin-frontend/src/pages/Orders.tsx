import { useEffect, useState } from "react";
import { getOrders, updateOrderStatus, type OrderDto } from "../api/client";

type Filter = "all" | "new" | "completed";

export default function Orders() {
  const [orders, setOrders] = useState<OrderDto[]>([]);
  const [filter, setFilter] = useState<Filter>("all");
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    getOrders(filter)
      .then(setOrders)
      .catch(() => setOrders([]))
      .finally(() => setLoading(false));
  }, [filter]);

  const handleStatusChange = async (orderId: string, orderStatus: string) => {
    setUpdatingId(orderId);
    try {
      const updated = await updateOrderStatus(orderId, orderStatus);
      setOrders((prev) => prev.map((o) => (o.id === orderId ? updated : o)));
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div>
      <h1 style={{ margin: "0 0 1rem" }}>Orders</h1>
      <div style={{ marginBottom: "1rem", display: "flex", gap: "0.5rem" }}>
        {(["all", "new", "completed"] as const).map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFilter(f)}
            style={{
              padding: "0.5rem 1rem",
              background: filter === f ? "#1e293b" : "#e2e8f0",
              color: filter === f ? "#fff" : "#334155",
              border: "none",
              borderRadius: 4,
              cursor: "pointer",
            }}
          >
            {f === "all" ? "All" : f === "new" ? "New / Processing" : "Completed"}
          </button>
        ))}
      </div>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div style={{ background: "#fff", borderRadius: 8, overflow: "hidden", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#f8fafc", textAlign: "left" }}>
                <th style={{ padding: "0.75rem 1rem", borderBottom: "1px solid #e2e8f0" }}>Order</th>
                <th style={{ padding: "0.75rem 1rem", borderBottom: "1px solid #e2e8f0" }}>User</th>
                <th style={{ padding: "0.75rem 1rem", borderBottom: "1px solid #e2e8f0" }}>Total</th>
                <th style={{ padding: "0.75rem 1rem", borderBottom: "1px solid #e2e8f0" }}>Status</th>
                <th style={{ padding: "0.75rem 1rem", borderBottom: "1px solid #e2e8f0" }}>Payment</th>
                <th style={{ padding: "0.75rem 1rem", borderBottom: "1px solid #e2e8f0" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id} style={{ borderBottom: "1px solid #e2e8f0" }}>
                  <td style={{ padding: "0.75rem 1rem" }}>
                    <strong>{o.id.slice(0, 8)}</strong>
                    <br />
                    <span style={{ fontSize: "0.875rem", color: "#64748b" }}>
                      {new Date(o.createdAt).toLocaleString()}
                    </span>
                  </td>
                  <td style={{ padding: "0.75rem 1rem" }}>
                    {o.user?.email ?? "—"}
                    {o.user?.name && <br />}
                    {o.user?.name && <span style={{ fontSize: "0.875rem", color: "#64748b" }}>{o.user.name}</span>}
                  </td>
                  <td style={{ padding: "0.75rem 1rem" }}>₹{Number(o.totalAmount).toLocaleString("en-IN")}</td>
                  <td style={{ padding: "0.75rem 1rem" }}>{o.orderStatus}</td>
                  <td style={{ padding: "0.75rem 1rem" }}>{o.paymentStatus}</td>
                  <td style={{ padding: "0.75rem 1rem" }}>
                    <select
                      value={o.orderStatus}
                      onChange={(e) => handleStatusChange(o.id, e.target.value)}
                      disabled={updatingId === o.id}
                      style={{ padding: "0.25rem 0.5rem", borderRadius: 4, border: "1px solid #e2e8f0" }}
                    >
                      <option value="Processing">Processing</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {orders.length === 0 && <p style={{ padding: "2rem", textAlign: "center", color: "#64748b" }}>No orders</p>}
        </div>
      )}
      {orders.length > 0 && (
        <div style={{ marginTop: "1rem" }}>
          <details>
            <summary style={{ cursor: "pointer", fontWeight: 500 }}>Order details (address & items)</summary>
            <div style={{ marginTop: "0.5rem" }}>
              {orders.map((o) => (
                <div key={o.id} style={{ marginBottom: "1rem", padding: "1rem", background: "#f8fafc", borderRadius: 6 }}>
                  <strong>Order {o.id.slice(0, 8)}</strong>
                  {o.address && (
                    <p style={{ margin: "0.5rem 0", fontSize: "0.875rem" }}>
                      Address: {o.address.fullName}, {o.address.phoneNumber}, {o.address.streetAddress}, {o.address.area}, {o.address.city}, {o.address.state} {o.address.postalCode}, {o.address.country}
                    </p>
                  )}
                  <ul style={{ margin: "0.5rem 0", paddingLeft: "1.25rem", fontSize: "0.875rem" }}>
                    {o.items.map((i) => (
                      <li key={i.id}>{i.productName} × {i.quantity} — ₹{Number(i.subtotal).toLocaleString("en-IN")}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </details>
        </div>
      )}
    </div>
  );
}
