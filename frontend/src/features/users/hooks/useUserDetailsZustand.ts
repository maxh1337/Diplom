import { create } from "zustand";
import { IUser } from "../../../lib/modules/admin/admin.types";

type UserDetailsZustand = {
  isOpen: boolean;
  isRightSectionFullScreen: boolean;
  openRightSectionFullscreen: (isRightSectionFullScreen: boolean) => void;
  selectedUser: IUser | null;
  openUser: (user: IUser) => void;
  closeUser: () => void;
};

export const useUserDetailsZustand = create<UserDetailsZustand>((set) => ({
  isOpen: false,
  selectedUser: null,
  isRightSectionFullScreen: false,
  openRightSectionFullscreen: (isRightSectionFullScreen) =>
    set({ isRightSectionFullScreen: isRightSectionFullScreen }),
  openUser: (user) =>
    set({
      isOpen: true,
      selectedUser: user,
    }),
  closeUser: () =>
    set({
      isOpen: false,
      selectedUser: null,
    }),
}));
