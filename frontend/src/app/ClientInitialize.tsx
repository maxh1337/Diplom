"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { getInitialProfile } from "../lib/modules/server-actions/utils/get-initial-profile";
import { useUserZustand } from "../shared/hooks/useUserZustand";

export default function ClientInitialize() {
  const { fetchProfile, setAdmin, admin } = useUserZustand();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (admin === null && pathname !== "/") {
      router.replace("/");
    }
  }, [admin, pathname, router]);

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
