import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { login, token } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("pashamrevanth541@gmail.com");
  const [password, setPassword] = useState("admin");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (token) {
    navigate("/", { replace: true });
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email.trim(), password);
      navigate("/", { replace: true });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)",
        padding: "1.5rem",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 420,
          background: "#fff",
          borderRadius: "var(--admin-radius)",
          boxShadow: "var(--admin-shadow-lg)",
          padding: "2.5rem",
          border: "1px solid var(--admin-border)",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "1.75rem" }}>
          <div style={{ fontSize: "1.5rem", fontWeight: 700, color: "var(--admin-text)", letterSpacing: "-0.02em" }}>
            House of
          </div>
          <div style={{ fontSize: "0.875rem", color: "var(--admin-muted)", marginTop: 4 }}>Admin panel</div>
        </div>
        <h1 style={{ margin: "0 0 1.5rem", fontSize: "1.25rem", fontWeight: 600, color: "var(--admin-text)" }}>
          Sign in
        </h1>
        <form onSubmit={handleSubmit}>
          {error && (
            <div
              style={{
                marginBottom: "1rem",
                padding: "0.75rem 1rem",
                background: "#fef2f2",
                color: "var(--admin-error)",
                borderRadius: "var(--admin-radius-sm)",
                fontSize: "0.875rem",
                border: "1px solid #fecaca",
              }}
            >
              {error}
            </div>
          )}
          <div style={{ marginBottom: "1.25rem" }}>
            <label
              style={{
                display: "block",
                marginBottom: "0.375rem",
                fontSize: "0.875rem",
                fontWeight: 500,
                color: "var(--admin-text)",
              }}
            >
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              placeholder="admin@example.com"
              style={{
                width: "100%",
                padding: "0.625rem 0.875rem",
                border: "1px solid var(--admin-border)",
                borderRadius: "var(--admin-radius-sm)",
                fontSize: "0.9375rem",
                fontFamily: "inherit",
                transition: "border-color 0.15s, box-shadow 0.15s",
              }}
            />
          </div>
          <div style={{ marginBottom: "1.5rem" }}>
            <label
              style={{
                display: "block",
                marginBottom: "0.375rem",
                fontSize: "0.875rem",
                fontWeight: 500,
                color: "var(--admin-text)",
              }}
            >
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              style={{
                width: "100%",
                padding: "0.625rem 0.875rem",
                border: "1px solid var(--admin-border)",
                borderRadius: "var(--admin-radius-sm)",
                fontSize: "0.9375rem",
                fontFamily: "inherit",
                transition: "border-color 0.15s, box-shadow 0.15s",
              }}
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "0.75rem 1rem",
              background: loading ? "#94a3b8" : "var(--admin-accent)",
              color: "#fff",
              border: "none",
              borderRadius: "var(--admin-radius-sm)",
              fontWeight: 600,
              fontSize: "0.9375rem",
              cursor: loading ? "not-allowed" : "pointer",
              fontFamily: "inherit",
              transition: "background 0.15s",
            }}
          >
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>
        <p style={{ margin: "1.25rem 0 0", fontSize: "0.8125rem", color: "var(--admin-muted)", textAlign: "center" }}>
          Use your admin credentials to access the dashboard.
        </p>
      </div>
    </div>
  );
}
