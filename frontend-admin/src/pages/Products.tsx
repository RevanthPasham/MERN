import { useEffect, useState } from "react";
import { getProducts, createProduct, updateProduct, type ProductListItem } from "../api/client";

export default function Products() {
  const [products, setProducts] = useState<ProductListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: "", slug: "", description: "", brand: "", material: "", isActive: true });

  const load = () => {
    setLoading(true);
    getProducts().then(setProducts).catch(() => setProducts([])).finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.slug.trim()) return;
    try {
      await createProduct({
        title: form.title.trim(),
        slug: form.slug.trim(),
        description: form.description.trim() || undefined,
        brand: form.brand.trim() || undefined,
        material: form.material.trim() || undefined,
        isActive: form.isActive,
      });
      setForm({ title: "", slug: "", description: "", brand: "", material: "", isActive: true });
      setShowForm(false);
      load();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed");
    }
  };

  const handleUpdate = async (id: string, updates: Partial<{ title: string; slug: string; description: string; isActive: boolean }>) => {
    try {
      await updateProduct(id, updates);
      setEditingId(null);
      load();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed");
    }
  };

  return (
    <div>
      <h1 style={{ margin: "0 0 1rem" }}>Products</h1>
      <button
        type="button"
        onClick={() => setShowForm(true)}
        style={{ marginBottom: "1rem", padding: "0.5rem 1rem", background: "#1e293b", color: "#fff", border: "none", borderRadius: 4, cursor: "pointer" }}
      >
        Add product
      </button>
      {showForm && (
        <form onSubmit={handleCreate} style={{ marginBottom: "1rem", padding: "1rem", background: "#f8fafc", borderRadius: 6, maxWidth: 400 }}>
          <h3 style={{ margin: "0 0 0.5rem" }}>New product</h3>
          <input placeholder="Title" value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} required style={{ width: "100%", marginBottom: "0.5rem", padding: "0.5rem" }} />
          <input placeholder="Slug" value={form.slug} onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))} required style={{ width: "100%", marginBottom: "0.5rem", padding: "0.5rem" }} />
          <textarea placeholder="Description" value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} style={{ width: "100%", marginBottom: "0.5rem", padding: "0.5rem" }} />
          <input placeholder="Brand" value={form.brand} onChange={(e) => setForm((f) => ({ ...f, brand: e.target.value }))} style={{ width: "100%", marginBottom: "0.5rem", padding: "0.5rem" }} />
          <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
            <input type="checkbox" checked={form.isActive} onChange={(e) => setForm((f) => ({ ...f, isActive: e.target.checked }))} />
            Active
          </label>
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <button type="submit" style={{ padding: "0.5rem 1rem", background: "#1e293b", color: "#fff", border: "none", borderRadius: 4, cursor: "pointer" }}>Save</button>
            <button type="button" onClick={() => setShowForm(false)} style={{ padding: "0.5rem 1rem", border: "1px solid #e2e8f0", borderRadius: 4, cursor: "pointer" }}>Cancel</button>
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
                <th style={{ padding: "0.75rem 1rem", textAlign: "left", borderBottom: "1px solid #e2e8f0" }}>Product</th>
                <th style={{ padding: "0.75rem 1rem", textAlign: "left", borderBottom: "1px solid #e2e8f0" }}>Slug</th>
                <th style={{ padding: "0.75rem 1rem", textAlign: "left", borderBottom: "1px solid #e2e8f0" }}>Price</th>
                <th style={{ padding: "0.75rem 1rem", textAlign: "left", borderBottom: "1px solid #e2e8f0" }}>Collections</th>
                <th style={{ padding: "0.75rem 1rem", textAlign: "left", borderBottom: "1px solid #e2e8f0" }}>Active</th>
                <th style={{ padding: "0.75rem 1rem", textAlign: "left", borderBottom: "1px solid #e2e8f0" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id} style={{ borderBottom: "1px solid #e2e8f0" }}>
                  <td style={{ padding: "0.75rem 1rem" }}>{p.title}</td>
                  <td style={{ padding: "0.75rem 1rem" }}>{p.slug}</td>
                  <td style={{ padding: "0.75rem 1rem" }}>{p.price != null ? `₹${p.price}` : "—"}</td>
                  <td style={{ padding: "0.75rem 1rem", fontSize: "0.875rem" }}>{p.collectionSlugs?.length ? p.collectionSlugs.join(", ") : "—"}</td>
                  <td style={{ padding: "0.75rem 1rem" }}>{p.isActive ? "Yes" : "No"}</td>
                  <td style={{ padding: "0.75rem 1rem" }}>
                    {editingId === p.id ? (
                      <div style={{ display: "flex", gap: "0.25rem", flexWrap: "wrap" }}>
                        <button type="button" onClick={() => handleUpdate(p.id, { isActive: !p.isActive })} style={{ padding: "0.25rem 0.5rem", fontSize: "0.875rem" }}>Toggle active</button>
                        <button type="button" onClick={() => setEditingId(null)} style={{ padding: "0.25rem 0.5rem", fontSize: "0.875rem" }}>Done</button>
                      </div>
                    ) : (
                      <button type="button" onClick={() => setEditingId(p.id)} style={{ padding: "0.25rem 0.5rem", fontSize: "0.875rem" }}>Edit</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {products.length === 0 && <p style={{ padding: "2rem", textAlign: "center", color: "#64748b" }}>No products</p>}
        </div>
      )}
    </div>
  );
}
