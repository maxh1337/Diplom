import { create } from "zustand";
import { IEvent } from "../../../lib/modules/events/event.types";

type EventDetailsZustand = {
  isOpen: boolean;
  isRightSectionFullScreen: boolean;
  openRightSectionFullscreen: (isRightSectionFullScreen: boolean) => void;
  selectedEvent: IEvent | null;
  openEvent: (event: IEvent) => void;
  closeEvent: () => void;
};

export const useEventDetailsZustand = create<EventDetailsZustand>((set) => ({
  isOpen: false,
  selectedEvent: null,
  isRightSectionFullScreen: false,
  openRightSectionFullscreen: (isRightSectionFullScreen) =>
    set({ isRightSectionFullScreen: isRightSectionFullScreen }),
  openEvent: (event) =>
    set({
      isOpen: true,
      selectedEvent: event,
    }),
  closeEvent: () =>
    set({
      isOpen: false,
      selectedEvent: null,
    }),
}));
