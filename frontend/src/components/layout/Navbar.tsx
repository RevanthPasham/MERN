import { Link } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import SearchOverlay from "./SearchOverlay";
import { useState } from "react";

export default function Navbar() {
  const { count, setSidebarOpen } = useCart();
  const { user } = useAuth();
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 bg-white border-b">
        <div className="h-14 flex justify-between items-center px-4 md:px-8">
          <div className="flex items-center gap-3 md:gap-4">
            <button
              type="button"
              className="p-2 -ml-2 rounded hover:bg-gray-100"
              aria-label="Menu"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <Link to="/" className="flex items-center gap-1 font-bold text-lg md:text-xl text-gray-900">
              <span className="text-xl md:text-2xl" aria-hidden="true">👕</span>
              <span className="hidden sm:inline">GEEK</span>
              <span className="hidden sm:inline">TEE</span>
              <span className="sm:hidden">GEEK TEE</span>
            </Link>
          </div>
          <div className="flex items-center gap-1 md:gap-2">
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              className="p-2 rounded hover:bg-gray-100"
              aria-label="Search"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
            <Link to="/profile" className="p-2 rounded hover:bg-gray-100" aria-label={user ? "Profile" : "Login"}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </Link>
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="relative p-2 rounded hover:bg-gray-100"
              aria-label="Cart"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              {count > 0 && (
                <span className="absolute top-0.5 right-0.5 min-w-[18px] h-[18px] rounded-full bg-blue-600 text-white text-xs flex items-center justify-center px-1">
                  {count > 99 ? "99+" : count}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>
      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
