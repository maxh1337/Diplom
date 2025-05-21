import { useQuery } from "@tanstack/react-query";
import userService from "../../lib/modules/user/user.service";

export function useGetMyEvents() {
  const {
    data: events,
    isLoading: isEventsLoading,
    isSuccess,
    refetch,
  } = useQuery({
    queryKey: ["fetch my events"],
    queryFn: () => userService.getMyEvents(),
    select: ({ data }) => data,
  });

  return { data: events, isLoading: isEventsLoading, isSuccess, refetch };
}
