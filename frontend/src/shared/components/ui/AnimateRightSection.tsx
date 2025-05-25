"use client";

import { Maximize2, Minimize2 } from "lucide-react";
import { ReactNode } from "react";
import { twMerge } from "tailwind-merge";

interface AnimatedRightSectionProps {
  isOpen: boolean;
  children: ReactNode;
  isRightSectionFullScreen: boolean;
  openRightSectionFullscreen: (isRightSectionFullScreen: boolean) => void;
}

export default function AnimatedRightSection({
  isOpen,
  children,
  isRightSectionFullScreen,
  openRightSectionFullscreen,
}: AnimatedRightSectionProps) {
  return (
    <div
      className={twMerge(
        "bg-secondary rounded-2xl p-4 flex flex-col overflow-hidden transition-all duration-500 ease-in-out relative",
        isOpen
          ? "event-details-enter w-[40%] opacity-100"
          : "event-details-exit w-0 opacity-0",

        isOpen && isRightSectionFullScreen && "w-full"
      )}
      style={{ animationFillMode: "both" }}
    >
      <button
        onClick={() => openRightSectionFullscreen(!isRightSectionFullScreen)}
        className="absolute top-0 left-0 z-10 text-white hover:text-yellow-400 transition p-5 "
        title={isRightSectionFullScreen ? "Свернуть" : "На весь экран"}
      >
        {isRightSectionFullScreen ? (
          <Minimize2 size={20} />
        ) : (
          <Maximize2 size={20} />
        )}
      </button>

      {children}
    </div>
  );
}
