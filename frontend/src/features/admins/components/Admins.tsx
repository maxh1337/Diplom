"use client";

import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import AnimatedContainer from "../../../shared/components/ui/AnimatedContainer";
import AnimatedLeftSection from "../../../shared/components/ui/AnimateLeftSection";
import AnimatedRightSection from "../../../shared/components/ui/AnimateRightSection";
import { useAdminDetailsZustand } from "../hooks/useAdminDetailsZustand";
import { useGetAdmins } from "../hooks/useGetAdmins";
import AdminDetails from "./AdminDetails";
import AdminsList from "./AdminsList";
import AdminsSearch from "./AdminsSearch";

export default function Admins() {
  const {
    isOpen,
    isRightSectionFullScreen,
    openRightSectionFullscreen,
    openAdmin,
    closeAdmin,
  } = useAdminDetailsZustand();
  const { admins, isAdminsLoading, refetch } = useGetAdmins();

  const searchParams = useSearchParams();
  const adminIdFromQuery = searchParams.get("id");

  useEffect(() => {
    if (adminIdFromQuery && admins) {
      const foundAdmin = admins.find((admin) => admin.id === adminIdFromQuery);
      if (foundAdmin) {
        openAdmin(foundAdmin);
        openRightSectionFullscreen(false);
      } else {
        closeAdmin();
      }
    }
  }, [
    adminIdFromQuery,
    admins,
    openAdmin,
    closeAdmin,
    openRightSectionFullscreen,
  ]);

  return (
    <div className="w-full h-fit text-white">
      <h1 className="font-brain text-2xl mb-4">Users</h1>
      <AdminsSearch />
      <AnimatedContainer>
        <AnimatedLeftSection
          isOpen={isOpen}
          isRightSectionFullScreen={isRightSectionFullScreen}
        >
          <AdminsList admins={admins} isLoading={isAdminsLoading} />
        </AnimatedLeftSection>
        <AnimatedRightSection
          isOpen={isOpen}
          isRightSectionFullScreen={isRightSectionFullScreen}
          openRightSectionFullscreen={openRightSectionFullscreen}
        >
          <AdminDetails />
        </AnimatedRightSection>
      </AnimatedContainer>
    </div>
  );
}
