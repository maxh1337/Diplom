"use client";

import { CalendarDays } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  CustomPopover,
  PopoverItem,
} from "../../../shared/components/ui/PopoverMenu";

interface Props {
  event: {
    id: string;
    title: string;
    eventDate: Date | string;
  };
}

export default function AdminEventItem({ event }: Props) {
  const router = useRouter();
  const items: PopoverItem[] = [
    {
      label: "Открыть",
      onSelect: () => {
        router.push(`/dashboard/events?id=${event.id}`);
      },
    },
  ];

  return (
    <div className="flex items-center justify-between p-3 bg-gray-800 rounded-lg shadow-md hover:bg-gray-700 transition">
      <div>
        <h3 className="text-white font-brain font-semibold text-md">
          {event.title}
        </h3>
        <div className="flex items-center gap-2 text-gray-400 mt-1 text-sm">
          <CalendarDays className="w-4 h-4" />
          <span>{event.eventDate.toString().split("T")[0]}</span>
        </div>
      </div>
      <CustomPopover
        trigger={
          <button className="text-white hover:text-yellow-300 transition">
            ...
          </button>
        }
        items={items}
      />
    </div>
  );
}
