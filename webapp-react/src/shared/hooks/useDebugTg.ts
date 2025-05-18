import { create } from "zustand";

interface DebugTgZustand {
  platform: string;
  isAllowedPlatform: boolean | null;
  setPlatform: (platform: string) => void;
  setIsAllowedPlatform: (isAllowedPlatform: boolean) => void;
}

export const useDebugTgZustand = create<DebugTgZustand>((set) => ({
  platform: "",
  isAllowedPlatform: null,
  setPlatform: (platform) => set({ platform: platform }),
  setIsAllowedPlatform: (isAllowedPlatform) =>
    set({ isAllowedPlatform: isAllowedPlatform }),
}));
