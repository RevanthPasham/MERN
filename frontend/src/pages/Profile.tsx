import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    return (
      <main className="min-h-[70vh] flex items-center justify-center px-4 py-12 bg-gray-50">
        <div className="w-full max-w-sm bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
          <div className="w-16 h-16 rounded-full bg-[#1e3a5f] flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <h1 className="text-xl font-bold text-gray-900 mb-1">Welcome to GEEK TEE</h1>
          <p className="text-sm text-gray-500 mb-6">Log in to see your orders and account details.</p>
          <div className="flex flex-col gap-3">
            <Link
              to="/login"
              className="inline-flex justify-center items-center px-6 py-3 bg-[#1e3a5f] text-white font-semibold rounded-xl hover:bg-[#163050] transition-colors"
            >
              Login
            </Link>
            <Link
              to="/login"
              className="inline-flex justify-center items-center px-6 py-3 border border-gray-300 font-medium rounded-xl hover:bg-gray-50 transition-colors"
            >
              Register
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="max-w-2xl mx-auto px-4 py-8 md:py-12">
      {/* Avatar + user info */}
      <div className="flex items-center gap-4 mb-8 pb-6 border-b border-gray-200">
        <div className="w-16 h-16 rounded-full bg-[#1e3a5f] flex items-center justify-center text-white text-2xl font-bold shrink-0">
          {(user.name ?? user.email).charAt(0).toUpperCase()}
        </div>
        <div className="flex-1 min-w-0">
          {user.name && (
            <p className="text-lg font-semibold text-gray-900">{user.name}</p>
          )}
          <p className="text-sm text-gray-500 truncate">{user.email}</p>
        </div>
        <button
          type="button"
          onClick={() => {
            logout();
            navigate("/");
          }}
          className="border border-gray-300 px-4 py-2 rounded-lg text-sm hover:bg-gray-50 shrink-0"
        >
          Logout
        </button>
      </div>

      {/* Quick link cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link
          to="/account/orders"
          className="border border-gray-200 rounded-xl p-4 hover:border-[#1e3a5f] hover:shadow-sm transition-all flex items-center gap-3"
        >
          <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
            <svg className="w-5 h-5 text-[#1e3a5f]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
          <div>
            <p className="font-semibold text-gray-900">Order History</p>
            <p className="text-xs text-gray-500 mt-0.5">Track and view all your orders</p>
          </div>
        </Link>

        <Link
          to="/account/addresses"
          className="border border-gray-200 rounded-xl p-4 hover:border-[#1e3a5f] hover:shadow-sm transition-all flex items-center gap-3"
        >
          <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
            <svg className="w-5 h-5 text-[#1e3a5f]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <div>
            <p className="font-semibold text-gray-900">Saved Addresses</p>
            <p className="text-xs text-gray-500 mt-0.5">Manage your delivery addresses</p>
          </div>
        </Link>
      </div>
    </main>
  );
}
