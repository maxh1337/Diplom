import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import toast from "react-hot-toast";
import userService from "../../../lib/modules/user/user.service";
import { useGetUsers } from "./useGetUsers";

export function useDeleteUser() {
  const { refetch } = useGetUsers();

  const { mutate: mutateDeleteUser, isPending: isDeletionUserPending } =
    useMutation({
      mutationKey: ["delete user"],
      mutationFn: (userId: string) => userService.deleteUser(userId),
      async onSuccess() {
        await refetch();
        toast.success("Вы успешно удалили пользователя");
      },
      onError(error) {
        if (axios.isAxiosError(error)) {
          toast.error(error.response?.data?.message);
        }
      },
    });

  return { mutateDeleteUser, isDeletionUserPending };
}
