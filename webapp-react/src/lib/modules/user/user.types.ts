import type { IEvent } from "../event/event.types";

export interface IUser {
  id: string;
  telegramId: string;
  telegramUsername: string;
  telegramFirstName: string;
  telegramLastName: string;
  createdAt: string;
  //
  nickname?: string;
  useCategory: UserCategoryType;
  yearOfBirth?: number;
  //
  events: IEvent[];
  photoUrl: string;
}

export interface IContinueRegistration {
  nickname: string;
  userCategory: UserCategoryType;
  yearOfBirth: number;
}

export const UserCategoryType = {
  SchoolBefore9: "SchoolBefore9",
  SchoolFrom9to11: "SchoolFrom9to11",
  Student: "Student",
} as const;

export type UserCategoryType =
  (typeof UserCategoryType)[keyof typeof UserCategoryType];

export interface IMyEvents {
  upcomingEvents: IEvent[];
  pastEvents: IEvent[];
}
