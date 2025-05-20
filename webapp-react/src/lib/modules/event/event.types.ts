import type { IUser } from "../user/user.types";

export interface IEvent {
  id: string;

  image?: IEventImage;
  title: string;
  description: string;
  hashTags: string[];
  //
  createdAt: Date;
  eventDate: Date;
  eventTime: string;
  //
  participants: IEventUser[];
  feedback: IEventFeedback[];
}

export interface IEventUser {
  id: string;
}

export interface IEventFeedback {
  id: string;

  rating: number;
  comment?: string;

  eventId: string;
  commentator: IUser;
}

export interface IEventImage {
  id: string;
  path: string;
  createdAt: Date;

  eventId: string;
}

export interface IEventFilters {
  title?: string;
  hashTags?: string[];
  latest?: boolean;
}
