import {
  ChatBubbleBottomCenterIcon,
  HomeIcon,
  UserIcon,
} from "@heroicons/react/24/outline";
import { useEffect } from "react";
import { MdEvent } from "react-icons/md";
import { NavLink, useLocation } from "react-router-dom";
import { useShowBottomMenu } from "../../shared/hooks/useShowBottomMenu";
import { useUserZustand } from "../../shared/hooks/useUserZustand";

export default function BottomMenu() {
  const { user } = useUserZustand();
  const { isVisible, setIsVisible } = useShowBottomMenu();
  const location = useLocation();

  useEffect(() => {
    const shouldHideBottomMenu = location.pathname.startsWith("/event/");

    if (shouldHideBottomMenu === true) {
      setIsVisible(false);
    } else {
      setIsVisible(true);
    }
  }, [location.pathname]);

  const menuItems = [
    {
      name: "Home",
      url: "/",
      icon: <HomeIcon className="size-6" />,
    },
    {
      name: "Events",
      url: "/events",
      icon: <MdEvent className="size-6" />,
    },
    {
      name: "Chatbot",
      url: "/chatbot",
      icon: <ChatBubbleBottomCenterIcon className="size-6" />,
    },
    {
      name: "Profile",
      url: "/profile",
      icon: <UserIcon className="size-6" />,
    },
  ].filter(
    (item) =>
      item.name !== "Profile" || (item.name === "Profile" && user?.nickname)
  );

  if (!isVisible) {
    return null;
  }

  if (!user?.nickname) {
    return null;
  }

  return (
    <section className="fixed bottom-0 left-0 w-full backdrop-blur-sm h-16 px-5 flex items-center z-50 pb-tg">
      <div className="flex justify-around w-full">
        {menuItems.map((item, idx) => (
          <NavLink
            key={idx}
            to={item.url}
            className={({ isActive }) =>
              `flex flex-col items-center text-white transition-colors ${
                isActive ? "text-yellow-300" : "hover:text-blue-200"
              }`
            }
          >
            {item.icon}
            <span className="text-sm">{item.name}</span>
          </NavLink>
        ))}
      </div>
    </section>
  );
}
