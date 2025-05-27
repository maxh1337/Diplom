import { Metadata } from "next";
import Admins from "../../../features/admins/components/Admins";
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Dashboard - Admins",
};

export default function Page() {
  return (
    <div className="w-full h-full">
      <Admins />
    </div>
  );
}
