"use client";

import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import toast from "react-hot-toast";
import eventService from "../../../lib/modules/events/event.service";
import { useGetEvents } from "./useGetEvents";

export function useCreateEvent() {
  const { refetch } = useGetEvents();

  const { mutate: mutateCreate, isPending: isCreating } = useMutation({
    mutationKey: ["create event"],
    mutationFn: (data: FormData) => eventService.createEvent(data),
    async onSuccess() {
      await refetch();
      toast.success("Вы успешно создали новое мероприятие");
    },
    onError(error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message);
      }
    },
  });

  return { mutateCreate, isCreating };
}
