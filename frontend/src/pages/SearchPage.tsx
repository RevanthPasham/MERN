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
    <Link to={`/product/${product.id}`} className="group block text-left hover:shadow-md transition-shadow rounded-xl overflow-hidden">
      <div className="relative aspect-3/4 overflow-hidden bg-gray-100 rounded-xl">
        <img
          src={product.imageUrl || PLACEHOLDER_PRODUCT}
          alt={product.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
        />
        {discount > 0 && (
          <span className="absolute top-2 left-2 bg-[#1e3a5f] text-white text-xs font-semibold px-2 py-0.5 rounded-full">
            {discount}% OFF
          </span>
        )}
      </div>
      <div className="pt-2 px-0.5 pb-1">
        <h3 className="mt-2 text-sm font-medium text-gray-900 line-clamp-2">{product.title}</h3>
        <div className="mt-1 flex items-baseline gap-2">
          <span className="font-semibold text-gray-900">₹{product.price?.toLocaleString("en-IN") ?? "\u2014"}</span>
          {product.compareAtPrice != null && (
            <span className="text-sm text-gray-400 line-through">₹{product.compareAtPrice.toLocaleString("en-IN")}</span>
          )}
        </div>
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
      {q ? (
        <>
          <div className="border-b border-gray-200 pb-4 mb-6">
            <h1 className="text-2xl font-bold text-gray-900">
              Search results for &ldquo;{q}&rdquo;
            </h1>
          </div>
          {loading && <p className="text-gray-500">Searching...</p>}
          {!loading && products.length === 0 && (
            <p className="text-gray-500">No products found.</p>
          )}
          {!loading && products.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {products.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </>
      ) : (
        <div className="py-16 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-3">Search</h1>
          <p className="text-gray-400">Enter a search term to find products.</p>
        </div>
      )}
    </main>
  );
}
