import { IAdmin, IUser } from "../admin/admin.types";

export interface IEvent {
  id: string;
  image?: IEventImage | null;
  title: string;
  description: string;
  hashTags: string[];
  createdAt: Date;
  eventDate: Date;
  eventTime: string;
  administrator: IAdmin;
  adminId: string;
  feedback: IFeedback[];
  participants: IUser[];
  isActive: boolean;
}

export interface IEventImage {
  id: string;
  path: string;
  createdAt: Date;
  eventId: string;
  event: IEvent;
}

export interface IFeedback {
  id: string;
  createdAt: Date;
  rating: number;
  comment?: string | null;
  event: IEvent;
  eventId: string;
  user: IUser;
  userId: string;
}
