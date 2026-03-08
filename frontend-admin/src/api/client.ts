import axios from "axios";

const BASE = import.meta.env.VITE_API_URL || "http://localhost:4000/api";

export const api = axios.create({
  baseURL: `${BASE}/admin`,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("adminToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (r) => r,
  (err) => {
    const isLoginRequest = err.config?.url?.includes("/auth/login");
    if (err.response?.status === 401 && !isLoginRequest) {
      localStorage.removeItem("adminToken");
      const msg = err.response?.data?.error || "Session expired. Please sign in again.";
      window.location.href = "/login";
      return Promise.reject(new Error(msg));
    }
    if (err.response?.data?.error) {
      return Promise.reject(new Error(err.response.data.error));
    }
    return Promise.reject(err);
  }
);

export async function adminLogin(email: string, password: string) {
  const { data } = await api.post<{
    success: boolean;
    data: { admin: { id: string; email: string; name: string | null; role?: string }; token: string };
  }>("/auth/login", { email, password });
  return data;
}

export async function getOrders(filter?: "all" | "new" | "completed") {
  const { data } = await api.get<{ success: boolean; data: OrderDto[] }>("/orders", {
    params: filter ? { filter } : {},
  });
  return data.data;
}

export async function getOrderById(id: string) {
  const { data } = await api.get<{ success: boolean; data: OrderDto }>(`/orders/${id}`);
  return data.data;
}

export async function updateOrderStatus(id: string, orderStatus: string) {
  const { data } = await api.patch<{ success: boolean; data: OrderDto }>(`/orders/${id}/status`, { orderStatus });
  return data.data;
}

export async function getProducts() {
  const { data } = await api.get<{ success: boolean; data: ProductListItem[] }>("/products");
  return data.data;
}

export async function getProductById(id: string) {
  const { data } = await api.get<{ success: boolean; data: unknown }>(`/products/${id}`);
  return data.data;
}

export async function createProduct(body: { title: string; slug: string; description?: string; categoryId?: string; brand?: string; material?: string; isActive?: boolean; initialPrice?: number }) {
  const { data } = await api.post<{ success: boolean; data: unknown }>("/products", body);
  return data.data;
}

export async function updateProduct(id: string, body: Partial<{ title: string; slug: string; description: string; categoryId: string; brand: string; material: string; isActive: boolean; imageUrl: string | null; price: number; stockQuantity: number }>) {
  const { data } = await api.patch<{ success: boolean; data: unknown }>(`/products/${id}`, body);
  return data.data;
}

export interface ProductImageDto {
  id: string;
  url: string;
  sortOrder: number;
}

export async function getProductImages(productId: string): Promise<ProductImageDto[]> {
  const { data } = await api.get<{ success: boolean; data: { images: ProductImageDto[] } }>(`/products/${productId}/images`);
  return data.data.images;
}

export async function addProductImage(productId: string, url: string): Promise<ProductImageDto> {
  const { data } = await api.post<{ success: boolean; data: ProductImageDto }>(`/products/${productId}/images`, { url });
  return data.data;
}

export async function removeProductImage(productId: string, imageId: string): Promise<void> {
  await api.delete(`/products/${productId}/images/${imageId}`);
}

export async function getCollections() {
  const { data } = await api.get<{ success: boolean; data: CollectionDto[] }>("/collections");
  return data.data;
}

export async function getCollectionById(id: string) {
  const { data } = await api.get<{ success: boolean; data: CollectionDto }>(`/collections/${id}`);
  return data.data;
}

export async function getCollectionProducts(id: string) {
  const { data } = await api.get<{ success: boolean; data: { collection: CollectionDto; products: { id: string; title: string; slug: string; price: number | null; imageUrl: string | null }[] } }>(`/collections/${id}/products`);
  return data.data;
}

export async function setCollectionProducts(id: string, productIds: string[]) {
  const { data } = await api.patch<{ success: boolean; data: unknown }>(`/collections/${id}/products`, { productIds });
  return data.data;
}

export async function createCollection(body: { name: string; slug: string; description?: string; bannerImage?: string; isActive?: boolean }) {
  const { data } = await api.post<{ success: boolean; data: CollectionDto }>("/collections", body);
  return data.data;
}

export async function updateCollection(id: string, body: Partial<{ name: string; slug: string; description: string; bannerImage: string | null; isActive: boolean }>) {
  const { data } = await api.patch<{ success: boolean; data: CollectionDto }>(`/collections/${id}`, body);
  return data.data;
}

export async function getBanners() {
  const { data } = await api.get<{ success: boolean; data: BannerDto[] }>("/banners");
  return data.data;
}

export async function getBannerById(id: string) {
  const { data } = await api.get<{ success: boolean; data: BannerDto }>(`/banners/${id}`);
  return data.data;
}

export async function createBanner(body: { title: string; highlight: string; subtitle?: string; cta: string; collectionSlug: string; imageUrl: string; sortOrder?: number; isActive?: boolean }) {
  const { data } = await api.post<{ success: boolean; data: BannerDto }>("/banners", body);
  return data.data;
}

export async function updateBanner(id: string, body: Partial<{ title: string; highlight: string; subtitle: string; cta: string; collectionSlug: string; imageUrl: string; sortOrder: number; isActive: boolean }>) {
  const { data } = await api.patch<{ success: boolean; data: BannerDto }>(`/banners/${id}`, body);
  return data.data;
}

export async function getCarts() {
  const { data } = await api.get<{ success: boolean; data: CartSummaryDto[] }>("/carts");
  return data.data;
}

export async function inviteSubAdmin(email: string, role?: "super_admin" | "sub_admin" | "admin") {
  await api.post("/invite", { email, role: role || "sub_admin" });
}

export interface AdminListItem {
  id: string;
  email: string;
  name: string | null;
  role: string;
}

export async function getAdmins() {
  const { data } = await api.get<{ success: boolean; data: AdminListItem[] }>("/admins");
  return data.data;
}

export async function removeAdmin(id: string) {
  await api.delete(`/admins/${id}`);
}

export async function setPasswordFromToken(token: string, password: string) {
  const { data } = await api.post<{ success: boolean; data: { admin: { id: string; email: string; name: string | null; role: string }; token: string } }>("/set-password", { token, password });
  return data.data;
}

export async function getRefundPolicy() {
  const { data } = await api.get<{ success: boolean; data: { refundPolicy: string } }>("/settings/refund-policy");
  return data.data.refundPolicy;
}

export async function updateRefundPolicy(refundPolicy: string) {
  const { data } = await api.patch<{ success: boolean; data: { refundPolicy: string } }>("/settings/refund-policy", { refundPolicy });
  return data.data.refundPolicy;
}

export interface RefundRequestDto {
  id: string;
  order_id: string;
  user_id: string | null;
  message: string;
  status: string;
  created_at: string;
  order_total?: number;
  order_status?: string;
  user_email?: string | null;
  user_name?: string | null;
  items?: { productName: string; quantity: number; subtotal: number; productId: string }[];
}

export async function getRefundRequests() {
  const { data } = await api.get<{ success: boolean; data: RefundRequestDto[] }>("/refund-requests");
  return data.data;
}

export async function updateRefundRequestStatus(id: string, status: "approved" | "rejected") {
  const { data } = await api.patch<{ success: boolean; data: { status: string } }>(`/refund-requests/${id}`, { status });
  return data.data;
}

export async function getAnalytics() {
  const { data } = await api.get<{ success: boolean; data: AnalyticsDto }>("/analytics");
  return data.data;
}

export async function uploadImage(imageDataUri: string, folder?: string) {
  const { data } = await api.post<{ success: boolean; data: { url: string } }>("/upload", { image: imageDataUri, folder });
  return data.data.url;
}

export async function deleteImageFromCloudinary(url: string) {
  await api.post("/upload/delete", { url });
}

export interface OrderDto {
  id: string;
  userId: string | null;
  user: { id: string; email: string; name: string | null } | null;
  address: {
    fullName: string;
    phoneNumber: string;
    streetAddress: string;
    area: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    landmark: string | null;
  } | null;
  totalAmount: number;
  paymentMethod: string;
  paymentStatus: string;
  orderStatus: string;
  createdAt: string;
  items: { id: string; productId: string; productName: string; productPrice: number; quantity: number; subtotal: number }[];
}

export interface ProductListItem {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  categoryId: string | null;
  category: { id: string; name: string; slug: string } | null;
  brand: string | null;
  material: string | null;
  isActive: boolean;
  price: number | null;
  compareAtPrice: number | null;
  imageUrl: string | null;
  variantCount: number;
  collectionIds: string[];
  collectionSlugs: string[];
}

export interface CollectionDto {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  bannerImage: string | null;
  isActive: boolean;
  createdAt?: string;
}

export interface BannerDto {
  id: string;
  title: string;
  highlight: string;
  subtitle: string;
  cta: string;
  collectionSlug: string;
  imageUrl: string | null;
  sortOrder: number;
  isActive: boolean;
  createdAt?: string;
}

export interface CartSummaryDto {
  userId: string;
  user: { id: string; email: string; name: string | null } | null;
  items: { productId: string; productTitle: string; productSlug: string; imageUrl: string | null; price: number | null; size: string; quantity: number; updatedAt: string }[];
  itemCount: number;
}

export interface AnalyticsDto {
  totalRevenue: number;
  totalOrders: number;
  ordersByStatus: Record<string, number>;
  topSelling: { productId: string; productName: string; quantity: number; revenue: number }[];
  leastSelling: { productId: string; productName: string; quantity: number; revenue: number }[];
}
