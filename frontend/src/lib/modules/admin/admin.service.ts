import qs from "qs";
import { instance } from "../../api/axios";
import {
  IAdmin,
  IAdminFilters,
  IAdminLoginData,
  Statistics,
  UpdateAdminProfile,
} from "./admin.types";

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

  async getAllAdmins(filters: IAdminFilters) {
    return instance.get<IAdmin[]>(`${this._BASE_URL}/get-all`, {
      params: filters,
      paramsSerializer: (params) =>
        qs.stringify(params, { arrayFormat: "repeat" }),
    });
  }

  async createAdmin() {
    return instance.post<IAdminLoginData>(`${this._BASE_URL}/create-admin`);
  }
}

export default new AdminService();
