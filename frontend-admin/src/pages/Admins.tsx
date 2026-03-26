import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAdmins, removeAdmin, type AdminListItem } from "../api/client";
import { useAuth } from "../context/AuthContext";

const cardStyle: React.CSSProperties = {
  background: "#fff",
  borderRadius: 8,
  border: "1px solid var(--admin-border, #e2e8f0)",
  boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
  padding: "1.5rem",
  marginBottom: "1.5rem",
};

export default function Admins() {
  const { admin } = useAuth();
  const [list, setList] = useState<AdminListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [removingId, setRemovingId] = useState<string | null>(null);

  const isSuperAdmin = admin?.role === "super_admin";

  const load = () => {
    setLoading(true);
    getAdmins()
      .then(setList)
      .catch(() => setList([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (isSuperAdmin) load();
  }, [isSuperAdmin]);

  const handleRemove = async (id: string) => {
    if (!confirm("Remove this admin? They will no longer be able to log in.")) return;
    setRemovingId(id);
    try {
      await removeAdmin(id);
      setList((prev) => prev.filter((a) => a.id !== id));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to remove");
    } finally {
      setRemovingId(null);
    }
  };

  if (!isSuperAdmin) {
    return (
      <div>
        <h1 style={{ margin: "0 0 1rem", fontSize: "1.5rem", fontWeight: 600 }}>Admins</h1>
        <p style={{ color: "#ef4444" }}>Only Super Admin can view and manage admins.</p>
      </div>
    );
  }

  return (
    <div>
      <h1 style={{ margin: "0 0 1rem", fontSize: "1.5rem", fontWeight: 600, color: "var(--admin-text, #1e293b)" }}>
        Admins
      </h1>
      <p style={{ margin: "0 0 1rem", fontSize: "0.9375rem", color: "#64748b" }}>
        Manage admin accounts. Invite new admins from the <Link to="/invite" style={{ color: "var(--admin-accent)", fontWeight: 500 }}>Invite</Link> page (you can choose role: Super admin, Sub admin, or Admin).
      </p>

      <div style={cardStyle}>
        {loading ? (
          <p style={{ color: "#64748b" }}>Loading…</p>
        ) : list.length === 0 ? (
          <p style={{ color: "#64748b" }}>No admins.</p>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.9375rem" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid var(--admin-border)", textAlign: "left" }}>
                <th style={{ padding: "0.5rem 0.75rem", color: "#64748b", fontWeight: 600 }}>Email</th>
                <th style={{ padding: "0.5rem 0.75rem", color: "#64748b", fontWeight: 600 }}>Name</th>
                <th style={{ padding: "0.5rem 0.75rem", color: "#64748b", fontWeight: 600 }}>Role</th>
                <th style={{ padding: "0.5rem 0.75rem", color: "#64748b", fontWeight: 600 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {list.map((a) => (
                <tr key={a.id} style={{ borderBottom: "1px solid var(--admin-border)" }}>
                  <td style={{ padding: "0.75rem" }}>{a.email}</td>
                  <td style={{ padding: "0.75rem", color: "#64748b" }}>{a.name || "—"}</td>
                  <td style={{ padding: "0.75rem" }}>
                    <span style={{ textTransform: "capitalize" }}>{a.role.replace("_", " ")}</span>
                  </td>
                  <td style={{ padding: "0.75rem" }}>
                    {a.id !== admin?.id ? (
                      <button
                        type="button"
                        disabled={removingId === a.id}
                        onClick={() => handleRemove(a.id)}
                        style={{
                          padding: "0.25rem 0.5rem",
                          fontSize: "0.8125rem",
                          background: "#fee2e2",
                          color: "#b91c1c",
                          border: "none",
                          borderRadius: 4,
                          cursor: removingId === a.id ? "wait" : "pointer",
                        }}
                      >
                        {removingId === a.id ? "Removing…" : "Remove"}
                      </button>
                    ) : (
                      <span style={{ fontSize: "0.8125rem", color: "#64748b" }}>You</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
