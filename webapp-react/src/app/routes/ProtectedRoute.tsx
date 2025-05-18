import { Navigate, Outlet } from "react-router-dom";
import { useUserZustand } from "../../shared/hooks/useTgUserZustand";

export default function ProtectedRoute() {
  const { user } = useUserZustand();

  if (!user?.nickname) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
