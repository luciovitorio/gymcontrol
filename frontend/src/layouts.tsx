import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "@/store/auth.store";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { AppHeader } from "@/components/layout/AppHeader";

export function AuthLayout() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  if (isAuthenticated()) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}

export function ProtectedLayout() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  if (!isAuthenticated()) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="flex h-screen bg-muted/40 overflow-hidden">
      <AppSidebar />
      <div className="flex-1 flex flex-col p-4 overflow-hidden">
        <div className="flex-1 flex flex-col bg-background rounded-xl border shadow-sm overflow-hidden">
          <AppHeader />
          <main className="flex-1 overflow-y-auto p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
