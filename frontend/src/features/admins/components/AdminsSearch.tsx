import { useState } from "react";
import { useAdminFiltersZustand } from "../hooks/useAdminFiltersZustand";

export default function AdminsSearch() {
  const { filters, updateFilter, resetFilters } = useAdminFiltersZustand();

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
        placeholder="Поиск администатора по username или login..."
        className="w-full p-2 rounded-xl bg-third text-white placeholder-fourth font-brain"
        value={searchTerm}
        onChange={handleTitleChange}
      />
    </div>
  );
}
