"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/useAuthStore";
import { useNotificationStore } from "@/stores/useNotificationStore";
import { Badge } from "@/components/ui/Badge";
import {
  Flame,
  LayoutDashboard,
  Music2,
  Users,
  Video,
  Calendar,
  Newspaper,
  Inbox,
  LogOut,
  Menu,
  X,
  ChevronDown,
  UserCheck,
} from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isAuthenticated, isLoading, hydrateAuth, checkAuth, logout } = useAuthStore();
  const { unreadMessagesCount } = useNotificationStore();
  const [mounted, setMounted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [checked, setChecked] = useState(false);
  const mobileProfileRef = useRef<HTMLDivElement>(null);
  const desktopProfileRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const router = useRouter();

  // Close profile dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;
      const insideMobile = mobileProfileRef.current?.contains(target);
      const insideDesktop = desktopProfileRef.current?.contains(target);
      if (!insideMobile && !insideDesktop) {
        setProfileMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Safe client mount and auth hydration
  useEffect(() => {
    setMounted(true);
    hydrateAuth();
    checkAuth().finally(() => {
      setChecked(true);
    });
  }, [hydrateAuth, checkAuth]);

  useEffect(() => {
    if (mounted && checked && !isAuthenticated) {
      router.push("/login");
    }
  }, [mounted, checked, isAuthenticated, router]);

  // SSR and initial client hydration render identical placeholder until mounted
  if (!mounted || (!isAuthenticated && (isLoading || !checked))) {
    return (
      <div className="h-screen w-screen bg-[#08080A] flex flex-col items-center justify-center">
        <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center animate-pulse mb-4">
          <Flame className="w-6 h-6 text-primary" />
        </div>
        <p className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">
          Verifying Credentials...
        </p>
      </div>
    );
  }

  const getPageTitle = (path: string) => {
    if (path === "/admin") return "Dashboard";
    if (path.startsWith("/admin/events")) return "Events";
    if (path.startsWith("/admin/tracks")) return "Tracks";
    if (path.startsWith("/admin/artists")) return "Artists";
    if (path.startsWith("/admin/videos")) return "Videos";
    if (path.startsWith("/admin/news")) return "News";
    if (path.startsWith("/admin/contacts")) return "Inquiries";
    if (path.startsWith("/admin/hero")) return "Hero Showcase";
    if (path.startsWith("/admin/users")) return "User Access & Roles";
    if (path.startsWith("/admin/gallery")) return "Gallery";
    if (path.startsWith("/admin/newsletter")) return "Newsletter";

    const clean = path.replace("/admin/", "").replace(/_/g, " ").split("/")[0];
    return clean ? clean.charAt(0).toUpperCase() + clean.slice(1) : "Dashboard";
  };

  const navItems = [
    { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
      { label: "Messages", href: "/admin/contacts", icon: Inbox },
    { label: "Users", href: "/admin/users", icon: UserCheck },
    { label: "Music & Tracks", href: "/admin/tracks", icon: Music2 },
    { label: "Artists", href: "/admin/artists", icon: Users },
    { label: "Music Videos", href: "/admin/videos", icon: Video },
    { label: "Tours & Shows", href: "/admin/events", icon: Calendar },
    { label: "News & Dispatches", href: "/admin/news", icon: Newspaper },
    { label: "Hero Section", href: "/admin/hero", icon: Flame },
  ];

  const handleLogout = () => {
    setProfileMenuOpen(false);
    logout();
    router.push("/login");
  };

  const displayName = user?.name || user?.fullName || "Admin Executive";
  const userInitial = displayName.charAt(0).toUpperCase();

  const renderProfileDropdown = () => (
    <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-[#0A0A0D] border border-white/[0.08] shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
      {/* User Info Header */}
      <div className="p-3 bg-[#1C1D24] rounded-xl mb-1 border border-white/[0.05]">
        <p className="text-xs font-bold text-white truncate">{displayName}</p>
        <p className="text-[11px] text-muted-foreground truncate mt-0.5">{user?.email}</p>
        <div className="mt-2 flex items-center justify-between">
          <Badge variant={user?.role === "superAdmin" || user?.role === "admin" ? "gold" : "default"} className="text-[9px] py-0 px-2 uppercase">
            {user?.role === "superAdmin" ? "Admin" : user?.role || "Admin"}
          </Badge>
          <span className="flex items-center text-[10px] text-green-400 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse mr-1.5" />
            Active Session
          </span>
        </div>
      </div>

      {/* Submenu Links */}
      <div className="space-y-0.5">
        <Link
          href="/admin"
          onClick={() => setProfileMenuOpen(false)}
          className="flex items-center space-x-2.5 px-3 py-2 rounded-lg text-xs text-zinc-300 hover:text-white hover:bg-white/5 transition-colors"
        >
          <LayoutDashboard className="w-3.5 h-3.5 text-muted-foreground" />
          <span>Executive Dashboard</span>
        </Link>
      </div>

      {/* Divider */}
      <div className="my-1.5 border-t border-white/[0.06]" />

      {/* Sign Out Option */}
      <button
        onClick={handleLogout}
        className="flex items-center space-x-2.5 w-full px-3 py-2 text-xs font-semibold text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer"
      >
        <LogOut className="w-3.5 h-3.5" />
        <span>Sign Out</span>
      </button>
    </div>
  );

  return (
    <div className="h-screen w-screen overflow-hidden bg-[#060608] text-foreground flex flex-col lg:flex-row">
      {/* Mobile Top Header (Sole Header on Mobile) */}
      <div className="lg:hidden flex items-center justify-between px-4 py-3 bg-[#060608] border-b border-white/[0.06] sticky top-0 z-40 shrink-0">
        <Link href="/" className="flex items-center space-x-2" title="Return to Public Website">
          <Flame className="w-6 h-6 text-primary fill-primary" />
          <span className="font-extrabold text-sm tracking-wider uppercase text-white">
            Phlame Admin
          </span>
        </Link>
        <div className="flex items-center space-x-2">
          {/* Mobile Profile Toggle */}
          <div className="relative" ref={mobileProfileRef}>
            <button
              onClick={() => setProfileMenuOpen(!profileMenuOpen)}
              className="w-8 h-8 rounded-full bg-primary/20 text-primary font-bold flex items-center justify-center text-xs border border-primary/40 cursor-pointer"
            >
              {userInitial}
            </button>
            {profileMenuOpen && renderProfileDropdown()}
          </div>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="relative p-2 rounded-lg bg-white/5 border border-white/10 text-white cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            {unreadMessagesCount > 0 && !mobileMenuOpen && (
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-600 rounded-full ring-2 ring-[#060608] animate-pulse" />
            )}
          </button>
        </div>
      </div>

      {/* Sidebar Navigation - Strictly Fixed & Non-Scrolling in Dark Black */}
      <aside
        className={`fixed lg:static top-0 left-0 h-screen w-64 shrink-0 bg-[#060608] border-r border-white/[0.06] flex flex-col justify-between z-50 overflow-y-auto transition-transform duration-300 ${
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div>
          {/* Brand Logo Header - Clicking navigates to Frontpage */}
          <div className="p-6 border-b border-white/[0.06] flex items-center justify-between">
            <Link
              href="/"
              className="flex items-center group py-1"
              title="Return to Phlame Nation Public Frontpage"
            >
              <div className="relative w-40 h-10 transition-transform group-hover:scale-105">
                <Image
                  src="/images/p-logo.png"
                  alt="Phlame Nation"
                  fill
                  priority
                  className="object-contain object-left"
                />
              </div>
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              const isMessages = item.href === "/admin/contacts";
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all ${
                    isActive
                      ? "bg-primary text-black font-bold shadow-md shadow-primary/10"
                      : "text-muted-foreground hover:text-white hover:bg-white/5"
                  }`}
                >
                  <div className="flex items-center space-x-3 min-w-0">
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? "text-black" : "text-zinc-400"}`} />
                    <span className="truncate">{item.label}</span>
                  </div>
                  {isMessages && unreadMessagesCount > 0 && (
                    <span
                      className={`flex items-center justify-center min-w-[20px] h-5 px-1.5 text-[10px] font-extrabold rounded-full shadow-sm shrink-0 ${
                        isActive
                          ? "bg-black text-white"
                          : "bg-red-600 text-white animate-pulse"
                      }`}
                    >
                      {unreadMessagesCount > 99 ? "99+" : unreadMessagesCount}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>
      </aside>

      {/* Main Content Area - Distinct Lighter Slate-Gray Canvas with independent scroll */}
      <div className="flex-1 h-screen overflow-y-auto flex flex-col min-w-0 bg-[#1C1D24]">
        {/* Top Desktop Bar with Page Title & User Profile - Matches sidebar background #060608 */}
        <header className="hidden lg:flex px-8 py-3.5 bg-[#060608] border-b border-white/[0.06] sticky top-0 z-30 shrink-0 items-center justify-between">
          {/* Page Title (Desktop Only) */}
          <div>
            <h1 className="text-base font-bold text-white tracking-tight">
              {getPageTitle(pathname)}
            </h1>
          </div>

          {/* Top Right: Actions & User Profile */}
          <div className="flex items-center space-x-3">
            {/* Quick Messages Inbox Button with Badge */}
            <Link
              href="/admin/contacts"
              className="relative p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-white/5 border border-transparent hover:border-white/10 transition-colors"
              title="Inquiries & Messages"
            >
              <Inbox className="w-5 h-5" />
              {unreadMessagesCount > 0 && (
                <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[10px] font-bold text-white bg-red-600 rounded-full shadow-sm animate-pulse">
                  {unreadMessagesCount > 99 ? "99+" : unreadMessagesCount}
                </span>
              )}
            </Link>

            {/* User Profile with Click-Outside Dropdown */}
            <div className="relative" ref={desktopProfileRef}>
            <button
              onClick={() => setProfileMenuOpen(!profileMenuOpen)}
              className="flex items-center space-x-3 p-1.5 pr-3 rounded-full hover:bg-white/5 border border-transparent hover:border-white/10 transition-all cursor-pointer select-none"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary to-amber-500 text-black font-bold flex items-center justify-center text-xs shadow-md shadow-primary/20">
                {userInitial}
              </div>
              <div className="text-left hidden sm:block">
                <span className="text-xs font-bold text-white block leading-tight">
                  {displayName}
                </span>
                <span className="text-[10px] text-muted-foreground block capitalize leading-none">
                  {user?.role === "superAdmin" ? "Admin" : user?.role || "Staff"}
                </span>
              </div>
              <ChevronDown
                className={`w-3.5 h-3.5 text-muted-foreground transition-transform duration-200 ${
                  profileMenuOpen ? "rotate-180 text-white" : ""
                }`}
              />
            </button>

            {/* Profile Dropdown Menu */}
            {profileMenuOpen && renderProfileDropdown()}
          </div>
        </div>
      </header>

        {/* Content Body */}
        <main className="p-4 sm:p-6 lg:p-8 flex-1">
          {children}
        </main>
      </div>
    </div>
  );
}
