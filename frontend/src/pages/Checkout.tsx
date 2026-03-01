import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { createOrder, confirmOrder } from "../api/client";
import { openRazorpay } from "../utils/razorpay.ts";
import { PLACEHOLDER_PRODUCT_THUMB } from "../utils/placeholder";

export default function Checkout() {
  const { items, subtotal, clearCart } = useCart();
  const { user } = useAuth();
  const [paying, setPaying] = useState(false);
  const navigate = useNavigate();

  const handlePay = async () => {
    if (items.length === 0) return;
    setPaying(true);
    const amountPaise = Math.max(100, Math.round(Number(subtotal) * 100));
    try {
      const data = await createOrder(amountPaise);
      const orderId = (data && typeof data.orderId === "string" && data.orderId.trim()) ? data.orderId.trim() : "";
      const rawAmount = data && data.amount != null ? Number(data.amount) : NaN;
      const amount = Number.isFinite(rawAmount) && rawAmount >= 100 ? rawAmount : amountPaise;
      const currency = (data && typeof data.currency === "string" && data.currency.trim()) ? data.currency.trim() : "INR";
      const key = (data && typeof data.key === "string" && data.key.trim()) ? data.key.trim() : "";
      if (!orderId || !key) throw new Error("Invalid order response from server");
      if (!Number.isFinite(amount) || amount < 100) throw new Error("Invalid payment amount Please Check");
      const payload = { orderId, amount, items };
      await openRazorpay({
        orderId,
        amount,
        currency,
        key,
        user: user ? { name: user.name, email: user.email } : undefined,
        onSuccess: async () => {
          if (user) {
            try {
              await confirmOrder(payload.orderId, payload.amount, items.map(({ product, quantity }) => ({ productId: product.id, quantity })));
            } catch {
              // still show success; order may already be recorded
            }
          }
          clearCart();
          setPaying(false);
          alert("Payment Successful 🎉");
          navigate("/profile");
        },
        onDismiss: () => setPaying(false),
      });
    } catch (err: unknown) {
      setPaying(false);
      let msg = "Payment could not be opened.";
      if (axios.isAxiosError(err)) {
        const d = err.response?.data;
        msg = (d && (d.error ?? d.message)) ? String(d.error ?? d.message) : msg;
      } else if (err instanceof Error) msg = err.message;
      alert(msg);
    }
  };

  return (
    <main className="max-w-2xl mx-auto px-4 py-8 md:py-12">
      <h1 className="text-2xl font-bold mb-6">Checkout</h1>
      {items.length === 0 ? (
        <p className="text-gray-500 mb-4">Your cart is empty.</p>
      ) : (
        <>
          <div className="space-y-4 mb-6">
            {items.map(({ product, quantity, size }) => (
              <div
                key={`${product.id}-${size}`}
                className="flex gap-3 border-b pb-3"
              >
                <img
                  src={product.images?.[0] || PLACEHOLDER_PRODUCT_THUMB}
                  alt={product.title}
                  className="w-16 h-20 object-cover rounded shrink-0"
                />
                <div>
                  <p className="font-medium">{product.title}</p>
                  <p className="text-sm text-gray-600">
                    Size: {size} · Qty: {quantity}
                  </p>
                  <p className="text-sm">
                    ₹{(product.price * quantity).toLocaleString("en-IN")}
                  </p>
                </div>
              </div>
            ))}
            <p className="text-lg font-semibold pt-2">
              Total: ₹{subtotal.toLocaleString("en-IN")}
            </p>
            <p className="text-xs text-gray-500">
              Pay securely via Razorpay. Amount: ₹{subtotal.toLocaleString("en-IN")}
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={handlePay}
              disabled={paying}
              className="px-6 py-3 bg-green-600 text-white font-medium rounded hover:bg-green-700 disabled:opacity-50"
            >
              {paying ? "Opening..." : `Pay ₹${subtotal.toLocaleString("en-IN")}`}
            </button>
            <Link
              to="/"
              className="px-6 py-3 border border-gray-300 rounded font-medium hover:bg-gray-50"
            >
              Continue shopping
            </Link>
          </div>
        </>
      )}
    </main>
  );
}
