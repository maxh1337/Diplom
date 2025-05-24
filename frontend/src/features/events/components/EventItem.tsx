import { useEffect, useRef, useState } from "react";
import { twMerge } from "tailwind-merge";
import { IEvent } from "../../../lib/modules/events/event.types";
import { useEventDetailsZustand } from "../hooks/useEventDetailsZustand";

type Props = {
  event: IEvent;
};

export default function EventItem({ event }: Props) {
  const { openEvent } = useEventDetailsZustand();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Закрытие меню при клике вне его
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <tr className="border-t border-white/20 font-brain text-sm relative">
      <td className="py-2">{event.title}</td>
      <td className="py-2">{event.eventDate.toString().split("T")[0]}</td>
      <td className="py-2">{event.eventTime.toString()}</td>
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

      {/* Меню */}
      <td className="py-2 relative">
        <button
          onClick={() => setMenuOpen((prev) => !prev)}
          className="text-white text-xl hover:text-yellow-300 transition ml-5"
        >
          ...
        </button>

        {menuOpen && (
          <div
            ref={menuRef}
            className="absolute top-full right-0 mt-2 w-45 bg-third text-white rounded-xl shadow-lg z-10 overflow-hidden font-brain"
          >
            <button
              onClick={() => {
                setMenuOpen(false);
              }}
              className="block w-full text-left hover:bg-yellow-500 transition-colors px-4 py-3 text-fourth"
            >
              ✏️ Редактировать
            </button>
            <button
              onClick={() => {
                setMenuOpen(false);
              }}
              className="block w-full text-left px-4 py-3 hover:bg-red-500 transition-colors text-fourth"
            >
              🗑️ Удалить
            </button>
          </div>
        )}
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
