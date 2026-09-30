"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Lock, LogOut, ShieldCheck, Sparkles } from "lucide-react";
import { Logo } from "@/components/Logo";
import { logoutUser, User } from "@/lib/api";
import { ThemeToggle } from "@/components/ThemeToggle";

interface NavbarProps {
  user?: User | null;
}

export const Navbar: React.FC<NavbarProps> = ({ user }) => {
  const router = useRouter();

  const handleLogout = () => {
    logoutUser();
    router.push("/login");
  };

  return (
    <header className="sticky top-0 z-40 flex h-16 w-full items-center justify-between px-6 apple-glass transition-all duration-300">
      {/* Brand & Identity Vault Tag */}
      <div className="flex items-center space-x-4">
        <Link href="/dashboard" className="flex items-center space-x-2.5 group">
          <Logo variant="main" size="sm" priority />
          <span className="hidden text-[10px] font-semibold tracking-wider uppercase text-neutral-400 dark:text-neutral-500 sm:inline-block border-l border-neutral-300/60 dark:border-neutral-800 pl-2.5 ml-0.5">
            Vault OS
          </span>
        </Link>

        {/* Apple Dynamic Island Security Pill */}
        <div className="hidden items-center md:flex group relative">
          <div className="apple-dynamic-island cursor-default transition-all duration-300 hover:scale-[1.02] hover:shadow-lg">
            <div className="flex items-center space-x-2.5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#30D158] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#30D158]"></span>
              </span>
              <span className="text-[11px] font-bold text-white tracking-tight">Sovereign Vault Live</span>
              <span className="text-[10px] text-neutral-400 font-mono pl-1.5 border-l border-white/20">AES-256 • Ed25519</span>
            </div>
          </div>
        </div>
      </div>

      {/* User Info, Theme Switcher & System Controls */}
      <div className="flex items-center space-x-3">
        {/* iOS-Style Theme Toggle */}
        <ThemeToggle />

        {user ? (
          <div className="flex items-center space-x-2.5">
            {/* Apple User Capsule */}
            <div className="flex items-center space-x-2.5 rounded-full border border-black/[0.06] dark:border-white/[0.08] bg-black/[0.03] dark:bg-white/[0.06] pl-1.5 pr-3.5 py-1 transition-all duration-200 hover:border-blue-500/30 hover:bg-black/[0.05] dark:hover:bg-white/[0.1]">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-tr from-[#0071E3] via-[#AF52DE] to-[#FF2D55] text-xs font-bold text-white shadow-xs">
                {user.full_name ? user.full_name.charAt(0).toUpperCase() : "U"}
              </div>
              <div className="text-left hidden sm:block">
                <p className="text-xs font-semibold text-neutral-900 dark:text-white leading-tight">
                  {user.full_name}
                </p>
                <p className="text-[10px] text-neutral-500 dark:text-neutral-400 leading-tight truncate max-w-[130px]">
                  {user.email}
                </p>
              </div>
            </div>

            {/* Sign Out Button */}
            <button
              onClick={handleLogout}
              className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-black/[0.06] dark:border-white/[0.08] bg-black/[0.03] dark:bg-white/[0.06] text-neutral-600 dark:text-neutral-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-500/10 dark:hover:bg-red-500/20 transition-all duration-200 active:scale-95"
              title="Sign Out"
              aria-label="Sign Out"
            >
              <LogOut className="h-3.5 w-3.5" />
            </button>
          </div>
        ) : (
          <div className="flex items-center space-x-2">
            <Link
              href="/login"
              className="apple-btn-secondary px-4 py-1.5 text-xs"
            >
              Sign In
            </Link>
            <Link
              href="/register"
              className="apple-btn-primary px-4 py-1.5 text-xs shadow-xs"
            >
              Get Started
            </Link>
          </div>
        )}
      </div>
    </header>
  );
};
