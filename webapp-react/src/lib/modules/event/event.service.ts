import qs from "qs";
import { axiosSecure } from "../../api/axios";
import type { IUser } from "../user/user.types";
import type { IEvent, IEventFeedback, IEventFilters } from "./event.types";

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

  async sendFeedback(rating: number, eventId: string, comment?: string) {
    return axiosSecure.post<IEventFeedback>(
      `/feedback/send-feedback/${eventId}`,
      { rating: rating, comment: comment ? comment : "" }
    );
  }
}

export default new EventService();
