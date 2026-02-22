import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:4000/api";

export const api = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export async function login(email: string, password: string) {
  const { data } = await api.post<{ success: boolean; data: { user: { id: string; email: string; name: string | null }; token: string } }>(
    "/auth/login",
    { email, password }
  );
  return data;
}

export async function register(email: string, password: string, name?: string) {
  const { data } = await api.post<{ success: boolean; data: { user: { id: string; email: string; name: string | null }; token: string } }>(
    "/auth/register",
    { email, password, name }
  );
  return data;
}

export async function getProducts(search?: string): Promise<import("../types").ProductListItem[]> {
  try {
    const { data } = await api.get<{ success: boolean; data: import("../types").ProductListItem[] }>(
      "/products",
      search ? { params: { search } } : {}
    );
    return Array.isArray(data?.data) ? data.data : [];
  } catch {
    return [];
  }
}

export async function getProductById(id: string) {
  try {
    const { data } = await api.get<{ success: boolean; data: import("../types").ProductDetail }>(
      `/products/${id}`
    );
    return data?.data ?? null;
  } catch {
    return null;
  }
}

export async function getBanners(): Promise<import("../types").BannerDto[]> {
  try {
    const { data } = await api.get<{ success: boolean; data: import("../types").BannerDto[] }>(
      "/banners"
    );
    return Array.isArray(data?.data) ? data.data : [];
  } catch {
    return [];
  }
}

export async function getCollections(): Promise<import("../types").CollectionListItem[]> {
  try {
    const { data } = await api.get<{ success: boolean; data: import("../types").CollectionListItem[] }>(
      "/collections"
    );
    return Array.isArray(data?.data) ? data.data : [];
  } catch {
    return [];
  }
}

export async function getCollectionBySlug(slug: string): Promise<import("../types").CollectionWithProducts | null> {
  try {
    const { data } = await api.get<{ success: boolean; data: import("../types").CollectionWithProducts }>(
      `/collections/slug/${slug}`
    );
    return data?.data ?? null;
  } catch {
    return null;
  }
}

export async function getRelatedProducts(productId: string, limit = 6): Promise<import("../types").ProductListItem[]> {
  try {
    const { data } = await api.get<{ success: boolean; data: import("../types").ProductListItem[] }>(
      `/products/${productId}/related`,
      { params: { limit } }
    );
    return Array.isArray(data?.data) ? data.data : [];
  } catch {
    return [];
  }
}

export async function getProductReviews(productId: string): Promise<import("../types").ProductReviewsResponse | null> {
  try {
    const { data } = await api.get<{ success: boolean; data: import("../types").ProductReviewsResponse }>(
      `/products/${productId}/reviews`
    );
    return data?.data ?? null;
  } catch {
    return null;
  }
}

export async function getCanReview(productId: string): Promise<boolean> {
  try {
    const { data } = await api.get<{ success: boolean; data: { canReview: boolean } }>(
      `/products/${productId}/can-review`
    );
    return data?.data?.canReview ?? false;
  } catch {
    return false;
  }
}

export async function addProductReview(
  productId: string,
  body: { rating: number; comment?: string; userName?: string }
): Promise<import("../types").ProductReviewDto> {
  const { data } = await api.post<{ success: boolean; data: import("../types").ProductReviewDto }>(
    `/products/${productId}/reviews`,
    body
  );
  if (!data?.data) throw new Error("Invalid response");
  return data.data;
}

export async function confirmOrder(razorpayOrderId: string, amountPaise: number, items: { productId: string; quantity: number }[]): Promise<void> {
  await api.post("/orders/confirm", {
    razorpayOrderId,
    amountPaise,
    items,
  });
}

/* ========== Cart (requires auth) ========== */

export interface CartItemDto {
  product: { id: string; title: string; price: number; images: string[] };
  quantity: number;
  size: string;
}

export async function getCart(): Promise<CartItemDto[]> {
  const { data } = await api.get<{ success: boolean; data: CartItemDto[] }>("/cart");
  return Array.isArray(data?.data) ? data.data : [];
}

export async function addCartItem(productId: string, quantity: number, size: string): Promise<CartItemDto[]> {
  const { data } = await api.post<{ success: boolean; data: CartItemDto[] }>("/cart/items", {
    productId,
    quantity,
    size: size || "S",
  });
  return Array.isArray(data?.data) ? data.data : [];
}

export async function updateCartItem(productId: string, size: string, delta: number): Promise<CartItemDto[]> {
  const { data } = await api.patch<{ success: boolean; data: CartItemDto[] }>("/cart/items", {
    productId,
    size: size || "S",
    delta,
  });
  return Array.isArray(data?.data) ? data.data : [];
}

export async function removeCartItem(productId: string, size: string): Promise<CartItemDto[]> {
  const { data } = await api.delete<{ success: boolean; data: CartItemDto[] }>("/cart/items", {
    data: { productId, size: size || "S" },
  });
  return Array.isArray(data?.data) ? data.data : [];
}

export async function clearCartApi(): Promise<void> {
  await api.post("/cart/clear");
}

export async function mergeCartApi(items: { productId: string; size: string; quantity: number }[]): Promise<CartItemDto[]> {
  const { data } = await api.post<{ success: boolean; data: CartItemDto[] }>("/cart/merge", { items });
  return Array.isArray(data?.data) ? data.data : [];
}

export interface CreateOrderResponse {
  orderId: string;
  amount: number;
  currency: string;
  key: string;
}

export async function createOrder(amountPaise: number): Promise<CreateOrderResponse> {
  const amountSent = Math.max(100, Math.round(Number(amountPaise)) || 100);
  let response: { data?: { success?: boolean; data?: CreateOrderResponse; error?: string } };
  try {
    response = await api.post<{ success: boolean; data?: CreateOrderResponse; error?: string }>(
      "/orders/create",
      { amountPaise: amountSent }
    );
  } catch (err: unknown) {
    if (axios.isAxiosError(err) && err.response?.data) {
      const body = err.response.data as { error?: string; message?: string };
      throw new Error(body.error || body.message || "Payment request failed");
    }
    throw err;
  }

  const data = response?.data;
  const res = data && typeof data === "object" ? (data as { data?: { orderId?: string; amount?: unknown; currency?: string; key?: string } }).data : undefined;
  const orderId = res && typeof res.orderId === "string" ? String(res.orderId).trim() : "";
  const key = res && typeof res.key === "string" ? String(res.key).trim() : "";
  if (!orderId || !key) {
    const errMsg = (data && typeof data === "object" && (data as { error?: string }).error) || "Invalid order response";
    throw new Error(String(errMsg));
  }
  const rawAmount = res && res.amount != null ? Number(res.amount) : NaN;
  const amount = Number.isFinite(rawAmount) ? Math.max(100, rawAmount) : amountSent;
  const currency = res && typeof res.currency === "string" && res.currency.trim() ? res.currency.trim() : "INR";
  return {
    orderId,
    amount: Math.max(100, amount),
    currency,
    key,
  };
}
