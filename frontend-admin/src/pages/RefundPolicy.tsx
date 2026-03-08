import { useEffect, useState } from "react";
import { getRefundPolicy, updateRefundPolicy, getRefundRequests, updateRefundRequestStatus, type RefundRequestDto } from "../api/client";

const cardStyle: React.CSSProperties = {
  background: "#fff",
  borderRadius: 8,
  border: "1px solid var(--admin-border, #e2e8f0)",
  boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
  padding: "1.5rem",
  marginBottom: "1.5rem",
};
const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "0.75rem",
  border: "1px solid var(--admin-border)",
  borderRadius: 6,
  fontSize: "0.9375rem",
  resize: "vertical",
  fontFamily: "inherit",
};

export default function RefundPolicy() {
  const [refundPolicy, setRefundPolicy] = useState("");
  const [policySaving, setPolicySaving] = useState(false);
  const [policyMessage, setPolicyMessage] = useState("");
  const [requests, setRequests] = useState<RefundRequestDto[]>([]);
  const [loadingRequests, setLoadingRequests] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    getRefundPolicy()
      .then(setRefundPolicy)
      .catch(() => setRefundPolicy(""));
  }, []);

  useEffect(() => {
    setLoadingRequests(true);
    getRefundRequests()
      .then(setRequests)
      .catch(() => setRequests([]))
      .finally(() => setLoadingRequests(false));
  }, []);

  const handleSavePolicy = async (e: React.FormEvent) => {
    e.preventDefault();
    setPolicySaving(true);
    setPolicyMessage("");
    try {
      await updateRefundPolicy(refundPolicy);
      setPolicyMessage("Saved");
      setTimeout(() => setPolicyMessage(""), 2000);
    } catch (err) {
      setPolicyMessage(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setPolicySaving(false);
    }
  };

  const handleStatus = async (id: string, status: "approved" | "rejected") => {
    setUpdatingId(id);
    try {
      await updateRefundRequestStatus(id, status);
      setRequests((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
    } catch {
      // keep list as is
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div>
      <h1 style={{ margin: "0 0 1rem", fontSize: "1.5rem", fontWeight: 600, color: "var(--admin-text, #1e293b)" }}>
        Refund policy
      </h1>

      <div style={cardStyle}>
        <h2 style={{ margin: "0 0 0.75rem", fontSize: "1.125rem", fontWeight: 600 }}>Policy text</h2>
        <p style={{ margin: "0 0 0.75rem", fontSize: "0.875rem", color: "#64748b" }}>
          This is shown to customers in their order history. You can also review and approve/reject refund requests below.
        </p>
        <form onSubmit={handleSavePolicy}>
          <textarea
            value={refundPolicy}
            onChange={(e) => setRefundPolicy(e.target.value)}
            rows={6}
            placeholder="Enter your refund policy..."
            style={inputStyle}
          />
          <div style={{ marginTop: "1rem", display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <button
              type="submit"
              disabled={policySaving}
              style={{
                padding: "0.5rem 1.25rem",
                background: policySaving ? "#94a3b8" : "var(--admin-accent, #0f172a)",
                color: "#fff",
                border: "none",
                borderRadius: 6,
                fontWeight: 500,
                cursor: policySaving ? "not-allowed" : "pointer",
              }}
            >
              {policySaving ? "Saving…" : "Save policy"}
            </button>
            {policyMessage && (
              <span style={{ fontSize: "0.875rem", color: policyMessage === "Saved" ? "#22c55e" : "#ef4444" }}>
                {policyMessage}
              </span>
            )}
          </div>
        </form>
      </div>

      <div style={cardStyle}>
        <h2 style={{ margin: "0 0 1rem", fontSize: "1.125rem", fontWeight: 600 }}>Refund requests</h2>
        {loadingRequests ? (
          <p style={{ color: "#64748b" }}>Loading…</p>
        ) : requests.length === 0 ? (
          <p style={{ color: "#64748b" }}>No refund requests yet.</p>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.875rem" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid var(--admin-border)", textAlign: "left" }}>
                  <th style={{ padding: "0.5rem 0.75rem", color: "#64748b", fontWeight: 600 }}>Order</th>
                  <th style={{ padding: "0.5rem 0.75rem", color: "#64748b", fontWeight: 600 }}>User</th>
                  <th style={{ padding: "0.5rem 0.75rem", color: "#64748b", fontWeight: 600 }}>Products</th>
                  <th style={{ padding: "0.5rem 0.75rem", color: "#64748b", fontWeight: 600 }}>Message</th>
                  <th style={{ padding: "0.5rem 0.75rem", color: "#64748b", fontWeight: 600 }}>Status</th>
                  <th style={{ padding: "0.5rem 0.75rem", color: "#64748b", fontWeight: 600 }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {requests.map((r) => (
                  <tr key={r.id} style={{ borderBottom: "1px solid var(--admin-border)" }}>
                    <td style={{ padding: "0.75rem", verticalAlign: "top" }}>
                      <span style={{ fontWeight: 500 }}>#{r.order_id.slice(0, 8).toUpperCase()}</span>
                      <br />
                      <span style={{ fontSize: "0.8125rem", color: "#64748b" }}>₹{Number(r.order_total ?? 0).toLocaleString()}</span>
                    </td>
                    <td style={{ padding: "0.75rem", verticalAlign: "top" }}>
                      {r.user_email ?? "—"}
                      {r.user_name && <div style={{ fontSize: "0.8125rem", color: "#64748b" }}>{r.user_name}</div>}
                    </td>
                    <td style={{ padding: "0.75rem", verticalAlign: "top", maxWidth: 200 }}>
                      <ul style={{ margin: 0, paddingLeft: "1.25rem" }}>
                        {(r.items ?? []).map((it, i) => (
                          <li key={i}>
                            {it.productName} × {it.quantity} — ₹{Number(it.subtotal).toLocaleString()}
                          </li>
                        ))}
                      </ul>
                    </td>
                    <td style={{ padding: "0.75rem", verticalAlign: "top", maxWidth: 240 }}>
                      <span style={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}>{r.message}</span>
                    </td>
                    <td style={{ padding: "0.75rem", verticalAlign: "top" }}>
                      <span
                        style={{
                          padding: "0.2rem 0.5rem",
                          borderRadius: 4,
                          fontSize: "0.75rem",
                          fontWeight: 500,
                          background: r.status === "approved" ? "#dcfce7" : r.status === "rejected" ? "#fee2e2" : "#fef3c7",
                          color: r.status === "approved" ? "#166534" : r.status === "rejected" ? "#991b1b" : "#92400e",
                        }}
                      >
                        {r.status}
                      </span>
                    </td>
                    <td style={{ padding: "0.75rem", verticalAlign: "top" }}>
                      {r.status === "pending" && (
                        <div style={{ display: "flex", gap: "0.25rem", flexWrap: "wrap" }}>
                          <button
                            type="button"
                            disabled={updatingId === r.id}
                            onClick={() => handleStatus(r.id, "approved")}
                            style={{
                              padding: "0.25rem 0.5rem",
                              fontSize: "0.8125rem",
                              background: "#22c55e",
                              color: "#fff",
                              border: "none",
                              borderRadius: 4,
                              cursor: updatingId === r.id ? "wait" : "pointer",
                            }}
                          >
                            Approve
                          </button>
                          <button
                            type="button"
                            disabled={updatingId === r.id}
                            onClick={() => handleStatus(r.id, "rejected")}
                            style={{
                              padding: "0.25rem 0.5rem",
                              fontSize: "0.8125rem",
                              background: "#ef4444",
                              color: "#fff",
                              border: "none",
                              borderRadius: 4,
                              cursor: updatingId === r.id ? "wait" : "pointer",
                            }}
                          >
                            Reject
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
