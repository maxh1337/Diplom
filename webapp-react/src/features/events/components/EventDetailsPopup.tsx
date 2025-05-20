import type {
  QueryObserverResult,
  RefetchOptions,
} from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import { twMerge } from "tailwind-merge";
import type { IEvent } from "../../../lib/modules/event/event.types";
import { useDebugTgZustand } from "../../../shared/hooks/useDebugTg";
import { useUserZustand } from "../../../shared/hooks/useUserZustand";
import { useParticipate } from "../hooks/useParticipate";
import EventHashtag from "./EventHashtag";

interface EventDetailsPopupProps {
  event: IEvent;
  onClose: () => void;
  isOpen: boolean;
  refetchEvent: (
    options?: RefetchOptions
  ) => Promise<QueryObserverResult<IEvent, Error>>;
}

export default function EventDetailsPopup({
  event,
  onClose,
  isOpen,
  refetchEvent,
}: EventDetailsPopupProps) {
  const { platform } = useDebugTgZustand();
  const { user } = useUserZustand();

  const isParticipating = event.participants.some(
    (participant) => participant.id === user?.id
  );

  const { toggleParticipation, isPending, isSuccess } = useParticipate();

  const handleParticipate = () => {
    toggleParticipation(event.id);

    if (isSuccess) {
      refetchEvent();
    }
  };

  const buttonText = !isParticipating ? "ЯБуду" : "ЯПередумал";

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
                  src={
                    event.image
                      ? event.image?.path
                      : "https://web3.avolites.com/Portals/0/news/2016%20v2/Jewel/5.21_The%20Chainsmokers_JEWEL%20Grand%20Opening_Photo%20Credit%20Al%20Powers%206.jpg?ver=2016-08-05-114212-697"
                  }
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
                  <p className="font-unbound">{event.eventDate.toString()}</p>
                </div>
                <div className="flex gap-2 text-white mb-2">
                  <p className="font-brain font-bold">Время:</p>
                  <p className="font-unbound">{event.eventTime}</p>
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
                    "bg-black text-yellow-300 px-6 py-3 rounded-2xl border-secondary border cursor-pointer",
                    "first-letter:text-white",
                    "font-logo text-yellow-300 text-lg",
                    "hover:bg-gray-800",
                    isPending ? "cursor-wait opacity-50" : ""
                  )}
                  onClick={() => handleParticipate()}
                  disabled={isPending}
                >
                  {isPending ? (
                    <span className="flex items-center justify-center">
                      <span className="animate-spin rounded-full h-6 w-6 border-4 border-t-yellow-300 border-gray-700 mr-3"></span>
                      Загрузка...
                    </span>
                  ) : (
                    buttonText
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
