import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import SearchOverlay from "./SearchOverlay";

export default function Navbar() {
  const { count, setSidebarOpen } = useCart();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [searchOpen, setSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [navQuery, setNavQuery] = useState("");

  const mobileLinks = [
    { label: "Home", to: "/" },
    ...(user
      ? [
          { label: "My Account", to: "/account" },
          { label: "My Orders", to: "/account/orders" },
          { label: "Saved Addresses", to: "/account/addresses" },
        ]
      : [{ label: "Login / Register", to: "/login" }]),
  ];

  return (
    <>
      <header className="sticky top-0 z-40 bg-[#111111] border-b border-gray-800">
        <div className="h-14 flex items-center gap-3 px-4 md:px-6 max-w-7xl mx-auto">

          {/* Left: hamburger + logo */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              className="md:hidden p-2 -ml-2 rounded hover:bg-white/10 text-white transition-colors"
              aria-label="Open menu"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <Link
              to="/"
              className="flex items-center gap-1.5 font-bold text-lg text-white tracking-tight"
            >
              <span className="text-xl" aria-hidden="true">&#x1F455;</span>
              GEEK TEE
            </Link>
          </div>

          {/* Desktop nav links removed per request */}

          {/* Inline search bar — desktop only */}
          <form
            className="hidden md:flex flex-1 justify-center px-4"
            onSubmit={(e) => {
              e.preventDefault();
              setSearchOpen(true);
            }}
          >
            <div className="w-full max-w-3xl flex items-center bg-white rounded overflow-hidden border border-transparent hover:border-[#1e3a5f]/40 focus-within:outline-none focus-within:ring-2 focus-within:ring-[#1e3a5f]/30 transition">
              <svg className="ml-3 w-4 h-4 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="search"
                value={navQuery}
                onChange={(e) => {
                  setNavQuery(e.target.value);
                  setSearchOpen(true);
                }}
                placeholder="Search for products, collections..."
                className="flex-1 px-3 py-2.5 text-left text-sm text-gray-900 outline-none"
                aria-label="Search products"
                autoComplete="off"
              />
              <button
                type="submit"
                className="px-4 py-2.5 bg-[#1e3a5f] text-white text-sm font-medium"
              >
                Search
              </button>
            </div>
          </form>

          {/* Right: search icon (mobile), user, cart */}
          <div className="flex items-center gap-1 ml-auto">

            {/* Search icon — mobile only, triggers SearchOverlay */}
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              className="md:hidden p-2 rounded hover:bg-white/10 text-white transition-colors"
              aria-label="Search"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>

            {/* User avatar/login */}
            {user ? (
              <Link
                to="/account"
                className="w-8 h-8 rounded-full bg-[#1e3a5f] text-white flex items-center justify-center text-sm font-semibold hover:bg-[#163050] transition-colors border border-white/20"
                aria-label="My Account"
              >
                {(user.name ?? user.email).charAt(0).toUpperCase()}
              </Link>
            ) : (
              <Link
                to="/login"
                className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-300 hover:text-white hover:bg-white/10 rounded transition-colors"
                aria-label="Login"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span className="hidden sm:inline text-xs font-medium">Sign in</span>
              </Link>
            )}

            {/* Notification bell */}
            <button
              type="button"
              className="p-2 rounded hover:bg-white/10 text-gray-300 hover:text-white transition-colors"
              aria-label="Notifications"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </button>

            {/* Cart */}
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="relative p-2 rounded hover:bg-white/10 text-white transition-colors"
              aria-label="Cart"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              {count > 0 && (
                <span className="absolute top-0.5 right-0.5 min-w-[18px] h-[18px] rounded-full bg-[#f97316] text-white text-[10px] font-bold flex items-center justify-center px-0.5 leading-none">
                  {count > 99 ? "99+" : count}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile menu overlay */}
      {menuOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/60 z-50 animate-fade-in"
            onClick={() => setMenuOpen(false)}
            aria-hidden="true"
          />
          <aside className="fixed top-0 left-0 w-72 h-full bg-[#111111] z-50 animate-slide-in-left shadow-2xl flex flex-col">
            {/* Menu header */}
            <div className="bg-black px-5 py-4 flex items-center justify-between border-b border-gray-800">
              <span className="text-white font-bold text-lg tracking-tight">&#x1F455; GEEK TEE</span>
              <button
                type="button"
                onClick={() => setMenuOpen(false)}
                className="text-gray-400 hover:text-white p-1 rounded hover:bg-white/10 transition-colors"
                aria-label="Close menu"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Nav links */}
            <nav className="flex-1 overflow-y-auto px-3 py-4 border-b border-gray-800">
              <ul className="space-y-1">
                {mobileLinks.map((link) => (
                  <li key={link.to + link.label}>
                    <Link
                      to={link.to}
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center px-3 py-3 rounded-lg text-sm font-medium text-gray-300 hover:bg-white/10 hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            {/* Footer: user info + logout */}
            {user && (
              <div className="px-5 py-4 bg-black/50">
                <p className="text-xs text-gray-500 mb-1 truncate">{user.email}</p>
                <button
                  type="button"
                  onClick={() => {
                    logout();
                    navigate("/");
                    setMenuOpen(false);
                  }}
                  className="text-sm font-medium text-red-400 hover:text-red-300"
                >
                  Sign out
                </button>
              </div>
            )}
          </aside>
        </>
      )}

      <SearchOverlay
        open={searchOpen}
        initialQuery={navQuery}
        onQueryChange={setNavQuery}
        onClose={() => setSearchOpen(false)}
      />
    </>
  );
}
