import { Outlet } from "react-router-dom";
import { useShowBottomMenu } from "../../shared/hooks/useShowBottomMenu";
import { Providers } from "../config/Providers";
import BottomMenu from "./BottomMenu";

export default function Layout() {
  const { isVisible } = useShowBottomMenu();

  return (
    <Providers>
      <div className="h-full bg-black pt-tg">
        <main className="px-5 items-center h-[80vh] bg-black flex flex-col pt-tg">
          <Outlet />
          {isVisible && <BottomMenu />}
        </main>
      </div>
    </Providers>
  );
}
