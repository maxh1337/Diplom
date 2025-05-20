import { twMerge } from "tailwind-merge";

export default function EventItemSkeleton() {
  return (
    <div
      className={twMerge(
        "flex gap-4 mt-5 p-3 bg-secondary rounded-lg animate-pulse w-full"
      )}
    >
      <div className="w-23 h-23 bg-gray-700 rounded-lg"></div>

      <div className="overflow-hidden flex-1">
        <div className="h-6 bg-gray-700 rounded w-3/4 mb-2"></div>

        <div className="flex gap-2 overflow-x-auto max-w-full scrollbar-hide mt-5">
          {[...Array(3)].map((_, idx) => (
            <div key={idx} className="h-5 w-16 bg-gray-700 rounded-full" />
          ))}
        </div>
      </div>
    </div>
  );
}
