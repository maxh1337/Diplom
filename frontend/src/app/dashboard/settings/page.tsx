import { Metadata } from "next";
import Settings from "../../../features/settings/components/Settings";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Dashboard - Settings",
};

export default function Page() {
  return (
    <div className="w-full">
      <Settings />
    </div>
  );
}
