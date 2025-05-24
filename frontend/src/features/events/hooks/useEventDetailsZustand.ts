import { create } from "zustand";
import { IEvent } from "../../../lib/modules/events/event.types";

type EventDetailsZustand = {
  isOpen: boolean;
  selectedEvent: IEvent | null;
  openEvent: (event: IEvent) => void;
  closeEvent: () => void;
};

export const useEventDetailsZustand = create<EventDetailsZustand>((set) => ({
  isOpen: false,
  selectedEvent: null,
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
