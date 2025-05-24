import { create } from "zustand";
import { IEventFilters } from "../../../lib/modules/events/event.types";

type EventFiltersZustand = {
  filters: IEventFilters;
  availableHashtags: string[];
  setAvailableHashtags: (availableHashtags: string[]) => void;
  setFilters: (filters: IEventFilters) => void;
  updateFilter: (
    key: keyof IEventFilters,
    value: IEventFilters[keyof IEventFilters]
  ) => void;
  resetFilters: () => void;
};

export const useEventFiltersZustand = create<EventFiltersZustand>((set) => ({
  filters: {},
  availableHashtags: [],
  setAvailableHashtags: (availableHashtags) => set({ availableHashtags }),
  setFilters: (filters) => set({ filters }),
  updateFilter: (key, value) =>
    set((state) => ({
      filters: {
        ...state.filters,
        [key]: value,
      },
    })),
  resetFilters: () => set({ filters: {} }),
}));
