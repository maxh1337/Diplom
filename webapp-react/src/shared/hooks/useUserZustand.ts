"use client";

import toast from "react-hot-toast";
import { create } from "zustand";

import userService from "../../lib/modules/user/user.service";
import type { IUser } from "../../lib/modules/user/user.types";

interface UserStateZustand {
  user: IUser | null;
  initData: string | null;
  isLoading: boolean;
  setUser: (newUser: IUser) => void;
  setInitData: (initData: string) => void;
  fetchProfile: (initData: string) => Promise<void>;
}

export const useUserZustand = create<UserStateZustand>((set) => ({
  user: null,
  initData: null,
  isLoading: false,
  setUser: (newUser) => set({ user: newUser }),
  setInitData: (initData) => set({ initData: initData }),
  fetchProfile: async (initData: string) => {
    try {
      set({ isLoading: true });

      const profileRes = await userService.fetchProfile(initData);

      const profile = profileRes?.data ?? null;

      set({ user: profile, isLoading: false });
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to fetch profile");
      console.log("ErrorZustand", error);
      set({ user: null, isLoading: false });
    }
  },
}));
