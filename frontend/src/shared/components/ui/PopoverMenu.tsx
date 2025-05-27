"use client";

import * as Popover from "@radix-ui/react-popover";
import { ReactNode } from "react";
import { twMerge } from "tailwind-merge";

export interface PopoverItem {
  label: string;
  onSelect: () => void;
  icon?: ReactNode;
  destructive?: boolean;
}

interface CustomPopoverProps {
  trigger: ReactNode;
  items: PopoverItem[];
  side?: Popover.PopoverContentProps["side"];
  align?: Popover.PopoverContentProps["align"];
  sideOffset?: number;
  alignOffset?: number;
}

export function CustomPopover({
  trigger,
  items,
  side = "top",
  align = "start",
  sideOffset = 8,
  alignOffset = 4,
}: CustomPopoverProps) {
  return (
    <Popover.Root>
      <Popover.Trigger asChild>{trigger}</Popover.Trigger>

      <Popover.Portal>
        <Popover.Content
          side={side}
          align={align}
          sideOffset={sideOffset}
          alignOffset={alignOffset}
          className={twMerge(
            "bg-fourth text-white rounded-lg shadow-lg z-50",
            "overflow-hidden"
          )}
        >
          {items.map((item, idx) => (
            <button
              key={idx}
              onClick={() => item.onSelect()}
              className={twMerge(
                "flex items-center w-full px-4 py-2 text-left text-sm transition-colors cursor-pointer",
                item.destructive ? "hover:bg-red-500" : "hover:bg-yellow-500",
                idx === 0 ? "rounded-t-lg" : "",
                idx === items.length - 1 ? "rounded-b-lg" : ""
              )}
            >
              {item.icon && (
                <span className="mr-2 flex-shrink-0">{item.icon}</span>
              )}
              {item.label}
            </button>
          ))}
          <Popover.Arrow className="fill-fourth" />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
