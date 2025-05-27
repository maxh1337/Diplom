import { useQuery } from "@tanstack/react-query";
import eventService from "../../../lib/modules/event/event.service";
import { useEventFiltersStore } from "./useEventsZustand";

export function useGetEvents() {
  const { filters } = useEventFiltersStore();

  const {
    data: events,
    isLoading: isEventsLoading,
    refetch,
  } = useQuery({
    queryKey: ["fetch all events", filters],
    queryFn: () => eventService.fetchEvents(filters),
    select: ({ data }) => data,
  });

  return { events, isEventsLoading, refetch };
}
