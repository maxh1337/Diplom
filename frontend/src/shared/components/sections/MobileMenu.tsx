"use client";

import { AnimatePresence, motion } from "framer-motion";
import { User } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import type { FC } from "react";
import { twMerge } from "tailwind-merge";
import { useProfile } from "../../hooks/useProfile";
import Button from "../ui/Button";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  navItems: Array<{ name: string; href: string }>;
  userName: string;
}

const MobileMenu: FC<MobileMenuProps> = ({
  isOpen,
  onClose,
  navItems,
  userName = "",
}) => {
  const pathname = usePathname();
  const router = useRouter();
  const { logOut } = useProfile();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black z-40"
            onClick={onClose}
          />

          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed top-0 min-h-[65vh] right-0 w-full bg-white z-50 px-13 flex flex-col py-[40px] justify-center"
          >
            {/* 65vh или 363px Как по макету*/}
            <div className="flex justify-end">
              <button
                onClick={onClose}
                className="w-[30px] h-[30px] flex items-center justify-center rounded-full bg-primary"
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 14 14"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M13 1L1 13M1 1L13 13"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>

            <nav className="mt-8 flex flex-1 justify-center">
              <ul className="space-y-4 w-full sm:w-3/4 md:w-[50%]">
                {navItems.map((item) => (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className={twMerge(
                        "block uppercase font-medium py-2 border-b border-gray-200",
                        pathname === item.href
                          ? "text-primary"
                          : "text-[#181818]"
                      )}
                      onClick={onClose}
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="mt-10 flex flex-col items-center">
              <div
                className={`w-16 h-16 rounded-full flex items-center justify-center `}
              >
                <User className="w-8 h-8 text-gray-500" />
              </div>

              <Button
                variant="second"
                className="mt-4"
                onClick={() => logOut()}
              >
                Выйти
              </Button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default MobileMenu;
