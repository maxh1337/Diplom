import { AnimatePresence, motion } from "framer-motion";
import { twMerge } from "tailwind-merge";
import type { IEvent } from "../../../lib/modules/event/event.types";
import { useParticipate } from "../../events/hooks/useParticipate";

interface EventButtonProps {
  event: IEvent;
  userId: string;
  refetchEvent: () => void;
}

export default function EventButton({
  event,
  userId,
  refetchEvent,
}: EventButtonProps) {
  const { toggleParticipation, isPending } = useParticipate();

  const isParticipating = event.participants.some(
    (participant) => participant.id === userId
  );

  const buttonText = !isParticipating ? "ЯБуду" : "ЯПередумал";

  const handleParticipate = async () => {
    await toggleParticipation(event.id, {
      onSuccess: async () => await refetchEvent(),
    });
  };

  return (
    <button
      className={twMerge(
        "bg-black text-yellow-300 px-6 py-3 rounded-2xl border-secondary border cursor-pointer",
        "font-logo text-yellow-300 text-lg",
        "hover:bg-gray-800 transition-colors duration-300 ease-in-out",
        isPending ? "cursor-wait opacity-50" : ""
      )}
      onClick={handleParticipate}
      disabled={isPending}
    >
      {isPending ? (
        <span className="flex items-center justify-center">
          <span className="animate-spin rounded-full h-6 w-6 border-4 border-t-yellow-300 border-gray-700 mr-3"></span>
          Загрузка...
        </span>
      ) : (
        <AnimatePresence mode="wait">
          <motion.span
            key={buttonText}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.2 }}
          >
            {buttonText}
          </motion.span>
        </AnimatePresence>
      )}
    </button>
  );
}
