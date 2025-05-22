import { FaStar } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { twMerge } from "tailwind-merge";
import type { IEvent } from "../../../lib/modules/event/event.types";

interface EventFeedbackProps {
  event: IEvent;
  userId: string;
  username?: string;
}

export default function EventFeedback({
  event,
  userId,
  username = "unknown",
}: EventFeedbackProps) {
  const myFeedback = event.feedback.find(
    (feedback) => feedback.userId === userId
  );
  const navigate = useNavigate();

  if (!event.isActive && myFeedback) {
    return (
      <div className="mt-4 text-left">
        <p className="text-yellow-300 font-logo text-lg mb-1">Ваш отзыв:</p>
        <div className="bg-third p-4 rounded-2xl">
          <div className="flex items-center mb-2">
            <div className="text-sm text-gray-400 font-brain mr-2">
              @{username}
            </div>
            {[...Array(5)].map((_, index) => (
              <FaStar
                key={index}
                className={twMerge(
                  "text-xl mr-1 transition-all",
                  index < myFeedback.rating
                    ? "text-yellow-300"
                    : "text-gray-600"
                )}
              />
            ))}
          </div>
          {myFeedback.comment && (
            <p className="text-white font-brain text-sm whitespace-pre-wrap">
              {myFeedback.comment}
            </p>
          )}
        </div>
      </div>
    );
  }

  if (!event.isActive && !myFeedback) {
    return (
      <button
        className={twMerge(
          "bg-black text-yellow-300 px-6 py-3 rounded-2xl border-secondary border cursor-pointer",
          "font-logo text-yellow-300 text-lg",
          "hover:bg-gray-800 transition-colors duration-300 ease-in-out"
        )}
        onClick={() => navigate(`/leave-feedback?id=${event.id}`)}
      >
        Оставить отзыв
      </button>
    );
  }

  return null;
}
