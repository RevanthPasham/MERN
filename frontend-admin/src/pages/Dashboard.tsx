import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAnalytics, type AnalyticsDto } from "../api/client";

function StatCard({
  title,
  value,
  subtext,
  icon,
  color,
}: {
  title: string;
  value: string | number;
  subtext?: string;
  icon: React.ReactNode;
  color: string;
}) {
  return (
    <div
      className="admin-card"
      style={{
        padding: "1.25rem",
        display: "flex",
        alignItems: "flex-start",
        gap: "1rem",
        transition: "box-shadow 0.2s",
      }}
    >
      <div
        style={{
          width: 48,
          height: 48,
          borderRadius: "var(--admin-radius-sm)",
          background: color,
          color: "#fff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        {icon}
      </div>
      <div style={{ minWidth: 0 }}>
        <div style={{ fontSize: "0.8125rem", color: "var(--admin-muted)", fontWeight: 500, marginBottom: 4 }}>
          {title}
        </div>
        <div style={{ fontSize: "1.5rem", fontWeight: 700, color: "var(--admin-text)", letterSpacing: "-0.02em" }}>
          {value}
        </div>
        {subtext && (
          <div style={{ fontSize: "0.75rem", color: "var(--admin-muted)", marginTop: 4 }}>{subtext}</div>
        )}
      </div>
    </div>
  );
}

function ChartIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="18" y1="20" x2="18" y2="10" />
      <line x1="12" y1="20" x2="12" y2="4" />
      <line x1="6" y1="20" x2="6" y2="14" />
    </svg>
  );
}

function OrderIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
      <line x1="3" y1="6" x2="21" y2="6" />
      <path d="M16 10a4 4 0 0 1-8 0" />
    </svg>
  );
}

function RevenueIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="12" y1="1" x2="12" y2="23" />
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </svg>
  );
}

function ProductIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
      <line x1="3" y1="9" x2="21" y2="9" />
      <line x1="9" y1="21" x2="9" y2="9" />
    </svg>
  );
}

const quickLinks = [
  { to: "/orders", label: "Orders", desc: "View and manage orders", icon: OrderIcon },
  { to: "/products", label: "Products", desc: "Manage product catalog", icon: ProductIcon },
  { to: "/analytics", label: "Analytics", desc: "Reports and export", icon: ChartIcon },
];

function formatCurrency(n: number) {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);
}

export default function Dashboard() {
  const [analytics, setAnalytics] = useState<AnalyticsDto | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAnalytics()
      .then(setAnalytics)
      .catch(() => setAnalytics(null))
      .finally(() => setLoading(false));
  }, []);

  const totalRevenue = analytics?.totalRevenue ?? 0;
  const totalOrders = analytics?.totalOrders ?? 0;
  const ordersByStatus = analytics?.ordersByStatus ?? {};

  return (
    <div>
      <h1 className="admin-page-title">Dashboard</h1>
      <p className="admin-page-subtitle">
        Overview of your store. Use the sidebar to manage orders, products, collections, and more.
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
          gap: "1.25rem",
          marginBottom: "2rem",
        }}
      >
        <StatCard
          title="Total revenue"
          value={loading ? "—" : formatCurrency(totalRevenue)}
          subtext="All time"
          icon={<RevenueIcon />}
          color="var(--admin-success)"
        />
        <StatCard
          title="Total orders"
          value={loading ? "—" : totalOrders.toLocaleString()}
          subtext={Object.keys(ordersByStatus).length ? `${Object.values(ordersByStatus).reduce((a, b) => a + b, 0)} total` : undefined}
          icon={<OrderIcon />}
          color="var(--admin-accent)"
        />
        <StatCard
          title="Order statuses"
          value={loading ? "—" : Object.keys(ordersByStatus).length}
          subtext={Object.entries(ordersByStatus)
            .map(([k, v]) => `${k}: ${v}`)
            .join(" · ")}
          icon={<ChartIcon />}
          color="#8b5cf6"
        />
      </div>

      <h2 style={{ fontSize: "1.125rem", fontWeight: 600, marginBottom: "1rem", color: "var(--admin-text)" }}>
        Quick links
      </h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "1rem" }}>
        {quickLinks.map(({ to, label, desc, icon: Icon }) => (
          <Link
            key={to}
            to={to}
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <div
              className="admin-card"
              style={{
                padding: "1.25rem",
                display: "flex",
                alignItems: "center",
                gap: "1rem",
                transition: "box-shadow 0.2s, border-color 0.2s",
              }}
            >
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: "var(--admin-radius-sm)",
                  background: "var(--admin-border)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "var(--admin-muted)",
                }}
              >
                <Icon />
              </div>
              <div>
                <div style={{ fontWeight: 600, color: "var(--admin-text)", marginBottom: 2 }}>{label}</div>
                <div style={{ fontSize: "0.8125rem", color: "var(--admin-muted)" }}>{desc}</div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
