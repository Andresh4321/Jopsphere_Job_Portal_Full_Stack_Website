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

// Normalizes whatever the backend / axios throws into a plain message string,
// so every component can do `catch (err) { setError(err.message) }`.
const extractErrorMessage = (error: unknown): string => {
  if (error instanceof AxiosError) {
    return (
      error.response?.data?.message ||
      error.message ||
      "Something went wrong. Please try again."
    );
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
};