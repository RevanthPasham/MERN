import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { setPasswordFromToken } from "../api/client";

export default function SetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") ?? "";
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!token) setError("Invalid or missing invitation link");
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match");
      return;
    }
    setLoading(true);
    try {
      const data = await setPasswordFromToken(token, password);
      if (data.token) {
        localStorage.setItem("adminToken", data.token);
        navigate("/", { replace: true });
        window.location.reload();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to set password");
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)", padding: "1.5rem" }}>
        <div style={{ maxWidth: 420, width: "100%", background: "#fff", borderRadius: 8, padding: "2rem", textAlign: "center" }}>
          <p style={{ color: "#ef4444", margin: 0 }}>Invalid or expired invitation link. Please request a new invitation.</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)", padding: "1.5rem" }}>
      <div style={{ maxWidth: 420, width: "100%", background: "#fff", borderRadius: 8, boxShadow: "0 4px 6px rgba(0,0,0,0.1)", padding: "2rem" }}>
        <h1 style={{ margin: "0 0 1.5rem", fontSize: "1.25rem", fontWeight: 600 }}>Set your password</h1>
        <p style={{ margin: "0 0 1.5rem", fontSize: "0.875rem", color: "#64748b" }}>
          Create a password to activate your admin account. This link expires in 24 hours.
        </p>
        <form onSubmit={handleSubmit}>
          {error && (
            <div style={{ marginBottom: "1rem", padding: "0.75rem", background: "#fef2f2", color: "#dc2626", borderRadius: 6, fontSize: "0.875rem" }}>
              {error}
            </div>
          )}
          <div style={{ marginBottom: "1rem" }}>
            <label style={{ display: "block", marginBottom: "0.375rem", fontSize: "0.875rem", fontWeight: 500 }}>Password *</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              placeholder="Min 6 characters"
              style={{ width: "100%", padding: "0.625rem 0.875rem", border: "1px solid #e2e8f0", borderRadius: 6, fontSize: "0.9375rem" }}
            />
          </div>
          <div style={{ marginBottom: "1.5rem" }}>
            <label style={{ display: "block", marginBottom: "0.375rem", fontSize: "0.875rem", fontWeight: 500 }}>Confirm password *</label>
            <input
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              required
              placeholder="Confirm password"
              style={{ width: "100%", padding: "0.625rem 0.875rem", border: "1px solid #e2e8f0", borderRadius: 6, fontSize: "0.9375rem" }}
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            style={{ width: "100%", padding: "0.75rem", background: loading ? "#94a3b8" : "#0f172a", color: "#fff", border: "none", borderRadius: 6, fontWeight: 600, cursor: loading ? "not-allowed" : "pointer" }}
          >
            {loading ? "Setting password…" : "Set password"}
          </button>
        </form>
      </div>
    </div>
  );
}
