import { twMerge } from "tailwind-merge";
import { IEvent } from "../../../lib/modules/events/event.types";
import {
  CustomPopover,
  PopoverItem,
} from "../../../shared/components/ui/PopoverMenu";
import { useEventDetailsZustand } from "../hooks/useEventDetailsZustand";
import { useDeleteEvent } from "../hooks/useDeleteEvent";

type Props = {
  event: IEvent;
  openEdit: (event: IEvent) => void;
};

export default function EventItem({ event, openEdit }: Props) {
  const { openEvent } = useEventDetailsZustand();
  const { mutateDelete } = useDeleteEvent();

  const items: PopoverItem[] = [
    {
      label: "Редактировать",
      onSelect: () => {
        openEdit(event);
      },
    },
    {
      label: "Удалить",
      destructive: true,
      onSelect: () => {
        mutateDelete(event.id);
      },
    },
  ];

  return (
    <tr className="border-t border-white/20 font-brain text-sm">
      <td className="py-2">{event.title}</td>
      <td className="py-2">{event.eventDate.toString().split("T")[0]}</td>
      <td className="py-2">{event.eventTime}</td>
      <td
        className={twMerge(
          "py-2 font-brain",
          event.isActive ? "text-green-600" : "text-red-500"
        )}
      >
        {event.isActive ? "Активно" : "Архив"}
      </td>
      <td className="py-2">
        {event.administrator.username ?? event.administrator.login}
      </td>

      {/* Меню действий */}
      <td className="py-2 relative">
        <CustomPopover
          trigger={
            <button className="text-white hover:text-yellow-300 transition">
              ...
            </button>
          }
          items={items}
        />
      </td>

      <td className="py-2">
        <button
          onClick={() => openEvent(event)}
          className="text-blue-400 hover:underline"
        >
          Открыть
        </button>
      </td>
    </tr>
  );
}
