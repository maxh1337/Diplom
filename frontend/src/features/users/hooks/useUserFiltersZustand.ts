import { create } from "zustand";
import { IUserFilters } from "../../../lib/modules/user/user.types";

type UserFiltersZustand = {
  filters: IUserFilters;
  setFilters: (filters: IUserFilters) => void;
  updateFilter: (
    key: keyof IUserFilters,
    value: IUserFilters[keyof IUserFilters]
  ) => void;
  resetFilters: () => void;
};

export const useUserFiltersZustand = create<UserFiltersZustand>((set) => ({
  filters: {},
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
