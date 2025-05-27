import { useEffect } from "react";
import Events from "../../features/events/components/Events";
import EventsSearch from "../../features/events/components/EventsSearch";
import { useEventFiltersStore } from "../../features/events/hooks/useEventsZustand";
import { useGetEvents } from "../../features/events/hooks/useGetEvents";

export default function EventsPage() {
  const { setAvailableHashtags } = useEventFiltersStore();
  const { events, isEventsLoading } = useGetEvents();

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
      <div className="w-full pb-17">
        <Events events={events} isEventsLoading={isEventsLoading} />
      </div>
    </section>
  );
}
