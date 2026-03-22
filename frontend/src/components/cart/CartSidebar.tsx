import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { PLACEHOLDER_PRODUCT_THUMB } from "../../utils/placeholder";

export default function CartSidebar() {
  const { items, count, subtotal, sidebarOpen, setSidebarOpen, updateQuantity, removeItem } = useCart();
  const navigate = useNavigate();

  if (!sidebarOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black/40 z-40"
        onClick={() => setSidebarOpen(false)}
        aria-hidden="true"
      />
      <aside className="fixed top-0 right-0 h-full w-full max-w-sm bg-white shadow-xl z-50 flex flex-col animate-slide-in">
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-900">
            Your cart
            {count > 0 && (
              <span className="ml-2 text-sm font-normal text-gray-400">({count} items)</span>
            )}
          </h2>
          <button
            type="button"
            onClick={() => setSidebarOpen(false)}
            className="p-2 hover:bg-gray-100 rounded-full"
            aria-label="Close cart"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Trust badges */}
          <div className="flex flex-wrap gap-2">
            {["Free Shipping", "COD Available", "Easy Exchanges", "Premium Cotton"].map((badge) => (
              <span
                key={badge}
                className="inline-flex items-center gap-1 text-xs text-gray-600 bg-gray-100 border border-gray-200 px-2 py-1 rounded-full"
              >
                {badge}
              </span>
            ))}
          </div>
          {items.length === 0 ? (
            <p className="text-gray-500 text-center py-8">Your cart is empty.</p>
          ) : (
            items.map(({ product, quantity, size }) => (
              <div
                key={`${product.id}-${size}`}
                className="flex gap-3 border-b pb-4"
              >
                <img
                  src={product.images?.[0] || PLACEHOLDER_PRODUCT_THUMB}
                  alt={product.title}
                  className="w-20 h-24 object-cover rounded-lg shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 text-sm truncate">{product.title}</p>
                  <p className="text-[#1e3a5f] font-semibold text-sm mt-0.5">
                    ₹{product.price?.toLocaleString("en-IN")}
                  </p>
                  <span className="inline-block bg-gray-100 text-gray-600 text-xs px-1.5 py-0.5 rounded mt-0.5">
                    Size: {size}
                  </span>
                  <div className="flex items-center gap-2 mt-2">
                    <button
                      type="button"
                      onClick={() => updateQuantity(product.id, size, -1)}
                      className="w-7 h-7 rounded-lg border border-gray-200 text-sm hover:bg-gray-50 flex items-center justify-center"
                    >
                      &#8722;
                    </button>
                    <span className="text-sm w-6 text-center font-medium">{quantity}</span>
                    <button
                      type="button"
                      onClick={() => updateQuantity(product.id, size, 1)}
                      className="w-7 h-7 rounded-lg border border-gray-200 text-sm hover:bg-gray-50 flex items-center justify-center"
                    >
                      +
                    </button>
                    <button
                      type="button"
                      onClick={() => removeItem(product.id, size)}
                      className="ml-2 text-xs text-red-500 hover:text-red-700"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
        {items.length > 0 && (
          <div className="p-4 border-t bg-gray-50">
            <p className="text-sm text-gray-600 mb-3">
              Estimated total:{" "}
              <strong className="text-gray-900">₹{subtotal.toLocaleString("en-IN")}</strong>
            </p>
            <button
              type="button"
              onClick={() => {
                setSidebarOpen(false);
                navigate("/checkout");
              }}
              className="bg-[#1e3a5f] hover:bg-[#163050] text-white w-full py-3.5 rounded-xl font-semibold transition-colors"
            >
              Check out
            </button>
          </div>
        )}
      </aside>
    </>
  );
}
