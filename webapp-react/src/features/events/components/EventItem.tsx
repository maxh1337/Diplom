import { useNavigate } from "react-router-dom";
import { twMerge } from "tailwind-merge";
import type { IEvent } from "../../../lib/modules/event/event.types";
import EventHashtag from "./EventHashtag";

interface EventItemProps {
  event: IEvent;
}

export default function EventItem({ event }: EventItemProps) {
  const navigate = useNavigate();

  return (
    <div
      className={twMerge("flex gap-4 mt-5 p-3 bg-secondary rounded-lg ")}
      onClick={() => {
        navigate(`/event/${event.id}`);
      }}
    >
      <img
        src={
          event.image
            ? event.image?.path
            : "https://web3.avolites.com/Portals/0/news/2016%20v2/Jewel/5.21_The%20Chainsmokers_JEWEL%20Grand%20Opening_Photo%20Credit%20Al%20Powers%206.jpg?ver=2016-08-05-114212-697"
        }
        alt={`Test alt`}
        className={twMerge("w-23 h-23 rounded-lg object-cover")}
      />
      <div className="overflow-hidden">
        <p className="font-unbound text-white text-xl mb-2">{event.title}</p>
        <div
          className=" flex gap-2 overflow-x-auto max-w-full scrollbar-hide"
          onClick={(e) => e.stopPropagation()}
        >
          {event.hashTags.map((hashTag, idx) => (
            <EventHashtag hashTag={hashTag} key={idx} />
          ))}
        </div>
      </div>
    </div>
  );
}
