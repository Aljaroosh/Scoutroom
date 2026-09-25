  import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
  import { authApi, getToken, setToken, clearToken } from "../lib/api";
  import type { User } from "../types";

  type AuthContextValue = {
    user: User | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (name: string, email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    refreshUser: () => Promise<void>;
  };

  const AuthContext = createContext<AuthContextValue | null>(null);

  export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(() => getToken() !== null);

    useEffect(() => {
      if (!getToken()) return;

      authApi
        .me()
        .then((res) => setUser(res.user))
        .catch(() => clearToken())
        .finally(() => setLoading(false));
    }, []);

    async function login(email: string, password: string) {
      const res = await authApi.login(email, password);
      setToken(res.token);
      setUser(res.user);
    }

    async function register(name: string, email: string, password: string) {
      await authApi.register(name, email, password);
      await login(email, password);
    }

    async function logout() {
      try {
        await authApi.logout();
      } finally {
        clearToken();
        setUser(null);
      }
    }

    async function refreshUser() {
      const res = await authApi.me();
      setUser(res.user);
    }

    return (
      <AuthContext.Provider value={{ user, loading, login, register, logout, refreshUser }}>
        {children}
      </AuthContext.Provider>
    );
  }

  export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
      throw new Error("useAuth måste användas inuti AuthProvider");
    }
    return context;
  }