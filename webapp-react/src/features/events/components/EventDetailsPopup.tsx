import { AnimatePresence, motion } from "framer-motion";
import { twMerge } from "tailwind-merge";
import type { IEvent } from "../../../lib/modules/event/event.types";
import { useDebugTgZustand } from "../../../shared/hooks/useDebugTg";
import EventHashtag from "./EventHashtag";

interface EventDetailsPopupProps {
  event: IEvent;
  onClose: () => void;
  isOpen: boolean;
}

export default function EventDetailsPopup({
  event,
  onClose,
  isOpen,
}: EventDetailsPopupProps) {
  const { platform } = useDebugTgZustand();
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center">
          <motion.div
            className={twMerge(
              "fixed inset-0 flex items-center justify-center z-50",
              isOpen ? "backdrop-blur-sm" : ""
            )}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className={twMerge(
                "relative bg-secondary !rounded-2xl p-6 w-[90vw] flex flex-col",
                platform === "tdesktop" ? "max-h-[90vh]" : " max-h-[75vh]"
              )}
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={onClose}
                className="absolute top-2 right-2 text-white bg-black rounded-full p-1 px-2.5 hover:bg-gray-600 transition text-sm"
                aria-label="Закрыть"
              >
                X
              </button>
              <div className="flex-1 overflow-y-auto scrollbar-hide pr-2">
                <img
                  src={event.image}
                  alt={event.title}
                  className="w-full h-[20vh] object-cover rounded-xl mb-4 mt-5"
                />
                <h2 className="text-white font-unbound text-2xl mb-2">
                  {event.title}
                </h2>
                <div className="flex gap-2 overflow-x-auto max-w-full scrollbar-hide mb-4">
                  {event.hashTags.map((tag, idx) => (
                    <EventHashtag key={idx} hashTag={tag} />
                  ))}
                </div>
                <div className="flex gap-2 text-white mb-2">
                  <p className="font-brain font-bold">Дата:</p>
                  <p className="font-unbound">21.05.2025</p>
                </div>
                <div className="flex gap-2 text-white mb-2">
                  <p className="font-brain font-bold">Время:</p>
                  <p className="font-unbound">19:00-21:00</p>
                </div>
                <p className="text-white mb-1 font-brain font-bold">
                  Описание:
                </p>
                <p className="text-white text-md font-unbound mb-4">
                  {event.description}
                </p>
              </div>
              <div className="mt-4 text-center">
                <button
                  className={twMerge(
                    "bg-black text-yellow-300 px-6 py-3 rounded-2xl",
                    "first-letter:text-white",
                    "font-logo text-yellow-300 text-lg"
                  )}
                >
                  ЯБуду
                </button>
              </div>
            </motion.div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
