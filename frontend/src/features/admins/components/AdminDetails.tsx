"use client";

import { User } from "lucide-react";
import Image from "next/image";
import { twMerge } from "tailwind-merge";
import { IAdmin } from "../../../lib/modules/admin/admin.types";
import { useAdminDetailsZustand } from "../hooks/useAdminDetailsZustand";
import AdminEventItem from "./AdminEventItem";

export default function AdminDetails() {
  const {
    isOpen,
    selectedAdmin: adminRaw,
    closeAdmin,
    isRightSectionFullScreen,
    openRightSectionFullscreen,
  } = useAdminDetailsZustand();

  const selectedAdmin = adminRaw as unknown as IAdmin;

  if (!isOpen || !selectedAdmin) return null;

  const { login, username, rights, createdEvents } = selectedAdmin;

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-brain font-bold text-2xl ml-10">
          {username || login || "Админ"}
        </h2>
        <button
          className="text-white font-brain hover:underline"
          onClick={() => {
            closeAdmin();
            openRightSectionFullscreen(false);
          }}
        >
          Закрыть
        </button>
      </div>

      <div className="flex flex-col gap-6 mb-6">
        <div
          className={twMerge(
            "flex items-center gap-6",
            isRightSectionFullScreen ? "w-full" : ""
          )}
        >
          <div
            className={twMerge(
              "relative rounded-xl overflow-hidden flex-shrink-0 bg-gray-700",
              isRightSectionFullScreen ? "w-fit h-40" : "w-fit h-32"
            )}
          >
            <Image
              src="/default-user.jpeg"
              alt="Admin avatar"
              width={150}
              height={150}
              className="object-cover"
            />
          </div>
          <div className="flex flex-col justify-start gap-2 font-brain">
            <div className="flex items-center gap-2">
              <User className="w-5 h-5 text-white" />
              <span className="text-gray-400">Логин:</span>
              <span className="text-white">{login}</span>
            </div>
            {username && (
              <div className="flex items-center gap-2">
                <User className="w-5 h-5 text-white" />
                <span className="text-gray-400">Username:</span>
                <span className="text-white">{username}</span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <User className="w-5 h-5 text-white" />
              <span className="text-gray-400">Права:</span>
              <span className="text-white">{rights.join(", ")}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <h3 className="font-brain text-white text-lg mb-2">
          Созданные мероприятия:
        </h3>
        {createdEvents && createdEvents.length > 0 ? (
          <div className="grid gap-3 grid-cols-1">
            {createdEvents.map((event) => (
              <AdminEventItem key={event.id} event={event} />
            ))}
          </div>
        ) : (
          <p className="text-white/70 font-brain">Мероприятий пока нет</p>
        )}
      </div>
    </>
  );
}
