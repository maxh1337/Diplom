"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
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
  userType?: "guest" | "user" | "admin";
  userName?: string;
  imageUrl: string | undefined;
}

const MobileMenu: FC<MobileMenuProps> = ({
  isOpen,
  onClose,
  navItems,
  userType = "guest",
  userName = "",
  imageUrl,
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

            {userType !== "guest" && (
              <div className="mt-10 flex flex-col items-center">
                <div
                  className={`w-16 h-16 rounded-full flex items-center justify-center ${
                    userType === "admin" ? "bg-primary" : "bg-gray-200"
                  }`}
                >
                  {imageUrl ? (
                    <Image
                      src={imageUrl ? imageUrl : ""}
                      alt="User image"
                      width={64}
                      height={64}
                      className=" rounded-full"
                    />
                  ) : (
                    <svg
                      width="32"
                      height="32"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z"
                        stroke={userType === "admin" ? "white" : "#181818"}
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M20.5899 22C20.5899 18.13 16.7399 15 11.9999 15C7.25991 15 3.40991 18.13 3.40991 22"
                        stroke={userType === "admin" ? "white" : "#181818"}
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </div>
                <p
                  className={`mt-2 font-medium ${
                    userType === "admin" ? "text-primary" : "text-gray-600"
                  }`}
                >
                  {userType === "admin" ? "ADMIN" : userName.toUpperCase()}
                </p>
                <Button
                  variant="orange-outlined"
                  className="mt-4"
                  onClick={() => logOut()}
                >
                  Выйти
                </Button>
              </div>
            )}

            {userType === "guest" && (
              <div className="mt-auto space-y-3 flex flex-col justify-center items-center">
                <Button
                  className={twMerge("w-full sm:w-3/4 md:w-[50%]")}
                  variant="orange-outlined"
                  onClick={() => router.push("/auth/login")}
                >
                  Войти
                </Button>
                <Button
                  className={twMerge("w-full sm:w-3/4 md:w-[50%]")}
                  variant="orange-contained"
                  onClick={() => router.push("/auth/register")}
                >
                  Регистрация
                </Button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default MobileMenu;
