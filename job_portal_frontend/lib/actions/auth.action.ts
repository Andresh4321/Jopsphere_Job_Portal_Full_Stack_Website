import { AxiosError } from "axios";
import { authApi } from "../api/auth"; 
import {
  RegisterJobSeekerPayload,
  RegisterJobSeekerResponse,
  RegisterEmployerPayload,
  RegisterEmployerResponse,
  LoginPayload,
  LoginResponse,
} from "../types/auth.types";

const TOKEN_KEY = "kaam_token";
const USER_KEY = "kaam_user";

// Maps common HTTP status codes to user-friendly messages.
const FRIENDLY_ERROR_MAP: Record<number, string> = {
  400: "Please check your input and try again.",
  401: "Invalid email or password.",
  403: "You don't have permission to perform this action.",
  404: "The requested resource was not found.",
  409: "An account with this email already exists.",
  422: "Please check your input and try again.",
  429: "Too many attempts. Please wait a moment and try again.",
  500: "Something went wrong on our end. Please try again later.",
};

// Normalizes whatever the backend / axios throws into a plain message string,
// so every component can do `catch (err) { setError(err.message) }`.
const extractErrorMessage = (error: unknown): string => {
  if (error instanceof AxiosError) {
    const status = error.response?.status;
    const backendMessage = error.response?.data?.message;

    // If the backend sent a human-readable message (not just a status code),
    // use it. Otherwise fall back to our friendly map.
    if (backendMessage && !/^\d{3}$/.test(backendMessage)) {
      return backendMessage;
    }

    if (status && FRIENDLY_ERROR_MAP[status]) {
      return FRIENDLY_ERROR_MAP[status];
    }

    return "Something went wrong. Please try again.";
  }
  if (error instanceof Error) return error.message;
  return "Something went wrong. Please try again.";
};

export const authAction = {
  async registerJobSeeker(payload: RegisterJobSeekerPayload) {
    try {
      const data: RegisterJobSeekerResponse = await authApi.registerJobSeeker(payload);
      return { success: true as const, data };
    } catch (error) {
      return { success: false as const, message: extractErrorMessage(error) };
    }
  },

  async registerEmployer(payload: RegisterEmployerPayload) {
    try {
      const data: RegisterEmployerResponse = await authApi.registerEmployer(payload);
      return { success: true as const, data };
    } catch (error) {
      return { success: false as const, message: extractErrorMessage(error) };
    }
  },

  async login(payload: LoginPayload) {
    try {
      const data: LoginResponse = await authApi.login(payload);

      // Side effects belong here, not in api/auth.ts
      localStorage.setItem(TOKEN_KEY, data.token);
      localStorage.setItem(USER_KEY, JSON.stringify(data.user));
      localStorage.setItem("kaam_role", data.role);

      return { success: true as const, data, redirectTo: data.redirectTo };
    } catch (error) {
      return { success: false as const, message: extractErrorMessage(error) };
    }
  },

  logout() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem("kaam_role");
  },

  getStoredToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  },

  getStoredUser() {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  },

  getStoredRole(): "job_seeker" | "employer" | null {
    return localStorage.getItem("kaam_role") as "job_seeker" | "employer" | null;
  },

  isAuthenticated(): boolean {
    return !!localStorage.getItem(TOKEN_KEY);
  },

  async forgotPassword(email: string) {
    try {
      await authApi.forgotPassword(email);
      return { success: true as const };
    } catch (error) {
      return { success: false as const, message: extractErrorMessage(error) };
    }
  },

  async resetPassword(token: string, newPassword: string) {
    try {
      await authApi.resetPassword(token, newPassword);
      return { success: true as const };
    } catch (error) {
      return { success: false as const, message: extractErrorMessage(error) };
    }
  },
};