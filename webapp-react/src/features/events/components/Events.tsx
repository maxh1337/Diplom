import type { IEvent } from "../../../lib/modules/event/event.types";
import Event from "./Event";
import EventItemSkeleton from "./skeletons/EventItemSkeleton";

interface EventsProps {
  events: IEvent[] | undefined;
  isEventsLoading: boolean;
}

export default function Events({ events, isEventsLoading }: EventsProps) {
  return (
    <div className="w-full">
      {isEventsLoading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, idx) => (
            <EventItemSkeleton key={idx} />
          ))}
        </div>
      ) : (
        events?.map((event) => <Event eventId={event.id} key={event.id} />)
      )}
    </div>
  );
}
