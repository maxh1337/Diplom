import { useNavigate } from "react-router-dom";
import { twMerge } from "tailwind-merge";

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="text-center text-white items-center justify-center flex flex-col mt-10">
      <h1 className="text-3xl font-bold mb-4">404 - Page Not Found</h1>
      <p className="text-lg">
        Sorry, the page you are looking for does not exist.
      </p>
      <button
        className={twMerge(
          "bg-third text-yellow-300 px-6 py-3 rounded-2xl border-white border cursor-pointer mt-10",
          "first-letter:text-white",
          "font-logo text-yellow-300 text-lg",
          "hover:bg-gray-800 transition-colors duration-300 ease-in-out"
        )}
        onClick={() => navigate(-1)}
      >
        Вернуться
      </button>
    </div>
  );
}
