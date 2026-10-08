import {
  ApiResponse,
  Track,
  Artist,
  Video,
  EventItem,
  GalleryItem,
  NewsArticle,
  ContactMessage,
  NewsletterSubscriber,
  User,
  HeroConfig,
} from "@/types";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3040/api/v1";

class ApiService {
  private getToken(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("phlame_access_token");
  }

  private isRefreshing = false;
  private refreshPromise: Promise<string | null> | null = null;

  private async refreshAccessToken(): Promise<string | null> {
    if (typeof window === "undefined") return null;
    const refreshToken = localStorage.getItem("phlame_refresh_token");
    if (!refreshToken) return null;

    if (this.isRefreshing && this.refreshPromise) {
      return this.refreshPromise;
    }

    this.isRefreshing = true;
    this.refreshPromise = (async () => {
      try {
        const res = await fetch(`${BASE_URL}/auth/refresh`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ refreshToken }),
        });
        const json = await res.json();
        if (res.ok && json.data?.accessToken) {
          const newToken = json.data.accessToken;
          localStorage.setItem("phlame_access_token", newToken);
          return newToken;
        }
        return null;
      } catch {
        return null;
      } finally {
        this.isRefreshing = false;
        this.refreshPromise = null;
      }
    })();

    return this.refreshPromise;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    let token = this.getToken();
    const headers: Record<string, string> = {
      ...(options.headers as Record<string, string>),
    };

    if (token && !headers["Authorization"]) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    if (
      options.body &&
      !(options.body instanceof FormData) &&
      !headers["Content-Type"]
    ) {
      headers["Content-Type"] = "application/json";
    }

    const cleanBase = BASE_URL.replace(/\/+$/, "");
    const cleanEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
    const url = `${cleanBase}${cleanEndpoint}`;

    let response: Response;
    try {
      response = await fetch(url, {
        ...options,
        headers,
        credentials: "include",
      });
    } catch (networkError: any) {
      const isGet = (options.method || "GET").toUpperCase() === "GET";
      const message =
        networkError?.message === "Failed to fetch"
          ? `Unable to connect to API server at ${cleanBase}. Please verify the backend is running.`
          : networkError?.message || "Network request failed";

      if (isGet) {
        // Return a structured failure response for GET requests so the UI renders gracefully
        return {
          success: false,
          message,
          data: undefined as unknown as T,
        };
      }

      const error: any = new Error(message);
      error.isNetworkError = true;
      throw error;
    }

    // Auto-refresh token if 401 Unauthorized occurs on protected endpoints
    if (
      response.status === 401 &&
      !endpoint.includes("/auth/login") &&
      !endpoint.includes("/auth/refresh")
    ) {
      const newToken = await this.refreshAccessToken();
      if (newToken) {
        headers["Authorization"] = `Bearer ${newToken}`;
        try {
          response = await fetch(url, {
            ...options,
            headers,
            credentials: "include",
          });
        } catch {
          // Keep existing 401 response if retry fetch fails
        }
      }
    }

    const data = await response.json().catch(() => ({
      success: false,
      message: "An unexpected network error occurred",
    }));

    if (!response.ok) {
      const error: any = new Error(data.message || `Request failed with status ${response.status}`);
      error.response = { data, status: response.status };
      throw error;
    }

    return data;
  }

  get<T>(endpoint: string, params?: Record<string, string | number | boolean | undefined>) {
    let query = "";
    if (params) {
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== "") {
          searchParams.append(key, String(value));
        }
      });
      const qs = searchParams.toString();
      if (qs) query = `?${qs}`;
    }
    return this.request<T>(`${endpoint}${query}`, { method: "GET" });
  }

  post<T>(endpoint: string, body?: unknown) {
    const isFormData = body instanceof FormData;
    return this.request<T>(endpoint, {
      method: "POST",
      body: isFormData ? body : JSON.stringify(body),
    });
  }

  patch<T>(endpoint: string, body?: unknown) {
    const isFormData = body instanceof FormData;
    return this.request<T>(endpoint, {
      method: "PATCH",
      body: isFormData ? body : JSON.stringify(body),
    });
  }

  put<T>(endpoint: string, body?: unknown) {
    const isFormData = body instanceof FormData;
    return this.request<T>(endpoint, {
      method: "PUT",
      body: isFormData ? body : JSON.stringify(body),
    });
  }

  delete<T>(endpoint: string) {
    return this.request<T>(endpoint, { method: "DELETE" });
  }
}

export const api = new ApiService();

// Typed Module Services
export const trackService = {
  getTracks: (params?: Record<string, any>) => api.get<Track[]>("/tracks", params),
  getTrack: (id: string) => api.get<Track>(`/tracks/${id}`),
  createTrack: (data: FormData) => api.post<Track>("/tracks", data),
  updateTrack: (id: string, data: FormData | Record<string, any>) => api.patch<Track>(`/tracks/${id}`, data),
  deleteTrack: (id: string) => api.delete(`/tracks/${id}`),
  recordStream: (id: string) => api.post(`/tracks/${id}/stream`),
  downloadTrack: (id: string) => api.post<{ downloadUrl: string; title: string }>(`/tracks/${id}/download`),
};

export const artistService = {
  getArtists: (params?: Record<string, any>) => api.get<Artist[]>("/artists", params),
  getArtist: (slug: string) => api.get<Artist>(`/artists/${slug}`),
  createArtist: (data: FormData) => api.post<Artist>("/artists", data),
  updateArtist: (id: string, data: FormData) => api.patch<Artist>(`/artists/${id}`, data),
  deleteArtist: (id: string) => api.delete(`/artists/${id}`),
};

export const videoService = {
  getVideos: (params?: Record<string, any>) => api.get<Video[]>("/videos", params),
  getVideo: (id: string) => api.get<Video>(`/videos/${id}`),
  createVideo: (data: any) => api.post<Video>("/videos", data),
  updateVideo: (id: string, data: any) => api.patch<Video>(`/videos/${id}`, data),
  deleteVideo: (id: string) => api.delete(`/videos/${id}`),
};

export const eventService = {
  getEvents: (params?: Record<string, any>) => api.get<EventItem[]>("/events", params),
  getEvent: (id: string) => api.get<EventItem>(`/events/${id}`),
  createEvent: (data: FormData) => api.post<EventItem>("/events", data),
  updateEvent: (id: string, data: FormData) => api.patch<EventItem>(`/events/${id}`, data),
  deleteEvent: (id: string) => api.delete(`/events/${id}`),
  requestShow: (data: { artistId: string; city: string; country: string; email: string }) =>
    api.post("/events/request-show", data),
  getShowRequests: () => api.get<any[]>("/events/requests"),
};

export const galleryService = {
  getGallery: (params?: Record<string, any>) => api.get<GalleryItem[]>("/gallery", params),
  getGalleryItem: (id: string) => api.get<GalleryItem>(`/gallery/${id}`),
  createGalleryItem: (data: FormData) => api.post<GalleryItem>("/gallery", data),
  updateGalleryItem: (id: string, data: FormData) => api.patch<GalleryItem>(`/gallery/${id}`, data),
  deleteGalleryItem: (id: string) => api.delete(`/gallery/${id}`),
};

export const newsService = {
  getNews: (params?: Record<string, any>) => api.get<NewsArticle[]>("/news", params),
  getArticle: (slug: string) => api.get<NewsArticle>(`/news/${slug}`),
  getFlashTicker: () => api.get<NewsArticle[]>("/news/flash"),
  createNews: (data: FormData) => api.post<NewsArticle>("/news", data),
  updateNews: (id: string, data: FormData) => api.patch<NewsArticle>(`/news/${id}`, data),
  deleteNews: (id: string) => api.delete(`/news/${id}`),
};

export const contactService = {
  submitMessage: (data: any) => api.post<ContactMessage>("/contacts", data),
  getMessages: (params?: Record<string, any>) => api.get<ContactMessage[]>("/contacts", params),
  getUnreadCount: () => api.get<{ unreadCount: number }>("/contacts/unread-count"),
  getMessage: (id: string) => api.get<ContactMessage>(`/contacts/${id}`),
  updateStatus: (id: string, data: { status: "unread" | "read" | "replied" | "archived"; adminNotes?: string }) =>
    api.patch<ContactMessage>(`/contacts/${id}`, data),
  deleteMessage: (id: string) => api.delete(`/contacts/${id}`),
};

export const newsletterService = {
  subscribe: (email: string) => api.post<{ message: string }>("/newsletter/subscribe", { email }),
  unsubscribe: (email: string) => api.post<{ message: string }>("/newsletter/unsubscribe", { email }),
  getSubscribers: () => api.get<NewsletterSubscriber[]>("/newsletter/subscribers"),
};

export const userService = {
  getUsers: (params?: Record<string, any>) => api.get<User[]>("/auth/users", params),
  createUser: (data: { fullName: string; email: string; password?: string; role: string; isVerified?: boolean }) =>
    api.post<User>("/auth/users", data),
  updateUser: (id: string, data: Partial<{ fullName: string; email: string; password?: string; role: string; isVerified?: boolean }>) =>
    api.patch<User>(`/auth/users/${id}`, data),
  deleteUser: (id: string) => api.delete<{ message: string }>(`/auth/users/${id}`),
};

export const heroService = {
  getHero: () => api.get<HeroConfig>("/hero"),
  updateHero: (data: FormData | Partial<HeroConfig>) => api.put<HeroConfig>("/hero", data),
  resetHero: () => api.post<HeroConfig>("/hero/reset"),
};

export default api;

