import { useEffect, useState } from "react";

export const useKeyboard = () => {
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);

  useEffect(() => {
    const onFocus = () => setIsKeyboardOpen(true);
    const onBlur = () => setIsKeyboardOpen(false);

    window.addEventListener("focusin", onFocus);
    window.addEventListener("focusout", onBlur);

    return () => {
      window.removeEventListener("focusin", onFocus);
      window.removeEventListener("focusout", onBlur);
    };
  }, []);

  return isKeyboardOpen;
};
