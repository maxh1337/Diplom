"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { useState } from "react";
import { useCreateAdmin } from "../hooks/useCreateNewAdmin";

interface Props {
  open: boolean;
  onClose: () => void;
}

export function CreateAdminPopup({ open, onClose }: Props) {
  const [step, setStep] = useState<"confirm" | "result">("confirm");
  const [loginData, setLoginData] = useState<{
    login: string;
    password: string;
  } | null>(null);

  const { mutateCreateAdmin, isCreatingAdminPending } = useCreateAdmin();

  const handleCreate = () => {
    mutateCreateAdmin(undefined, {
      onSuccess: (data) => {
        setLoginData({
          login: data.data.login,
          password: data.data.password,
        });
        setStep("result");
      },
    });
  };

  const handleClose = () => {
    setStep("confirm");
    setLoginData(null);
    onClose();
  };

  const isBlockingClose = step === "result";

  return (
    <Dialog.Root
      open={open}
      onOpenChange={isBlockingClose ? () => {} : onClose}
    >
      <Dialog.Portal>
        <Dialog.Overlay className="bg-black/50 fixed inset-0 z-40" />
        <Dialog.Content className="fixed z-50 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-zinc-900 p-6 rounded-xl shadow-xl w-[90%] max-w-md text-white font-brain">
          {step === "confirm" && (
            <>
              <Dialog.Title className="text-xl mb-4">
                Создание администратора
              </Dialog.Title>
              <p className="mb-6 text-white/80">
                Вы уверены, что хотите создать нового администратора?
              </p>
              <div className="flex justify-end gap-3">
                <button
                  className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-600"
                  onClick={onClose}
                >
                  Отмена
                </button>
                <button
                  className="px-4 py-2 bg-green-600 rounded hover:bg-green-500"
                  onClick={handleCreate}
                  disabled={isCreatingAdminPending}
                >
                  {isCreatingAdminPending ? "Создание..." : "Создать"}
                </button>
              </div>
            </>
          )}

          {step === "result" && loginData && (
            <>
              <Dialog.Title className="text-xl mb-4">
                Администратор создан
              </Dialog.Title>
              <p className="mb-2">
                <strong>Логин:</strong> {loginData.login}
              </p>
              <p className="mb-4">
                <strong>Пароль:</strong> {loginData.password}
              </p>
              <p className="text-sm text-yellow-400 mb-4">
                ⚠️ Эти данные больше не будут доступны. Пожалуйста, сохраните
                их.
              </p>
              <div className="flex justify-end gap-3">
                <button
                  className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-500"
                  onClick={handleClose}
                >
                  Я сохранил данные
                </button>
              </div>
            </>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
