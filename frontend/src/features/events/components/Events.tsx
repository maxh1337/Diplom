"use client";

import { useState } from "react";
import { twMerge } from "tailwind-merge";

export default function Events() {
  const [isLeftMenuShown, setIsLeftMenuShown] = useState(false);

  // Получение данных с админки

  return (
    <div className="w-full h-full text-white">
      <h1 className="font-brain text-2xl mb-4">DashBoard</h1>
      <div className="flex w-full h-full gap-10 transition-all duration-500 ease-in-out">
        <div
          className={twMerge(
            "bg-secondary rounded-2xl transition-all duration-500 ease-in-out",
            isLeftMenuShown ? "w-full" : "w-[60%]"
          )}
        >
          <p
            className="h-20 bg-third border border-white cursor-pointer"
            onClick={() => {
              console.log("click");
              setIsLeftMenuShown(!isLeftMenuShown);
            }}
          >
            Click
          </p>
        </div>

        {!isLeftMenuShown && (
          <div className="bg-secondary w-[40%] rounded-2xl transition-all duration-500 ease-in-out" />
        )}
      </div>
    </div>
  );
}
