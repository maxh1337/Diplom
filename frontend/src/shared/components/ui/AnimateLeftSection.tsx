"use client";

import { ReactNode } from "react";
import { twMerge } from "tailwind-merge";

interface AnimatedLeftSectionProps {
  isOpen: boolean;
  children: ReactNode;
}

export default function AnimatedLeftSection({
  isOpen,
  children,
}: AnimatedLeftSectionProps) {
  return (
    <div
      className={twMerge(
        "bg-secondary rounded-2xl transition-all duration-500 ease-in-out p-4",
        isOpen ? "w-[60%] opacity-100" : "w-full opacity-100"
      )}
    >
      {children}
    </div>
  );
}
