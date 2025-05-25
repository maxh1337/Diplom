"use client";

import { Menu } from "lucide-react";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { navItems } from "../../constants/router.contstants";
import { useProfile } from "../../hooks/useProfile";
import MobileMenu from "./MobileMenu";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { admin } = useProfile();

  const pathname = usePathname();

  const hiddenRoutes = ["/auth"];
  if (hiddenRoutes.includes(pathname)) return null;

  return (
    <>
      <header className="flex justify-between lg:justify-end items-center px-12 py-4 bg-black text-white">
        <div className="flex items-center">
          <h1 className="text-2xl font-bold font-logo first-letter:text-white text-fifth text-center block lg:hidden">
            ЯБуду
          </h1>
          <div className="hidden lg:block text-md font-brain text-white font-bold">
            {admin?.login && `${admin.login}`}
          </div>
        </div>

        <div>
          <button
            className="lg:hidden"
            onClick={() => setIsMenuOpen(true)}
            aria-label="Открыть меню"
          >
            <Menu size={28} />
          </button>
        </div>
      </header>

      <MobileMenu
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        navItems={navItems}
        userName={admin?.username || ""}
      />
    </>
  );
}
