import { Outlet, NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const nav = [
  { to: "/orders", label: "Orders" },
  { to: "/products", label: "Products" },
  { to: "/collections", label: "Collections" },
  { to: "/banners", label: "Banners" },
  { to: "/carts", label: "Carts" },
  { to: "/analytics", label: "Analytics" },
];

export default function Layout() {
  const { admin, logout } = useAuth();

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <aside
        style={{
          width: 220,
          background: "#1e293b",
          color: "#fff",
          padding: "1rem 0",
          flexShrink: 0,
        }}
      >
        <div style={{ padding: "0 1rem", marginBottom: "1.5rem" }}>
          <strong>Admin Panel</strong>
        </div>
        <nav>
          {nav.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              style={({ isActive }) => ({
                display: "block",
                padding: "0.5rem 1rem",
                color: isActive ? "#fff" : "#94a3b8",
                background: isActive ? "#334155" : "transparent",
                textDecoration: "none",
              })}
            >
              {label}
            </NavLink>
          ))}
        </nav>
        <div style={{ padding: "1rem", marginTop: "auto", borderTop: "1px solid #334155" }}>
          <span style={{ fontSize: "0.875rem", color: "#94a3b8" }}>{admin?.email}</span>
          <button
            type="button"
            onClick={logout}
            style={{
              display: "block",
              marginTop: "0.5rem",
              padding: "0.25rem 0",
              background: "none",
              border: "none",
              color: "#f87171",
              cursor: "pointer",
              fontSize: "0.875rem",
            }}
          >
            Logout
          </button>
        </div>
      </aside>
      <main style={{ flex: 1, padding: "1.5rem", overflow: "auto" }}>
        <Outlet />
      </main>
    </div>
  );
}
