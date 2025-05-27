import { create } from "zustand";
import { IAdminFilters } from "../../../lib/modules/admin/admin.types";

type AdminFiltersZustand = {
  filters: IAdminFilters;
  setFilters: (filters: IAdminFilters) => void;
  updateFilter: (
    key: keyof IAdminFilters,
    value: IAdminFilters[keyof IAdminFilters]
  ) => void;
  resetFilters: () => void;
};

export const useAdminFiltersZustand = create<AdminFiltersZustand>((set) => ({
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
