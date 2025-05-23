import type { IEvent } from "../../../lib/modules/event/event.types";
import EventItem from "./EventItem";
import EventItemSkeleton from "./EventItemSkeleton";

interface EventsProps {
  events: IEvent[] | undefined;
  isEventsLoading: boolean;
}

export default function Events({ events, isEventsLoading }: EventsProps) {
  console.log(events);
  return (
    <div className="w-full flex flex-col">
      {isEventsLoading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, idx) => (
            <EventItemSkeleton key={idx} />
          ))}
        </div>
      ) : (
        events?.map((event) => <EventItem event={event} key={event.id} />)
      )}
    </div>
  );
}
