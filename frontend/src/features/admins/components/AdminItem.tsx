import { IAdmin } from "../../../lib/modules/admin/admin.types";
import { useAdminDetailsZustand } from "../hooks/useAdminDetailsZustand";

type Props = {
  admin: IAdmin;
};

export default function AdminItem({ admin }: Props) {
  const { openAdmin } = useAdminDetailsZustand();

  return (
    <tr className="border-t border-white/20 font-brain text-sm">
      <td className="py-2">{admin.username}</td>
      <td className="py-2">{admin.login}</td>
      <td className="py-2">{admin.createdEvents.length}</td>
      <td className="py-2">
        <button
          onClick={() => openAdmin(admin)}
          className="text-blue-400 hover:underline"
        >
          Открыть
        </button>
      </td>
    </tr>
  );
}
