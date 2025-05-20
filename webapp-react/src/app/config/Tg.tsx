"use client";

import { initData, retrieveLaunchParams } from "@telegram-apps/sdk-react";
import { useEffect } from "react";
import { initTelegramSdk } from "../../initTelegramSdk";
import { useDebugTgZustand } from "../../shared/hooks/useDebugTg";
import { useUserZustand } from "../../shared/hooks/useUserZustand";

export function Tg() {
  const { fetchProfile, setInitData } = useUserZustand();
  const { setIsAllowedPlatform, setPlatform } = useDebugTgZustand();

  useEffect(() => {
    async function initialize() {
      const launchParams = retrieveLaunchParams();
      const platform = launchParams.tgWebAppPlatform;
      const debug =
        (launchParams.tgWebAppStartParam || "").includes("platformer_debug") ||
        import.meta.env.DEV;

      const allowedPlatforms = ["ios", "android", "tdesktop"];
      const isAllowed = allowedPlatforms.includes(platform);

      setPlatform(platform);
      setIsAllowedPlatform(isAllowed);

      await initTelegramSdk(debug, platform);

      const rawData = initData.raw();
      if (rawData) {
        sessionStorage.setItem("initData", rawData);
      }
      if (rawData) {
        setInitData(rawData);
        await fetchProfile(rawData);
      }
    }

    void initialize();
  }, [fetchProfile, setInitData, setIsAllowedPlatform, setPlatform]);

  return null;
}
