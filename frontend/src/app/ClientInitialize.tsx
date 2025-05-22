"use client";

import { useEffect } from "react";
import { getInitialProfile } from "../lib/modules/server-actions/utils/get-initial-profile";
import { useUserZustand } from "../shared/hooks/useUserZustand";

export default function ClientInitialize() {
  const { fetchProfile, setAdmin } = useUserZustand();

  useEffect(() => {
    const initializeProfile = async () => {
      const { hasTokens } = await getInitialProfile();

      if (hasTokens) {
        await fetchProfile();
      }
    };

    initializeProfile();
  }, [fetchProfile, setAdmin]);

  return null;
}
