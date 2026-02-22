import { createContext, useContext, useState, useCallback, useEffect, useRef, ReactNode } from "react";
import { useAuth } from "./AuthContext";
import * as cartApi from "../api/client";

const CART_STORAGE_KEY = "houseof_cart";

export interface CartProduct {
  id: string;
  title: string;
  price: number;
  images: string[];
}

export interface CartItem {
  product: CartProduct;
  quantity: number;
  size: string;
}

interface CartContextValue {
  items: CartItem[];
  count: number;
  subtotal: number;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  addItem: (product: CartProduct, quantity: number, size: string) => void;
  updateQuantity: (productId: string, size: string, delta: number) => void;
  removeItem: (productId: string, size: string) => void;
  clearCart: () => void;
  isLoading: boolean;
}

const CartContext = createContext<CartContextValue | null>(null);

function loadFromStorage(): CartItem[] {
  try {
    const s = localStorage.getItem(CART_STORAGE_KEY);
    if (!s) return [];
    const parsed = JSON.parse(s);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveToStorage(items: CartItem[]) {
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  } catch {
    // ignore
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [items, setItems] = useState<CartItem[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const hasFetchedForUser = useRef(false);

  // Hydrate: from API when logged in, from localStorage when guest
  useEffect(() => {
    if (user) {
      const guestItems = loadFromStorage();
      if (guestItems.length > 0) {
        const toMerge = guestItems.map((i) => ({
          productId: i.product.id,
          size: i.size,
          quantity: i.quantity,
        }));
        cartApi
          .mergeCartApi(toMerge)
          .then((merged) => {
            setItems(merged);
            localStorage.removeItem(CART_STORAGE_KEY);
          })
          .catch(() => cartApi.getCart().then(setItems))
          .finally(() => {
            setIsLoading(false);
            hasFetchedForUser.current = true;
          });
      } else {
        cartApi
          .getCart()
          .then(setItems)
          .finally(() => {
            setIsLoading(false);
            hasFetchedForUser.current = true;
          });
      }
    } else {
      hasFetchedForUser.current = false;
      setItems(loadFromStorage());
      setIsLoading(false);
    }
  }, [user?.id]);

  // Persist guest cart to localStorage whenever items change and not logged in
  useEffect(() => {
    if (!user && items.length >= 0) saveToStorage(items);
  }, [user, items]);

  const addItem = useCallback(
    (product: CartProduct, quantity: number, size: string) => {
      const sizeStr = size || "S";
      if (user) {
        cartApi
          .addCartItem(product.id, quantity, sizeStr)
          .then(setItems)
          .catch(() => {});
      } else {
        setItems((prev) => {
          const existing = prev.find((i) => i.product.id === product.id && i.size === sizeStr);
          const next = existing
            ? prev.map((i) =>
                i.product.id === product.id && i.size === sizeStr
                  ? { ...i, quantity: i.quantity + quantity }
                  : i
              )
            : [...prev, { product, quantity, size: sizeStr }];
          return next;
        });
      }
      setSidebarOpen(true);
    },
    [user]
  );

  const updateQuantity = useCallback(
    (productId: string, size: string, delta: number) => {
      const sizeStr = size || "S";
      if (user) {
        cartApi
          .updateCartItem(productId, sizeStr, delta)
          .then(setItems)
          .catch(() => {});
      } else {
        setItems((prev) =>
          prev
            .map((i) => {
              if (i.product.id !== productId || i.size !== sizeStr) return i;
              const q = i.quantity + delta;
              return q <= 0 ? null : { ...i, quantity: q };
            })
            .filter((i): i is CartItem => i !== null)
        );
      }
    },
    [user]
  );

  const removeItem = useCallback(
    (productId: string, size: string) => {
      const sizeStr = size || "S";
      if (user) {
        cartApi
          .removeCartItem(productId, sizeStr)
          .then(setItems)
          .catch(() => {});
      } else {
        setItems((prev) =>
          prev.filter((i) => !(i.product.id === productId && i.size === sizeStr))
        );
      }
    },
    [user]
  );

  const clearCart = useCallback(() => {
    if (user) {
      cartApi
        .clearCartApi()
        .then(() => setItems([]))
        .catch(() => setItems([]));
    } else {
      setItems([]);
    }
  }, [user]);

  const count = items.reduce((acc, i) => acc + i.quantity, 0);
  const subtotal = items.reduce((acc, i) => acc + i.product.price * i.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        count,
        subtotal,
        sidebarOpen,
        setSidebarOpen,
        addItem,
        updateQuantity,
        removeItem,
        clearCart,
        isLoading,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
