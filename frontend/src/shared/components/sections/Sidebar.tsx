"use client";

import { Calendar, Home, Users } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { twMerge } from "tailwind-merge";
import Button from "../ui/Button";

const navItems = [
  { name: "Dashboard", href: "/dashboard", icon: Home },
  { name: "Events", href: "/dashboard/events", icon: Calendar },
  { name: "Users", href: "/dashboard/users", icon: Users },
];

export function Sidebar() {
  const pathname = usePathname();

  //   if (pathname === "/") return null;

  return (
    <aside className="w-[13vw] bg-secondary text-white flex flex-col px-6 py-8 rounded-tr-3xl rounded-br-3xl">
      <h1 className="text-2xl font-bold mb-10 font-logo first-letter:text-white text-fifth text-center">
        ЯБуду
      </h1>
      <nav className="space-y-4 items-center flex flex-col w-full justify-between h-full">
        <div>
          {navItems.map((item) => {
            const isActive = pathname.startsWith(item.href);
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={twMerge(
                  "flex items-center gap-3 rounded-xl px-4 py-2 text-lg transition-colors font-brain",
                  isActive && "bg-[#1e2939] text-white",
                  !isActive && "text-[#6a7282] hover:bg-[#1e2939]/50"
                )}
              >
                <Icon size={25} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </div>
        <Button variant="second">Выйти</Button>
      </nav>
    </aside>
  );
}
