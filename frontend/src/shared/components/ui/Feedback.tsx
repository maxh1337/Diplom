"use client";

import { Star, Trash2 } from "lucide-react";
import { twMerge } from "tailwind-merge";
import { useGetEvents } from "../../../features/events/hooks/useGetEvents";
import { useGetUsers } from "../../../features/users/hooks/useGetUsers";
import { IFeedback } from "../../../lib/modules/events/event.types";
import {
  CustomPopover,
  PopoverItem,
} from "../../../shared/components/ui/PopoverMenu";
import { useDeleteFeedback } from "../../hooks/useDeleteFeedback";

interface FeedbackProps {
  feedback: IFeedback;
  variant: "user-page" | "event-page";
}

export default function Feedback({ feedback, variant }: FeedbackProps) {
  const { mutateDeleteFeedback, isDeletionFeedbackPending } =
    useDeleteFeedback();

  const { refetch: refetchEvents } = useGetEvents();
  const { refetch: refetchUsers } = useGetUsers();

  const popoverItems: PopoverItem[] = [
    {
      label: "Удалить",
      onSelect: () =>
        feedback.id &&
        mutateDeleteFeedback(feedback.id, {
          onSuccess: () => {
            if (variant === "user-page") refetchUsers();
            if (variant === "event-page") refetchEvents();
          },
        }),
      icon: <Trash2 className="w-4 h-4" />,
      destructive: true,
    },
  ];

  return (
    <div className="p-3 bg-gray-800 rounded-md shadow-md flex justify-between items-start">
      <div className="flex-1">
        {variant === "user-page" ? (
          <p className="text-gray-400 text-sm">
            Мероприятие: {feedback.event.title}
          </p>
        ) : (
          <p className="text-gray-400 text-sm">
            Пользователь:{" "}
            {feedback.user?.nickname ||
              feedback.user?.telegramUsername ||
              "Неизвестный пользователь"}
          </p>
        )}
        <div
          className="flex items-center gap-1 my-1"
          aria-label={`Rating: ${feedback.rating} out of 5`}
        >
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={twMerge(
                "w-4 h-4",
                i < feedback.rating
                  ? "text-yellow-400 fill-yellow-400"
                  : "text-gray-400"
              )}
            />
          ))}
        </div>
        <p className="text-white/90 font-brain">
          {feedback.comment || "Нет комментария"}
        </p>
      </div>
      <CustomPopover
        trigger={
          <button
            className="text-white hover:text-yellow-300 transition"
            disabled={isDeletionFeedbackPending}
            aria-label="Действия с отзывом"
          >
            ...
          </button>
        }
        items={popoverItems}
        side="top"
        align="end"
        sideOffset={8}
        alignOffset={4}
      />
    </div>
  );
}
