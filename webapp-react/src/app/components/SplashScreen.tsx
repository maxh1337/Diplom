import { twMerge } from "tailwind-merge";
import { useDebounce } from "../../shared/hooks/useDebounce";
import { useSplashScreenZustand } from "../../shared/hooks/useSplashScreenZustand";

interface SplashScreenProps {
  onComplete: () => void;
}

export default function SplashScreen({ onComplete }: SplashScreenProps) {
  const { isVisible, setIsVisible } = useSplashScreenZustand();

  useDebounce(() => {
    setIsVisible(false);
    onComplete();
  }, 2000);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-black text-white z-50 animate-fade-in animate-fade-out">
      <h1
        className={twMerge(
          "first-letter:text-white",
          "font-logo text-yellow-300 text-3xl mb-5"
        )}
      >
        ЯБуду!
      </h1>
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-yellow-300 mb-4"></div>
    </div>
  );
}
