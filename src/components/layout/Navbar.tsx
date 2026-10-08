"use client";

import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/useAuthStore";
import { useUIStore } from "@/stores/useUIStore";
import { useNotificationStore } from "@/stores/useNotificationStore";
import {
  Menu,
  X,
  Disc3,
  User,
  LogOut,
  LayoutDashboard,
  Music2,
  Users,
  Calendar,
  Mic,
  Inbox,
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAuthenticated, checkAuth, logout } = useAuthStore();
  const { mobileMenuOpen, setMobileMenuOpen } = useUIStore();
  const { unreadMessagesCount } = useNotificationStore();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const desktopUserRef = useRef<HTMLDivElement>(null);
  const mobileUserRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close menus on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setUserMenuOpen(false);
  }, [pathname, setMobileMenuOpen]);

  // Click-outside listener to close user dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;
      const insideDesktop = desktopUserRef.current?.contains(target);
      const insideMobile = mobileUserRef.current?.contains(target);
      if (!insideDesktop && !insideMobile) {
        setUserMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    setUserMenuOpen(false);
    await logout();
    router.refresh();
  };

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "About Us", href: "/about" },
    { label: "Services", href: "/services" },
    { label: "Contact", href: "/contact" },
  ];

  const adminMenuItems = [
    { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
      { label: "Messages", href: "/admin/contacts", icon: Inbox },
    { label: "Music & Tracks", href: "/admin/tracks", icon: Music2 },
    { label: "Artist Roster", href: "/admin/artists", icon: Users },
  
  ];

  const isAdmin = user && ["superAdmin", "admin", "editor"].includes(user.role);
  const displayName = user?.name || user?.fullName || "Executive User";

  const renderDropdown = () => (
    <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-[#0A0A0D] border border-white/[0.08] shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
      {/* User Header */}
      <div className="p-3 bg-[#16161E] rounded-xl mb-1.5 border border-white/[0.05]">
        <div className="flex items-center justify-between gap-2">
          <p className="text-xs font-bold text-white truncate">{displayName}</p>
          <Badge variant={user?.role === "superAdmin" || user?.role === "admin" ? "gold" : "default"} size="sm">
            {user?.role === "superAdmin" ? "Admin" : user?.role || "Member"}
          </Badge>
        </div>
        <p className="text-[11px] text-[#9D9DAE] truncate mt-0.5">{user?.email}</p>
      </div>

      {/* 4 Selected Admin Shortcuts */}
      {isAdmin && (
        <div className="space-y-0.5">
    
          {adminMenuItems.map((item) => {
            const Icon = item.icon;
            const isItemActive = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));
            const isMessages = item.href === "/admin/contacts";
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setUserMenuOpen(false)}
                className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs transition-colors group ${
                  isItemActive
                    ? "bg-[#E5A93C]/15 text-[#E5A93C] font-semibold border border-[#E5A93C]/20"
                    : "text-zinc-300 hover:text-white hover:bg-white/5"
                }`}
              >
                <div className="flex items-center space-x-2.5">
                  <Icon className={`w-3.5 h-3.5 ${isItemActive ? "text-[#E5A93C]" : "text-[#E5A93C]/70 group-hover:text-[#E5A93C]"} group-hover:scale-110 transition-transform`} />
                  <span>{item.label}</span>
                </div>
                {isMessages && unreadMessagesCount > 0 && (
                  <span className="flex items-center justify-center min-w-[18px] h-4.5 px-1.5 text-[10px] font-bold text-white bg-red-600 rounded-full shadow-sm animate-pulse">
                    {unreadMessagesCount > 99 ? "99+" : unreadMessagesCount}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      )}

      {/* Divider */}
      <div className="my-1.5 border-t border-white/[0.06]" />

      {/* Logout Link */}
      <button
        onClick={handleLogout}
        className="flex items-center space-x-2.5 w-full px-3 py-2 text-xs font-semibold text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer"
      >
        <LogOut className="w-3.5 h-3.5" />
        <span>Sign Out</span>
      </button>
    </div>
  );

  const isHome = pathname === "/";
  const headerClass = isHome
    ? `fixed top-0 inset-x-0 z-40 transition-all duration-300 ${
        isScrolled
          ? "bg-[#08080A]/95 backdrop-blur-md border-b border-[#242430]"
          : "bg-transparent border-b border-transparent"
      }`
    : "sticky top-0 z-40 bg-[#08080A]/95 backdrop-blur-md border-b border-[#242430]";

  return (
    <header className={headerClass}>
      <div className="max-w-7xl mx-auto px-4 md:px-8 h-20 sm:h-22 flex items-center justify-between relative">
        {/* Brand Logo - Left */}
        <div className="flex items-center z-10 shrink-0">
          <Link href="/" className="flex items-center group py-2">
            <div className="relative w-44 sm:w-56 md:w-60 h-11 sm:h-13 md:h-15 transition-transform group-hover:scale-105">
              <Image
                src="/images/p-logo.png"
                alt="Phlame Nation - From Nothing To Something"
                fill
                priority
                sizes="(max-width: 640px) 176px, (max-width: 768px) 224px, 240px"
                className="object-contain object-left"
              />
            </div>
          </Link>
        </div>

        {/* Desktop Navigation - Fully Centered */}
        <div className="hidden lg:flex absolute left-1/2 -translate-x-1/2 items-center justify-center pointer-events-none">
          <nav className="pointer-events-auto flex items-center gap-1 xl:gap-1.5 bg-[#121217]/70 backdrop-blur-md px-2.5 py-1.5 rounded-full border border-white/10 shadow-lg shadow-black/40">
            {navLinks.map((link) => {
              const isActive =
                link.href === "/"
                  ? pathname === "/"
                  : pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative px-3 xl:px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all flex items-center gap-1.5 whitespace-nowrap ${
                    isActive
                      ? "bg-[#E5A93C]/20 text-[#E5A93C] border border-[#E5A93C]/40 shadow-[0_0_12px_rgba(229,169,60,0.15)]"
                      : "text-[#D6D6E0] hover:text-[#F8F8FA] hover:bg-white/10 border border-transparent"
                  }`}
                >
                  {isActive && (
                    <span className="w-1.5 h-1.5 rounded-full bg-[#E5A93C] shadow-[0_0_6px_#E5A93C] animate-pulse" />
                  )}
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Right Controls - Login / User Account / Mobile Menu */}
        <div className="flex items-center gap-3 z-10 shrink-0">
          {/* Desktop Right CTA / User Icon */}
          <div className="hidden lg:flex items-center gap-4">
            {isAuthenticated ? (
              <div className="relative" ref={desktopUserRef}>
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  aria-label="User account menu"
                  className={`relative w-9 h-9 rounded-full flex items-center justify-center transition-all cursor-pointer border ${
                    userMenuOpen
                      ? "bg-[#E5A93C] text-black border-[#E5A93C] shadow-lg shadow-[#E5A93C]/20"
                      : "bg-[#16161E] text-[#F8F8FA] hover:text-[#E5A93C] border-white/10 hover:border-[#E5A93C]/40"
                  }`}
                  title={displayName}
                >
                  <User className="w-4 h-4" />
                  {isAdmin && unreadMessagesCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-red-600 border border-[#08080A]"></span>
                    </span>
                  )}
                </button>
                {userMenuOpen && renderDropdown()}
              </div>
            ) : (
              <Link
                href="/login"
                className="text-xs px-4 py-2 rounded-full bg-[#121217]/60 hover:bg-[#E5A93C]/10 text-[#D6D6E0] hover:text-[#E5A93C] border border-white/10 hover:border-[#E5A93C]/40 transition-all font-semibold"
              >
                Login
              </Link>
            )}
          </div>

          {/* Mobile Controls (User Icon if logged in + Hamburger Toggle) */}
          <div className="flex items-center gap-2 lg:hidden">
            {isAuthenticated && (
              <div className="relative" ref={mobileUserRef}>
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  aria-label="User account menu"
                  className={`relative w-8 h-8 rounded-full flex items-center justify-center transition-all cursor-pointer border ${
                    userMenuOpen
                      ? "bg-[#E5A93C] text-black border-[#E5A93C]"
                      : "bg-[#16161E] text-[#F8F8FA] border-white/10"
                  }`}
                  title={displayName}
                >
                  <User className="w-4 h-4" />
                  {isAdmin && unreadMessagesCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 flex h-2.5 w-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-600 border border-[#08080A]"></span>
                    </span>
                  )}
                </button>
                {userMenuOpen && renderDropdown()}
              </div>
            )}

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              className="p-2 text-[#9D9DAE] hover:text-[#F8F8FA] rounded-lg cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#0C0C10] border-b border-[#242430] px-4 py-5 flex flex-col gap-4 animate-in slide-in-from-top-2 duration-200">
          <nav className="flex flex-col gap-1.5">
            {navLinks.map((link) => {
              const isActive =
                link.href === "/"
                  ? pathname === "/"
                  : pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all flex items-center justify-between ${
                    isActive
                      ? "bg-[#E5A93C]/15 text-[#E5A93C] border border-[#E5A93C]/30 shadow-sm"
                      : "text-[#9D9DAE] hover:text-[#F8F8FA] hover:bg-white/5"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {isActive && (
                      <span className="w-2 h-2 rounded-full bg-[#E5A93C] shadow-[0_0_8px_#E5A93C] animate-pulse" />
                    )}
                    <span>{link.label}</span>
                  </div>
                  {isActive && (
                    <span className="text-[10px] uppercase font-bold tracking-widest text-[#E5A93C] bg-[#E5A93C]/10 px-2 py-0.5 rounded-md">
                      Active
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="pt-4 border-t border-[#242430] flex flex-col gap-3">
            {isAuthenticated ? (
              <div className="p-3 bg-[#16161E] rounded-xl border border-white/[0.05] flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-white">{displayName}</p>
                  <p className="text-[10px] text-[#9D9DAE]">{user?.email}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="px-3 py-1.5 rounded-lg bg-red-500/10 text-red-400 text-xs font-semibold hover:bg-red-500/20 transition-colors cursor-pointer"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="text-center text-sm py-2 rounded-lg border border-[#242430] text-[#F8F8FA]"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
