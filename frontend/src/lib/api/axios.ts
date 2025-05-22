import axios, { CreateAxiosDefaults } from "axios";
import { API_URL } from "../constants/urls";

import { errorCatch, getContentType } from "./api.helper";

const axiosOptions: CreateAxiosDefaults = {
  baseURL: API_URL,
  headers: getContentType(),
  withCredentials: true,
};

export const axiosClassic = axios.create(axiosOptions);

export const instance = axios.create(axiosOptions);

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
