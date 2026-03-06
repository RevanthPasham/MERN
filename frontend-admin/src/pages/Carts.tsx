import { useEffect, useState } from "react";
import { getCarts, type CartSummaryDto } from "../api/client";

export default function Carts() {
  const [carts, setCarts] = useState<CartSummaryDto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCarts()
      .then(setCarts)
      .catch(() => setCarts([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <h1 style={{ margin: "0 0 1rem" }}>Carts</h1>
      <p style={{ fontSize: "0.875rem", color: "#64748b", marginBottom: "1rem" }}>
        Users who have added products to cart (email, name, and cart items).
      </p>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {carts.map((c) => (
            <div key={c.userId} style={{ background: "#fff", borderRadius: 8, padding: "1rem", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
              <div style={{ marginBottom: "0.5rem" }}>
                <strong>{c.user?.email ?? "Unknown"}</strong>
                {c.user?.name && <span style={{ color: "#64748b", marginLeft: "0.5rem" }}>({c.user.name})</span>}
                <span style={{ marginLeft: "0.5rem", fontSize: "0.875rem", color: "#64748b" }}>{c.itemCount} item(s)</span>
              </div>
              <ul style={{ margin: 0, paddingLeft: "1.25rem", fontSize: "0.875rem" }}>
                {c.items.map((i, idx) => (
                  <li key={idx}>
                    {i.productTitle} — Size: {i.size}, Qty: {i.quantity}
                    {i.price != null && ` — ₹${i.price}`}
                  </li>
                ))}
              </ul>
            </div>
          ))}
          {carts.length === 0 && <p style={{ color: "#64748b" }}>No carts</p>}
        </div>
      )}
    </div>
  );
}
