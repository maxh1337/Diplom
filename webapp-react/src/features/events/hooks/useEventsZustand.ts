import { create } from "zustand";
import type { IEventFilters } from "../../../lib/modules/event/event.types";

type EventFiltersStore = {
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

export const useEventFiltersStore = create<EventFiltersStore>((set) => ({
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
