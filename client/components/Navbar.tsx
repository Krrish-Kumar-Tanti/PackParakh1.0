"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Scale, Home, BookOpen, FileText, HelpCircle, Phone, LogIn, LogOut, Menu, X, ChevronDown } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";
import { useAuth, signOutUser, type AuthUser } from "@/lib/auth";
import { cn } from "@/lib/utils";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { language, t } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  
  const detectedUser = useAuth();
  const [localUserOverride, setLocalUserOverride] = useState<AuthUser | null | undefined>(undefined);
  const user = localUserOverride !== undefined ? localUserOverride : detectedUser;

  // Keep override synced when detectedUser changes
  React.useEffect(() => {
    setLocalUserOverride(undefined);
  }, [detectedUser]);

  const handleSignOut = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setUserMenuOpen(false);
    setMobileMenuOpen(false);
    // Instant 0ms synchronous UI transition back to Sign In
    setLocalUserOverride(null);
    signOutUser();
    if (pathname === "/scan" || pathname === "/verdict") {
      router.push("/");
    }
  };

  const navLinks = [
    { name: t("nav.home"), path: "/", icon: Home },
    { name: t("nav.act"), path: "/act-and-rules", icon: BookOpen },
    { name: t("nav.guidelines"), path: "/guidelines", icon: FileText },
    { name: t("nav.helpdesk"), path: "/helpdesk", icon: HelpCircle },
    { name: t("nav.contact"), path: "/contact", icon: Phone },
  ];

  const isAuthPage = pathname === "/gmail-login" || pathname === "/login";

  return (
    <nav 
      className={cn(
        "w-full sticky top-0 z-40 transition-all backdrop-blur-xl border-b",
        isAuthPage
          ? "border-[#E8DFC8]/90 shadow-sm"
          : "bg-[#FAF7F0]/25 border-[#FAF7F0]/20"
      )}
      style={isAuthPage ? { backgroundColor: "rgba(250, 247, 240, 0.96)" } : undefined}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo / Brand */}
          <Link href="/" className="flex items-center gap-3 group cursor-pointer">
            <div 
              className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-md border border-amber-400/50 group-hover:scale-105 transition-all"
              style={{ background: "linear-gradient(135deg, #F59E0B 0%, #D97706 55%, #B45309 100%)", boxShadow: "0 4px 14px rgba(217, 119, 6, 0.3)" }}
            >
              <Scale className="w-5 h-5 text-white drop-shadow-xs" />
            </div>
            <div className="flex flex-col">
              <span className="font-black text-slate-950 text-lg leading-tight tracking-tight drop-shadow-[0_1px_1px_rgba(255,255,255,0.7)]">
                PackParakh <span className="text-amber-800 text-sm font-black">(पैक-परख)</span>
              </span>
              <span className="text-[10.5px] text-[#42362B] font-extrabold uppercase tracking-wider drop-shadow-[0_1px_1px_rgba(255,255,255,0.5)]">
                Legal Metrology Directorate • DoCA
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1.5">
            {navLinks.map((link) => {
              const isActive = pathname === link.path;
              return (
                <Link
                  key={link.path}
                  href={link.path}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-black transition-all duration-150",
                    isActive
                      ? "bg-slate-950/15 text-[#020617] shadow-xs border border-slate-950/20 backdrop-blur-sm"
                      : "text-[#020617] hover:bg-slate-950/10 hover:text-black"
                  )}
                >
                  <link.icon className="w-3.5 h-3.5 text-[#020617]" />
                  {link.name}
                </Link>
              );
            })}
          </div>

          {/* Login CTA / User Profile */}
          <div className="hidden sm:flex items-center gap-3">
            {user ? (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2.5 pl-1.5 pr-2.5 py-1.5 rounded-xl bg-white/70 hover:bg-white/90 border border-slate-300 shadow-xs transition-all cursor-pointer backdrop-blur-sm"
                >
                  <span className="w-8 h-8 rounded-full bg-amber-700 text-white flex items-center justify-center font-black text-sm shadow-sm">
                    {user.name.charAt(0).toUpperCase()}
                  </span>
                  <span className="text-left leading-tight">
                    <span className="block text-xs font-black text-slate-950 max-w-[140px] truncate">
                      {user.name}
                    </span>
                    <span className="block text-[9.5px] font-black text-slate-800 uppercase tracking-wide max-w-[140px] truncate">
                      {user.role ? user.role.toUpperCase() : "Signed In"}
                    </span>
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-800" />
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl border border-slate-300 shadow-xl overflow-hidden z-50">
                    <div className="px-4 py-3 border-b border-slate-200">
                      <p className="text-xs font-black text-slate-950 truncate">{user.name}</p>
                      <p className="text-[11px] text-slate-700 truncate font-mono font-bold">{user.email}</p>
                      {user.badge && (
                        <span className="mt-1 inline-block text-[9px] font-black text-amber-950 bg-amber-100 px-2 py-0.5 rounded-full border border-amber-300">
                          {user.badge}
                        </span>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={handleSignOut}
                      className="w-full px-4 py-2.5 text-left text-xs font-black text-rose-700 hover:bg-rose-50 flex items-center gap-2 transition-colors cursor-pointer"
                    >
                      <LogOut className="w-3.5 h-3.5" /> Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/gmail-login"
                className="bg-slate-700/85 hover:bg-slate-600/90 text-slate-200 hover:text-white text-xs font-bold px-4 py-2 rounded-full transition-all shadow-sm flex items-center gap-1.5 border border-slate-600/60 backdrop-blur-sm"
              >
                <LogIn className="w-3.5 h-3.5 text-amber-400" />
                <span>{t("nav.login") || "Sign In"}</span>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex sm:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-md text-[#5C4E3D] hover:text-[#2B231B] hover:bg-[#F2ECE0]/70"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="sm:hidden bg-[#FAF7F0]/95 backdrop-blur-xl border-b border-[#E8DFC8] px-4 pt-2 pb-4 space-y-1">
          {navLinks.map((link) => {
            const isActive = pathname === link.path;
            return (
              <Link
                key={link.path}
                href={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  "flex items-center gap-2 px-3 py-2 rounded-md text-sm font-semibold",
                  isActive
                    ? "bg-amber-100 text-amber-900"
                    : "text-[#5C4E3D] hover:bg-[#F2ECE0] hover:text-[#2B231B]"
                )}
              >
                <link.icon className="w-4 h-4" />
                {link.name}
              </Link>
            );
          })}
          <div className="pt-2 border-t border-[#E8DFC8]">
            {user ? (
              <div className="mb-2">
                <div className="flex items-center gap-2.5 px-3 py-2 bg-[#F2ECE0]/70 rounded-lg border border-[#E8DFC8]">
                  <span className="w-8 h-8 rounded-full bg-amber-700 text-white flex items-center justify-center font-black text-sm shrink-0">
                    {user.name.charAt(0).toUpperCase()}
                  </span>
                  <div className="min-w-0">
                    <p className="text-xs font-extrabold text-[#2B231B] truncate">{user.name}</p>
                    <p className="text-[10px] text-[#786551] font-mono truncate">{user.email}</p>
                  </div>
                </div>
              </div>
            ) : null}
            <Link
              href={user ? "/" : "/gmail-login"}
              onClick={user ? handleSignOut : () => setMobileMenuOpen(false)}
              className="w-full bg-[#2B231B] text-[#FAF7F0] text-xs font-bold py-2.5 rounded-lg flex items-center justify-center gap-1.5"
            >
              {user ? (
                <>
                  <LogOut className="w-4 h-4 text-amber-300" /> Sign Out
                </>
              ) : (
                <>
                  <LogIn className="w-4 h-4 text-amber-300" />
                  <span>{t("nav.login")}</span>
                </>
              )}
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
