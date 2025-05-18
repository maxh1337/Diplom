import { useUserZustand } from "../hooks/useTgUserZustand";

export default function TgUser() {
  const { isLoading, user } = useUserZustand();

  return (
    <div className="bg-black p-6 rounded-lg shadow-md w-full h-full">
      <h1 className="text-2xl font-bold mb-4 text-white">
        Привет, {user?.telegramUsername ? user?.telegramUsername : "Anonymous"}
      </h1>
      <div className="text-lg mb-4 text-white">
        {isLoading
          ? "Загрузка..."
          : user
          ? user.telegramUsername
          : "Ошибка: пользователь не найден"}
      </div>
    </div>
  );
}
