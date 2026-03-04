import { useEffect, useState } from "react";
import {
  getCollections,
  getCollectionProducts,
  setCollectionProducts,
  createCollection,
  updateCollection,
  getProducts,
  type CollectionDto,
  type ProductListItem,
} from "../api/client";

export default function Collections() {
  const [collections, setCollections] = useState<CollectionDto[]>([]);
  const [products, setProducts] = useState<ProductListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [detail, setDetail] = useState<{ collection: CollectionDto; products: { id: string; title: string; slug: string; price: number | null; imageUrl: string | null }[] } | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", slug: "", description: "", isActive: true });
  const [productIds, setProductIds] = useState<string[]>([]);

  const load = () => {
    setLoading(true);
    Promise.all([getCollections(), getProducts()])
      .then(([cols, prods]) => {
        setCollections(cols);
        setProducts(prods);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    if (!selectedId) {
      setDetail(null);
      return;
    }
    getCollectionProducts(selectedId).then(setDetail).catch(() => setDetail(null));
  }, [selectedId]);

  useEffect(() => {
    if (detail) setProductIds(detail.products.map((p) => p.id));
  }, [detail]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.slug.trim()) return;
    try {
      await createCollection({
        name: form.name.trim(),
        slug: form.slug.trim(),
        description: form.description.trim() || undefined,
        isActive: form.isActive,
      });
      setForm({ name: "", slug: "", description: "", isActive: true });
      setShowForm(false);
      load();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed");
    }
  };

  const handleSaveProducts = async () => {
    if (!selectedId) return;
    try {
      await setCollectionProducts(selectedId, productIds);
      getCollectionProducts(selectedId).then(setDetail);
      load();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed");
    }
  };

  const toggleProduct = (id: string) => {
    setProductIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  return (
    <div>
      <h1 style={{ margin: "0 0 1rem" }}>Collections</h1>
      <p style={{ fontSize: "0.875rem", color: "#64748b", marginBottom: "1rem" }}>
        Collections group products. Banners link to a collection by <strong>slug</strong>. Add products to a collection below.
      </p>
      <button
        type="button"
        onClick={() => setShowForm(true)}
        style={{ marginBottom: "1rem", padding: "0.5rem 1rem", background: "#1e293b", color: "#fff", border: "none", borderRadius: 4, cursor: "pointer" }}
      >
        Add collection
      </button>
      {showForm && (
        <form onSubmit={handleCreate} style={{ marginBottom: "1rem", padding: "1rem", background: "#f8fafc", borderRadius: 6, maxWidth: 400 }}>
          <h3 style={{ margin: "0 0 0.5rem" }}>New collection</h3>
          <input placeholder="Name" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} required style={{ width: "100%", marginBottom: "0.5rem", padding: "0.5rem" }} />
          <input placeholder="Slug (e.g. summer-sale)" value={form.slug} onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))} required style={{ width: "100%", marginBottom: "0.5rem", padding: "0.5rem" }} />
          <textarea placeholder="Description" value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} style={{ width: "100%", marginBottom: "0.5rem", padding: "0.5rem" }} />
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
      <div style={{ display: "grid", gridTemplateColumns: "280px 1fr", gap: "1rem" }}>
        <div style={{ background: "#fff", borderRadius: 8, padding: "1rem", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
          <h3 style={{ margin: "0 0 0.5rem" }}>All collections</h3>
          {loading ? (
            <p>Loading...</p>
          ) : (
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              {collections.map((c) => (
                <li key={c.id}>
                  <button
                    type="button"
                    onClick={() => setSelectedId(c.id)}
                    style={{
                      width: "100%",
                      padding: "0.5rem",
                      textAlign: "left",
                      border: "none",
                      background: selectedId === c.id ? "#e2e8f0" : "transparent",
                      borderRadius: 4,
                      cursor: "pointer",
                    }}
                  >
                    {c.name} <span style={{ color: "#64748b", fontSize: "0.875rem" }}>({c.slug})</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div style={{ background: "#fff", borderRadius: 8, padding: "1rem", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
          {detail ? (
            <>
              <h3 style={{ margin: "0 0 0.5rem" }}>{detail.collection.name}</h3>
              <p style={{ fontSize: "0.875rem", color: "#64748b", marginBottom: "1rem" }}>
                Products in this collection (used when customers visit /collections/{detail.collection.slug}). Select products to add/remove:
              </p>
              <div style={{ maxHeight: 300, overflow: "auto", marginBottom: "1rem" }}>
                {products.map((p) => (
                  <label key={p.id} style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.25rem 0", cursor: "pointer" }}>
                    <input type="checkbox" checked={productIds.includes(p.id)} onChange={() => toggleProduct(p.id)} />
                    <span>{p.title}</span>
                    <span style={{ color: "#64748b", fontSize: "0.875rem" }}>({p.slug})</span>
                  </label>
                ))}
              </div>
              <button type="button" onClick={handleSaveProducts} style={{ padding: "0.5rem 1rem", background: "#1e293b", color: "#fff", border: "none", borderRadius: 4, cursor: "pointer" }}>
                Save products for this collection
              </button>
            </>
          ) : (
            <p style={{ color: "#64748b" }}>Select a collection to edit its products.</p>
          )}
        </div>
      </div>
    </div>
  );
}
