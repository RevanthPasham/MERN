import { useEffect, useState } from "react";
import { getRefundPolicy, updateRefundPolicy } from "../api/client";

export default function Settings() {
  const [refundPolicy, setRefundPolicy] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    getRefundPolicy()
      .then(setRefundPolicy)
      .catch(() => setRefundPolicy(""))
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");
    try {
      await updateRefundPolicy(refundPolicy);
      setMessage("Saved");
      setTimeout(() => setMessage(""), 2000);
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p style={{ color: "#64748b" }}>Loading...</p>;

  return (
    <div>
      <h1 style={{ margin: "0 0 1rem", fontSize: "1.5rem", fontWeight: 600 }}>Settings</h1>
      <form onSubmit={handleSave} style={{ maxWidth: 640, background: "#fff", borderRadius: 8, border: "1px solid var(--admin-border, #e2e8f0)", padding: "1.5rem", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
        <h2 style={{ margin: "0 0 1rem", fontSize: "1.125rem", fontWeight: 600 }}>Refund policy</h2>
        <p style={{ margin: "0 0 0.75rem", fontSize: "0.875rem", color: "#64748b" }}>
          This policy is shown in order history after payment. It applies when customers order products.
        </p>
        <textarea
          value={refundPolicy}
          onChange={(e) => setRefundPolicy(e.target.value)}
          rows={8}
          placeholder="Enter your refund policy..."
          style={{ width: "100%", padding: "0.75rem", border: "1px solid var(--admin-border)", borderRadius: 6, fontSize: "0.9375rem", resize: "vertical", fontFamily: "inherit" }}
        />
        <div style={{ marginTop: "1rem", display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <button
            type="submit"
            disabled={saving}
            style={{ padding: "0.5rem 1.25rem", background: saving ? "#94a3b8" : "var(--admin-accent, #0f172a)", color: "#fff", border: "none", borderRadius: 6, fontWeight: 500, cursor: saving ? "not-allowed" : "pointer" }}
          >
            {saving ? "Saving…" : "Save"}
          </button>
          {message && <span style={{ fontSize: "0.875rem", color: message === "Saved" ? "#22c55e" : "#ef4444" }}>{message}</span>}
        </div>
      </form>
    </div>
  );
}
