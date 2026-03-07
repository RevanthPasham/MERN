import { useState } from "react";
import { inviteSubAdmin } from "../api/client";
import { useAuth } from "../context/AuthContext";

export default function InviteAdmin() {
  const { admin } = useAuth();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const isSuperAdmin = admin?.role === "super_admin";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    setError("");
    setMessage("");
    try {
      await inviteSubAdmin(email.trim());
      setMessage("Invitation sent to " + email.trim());
      setEmail("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send invitation");
    } finally {
      setLoading(false);
    }
  };

  if (!isSuperAdmin) {
    return (
      <div>
        <h1 style={{ margin: "0 0 1rem", fontSize: "1.5rem", fontWeight: 600 }}>Invite sub admin</h1>
        <p style={{ color: "#ef4444" }}>Only Super Admin can invite sub admins.</p>
      </div>
    );
  }

  return (
    <div>
      <h1 style={{ margin: "0 0 1rem", fontSize: "1.5rem", fontWeight: 600 }}>Invite sub admin</h1>
      <p style={{ margin: "0 0 1.5rem", fontSize: "0.9375rem", color: "#64748b" }}>
        Enter the email address. An invitation with a link to set password will be sent. Email is not editable in the invite; the invitee sets their password.
      </p>
      <form onSubmit={handleSubmit} style={{ maxWidth: 420, background: "#fff", borderRadius: 8, border: "1px solid var(--admin-border)", padding: "1.5rem", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
        {error && (
          <div style={{ marginBottom: "1rem", padding: "0.75rem", background: "#fef2f2", color: "#dc2626", borderRadius: 6, fontSize: "0.875rem" }}>
            {error}
          </div>
        )}
        {message && (
          <div style={{ marginBottom: "1rem", padding: "0.75rem", background: "#f0fdf4", color: "#22c55e", borderRadius: 6, fontSize: "0.875rem" }}>
            {message}
          </div>
        )}
        <div style={{ marginBottom: "1rem" }}>
          <label style={{ display: "block", marginBottom: "0.375rem", fontSize: "0.875rem", fontWeight: 500 }}>Email *</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="subadmin@example.com"
            style={{ width: "100%", padding: "0.625rem 0.875rem", border: "1px solid var(--admin-border)", borderRadius: 6, fontSize: "0.9375rem" }}
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          style={{ padding: "0.5rem 1.25rem", background: loading ? "#94a3b8" : "var(--admin-accent, #0f172a)", color: "#fff", border: "none", borderRadius: 6, fontWeight: 500, cursor: loading ? "not-allowed" : "pointer" }}
        >
          {loading ? "Sending…" : "Send invitation"}
        </button>
      </form>
    </div>
  );
}
