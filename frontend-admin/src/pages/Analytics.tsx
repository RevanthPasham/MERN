import { useEffect, useState } from "react";
import { getAnalytics, type AnalyticsDto } from "../api/client";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:4000/api";

export default function Analytics() {
  const [data, setData] = useState<AnalyticsDto | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAnalytics()
      .then(setData)
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, []);

  const exportUrl = `${API_BASE}/admin/analytics/export`;
  const token = localStorage.getItem("adminToken");

  const downloadCsv = () => {
    const link = document.createElement("a");
    link.href = exportUrl;
    link.setAttribute("download", "orders-export.csv");
    if (token) {
      link.setAttribute("headers", `Authorization: Bearer ${token}`);
    }
    fetch(exportUrl, { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.text())
      .then((csv) => {
        const blob = new Blob([csv], { type: "text/csv" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `orders-export-${Date.now()}.csv`;
        a.click();
        URL.revokeObjectURL(url);
      })
      .catch(() => alert("Download failed"));
  };

  if (loading) return <p>Loading...</p>;
  if (!data) return <p>Failed to load analytics.</p>;

  return (
    <div>
      <h1 style={{ margin: "0 0 1rem" }}>Analytics</h1>
      <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", marginBottom: "1.5rem" }}>
        <div style={{ background: "#fff", padding: "1rem", borderRadius: 8, minWidth: 160, boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
          <div style={{ fontSize: "0.875rem", color: "#64748b" }}>Total revenue</div>
          <div style={{ fontSize: "1.5rem", fontWeight: 600 }}>₹{Number(data.totalRevenue).toLocaleString("en-IN")}</div>
        </div>
        <div style={{ background: "#fff", padding: "1rem", borderRadius: 8, minWidth: 160, boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
          <div style={{ fontSize: "0.875rem", color: "#64748b" }}>Total orders</div>
          <div style={{ fontSize: "1.5rem", fontWeight: 600 }}>{data.totalOrders}</div>
        </div>
        <div style={{ background: "#fff", padding: "1rem", borderRadius: 8, minWidth: 160, boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
          <button type="button" onClick={downloadCsv} style={{ padding: "0.5rem 1rem", background: "#1e293b", color: "#fff", border: "none", borderRadius: 4, cursor: "pointer" }}>
            Download CSV
          </button>
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
        <div style={{ background: "#fff", padding: "1rem", borderRadius: 8, boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
          <h3 style={{ margin: "0 0 0.5rem" }}>Orders by status</h3>
          <ul style={{ margin: 0, paddingLeft: "1.25rem" }}>
            {Object.entries(data.ordersByStatus || {}).map(([status, count]) => (
              <li key={status}>{status}: {count}</li>
            ))}
          </ul>
        </div>
        <div style={{ background: "#fff", padding: "1rem", borderRadius: 8, boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
          <h3 style={{ margin: "0 0 0.5rem" }}>Top selling (by quantity)</h3>
          <ul style={{ margin: 0, paddingLeft: "1.25rem", fontSize: "0.875rem" }}>
            {(data.topSelling || []).slice(0, 10).map((p) => (
              <li key={p.productId}>{p.productName} — qty: {p.quantity}, revenue: ₹{Number(p.revenue).toLocaleString("en-IN")}</li>
            ))}
          </ul>
        </div>
      </div>
      <div style={{ marginTop: "1rem", background: "#fff", padding: "1rem", borderRadius: 8, boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
        <h3 style={{ margin: "0 0 0.5rem" }}>Least selling</h3>
        <ul style={{ margin: 0, paddingLeft: "1.25rem", fontSize: "0.875rem" }}>
          {(data.leastSelling || []).slice(0, 10).map((p) => (
            <li key={p.productId}>{p.productName} — qty: {p.quantity}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
