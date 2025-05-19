import { twMerge } from "tailwind-merge";
import type { IEvent } from "../../../lib/modules/event/event.types";
import EventHashtag from "./EventHashtag";

interface EventItemProps {
  event: IEvent;
  open: () => void;
}

export default function EventItem({ event, open }: EventItemProps) {
  return (
    <div
      className={twMerge("flex gap-4 mt-5 p-3 bg-secondary rounded-lg ")}
      onClick={() => {
        open();
      }}
    >
      <img
        src={event.image}
        alt={`Test alt`}
        className={twMerge("w-23 h-23 rounded-lg object-cover")}
      />
      <div className="overflow-hidden">
        <p className="font-unbound text-white text-xl mb-2">Test</p>
        <div
          className=" flex gap-2 overflow-x-auto max-w-full scrollbar-hide"
          onClick={(e) => e.stopPropagation()}
        >
          {event.hashTags.map((hashTag) => (
            <EventHashtag hashTag={hashTag} />
          ))}
        </div>
      </div>
    </div>
  );
}
