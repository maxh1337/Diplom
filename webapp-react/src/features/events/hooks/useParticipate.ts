import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import eventService from "../../../lib/modules/event/event.service";

export function useParticipate() {
  const {
    mutate: toggleParticipation,
    isPending,
    isSuccess,
  } = useMutation({
    mutationKey: ["toggle-participation"],
    mutationFn: async (eventId: string) => {
      return await eventService.toggleEventParticipation(eventId);
    },
    onSuccess: () => {
      toast.success("Success");
    },
    onError: (error: Error) => {
      toast.error("Failed to send request: " + error.message);
    },
  });

  return { toggleParticipation, isPending, isSuccess };
}
