import { instance } from "../../api/axios";
import { IAdmin, Statistics, UpdateAdminProfile } from "./admin.types";

class AdminService {
  private _BASE_URL = "/admin";

  async fetchProfile() {
    return instance.get<IAdmin>(`${this._BASE_URL}/get-profile`);
  }

  async getStatistics() {
    return instance.get<Statistics>(`${this._BASE_URL}/statistics/get-all`);
  }

  async updateAdminProfile(dto: UpdateAdminProfile) {
    return instance.patch<IAdmin>(`${this._BASE_URL}/update-profile`, dto);
  }
}

export default new AdminService();
