import { createContext, useContext, useState, useEffect, ReactNode } from "react";

/**
 * Shape of the authenticated user stored in app + localStorage
 */
export interface AuthUser {
  id: string;
  email: string;
  name: string | null;
}

/**
 * Key used in localStorage
 */
const STORAGE_KEY = "user";

/**
 * Safely read user from localStorage
 * - Prevents app crash if JSON is invalid
 * - Returns null if no user found
 */
function getStoredUser(): AuthUser | null {
  try {
    const s = localStorage.getItem(STORAGE_KEY);
    if (!s) return null;
    return JSON.parse(s) as AuthUser;
  } catch {
    return null;
  }
}

/**
 * Context value type
 * Defines what will be accessible via useAuth()
 */
interface AuthContextValue {
  user: AuthUser | null;
  setUser: (u: AuthUser | null) => void;
  logout: () => void;
}

/**
 * Create context (default is null to enforce provider usage)
 */
const AuthContext = createContext<AuthContextValue | null>(null);

/**
 * AuthProvider wraps the app and provides auth state
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  /**
   * Initialize state from localStorage (runs once on mount)
   * Using function form avoids unnecessary re-renders
   */
  const [user, setUserState] = useState<AuthUser | null>(getStoredUser);

  /**
   * Sync state with localStorage on initial load
   * (Useful if storage changes outside React lifecycle)
   */
  useEffect(() => {
    const u = getStoredUser();
    setUserState(u);
  }, []);

  /**
   * Set user both in state and localStorage
   * - If user exists → store it
   * - If null → remove from storage
   */
  const setUser = (u: AuthUser | null) => {
    if (u) localStorage.setItem(STORAGE_KEY, JSON.stringify(u));
    else localStorage.removeItem(STORAGE_KEY);
    setUserState(u);
  };

  /**
   * Logout function
   * - Removes auth token
   * - Clears user from storage and state
   */
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem(STORAGE_KEY);
    setUserState(null);
  };

  /**
   * Provide auth state + actions to children
   */
  return (
    <AuthContext.Provider value={{ user, setUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

/**
 * Custom hook to access auth context
 * Throws error if used outside AuthProvider (good safety check)
 */
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}wq