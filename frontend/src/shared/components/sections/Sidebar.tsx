"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { twMerge } from "tailwind-merge";
import { navItems } from "../../constants/router.contstants";
import { useProfile } from "../../hooks/useProfile";
import Button from "../ui/Button";

export function Sidebar() {
  const { logOut, admin } = useProfile();
  const pathname = usePathname();

  if (pathname === "/auth") return null;

  return (
    <aside
      className={twMerge(
        "hidden lg:flex sticky top-0 self-start h-screen z-10", // sticky вместо fixed
        "bg-secondary text-white flex-col py-8 rounded-tr-3xl rounded-br-3xl",
        "px-2 xl:px-6 w-[18vw] xl:w-[16vw] 2xl:w-[14vw]"
      )}
    >
      <h1 className="text-2xl font-bold mb-10 font-logo first-letter:text-white text-fifth text-center">
        ЯБуду
      </h1>
      <nav className="space-y-4 items-center flex flex-col w-full justify-between h-full">
        <div className="w-full">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const isProtected =
              item.protection && !admin?.rights.includes("FULL");

            if (isProtected) {
              return null;
            }

            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={twMerge(
                  "flex items-center gap-3 rounded-xl px-4 py-2 text-lg transition-colors font-brain w-full",
                  isActive && "bg-[#1e2939] text-white",
                  !isActive && "text-[#6a7282] hover:bg-[#1e2939]/50"
                )}
              >
                <span className="w-5 h-5 xl:w-6 xl:h-6 text-current">
                  <Icon width="100%" height="100%" />
                </span>
                <span>{item.name}</span>
              </Link>
            );
          })}
        </div>
        <Button variant="second" onClick={() => logOut()}>
          Выйти
        </Button>
      </nav>
    </aside>
  );
}
