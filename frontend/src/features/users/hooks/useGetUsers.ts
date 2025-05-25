"use client";

import { useQuery } from "@tanstack/react-query";
import userService from "../../../lib/modules/user/user.service";
import { useUserFiltersZustand } from "./useUserFiltersZustand";

export function useGetUsers() {
  const { filters } = useUserFiltersZustand();

  const {
    data: users,
    isLoading: isUsersLoading,
    refetch,
  } = useQuery({
    queryKey: ["fetch all users by admin", filters],
    queryFn: () => userService.getAllUsers(filters),
    select: ({ data }) => data,
  });

  return { users, isUsersLoading, refetch };
}
