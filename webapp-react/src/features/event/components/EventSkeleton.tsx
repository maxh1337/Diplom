export default function EventSkeleton() {
  return (
    <div className="p-4 w-full animate-pulse">
      <div className="w-full h-[30vh] bg-gray-700 rounded-xl mb-4" />
      <div className="h-8 bg-gray-700 rounded w-2/3 mb-4" />

      <div className="flex gap-2 mb-4">
        {Array.from({ length: 3 }).map((_, idx) => (
          <div key={idx} className="bg-gray-600 h-6 rounded-full px-4 w-20" />
        ))}
      </div>

      <div className="flex gap-2 mb-2">
        <div className="h-4 bg-gray-700 rounded w-20" />
        <div className="h-4 bg-gray-600 rounded w-32" />
      </div>
      <div className="flex gap-2 mb-2">
        <div className="h-4 bg-gray-700 rounded w-20" />
        <div className="h-4 bg-gray-600 rounded w-24" />
      </div>

      <div className="h-4 bg-gray-700 rounded w-24 mb-1" />
      <div className="space-y-2 mb-6">
        <div className="h-4 bg-gray-700 rounded w-full" />
        <div className="h-4 bg-gray-700 rounded w-5/6" />
        <div className="h-4 bg-gray-700 rounded w-3/4" />
      </div>

      <div className="bg-gray-700 h-10 w-40 rounded-2xl mx-auto" />
    </div>
  );
}
