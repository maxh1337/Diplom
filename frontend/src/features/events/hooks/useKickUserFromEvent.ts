import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import toast from "react-hot-toast";
import eventService from "../../../lib/modules/events/event.service";
import { useGetEvents } from "./useGetEvents";

export function useKickUserFromEvent() {
  const { refetch } = useGetEvents();

  const { mutate: mutateKickUser, isPending: isKickUserPending } = useMutation({
    mutationKey: ["create event"],
    mutationFn: ({ eventId, userId }: { eventId: string; userId: string }) =>
      eventService.kickUserFromEvent(eventId, userId),
    async onSuccess() {
      refetch();
      toast.success("Вы успешно исключили пользователя из ивента");
    },
    onError(error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message);
      }
    },
  });

  return { mutateKickUser, isKickUserPending };
}
