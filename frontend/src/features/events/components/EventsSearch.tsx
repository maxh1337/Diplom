import { useState } from "react";
import { useEventFiltersZustand } from "../hooks/useEventFiltersZustand";

export default function EventsSearch() {
  const { filters, updateFilter, resetFilters, availableHashtags } =
    useEventFiltersZustand();

  const [searchTerm, setSearchTerm] = useState(filters.title ?? "");
  const [showAllTags, setShowAllTags] = useState(false);

  const selectedTags = filters.hashTags ?? [];
  const maxVisibleTags = 9;

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    updateFilter("title", value);
  };

  const toggleTag = (tag: string) => {
    const updatedTags = selectedTags.includes(tag)
      ? selectedTags.filter((t) => t !== tag)
      : [...selectedTags, tag];

    updateFilter("hashTags", updatedTags.length ? updatedTags : undefined);
  };

  const handleStatusChange = (status: boolean | undefined) => {
    updateFilter("isActive", status);
  };

  const visibleTags = showAllTags
    ? availableHashtags
    : availableHashtags.slice(0, maxVisibleTags);

  return (
    <div className="w-full mt-4 flex flex-col">
      <input
        type="text"
        placeholder="Поиск по названию..."
        className="w-full p-2 rounded-xl bg-third text-white placeholder-fourth font-brain"
        value={searchTerm}
        onChange={handleTitleChange}
      />
      {/* Теги */}
      <div className="my-2 mx-2">
        <p className="text-sm text-white mb-1 font-brain">Хэштеги:</p>
        <div className="flex w-full justify-between">
          <div className="flex flex-wrap gap-2 h-full items-center">
            {visibleTags.map((tag) => (
              <button
                key={tag}
                onClick={() => toggleTag(tag)}
                className={`px-2.5 py-1 rounded-xl text-sm font-brain ${
                  selectedTags.includes(tag)
                    ? "bg-fourth text-white"
                    : "bg-third text-white"
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
          {availableHashtags.length > maxVisibleTags && (
            <button
              onClick={() => setShowAllTags((prev) => !prev)}
              className="min-w-fit text-sm text-white hover:text-yellow-300 font-brain mr-2 py-1 ml-15 underline cursor-pointer self-start transition-colors duration-200 ease-in-out"
            >
              {showAllTags ? "Скрыть теги" : "Показать все теги"}
            </button>
          )}
        </div>
      </div>
      {/*  */}
      {/* Статус */}
      <div className="my-1 mx-2">
        <p className="text-sm text-white mb-1 font-brain">Статус события:</p>
        <div className="flex justify-between items-center">
          <div className="flex gap-2">
            <button
              onClick={() => handleStatusChange(undefined)}
              className={`px-3 py-1 rounded-xl text-sm font-brain ${
                filters.isActive === undefined
                  ? "bg-fourth text-white"
                  : "bg-third text-white"
              }`}
            >
              Все
            </button>
            <button
              onClick={() => handleStatusChange(true)}
              className={`px-3 py-1 rounded-xl text-sm font-brain ${
                filters.isActive === true
                  ? "bg-fourth text-white"
                  : "bg-third text-white"
              }`}
            >
              Активные
            </button>
            <button
              onClick={() => handleStatusChange(false)}
              className={`px-3 py-1 rounded-xl text-sm font-brain ${
                filters.isActive === false
                  ? "bg-fourth text-white"
                  : "bg-third text-white"
              }`}
            >
              Архив
            </button>
          </div>
          <button
            onClick={() => {
              resetFilters();
              setSearchTerm("");
            }}
            className="text-sm text-white underline mx-2 hover:text-red-300 self-end font-brain cursor-pointer transition-colors duration-200 ease-in-out py-1"
          >
            Сбросить фильтры
          </button>
        </div>
      </div>
      {/*  */}
    </div>
  );
}
