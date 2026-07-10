import axios from "axios";

// If NEXT_PUBLIC_BACKEND_URL is not defined, use same origin (empty string)
export const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL ?? "";

// Single source of truth for the localStorage key. Every get/set/remove
// below uses this constant so they can never drift out of sync again.
const TOKEN_KEY = "kaam_token";

const axiosInstance = axios.create({
  baseURL: BASE_URL, // empty => same origin
  withCredentials: true,
  timeout: 10000, // ms
  headers: {
    "Content-Type": "application/json",
  },
});

// Set header from localStorage on module init (client only)
if (typeof window !== "undefined") {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) {
    axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  }
}

// Request interceptor: ensure latest token is applied (useful if token changes during session)
axiosInstance.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
      config.headers = config.headers ?? {};
      config.headers["Authorization"] = `Bearer ${token}`;
    }
  }
  return config;
});

export function setAuthTokenClient(token: string | null) {
  if (typeof window === "undefined") return;
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
    axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    localStorage.removeItem(TOKEN_KEY);
    delete axiosInstance.defaults.headers.common["Authorization"];
  }
}

export default axiosInstance;