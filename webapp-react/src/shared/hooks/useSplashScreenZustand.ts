import { create } from "zustand";

interface SplashScreenZustand {
  isVisible: boolean;
  setIsVisible: (isVisible: boolean) => void;
}

export const useSplashScreenZustand = create<SplashScreenZustand>((set) => ({
  isVisible: true,
  setIsVisible: (isVisible) => set({ isVisible: isVisible }),
}));
