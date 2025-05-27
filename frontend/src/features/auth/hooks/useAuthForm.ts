"use client";

import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useRef, useTransition } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import authService from "../../../lib/modules/auth/auth.service";
import { IFormData } from "../../../lib/modules/auth/auth.types";
import { ADMIN_PAGES } from "../../../shared/config/pages/admin.config";
import { useUserZustand } from "../../../shared/hooks/useUserZustand";

export function useAuthForm() {
  const { register, handleSubmit, reset } = useForm<IFormData>();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const { fetchProfile } = useUserZustand();
  const recaptchaRef = useRef<ReCAPTCHA>(null);

  const { mutate: mutateLogin, isPending: isLoginPending } = useMutation({
    mutationKey: ["login"],
    mutationFn: (data: IFormData) =>
      authService.login(data, recaptchaRef.current?.getValue()),
    onSuccess() {
      fetchProfile();
      startTransition(() => {
        reset();
        router.push(ADMIN_PAGES.HOME);
        toast.success("Вы успешно вошли");
      });
    },
    onError(error) {
      if (axios.isAxiosError(error)) {
        toast.error("Ошибка: ", error.response?.data?.message);
      }
    },
  });

  const onSubmit: SubmitHandler<IFormData> = (data) => {
    const token = recaptchaRef.current?.getValue();
    if (!token) {
      toast.error("Пожалуйста заполните капчу");
      return;
    }
    mutateLogin(data);
  };

  const isLoading = isPending || isLoginPending;

  return {
    register,
    handleSubmit,
    onSubmit,
    recaptchaRef,
    isLoading,
  };
}
