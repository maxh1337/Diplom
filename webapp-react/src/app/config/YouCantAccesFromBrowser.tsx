import { useDebugTgZustand } from "../../shared/hooks/useDebugTg";

export function usePlatformGuard() {
  const { isAllowedPlatform } = useDebugTgZustand();

  if (isAllowedPlatform === null) {
    return null; // Ожидание инициализации
  }

  if (!isAllowedPlatform) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white p-4">
        <div className="bg-gray-800 rounded-xl p-6 max-w-md text-center">
          <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
          <p className="text-lg mb-4">
            Sorry, this WebApp is only accessible via Telegram on iOS, Android,
            or Desktop.
          </p>
          <p className="text-md mb-4">
            Please open this link in the Telegram app on your iOS, Android, or
            Desktop device.
          </p>
          <a
            href="https://telegram.org/dl"
            className="text-yellow-300 font-bold hover:underline"
          >
            Download Telegram
          </a>
        </div>
      </div>
    );
  }

  return false;
}
