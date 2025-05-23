export default function Custom404() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-gray-800">
      <h1 className="text-6xl font-bold text-red-600">404</h1>
      <p className="text-2xl mt-4">Oops! Страница не найдена.</p>
      <p className="mt-2">
        Похоже, вы забрели не туда. Давайте вернемся на главную!
      </p>
      <a
        href="/"
        className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
      >
        Вернуться на главную
      </a>
    </div>
  );
}
