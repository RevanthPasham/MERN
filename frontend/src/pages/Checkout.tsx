import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { createOrder, confirmOrder, getAddresses, createAddress } from "../api/client";
import { openRazorpay } from "../utils/razorpay.ts";
import { PLACEHOLDER_PRODUCT_THUMB } from "../utils/placeholder";
import type { AddressDto, AddressType } from "../types";

const ADDRESS_TYPES: AddressType[] = ["Home", "Work", "Other"];
const emptyAddressForm = {
  fullName: "",
  phoneNumber: "",
  country: "India",
  state: "",
  city: "",
  area: "",
  streetAddress: "",
  landmark: "",
  postalCode: "",
  addressType: "Home" as AddressType,
};

export default function Checkout() {
  const { items, subtotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [paying, setPaying] = useState(false);
  const [addresses, setAddresses] = useState<AddressDto[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [showNewAddress, setShowNewAddress] = useState(false);
  const [newAddressForm, setNewAddressForm] = useState(emptyAddressForm);
  const [savingAddress, setSavingAddress] = useState(false);
  const [addressError, setAddressError] = useState("");

  useEffect(() => {
    if (user) {
      getAddresses()
        .then((list) => {
          setAddresses(list);
          const defaultAddr = list.find((a) => a.isDefault) ?? list[0];
          if (defaultAddr) setSelectedAddressId(defaultAddr.id);
        })
        .catch(() => setAddresses([]));
    } else {
      setAddresses([]);
      setSelectedAddressId(null);
    }
  }, [user]);

  const handlePay = async () => {
    if (items.length === 0) return;
    if (user && addresses.length > 0 && !selectedAddressId) {
      setAddressError("Please select a delivery address.");
      return;
    }
    if (user && addresses.length === 0) {
      setAddressError("Please add a delivery address before paying.");
      return;
    }
    setAddressError("");
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
      const addressId = user ? selectedAddressId : null;
      const payload = { orderId, amount, items, addressId };
      await openRazorpay({
        orderId,
        amount,
        currency,
        key,
        user: user ? { name: user.name, email: user.email } : undefined,
        onSuccess: async () => {
          if (user) {
            try {
              await confirmOrder(
                payload.orderId,
                payload.amount,
                items.map(({ product, quantity }) => ({ productId: product.id, quantity })),
                payload.addressId
              );
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
      let msg = "Payment could not be opened..";
      if (axios.isAxiosError(err)) {
        const d = err.response?.data;
        msg = (d && (d.error ?? d.message)) ? String(d.error ?? d.message) : msg;
      } else if (err instanceof Error) msg = err.message;
      alert(msg);
    }
  };

  const handleSaveNewAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddressError("");
    if (
      !newAddressForm.fullName?.trim() ||
      !newAddressForm.phoneNumber?.trim() ||
      !newAddressForm.streetAddress?.trim() ||
      !newAddressForm.city?.trim() ||
      !newAddressForm.state?.trim() ||
      !newAddressForm.area?.trim() ||
      !newAddressForm.postalCode?.trim()
    ) {
      setAddressError("Please fill all required fields.");
      return;
    }
    setSavingAddress(true);
    try {
      const created = await createAddress({
        ...newAddressForm,
        landmark: newAddressForm.landmark || null,
        isDefault: addresses.length === 0,
      });
      const list = await getAddresses();
      setAddresses(list);
      setSelectedAddressId(created.id);
      setNewAddressForm(emptyAddressForm);
      setShowNewAddress(false);
    } catch (err: unknown) {
      setAddressError(err instanceof Error ? err.message : "Failed to save address");
    } finally {
      setSavingAddress(false);
    }
  };

  return (
    <main className="max-w-2xl mx-auto px-4 py-8 md:py-12">
      <h1 className="text-2xl font-bold mb-6">Checkout</h1>
      {items.length === 0 ? (
        <p className="text-gray-500 mb-4">Your cart is empty.</p>
      ) : (
        <>
          {user && (
            <section className="mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">Delivery address</h2>
              <div className="space-y-2">
                {addresses.map((a) => (
                  <label
                    key={a.id}
                    className={`flex gap-3 p-3 border rounded-lg cursor-pointer ${
                      selectedAddressId === a.id ? "border-green-600 bg-green-50/50 ring-1 ring-green-600" : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <input
                      type="radio"
                      name="address"
                      value={a.id}
                      checked={selectedAddressId === a.id}
                      onChange={() => setSelectedAddressId(a.id)}
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <span className="text-sm font-medium text-gray-500">{a.addressType}</span>
                      {a.isDefault && (
                        <span className="ml-2 text-xs text-green-700 bg-green-100 px-1.5 py-0.5 rounded">Default</span>
                      )}
                      <p className="font-medium text-gray-900">{a.fullName}, {a.phoneNumber}</p>
                      <p className="text-sm text-gray-600">
                        {a.streetAddress}, {a.area}, {a.city}, {a.state} {a.postalCode}, {a.country}
                      </p>
                    </div>
                  </label>
                ))}
              </div>
              {!showNewAddress ? (
                <button
                  type="button"
                  onClick={() => setShowNewAddress(true)}
                  className="mt-2 text-sm text-blue-600 hover:underline"
                >
                  + Add new address
                </button>
              ) : (
                <form onSubmit={handleSaveNewAddress} className="mt-3 p-4 border border-gray-200 rounded-lg bg-gray-50 space-y-2">
                  <p className="font-medium text-gray-900">New address</p>
                  {addressError && <p className="text-sm text-red-600">{addressError}</p>}
                  <input
                    type="text"
                    placeholder="Full name *"
                    value={newAddressForm.fullName}
                    onChange={(e) => setNewAddressForm((f) => ({ ...f, fullName: e.target.value }))}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Phone *"
                    value={newAddressForm.phoneNumber}
                    onChange={(e) => setNewAddressForm((f) => ({ ...f, phoneNumber: e.target.value }))}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Street address *"
                    value={newAddressForm.streetAddress}
                    onChange={(e) => setNewAddressForm((f) => ({ ...f, streetAddress: e.target.value }))}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                    required
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="Area *"
                      value={newAddressForm.area}
                      onChange={(e) => setNewAddressForm((f) => ({ ...f, area: e.target.value }))}
                      className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                      required
                    />
                    <input
                      type="text"
                      placeholder="City *"
                      value={newAddressForm.city}
                      onChange={(e) => setNewAddressForm((f) => ({ ...f, city: e.target.value }))}
                      className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="State *"
                      value={newAddressForm.state}
                      onChange={(e) => setNewAddressForm((f) => ({ ...f, state: e.target.value }))}
                      className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                      required
                    />
                    <input
                      type="text"
                      placeholder="Postal code *"
                      value={newAddressForm.postalCode}
                      onChange={(e) => setNewAddressForm((f) => ({ ...f, postalCode: e.target.value }))}
                      className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                      required
                    />
                  </div>
                  <input
                    type="text"
                    placeholder="Country *"
                    value={newAddressForm.country}
                    onChange={(e) => setNewAddressForm((f) => ({ ...f, country: e.target.value }))}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                    required
                  />
                  <select
                    value={newAddressForm.addressType}
                    onChange={(e) => setNewAddressForm((f) => ({ ...f, addressType: e.target.value as AddressType }))}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                  >
                    {ADDRESS_TYPES.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                  <div className="flex gap-2">
                    <button
                      type="submit"
                      disabled={savingAddress}
                      className="px-3 py-1.5 bg-gray-900 text-white text-sm rounded hover:bg-gray-800 disabled:opacity-50"
                    >
                      {savingAddress ? "Saving..." : "Save address"}
                    </button>
                    <button
                      type="button"
                      onClick={() => { setShowNewAddress(false); setAddressError(""); setNewAddressForm(emptyAddressForm); }}
                      className="px-3 py-1.5 border border-gray-300 text-sm rounded hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </section>
          )}

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
          {user && addresses.length > 0 && !selectedAddressId && (
            <p className="text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 mb-2">
              Please select a delivery address above.
            </p>
          )}
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={handlePay}
              disabled={paying || (user && addresses.length === 0) || (user && addresses.length > 0 && !selectedAddressId)}
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
