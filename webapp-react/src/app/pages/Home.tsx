import ContrinueRegistrationForm from "../../features/home/components/ContrinueRegistrationForm";
import UpcomingEvents from "../../features/home/components/UpcomingEvents";
import UserProfileCard from "../../features/home/components/UserProfileCard";
import { useSplashScreenZustand } from "../../shared/hooks/useSplashScreenZustand";
import { useUserZustand } from "../../shared/hooks/useTgUserZustand";
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
    <section className=" w-full flex flex-col items-center pt-10">
      {!user?.nickname ? (
        <ContrinueRegistrationForm />
      ) : (
        <>
          <UserProfileCard variant="horizontal" />
          <UpcomingEvents />
        </>
      )}
    </section>
  );
}
