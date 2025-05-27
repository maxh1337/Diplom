import axios, { CreateAxiosDefaults } from "axios";
import { API_URL } from "../constants/urls";
import authService from "../modules/auth/auth.service";
import { errorCatch, getContentType } from "./api.helper";
import { csrfService } from "./csrf.service";

const axiosOptions: CreateAxiosDefaults = {
  baseURL: API_URL,
  headers: getContentType(),
};

export const axiosClassic = axios.create(axiosOptions);

const axiosInstanceOptions: CreateAxiosDefaults = {
  baseURL: API_URL,
  headers: getContentType(),
  withCredentials: true,
};
export const instance = axios.create(axiosInstanceOptions);

instance.interceptors.request.use(
  async (config) => {
    const method = config.method?.toUpperCase();
    const requiresCsrf =
      process.env.NODE_ENV === "production" &&
      ["POST", "PUT", "PATCH", "DELETE"].includes(method || "");
    const isAuthRoute = [
      "/auth/login",
      "/auth/logout",
      "/auth/access-token",
    ].some((authPath) => config.url?.includes(authPath));
    if (requiresCsrf && !isAuthRoute) {
      try {
        const csrfToken = await csrfService.getToken();

        if (typeof config.headers?.set === "function") {
          config.headers.set("X-CSRF-Token", csrfToken);
        } else if (config.headers) {
          (config.headers as Record<string, string>)["X-CSRF-Token"] =
            csrfToken;
        }
      } catch (e) {
        console.error("Failed to load CSRF token", e);
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

instance.interceptors.response.use(
  (config) => config,
  async (error) => {
    const originalRequest = error.config;
    if (
      (error.response?.status === 401 ||
        errorCatch(error) === "jwt expired" ||
        errorCatch(error) === "jwt must be provided") &&
      error.config &&
      !error.config._isRetry
    ) {
      originalRequest._isRetry = true;
      try {
        await authService.getNewTokens();
        console.log("From Axios: Tokens refreshed");
        return instance.request(originalRequest);
      } catch (refreshError) {
        if (
          errorCatch(refreshError) === "jwt expired" ||
          errorCatch(refreshError) === "Refresh token not passed"
        ) {
          console.log("From Axios: Refresh token invalid, clearing session");
          await authService.logout();
        }
        throw refreshError;
      }
    }
    throw error;
  }
);
