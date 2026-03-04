import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getAddresses, getOrders } from "../api/client";

export default function Account() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [addressCount, setAddressCount] = useState(0);
  const [orderCount, setOrderCount] = useState(0);

  useEffect(() => {
    if (!user) navigate("/login", { replace: true });
  }, [user, navigate]);

  useEffect(() => {
    if (user) {
      getAddresses().then((a) => setAddressCount(a.length)).catch(() => {});
      getOrders().then((o) => setOrderCount(o.length)).catch(() => {});
    }
  }, [user]);

  if (!user) return null;

  return (
    <main className="max-w-4xl mx-auto px-4 py-8 md:py-12">
      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Account</h1>
          <button
            type="button"
            onClick={() => {
              logout();
              navigate("/");
              window.location.reload();
            }}
            className="flex items-center gap-2 text-gray-700 hover:text-gray-900"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            Log out
          </button>

          <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-2">Order history</h2>
          <p className="text-gray-600 mb-2">
            {orderCount === 0
              ? "You haven't placed any orders yet."
              : `You have ${orderCount} order${orderCount === 1 ? "" : "s"}.`}
          </p>
          <Link to="/account/orders" className="text-blue-600 hover:underline">
            View order history
          </Link>
        </div>
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Account details</h2>
          <Link to="/account/addresses" className="text-gray-700 hover:text-gray-900 underline">
            View addresses ({addressCount})
          </Link>
        </div>
      </div>
    </main>
  );
}
