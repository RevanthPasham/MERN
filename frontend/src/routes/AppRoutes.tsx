import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import ProductDetails from "../components/product/ProductDetails";
import CategoryPage from "../pages/CategoryPage";
import Checkout from "../pages/Checkout";
import Login from "../pages/Login";
import Profile from "../pages/Profile";
import Account from "../pages/Account";
import AccountAddresses from "../pages/AccountAddresses";
import SearchPage from "../pages/SearchPage";
import SizeChart from "../pages/SizeChart";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/product/:id" element={<ProductDetails />} />
      <Route path="/collections/:name" element={<CategoryPage />} />
      <Route path="/search" element={<SearchPage />} />
      <Route path="/pages/size-chart-crop-top" element={<SizeChart />} />
      <Route path="/pages/size-chart-crop-tank" element={<SizeChart />} />
      <Route path="/checkout" element={<Checkout />} />
      <Route path="/login" element={<Login />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/account" element={<Account />} />
      <Route path="/account/addresses" element={<AccountAddresses />} />
    </Routes>
  );
}
