import { IEvent } from "../../../lib/modules/events/event.types";
import EventItem from "./EventItem";
import EventItemSkeleton from "./EventItemSkeleton";

type Props = {
  events: IEvent[] | undefined;
  isLoading: boolean;
};

export default function EventsList({ events, isLoading }: Props) {
  const skeletonRows = 10;

  return (
    <table className="w-full table-auto text-left font-brain border-separate border-spacing-y-3">
      <thead>
        <tr className="">
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
        {isLoading
          ? Array.from({ length: skeletonRows }).map((_, index) => (
              <EventItemSkeleton key={index} />
            ))
          : events?.map((event) => <EventItem key={event.id} event={event} />)}
      </tbody>
    </table>
  );
}
