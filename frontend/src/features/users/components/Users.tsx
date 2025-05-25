"use client";

import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import AnimatedContainer from "../../../shared/components/ui/AnimatedContainer";
import AnimatedLeftSection from "../../../shared/components/ui/AnimateLeftSection";
import AnimatedRightSection from "../../../shared/components/ui/AnimateRightSection";
import { useGetUsers } from "../hooks/useGetUsers";
import { useUserDetailsZustand } from "../hooks/useUserDetailsZustand";
import { useUserFiltersZustand } from "../hooks/useUserFiltersZustand";
import UserDetails from "./UserDetails";
import UsersList from "./UsersList";
import UsersSearch from "./UsersSearch";

export default function Users() {
  const {
    isOpen,
    isRightSectionFullScreen,
    openRightSectionFullscreen,
    openUser,
    closeUser,
  } = useUserDetailsZustand();
  const { filters } = useUserFiltersZustand();
  const { users, isUsersLoading, refetch } = useGetUsers();

  const searchParams = useSearchParams();
  const userIdFromQuery = searchParams.get("id");

  useEffect(() => {
    if (userIdFromQuery && users) {
      const foundUser = users.find((user) => user.id === userIdFromQuery);
      if (foundUser) {
        openUser(foundUser);
        openRightSectionFullscreen(false);
      } else {
        closeUser();
      }
    }
  }, [userIdFromQuery, users, openUser, closeUser, openRightSectionFullscreen]);

  return (
    <div className="w-full h-fit text-white">
      <h1 className="font-brain text-2xl mb-4">Users</h1>
      <UsersSearch />
      <AnimatedContainer>
        <AnimatedLeftSection
          isOpen={isOpen}
          isRightSectionFullScreen={isRightSectionFullScreen}
        >
          <UsersList users={users} isLoading={isUsersLoading} />
        </AnimatedLeftSection>
        <AnimatedRightSection
          isOpen={isOpen}
          isRightSectionFullScreen={isRightSectionFullScreen}
          openRightSectionFullscreen={openRightSectionFullscreen}
        >
          <UserDetails />
        </AnimatedRightSection>
      </AnimatedContainer>
    </div>
  );
}
