import { useState } from "react";
import { useEventFiltersStore } from "../hooks/useEventsZustand";

export default function EventsSearch() {
  const { filters, updateFilter, resetFilters, availableHashtags } =
    useEventFiltersStore();

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

      <div className="flex flex-wrap gap-2 mt-4 mb-2 ">
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
          className="text-sm text-white hover:text-yellow-300 font-brain px-2 underline cursor-pointer self-start transition-colors duration-200 ease-in-out"
        >
          {showAllTags ? "Скрыть теги" : "Показать все теги"}
        </button>
      )}

      <button
        onClick={() => {
          resetFilters();
          setSearchTerm("");
        }}
        className="text-sm text-red-400 underline hover:text-red-300 self-end font-brain cursor-pointer transition-colors duration-200 ease-in-out"
      >
        Сбросить фильтры
      </button>
    </div>
  );
}
