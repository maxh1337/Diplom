import { useState } from "react";
import type { IEvent } from "../../../lib/modules/event/event.types";
import { useDebounce } from "../../../shared/hooks/useDebounce";
import { useShowBottomMenu } from "../../../shared/hooks/useShowBottomMenu";
import EventDetailsPopup from "./EventDetailsPopup";
import EventItem from "./EventItem";

interface EventProps {
  event: IEvent;
}

export default function Event({ event }: EventProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);
  const { setIsVisible } = useShowBottomMenu();

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

  return (
    <>
      <EventItem event={event} open={open} />
      {shouldRender && (
        <EventDetailsPopup event={event} onClose={close} isOpen={isOpen} />
      )}
    </>
  );
}
