import { motion } from "framer-motion";
import { twMerge } from "tailwind-merge";
import { useDebugTgZustand } from "../../../../shared/hooks/useDebugTg";

export default function EventDetailsPopupSkeleton() {
  const { platform } = useDebugTgZustand();

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-sm">
      <motion.div
        className={twMerge(
          "relative bg-secondary rounded-2xl p-6 w-[90vw] flex flex-col animate-pulse",
          platform === "tdesktop" ? "max-h-[90vh]" : "max-h-[75vh]"
        )}
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.5, opacity: 0 }}
        transition={{ duration: 0.4, ease: "easeInOut" }}
      >
        <div className="absolute top-2 right-2 text-white bg-black rounded-full p-1 px-2.5 text-sm opacity-50">
          X
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-hide pr-2">
          <div className="w-full h-[20vh] bg-gray-700 rounded-xl mb-4 mt-5" />

          <div className="h-6 bg-gray-700 rounded w-3/4 mb-4" />

          <div className="flex gap-2 overflow-x-auto max-w-full mb-4">
            {Array.from({ length: 3 }).map((_, idx) => (
              <div
                key={idx}
                className="bg-gray-600 h-6 rounded-full px-4 w-20"
              />
            ))}
          </div>

          <div className="flex gap-2 text-white mb-2">
            <div className="h-4 bg-gray-700 rounded w-20" />
            <div className="h-4 bg-gray-600 rounded w-32" />
          </div>
          <div className="flex gap-2 text-white mb-2">
            <div className="h-4 bg-gray-700 rounded w-20" />
            <div className="h-4 bg-gray-600 rounded w-24" />
          </div>

          <div className="h-4 bg-gray-700 rounded w-24 mb-1" />
          <div className="space-y-2 mb-4">
            <div className="h-4 bg-gray-700 rounded w-full" />
            <div className="h-4 bg-gray-700 rounded w-5/6" />
            <div className="h-4 bg-gray-700 rounded w-3/4" />
          </div>
        </div>

        {/* Кнопка */}
        <div className="mt-4 text-center">
          <div className="bg-gray-700 h-10 w-40 rounded-2xl mx-auto" />
        </div>
      </motion.div>
    </div>
  );
}
