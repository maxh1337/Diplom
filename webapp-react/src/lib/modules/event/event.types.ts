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

  isActive: boolean;
}

export interface IEventUser {
  id: string;
}

export interface IEventFeedback {
  id: string;

  rating: number;
  comment?: string;

  eventId: string;
  userId: string;
  // user: IUser;
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
