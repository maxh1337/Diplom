import { create } from "zustand";
import { IAdmin } from "../../../lib/modules/admin/admin.types";

type AdminDetailsZustand = {
  isOpen: boolean;
  isRightSectionFullScreen: boolean;
  openRightSectionFullscreen: (isRightSectionFullScreen: boolean) => void;
  selectedAdmin: IAdmin | null;
  openAdmin: (admin: IAdmin) => void;
  closeAdmin: () => void;
};

export const useAdminDetailsZustand = create<AdminDetailsZustand>((set) => ({
  isOpen: false,
  selectedAdmin: null,
  isRightSectionFullScreen: false,
  openRightSectionFullscreen: (isRightSectionFullScreen) =>
    set({ isRightSectionFullScreen: isRightSectionFullScreen }),
  openAdmin: (admin) =>
    set({
      isOpen: true,
      selectedAdmin: admin,
    }),
  closeAdmin: () =>
    set({
      isOpen: false,
      selectedAdmin: null,
    }),
}));
