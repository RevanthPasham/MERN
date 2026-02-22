import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getProducts } from "../../api/client";
import { PLACEHOLDER_PRODUCT } from "../../utils/placeholder";
import type { ProductListItem } from "../../types";

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

export default function BestSellers() {
  const [products, setProducts] = useState<ProductListItem[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    getProducts()
      .then((p) => {
        setProducts(Array.isArray(p) ? p : []);
      })
      .catch(() => setProducts([]))
      .finally(() => setLoaded(true));
  }, []);

  const list = (Array.isArray(products) ? products : []).slice(0, 8);

  if (!loaded && list.length === 0) {
    return (
      <section className="px-4 md:px-8 py-8 max-w-7xl mx-auto">
        <p className="text-center text-gray-500">Loading...</p>
      </section>
    );
  }
  if (list.length === 0) return null;

  return (
    <section className="px-4 md:px-8 py-8 md:py-10 max-w-7xl mx-auto">
      <h2 className="text-xl md:text-2xl font-bold text-center text-gray-900 mb-6">
        Best Sellers
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {list.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
      <p className="text-center text-sm md:text-base font-medium text-gray-700 mt-6 md:mt-8">
        &ldquo;Wear Your Passion With Pride&rdquo;
      </p>
    </section>
  );
}
