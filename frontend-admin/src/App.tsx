import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Layout from "./components/Layout";
import Login from "./pages/Login";
import SetPassword from "./pages/SetPassword";
import Dashboard from "./pages/Dashboard";
import Orders from "./pages/Orders";
import Products from "./pages/Products";
import Collections from "./pages/Collections";
import Banners from "./pages/Banners";
import Carts from "./pages/Carts";
import Analytics from "./pages/Analytics";
import Settings from "./pages/Settings";
import InviteAdmin from "./pages/InviteAdmin";
import RefundPolicy from "./pages/RefundPolicy";
import Admins from "./pages/Admins";

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { token, isLoading } = useAuth();
  if (isLoading) return <div className="p-8">Loading...</div>;
  if (!token) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/set-password" element={<SetPassword />} />
      <Route
        path="/"
        element={
          <PrivateRoute>
            <Layout />
          </PrivateRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="orders" element={<Orders />} />
        <Route path="products" element={<Products />} />
        <Route path="collections" element={<Collections />} />
        <Route path="banners" element={<Banners />} />
        <Route path="carts" element={<Carts />} />
        <Route path="analytics" element={<Analytics />} />
        <Route path="refund-policy" element={<RefundPolicy />} />
        <Route path="settings" element={<Settings />} />
        <Route path="invite" element={<InviteAdmin />} />
        <Route path="admins" element={<Admins />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}
