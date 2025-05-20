import { twMerge } from "tailwind-merge";

interface UserProfileCardSkeletonProps {
  variant: "horizontal" | "vertical";
}

export default function ProfileCardSkeleton({
  variant,
}: UserProfileCardSkeletonProps) {
  return (
    <section
      className={twMerge(
        "bg-black text-white rounded-lg flex items-center animate-pulse",
        variant === "horizontal"
          ? "flex-row space-x-4 w-full"
          : "flex-col space-y-2 w-32 text-center"
      )}
    >
      <div
        className={twMerge(
          "w-12 h-12 rounded-full bg-gray-700",
          variant === "vertical" && "mx-auto"
        )}
      />
      <div className={twMerge(variant === "horizontal" ? "flex-1" : "")}>
        <div className="h-6 bg-gray-700 rounded w-3/4 mb-2" />
        <div className="h-4 bg-gray-700 rounded w-1/2" />
      </div>
    </section>
  );
}
