import {
  bindMiniAppCssVars,
  bindViewportCssVars,
  closingBehavior,
  initData,
  init as initSDK,
  isFullscreen,
  miniAppReady,
  mountMiniAppSync,
  requestFullscreen,
  restoreInitData,
  setDebug,
  setMiniAppBackgroundColor,
  setMiniAppHeaderColor,
  swipeBehavior,
  themeParams,
  viewport,
} from "@telegram-apps/sdk-react";

export async function initTelegramSdk(debug: boolean, platform: string) {
  setDebug(debug);
  initSDK();

  restoreInitData();
  initData.restore();

  if (viewport.mount.isAvailable() && !viewport.isMounting()) {
    await viewport.mount();
  }

  if (viewport.expand.isAvailable()) {
    viewport.expand();
  }

  if (bindViewportCssVars.isAvailable()) {
    bindViewportCssVars();
  }

  if (bindMiniAppCssVars.isAvailable()) {
    bindMiniAppCssVars();
  }

  if (requestFullscreen.isAvailable() && platform !== "tdesktop") {
    await requestFullscreen();
    isFullscreen();
  }

  if (mountMiniAppSync.isAvailable()) {
    mountMiniAppSync();
  }

  if (themeParams.mountSync.isAvailable()) {
    themeParams.mountSync();
  }

  if (requestFullscreen.isAvailable() && platform !== "tdesktop") {
    await requestFullscreen();
    isFullscreen();
  }

  if (swipeBehavior.mount.isAvailable()) {
    swipeBehavior.mount();
  }

  if (
    swipeBehavior.isMounted() &&
    swipeBehavior.disableVertical.isAvailable()
  ) {
    swipeBehavior.disableVertical();
  }

  if (setMiniAppBackgroundColor.isAvailable()) {
    setMiniAppBackgroundColor("#000000");
  }

  if (setMiniAppHeaderColor.isAvailable()) {
    setMiniAppHeaderColor("#000000");
  }

  if (closingBehavior.mount.isAvailable()) {
    closingBehavior.mount();
    if (closingBehavior.enableConfirmation.isAvailable()) {
      closingBehavior.enableConfirmation();
    }
  }

  miniAppReady();
}
