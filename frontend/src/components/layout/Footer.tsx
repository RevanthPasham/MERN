import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-[#1e3a5f] text-white mt-16 pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
          {/* Brand col */}
          <div className="col-span-2 md:col-span-1">
            <div className="text-xl font-extrabold mb-3 tracking-tight">&#x1F455; GEEK TEE</div>
            <p className="text-sm text-white/65 leading-relaxed">
              Premium graphic tees for developers, gamers &amp; tech enthusiasts. Wear your passion with pride.
            </p>
          </div>
          {/* Shop col */}
          <div>
            <h3 className="font-semibold text-xs uppercase tracking-widest text-white/50 mb-4">Shop</h3>
            <ul className="space-y-2.5 text-sm text-white/70">
              <li><Link to="/search" className="hover:text-white transition-colors">All Products</Link></li>
              <li><Link to="/search?q=coding" className="hover:text-white transition-colors">Coding Collection</Link></li>
              <li><Link to="/search?q=corporate" className="hover:text-white transition-colors">Corporate Collection</Link></li>
            </ul>
          </div>
          {/* Help col */}
          <div>
            <h3 className="font-semibold text-xs uppercase tracking-widest text-white/50 mb-4">Help</h3>
            <ul className="space-y-2.5 text-sm text-white/70">
              <li><Link to="/pages/size-chart-crop-top" className="hover:text-white transition-colors">Size Chart &ndash; Crop Top</Link></li>
              <li><Link to="/pages/size-chart-crop-tank" className="hover:text-white transition-colors">Size Chart &ndash; Crop Tank</Link></li>
              <li><Link to="/account/orders" className="hover:text-white transition-colors">Track Your Order</Link></li>
            </ul>
          </div>
          {/* Account col */}
          <div>
            <h3 className="font-semibold text-xs uppercase tracking-widest text-white/50 mb-4">Account</h3>
            <ul className="space-y-2.5 text-sm text-white/70">
              <li><Link to="/login" className="hover:text-white transition-colors">Login / Register</Link></li>
              <li><Link to="/account" className="hover:text-white transition-colors">My Account</Link></li>
              <li><Link to="/account/orders" className="hover:text-white transition-colors">Order History</Link></li>
              <li><Link to="/account/addresses" className="hover:text-white transition-colors">Saved Addresses</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-white/15 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-white/40">
          <p>&copy; {new Date().getFullYear()} GEEK TEE. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span>COD up to &#x20B93,000</span>
            <span className="text-white/20">|</span>
            <span>Secure Payments via Razorpay</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
