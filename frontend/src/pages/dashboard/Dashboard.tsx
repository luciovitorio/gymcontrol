import { useAuthStore } from "@/store/auth.store";
import { AdminDashboard } from "./AdminDashboard";
import { StudentDashboard } from "./StudentDashboard";
import { CoachDashboard } from "./CoachDashboard";

export function Dashboard() {
  const user = useAuthStore((state) => state.user);

  if (!user) return null;

  switch (user.role) {
    case "admin":
      return <AdminDashboard />;
    case "coach":
      return <CoachDashboard />;
    case "student":
    default:
      return <StudentDashboard />;
  }
}
