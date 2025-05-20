import UserProfileCard from "../../features/home/components/ProfileCard";

export default function ProfilePage() {
  return (
    <section className=" w-full flex flex-col items-center pt-5 h-full">
      <UserProfileCard variant="horizontal" />
    </section>
  );
}
