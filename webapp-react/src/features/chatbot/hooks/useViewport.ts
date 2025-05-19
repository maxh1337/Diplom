import { bindViewportCssVars, viewport } from "@telegram-apps/sdk-react";
import { useEffect, useState } from "react";
import { useShowBottomMenu } from "../../../shared/hooks/useShowBottomMenu";

const useViewport = () => {
  const setBottomMenuVisible = useShowBottomMenu((s) => s.setIsVisible);
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);

  useEffect(() => {
    async function initViewport() {
      try {
        if (viewport.mount.isAvailable() && !viewport.isMounting()) {
          await viewport.mount();
        }

        if (bindViewportCssVars.isAvailable()) {
          bindViewportCssVars();
        }

        if (viewport.expand.isAvailable()) {
          viewport.expand();
        }

        const updateKeyboardState = () => {
          const viewportHeight = parseFloat(
            getComputedStyle(document.documentElement).getPropertyValue(
              "--tg-viewport-height"
            )
          );
          const windowHeight = window.innerHeight;
          const isOpen = viewportHeight < windowHeight - 50;
          setIsKeyboardOpen(isOpen);

          if (!isOpen) {
            setBottomMenuVisible(true);
          }
        };

        window.addEventListener("resize", updateKeyboardState);
        updateKeyboardState();

        return () => {
          window.removeEventListener("resize", updateKeyboardState);
        };
      } catch (error) {
        console.error("GeminiChatbot: Failed to initialize viewport", error);
      }
    }

    initViewport();
  }, [setBottomMenuVisible]);

  return { isKeyboardOpen };
};

export default useViewport;
