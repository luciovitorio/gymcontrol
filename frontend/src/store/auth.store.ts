import { create } from "zustand";
import { persist } from "zustand/middleware";

interface User {
  id: number;
  name: string;
  email: string;
  role: "admin" | "coach" | "student";
}

interface AuthState {
  token: string | null;
  user: User | null;
  setAuth: (token: string, user: User) => void;
  clearAuth: () => void;
  isAuthenticated: () => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,
      user: null,
      setAuth: (token, user) => {
        // Atualiza localStorage para o axios interceptor pegar (opcional, já que persist faz isso)
        localStorage.setItem("gymcontrol:token", token);
        set({ token, user });
      },
      clearAuth: () => {
        localStorage.removeItem("gymcontrol:token");
        set({ token: null, user: null });
      },
      isAuthenticated: () => !!get().token,
    }),
    {
      name: "gymcontrol:auth", // nome no localStorage
    }
  )
);
