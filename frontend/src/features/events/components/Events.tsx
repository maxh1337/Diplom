"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { IEvent } from "../../../lib/modules/events/event.types";
import AnimatedContainer from "../../../shared/components/ui/AnimatedContainer";
import AnimatedLeftSection from "../../../shared/components/ui/AnimateLeftSection";
import AnimatedRightSection from "../../../shared/components/ui/AnimateRightSection";
import { useEventDetailsZustand } from "../hooks/useEventDetailsZustand";
import { useEventFiltersZustand } from "../hooks/useEventFiltersZustand";
import { useGetEvents } from "../hooks/useGetEvents";
import EventFormModal from "./EventEditCreateFormModal";
import EventsDetails from "./EventsDetails";
import EventsList from "./EventsList";
import EventsSearch from "./EventsSearch";

export default function Events() {
  const {
    isOpen,
    isRightSectionFullScreen,
    openRightSectionFullscreen,
    openEvent,
    closeEvent,
    selectedEvent,
  } = useEventDetailsZustand();
  const { setAvailableHashtags } = useEventFiltersZustand();
  const { events, isEventsLoading, refetch } = useGetEvents();

  useEffect(() => {
    if (events) {
      const allTags = events.flatMap((e) => e.hashTags || []);
      setAvailableHashtags(Array.from(new Set(allTags)));
    }
  }, [events, setAvailableHashtags]);

  useEffect(() => {
    if (events && isOpen && selectedEvent) {
      const updatedEvent = events.find(
        (event) => event.id === selectedEvent.id
      );
      if (updatedEvent) {
        openEvent(updatedEvent);
      } else {
        closeEvent();
      }
    }

    if (eventIdFromQuery && events) {
      const foundEvent = events.find((event) => event.id === eventIdFromQuery);
      if (foundEvent) {
        openEvent(foundEvent);
        openRightSectionFullscreen(false);
      } else {
        closeEvent();
      }
    }
  }, [
    events,
    isOpen,
    selectedEvent,
    openEvent,
    closeEvent,
    openRightSectionFullscreen,
  ]);

  const [isFormOpen, setFormOpen] = useState(false);
  const [editEvent, setEditEvent] = useState<IEvent | undefined>(undefined);

  const openCreate = () => {
    setEditEvent(undefined);
    setFormOpen(true);
  };

  const openEdit = (event: IEvent) => {
    setEditEvent(event);
    setFormOpen(true);
  };

  const handleSuccess = async (evt: IEvent) => {
    await refetch();
  };

  const searchParams = useSearchParams();
  const eventIdFromQuery = searchParams.get("id");

  return (
    <div className="w-full h-fit text-white">
      <h1 className="font-brain text-2xl mb-4">Dashboard</h1>
      <EventsSearch />
      <AnimatedContainer>
        <AnimatedLeftSection
          isOpen={isOpen}
          isRightSectionFullScreen={isRightSectionFullScreen}
        >
          <EventsList
            events={events}
            isLoading={isEventsLoading}
            onAddNew={openCreate}
            openEdit={openEdit}
          />
        </AnimatedLeftSection>
        <AnimatedRightSection
          isOpen={isOpen}
          isRightSectionFullScreen={isRightSectionFullScreen}
          openRightSectionFullscreen={openRightSectionFullscreen}
        >
          <EventsDetails />
        </AnimatedRightSection>
      </AnimatedContainer>
      <EventFormModal
        isOpen={isFormOpen}
        onClose={() => setFormOpen(false)}
        edit={Boolean(editEvent)}
        initialEvent={editEvent}
        onSuccess={handleSuccess}
      />
    </div>
  );
}
