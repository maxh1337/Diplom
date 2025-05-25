import { IEvent } from "../../../lib/modules/events/event.types";
import EventItem from "./EventItem";
import EventItemSkeleton from "./EventItemSkeleton";

type Props = {
  events: IEvent[] | undefined;
  isLoading: boolean;
  onAddNew: () => void;
  openEdit: (event: IEvent) => void;
};

export default function EventsList({
  events,
  isLoading,
  onAddNew,
  openEdit,
}: Props) {
  const skeletonRows = 10;

  return (
    <table className="w-full table-auto text-left font-brain border-separate border-spacing-y-3">
      <thead>
        <tr>
          <th className="pb-2">Название</th>
          <th className="pb-2">Дата</th>
          <th className="pb-2">Время</th>
          <th className="pb-2">Статус</th>
          <th className="pb-2">Админ</th>
          <th className="pb-2">Действие</th>
          <th className="pb-2"></th>
        </tr>
      </thead>
      <tbody>
        <tr className="border-t border-white/20 text-center">
          <td colSpan={7} className="py-3">
            <button
              onClick={onAddNew}
              className="text-white hover:text-green-300 font-brain cursor-pointer"
            >
              + Добавить новое мероприятие
            </button>
          </td>
        </tr>

        {isLoading
          ? Array.from({ length: skeletonRows }).map((_, index) => (
              <EventItemSkeleton key={index} />
            ))
          : events?.map((event) => (
              <EventItem key={event.id} event={event} openEdit={openEdit} />
            ))}
      </tbody>
    </table>
  );
}
