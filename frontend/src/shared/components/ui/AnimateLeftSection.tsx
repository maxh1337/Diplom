"use client";

import { ReactNode } from "react";
import { twMerge } from "tailwind-merge";
import { useEventDetailsZustand } from "../../../features/events/hooks/useEventDetailsZustand";

interface AnimatedLeftSectionProps {
  isOpen: boolean;
  children: ReactNode;
}

export default function AnimatedLeftSection({
  isOpen,
  children,
}: AnimatedLeftSectionProps) {
  const { isRightSectionFullScreen } = useEventDetailsZustand();

  return (
    <div
      className={twMerge(
        "transition-all duration-500 ease-in-out overflow-hidden rounded-2xl bg-secondary p-4 relative",
        isRightSectionFullScreen
          ? "w-0 opacity-0 p-0 hidden"
          : isOpen
          ? "w-[60%] opacity-100"
          : "w-full opacity-100"
      )}
    >
      {children}
    </div>
  );
}
