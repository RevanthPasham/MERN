import { useSearchParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { getProducts } from "../api/client";
import { PLACEHOLDER_PRODUCT } from "../utils/placeholder";
import type { ProductListItem } from "../types";

function ProductCard({ product }: { product: ProductListItem }) {
  const discount =
    product.compareAtPrice && product.price
      ? Math.round(
          ((product.compareAtPrice - product.price) / product.compareAtPrice) * 100
        )
      : 0;
  return (
    <Link to={`/product/${product.id}`} className="group block text-left">
      <div className="relative aspect-3/4 overflow-hidden bg-gray-100 rounded-lg">
        <img
          src={product.imageUrl || PLACEHOLDER_PRODUCT}
          alt={product.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
        />
      </div>
      <h3 className="mt-2 text-sm font-medium text-gray-900 line-clamp-2">{product.title}</h3>
      <div className="mt-1 flex items-baseline gap-2">
        <span className="font-semibold text-gray-900">₹{product.price?.toLocaleString("en-IN") ?? "—"}</span>
        {product.compareAtPrice != null && (
          <span className="text-sm text-gray-400 line-through">₹{product.compareAtPrice.toLocaleString("en-IN")}</span>
        )}
      </div>
    </Link>
  );
}

export default function SearchPage() {
  const [searchParams] = useSearchParams();
  const q = searchParams.get("q") || "";
  const [products, setProducts] = useState<ProductListItem[]>([]);
  const [loading, setLoading] = useState(!!q);

  useEffect(() => {
    if (!q.trim()) {
      setProducts([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    getProducts(q)
      .then(setProducts)
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, [q]);

  return (
    <main className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        {q ? `Search results for "${q}"` : "Search"}
      </h1>
      {loading && <p className="text-gray-500">Searching...</p>}
      {!loading && q && products.length === 0 && <p className="text-gray-500">No products found.</p>}
      {!loading && products.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </main>
  );
}
