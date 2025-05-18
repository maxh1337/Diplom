export interface IEvent {
  id: string;

  image: string;
  title: string;
  description: string;
  hashTags: string[];
  //
  createdAt: string;
  endsAt?: string;
  //
  // participants: IEventUser[];
  participants: number;
  feedback: IEventFeedback[];
}

export interface IEventUser {
  id: string;
}

export interface IEventFeedback {
  id: string;
  rating: number;
}
