import { create } from "zustand";

interface ShowBottomMenuZustand {
  isVisible: boolean;
  setIsVisible: (isVisible: boolean) => void;
}

export const useShowBottomMenu = create<ShowBottomMenuZustand>((set) => ({
  isVisible: true,
  setIsVisible: (isVisible) => set({ isVisible: isVisible }),
}));
