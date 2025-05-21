import type {
  QueryObserverResult,
  RefetchOptions,
} from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import { FaStar } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
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
  const { toggleParticipation, isPending } = useParticipate();

  const navigate = useNavigate();

  const isParticipating = event.participants.some(
    (participant) => participant.id === user?.id
  );

  const handleParticipate = async () => {
    await toggleParticipation(event.id, {
      onSuccess: async () => await refetchEvent(),
    });
  };

  const myFeedback = event.feedback.find(
    (feedback) => feedback.userId === user?.id
  );

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
                className="absolute top-2 right-2 text-white bg-black rounded-full p-1 px-2.5 hover:bg-gray-600 transition text-sm cursor-pointer"
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
                  <p className="font-unbound">
                    {event.eventDate.toString().split("T")[0]}
                  </p>
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
                {event.isActive ? (
                  <button
                    className={twMerge(
                      "bg-black text-yellow-300 px-6 py-3 rounded-2xl border-secondary border cursor-pointer",
                      "first-letter:text-white",
                      "font-logo text-yellow-300 text-lg",
                      "hover:bg-gray-800 transition-colors duration-300 ease-in-out",
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
                ) : !!myFeedback ? (
                  <div className="mt-4">
                    <p className="text-yellow-300 font-logo text-lg mb-1 text-left pl-4">
                      Ваш отзыв:
                    </p>
                    <div className=" bg-third p-4 rounded-2xl text-left">
                      <div className="flex items-center mb-2">
                        <div
                          className={twMerge(
                            "text-sm text-gray-400 font-brain mr-2"
                          )}
                        >
                          @{user?.telegramUsername || "unknown"}
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
                ) : (
                  <button
                    className={twMerge(
                      "bg-black text-yellow-300 px-6 py-3 rounded-2xl border-secondary border cursor-pointer",
                      "first-letter:text-white",
                      "font-logo text-yellow-300 text-lg",
                      "hover:bg-gray-800 transition-colors duration-300 ease-in-out",
                      isPending ? "cursor-wait opacity-50" : ""
                    )}
                    onClick={() => navigate(`/leave-feedback?id=${event.id}`)}
                    disabled={isPending}
                  >
                    Оставить отзыв
                  </button>
                )}
              </div>
            </motion.div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
