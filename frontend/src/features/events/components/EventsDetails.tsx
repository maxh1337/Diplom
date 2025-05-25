"use client";

import { CalendarDays, CheckCircle, Clock, XCircle } from "lucide-react";
import Image from "next/image";
import { twMerge } from "tailwind-merge";
import { BACKEND_MAIN } from "../../../lib/constants/urls";
import AnimatedRightSection from "../../../shared/components/ui/AnimateRightSection";
import { useEventDetailsZustand } from "../hooks/useEventDetailsZustand";
import { useExportWord } from "../hooks/useExportWord";
import EventParticipant from "./EventParticipant";

export default function EventsDetails() {
  const {
    isOpen,
    selectedEvent,
    closeEvent,
    isRightSectionFullScreen,
    openRightSectionFullscreen,
  } = useEventDetailsZustand();

  const { exportDocx, isWordExportLoading } = useExportWord();

  if (!isOpen || !selectedEvent) return null;

  const {
    title,
    image,
    eventDate,
    eventTime,
    isActive,
    description,
    participants,
    feedback, // Предполагаем, что feedback доступен
    id,
  } = selectedEvent;

  const formattedDate = eventDate.toString().split("T")[0];

  const handleExportClick = () => {
    if (id) {
      exportDocx(id);
    }
  };

  return (
    <AnimatedRightSection isOpen={isOpen}>
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-brain font-bold text-2xl ml-10">{title}</h2>
        <button
          className="text-white font-brain hover:underline"
          onClick={() => {
            closeEvent();
            openRightSectionFullscreen(false);
          }}
        >
          Закрыть
        </button>
      </div>
      <div className="flex flex-col gap-6 mb-6">
        <div
          className={twMerge(
            "relative rounded-xl overflow-hidden flex-shrink-0",
            isRightSectionFullScreen ? "w-1/3 h-40" : "w-1/2 h-32"
          )}
        >
          <Image
            src={
              image?.path ? `${BACKEND_MAIN}/${image?.path}` : "/eventImage.jpg"
            }
            alt={title}
            fill
            className="object-cover"
          />
        </div>
        <button
          onClick={handleExportClick}
          disabled={isWordExportLoading}
          className={twMerge(
            "px-4 py-2 rounded-md text-white font-brain",
            isWordExportLoading
              ? "bg-gray-500 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700",
            isRightSectionFullScreen && "w-1/3"
          )}
        >
          {isWordExportLoading ? "Скачивание..." : "Экспорт в Word"}
        </button>
        {/* Метаданные */}
        <div className="flex flex-col justify-start gap-2 font-brain">
          <div className="flex items-center gap-2">
            <CalendarDays className="w-5 h-5 text-white" />
            <span className="text-gray-400">Дата:</span>
            <span className="text-white">{formattedDate}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-white" />
            <span className="text-gray-400">Время:</span>
            <span className="text-white">{eventTime}</span>
          </div>
          <div className="flex items-center gap-2">
            {isActive ? (
              <CheckCircle className="w-5 h-5 text-green-500" />
            ) : (
              <XCircle className="w-5 h-5 text-red-500" />
            )}
            <span className="text-gray-400">Статус:</span>
            <span
              className={twMerge(
                "font-brain",
                isActive ? "text-green-600" : "text-red-500"
              )}
            >
              {isActive ? "Активно" : "Архив"}
            </span>
          </div>
        </div>
      </div>
      {description && (
        <div className="mb-6">
          <h3 className="font-brain text-white text-lg mb-2">Описание:</h3>
          <p className="font-brain text-white/90 leading-relaxed">
            {description}
          </p>
        </div>
      )}

      {/* Участники и отзывы */}
      {isRightSectionFullScreen ? (
        // Фуллскрин: участники слева, отзывы справа
        <div className="flex gap-6 mb-4">
          {/* Участники (левая часть) */}
          <div className="w-1/2">
            <h3 className="font-brain text-white text-lg mb-2">Участники:</h3>
            {participants.length > 0 ? (
              <div className="grid gap-3 grid-cols-2">
                {participants.map((user) => (
                  <EventParticipant user={user} key={user.id} />
                ))}
              </div>
            ) : (
              <p className="text-white/70 font-brain">Участников пока нет</p>
            )}
          </div>

          {/* Отзывы (правая часть) */}
          <div className="w-1/2">
            <h3 className="font-brain text-white text-lg mb-2">
              Обратная связь:
            </h3>
            {feedback && feedback.length > 0 ? (
              <div className="space-y-3">
                {feedback.map((fb, index) => (
                  <div
                    key={index}
                    className="p-3 bg-gray-800 rounded-md shadow-md"
                  >
                    <p className="text-white font-brain">
                      Оценка: <span className="font-bold">{fb.rating}</span>
                    </p>
                    <p className="text-white/90 font-brain">
                      Комментарий: {fb.comment || "Нет комментария"}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-white/70 font-brain">Отзывов пока нет</p>
            )}
          </div>
        </div>
      ) : (
        // Не фуллскрин: участники, затем отзывы ниже
        <>
          <div className="mb-6">
            <h3 className="font-brain text-white text-lg mb-2">Участники:</h3>
            {participants.length > 0 ? (
              <div className="grid gap-3 grid-cols-1">
                {participants.map((user) => (
                  <EventParticipant user={user} key={user.id} />
                ))}
              </div>
            ) : (
              <p className="text-white/70 font-brain">Участников пока нет</p>
            )}
          </div>

          <div className="mb-4">
            <h3 className="font-brain text-white text-lg mb-2">
              Обратная связь:
            </h3>
            {feedback && feedback.length > 0 ? (
              <div className="space-y-3">
                {feedback.map((fb, index) => (
                  <div
                    key={index}
                    className="p-3 bg-gray-800 rounded-md shadow-md"
                  >
                    <p className="text-white font-brain">
                      Оценка: <span className="font-bold">{fb.rating}</span>
                    </p>
                    <p className="text-white/90 font-brain">
                      Комментарий: {fb.comment || "Нет комментария"}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-white/70 font-brain">Отзывов пока нет</p>
            )}
          </div>
        </>
      )}
    </AnimatedRightSection>
  );
}
