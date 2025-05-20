"use client";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import userService from "../../../lib/modules/user/user.service";
import type {
  IContinueRegistration,
  IUser,
} from "../../../lib/modules/user/user.types";
import { useUserZustand } from "../../../shared/hooks/useUserZustand";

export function useContinueRegistration() {
  const { setUser } = useUserZustand();

  const {
    mutate: continueRegistration,
    isPending,
    isSuccess,
  } = useMutation({
    mutationKey: ["update-phone"],
    mutationFn: async (
      dto: IContinueRegistration
    ): Promise<{ data: IUser }> => {
      return userService.continueRegistration(dto);
    },
    onSuccess: (response) => {
      toast.success("Registered successfully!");
      setUser(response?.data);
    },
    onError: (error: Error) => {
      toast.error("Failed to continue registration: " + error.message);
    },
  });

  return { continueRegistration, isPending, isSuccess };
}
