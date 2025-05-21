import { useEffect, useState } from "react";
import Events from "../../features/events/components/Events";
import UserProfileCard from "../../features/home/components/ProfileCard";
import type { IEvent } from "../../lib/modules/event/event.types";
import { useGetMyEvents } from "../../shared/hooks/useGetMyEvents";
import { useShowBottomMenu } from "../../shared/hooks/useShowBottomMenu";

export default function ProfilePage() {
  const [upcomingEvents, setUpcomingEvents] = useState<IEvent[]>([]);
  const [pastEvents, setPastEvents] = useState<IEvent[]>([]);
  const [showUpcoming, setShowUpcoming] = useState(true);
  const [showPast, setShowPast] = useState(true);
  const { setIsVisible } = useShowBottomMenu();

  const {
    data: events,
    isLoading: isEventsLoading,
    isSuccess,
  } = useGetMyEvents();

  useEffect(() => {
    setIsVisible(true);
    if (isSuccess && !isEventsLoading && events) {
      setUpcomingEvents(events.upcomingEvents);
      setPastEvents(events.pastEvents);
    }
  }, [events]);

  return (
    <section className="w-full flex flex-col items-center pt-5 h-full text-white">
      <UserProfileCard variant="horizontal" />

      {upcomingEvents.length !== 0 && (
        <div className="w-full">
          <div className="flex justify-between items-center pt-5">
            <h1 className="text-white font-brain text-xl">
              Предстоящие мероприятия
            </h1>
            <button
              onClick={() => setShowUpcoming((prev) => !prev)}
              className="text-sm text-fourth hover:text-yellow-400 underline font-brain"
            >
              {showUpcoming ? "Скрыть" : "Показать"}
            </button>
          </div>

          {showUpcoming && (
            <Events events={upcomingEvents} isEventsLoading={isEventsLoading} />
          )}
        </div>
      )}

      <div className="pb-17 w-full">
        <div className="flex justify-between items-center pt-5">
          <h1 className="text-white font-brain text-xl">
            Прошедшие мероприятия
          </h1>
          <button
            onClick={() => setShowPast((prev) => !prev)}
            className="text-sm text-fourth hover:text-yellow-400 underline font-brain"
          >
            {showPast ? "Скрыть" : "Показать"}
          </button>
        </div>

        <p className="text-xs font-unbound text-fourth">
          Вы можете оставить отзыв, нажав на мероприятие
        </p>

        {showPast && (
          <Events events={pastEvents} isEventsLoading={isEventsLoading} />
        )}
      </div>
    </section>
  );
}
