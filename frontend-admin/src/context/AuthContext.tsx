import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from "react";
import { adminLogin } from "../api/client";

const TOKEN_KEY = "adminToken";

interface Admin {
  id: string;
  email: string;
  name: string | null;
  role?: string;
}

interface AuthContextValue {
  admin: Admin | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem(TOKEN_KEY));
  const [isLoading, setIsLoading] = useState(true);

  const login = useCallback(async (email: string, password: string) => {
    try {
      const res = await adminLogin(email, password);
      if (!res.success || !res.data?.token) throw new Error("Login failed");
      const t = res.data.token;
      const a = res.data.admin;
      localStorage.setItem(TOKEN_KEY, t);
      setToken(t);
      setAdmin(a);
    } catch (err: unknown) {
      const msg =
        err && typeof err === "object" && "response" in err
          ? (err as { response?: { data?: { error?: string } } }).response?.data?.error
          : null;
      throw new Error(msg || (err instanceof Error ? err.message : "Login failed"));
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
    setAdmin(null);
  }, []);

  useEffect(() => {
    if (!token) {
      setAdmin(null);
      setIsLoading(false);
      return;
    }
    try {
      const payload = JSON.parse(atob(token.split(".")[1] || "{}"));
      setAdmin({ id: payload.adminId || "", email: payload.email || "", name: null, role: payload.role });
    } catch {
      setAdmin({ id: "", email: "", name: null });
    }
    setIsLoading(false);
  }, [token]);

  return (
    <AuthContext.Provider value={{ admin, token, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
