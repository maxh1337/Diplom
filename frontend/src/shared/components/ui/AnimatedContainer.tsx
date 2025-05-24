import { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

export default function AnimatedContainer({ children }: Props) {
  return (
    <div className="flex w-full h-full gap-10 transition-all duration-500 ease-in-out mt-4 overflow-x-hidden">
      {children}
    </div>
  );
}
