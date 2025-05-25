"use client";

import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import toast from "react-hot-toast";
import eventService from "../../../lib/modules/events/event.service";
import { useGetEvents } from "./useGetEvents";

export function useUpdateEvent() {
  const { refetch } = useGetEvents();

  const { mutate: mutateUpdate, isPending: isUpdatePending } = useMutation({
    mutationKey: ["update event date"],
    mutationFn: ({ eventId, data }: { eventId: string; data: FormData }) =>
      eventService.updateEvent(eventId, data),
    async onSuccess() {
      await refetch();
      toast.success("Вы обновили мероприятие");
    },
    onError(error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message);
      }
    },
  });

  return { mutateUpdate, isUpdatePending };
}
