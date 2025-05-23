import { Metadata } from "next";
import Events from "../../../features/events/components/Events";

export const metadata: Metadata = {
  title: "Dashboard - Events",
};

export default function Page() {
  return (
    <div className="w-full h-full">
      <Events />
    </div>
  );
}
