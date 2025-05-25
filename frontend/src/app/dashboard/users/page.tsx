import { Metadata } from "next";
import Users from "../../../features/users/components/Users";
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Dashboard - Users",
};

export default function Page() {
  return (
    <div className="w-full h-full">
      <Users />
    </div>
  );
}
