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
          <h1 className="text-xl md:text-2xl font-bold text-gray-900">
            {product.title}
          </h1>

          <div className="mt-4 flex flex-wrap items-baseline gap-2">
            <span className="text-xl font-bold text-gray-900">
              ₹{(product.price ?? 0).toLocaleString("en-IN")}
            </span>
            {product.compareAtPrice != null && (
              <>
                <span className="text-gray-400 line-through">
                  ₹{product.compareAtPrice.toLocaleString("en-IN")}
                </span>
                <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-0.5 rounded">
                  {discount}% OFF
                </span>
              </>
            )}
          </div>

          <div className="mt-4 p-3 bg-blue-50 rounded-lg text-sm text-gray-700">
            <p className="font-medium">Rs. 50 Instant Discount When you Pay Online</p>
            <p className="text-xs mt-1 text-gray-600">
              POWERED BY RAZORPAY. EXTRA CHECKOUT DISCOUNT. NO COUPON CODE REQUIRED.
            </p>
          </div>

          <div className="mt-4">
            <h3 className="text-sm font-semibold text-gray-900">Save Extra with these Offers</h3>
            <ul className="mt-2 space-y-2">
              <li className="text-sm text-gray-700 bg-gray-100 p-2 rounded">
                Buy 2 Items, Get ₹175 Flat off. Code: Geek175
              </li>
              <li className="text-sm text-gray-700 bg-gray-100 p-2 rounded">
                Buy 3 Items, Get ₹300 Flat off. Code: Geek300
              </li>
              <li className="text-sm text-gray-700 bg-gray-100 p-2 rounded">
                Buy 5 Items, Get ₹500 Flat off. Code: Geek500
              </li>
            </ul>
          </div>

          {sizes.length > 0 && (
            <div className="mt-6">
              <p className="text-sm font-medium text-gray-700 mb-2">Size</p>
              <div className="flex flex-wrap gap-2">
                {sizes.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setSize(s)}
                    className={`min-w-[44px] h-11 px-2 rounded-full border-2 text-sm font-medium ${
                      size === s
                        ? "bg-gray-900 text-white border-gray-900"
                        : "border-gray-300 hover:border-gray-500"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="mt-6 flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700">Quantity</span>
            <div className="flex items-center border rounded">
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="w-10 h-10 flex items-center justify-center border-r"
              >
                −
              </button>
              <input
                type="number"
                min={1}
                value={quantity}
                onChange={(e) =>
                  setQuantity(Math.max(1, parseInt(e.target.value, 10) || 1))
                }
                className="w-12 h-10 text-center border-0"
              />
              <button
                type="button"
                onClick={() => setQuantity((q) => q + 1)}
                className="w-10 h-10 flex items-center justify-center border-l"
              >
                +
              </button>
            </div>
          </div>

          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              onClick={handleAddToCart}
              disabled={sizes.length > 0 && !size}
              className="flex items-center justify-center gap-2 px-6 py-3 border-2 border-gray-900 rounded font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              Add to cart
            </button>
            <button
              type="button"
              onClick={() => {
                if (sizes.length === 0 || size) {
                  addItem(
                    {
                      id: product.id,
                      title: product.title,
                      price: product.price ?? 0,
                      images: product.images ?? [],
                    },
                    quantity,
                    size || "One Size"
                  );
                  navigate("/checkout");
                }
              }}
              disabled={sizes.length > 0 && !size}
              className="px-6 py-3 bg-blue-600 text-white rounded font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Buy it now
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

      {/* Reviews - stars, total, list, then Add review (only if purchased) */}
      <div className="mt-12 border-t pt-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Reviews</h2>
        {reviewsData && (
          <>
            <div className="flex flex-wrap items-center gap-4 mb-4">
              <span className="text-2xl font-bold text-gray-900">
                {reviewsData.averageRating.toFixed(1)}
              </span>
              <span className="text-amber-500 text-lg" aria-label="Rating">
                {"★".repeat(Math.round(reviewsData.averageRating))}{"☆".repeat(5 - Math.round(reviewsData.averageRating))}
              </span>
              <span className="text-gray-500">({reviewsData.totalReviews} reviews)</span>
            </div>
            {reviewsData.reviews.length === 0 && (
              <p className="text-gray-500 text-sm mb-4">No reviews yet.</p>
            )}
            <ul className="space-y-4 mb-6">
              {reviewsData.reviews.map((r) => (
                <li key={r.id} className="border-b pb-4 last:border-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-gray-900">{r.userName}</span>
                    <span className="text-amber-500">{"★".repeat(r.rating)}{"☆".repeat(5 - r.rating)}</span>
                    <span className="text-xs text-gray-400">
                      {new Date(r.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  {r.comment && <p className="text-sm text-gray-600">{r.comment}</p>}
                </li>
              ))}
            </ul>
            {canReview ? (
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm font-medium text-gray-700 mb-2">Add a review</p>
                <div className="flex gap-2 mb-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setReviewForm((f) => ({ ...f, rating: star }))}
                      className={`text-lg ${reviewForm.rating >= star ? "text-amber-500" : "text-gray-300"}`}
                    >
                      ★
                    </button>
                  ))}
                </div>
                <textarea
                  placeholder="Your review (optional)"
                  value={reviewForm.comment}
                  onChange={(e) => setReviewForm((f) => ({ ...f, comment: e.target.value }))}
                  className="w-full border rounded p-2 text-sm mb-2 min-h-[80px]"
                  rows={3}
                />
                <button
                  type="button"
                  onClick={handleSubmitReview}
                  disabled={submittingReview}
                  className="px-4 py-2 bg-gray-800 text-white text-sm rounded hover:bg-gray-900 disabled:opacity-50"
                >
                  {submittingReview ? "Submitting..." : "Submit review"}
                </button>
              </div>
            ) : user ? (
              <p className="text-gray-500 text-sm bg-amber-50 border border-amber-200 rounded p-3">
                Only customers who have purchased this product can leave a review.
              </p>
            ) : (
              <p className="text-gray-500 text-sm">Log in and purchase this product to leave a review.</p>
            )}
          </>
        )}
      </div>
    </main>
  );
}
