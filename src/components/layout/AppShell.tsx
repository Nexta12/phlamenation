"use client";

import React from "react";
import { usePathname } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import FloatingPlayer from "@/components/player/FloatingPlayer";
import VideoModal from "@/components/shared/VideoModal";
import RequestShowModal from "@/components/shared/RequestShowModal";
import ToastContainer from "@/components/ui/ToastContainer";
import { useContactNotifications } from "@/hooks/useContactNotifications";

import DeleteConfirmModal from "@/components/ui/DeleteConfirmModal";

export default function AppShell({ children }: { children: React.ReactNode }) {
  useContactNotifications();
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");
  const isAuth =
    pathname === "/login" ||
    pathname === "/register" ||
    pathname === "/forgot-password" ||
    pathname === "/reset-password" ||
    pathname.startsWith("/auth");

  if (isAdmin || isAuth) {
    return (
      <div className="min-h-screen w-full bg-[#08080A]">
        {children}
        <VideoModal />
        <ToastContainer />
        <DeleteConfirmModal />
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
      <FloatingPlayer />
      <VideoModal />
      <RequestShowModal />
      <ToastContainer />
      <DeleteConfirmModal />
    </>
  );
}
