import { Calendar, Home, Settings, Shield, Users } from "lucide-react";

export const navItems = [
  { name: "Dashboard", href: "/dashboard", icon: Home },
  { name: "Events", href: "/dashboard/events", icon: Calendar },
  { name: "Users", href: "/dashboard/users", icon: Users },
  { name: "Admins", href: "/dashboard/admins", icon: Shield, protection: true },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
];
