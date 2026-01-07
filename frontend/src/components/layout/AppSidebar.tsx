import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  CalendarDays,
  User,
  Dumbbell,
  Users,
  Settings,
  CreditCard,
  ClipboardList,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/auth.store";

type NavItem = {
  icon: any;
  label: string;
  href: string;
  roles?: string[]; // Se não definido, aparece para todos (ou default)
};

const allNavItems: NavItem[] = [
  // Common / Student
  {
    icon: LayoutDashboard,
    label: "Dashboard",
    href: "/dashboard",
    roles: ["admin", "coach", "student"],
  },
  { icon: CalendarDays, label: "Aulas", href: "/classes", roles: ["student"] },
  { icon: User, label: "Meu Plano", href: "/plans", roles: ["student"] },

  // Coach
  {
    icon: ClipboardList,
    label: "Minhas Aulas",
    href: "/my-classes",
    roles: ["coach"],
  },

  // Admin
  { icon: Users, label: "Alunos", href: "/admin/users", roles: ["admin"] },
  {
    icon: Dumbbell,
    label: "Aulas",
    href: "/admin/classes",
    roles: ["admin", "coach"],
  }, // Admin gerencia, Coach visualiza gestão
  { icon: CreditCard, label: "Planos", href: "/admin/plans", roles: ["admin"] },
  {
    icon: Settings,
    label: "Configurações",
    href: "/admin/settings",
    roles: ["admin"],
  },
];

export function AppSidebar() {
  const user = useAuthStore((state) => state.user);
  const userRole = user?.role || "student";

  const filteredItems = allNavItems.filter((item) => {
    if (!item.roles) return true;
    return item.roles.includes(userRole);
  });

  return (
    <aside className="hidden w-64 flex-col bg-muted/40 md:flex">
      <div className="flex h-16 items-center px-6">
        <Dumbbell className="mr-2 h-6 w-6 text-primary" />
        <span className="text-lg font-bold">GymControl</span>
      </div>

      <nav className="flex-1 space-y-1 p-4">
        {filteredItems.map((item) => (
          <NavLink
            key={item.href}
            to={item.href}
            className={({ isActive }) =>
              cn(
                "flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
                isActive
                  ? "bg-accent text-accent-foreground shadow-sm"
                  : "text-muted-foreground"
              )
            }
          >
            <item.icon className="mr-3 h-4 w-4" />
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
