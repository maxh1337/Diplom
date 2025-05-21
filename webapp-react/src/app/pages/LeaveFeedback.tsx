import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { twMerge } from "tailwind-merge";
import { useSendFeedback } from "../../features/events/hooks/useSendFeedback";

export default function LeaveFeedback() {
  const [searchParams] = useSearchParams();
  const eventId = searchParams.get("id");
  const navigate = useNavigate();

  const [rating, setRating] = useState<number>(0);
  const [comment, setComment] = useState("");

  const { sendFeedback, isPending, isSuccess } = useSendFeedback();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!eventId) {
      alert("Некорректный идентификатор мероприятия");
      return;
    }

    if (rating < 1 || rating > 5) {
      alert("Пожалуйста, выберите оценку от 1 до 5");
      return;
    }

    sendFeedback({
      eventId,
      rating,
      comment: comment.trim() || undefined,
    });
  };

  useEffect(() => {
    if (isSuccess) {
      setTimeout(() => {
        navigate(-1);
      }, 1000);
    }
  }, [isSuccess, navigate]);

  return (
    <div className="text-white font-brain p-6 max-w-lg mx-auto w-full">
      <button
        type="button"
        onClick={() => navigate(-1)}
        className={twMerge(
          "text-sm underline mb-4 text-fourth hover:text-white transition-colors"
        )}
      >
        ← Назад
      </button>
      <h1 className="text-2xl mb-4 text-center font-geist-mono">
        Оставить отзыв
      </h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="block text-sm font-bold mb-2">Оценка</label>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((num) => (
              <button
                type="button"
                key={num}
                onClick={() => setRating(num)}
                disabled={isPending}
                className={twMerge(
                  "px-4 py-2 rounded-full border border-black font-unbound",
                  rating === num
                    ? "bg-white text-black border-white"
                    : "bg-secondary",
                  isPending && "opacity-50 cursor-not-allowed"
                )}
              >
                {num}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-bold mb-2">
            Комментарий (необязательно)
          </label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Что вам понравилось или нет?"
            rows={4}
            disabled={isPending}
            className={twMerge(
              "w-full p-3 rounded-lg bg-secondary text-white placeholder-fourth font-unbound border-2 border-black",
              "focus:outline-none focus:border-white",
              isPending && "opacity-50 cursor-not-allowed"
            )}
          />
        </div>

        <button
          type="submit"
          disabled={isPending}
          className={twMerge(
            "bg-secondary text-white font-brain py-3 px-4 rounded-lg transition-colors mt-4 border-2 border-black",
            "hover:bg-black hover:border-white",
            isPending && "opacity-50 cursor-not-allowed"
          )}
        >
          {isPending ? "Отправка..." : "Отправить отзыв"}
        </button>
      </form>
    </div>
  );
}
