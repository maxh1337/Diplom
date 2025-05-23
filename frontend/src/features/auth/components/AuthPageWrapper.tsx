import { ReactNode } from "react";
import { twMerge } from "tailwind-merge";

interface Props {
  children: ReactNode;
}

export function AuthPageWrapper({ children }: Props) {
  return (
    <div
      className={twMerge(
        "flex justify-center w-full items-center min-h-[90svh] mx-auto"
        // "min-h-[50%]"
      )}
    >
      <div
        className={twMerge(
          "bg-white rounded-lg shadow-md relative overflow-hidden p-8",
          "sm:px-16 md:px-20"
        )}
      >
        {children}
      </div>
    </div>
  );
}
