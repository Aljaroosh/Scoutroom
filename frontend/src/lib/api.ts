  import type { User } from "../types";

  const API_URL = import.meta.env.VITE_API_URL;
  const TOKEN_KEY = "scoutroom_token";

  export const getToken = () => localStorage.getItem(TOKEN_KEY);
  export const setToken = (token: string) => localStorage.setItem(TOKEN_KEY, token);
  export const clearToken = () => localStorage.removeItem(TOKEN_KEY);

  export class ApiError extends Error {
    status: number;
    data: unknown;

    constructor(message: string, status: number, data: unknown) {
      super(message);
      this.status = status;
      this.data = data;
    }
  }

  async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
    const headers: Record<string, string> = { "Content-Type": "application/json" };

    const token = getToken();
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const res = await fetch(`${API_URL}${path}`, { ...options, headers });
    const data = await res.json();

    if (!res.ok) {
      throw new ApiError(data.message ?? "Något gick fel", res.status, data);
    }

    return data as T;
  }

  export const authApi = {
    login: (email: string, password: string) =>
      request<{ success: boolean; token: string; user: User }>("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      }),

    register: (name: string, email: string, password: string) =>
      request<{ success: boolean; user: User }>("/api/auth/register", {
        method: "POST",
        body: JSON.stringify({ name, email, password }),
      }),

    me: () => request<{ success: boolean; user: User }>("/api/auth/me"),

    logout: () => request<{ success: boolean }>("/api/auth/logout", { method: "POST" }),
  };