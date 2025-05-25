import { AxiosResponse } from "axios";
import qs from "qs";
import { instance } from "../../api/axios";
import { IUser } from "../admin/admin.types";
import { IUserFilters } from "./user.types";

class UserService {
  private _BASE_URL = "/admin/user";

  async getAllUsers(filters: IUserFilters): Promise<AxiosResponse<IUser[]>> {
    return instance.get<IUser[]>(`${this._BASE_URL}/get-all`, {
      params: filters,
      paramsSerializer: (params) =>
        qs.stringify(params, { arrayFormat: "repeat" }),
    });
  }

  async deleteUser(userId: string): Promise<AxiosResponse<IUser>> {
    return instance.delete<IUser>(`${this._BASE_URL}/delete/${userId}`);
  }
}

export default new UserService();
