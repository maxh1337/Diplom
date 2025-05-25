"use client";

import { User } from "lucide-react";
import Image from "next/image";
import { twMerge } from "tailwind-merge";
import { IUser } from "../../../lib/modules/admin/admin.types";
import Feedback from "../../../shared/components/ui/Feedback";
import { useUserDetailsZustand } from "../hooks/useUserDetailsZustand";
import UserEventItem from "./UserEventItem";

export default function UserDetails() {
  const {
    isOpen,
    selectedUser: useRaw,
    closeUser,
    isRightSectionFullScreen,
    openRightSectionFullscreen,
  } = useUserDetailsZustand();

  const selectedUser = useRaw as unknown as IUser;

  if (!isOpen || !selectedUser) return null;

  const {
    nickname,
    photoUrl,
    telegramUsername,
    telegramFirstName,
    telegramLastName,
    events,
    feedback,
    userCategory,
  } = selectedUser;

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-brain font-bold text-2xl ml-10">
          {nickname || "Без имени"}
        </h2>
        <button
          className="text-white font-brain hover:underline"
          onClick={() => {
            closeUser();
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
              "relative rounded-xl overflow-hidden flex-shrink-0",
              isRightSectionFullScreen ? "w-fit h-40" : "w-fit h-32"
            )}
          >
            <Image
              src={photoUrl ? `${photoUrl}` : "/default-user.jpeg"}
              alt={`Profile picture of ${nickname || "user"}`}
              width={150}
              height={150}
              className="object-cover"
            />
          </div>
          <div className="flex flex-col justify-start gap-2 font-brain">
            <div className="flex items-center gap-2">
              <User className="w-5 h-5 text-white" />
              <span className="text-gray-400">Username:</span>
              <span className="text-white">
                {telegramUsername || "Не указан"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <User className="w-5 h-5 text-white" />
              <span className="text-gray-400">Имя:</span>
              <span className="text-white">
                {telegramFirstName || "Не указано"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <User className="w-5 h-5 text-white" />
              <span className="text-gray-400">Фамилия:</span>
              <span className="text-white">
                {telegramLastName || "Не указано"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <User className="w-5 h-5 text-white" />
              <span className="text-gray-400">Фамилия:</span>
              <span className="text-white">{userCategory || "Не указано"}</span>
            </div>
          </div>
        </div>
      </div>

      {isRightSectionFullScreen ? (
        <div className="flex gap-6 mb-4">
          <div className="w-1/2">
            <h3 className="font-brain text-white text-lg mb-2">Мероприятия:</h3>
            {events && events.length > 0 ? (
              <div className="grid gap-3 grid-cols-1">
                {events.map((event) => (
                  <UserEventItem
                    key={event.id}
                    event={event}
                    userId={selectedUser.id}
                  />
                ))}
              </div>
            ) : (
              <p className="text-white/70 font-brain">Мероприятий нет</p>
            )}
          </div>

          <div className="w-1/2">
            <h3 className="font-brain text-white text-lg mb-2">Отзывы:</h3>
            {feedback && feedback.length > 0 ? (
              <div className="space-y-3">
                {feedback.map((fb, index) => (
                  <Feedback key={index} feedback={fb} variant="user-page" />
                ))}
              </div>
            ) : (
              <p className="text-white/70 font-brain">Отзывов пока нет</p>
            )}
          </div>
        </div>
      ) : (
        <>
          <div className="mb-6">
            <h3 className="font-brain text-white text-lg mb-2">Мероприятия:</h3>
            {events && events.length > 0 ? (
              <div className="grid gap-3 grid-cols-1">
                {events.map((event) => (
                  <UserEventItem
                    key={event.id}
                    event={event}
                    userId={selectedUser.id}
                  />
                ))}
              </div>
            ) : (
              <p className="text-white/70 font-brain">Мероприятий нет</p>
            )}
          </div>

          <div className="mb-4">
            <h3 className="font-brain text-white text-lg mb-2">Отзывы:</h3>
            {feedback && feedback.length > 0 ? (
              <div className="space-y-3">
                {feedback.map((fb, index) => (
                  <Feedback key={index} feedback={fb} variant="user-page" />
                ))}
              </div>
            ) : (
              <p className="text-white/70 font-brain">Отзывов пока нет</p>
            )}
          </div>
        </>
      )}
    </>
  );
}
