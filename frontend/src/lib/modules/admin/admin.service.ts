import { instance } from "../../api/axios";
import { IAdmin } from "./admin.types";

class AdminService {
  private _BASE_URL = "/admin";

  async fetchProfile() {
    return instance.get<IAdmin>(`${this._BASE_URL}/get-profile`);
  }
}

export default new AdminService();
