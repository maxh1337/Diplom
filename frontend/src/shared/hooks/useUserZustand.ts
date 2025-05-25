"use client";

import toast from "react-hot-toast";
import { create } from "zustand";

import adminService from "../../lib/modules/admin/admin.service";
import { IAdmin } from "../../lib/modules/admin/admin.types";
import authService from "../../lib/modules/auth/auth.service";
import { transformAdminToState } from "../utils/transform-user-to-state";

interface UserStateZustand {
  admin: IAdmin | null;
  isLoading: boolean;
  hasFetched: boolean;
  setAdmin: (newAdmin: IAdmin) => void;
  setIsLoading: (loading: boolean) => void;
  fetchProfile: () => Promise<void>;
  logOut: () => Promise<void>;
}

export const useUserZustand = create<UserStateZustand>((set) => ({
  admin: null,
  isLoading: false,
  hasFetched: false, // 🔥 добавляем

  setAdmin: (newAdmin) => set({ admin: newAdmin }),
  setIsLoading: (loading) => set({ isLoading: loading }),

  fetchProfile: async () => {
    try {
      set({ isLoading: true });

      const profileRes = await adminService.fetchProfile();
      const profile = profileRes?.data ?? null;
      const userState = profile ? transformAdminToState(profile) : null;
      const admin = profile && userState ? { ...profile, ...userState } : null;

      set({ admin, isLoading: false, hasFetched: true });
    } catch (error: any) {
      if (error?.status === 401) {
        try {
          await authService.getNewTokens();
          const profileRes = await adminService.fetchProfile();
          const profile = profileRes?.data ?? null;
          const userState = profile ? transformAdminToState(profile) : null;
          const admin =
            profile && userState ? { ...profile, ...userState } : null;

          set({ admin, isLoading: false, hasFetched: true });
        } catch (refreshError) {
          toast.error("Session expired. Please log in again.");
          set({ admin: null, isLoading: false, hasFetched: true });
        }
      } else {
        toast.error(error?.data?.message || "Failed to fetch profile");
        set({ admin: null, isLoading: false, hasFetched: true });
      }
    }
  },

  logOut: async () => {
    try {
      set({ isLoading: true });
      await authService.logout();
      set({ admin: null, isLoading: false });
      toast.success("Logged out successfully");
    } catch (error: any) {
      toast.error(error?.data?.message || "Logout failed");
      set({ isLoading: false });
    }
  },
}));
