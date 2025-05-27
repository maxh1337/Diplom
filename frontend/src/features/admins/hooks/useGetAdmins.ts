"use client";

import { useQuery } from "@tanstack/react-query";
import adminService from "../../../lib/modules/admin/admin.service";
import { useAdminFiltersZustand } from "./useAdminFiltersZustand";

export function useGetAdmins() {
  const { filters } = useAdminFiltersZustand();

  const {
    data: admins,
    isLoading: isAdminsLoading,
    refetch,
  } = useQuery({
    queryKey: ["fetch all admins by FULL admin", filters],
    queryFn: () => adminService.getAllAdmins(filters),
    select: ({ data }) => data,
  });

  return { admins, isAdminsLoading, refetch };
}
