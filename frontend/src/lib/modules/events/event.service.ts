import { AxiosResponse } from "axios";
import qs from "qs";
import { instance } from "../../api/axios";
import { IEvent, IEventFilters } from "./event.types";

class EventsService {
  private _BASE_URL = "/admin/event";

  async getAll(filters?: IEventFilters): Promise<AxiosResponse<IEvent[]>> {
    return instance.get<IEvent[]>(`${this._BASE_URL}/get-all`, {
      params: filters,
      paramsSerializer: (params) =>
        qs.stringify(params, { arrayFormat: "repeat" }),
    });
  }

  async createEvent(data: FormData): Promise<AxiosResponse<IEvent>> {
    return instance.post<IEvent>(`${this._BASE_URL}/create`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  }

  async getById(id: string): Promise<AxiosResponse<IEvent>> {
    return instance.get<IEvent>(`${this._BASE_URL}/${id}`);
  }

  async updateEvent(
    id: string,
    data: FormData
  ): Promise<AxiosResponse<IEvent>> {
    return instance.patch<IEvent>(`${this._BASE_URL}/update/${id}`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  }

  async deleteEvent(id: string): Promise<AxiosResponse<void>> {
    return instance.delete<void>(`${this._BASE_URL}/delete/${id}`);
  }

  async kickUserFromEvent(
    eventId: string,
    userId: string
  ): Promise<AxiosResponse<void>> {
    return instance.delete<void>(`${this._BASE_URL}/${eventId}/kick/${userId}`);
  }
}

export default new EventsService();
