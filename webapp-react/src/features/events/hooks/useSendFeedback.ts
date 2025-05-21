import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import eventService from "../../../lib/modules/event/event.service";

export function useSendFeedback() {
  const {
    mutate: sendFeedback,
    isPending,
    isSuccess,
  } = useMutation({
    mutationKey: ["send-feedback"],
    mutationFn: async ({
      rating,
      eventId,
      comment,
    }: {
      rating: number;
      eventId: string;
      comment?: string;
    }) => {
      return eventService.sendFeedback(rating, eventId, comment);
    },
    onSuccess: () => {
      toast.success("Success");
    },
    onError: (error: Error) => {
      toast.error("Failed to send request: " + error.message);
    },
  });

  return { sendFeedback, isPending, isSuccess };
}
