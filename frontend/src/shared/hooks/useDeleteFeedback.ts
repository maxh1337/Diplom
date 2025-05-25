import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import toast from "react-hot-toast";
import { useGetUsers } from "../../features/users/hooks/useGetUsers";
import feedbackService from "../../lib/modules/feedback/feedback.service";

export function useDeleteFeedback() {
  const { refetch } = useGetUsers();

  const { mutate: mutateDeleteFeedback, isPending: isDeletionFeedbackPending } =
    useMutation({
      mutationKey: ["delete feedback"],
      mutationFn: (feedbackId: string) =>
        feedbackService.deleteFeedback(feedbackId),
      async onSuccess() {
        await refetch();
        toast.success("Вы успешно удалили отзыв");
      },
      onError(error) {
        if (axios.isAxiosError(error)) {
          toast.error(error.response?.data?.message);
        }
      },
    });

  return { mutateDeleteFeedback, isDeletionFeedbackPending };
}
