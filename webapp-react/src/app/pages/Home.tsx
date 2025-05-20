import ContrinueRegistrationForm from "../../features/home/components/ContrinueRegistrationForm";
import ProfileCard from "../../features/home/components/ProfileCard";
import UpcomingEvents from "../../features/home/components/UpcomingEvents";
import { useSplashScreenZustand } from "../../shared/hooks/useSplashScreenZustand";
import { useUserZustand } from "../../shared/hooks/useUserZustand";
import SplashScreen from "../components/SplashScreen";

export default function Home() {
  const { isLoading, user } = useUserZustand();
  const { isVisible, setIsVisible } = useSplashScreenZustand();

  const handleSplashComplete = () => {
    if (!isLoading) {
      setIsVisible(false);
    }
  };

  if (isVisible) {
    return <SplashScreen onComplete={handleSplashComplete} />;
  }

  return (
    <section className=" w-full flex flex-col items-center h-full pt-5">
      {!user?.nickname ? (
        <ContrinueRegistrationForm />
      ) : (
        <>
          <ProfileCard variant="horizontal" />
          <UpcomingEvents />
        </>
      )}
    </section>
  );
}
