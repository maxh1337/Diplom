import { axiosSecure } from "../../api/axios";
import type { IContinueRegistration, IUser } from "./user.types";

class UserService {
  private _BASE_URL = "/users";

  async fetchProfile(initData: string) {
    return axiosSecure.get<IUser>(`${this._BASE_URL}/me/get-profile`, {
      params: { initData },
    });
  }

  async continueRegistration(dto: IContinueRegistration) {
    return axiosSecure.post<IUser>(
      `${this._BASE_URL}/me/continue-registration/`,
      dto
    );
  }
}

export default new UserService();
