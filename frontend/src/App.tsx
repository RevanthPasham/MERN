import AppRoutes from "./routes/AppRoutes";
import Navbar from "./components/layout/Navbar";
import TopBar from "./components/layout/TopBar";
import CartSidebar from "./components/cart/CartSidebar";
import ErrorBoundary from "./components/ErrorBoundary";
import { CartProvider } from "./context/CartContext";
import { AuthProvider } from "./context/AuthContext";

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <CartProvider>
          <div className="min-h-screen bg-white text-gray-900">
            <TopBar />
            <Navbar />
            <main className="min-h-[60vh]">
              <AppRoutes />
            </main>
            <CartSidebar />
          </div>
        </CartProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}
