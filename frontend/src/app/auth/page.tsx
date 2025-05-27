import { Metadata } from "next";
import { AuthForm } from "../../features/auth/components/form/AuthForm";

export const metadata: Metadata = {
  title: "Dashboard - Вход",
};

export default function Page() {
  return (
    <div className="">
      <AuthForm />
    </div>
  );
}
