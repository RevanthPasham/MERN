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
      <aside className="fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-xl z-50 flex flex-col">
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-lg font-semibold">Your cart</h2>
          <button
            type="button"
            onClick={() => setSidebarOpen(false)}
            className="p-2 hover:bg-gray-100 rounded-full"
            aria-label="Close cart"
          >
            <span className="text-xl">×</span>
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs text-gray-600">
            <div className="flex items-center gap-1">🛒 Free Shipping</div>
            <div className="flex items-center gap-1">💵 COD Available</div>
            <div className="flex items-center gap-1">🔄 Easy Exchanges</div>
            <div className="flex items-center gap-1">🏅 Premium Cotton</div>
          </div>
          {items.length === 0 ? (
            <p className="text-gray-500 text-center py-8">Your cart is empty.</p>
          ) : (
            items.map(({ product, quantity, size }) => (
              <div
                key={`${product.id}-${size}`}
                className="flex gap-3 border-b pb-3"
              >
                <img
                  src={product.images?.[0] || PLACEHOLDER_PRODUCT_THUMB}
                  alt={product.title}
                  className="w-20 h-24 object-cover rounded shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{product.title}</p>
                  <p className="text-sm text-gray-600">₹{product.price?.toLocaleString("en-IN")}</p>
                  <p className="text-xs text-gray-500">Size: {size}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <button
                      type="button"
                      onClick={() => updateQuantity(product.id, size, -1)}
                      className="w-6 h-6 rounded border text-sm"
                    >
                      −
                    </button>
                    <span className="text-sm w-6 text-center">{quantity}</span>
                    <button
                      type="button"
                      onClick={() => updateQuantity(product.id, size, 1)}
                      className="w-6 h-6 rounded border text-sm"
                    >
                      +
                    </button>
                    <button
                      type="button"
                      onClick={() => removeItem(product.id, size)}
                      className="ml-2 text-red-600 text-xs"
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
            <p className="text-sm text-gray-600 mb-1">
              Estimated total: <strong className="text-black">₹{subtotal.toLocaleString("en-IN")}</strong>
            </p>
            <button
              type="button"
              onClick={() => {
                setSidebarOpen(false);
                navigate("/checkout");
              }}
              className="w-full py-3 bg-black text-white font-medium rounded"
            >
              Check out
            </button>
          </div>
        )}
      </aside>
    </>
  );
}
