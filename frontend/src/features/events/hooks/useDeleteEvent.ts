"use client";

import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import toast from "react-hot-toast";
import eventService from "../../../lib/modules/events/event.service";
import { useGetEvents } from "./useGetEvents";

export function useDeleteEvent() {
  const { refetch } = useGetEvents();

  const { mutate: mutateDelete, isPending: isDeletePending } = useMutation({
    mutationKey: ["delete event"],
    mutationFn: (eventId: string) => eventService.deleteEvent(eventId),
    async onSuccess() {
      await refetch();
      toast.success("Вы успешно удалили мероприятие");
    },
    onError(error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message);
      }
    },
  });

  return { mutateDelete, isDeletePending };
}
