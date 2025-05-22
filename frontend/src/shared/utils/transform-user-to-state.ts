import { AdminRole } from "../../lib/modules/admin/admin.types";
import { TProtectAdminData } from "../../lib/modules/auth/auth.types";

export type TAdminDataState = {
  id: string;
  rights: AdminRole[];
  isLoggedIn: boolean;
};

export const transformAdminToState = (
  admin: TProtectAdminData
): TAdminDataState | null => {
  return {
    ...admin,
    isLoggedIn: true,
  };
};
