import { axiosSecure } from "../../api/axios";
import type { IContinueRegistration, IMyEvents, IUser } from "./user.types";

class UserService {
  private _BASE_URL = "/user";

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

  async getMyEvents() {
    return axiosSecure.get<IMyEvents>(`${this._BASE_URL}/me/get-my-events`);
  }
}

export default new UserService();
