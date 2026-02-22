import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getCollectionBySlug } from "../api/client";
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
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <h3 className="mt-2 text-sm font-medium text-gray-900 line-clamp-2">
        {product.title}
      </h3>
      <p className="text-xs text-gray-500 mt-0.5">
        {product.category?.name ?? "—"}
      </p>
      <div className="mt-1 flex flex-wrap items-baseline gap-1">
        <span className="font-semibold text-gray-900">
          ₹{product.price?.toLocaleString("en-IN") ?? "—"}
        </span>
        {product.compareAtPrice != null && (
          <>
            <span className="text-sm text-gray-400 line-through">
              ₹{product.compareAtPrice.toLocaleString("en-IN")}
            </span>
            <span className="text-xs text-green-600">({discount}% Off)</span>
          </>
        )}
      </div>
    </Link>
  );
}

export default function CategoryPage() {
  const { name: slug } = useParams<{ name: string }>();
  const [collection, setCollection] = useState<{ name: string; products: ProductListItem[] } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) {
      setLoading(false);
      return;
    }
    setLoading(true);
    getCollectionBySlug(slug)
      .then((data) => setCollection(data ? { name: data.name, products: data.products } : null))
      .catch(() => setCollection(null))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <main className="max-w-7xl mx-auto px-4 py-12 text-center text-gray-500">
        Loading...
      </main>
    );
  }

  if (!collection) {
    return (
      <main className="max-w-7xl mx-auto px-4 py-12 text-center text-gray-500">
        Collection not found.
      </main>
    );
  }

  return (
    <main className="max-w-7xl mx-auto px-4 md:px-8 py-6">
      <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
        {collection.name}
      </h1>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {collection.products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
      {collection.products.length === 0 && (
        <p className="text-center text-gray-500 py-12">No products in this collection.</p>
      )}
    </main>
  );
}
