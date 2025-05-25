"use client";

import { useEffect, useState } from "react";
import AnimatedContainer from "../../../shared/components/ui/AnimatedContainer";

import { IEvent } from "../../../lib/modules/events/event.types";
import AnimatedLeftSection from "../../../shared/components/ui/AnimateLeftSection";
import { useEventDetailsZustand } from "../hooks/useEventDetailsZustand";
import { useEventFiltersZustand } from "../hooks/useEventFiltersZustand";
import { useGetEvents } from "../hooks/useGetEvents";
import EventFormModal from "./EventEditCreateFormModal";
import EventsDetails from "./EventsDetails";
import EventsList from "./EventsList";
import EventsSearch from "./EventsSearch";

export default function Events() {
  const { isOpen } = useEventDetailsZustand();
  const { setAvailableHashtags } = useEventFiltersZustand();
  const { events, isEventsLoading, refetch } = useGetEvents();

  // Хук для тегов
  useEffect(() => {
    if (events) {
      const allTags = events.flatMap((e) => e.hashTags || []);
      setAvailableHashtags(Array.from(new Set(allTags)));
    }
  }, [events, setAvailableHashtags]);

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

  return (
    <div className="w-full h-fit text-white">
      <h1 className="font-brain text-2xl mb-4">Dashboard</h1>
      <EventsSearch />
      <AnimatedContainer>
        <AnimatedLeftSection isOpen={isOpen}>
          <EventsList
            events={events}
            isLoading={isEventsLoading}
            onAddNew={openCreate}
            openEdit={openEdit}
          />
        </AnimatedLeftSection>
        <EventsDetails />
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
