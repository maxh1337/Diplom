"use client";

import { useUserZustand } from "./useUserZustand";

export function useProfile() {
  const { admin, isLoading, fetchProfile, logOut } = useUserZustand();

  return {
    admin,
    isLoading,
    refetch: fetchProfile, // Renamed for consistency with previous useProfile
    logOut,
  };
}
