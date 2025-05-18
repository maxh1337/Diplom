import { Outlet } from "react-router-dom";
import { useShowBottomMenu } from "../../shared/hooks/useShowBottomMenu";
import { Providers } from "../config/Providers";
import BottomMenu from "./BottomMenu";

export default function Layout() {
  const { isVisible } = useShowBottomMenu();

  return (
    <Providers>
      <div className="h-full bg-black pt-tg">
        <main className="px-5 flex flex-col items-center pt-tg h-full bg-black ">
          <Outlet />
          {isVisible && <BottomMenu />}
        </main>
      </div>
    </Providers>
  );
}
