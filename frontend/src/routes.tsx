import { createBrowserRouter } from "react-router-dom";
import { Login } from "./pages/auth/Login";
import { AuthLayout, ProtectedLayout } from "./layouts";
import { Dashboard } from "./pages/dashboard/Dashboard";
import { Profile } from "./pages/profile/Profile";
import { UsersList } from "./pages/admin/users/UsersList";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AuthLayout />,
    children: [
      {
        path: "/",
        element: <Login />,
      },
    ],
  },
  {
    element: <ProtectedLayout />,
    children: [
      {
        path: "/dashboard",
        element: <Dashboard />,
      },
      {
        path: "/profile",
        element: <Profile />,
      },
      {
        path: "/admin/users",
        element: <UsersList />,
      },
    ],
  },
]);
