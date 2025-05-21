import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useLocation } from "react-router-dom";
import eventService from "../../../lib/modules/event/event.service";
import { useShowBottomMenu } from "../../../shared/hooks/useShowBottomMenu";
import EventDetailsPopup from "./EventDetailsPopup";
import EventItem from "./EventItem";
import EventDetailsPopupSkeleton from "./skeletons/EventDetailPopupSkeleton";
import { useGetMyEvents } from "../../../shared/hooks/useGetMyEvents";

interface EventProps {
  eventId: string;
}

export default function Event({ eventId }: EventProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);
  const { setIsVisible } = useShowBottomMenu();
  const { refetch } = useGetMyEvents();
  const pathname = useLocation().pathname;

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

  const close = async () => {
    setIsOpen(false);
    setIsVisible(true);

    setTimeout(() => {
      setShouldRender(false);
    }, 1000);

    if (pathname === "/profile") {
      console.log("/profile");
      await refetch();
    }
  };

  if (!event) return <div>IsLoading</div>;

  return (
    <>
      {/* <p>{pathname}</p> */}
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
