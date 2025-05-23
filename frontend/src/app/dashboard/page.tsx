import { Metadata } from "next";
import Statistics from "../../features/dashboard/components/Statistics";

export const metadata: Metadata = {
  title: "Dashboard - Statistics",
};

export default function Page() {
  return (
    <div className="w-full">
      <Statistics />
    </div>
  );
}
