import { twMerge } from "tailwind-merge";
import { useUserZustand } from "../../../shared/hooks/useUserZustand";
import ProfileCardSkeleton from "./ProfileCardSkeleton";

interface UserProfileCardProps {
  variant: "horizontal" | "vertical";
}

export default function UserProfileCard({ variant }: UserProfileCardProps) {
  const { user, isLoading } = useUserZustand();

  if (isLoading) return <ProfileCardSkeleton variant={variant} />;

  return (
    <section
      className={twMerge(
        "bg-black text-white rounded-lg flex items-center",
        variant === "horizontal"
          ? "flex-row space-x-4 w-full"
          : "flex-col space-y-2 w-32 text-center"
      )}
    >
      <img
        src={user?.photoUrl || "https://via.placeholder.com/48"}
        alt={`${user?.nickname || "User"}'s profile`}
        className={twMerge(
          "w-12 h-12 rounded-full object-cover",
          variant === "vertical" && "mx-auto"
        )}
      />
      <div>
        <div className={twMerge("font-bold text-md font-unbound")}>
          {user?.nickname || "Unnamed"}
        </div>
        <div className={twMerge("text-sm text-gray-400 font-brain")}>
          @{user?.telegramUsername || "unknown"}
        </div>
      </div>
    </section>
  );
}
