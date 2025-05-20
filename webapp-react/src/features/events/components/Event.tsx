import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import eventService from "../../../lib/modules/event/event.service";
import { useDebounce } from "../../../shared/hooks/useDebounce";
import { useShowBottomMenu } from "../../../shared/hooks/useShowBottomMenu";
import EventDetailsPopup from "./EventDetailsPopup";
import EventItem from "./EventItem";
import EventDetailsPopupSkeleton from "./skeletons/EventDetailPopupSkeleton";

interface EventProps {
  eventId: string;
}

export default function Event({ eventId }: EventProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);
  const { setIsVisible } = useShowBottomMenu();

  const {
    data: event,
    isLoading: isEventLoading,
    refetch: refetchEvent,
  } = useQuery({
    queryKey: ["fetch event by id", eventId],
    queryFn: () => eventService.fetchEventById(eventId),
    select: ({ data }) => data,
  });

  const open = () => {
    setShouldRender(true);
    setIsOpen(true);
    setIsVisible(false);
  };

  const close = () => {
    setIsOpen(false);
    setIsVisible(true);
    useDebounce(() => setShouldRender(false), 1000);
  };

  if (!event) return <div>IsLoading</div>;

  return (
    <>
      <EventItem event={event} open={open} />
      {shouldRender &&
        (isEventLoading ? (
          <EventDetailsPopupSkeleton />
        ) : (
          <EventDetailsPopup
            event={event}
            isOpen={isOpen}
            onClose={close}
            refetchEvent={refetchEvent}
          />
        ))}
    </>
  );
}
