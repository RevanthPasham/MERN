import { useEffect, useState } from "react";
import { getBanners, getCollections, createBanner, updateBanner, type BannerDto, type CollectionDto } from "../api/client";

export default function Banners() {
  const [banners, setBanners] = useState<BannerDto[]>([]);
  const [collections, setCollections] = useState<CollectionDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<BannerDto | null>(null);
  const [form, setForm] = useState({
    title: "",
    highlight: "",
    subtitle: "",
    cta: "Shop now",
    collectionSlug: "",
    imageUrl: "",
    sortOrder: 0,
    isActive: true,
  });

  const load = () => {
    setLoading(true);
    Promise.all([getBanners(), getCollections()])
      .then(([b, c]) => {
        setBanners(b);
        setCollections(c);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const openCreate = () => {
    setEditing(null);
    setForm({
      title: "",
      highlight: "",
      subtitle: "",
      cta: "Shop now",
      collectionSlug: collections[0]?.slug ?? "",
      imageUrl: "",
      sortOrder: banners.length,
      isActive: true,
    });
    setShowForm(true);
  };

  const openEdit = (b: BannerDto) => {
    setEditing(b);
    setForm({
      title: b.title,
      highlight: b.highlight,
      subtitle: b.subtitle ?? "",
      cta: b.cta,
      collectionSlug: b.collectionSlug,
      imageUrl: b.imageUrl,
      sortOrder: b.sortOrder,
      isActive: b.isActive,
    });
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.highlight || !form.cta || !form.collectionSlug || !form.imageUrl) {
      alert("Title, highlight, CTA, collection slug, and image URL are required.");
      return;
    }
    try {
      if (editing) {
        await updateBanner(editing.id, form);
      } else {
        await createBanner(form);
      }
      setShowForm(false);
      setEditing(null);
      load();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed");
    }
  };

  return (
    <div>
      <h1 style={{ margin: "0 0 1rem" }}>Banners</h1>
      <p style={{ fontSize: "0.875rem", color: "#64748b", marginBottom: "1rem" }}>
        Banners appear on the homepage. <strong>collectionSlug</strong> must match a collection slug — clicking the banner takes users to that collection.
      </p>
      <button
        type="button"
        onClick={openCreate}
        style={{ marginBottom: "1rem", padding: "0.5rem 1rem", background: "#1e293b", color: "#fff", border: "none", borderRadius: 4, cursor: "pointer" }}
      >
        Add banner
      </button>
      {showForm && (
        <form onSubmit={handleSubmit} style={{ marginBottom: "1rem", padding: "1rem", background: "#f8fafc", borderRadius: 6, maxWidth: 480 }}>
          <h3 style={{ margin: "0 0 0.5rem" }}>{editing ? "Edit banner" : "New banner"}</h3>
          <input placeholder="Title" value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} required style={{ width: "100%", marginBottom: "0.5rem", padding: "0.5rem" }} />
          <input placeholder="Highlight" value={form.highlight} onChange={(e) => setForm((f) => ({ ...f, highlight: e.target.value }))} required style={{ width: "100%", marginBottom: "0.5rem", padding: "0.5rem" }} />
          <input placeholder="Subtitle" value={form.subtitle} onChange={(e) => setForm((f) => ({ ...f, subtitle: e.target.value }))} style={{ width: "100%", marginBottom: "0.5rem", padding: "0.5rem" }} />
          <input placeholder="CTA" value={form.cta} onChange={(e) => setForm((f) => ({ ...f, cta: e.target.value }))} required style={{ width: "100%", marginBottom: "0.5rem", padding: "0.5rem" }} />
          <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.875rem" }}>Collection (slug)</label>
          <select value={form.collectionSlug} onChange={(e) => setForm((f) => ({ ...f, collectionSlug: e.target.value }))} required style={{ width: "100%", marginBottom: "0.5rem", padding: "0.5rem" }}>
            {collections.map((c) => (
              <option key={c.id} value={c.slug}>{c.name} ({c.slug})</option>
            ))}
          </select>
          <input placeholder="Image URL" value={form.imageUrl} onChange={(e) => setForm((f) => ({ ...f, imageUrl: e.target.value }))} required style={{ width: "100%", marginBottom: "0.5rem", padding: "0.5rem" }} />
          <input type="number" placeholder="Sort order" value={form.sortOrder} onChange={(e) => setForm((f) => ({ ...f, sortOrder: Number(e.target.value) || 0 }))} style={{ width: "100%", marginBottom: "0.5rem", padding: "0.5rem" }} />
          <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
            <input type="checkbox" checked={form.isActive} onChange={(e) => setForm((f) => ({ ...f, isActive: e.target.checked }))} />
            Active
          </label>
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <button type="submit" style={{ padding: "0.5rem 1rem", background: "#1e293b", color: "#fff", border: "none", borderRadius: 4, cursor: "pointer" }}>Save</button>
            <button type="button" onClick={() => { setShowForm(false); setEditing(null); }} style={{ padding: "0.5rem 1rem", border: "1px solid #e2e8f0", borderRadius: 4, cursor: "pointer" }}>Cancel</button>
          </div>
        </form>
      )}
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div style={{ background: "#fff", borderRadius: 8, overflow: "hidden", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#f8fafc" }}>
                <th style={{ padding: "0.75rem 1rem", textAlign: "left", borderBottom: "1px solid #e2e8f0" }}>Title / Highlight</th>
                <th style={{ padding: "0.75rem 1rem", textAlign: "left", borderBottom: "1px solid #e2e8f0" }}>Collection</th>
                <th style={{ padding: "0.75rem 1rem", textAlign: "left", borderBottom: "1px solid #e2e8f0" }}>Order</th>
                <th style={{ padding: "0.75rem 1rem", textAlign: "left", borderBottom: "1px solid #e2e8f0" }}>Active</th>
                <th style={{ padding: "0.75rem 1rem", textAlign: "left", borderBottom: "1px solid #e2e8f0" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {banners.map((b) => (
                <tr key={b.id} style={{ borderBottom: "1px solid #e2e8f0" }}>
                  <td style={{ padding: "0.75rem 1rem" }}>{b.title} — {b.highlight}</td>
                  <td style={{ padding: "0.75rem 1rem" }}>{b.collectionSlug}</td>
                  <td style={{ padding: "0.75rem 1rem" }}>{b.sortOrder}</td>
                  <td style={{ padding: "0.75rem 1rem" }}>{b.isActive ? "Yes" : "No"}</td>
                  <td style={{ padding: "0.75rem 1rem" }}>
                    <button type="button" onClick={() => openEdit(b)} style={{ padding: "0.25rem 0.5rem", fontSize: "0.875rem" }}>Edit</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {banners.length === 0 && <p style={{ padding: "2rem", textAlign: "center", color: "#64748b" }}>No banners</p>}
        </div>
      )}
    </div>
  );
}
