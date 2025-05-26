import { axiosClassic } from "./axios"; // твой axios без токенов

export const csrfService = {
  async getToken() {
    const response = await axiosClassic.get("/auth/csrf-token");
    return response.data.csrfToken;
  },
};
