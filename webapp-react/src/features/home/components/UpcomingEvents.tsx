import { useQuery } from "@tanstack/react-query";
import eventService from "../../../lib/modules/event/event.service";
import type { IEventFilters } from "../../../lib/modules/event/event.types";
import Events from "../../events/components/Events";

export default function UpcomingEvents() {
  const filters: IEventFilters = {
    latest: true,
  };

  const { data: events, isLoading: isEventsLoading } = useQuery({
    queryKey: ["fetch latest events", filters],
    queryFn: () => eventService.fetchEvents(filters),
    select: ({ data }) => data,
  });

  return (
    <section className="w-full flex mt-6 flex-col">
      <h1 className="text-white font-brain text-xl">Ближайшие мероприятия</h1>
      <Events events={events} isEventsLoading={isEventsLoading} />
    </section>
  );
}
