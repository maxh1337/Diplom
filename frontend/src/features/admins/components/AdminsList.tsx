"use client";

import { useState } from "react";
import { IAdmin } from "../../../lib/modules/admin/admin.types";
import AdminItem from "./AdminItem";
import AdminItemSkeleton from "./AdminItemSkeleton";
import { CreateAdminPopup } from "./CreateAdminPopup";

type Props = {
  admins: IAdmin[] | undefined;
  isLoading: boolean;
};

export default function AdminsList({ admins, isLoading }: Props) {
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  return (
    <>
      <table className="w-full table-auto text-left font-brain border-separate border-spacing-y-3">
        <thead>
          <tr>
            <th className="pb-2">Имя</th>
            <th className="pb-2">Логин</th>
            <th className="pb-2">Кол-во мероприятий</th>
            <th className="pb-2">Действие</th>
            <th className="pb-2"></th>
          </tr>
        </thead>
        <tbody>
          <tr className="border-t border-white/20 text-center">
            <td colSpan={7} className="py-3">
              <button
                onClick={() => setIsPopupOpen(true)}
                className="text-white hover:text-green-300 font-brain cursor-pointer"
              >
                + Добавить нового администратора
              </button>
            </td>
          </tr>
          {isLoading
            ? Array.from({ length: 10 }).map((_, index) => (
                <AdminItemSkeleton key={index} />
              ))
            : admins?.map((admin) => (
                <AdminItem key={admin.id} admin={admin} />
              ))}
        </tbody>
      </table>

      <CreateAdminPopup
        open={isPopupOpen}
        onClose={() => setIsPopupOpen(false)}
      />
    </>
  );
}
