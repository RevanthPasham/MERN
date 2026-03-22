import { useState, useEffect, useCallback, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getProducts } from "../../api/client";
import { PLACEHOLDER_PRODUCT_THUMB } from "../../utils/placeholder";
import type { ProductListItem } from "../../types";

const SUGGESTION_TERMS = [
  "hoodie",
  "coding",
  "tshirt",
  "graphic",
  "cotton",
  "Corporate Collection",
  "Coding Collection",
];

const PAGE_LINKS = [
  { label: "Crop Top Size Chart", path: "/pages/size-chart-crop-top" },
  { label: "Crop Tank Size Chart", path: "/pages/size-chart-crop-tank" },
];

interface SearchOverlayProps {
  open: boolean;
  onClose: () => void;
  initialQuery?: string;
  onQueryChange?: (value: string) => void;
}

export default function SearchOverlay({ open, onClose, initialQuery, onQueryChange }: SearchOverlayProps) {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<ProductListItem[]>([]);
  const [popular, setPopular] = useState<ProductListItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const runSearch = useCallback(async (q: string) => {
    if (!q.trim()) {
      setResults([]);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const list = await getProducts(q.trim());
      setResults(list);
    } catch {
      setError("Search unavailable. Please try again.");
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const goToFullResults = useCallback(() => {
    const trimmed = query.trim();
    if (!trimmed) return;
    navigate(`/search?q=${encodeURIComponent(trimmed)}`);
    onClose();
  }, [navigate, onClose, query]);

  useEffect(() => {
    if (open) {
      const seed = (initialQuery ?? "").trim();
      setQuery(seed);
      setResults([]);
      setError(null);
      getProducts()
        .then((list) => setPopular(list.slice(0, 6)))
        .catch(() => setPopular([]));
      if (seed) runSearch(seed);
    }
  }, [open, initialQuery, runSearch]);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!query.trim()) {
      setResults([]);
      setLoading(false);
      setError(null);
      return;
    }
    debounceRef.current = setTimeout(() => runSearch(query), 280);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query, runSearch]);

  useEffect(() => {
    onQueryChange?.(query);
  }, [onQueryChange, query]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!open) return;
      if (e.key === "Escape") onClose();
      if (e.key === "Enter") {
        e.preventDefault();
        goToFullResults();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [goToFullResults, open, onClose]);

  const suggestions = query.trim()
    ? SUGGESTION_TERMS.filter((s) => s.toLowerCase().includes(query.toLowerCase())).slice(0, 6)
    : SUGGESTION_TERMS.slice(0, 6);

  const showProducts = query.trim() ? results : popular;
  const productsLabel = query.trim() ? "Products" : "Popular right now";

  if (!open) return null;

  return (
    <>
      {/* Transparent click-catcher to close when clicking outside */}
      <div
        className="fixed inset-0 z-[60]"
        onClick={onClose}
        aria-hidden="true"
      />
      <div className="fixed left-1/2 top-20 md:top-24 -translate-x-1/2 z-[70] w-full max-w-5xl bg-[#f8f9fa] shadow-xl rounded-2xl border border-gray-200 overflow-hidden max-h-[80vh] flex flex-col">
        <div className="flex items-center justify-end p-2">
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-200 text-gray-600 font-bold text-xl leading-none"
            aria-label="Close search"
          >
            ×
          </button>
        </div>

        {/* Mobile search input since navbar search is desktop-only */}
        <div className="px-4 pb-3 md:hidden">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              goToFullResults();
            }}
          >
            <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-3 py-2 shadow-sm">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search products, collections..."
                className="flex-1 text-sm text-gray-900 outline-none bg-transparent"
                aria-label="Search products"
                autoFocus
                autoComplete="off"
              />
              <button
                type="submit"
                className="px-3 py-1.5 text-sm font-semibold text-white bg-[#1e3a5f] rounded-md"
              >
                Search
              </button>
            </div>
          </form>
        </div>

        <div className="flex-1 overflow-y-auto min-h-[260px] flex flex-col md:flex-row">
          <div className="md:w-1/2 lg:w-2/5 border-b md:border-b-0 md:border-r border-gray-200 bg-white p-4 shrink-0">
            <h3 className="text-xs font-semibold uppercase text-gray-500 mb-2">Suggestions</h3>
            <ul className="space-y-1">
              {suggestions.map((s) => (
                <li key={s}>
                  <button
                    type="button"
                    onClick={() => setQuery(s)}
                    className="text-left text-sm text-gray-800 hover:underline w-full py-0.5"
                  >
                    {s}
                  </button>
                </li>
              ))}
            </ul>
            <h3 className="text-xs font-semibold uppercase text-gray-500 mt-4 mb-2">Pages</h3>
            <ul className="space-y-1">
              {PAGE_LINKS.map(({ label, path }) => (
                <li key={path}>
                  <Link to={path} onClick={onClose} className="text-sm text-gray-800 hover:underline">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="flex-1 p-4 bg-gray-50 min-w-0">
            <h3 className="text-xs font-semibold uppercase text-gray-500 mb-2">{productsLabel}</h3>
            {error && (
              <p className="text-sm text-red-600 mb-2">{error}</p>
            )}
            {loading && <p className="text-sm text-gray-500">Searching...</p>}
            {!loading && !error && showProducts.length === 0 && query.trim() && (
              <p className="text-sm text-gray-500">No products found. Try a different search.</p>
            )}
            {!loading && showProducts.length > 0 && (
              <ul className="space-y-3">
                {showProducts.slice(0, 8).map((p) => (
                  <li key={p.id}>
                    <Link
                      to={`/product/${p.id}`}
                      onClick={onClose}
                      className="flex gap-3 p-2 rounded-lg hover:bg-white transition-colors"
                    >
                      <img
                        src={p.imageUrl || PLACEHOLDER_PRODUCT_THUMB}
                        alt=""
                        className="w-16 h-20 object-cover rounded shrink-0"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-gray-900 truncate">{p.title}</p>
                        <p className="text-xs text-gray-500 truncate">{p.category?.name}</p>
                        <div className="flex items-baseline gap-2 mt-0.5">
                          {p.compareAtPrice != null && (
                            <span className="text-xs text-gray-400 line-through">
                              ₹{p.compareAtPrice.toLocaleString("en-IN")}
                            </span>
                          )}
                          <span className="text-sm font-semibold text-gray-900">
                            ₹{p.price?.toLocaleString("en-IN") ?? "—"}
                          </span>
                        </div>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {query.trim() && (
          <div className="border-t border-gray-200 bg-white p-3">
            <Link
              to={`/search?q=${encodeURIComponent(query)}`}
              onClick={onClose}
              className="inline-flex items-center gap-1 text-sm font-medium text-gray-800 hover:underline"
            >
              View all results for &ldquo;{query}&rdquo;
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
