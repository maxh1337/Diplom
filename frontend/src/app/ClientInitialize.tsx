"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useUserZustand } from "../shared/hooks/useUserZustand";

export default function ClientInitialize() {
  const { fetchProfile, admin, isLoading, hasFetched } = useUserZustand();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  useEffect(() => {
    if (!hasFetched || isLoading) return;

    if (pathname === "/") {
      router.replace("/auth");
      return;
    }

    if (admin === null && pathname !== "/auth") {
      router.replace("/auth");
    }
  }, [admin, hasFetched, isLoading, pathname, router]);

  return null;
}
