import { IEvent, IFeedback } from "../events/event.types";

export const AdminRole = {
  PART: "PART",
  FULL: "FULL",
} as const;
export type AdminRole = (typeof AdminRole)[keyof typeof AdminRole];

export const UserCategory = {
  SchoolBefore9: "SchoolBefore9",
  SchoolFrom9to11: "SchoolFrom9to11",
  Student: "Student",
} as const;
export type UserCategory = (typeof UserCategory)[keyof typeof UserCategory];

export interface IAdmin {
  id: string;
  username?: string | null;
  login: string;
  password: string;
  rights: AdminRole[];
  createdEvents: IEvent[];
}

export interface IUser {
  id: string;
  telegramId: string;
  telegramUsername: string;
  telegramFirstName?: string | null;
  telegramLastName?: string | null;
  createdAt: Date;
  nickname?: string | null;
  userCategory: UserCategory;
  yearOfBirth?: number | null;
  events: IEvent[];
  Feedback: IFeedback[];
  photoUrl?: string | null;
}
