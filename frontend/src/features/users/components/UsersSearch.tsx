import { useState } from "react";
import { useUserFiltersZustand } from "../hooks/useUserFiltersZustand";

export default function UsersSearch() {
  const { filters, updateFilter, resetFilters } = useUserFiltersZustand();

  const [searchTerm, setSearchTerm] = useState(filters.search ?? "");

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    updateFilter("search", value);
  };

  return (
    <div className="w-full mt-4 flex flex-col">
      <input
        type="text"
        placeholder="Поиск по имени или tg @username..."
        className="w-full p-2 rounded-xl bg-third text-white placeholder-fourth font-brain"
        value={searchTerm}
        onChange={handleTitleChange}
      />
    </div>
  );
}
