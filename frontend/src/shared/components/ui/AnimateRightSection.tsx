"use client";

import { ReactNode } from "react";
import { twMerge } from "tailwind-merge";

interface AnimatedRightSectionProps {
  isOpen: boolean;
  children: ReactNode;
}

export default function AnimatedRightSection({
  isOpen,
  children,
}: AnimatedRightSectionProps) {
  return (
    <div
      className={twMerge(
        "bg-secondary rounded-2xl p-4 flex flex-col overflow-hidden transition-all duration-500 ease-in-out",
        isOpen
          ? "event-details-enter w-[40%] opacity-100"
          : "event-details-exit w-0 opacity-0"
      )}
      style={{ animationFillMode: "both" }}
    >
      {children}
    </div>
  );
}
