import { Outlet } from "react-router-dom";
import { useShowBottomMenu } from "../../shared/hooks/useShowBottomMenu";
import { Providers } from "../config/Providers";
import BottomMenu from "./BottomMenu";
import BackButtonManager from "../config/TgBackButtonManager";

export default function Layout() {
  const { isVisible } = useShowBottomMenu();

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
