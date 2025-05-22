import { axiosClassic } from "../../api/axios";
import { IAdmin } from "../admin/admin.types";
import { IFormData } from "./auth.types";

interface IAuthResponse {
  admin: IAdmin;
}

class AuthService {
  async login(data: IFormData, recaptchaToken?: string | null) {
    const response = await axiosClassic.post<IAuthResponse>(
      `/auth/login`,
      data,
      {
        headers: {
          recaptcha: recaptchaToken,
        },
        withCredentials: true,
      }
    );

    return response;
  }

  async getNewTokens() {
    const response = await axiosClassic.post<IAuthResponse>(
      "/auth/access-token",
      {},
      {
        withCredentials: true,
      }
    );

    return response;
  }

  async logout() {
    const response = await axiosClassic.post<boolean>(
      "/auth/logout",
      {},
      {
        withCredentials: true,
      }
    );

    return response;
  }
}

export default new AuthService();
