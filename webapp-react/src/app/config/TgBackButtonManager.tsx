import { backButton } from "@telegram-apps/sdk-react";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export const ROUTES_WITH_BACK_BUTTON = ["/event/", "/leave-feedback"];

export default function BackButtonManager() {
  const location = useLocation();

  useEffect(() => {
    backButton.mount();
    const shouldShowBackButton = ROUTES_WITH_BACK_BUTTON.some((path) =>
      location.pathname.startsWith(path)
    );

    if (shouldShowBackButton) {
      backButton.show();
      backButton.onClick(() => window.history.back());
    } else {
      backButton.hide();
    }

    return () => {
      backButton.unmount();
    };
  }, [location.pathname]);

  return null;
}
