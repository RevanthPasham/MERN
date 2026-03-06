import { Link } from "react-router-dom";

export default function Dashboard() {
  return (
    <div>
      <h1 style={{ margin: "0 0 1rem" }}>Dashboard</h1>
      <p style={{ color: "#64748b" }}>Use the sidebar to manage orders, products, collections, banners, carts, and view analytics.</p>
      <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", marginTop: "1.5rem" }}>
        <Link to="/orders" style={{ padding: "0.75rem 1rem", background: "#e2e8f0", borderRadius: 6 }}>Orders</Link>
        <Link to="/products" style={{ padding: "0.75rem 1rem", background: "#e2e8f0", borderRadius: 6 }}>Products</Link>
        <Link to="/analytics" style={{ padding: "0.75rem 1rem", background: "#e2e8f0", borderRadius: 6 }}>Analytics</Link>
      </div>
    </div>
  );
}
