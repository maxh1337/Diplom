"use client";

import { CalendarDays, CheckCircle, Clock, XCircle } from "lucide-react";
import Image from "next/image";
import { useEventDetailsZustand } from "../hooks/useEventDetailsZustand";
import AnimatedRightSection from "../../../shared/components/ui/AnimateRightSection";

export default function EventsDetails() {
  const { isOpen, selectedEvent, closeEvent } = useEventDetailsZustand();

  if (!isOpen || !selectedEvent) return null; // Оставим как есть, но добавим анимацию ниже

  const {
    title,
    image,
    eventDate,
    eventTime,
    isActive,
    description,
    participants,
  } = selectedEvent;

  const formattedDate = eventDate.toString().split("T")[0];

  return (
    <AnimatedRightSection isOpen={isOpen}>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">{title}</h2>
        <button
          className="text-white font-brain hover:underline"
          onClick={closeEvent}
        >
          Закрыть
        </button>
      </div>

      <div className="relative w-full h-48 rounded-xl overflow-hidden mb-4">
        <Image
          src={image?.path || "/eventImage.jpg"}
          alt="Event Image"
          fill
          className="object-cover"
        />
      </div>
      <div className="flex gap-2 items-center mb-1 font-brain">
        <CalendarDays className="w-4 h-4 text-white" />
        <p className="text-md text-gray-400">Дата:</p>
        <p className="text-md text-white">{formattedDate}</p>
      </div>

      <div className="flex gap-2 items-center mb-1 font-brain">
        <Clock className="w-4 h-4 text-white" />
        <p className="text-md text-gray-400">Время:</p>
        <p className="text-md text-white">{eventTime}</p>
      </div>

      <div className="flex gap-2 items-center mb-1 font-brain">
        {isActive ? (
          <CheckCircle className="w-4 h-4 text-green-500" />
        ) : (
          <XCircle className="w-4 h-4 text-red-500" />
        )}
        <p className="text-md text-gray-400">Статус:</p>
        <p
          className={`text-md font-brain ${
            isActive ? "text-green-600" : "text-red-500"
          }`}
        >
          {isActive ? "Активно" : "Архив"}
        </p>
      </div>

      {description && (
        <p className="mt-2 text-sm text-white/90 font-brain">{description}</p>
      )}

      <h3 className="mt-6 text-lg font-semibold text-white">Участники:</h3>
      <div className="mt-2 flex flex-col gap-2">
        {/* Тут позже будут участники */}
      </div>
    </AnimatedRightSection>
  );
}
