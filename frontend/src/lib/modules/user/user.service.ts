import { AxiosResponse } from "axios";
import { instance } from "../../api/axios";
import { IUser } from "../admin/admin.types";

class UserService {
  private _BASE_URL = "/admin/user";

  async getAllUsers(): Promise<AxiosResponse<IUser[]>> {
    return instance.get<IUser[]>(`${this._BASE_URL}/get-all`);
  }
}

export default new UserService();
