import { useState, useEffect, useRef } from "react";
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
    <Link
      to={`/product/${product.id}`}
      className="group flex flex-col bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
    >
      {/* Image */}
      <div className="relative aspect-[3/4] overflow-hidden bg-gray-50 flex-shrink-0">
        <img
          src={product.imageUrl || PLACEHOLDER_PRODUCT}
          alt={product.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* Discount badge — top-left */}
        {discount > 0 && (
          <span className="absolute top-3 left-3 bg-[#1e3a5f] text-white text-[10px] font-bold px-2 py-0.5 rounded-full tracking-wide shadow-sm">
            {discount}% OFF
          </span>
        )}

        {/* Best seller tag — top-right */}
        <span className="absolute top-3 right-3 bg-[#f97316] text-white text-[10px] font-bold px-2 py-0.5 rounded-full tracking-wide shadow-sm">
          ★ Top Pick
        </span>
      </div>

      {/* Info */}
      <div className="flex flex-col flex-1 p-3 md:p-4">
        {/* Category */}
        <p className="text-[10px] md:text-xs font-semibold uppercase tracking-widest text-[#1e3a5f]/60 mb-1">
          {product.category?.name ?? "Clothing"}
        </p>

        {/* Title */}
        <h3 className="text-xs md:text-sm font-semibold text-gray-900 line-clamp-2 leading-snug flex-1">
          {product.title}
        </h3>

        {/* Divider */}
        <div className="my-2.5 h-px bg-gray-100" />

        {/* Pricing row */}
        <div className="flex flex-wrap items-baseline gap-x-1.5 gap-y-0.5">
          <span className="text-base md:text-lg font-extrabold text-gray-900">
            ₹{product.price?.toLocaleString("en-IN") ?? "—"}
          </span>
          {product.compareAtPrice != null && (
            <span className="text-xs text-gray-400 line-through">
              ₹{product.compareAtPrice.toLocaleString("en-IN")}
            </span>
          )}
          {discount > 0 && (
            <span className="text-[10px] md:text-xs font-bold text-green-600">
              ({discount}% off)
            </span>
          )}
        </div>

        {/* Best price label */}
        {product.price != null && (
          <p className="mt-1.5 text-[10px] md:text-xs font-semibold text-green-600 flex items-center gap-1">
            <svg className="w-3 h-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            Best Price ₹{product.price.toLocaleString("en-IN")}
          </p>
        )}
      </div>
    </Link>
  );
}

// Skeleton placeholder while loading
function SkeletonCard() {
  return (
    <div className="flex flex-col bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 animate-pulse">
      <div className="aspect-[3/4] bg-gray-200" />
      <div className="p-3 md:p-4 space-y-2">
        <div className="h-2.5 bg-gray-200 rounded w-1/2" />
        <div className="h-3 bg-gray-200 rounded w-full" />
        <div className="h-3 bg-gray-200 rounded w-4/5" />
        <div className="h-px bg-gray-100 my-2" />
        <div className="h-4 bg-gray-200 rounded w-1/3" />
        <div className="h-2.5 bg-gray-200 rounded w-2/3" />
      </div>
    </div>
  );
}

export default function BestSellers() {
  const [products, setProducts] = useState<ProductListItem[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const rowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    getProducts()
      .then((p) => setProducts(Array.isArray(p) ? p : []))
      .catch(() => setProducts([]))
      .finally(() => setLoaded(true));
  }, []);

  const updateArrows = () => {
    const el = rowRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 8);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 8);
  };

  const scroll = (dir: "left" | "right") => {
    const el = rowRef.current;
    if (!el) return;
    el.scrollBy({ left: dir === "left" ? -320 : 320, behavior: "smooth" });
  };

  const list = (Array.isArray(products) ? products : []).slice(0, 8);

  return (
    <section className="py-8 md:py-12 bg-gray-50">
      <div className="px-4 md:px-8 max-w-7xl mx-auto">

        {/* ── Section header ── */}
        <div className="flex items-end justify-between mb-6 md:mb-8">
          <div>
            <p className="text-xs font-bold tracking-widest uppercase text-[#f97316] mb-1">
              Trending Now
            </p>
            <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 leading-tight">
              Best Sellers
            </h2>
            <div className="mt-2 flex items-center gap-1.5">
              <span className="h-1 w-8 bg-[#1e3a5f] rounded-full block" />
              <span className="h-1 w-3 bg-[#f97316] rounded-full block" />
            </div>
          </div>

          <Link
            to="/search"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#1e3a5f] hover:text-[#f97316] transition-colors group"
          >
            View All
            <svg
              className="w-4 h-4 group-hover:translate-x-0.5 transition-transform"
              fill="none" stroke="currentColor" viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        {/* ── Scrollable row + arrow buttons ── */}
        <div className="relative">

          {/* Left arrow */}
          <button
            type="button"
            onClick={() => scroll("left")}
            aria-label="Scroll left"
            className={`hidden md:flex absolute -left-4 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-white border border-gray-200 shadow-md items-center justify-center hover:shadow-lg transition-all ${
              canScrollLeft ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
          >
            <svg className="w-4 h-4 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Right arrow */}
          <button
            type="button"
            onClick={() => scroll("right")}
            aria-label="Scroll right"
            className={`hidden md:flex absolute -right-4 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-white border border-gray-200 shadow-md items-center justify-center hover:shadow-lg transition-all ${
              canScrollRight ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
          >
            <svg className="w-4 h-4 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Skeleton row */}
          {!loaded && (
            <div className="flex gap-4 overflow-x-auto pb-3 snap-x snap-mandatory scrollbar-none [-webkit-overflow-scrolling:touch]">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="snap-start flex-shrink-0 w-44 md:w-52">
                  <SkeletonCard />
                </div>
              ))}
            </div>
          )}

          {/* Product row */}
          {loaded && list.length > 0 && (
            <div
              ref={rowRef}
              onScroll={updateArrows}
              className="flex gap-4 overflow-x-auto pb-3 snap-x snap-mandatory scrollbar-none [-webkit-overflow-scrolling:touch]"
            >
              {list.map((product) => (
                <div key={product.id} className="snap-start flex-shrink-0 w-44 md:w-52">
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── Tagline ── */}
        {loaded && list.length > 0 && (
          <p className="mt-8 text-center text-sm text-gray-400 italic font-medium tracking-wide">
            &ldquo;Wear Your Passion With Pride&rdquo;
          </p>
        )}
      </div>
    </section>
  );
}
