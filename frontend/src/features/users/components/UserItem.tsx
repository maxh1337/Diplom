import { IUser } from "../../../lib/modules/admin/admin.types";
import {
  CustomPopover,
  PopoverItem,
} from "../../../shared/components/ui/PopoverMenu";
import { useDeleteUser } from "../hooks/useDeleteUser";
import { useUserDetailsZustand } from "../hooks/useUserDetailsZustand";

type Props = {
  user: IUser;
};

export default function UserItem({ user }: Props) {
  const { openUser } = useUserDetailsZustand();
  const { mutateDeleteUser } = useDeleteUser();

  const items: PopoverItem[] = [
    {
      label: "Удалить",
      destructive: true,
      onSelect: () => {
        mutateDeleteUser(user.id);
      },
    },
  ];

  return (
    <tr className="border-t border-white/20 font-brain text-sm">
      <td className="py-2">{user.nickname}</td>
      <td className="py-2">{user.telegramUsername}</td>
      <td className="py-2">{user.telegramFirstName}</td>
      <td className="py-2">{user.telegramLastName}</td>
      <td className="py-2">{user.userCategory}</td>
      <td className="py-2">{user.yearOfBirth}</td>

      <td className="py-2 relative">
        <CustomPopover
          trigger={
            <button className="text-white hover:text-yellow-300 transition">
              ...
            </button>
          }
          items={items}
        />
      </td>

      <td className="py-2">
        <button
          onClick={() => openUser(user)}
          className="text-blue-400 hover:underline"
        >
          Открыть
        </button>
      </td>
    </tr>
  );
}
