"use client";

import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import eventService from "../../../lib/modules/events/event.service";
import AnimatedContainer from "../../../shared/components/ui/AnimatedContainer";
import AnimatedLeftSection from "../../../shared/components/ui/AnimateLeftSection";
import { useEventDetailsZustand } from "../hooks/useEventDetailsZustand";
import { useEventFiltersZustand } from "../hooks/useEventFiltersZustand";
import EventsDetails from "./EventsDetails";
import EventsList from "./EventsList";
import EventsSearch from "./EventsSearch";

export default function Events() {
  const { isOpen } = useEventDetailsZustand();
  const { filters, setAvailableHashtags } = useEventFiltersZustand();

  useEffect(() => {
    console.log(filters.hashTags);
  }, [filters]);

  const { data: events, isLoading: isEventsLoading } = useQuery({
    queryKey: ["fetch all events by admin", filters],
    queryFn: () => eventService.getAll(filters),
    select: ({ data }) => data,
  });

  useEffect(() => {
    if (events) {
      const allTags = events.flatMap((event) => event.hashTags || []);
      const uniqueTags = Array.from(new Set(allTags));
      setAvailableHashtags(uniqueTags);
    }
  }, [events, setAvailableHashtags]);

  return (
    <div className="w-full h-fit text-white">
      <h1 className="font-brain text-2xl mb-4">Dashboard</h1>
      <EventsSearch />
      <AnimatedContainer>
        <AnimatedLeftSection isOpen={isOpen}>
          <EventsList events={events} isLoading={isEventsLoading} />
        </AnimatedLeftSection>
        <EventsDetails />
      </AnimatedContainer>
    </div>
  );
}
