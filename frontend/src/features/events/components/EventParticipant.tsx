"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { IUser } from "../../../lib/modules/admin/admin.types";
import {
  CustomPopover,
  PopoverItem,
} from "../../../shared/components/ui/PopoverMenu";
import { useEventDetailsZustand } from "../hooks/useEventDetailsZustand";
import { useKickUserFromEvent } from "../hooks/useKickUserFromEvent";

interface Props {
  user: IUser;
}

export default function EventParticipant({ user }: Props) {
  const { mutateKickUser, isKickUserPending } = useKickUserFromEvent();
  const { selectedEvent } = useEventDetailsZustand();
  const router = useRouter();

  const items: PopoverItem[] = [
    {
      label: "Открыть",
      onSelect: () => {
        router.push(`/dashboard/users?id=${user.id}`);
      },
    },
    {
      label: "Исключить",
      destructive: true,
      onSelect: () => {
        if (selectedEvent?.id) {
          mutateKickUser({ eventId: selectedEvent?.id, userId: user.id });
        }
      },
    },
  ];

  return (
    <div className="flex items-center gap-3 bg-third p-3 rounded-lg">
      {user.photoUrl ? (
        <Image
          src={user.photoUrl}
          alt={user.nickname || user.telegramUsername}
          width={40}
          height={40}
          className="rounded-full flex-shrink-0"
        />
      ) : (
        <div className="w-10 h-10 bg-white/20 rounded-full flex-shrink-0" />
      )}

      <div className="flex-1">
        <div className="text-white font-brain">
          {user.nickname || user.telegramUsername}
        </div>
        {user.userCategory && (
          <div className="text-gray-400 text-sm font-brain">
            {user.userCategory}
          </div>
        )}
      </div>
      <CustomPopover
        trigger={
          <button className="text-white hover:text-yellow-300 transition">
            ...
          </button>
        }
        items={items}
      />
    </div>
  );
}
