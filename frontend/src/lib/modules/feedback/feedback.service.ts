import { AxiosResponse } from "axios";
import { instance } from "../../api/axios";
import { IUser } from "../admin/admin.types";

class FeedbackService {
  private _BASE_URL = "/admin/feedback";

  async deleteFeedback(feedbackId: string): Promise<AxiosResponse<IUser>> {
    return instance.delete<IUser>(`${this._BASE_URL}/delete/${feedbackId}`);
  }
}

export default new FeedbackService();
