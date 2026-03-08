import { useEffect, useState } from "react";
import { getSizeCharts, upsertSizeChart, type SizeChartDto } from "../api/client";

export default function SizeCharts() {
  const [list, setList] = useState<SizeChartDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState("");
  const [description, setDescription] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  useEffect(() => {
    setLoading(true);
    getSizeCharts()
      .then(setList)
      .catch(() => setList([]))
      .finally(() => setLoading(false));
  }, []);

  const openEdit = (row: SizeChartDto) => {
    setEditingId(row.categoryId);
    setImageUrl(row.imageUrl ?? "");
    setDescription(row.description ?? "");
    setMessage(null);
  };

  const closeEdit = () => {
    setEditingId(null);
    setImageUrl("");
    setDescription("");
  };

  const handleSave = async () => {
    if (!editingId) return;
    setSaving(true);
    setMessage(null);
    try {
      await upsertSizeChart(editingId, {
        imageUrl: imageUrl.trim() || null,
        description: description.trim() || null,
      });
      const updated = await getSizeCharts();
      setList(updated);
      setMessage({ type: "ok", text: "Size chart updated." });
      setTimeout(() => { setMessage(null); closeEdit(); }, 1500);
    } catch (e) {
      setMessage({ type: "err", text: e instanceof Error ? e.message : "Failed to save" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <h1 style={{ margin: "0 0 1rem", fontSize: "1.5rem", fontWeight: 700 }}>Size charts</h1>
      <p style={{ margin: "0 0 1.25rem", color: "#64748b", fontSize: "0.9375rem" }}>
        Set an image and description per category. Shoppers see this when choosing sizes.
      </p>
      {loading ? (
        <p style={{ color: "#64748b" }}>Loading...</p>
      ) : (
        <div style={{ background: "#fff", borderRadius: 8, overflow: "hidden", boxShadow: "0 1px 3px rgba(0,0,0,0.08)", border: "1px solid #e2e8f0" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#f8fafc", textAlign: "left" }}>
                <th style={{ padding: "0.75rem 1rem", borderBottom: "1px solid #e2e8f0" }}>Category</th>
                <th style={{ padding: "0.75rem 1rem", borderBottom: "1px solid #e2e8f0" }}>Image / Description</th>
                <th style={{ padding: "0.75rem 1rem", borderBottom: "1px solid #e2e8f0", width: 120 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {list.map((row) => (
                <tr key={row.categoryId} style={{ borderBottom: "1px solid #e2e8f0" }}>
                  <td style={{ padding: "0.75rem 1rem" }}>
                    <div style={{ fontWeight: 600 }}>{row.categoryName}</div>
                    <div style={{ fontSize: "0.8125rem", color: "#64748b" }}>{row.categorySlug}</div>
                  </td>
                  <td style={{ padding: "0.75rem 1rem" }}>
                    {row.imageUrl && (
                      <div style={{ marginBottom: 4 }}>
                        <img src={row.imageUrl} alt="" style={{ maxWidth: 120, maxHeight: 80, objectFit: "contain", borderRadius: 4 }} />
                      </div>
                    )}
                    <div style={{ fontSize: "0.875rem", color: "#475569" }}>
                      {row.description ? (row.description.length > 80 ? row.description.slice(0, 80) + "…" : row.description) : "—"}
                    </div>
                  </td>
                  <td style={{ padding: "0.75rem 1rem" }}>
                    <button
                      type="button"
                      onClick={() => openEdit(row)}
                      style={{
                        padding: "0.375rem 0.75rem",
                        background: "#1e293b",
                        color: "#fff",
                        border: "none",
                        borderRadius: 6,
                        cursor: "pointer",
                        fontSize: "0.8125rem",
                        fontWeight: 500,
                      }}
                    >
                      {row.id ? "Update" : "Add"} size chart
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {list.length === 0 && <p style={{ padding: "2rem", textAlign: "center", color: "#64748b" }}>No categories found. Add categories first.</p>}
        </div>
      )}

      {editingId && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 50,
            padding: 24,
          }}
          onClick={closeEdit}
        >
          <div
            style={{
              background: "#fff",
              borderRadius: 12,
              boxShadow: "0 20px 40px rgba(0,0,0,0.15)",
              maxWidth: 480,
              width: "100%",
              padding: "1.5rem",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 style={{ margin: "0 0 1rem", fontSize: "1.25rem", fontWeight: 600 }}>Edit size chart</h2>
            {message && (
              <p style={{ margin: "0 0 0.75rem", color: message.type === "err" ? "#dc2626" : "#16a34a", fontSize: "0.875rem" }}>
                {message.text}
              </p>
            )}
            <label style={{ display: "block", marginBottom: 4, fontSize: "0.875rem", fontWeight: 500 }}>Image URL</label>
            <input
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://..."
              style={{
                width: "100%",
                padding: "0.5rem 0.75rem",
                marginBottom: "1rem",
                border: "1px solid #e2e8f0",
                borderRadius: 6,
                fontSize: "0.9375rem",
              }}
            />
            <label style={{ display: "block", marginBottom: 4, fontSize: "0.875rem", fontWeight: 500 }}>Description (e.g. how to measure)</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Optional text or size guide..."
              rows={4}
              style={{
                width: "100%",
                padding: "0.5rem 0.75rem",
                marginBottom: "1rem",
                border: "1px solid #e2e8f0",
                borderRadius: 6,
                fontSize: "0.9375rem",
                resize: "vertical",
              }}
            />
            <div style={{ display: "flex", gap: "0.5rem", justifyContent: "flex-end" }}>
              <button type="button" onClick={closeEdit} disabled={saving} style={{ padding: "0.5rem 1rem", border: "1px solid #e2e8f0", borderRadius: 6, background: "#fff", cursor: "pointer" }}>
                Cancel
              </button>
              <button type="button" onClick={handleSave} disabled={saving} style={{ padding: "0.5rem 1rem", background: "#1e293b", color: "#fff", border: "none", borderRadius: 6, cursor: "pointer", fontWeight: 500 }}>
                {saving ? "Saving…" : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
