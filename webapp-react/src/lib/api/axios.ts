import axios, { type CreateAxiosDefaults } from "axios";

import { getContentType } from "./api.helper";

const axiosOptions: CreateAxiosDefaults = {
  baseURL: import.meta.env.VITE_BACKEND_URL,
  headers: {
    ...getContentType(),
    "ngrok-skip-browser-warning": "true",
  },
  withCredentials: true,
};

export const axiosClassic = axios.create(axiosOptions);
export const axiosSecure = axios.create(axiosOptions);

axiosSecure.interceptors.request.use((config) => {
  const initData = sessionStorage.getItem("initData");

  if (initData) {
    config.headers["x-init-data"] = sessionStorage.getItem("initData");
  }

  return config;
});
