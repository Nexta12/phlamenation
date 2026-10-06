import { describe, it, expect, beforeEach, vi } from "vitest";
import { useAuthStore } from "@/stores/useAuthStore";
import api from "@/services/api";

vi.mock("@/services/api", () => ({
  default: {
    post: vi.fn().mockResolvedValue({ data: {} }),
    get: vi.fn().mockResolvedValue({ data: {} }),
  },
}));

describe("useAuthStore", () => {
  beforeEach(() => {
    localStorage.clear();
    useAuthStore.setState({
      user: null,
      accessToken: null,
      isAuthenticated: false,
      isLoading: false,
    });
  });

  it("initializes with unauthenticated state", () => {
    const state = useAuthStore.getState();
    expect(state.isAuthenticated).toBe(false);
    expect(state.user).toBeNull();
  });

  it("clears user and token upon logout", async () => {
    useAuthStore.setState({
      user: {
        _id: "u1",
        name: "Super Admin",
        email: "admin@phlamenation.com",
        role: "superAdmin",
        createdAt: "2026-01-01",
      },
      accessToken: "sample-jwt-token",
      isAuthenticated: true,
      isLoading: false,
    });

    expect(useAuthStore.getState().isAuthenticated).toBe(true);

    await useAuthStore.getState().logout();

    expect(useAuthStore.getState().isAuthenticated).toBe(false);
    expect(useAuthStore.getState().user).toBeNull();
    expect(useAuthStore.getState().accessToken).toBeNull();
  });
});
