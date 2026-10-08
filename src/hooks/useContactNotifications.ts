"use client";

import { useEffect, useRef } from "react";
import { useAuthStore } from "@/stores/useAuthStore";
import { useNotificationStore } from "@/stores/useNotificationStore";
import { useUIStore } from "@/stores/useUIStore";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3040/api/v1";

export function useContactNotifications() {
  const { user, isAuthenticated, accessToken } = useAuthStore();
  const { fetchUnreadCount, setUnreadMessagesCount } = useNotificationStore();
  const { addToast } = useUIStore();
  const eventSourceRef = useRef<EventSource | null>(null);

  const isAdmin =
    isAuthenticated &&
    Boolean(user && ["superAdmin", "admin", "editor"].includes(user.role));

  useEffect(() => {
    if (!isAdmin) {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
        eventSourceRef.current = null;
      }
      return;
    }

    // 1. Immediately fetch fresh unread count on login or mount
    fetchUnreadCount();

    // 2. Setup Server-Sent Events (SSE) connection
    const token =
      accessToken ||
      (typeof window !== "undefined"
        ? localStorage.getItem("phlame_access_token")
        : null);

    const streamUrl = `${BASE_URL.replace(/\/+$/, "")}/contacts/stream?token=${encodeURIComponent(
      token || ""
    )}`;

    try {
      const es = new EventSource(streamUrl, { withCredentials: true });
      eventSourceRef.current = es;

      es.onmessage = (event) => {
        try {
          if (!event.data || event.data.startsWith(":")) return;
          const payload = JSON.parse(event.data);

          if (
            payload.type === "INITIAL_COUNT" ||
            payload.type === "COUNT_UPDATE"
          ) {
            if (typeof payload.unreadCount === "number") {
              setUnreadMessagesCount(payload.unreadCount);
            }
          } else if (payload.type === "NEW_MESSAGE") {
            if (typeof payload.unreadCount === "number") {
              setUnreadMessagesCount(payload.unreadCount);
            }
            const sender = payload.message?.name || "A visitor";
            const subject = payload.message?.subject || "New inquiry";
            addToast({
              title: "New Contact Message",
              message: `${sender}: "${subject}"`,
              type: "info",
            });
          }
        } catch {
          // Ignore parse errors on keepalive comments
        }
      };

      es.onerror = () => {
        // EventSource will automatically retry in modern browsers
      };
    } catch (err) {
      console.warn("Could not initiate contact events stream:", err);
    }

    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
        eventSourceRef.current = null;
      }
    };
  }, [isAdmin, accessToken, fetchUnreadCount, setUnreadMessagesCount, addToast]);
}

export default useContactNotifications;
