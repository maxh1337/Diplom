import qs from "qs";
import { axiosSecure } from "../../api/axios";
import type { IUser } from "../user/user.types";
import type { IEvent, IEventFilters } from "./event.types";

class EventService {
  private _BASE_URL = "/event";

  async fetchEvents(filters: IEventFilters) {
    return axiosSecure.get<IEvent[]>(`${this._BASE_URL}/get-all`, {
      params: filters,
      paramsSerializer: (params) =>
        qs.stringify(params, { arrayFormat: "repeat" }),
    });
  }

  async fetchEventById(eventId: string) {
    return axiosSecure.get<IEvent>(`${this._BASE_URL}/get-by-id/${eventId}`);
  }

  async toggleEventParticipation(eventId: string) {
    return axiosSecure.post<IUser>(
      `${this._BASE_URL}/toggle-participation/${eventId}`
    );
  }
}

export default new EventService();
