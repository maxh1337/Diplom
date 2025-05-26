"use client";

import { useEffect, useState } from "react";
import Button from "../../../shared/components/ui/Button";
import { useUserZustand } from "../../../shared/hooks/useUserZustand";
import { useUpdateAdminFields } from "../hooks/useUpdateAdminFields";

export default function Settings() {
  const { admin } = useUserZustand();
  const { mutateUpdate, isUpdating } = useUpdateAdminFields();

  const [username, setUsername] = useState("");
  const [phone, setPhone] = useState("");

  useEffect(() => {
    if (admin?.username) {
      setUsername(admin.username);
    }
  }, [admin]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutateUpdate({ username });
  };

  return (
    <div className="w-full px-6 py-10 rounded-2xl h-full bg-secondary">
      <h1 className="text-2xl font-semibold mb-6 text-fourth">
        Настройки администратора
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6 max-w-xl">
        <div>
          <label className="block text-sm font-medium mb-1 text-fourth">
            Логин
          </label>
          <input
            type="text"
            value={admin?.login || "—"}
            disabled
            className="w-full px-4 py-2 border rounded-lg bg-gray-800 text-gray-400"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1 text-fourth">
            Username
          </label>
          <input
            type="text"
            value={username}
            placeholder={admin?.username ? "" : "Введите имя пользователя"}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg text-white bg-third border-fourth"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1 text-fourth">
            Телефон (для 2FA в будущем)
          </label>
          <input
            type="tel"
            placeholder="+7 (___) ___-__-__"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg text-white bg-third border-fourth"
          />
        </div>
        <Button
          type="submit"
          disabled={isUpdating}
          variant="second"
          className="text-white font-brain"
          style={{
            opacity: isUpdating ? 0.6 : 1,
          }}
        >
          {isUpdating ? "Сохранение..." : "Сохранить"}
        </Button>
      </form>
    </div>
  );
}
