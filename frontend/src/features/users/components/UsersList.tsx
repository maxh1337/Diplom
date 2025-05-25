import { IUser } from "../../../lib/modules/admin/admin.types";
import UserItem from "./UserItem";
import UserItemSkeleton from "./UserItemSkeleton";

type Props = {
  users: IUser[] | undefined;
  isLoading: boolean;
};

export default function UsersList({ users, isLoading }: Props) {
  const skeletonRows = 10;

  return (
    <table className="w-full table-auto text-left font-brain border-separate border-spacing-y-3">
      <thead>
        <tr>
          <th className="pb-2">Имя</th>
          <th className="pb-2">@username</th>
          <th className="pb-2">@first_name</th>
          <th className="pb-2">@last_name</th>
          <th className="pb-2">Категория</th>
          <th className="pb-2">Год рождения</th>
          <th className="pb-2">Действие</th>
          <th className="pb-2"></th>
        </tr>
      </thead>
      <tbody>
        {isLoading
          ? Array.from({ length: skeletonRows }).map((_, index) => (
              <UserItemSkeleton key={index} />
            ))
          : users?.map((user) => <UserItem key={user.id} user={user} />)}
      </tbody>
    </table>
  );
}
