import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import Event from "../../features/event/components/Event";
import EventSkeleton from "../../features/event/components/EventSkeleton";
import eventService from "../../lib/modules/event/event.service";

function EventPage() {
  const { id } = useParams();

  if (!id) return null;

  const {
    data: event,
    isLoading: isEventLoading,
    refetch: refetchEvent,
  } = useQuery({
    queryKey: ["fetch event by id", id],
    queryFn: () => eventService.fetchEventById(id),
    select: ({ data }) => data,
  });

  return (
    // <div className=" w-full pb-17">
    <div className=" text-white w-full pb-17">
      {isEventLoading ? (
        <EventSkeleton />
      ) : event ? (
        <Event event={event} refetchEvent={refetchEvent} />
      ) : (
        <div></div>
      )}
    </div>
    // </div>
  );
}

export default EventPage;
