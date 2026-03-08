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
                <th style={{ padding: "0.75rem 1rem", borderBottom: "1px solid #e2e8f0" }}>Order ID / Date</th>
                <th style={{ padding: "0.75rem 1rem", borderBottom: "1px solid #e2e8f0" }}>Customer (Name / Email / Phone)</th>
                <th style={{ padding: "0.75rem 1rem", borderBottom: "1px solid #e2e8f0" }}>Total</th>
                <th style={{ padding: "0.75rem 1rem", borderBottom: "1px solid #e2e8f0" }}>Status</th>
                <th style={{ padding: "0.75rem 1rem", borderBottom: "1px solid #e2e8f0" }}>Payment</th>
                <th style={{ padding: "0.75rem 1rem", borderBottom: "1px solid #e2e8f0" }}>Update status</th>
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
                    <div style={{ fontWeight: 500 }}>{o.address?.fullName ?? o.user?.name ?? "—"}</div>
                    {o.user?.email && <div style={{ fontSize: "0.8125rem", color: "#64748b" }}>{o.user.email}</div>}
                    {o.address?.phoneNumber && <div style={{ fontSize: "0.8125rem", color: "#0f172a" }}>{o.address.phoneNumber}</div>}
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
        <div style={{ marginTop: "1.5rem" }}>
          <h2 style={{ margin: "0 0 0.75rem", fontSize: "1.125rem", fontWeight: 600 }}>Order details (address & products)</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {orders.map((o) => (
              <div key={o.id} style={{ padding: "1rem", background: "#fff", borderRadius: 8, border: "1px solid #e2e8f0", boxShadow: "0 1px 2px rgba(0,0,0,0.04)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.75rem", flexWrap: "wrap", gap: "0.5rem" }}>
                  <strong style={{ fontSize: "0.9375rem" }}>Order #{o.id.slice(0, 8).toUpperCase()}</strong>
                  <span style={{ fontSize: "0.875rem", color: "#64748b" }}>{new Date(o.createdAt).toLocaleString()}</span>
                </div>
                {o.address && (
                  <div style={{ marginBottom: "0.75rem", padding: "0.5rem 0", borderBottom: "1px solid #f1f5f9" }}>
                    <div style={{ fontSize: "0.75rem", color: "#64748b", marginBottom: 2 }}>Delivery address</div>
                    <div style={{ fontSize: "0.875rem" }}>
                      {o.address.fullName}, {o.address.phoneNumber} — {o.address.streetAddress}, {o.address.area}, {o.address.city}, {o.address.state} {o.address.postalCode}, {o.address.country}
                    </div>
                  </div>
                )}
                <div style={{ fontSize: "0.75rem", color: "#64748b", marginBottom: 4 }}>Products</div>
                <ul style={{ margin: 0, paddingLeft: "1.25rem", fontSize: "0.875rem" }}>
                  {o.items.map((i) => (
                    <li key={i.id} style={{ marginBottom: 2 }}>{i.productName} × {i.quantity} — ₹{Number(i.subtotal).toLocaleString("en-IN")}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
