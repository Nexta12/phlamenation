import { create } from "zustand";
import { User, UserRole } from "@/types";
import api from "@/services/api";

interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  hydrateAuth: () => void;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  hasRole: (allowedRoles: UserRole[]) => boolean;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  accessToken: null,
  isAuthenticated: false,
  isLoading: true,

  hydrateAuth: () => {
    if (typeof window === "undefined") return;
    const token = localStorage.getItem("phlame_access_token");
    const storedUser = localStorage.getItem("phlame_user");
    let user: User | null = null;
    if (storedUser) {
      try {
        user = JSON.parse(storedUser);
      } catch {
        user = null;
      }
    }
    if (token && user) {
      set({ user, accessToken: token, isAuthenticated: true, isLoading: false });
    } else if (!token) {
      set({ user: null, accessToken: null, isAuthenticated: false, isLoading: false });
    }
  },

  login: async (email, password) => {
    const res = await api.post<{ user: User; accessToken: string; refreshToken?: string }>("/auth/login", {
      email,
      password,
    });
    const { user, accessToken, refreshToken } = res.data;
    if (typeof window !== "undefined") {
      localStorage.setItem("phlame_access_token", accessToken);
      if (refreshToken) {
        localStorage.setItem("phlame_refresh_token", refreshToken);
      }
      localStorage.setItem("phlame_user", JSON.stringify(user));
    }
    set({ user, accessToken, isAuthenticated: true, isLoading: false });
  },

  logout: async () => {
    try {
      await api.post("/auth/logout");
    } catch {
      // Continue client cleanup regardless of server response
    }
    if (typeof window !== "undefined") {
      localStorage.removeItem("phlame_access_token");
      localStorage.removeItem("phlame_refresh_token");
      localStorage.removeItem("phlame_user");
    }
    set({ user: null, accessToken: null, isAuthenticated: false, isLoading: false });
  },

  checkAuth: async () => {
    if (typeof window === "undefined") return;
    const token = localStorage.getItem("phlame_access_token");
    const rToken = localStorage.getItem("phlame_refresh_token");

    if (!token && !rToken) {
      set({ user: null, accessToken: null, isAuthenticated: false, isLoading: false });
      return;
    }

    try {
      const res = await api.get<User>("/auth/me");
      if (res.data) {
        const activeToken = localStorage.getItem("phlame_access_token") || token;
        localStorage.setItem("phlame_user", JSON.stringify(res.data));
        set({ user: res.data, accessToken: activeToken, isAuthenticated: true, isLoading: false });
      } else {
        throw new Error("No user data");
      }
    } catch {
      // Token might be expired: attempt refresh
      if (rToken) {
        try {
          const refreshRes = await api.post<{ accessToken: string }>("/auth/refresh", {
            refreshToken: rToken,
          });
          if (refreshRes.data?.accessToken) {
            const newToken = refreshRes.data.accessToken;
            localStorage.setItem("phlame_access_token", newToken);
            const userRes = await api.get<User>("/auth/me");
            if (userRes.data) {
              localStorage.setItem("phlame_user", JSON.stringify(userRes.data));
              set({ user: userRes.data, accessToken: newToken, isAuthenticated: true, isLoading: false });
              return;
            }
          }
        } catch {
          // Refresh also failed
        }
      }

      localStorage.removeItem("phlame_access_token");
      localStorage.removeItem("phlame_refresh_token");
      localStorage.removeItem("phlame_user");
      set({ user: null, accessToken: null, isAuthenticated: false, isLoading: false });
    }
  },

  hasRole: (allowedRoles) => {
    const user = get().user;
    if (!user) return false;
    return allowedRoles.includes(user.role);
  },
}));

export default useAuthStore;
