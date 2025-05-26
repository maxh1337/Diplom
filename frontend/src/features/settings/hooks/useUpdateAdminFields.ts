import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import toast from "react-hot-toast";
import adminService from "../../../lib/modules/admin/admin.service";
import { UpdateAdminProfile } from "../../../lib/modules/admin/admin.types";
import { useUserZustand } from "../../../shared/hooks/useUserZustand";

export function useUpdateAdminFields() {
  const { fetchProfile } = useUserZustand();

  const { mutate: mutateUpdate, isPending: isUpdating } = useMutation({
    mutationKey: ["update admin profile"],
    mutationFn: (dto: UpdateAdminProfile) =>
      adminService.updateAdminProfile(dto),
    async onSuccess() {
      await fetchProfile();
      toast.success("Вы успешно обновили профиль");
    },
    onError(error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message);
      }
    },
  });

  return { mutateUpdate, isUpdating };
}
