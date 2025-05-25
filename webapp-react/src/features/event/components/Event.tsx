import type {
  QueryObserverResult,
  RefetchOptions,
} from "@tanstack/react-query";
import type { IEvent } from "../../../lib/modules/event/event.types";
import { useUserZustand } from "../../../shared/hooks/useUserZustand";
import EventHashtag from "../../events/components/EventHashtag";
import EventButton from "./EventButton";
import EventFeedback from "./EventFeedbacks";

interface EventPageProps {
  event: IEvent;
  refetchEvent: (
    options?: RefetchOptions
  ) => Promise<QueryObserverResult<IEvent, Error>>;
}

export default function Event({ event, refetchEvent }: EventPageProps) {
  const { user } = useUserZustand();

  return (
    <div className="w-full p-4 bg-secondary rounded-2xl">
      <img
        src={
          event.image
            ? `${import.meta.env.VITE_BACKEND_URL}/${event.image?.path}`
            : "https://web3.avolites.com/Portals/0/news/2016%20v2/Jewel/5.21_The%20Chainsmokers_JEWEL%20Grand%20Opening_Photo%20Credit%20Al%20Powers%206.jpg?ver=2016-08-05-114212-697"
        }
        alt={event.title}
        className="w-full h-[30vh] object-cover rounded-xl mb-4"
      />

      <h2 className="text-white font-unbound text-3xl mb-2">{event.title}</h2>

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

      <p className="text-white mb-1 font-brain font-bold">Описание:</p>
      <p className="text-white text-md font-unbound mb-6">
        {event.description}
      </p>

      <div className="text-center">
        {event.isActive ? (
          <EventButton
            event={event}
            userId={user?.id || ""}
            refetchEvent={() => refetchEvent()}
          />
        ) : (
          <EventFeedback
            event={event}
            userId={user?.id || ""}
            username={user?.telegramUsername}
          />
        )}
      </div>
    </div>
  );
}
