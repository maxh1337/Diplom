"use client";

import { useQuery } from "@tanstack/react-query";
import eventService from "../../../lib/modules/events/event.service";
import { useEventFiltersZustand } from "./useEventFiltersZustand";

export function useGetEvents() {
  const { filters, setAvailableHashtags } = useEventFiltersZustand();

  const {
    data: events,
    isLoading: isEventsLoading,
    refetch,
  } = useQuery({
    queryKey: ["fetch all events by admin", filters],
    queryFn: () => eventService.getAll(filters),
    select: ({ data }) => data,
  });

  return { events, isEventsLoading, refetch };
}
