import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { useShowBottomMenu } from "../../shared/hooks/useShowBottomMenu";
import { Providers } from "../config/Providers";
import BackButtonManager from "../config/TgBackButtonManager";
import BottomMenu from "./BottomMenu";

export default function Layout() {
  const { isVisible, setIsVisible } = useShowBottomMenu();
  const pathname = useLocation().pathname;

  useEffect(() => {
    if (pathname === "/") setIsVisible(true);
    if (pathname === "/events") setIsVisible(true);
    if (pathname === "/profile") setIsVisible(true);
  }, [pathname]);

  return (
    <Providers>
      <div className="h-full bg-black pt-tg">
        <main className="px-5 items-center h-full bg-black flex flex-col pt-tg">
          <BackButtonManager />
          <Outlet />
          {isVisible && <BottomMenu />}
        </main>
      </div>
    </Providers>
  );
}
