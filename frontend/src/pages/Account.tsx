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
      {/* Header row */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-[#1e3a5f] flex items-center justify-center text-white text-xl font-bold shrink-0">
            {(user.name ?? user.email).charAt(0).toUpperCase()}
          </div>
          <div>
            {user.name && (
              <p className="font-semibold text-gray-900">{user.name}</p>
            )}
            <p className="text-sm text-gray-500 truncate max-w-[220px]">{user.email}</p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => {
            logout();
            navigate("/");
          }}
          className="text-sm text-gray-500 hover:text-gray-700 border border-gray-200 px-3 py-1.5 rounded-lg hover:bg-gray-50"
        >
          Log out
        </button>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Orders card */}
        <div className="bg-[#1e3a5f] text-white rounded-xl p-6">
          <p className="text-white/60 text-xs uppercase tracking-widest font-semibold mb-1">Orders</p>
          <p className="text-4xl font-bold mb-1">{orderCount}</p>
          <p className="text-white/70 text-sm mb-4">
            {orderCount === 0
              ? "You haven't placed any orders yet."
              : `${orderCount} order${orderCount === 1 ? "" : "s"} placed`}
          </p>
          <Link
            to="/account/orders"
            className="text-sm text-white underline underline-offset-2 hover:text-white/80 font-medium"
          >
            View Orders &#8594;
          </Link>
        </div>

        {/* Addresses card */}
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <p className="text-gray-400 text-xs uppercase tracking-widest font-semibold mb-1">Addresses</p>
          <p className="text-4xl font-bold text-gray-900 mb-1">{addressCount}</p>
          <p className="text-gray-500 text-sm mb-4">
            {addressCount === 0
              ? "No saved addresses yet."
              : `${addressCount} saved address${addressCount === 1 ? "" : "es"}`}
          </p>
          <Link
            to="/account/addresses"
            className="text-sm text-[#1e3a5f] underline underline-offset-2 hover:text-[#163050] font-medium"
          >
            Manage Addresses &#8594;
          </Link>
        </div>
      </div>
    </main>
  );
}
