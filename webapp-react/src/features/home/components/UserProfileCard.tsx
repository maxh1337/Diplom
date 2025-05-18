import { twMerge } from "tailwind-merge";
import { useUserZustand } from "../../../shared/hooks/useTgUserZustand";

interface UserProfileCardProps {
  variant: "horizontal" | "vertical";
}

export default function UserProfileCard({ variant }: UserProfileCardProps) {
  const { user } = useUserZustand();

  if (!user) return null;

  const { photoUrl, nickname, telegramUsername } = user;

  const baseStyles = "bg-black text-white rounded-lg flex items-center";
  const horizontalStyles = "flex-row space-x-4 w-full";
  const verticalStyles = "flex-col space-y-2 w-32 text-center";
  const imageStyles = "w-12 h-12 rounded-full object-cover";
  const nameStyles = "font-bold text-md font-unbound";
  const usernameStyles = "text-sm text-gray-400 font-brain";

  const containerStyles = twMerge(
    baseStyles,
    variant === "horizontal" ? horizontalStyles : verticalStyles
  );

  return (
    <section className={containerStyles}>
      <img
        src={photoUrl || "https://via.placeholder.com/48"} // Замена на placeholder, если photoUrl отсутствует
        alt={`${nickname || "User"}'s profile`}
        className={imageStyles}
      />
      <div>
        <div className={twMerge(nameStyles, "font-medium")}>
          {nickname || "Unnamed"}
        </div>
        <div className={usernameStyles}>@{telegramUsername || "unknown"}</div>
      </div>
    </section>
  );
}
