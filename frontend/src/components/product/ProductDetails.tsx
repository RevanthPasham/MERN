import { useParams, useNavigate, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { getProductById, getRelatedProducts, getProductReviews, getCanReview, addProductReview } from "../../api/client";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import { PLACEHOLDER_PRODUCT, PLACEHOLDER_PRODUCT_LARGE } from "../../utils/placeholder";
import type { ProductDetail, ProductListItem, ProductReviewsResponse } from "../../types";

function RelatedCard({ product }: { product: ProductListItem }) {
  return (
    <Link to={`/product/${product.id}`} className="group block text-left">
      <div className="aspect-3/4 overflow-hidden bg-gray-100 rounded-lg">
        <img
          src={product.imageUrl || PLACEHOLDER_PRODUCT}
          alt={product.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <h3 className="mt-2 text-sm font-medium text-gray-900 line-clamp-2">{product.title}</h3>
      <p className="text-sm font-semibold text-gray-900 mt-0.5">
        ₹{product.price?.toLocaleString("en-IN") ?? "—"}
      </p>
    </Link>
  );
}

export default function ProductDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const { user } = useAuth();
  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [related, setRelated] = useState<ProductListItem[]>([]);
  const [reviewsData, setReviewsData] = useState<ProductReviewsResponse | null>(null);
  const [canReview, setCanReview] = useState(false);
  const [loading, setLoading] = useState(true);
  const [imageIndex, setImageIndex] = useState(0);
  const [size, setSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: "" });
  const [submittingReview, setSubmittingReview] = useState(false);
  const [sizeChartOpen, setSizeChartOpen] = useState(false);
  const [returnPolicyOpen, setReturnPolicyOpen] = useState(false);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }
    setLoading(true);
    getProductById(id)
      .then(setProduct)
      .catch(() => setProduct(null))
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (!id) return;
    getRelatedProducts(id).then(setRelated).catch(() => setRelated([]));
    getProductReviews(id).then(setReviewsData).catch(() => setReviewsData(null));
    getCanReview(id).then(setCanReview).catch(() => setCanReview(false));
  }, [id]);

  const handleSubmitReview = async () => {
    if (!id) return;
    setSubmittingReview(true);
    try {
      await addProductReview(id, {
        rating: reviewForm.rating,
        comment: reviewForm.comment.trim() || undefined,
        userName: user?.name ?? undefined,
      });
      setReviewForm({ rating: 5, comment: "" });
      const next = await getProductReviews(id);
      setReviewsData(next ?? null);
    } catch (err: unknown) {
      const d = err && typeof err === "object" && "response" in err ? (err as any).response?.data : undefined;
      const msg = d?.message ?? d?.error;
      alert(msg || "Only customers who have purchased this product can leave a review.");
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <main className="max-w-7xl mx-auto px-4 py-12 text-center text-gray-500">
        Loading...
      </main>
    );
  }

  if (!product) {
    return (
      <main className="max-w-7xl mx-auto px-4 py-12 text-center">
        <p className="text-gray-500">Product not found.</p>
        <button
          type="button"
          onClick={() => navigate("/")}
          className="mt-4 text-blue-600 underline"
        >
          Back to home
        </button>
      </main>
    );
  }

  const discount =
    product.compareAtPrice && product.price
      ? Math.round(
          ((product.compareAtPrice - product.price) / product.compareAtPrice) * 100
        )
      : 0;
  const images = product.images?.length ? product.images : [];
  const sizes = Array.from(
    new Set(product.variants?.flatMap((v) => v.sizes) ?? [])
  ).filter(Boolean);

  const handleAddToCart = () => {
    const selectedSize = sizes.length > 0 ? size : "One Size";
    if (sizes.length > 0 && !size) return;
    addItem(
      {
        id: product.id,
        title: product.title,
        price: product.price ?? 0,
        images: product.images ?? [],
      },
      quantity,
      selectedSize
    );
  };

  return (
    <main className="max-w-7xl mx-auto px-4 md:px-8 py-6">
      <div className="grid md:grid-cols-2 gap-6 md:gap-8">
        <div>
          <div className="relative aspect-3/4 bg-gray-100 rounded-lg overflow-hidden">
            <img
              src={images[imageIndex] || PLACEHOLDER_PRODUCT_LARGE}
              alt={product.title}
              className="w-full h-full object-cover"
            />
          </div>
          {images.length > 1 && (
            <div className="flex gap-2 mt-2 overflow-x-auto pb-2">
              {images.map((img, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setImageIndex(i)}
                  className={`shrink-0 w-16 h-20 rounded overflow-hidden border-2 ${
                    i === imageIndex ? "border-gray-900" : "border-transparent"
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div>
          {/* Title */}
          <h1 className="text-xl md:text-2xl font-bold text-gray-900 leading-snug">
            {product.title}
          </h1>

          {/* Price row */}
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <span className="text-2xl md:text-3xl font-extrabold text-gray-900">
              ₹{(product.price ?? 0).toLocaleString("en-IN")}
            </span>
            {product.compareAtPrice != null && (
              <>
                <span className="text-base text-gray-400 line-through">
                  ₹{product.compareAtPrice.toLocaleString("en-IN")}
                </span>
                <span className="bg-green-100 text-green-700 text-xs font-bold px-2.5 py-1 rounded-full">
                  {discount}% OFF
                </span>
              </>
            )}
          </div>
          {product.compareAtPrice != null && (
            <p className="mt-1 text-xs text-gray-400">Inclusive of all taxes</p>
          )}

          {/* Description */}
          {product.description && (
            <p className="mt-4 text-sm text-gray-500 leading-relaxed">{product.description}</p>
          )}

          {/* Razorpay instant discount banner */}
          <div className="mt-5 flex items-center gap-3 px-4 py-3 bg-blue-50 border border-blue-100 rounded-xl">
            <div className="shrink-0 w-8 h-8 bg-[#072654] rounded-md flex items-center justify-center">
              <span className="text-white text-[9px] font-extrabold tracking-tight leading-none text-center">PAY</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 leading-tight">
                Rs. 50 Instant Discount when you Pay Online
              </p>
              <p className="text-[10px] text-gray-400 mt-0.5 uppercase tracking-wide">
                Powered by Razorpay · Extra checkout discount · No coupon required
              </p>
            </div>
          </div>

          {/* Combo offer cards */}
          <div className="mt-5">
            <p className="text-sm font-bold text-gray-900 mb-3">Save Extra with these Offers</p>
            <div className="grid grid-cols-3 gap-2.5">
              {[
                { qty: 2, off: 175, code: "Geek175" },
                { qty: 3, off: 300, code: "Geek300" },
                { qty: 5, off: 500, code: "Geek500" },
              ].map((offer) => (
                <div key={offer.code} className="bg-gray-50 border border-gray-100 rounded-xl p-3 flex flex-col items-center text-center gap-1">
                  <p className="text-[11px] text-gray-500 font-medium leading-tight">
                    Buy {offer.qty} Items
                  </p>
                  <p className="text-sm font-extrabold text-[#1e3a5f] leading-tight">
                    Get ₹{offer.off}<br />
                    <span className="text-xs font-semibold text-gray-600">Flat off</span>
                  </p>
                  <div className="w-full h-px bg-[#1e3a5f]/20 my-0.5" />
                  <p className="text-[10px] font-bold text-gray-500 tracking-wide uppercase">
                    Code: {offer.code}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Size selector */}
          {sizes.length > 0 && (
            <div className="mt-6">
              <div className="flex items-center justify-between mb-2.5">
                <p className="text-sm font-bold text-gray-900">Select Size</p>
                <button
                  type="button"
                  onClick={() => setSizeChartOpen(true)}
                  className="text-xs font-semibold text-[#1e3a5f] underline underline-offset-2 hover:text-[#f97316] transition-colors"
                >
                  Size Chart
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {sizes.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setSize(s)}
                    className={`h-10 px-4 rounded-full border-2 text-sm font-semibold transition-all ${
                      size === s
                        ? "bg-[#1e3a5f] text-white border-[#1e3a5f] shadow-md"
                        : "bg-white text-gray-700 border-gray-200 hover:border-[#1e3a5f] hover:text-[#1e3a5f]"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
              {sizes.length > 0 && !size && (
                <p className="mt-2 text-xs text-amber-600 font-medium">Please select a size</p>
              )}
            </div>
          )}

          {/* Quantity */}
          <div className="mt-5 flex items-center gap-3">
            <p className="text-sm font-bold text-gray-900">Quantity</p>
            <div className="flex items-center border border-gray-200 rounded-full overflow-hidden">
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="w-9 h-9 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors text-lg font-medium"
              >
                −
              </button>
              <span className="w-10 text-center text-sm font-bold text-gray-900 select-none">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => setQuantity((q) => q + 1)}
                className="w-9 h-9 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors text-lg font-medium"
              >
                +
              </button>
            </div>
          </div>

          {/* Delivery info */}
          {(() => {
            const d = new Date();
            d.setDate(d.getDate() + 4);
            const day = d.getDate();
            const suffix = day === 1 || day === 21 || day === 31 ? "st" : day === 2 || day === 22 ? "nd" : day === 3 || day === 23 ? "rd" : "th";
            const month = d.toLocaleString("en-IN", { month: "short" });
            const deliveryDate = `${day}${suffix} ${month}`;
            return (
              <div className="mt-5 border border-gray-100 rounded-xl divide-y divide-gray-100 overflow-hidden">
                {/* Delivery */}
                <div className="flex items-center gap-3 px-4 py-3">
                  <svg className="w-5 h-5 text-gray-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 17a2 2 0 11-4 0 2 2 0 014 0zm10 0a2 2 0 11-4 0 2 2 0 014 0M1 1h4l2.68 13.39A2 2 0 009.6 16h8.79a2 2 0 001.95-1.57L21 7H6" />
                  </svg>
                  <p className="text-sm text-gray-600">
                    Delivery by <span className="font-bold text-gray-900">{deliveryDate}</span>
                  </p>
                </div>
                {/* COD */}
                <div className="flex items-center gap-3 px-4 py-3">
                  <svg className="w-5 h-5 text-gray-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <p className="text-sm text-gray-600">
                    Cash on Delivery
                    <span className="mx-1.5 text-gray-300">|</span>
                    <span className="font-bold text-green-600">Available</span>
                  </p>
                </div>
                {/* Returns */}
                <div className="flex items-center gap-3 px-4 py-3">
                  <svg className="w-5 h-5 text-gray-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M16 15v-1a4 4 0 00-4-4H8m0 0l3 3m-3-3l3-3m9 14V5a2 2 0 00-2-2H6a2 2 0 00-2 2v16l4-2 4 2 4-2 4 2z" />
                  </svg>
                  <p className="text-sm text-gray-600">
                    7 Days Easy Return
                    <span className="mx-1.5 text-gray-300">|</span>
                    <span className="font-bold text-pink-500 cursor-pointer hover:underline" onClick={() => setReturnPolicyOpen(true)}>Know More</span>
                  </p>
                </div>
              </div>
            );
          })()}

          {/* CTA buttons */}
          <div className="mt-6 flex flex-col gap-3">
            <button
              type="button"
              onClick={handleAddToCart}
              disabled={sizes.length > 0 && !size}
              className="w-full flex items-center justify-center gap-2 py-3.5 border-2 border-[#1e3a5f] text-[#1e3a5f] rounded-full font-bold text-sm hover:bg-[#1e3a5f]/5 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              Add to Cart
            </button>
            <button
              type="button"
              onClick={() => {
                if (sizes.length === 0 || size) {
                  addItem(
                    { id: product.id, title: product.title, price: product.price ?? 0, images: product.images ?? [] },
                    quantity,
                    size || "One Size"
                  );
                  navigate("/checkout");
                }
              }}
              disabled={sizes.length > 0 && !size}
              className="w-full py-3.5 bg-[#1e3a5f] text-white rounded-full font-bold text-sm hover:bg-[#163050] disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-md"
            >
              Buy it Now
            </button>
          </div>
        </div>
      </div>

      {/* Related products - first */}
      {related.length > 0 && (
        <div className="mt-12 border-t pt-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Related products</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {related.map((p) => (
              <RelatedCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}

     
      {/* ── RATINGS AND REVIEWS ── */}
      <div className="mt-12 border-t pt-8">
        {/* Section title */}
        <div className="flex items-center gap-3 mb-6">
          <h2 className="text-base md:text-lg font-extrabold text-gray-900 uppercase tracking-widest">
            Ratings and Reviews
          </h2>
          <span className="flex-1 h-px bg-gray-200" />
        </div>

        {reviewsData && (
          <>
            {/* ── Rating summary card ── */}
            <div className="flex flex-col sm:flex-row items-stretch gap-0 bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm mb-8">

              {/* Left — average score */}
              <div className="flex flex-col items-center justify-center px-8 py-6 sm:py-8 sm:min-w-[160px] bg-gray-50 border-b sm:border-b-0 sm:border-r border-gray-100">
                <div className="flex items-center gap-1.5 mb-1">
                  <span className="text-5xl font-extrabold text-gray-900 leading-none">
                    {reviewsData.averageRating.toFixed(1)}
                  </span>
                  <span className="text-2xl text-green-500 leading-none mt-1">★</span>
                </div>
                <p className="text-xs font-semibold text-gray-500 mt-2 tracking-wide uppercase">
                  {reviewsData.totalReviews} {reviewsData.totalReviews === 1 ? "Rating" : "Ratings"}
                </p>
              </div>

              {/* Right — breakdown bars */}
              <div className="flex-1 px-6 py-5 sm:py-6">
                {[5, 4, 3, 2, 1].map((star) => {
                  const count = reviewsData.reviews.filter((r) => r.rating === star).length;
                  const pct = reviewsData.totalReviews > 0 ? (count / reviewsData.totalReviews) * 100 : 0;
                  const barColor =
                    star >= 4 ? "bg-green-500" :
                    star === 3 ? "bg-yellow-400" :
                    star === 2 ? "bg-orange-400" : "bg-red-400";
                  return (
                    <div key={star} className="flex items-center gap-2.5 mb-2 last:mb-0">
                      <span className="text-xs font-semibold text-gray-600 w-4 text-right shrink-0">{star}</span>
                      <span className="text-yellow-400 text-xs shrink-0">★</span>
                      <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${barColor}`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <span className="text-xs text-gray-400 w-5 text-right shrink-0">{count}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* ── Individual reviews ── */}
            {reviewsData.reviews.length === 0 ? (
              <p className="text-gray-400 text-sm text-center py-6">No reviews yet. Be the first to review!</p>
            ) : (
              <ul className="space-y-4 mb-8">
                {reviewsData.reviews.map((r) => (
                  <li key={r.id} className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        {/* Avatar initial */}
                        <div className="w-9 h-9 rounded-full bg-[#1e3a5f] text-white flex items-center justify-center text-sm font-bold shrink-0">
                          {(r.userName ?? "A").charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-900 leading-tight">{r.userName ?? "Anonymous"}</p>
                          <p className="text-[10px] text-gray-400 mt-0.5">
                            {new Date(r.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                          </p>
                        </div>
                      </div>
                      {/* Star badge */}
                      <span className={`inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-xs font-bold text-white shrink-0 ${
                        r.rating >= 4 ? "bg-green-500" : r.rating === 3 ? "bg-yellow-500" : "bg-red-500"
                      }`}>
                        {r.rating} ★
                      </span>
                    </div>
                    {r.comment && (
                      <p className="mt-3 text-sm text-gray-600 leading-relaxed pl-12">{r.comment}</p>
                    )}
                  </li>
                ))}
              </ul>
            )}

            {/* ── Add review form ── */}
            {canReview ? (
              <div className="bg-gray-50 border border-gray-100 rounded-2xl p-5 md:p-6">
                <h3 className="text-sm font-extrabold text-gray-900 uppercase tracking-widest mb-4">
                  Write a Review
                </h3>
                {/* Interactive star selector */}
                <div className="flex items-center gap-1 mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setReviewForm((f) => ({ ...f, rating: star }))}
                      className={`text-2xl transition-colors ${
                        reviewForm.rating >= star ? "text-yellow-400" : "text-gray-200 hover:text-yellow-200"
                      }`}
                    >
                      ★
                    </button>
                  ))}
                  <span className="ml-2 text-xs font-semibold text-gray-500">
                    {["", "Poor", "Fair", "Good", "Very Good", "Excellent"][reviewForm.rating]}
                  </span>
                </div>
                <textarea
                  placeholder="Share your experience with this product…"
                  value={reviewForm.comment}
                  onChange={(e) => setReviewForm((f) => ({ ...f, comment: e.target.value }))}
                  className="w-full border border-gray-200 rounded-xl p-3 text-sm text-gray-700 placeholder-gray-400 bg-white resize-none focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/30 focus:border-[#1e3a5f] mb-4"
                  rows={4}
                />
                <button
                  type="button"
                  onClick={handleSubmitReview}
                  disabled={submittingReview}
                  className="px-6 py-2.5 bg-[#1e3a5f] text-white text-sm font-semibold rounded-lg hover:bg-[#163050] disabled:opacity-50 transition-colors"
                >
                  {submittingReview ? "Submitting…" : "Submit Review"}
                </button>
              </div>
            ) : user ? (
              <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl p-4">
                <svg className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <p className="text-sm text-amber-800">Only customers who have purchased this product can leave a review.</p>
              </div>
            ) : (
              <div className="flex items-center justify-between bg-[#1e3a5f]/5 border border-[#1e3a5f]/20 rounded-xl p-4">
                <p className="text-sm text-gray-600">Purchase this product to share your review.</p>
                <a href="/login" className="text-sm font-semibold text-[#1e3a5f] hover:underline">Sign in →</a>
              </div>
            )}
          </>
        )}
      </div>

      {/* ── Size Chart Modal ── */}
      {sizeChartOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setSizeChartOpen(false)}
          >
            {/* Modal card */}
            <div
              className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 bg-[#1e3a5f]">
                <div>
                  <p className="text-xs font-bold tracking-widest text-white/60 uppercase">GEEK TEE</p>
                  <h3 className="text-base font-extrabold text-white leading-tight">Oversized T‑shirts Size Guide</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setSizeChartOpen(false)}
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
                  aria-label="Close"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* T-shirt illustration */}
              <div className="flex justify-center py-5 bg-gray-50 border-b border-gray-100">
                <svg viewBox="0 0 220 160" className="w-48 h-36" fill="none">
                  {/* Shirt body */}
                  <path d="M60 30 L30 55 L50 65 L50 135 L170 135 L170 65 L190 55 L160 30 L135 10 Q110 20 85 10 Z"
                    fill="#e5e7eb" stroke="#9ca3af" strokeWidth="2" strokeLinejoin="round"/>
                  {/* Collar */}
                  <path d="M85 10 Q110 28 135 10" fill="white" stroke="#9ca3af" strokeWidth="1.5"/>
                  {/* Chest arrow — horizontal */}
                  <line x1="58" y1="80" x2="162" y2="80" stroke="#1e3a5f" strokeWidth="1.5" strokeDasharray="3 2"/>
                  <polygon points="58,80 65,76 65,84" fill="#1e3a5f"/>
                  <polygon points="162,80 155,76 155,84" fill="#1e3a5f"/>
                  <text x="110" y="75" textAnchor="middle" fontSize="9" fill="#1e3a5f" fontWeight="bold">CHEST</text>
                  {/* Length arrow — vertical */}
                  <line x1="185" y1="30" x2="185" y2="135" stroke="#f97316" strokeWidth="1.5" strokeDasharray="3 2"/>
                  <polygon points="185,30 181,38 189,38" fill="#f97316"/>
                  <polygon points="185,135 181,127 189,127" fill="#f97316"/>
                  <text x="200" y="88" textAnchor="middle" fontSize="9" fill="#f97316" fontWeight="bold" transform="rotate(90,200,88)">LENGTH</text>
                  {/* Shoulder arrow */}
                  <line x1="60" y1="22" x2="160" y2="22" stroke="#6b7280" strokeWidth="1.5" strokeDasharray="3 2"/>
                  <polygon points="60,22 67,18 67,26" fill="#6b7280"/>
                  <polygon points="160,22 153,18 153,26" fill="#6b7280"/>
                  <text x="110" y="17" textAnchor="middle" fontSize="9" fill="#6b7280" fontWeight="bold">SHOULDER</text>
                </svg>
              </div>

              {/* Size table */}
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-[#1e3a5f] text-white">
                      <th className="px-4 py-3 text-left text-xs font-bold tracking-wide">Measurement</th>
                      {["XS","S","M","L","XL","XXL"].map((s) => (
                        <th key={s} className="px-3 py-3 text-center text-xs font-bold">{s}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { label: "Chest (in)", values: [40, 42, 44, 46, 48, 50], color: "text-[#1e3a5f]" },
                      { label: "Length (in)", values: [27, 28, 29, 30, 31, 32], color: "text-[#f97316]" },
                      { label: "Shoulder (in)", values: [18, 19, 20, 21, 22, 23], color: "text-gray-600" },
                    ].map((row, idx) => (
                      <tr key={row.label} className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                        <td className={`px-4 py-3 text-xs font-bold ${row.color}`}>{row.label}</td>
                        {row.values.map((v, i) => (
                          <td key={i} className="px-3 py-3 text-center text-sm font-semibold text-gray-800">{v}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Footer note */}
              <div className="px-5 py-3 bg-amber-50 border-t border-amber-100">
                <p className="text-xs text-amber-700 font-medium text-center">
                  All measurements are in <strong>inches</strong>. Size may vary by ±0.5 inch.
                </p>
              </div>
            </div>
          </div>
        </>
      )}

      {/* ── Return Policy Modal ── */}
      {returnPolicyOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={() => setReturnPolicyOpen(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <h3 className="text-base font-extrabold text-gray-900">Return and Replacement Policy</h3>
              <button
                type="button"
                onClick={() => setReturnPolicyOpen(false)}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600 transition-colors"
                aria-label="Close"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Body */}
            <div className="px-5 py-5">
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <span className="mt-1 w-2 h-2 rounded-full bg-pink-500 shrink-0" />
                  <p className="text-sm text-gray-700 leading-relaxed">
                    An order, once placed, can be cancelled until the seller processes it.
                  </p>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1 w-2 h-2 rounded-full bg-pink-500 shrink-0" />
                  <p className="text-sm text-gray-700 leading-relaxed">
                    This product can be returned within <span className="font-semibold text-gray-900">7 day(s)</span> of delivery, subject to the Return Policy.
                  </p>
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
