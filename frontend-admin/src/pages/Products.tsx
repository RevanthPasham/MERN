import { useEffect, useState, Fragment, useRef } from "react";
import {
  getProducts,
  createProduct,
  updateProduct,
  uploadImage,
  deleteImageFromCloudinary,
  getProductImages,
  addProductImage,
  removeProductImage,
  type ProductListItem,
  type ProductImageDto,
} from "../api/client";

const ITEMS_PER_PAGE = 10;

export default function Products() {
  const [products, setProducts] = useState<ProductListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<{ title: string; slug: string; description: string; brand: string; material: string; isActive: boolean; price: number }>>({});
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: "", slug: "", description: "", brand: "", material: "", isActive: true, initialPrice: 0 });
  const [page, setPage] = useState(1);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved">("idle");
  const [productImages, setProductImages] = useState<ProductImageDto[]>([]);
  const [imagesLoading, setImagesLoading] = useState(false);
  const [addingImage, setAddingImage] = useState(false);
  const [removingImageId, setRemovingImageId] = useState<string | null>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

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
        initialPrice: form.initialPrice,
      });
      setForm({ title: "", slug: "", description: "", brand: "", material: "", isActive: true, initialPrice: 0 });
      setShowForm(false);
      load();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed");
    }
  };

  const loadProductImages = (id: string) => {
    setImagesLoading(true);
    getProductImages(id)
      .then(setProductImages)
      .catch(() => setProductImages([]))
      .finally(() => setImagesLoading(false));
  };

  const handleEditStart = (p: ProductListItem) => {
    setEditingId(p.id);
    setEditForm({
      title: p.title,
      slug: p.slug,
      description: p.description ?? "",
      brand: p.brand ?? "",
      material: p.material ?? "",
      isActive: p.isActive,
      price: p.price ?? 0,
    });
    loadProductImages(p.id);
  };

  const handleUpdate = async (id: string, updates: Partial<{ title: string; slug: string; description: string; brand: string; material: string; isActive: boolean; imageUrl: string | null; price: number }>) => {
    setSaveStatus("saving");
    try {
      await updateProduct(id, updates);
      if (updates.imageUrl === undefined) setEditingId(null);
      load();
      setSaveStatus("saved");
      setTimeout(() => setSaveStatus("idle"), 2000);
    } catch (err) {
      setSaveStatus("idle");
      alert(err instanceof Error ? err.message : "Failed");
    }
  };

  const handleAddImage = async (productId: string, file: File) => {
    if (!file.type.startsWith("image/")) return;
    setAddingImage(true);
    try {
      const dataUrl = await new Promise<string>((resolve, reject) => {
        const r = new FileReader();
        r.onload = () => resolve(r.result as string);
        r.onerror = reject;
        r.readAsDataURL(file);
      });
      const url = await uploadImage(dataUrl, "products");
      await addProductImage(productId, url);
      loadProductImages(productId);
      load();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setAddingImage(false);
      if (imageInputRef.current) imageInputRef.current.value = "";
    }
  };

  const handleRemoveImage = async (productId: string, imageId: string, url: string) => {
    setRemovingImageId(imageId);
    try {
      await removeProductImage(productId, imageId);
      if (url?.includes("cloudinary")) await deleteImageFromCloudinary(url).catch(() => {});
      loadProductImages(productId);
      load();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Remove failed");
    } finally {
      setRemovingImageId(null);
    }
  };

  const handleSaveEdit = async () => {
    if (!editingId) return;
    setSaveStatus("saving");
    try {
      await updateProduct(editingId, {
        title: editForm.title,
        slug: editForm.slug,
        description: editForm.description ?? undefined,
        brand: editForm.brand ?? undefined,
        material: editForm.material ?? undefined,
        isActive: editForm.isActive ?? true,
        price: editForm.price,
      });
      setEditingId(null);
      load();
      setSaveStatus("saved");
      setTimeout(() => setSaveStatus("idle"), 2000);
    } catch (err) {
      setSaveStatus("idle");
      alert(err instanceof Error ? err.message : "Failed");
    }
  };

  const totalPages = Math.max(1, Math.ceil(products.length / ITEMS_PER_PAGE));
  const paginatedProducts = products.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const baseInput = {
    width: "100%",
    padding: "0.5rem 0.75rem",
    border: "1px solid var(--admin-border, #e2e8f0)",
    borderRadius: 6,
    fontSize: "0.9375rem",
    fontFamily: "inherit",
  } as React.CSSProperties;

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1rem", flexWrap: "wrap" }}>
        <h1 style={{ margin: 0, fontSize: "1.5rem", fontWeight: 600, color: "var(--admin-text, #1e293b)" }}>Products</h1>
        {saveStatus === "saved" && <span style={{ fontSize: "0.875rem", color: "#22c55e", fontWeight: 500 }}>✓ Saved</span>}
      </div>
      <button
        type="button"
        onClick={() => setShowForm(true)}
        style={{ marginBottom: "1rem", padding: "0.625rem 1.25rem", background: "var(--admin-accent, #0f172a)", color: "#fff", border: "none", borderRadius: 6, cursor: "pointer", fontWeight: 500, fontSize: "0.9375rem" }}
      >
        Add product
      </button>
      {showForm && (
        <form onSubmit={handleCreate} style={{ marginBottom: "1.5rem", padding: "1.5rem", background: "#fff", borderRadius: 8, maxWidth: 480, boxShadow: "0 1px 3px rgba(0,0,0,0.08)", border: "1px solid var(--admin-border, #e2e8f0)" }}>
          <h3 style={{ margin: "0 0 1rem", fontSize: "1.125rem", fontWeight: 600 }}>New product</h3>
          <div style={{ display: "grid", gap: "0.75rem" }}>
            <input placeholder="Title *" value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} required style={baseInput} />
            <input placeholder="Slug *" value={form.slug} onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))} required style={baseInput} />
            <input placeholder="Price (₹)" type="number" min={0} step={0.01} value={form.initialPrice || ""} onChange={(e) => setForm((f) => ({ ...f, initialPrice: parseFloat(e.target.value) || 0 }))} style={baseInput} />
            <textarea placeholder="Description" value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} rows={2} style={{ ...baseInput, resize: "vertical" }} />
            <input placeholder="Brand" value={form.brand} onChange={(e) => setForm((f) => ({ ...f, brand: e.target.value }))} style={baseInput} />
            <input placeholder="Material" value={form.material} onChange={(e) => setForm((f) => ({ ...f, material: e.target.value }))} style={baseInput} />
            <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.9375rem" }}>
              <input type="checkbox" checked={form.isActive} onChange={(e) => setForm((f) => ({ ...f, isActive: e.target.checked }))} />
              Active
            </label>
          </div>
          <div style={{ display: "flex", gap: "0.5rem", marginTop: "1rem" }}>
            <button type="submit" style={{ padding: "0.5rem 1rem", background: "var(--admin-accent, #0f172a)", color: "#fff", border: "none", borderRadius: 6, cursor: "pointer", fontWeight: 500 }}>Save</button>
            <button type="button" onClick={() => setShowForm(false)} style={{ padding: "0.5rem 1rem", border: "1px solid var(--admin-border)", borderRadius: 6, cursor: "pointer", background: "#fff" }}>Cancel</button>
          </div>
        </form>
      )}
      {loading ? (
        <p style={{ color: "var(--admin-muted, #64748b)" }}>Loading...</p>
      ) : (
        <div style={{ background: "#fff", borderRadius: 8, overflow: "hidden", boxShadow: "0 1px 3px rgba(0,0,0,0.08)", border: "1px solid var(--admin-border, #e2e8f0)" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "var(--admin-sidebar, #f8fafc)", borderBottom: "1px solid var(--admin-border)" }}>
                <th style={{ padding: "0.75rem 1rem", textAlign: "left", fontSize: "0.8125rem", fontWeight: 600, color: "var(--admin-muted)" }}>Image</th>
                <th style={{ padding: "0.75rem 1rem", textAlign: "left", fontSize: "0.8125rem", fontWeight: 600, color: "var(--admin-muted)" }}>Product</th>
                <th style={{ padding: "0.75rem 1rem", textAlign: "left", fontSize: "0.8125rem", fontWeight: 600, color: "var(--admin-muted)" }}>Slug</th>
                <th style={{ padding: "0.75rem 1rem", textAlign: "left", fontSize: "0.8125rem", fontWeight: 600, color: "var(--admin-muted)" }}>Price</th>
                <th style={{ padding: "0.75rem 1rem", textAlign: "left", fontSize: "0.8125rem", fontWeight: 600, color: "var(--admin-muted)" }}>Collections</th>
                <th style={{ padding: "0.75rem 1rem", textAlign: "left", fontSize: "0.8125rem", fontWeight: 600, color: "var(--admin-muted)" }}>Active</th>
                <th style={{ padding: "0.75rem 1rem", textAlign: "left", fontSize: "0.8125rem", fontWeight: 600, color: "var(--admin-muted)" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedProducts.map((p) => (
                <Fragment key={p.id}>
                  <tr style={{ borderBottom: "1px solid var(--admin-border)" }}>
                    <td style={{ padding: "0.75rem 1rem", verticalAlign: "top" }}>
                      {editingId === p.id ? (
                        <div style={{ display: "flex", alignItems: "center", gap: 4, flexWrap: "wrap" }}>
                          {imagesLoading ? (
                            <span style={{ fontSize: "0.8125rem", color: "var(--admin-muted)" }}>Loading…</span>
                          ) : productImages.length > 0 ? (
                            productImages.slice(0, 3).map((img) => (
                              <img key={img.id} src={img.url} alt="" style={{ width: 40, height: 40, objectFit: "cover", borderRadius: 4, border: "1px solid var(--admin-border)" }} />
                            ))
                          ) : null}
                          {productImages.length > 3 && <span style={{ fontSize: "0.75rem", color: "var(--admin-muted)" }}>+{productImages.length - 3}</span>}
                          {!imagesLoading && productImages.length === 0 && <span style={{ fontSize: "0.8125rem", color: "var(--admin-muted)" }}>Add below</span>}
                        </div>
                      ) : p.imageUrl ? (
                        <img src={p.imageUrl} alt="" style={{ width: 56, height: 56, objectFit: "cover", borderRadius: 6, border: "1px solid var(--admin-border)" }} />
                      ) : (
                        <span style={{ color: "var(--admin-muted)", fontSize: "0.8125rem" }}>No image</span>
                      )}
                    </td>
                    <td style={{ padding: "0.75rem 1rem", fontWeight: 500 }}>{p.title}</td>
                    <td style={{ padding: "0.75rem 1rem", fontSize: "0.875rem", color: "var(--admin-muted)" }}>{p.slug}</td>
                    <td style={{ padding: "0.75rem 1rem" }}>{p.price != null ? `₹${p.price}` : "—"}</td>
                    <td style={{ padding: "0.75rem 1rem", fontSize: "0.875rem" }}>{p.collectionSlugs?.length ? p.collectionSlugs.join(", ") : "—"}</td>
                    <td style={{ padding: "0.75rem 1rem" }}>{p.isActive ? "Yes" : "No"}</td>
                    <td style={{ padding: "0.75rem 1rem" }}>
                      {editingId === p.id ? (
                        <div style={{ display: "flex", gap: "0.25rem", flexWrap: "wrap", alignItems: "center" }}>
                          <button type="button" onClick={handleSaveEdit} disabled={saveStatus === "saving"} style={{ padding: "0.25rem 0.5rem", fontSize: "0.875rem", background: saveStatus === "saved" ? "#22c55e" : "var(--admin-accent)", color: "#fff", border: "none", borderRadius: 4, cursor: saveStatus === "saving" ? "wait" : "pointer" }}>
                            {saveStatus === "saving" ? "Saving…" : saveStatus === "saved" ? "Saved" : "Save"}
                          </button>
                          <button type="button" onClick={() => setEditingId(null)} disabled={saveStatus === "saving"} style={{ padding: "0.25rem 0.5rem", fontSize: "0.875rem", border: "1px solid var(--admin-border)", borderRadius: 4, cursor: "pointer", background: "#fff" }}>Cancel</button>
                        </div>
                      ) : (
                        <button type="button" onClick={() => handleEditStart(p)} style={{ padding: "0.25rem 0.5rem", fontSize: "0.875rem", border: "1px solid var(--admin-border)", borderRadius: 4, cursor: "pointer", background: "#fff" }}>Edit</button>
                      )}
                    </td>
                  </tr>
                  {editingId === p.id && (
                    <tr key={`${p.id}-edit`}>
                      <td colSpan={7} style={{ padding: "1rem", background: "#f8fafc", borderBottom: "1px solid var(--admin-border)" }}>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "0.75rem", maxWidth: 900 }}>
                          <div>
                            <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 500, color: "var(--admin-muted)", marginBottom: 4 }}>Title</label>
                            <input value={editForm.title ?? ""} onChange={(e) => setEditForm((f) => ({ ...f, title: e.target.value }))} style={baseInput} />
                          </div>
                          <div>
                            <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 500, color: "var(--admin-muted)", marginBottom: 4 }}>Slug</label>
                            <input value={editForm.slug ?? ""} onChange={(e) => setEditForm((f) => ({ ...f, slug: e.target.value }))} style={baseInput} />
                          </div>
                          <div>
                            <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 500, color: "var(--admin-muted)", marginBottom: 4 }}>Price (₹)</label>
                            <input type="number" min={0} step={0.01} value={editForm.price ?? ""} onChange={(e) => setEditForm((f) => ({ ...f, price: parseFloat(e.target.value) || 0 }))} style={baseInput} />
                          </div>
                          <div style={{ gridColumn: "1 / -1" }}>
                            <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 500, color: "var(--admin-muted)", marginBottom: 4 }}>Description</label>
                            <textarea value={editForm.description ?? ""} onChange={(e) => setEditForm((f) => ({ ...f, description: e.target.value }))} rows={2} style={{ ...baseInput, resize: "vertical" }} />
                          </div>
                          <div>
                            <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 500, color: "var(--admin-muted)", marginBottom: 4 }}>Brand</label>
                            <input value={editForm.brand ?? ""} onChange={(e) => setEditForm((f) => ({ ...f, brand: e.target.value }))} style={baseInput} />
                          </div>
                          <div>
                            <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 500, color: "var(--admin-muted)", marginBottom: 4 }}>Material</label>
                            <input value={editForm.material ?? ""} onChange={(e) => setEditForm((f) => ({ ...f, material: e.target.value }))} style={baseInput} />
                          </div>
                          <div style={{ display: "flex", alignItems: "center" }}>
                            <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.875rem" }}>
                              <input type="checkbox" checked={editForm.isActive ?? true} onChange={(e) => setEditForm((f) => ({ ...f, isActive: e.target.checked }))} />
                              Active
                            </label>
                          </div>
                          <div style={{ gridColumn: "1 / -1" }}>
                            <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 500, color: "var(--admin-muted)", marginBottom: 6 }}>Product images</label>
                            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem", alignItems: "flex-start" }}>
                              {imagesLoading ? (
                                <span style={{ fontSize: "0.875rem", color: "var(--admin-muted)" }}>Loading images…</span>
                              ) : (
                                <>
                                  {productImages.map((img) => (
                                    <div key={img.id} style={{ position: "relative", flexShrink: 0 }}>
                                      <img src={img.url} alt="" style={{ width: 80, height: 80, objectFit: "cover", borderRadius: 6, border: "1px solid var(--admin-border)" }} />
                                      <button
                                        type="button"
                                        disabled={removingImageId === img.id}
                                        onClick={() => handleRemoveImage(p.id, img.id, img.url)}
                                        style={{
                                          position: "absolute",
                                          top: 4,
                                          right: 4,
                                          width: 22,
                                          height: 22,
                                          borderRadius: 4,
                                          border: "none",
                                          background: "rgba(0,0,0,0.6)",
                                          color: "#fff",
                                          fontSize: "0.75rem",
                                          cursor: removingImageId === img.id ? "wait" : "pointer",
                                          lineHeight: 1,
                                          padding: 0,
                                        }}
                                        title="Remove image"
                                      >
                                        ×
                                      </button>
                                    </div>
                                  ))}
                                  <label style={{ width: 80, height: 80, display: "flex", alignItems: "center", justifyContent: "center", border: "1px dashed var(--admin-border)", borderRadius: 6, cursor: addingImage ? "wait" : "pointer", background: "#fff", fontSize: "0.8125rem", color: "var(--admin-muted)" }}>
                                    <input
                                      ref={imageInputRef}
                                      type="file"
                                      accept="image/*"
                                      disabled={addingImage}
                                      style={{ display: "none" }}
                                      onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (file) handleAddImage(p.id, file);
                                      }}
                                    />
                                    {addingImage ? "Uploading…" : "+ Add image"}
                                  </label>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </Fragment>
              ))}
            </tbody>
          </table>
          {products.length === 0 && <p style={{ padding: "2rem", textAlign: "center", color: "var(--admin-muted)" }}>No products</p>}
          {products.length > ITEMS_PER_PAGE && (
            <div style={{ padding: "1rem", borderTop: "1px solid var(--admin-border)", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "0.5rem" }}>
              <span style={{ fontSize: "0.875rem", color: "var(--admin-muted)" }}>
                Page {page} of {totalPages} ({products.length} products)
              </span>
              <div style={{ display: "flex", gap: "0.25rem" }}>
                <button
                  type="button"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page <= 1}
                  style={{ padding: "0.375rem 0.75rem", fontSize: "0.875rem", border: "1px solid var(--admin-border)", borderRadius: 6, cursor: page <= 1 ? "not-allowed" : "pointer", background: "#fff", opacity: page <= 1 ? 0.6 : 1 }}
                >
                  Previous
                </button>
                <button
                  type="button"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page >= totalPages}
                  style={{ padding: "0.375rem 0.75rem", fontSize: "0.875rem", border: "1px solid var(--admin-border)", borderRadius: 6, cursor: page >= totalPages ? "not-allowed" : "pointer", background: "#fff", opacity: page >= totalPages ? 0.6 : 1 }}
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
