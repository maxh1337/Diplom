import { useState } from "react";
import { useEventFiltersStore } from "../hooks/useEventsZustand";

export default function EventsSearch() {
  const { filters, updateFilter, resetFilters, availableHashtags } =
    useEventFiltersStore();

  const [searchTerm, setSearchTerm] = useState(filters.title ?? "");
  const selectedTags = filters.hashTags ?? [];

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

  return (
    <div className="w-full mt-4 space-y-4">
      <input
        type="text"
        placeholder="Поиск по названию..."
        className="w-full p-2 rounded bg-gray-800 text-white placeholder-gray-400"
        value={searchTerm}
        onChange={handleTitleChange}
      />

      <div className="flex flex-wrap gap-2">
        {availableHashtags.map((tag) => (
          <button
            key={tag}
            onClick={() => toggleTag(tag)}
            className={`px-3 py-1 rounded-xl text-sm ${
              selectedTags.includes(tag)
                ? "bg-blue-500 text-white"
                : "bg-gray-700 text-gray-300"
            }`}
          >
            {tag}
          </button>
        ))}
      </div>

      <button
        onClick={() => {
          resetFilters();
          setSearchTerm("");
        }}
        className="text-sm text-red-400 underline hover:text-red-300"
      >
        Сбросить фильтры
      </button>
    </div>
  );
}
