import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import Events from "../../features/events/components/Events";
import EventsSearch from "../../features/events/components/EventsSearch";
import { useEventFiltersStore } from "../../features/events/hooks/useEventsZustand";
import eventService from "../../lib/modules/event/event.service";

export default function EventsPage() {
  const { filters, setAvailableHashtags } = useEventFiltersStore();

  const { data: events, isLoading: isEventsLoading } = useQuery({
    queryKey: ["fetch all events", filters],
    queryFn: () => eventService.fetchEvents(filters),
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
    <section className="w-full flex flex-col items-center h-full pt-5 text-white ">
      <h1 className="text-white font-brain text-xl w-full">Мероприятия</h1>
      <EventsSearch />
      <div className=" pb-17">
        <Events events={events} isEventsLoading={isEventsLoading} />
      </div>
    </section>
  );
}
