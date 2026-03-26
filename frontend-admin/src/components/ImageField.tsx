import { useRef, useState } from "react";

interface ImageFieldProps {
  currentUrl: string | null;
  onUpload: (dataUri: string) => Promise<string>;
  onRemove: () => Promise<void>;
  onSaveUrl: (url: string) => Promise<void>;
  label?: string;
  folder?: string;
}

export default function ImageField({ currentUrl, onUpload, onRemove, onSaveUrl, label = "Image", folder = "houseof" }: ImageFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [removing, setRemoving] = useState(false);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith("image/")) return;
    setUploading(true);
    try {
      const dataUrl = await new Promise<string>((resolve, reject) => {
        const r = new FileReader();
        r.onload = () => resolve(r.result as string);
        r.onerror = reject;
        r.readAsDataURL(file);
      });
      const url = await onUpload(dataUrl);
      await onSaveUrl(url);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const handleRemove = async () => {
    if (!currentUrl) return;
    setRemoving(true);
    try {
      await onRemove();
      await onSaveUrl("");
    } catch (err) {
      alert(err instanceof Error ? err.message : "Remove failed");
    } finally {
      setRemoving(false);
    }
  };

  return (
    <div style={{ marginBottom: "1rem" }}>
      <div style={{ fontSize: "0.875rem", fontWeight: 500, marginBottom: "0.375rem" }}>{label}</div>
      {currentUrl ? (
        <div style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem", flexWrap: "wrap" }}>
          <img
            src={currentUrl}
            alt=""
            style={{ width: 120, height: 120, objectFit: "cover", borderRadius: 8, border: "1px solid var(--admin-border)" }}
          />
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              onChange={handleFile}
              disabled={uploading}
              style={{ fontSize: "0.8125rem" }}
            />
            <button type="button" onClick={handleRemove} disabled={removing} style={{ fontSize: "0.8125rem", padding: "0.25rem 0.5rem", cursor: removing ? "wait" : "pointer" }}>
              {removing ? "Removing…" : "Remove image"}
            </button>
          </div>
        </div>
      ) : (
        <div>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            onChange={handleFile}
            disabled={uploading}
            style={{ fontSize: "0.8125rem" }}
          />
          {uploading && <span style={{ marginLeft: "0.5rem", fontSize: "0.875rem", color: "var(--admin-muted)" }}>Uploading…</span>}
        </div>
      )}
    </div>
  );
}
