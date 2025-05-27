import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import toast from "react-hot-toast";
import adminService from "../../../lib/modules/admin/admin.service";
import { useGetAdmins } from "./useGetAdmins";

export function useCreateAdmin() {
  const { refetch } = useGetAdmins();

  const { mutate, isPending } = useMutation({
    mutationKey: ["create admin"],
    mutationFn: () => adminService.createAdmin(),
    onSuccess(data) {
      refetch();
      toast.success("Администратор создан");
    },
    onError(error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message);
      }
    },
  });

  return {
    mutateCreateAdmin: mutate,
    isCreatingAdminPending: isPending,
  };
}
