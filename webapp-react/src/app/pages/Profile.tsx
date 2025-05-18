import UserProfileCard from "../../features/home/components/UserProfileCard";

export default function Profile() {
  return (
    <section className=" w-full flex flex-col items-center pt-10">
      <UserProfileCard variant="horizontal" />
    </section>
  );
}
