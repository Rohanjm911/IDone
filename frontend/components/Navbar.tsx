"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Shield, Lock, LogOut, CheckCircle2, User as UserIcon } from "lucide-react";
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
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-offwhite-200 dark:border-[#262626] bg-white dark:bg-[#101010] px-6 transition-colors">
      {/* Brand & Tagline */}
      <div className="flex items-center space-x-4">
        <Link href="/dashboard" className="flex items-center space-x-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-navy-900 dark:bg-[#1A1A1A] text-white border border-navy-700 dark:border-[#2E2E2E]">
            <Shield className="h-5 w-5 text-trust-600 dark:text-[#E5E5E5]" />
          </div>
          <div>
            <span className="text-lg font-bold tracking-tight text-navy-900 dark:text-white">IDone</span>
            <span className="hidden ml-2 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-zinc-300 sm:inline-block">
              Vault
            </span>
          </div>
        </Link>

        {/* Network & Security Indicators */}
        <div className="hidden items-center space-x-2 md:flex">
          <span className="inline-flex items-center rounded-full bg-trust-50 dark:bg-[#161616] px-2.5 py-1 text-xs font-medium text-trust-700 dark:text-[#E2E8F0] border border-trust-100 dark:border-[#282828]">
            <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-trust-600 dark:bg-[#CBD5E1] animate-calm-pulse"></span>
            EVM Anchors Active
          </span>
          <span className="inline-flex items-center rounded-full bg-success-50 dark:bg-[#161616] px-2.5 py-1 text-xs font-medium text-success-700 dark:text-[#E2E8F0] border border-success-100 dark:border-[#282828]">
            <Lock className="mr-1.5 h-3 w-3 text-success-600 dark:text-emerald-400" />
            AES-256 Encrypted
          </span>
        </div>
      </div>

      {/* User Info, Theme Toggle & Actions */}
      <div className="flex items-center space-x-3">
        {/* Theme Toggle Button */}
        <ThemeToggle />

        {user ? (
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2 rounded-lg border border-offwhite-200 dark:border-[#262626] bg-offwhite-50 dark:bg-[#161616] px-3 py-1.5 transition-colors hover:border-slate-300 dark:hover:border-[#383838]">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-navy-800 dark:bg-[#262626] text-xs font-semibold text-white">
                {user.full_name ? user.full_name.charAt(0).toUpperCase() : "U"}
              </div>
              <div className="text-left">
                <p className="text-xs font-semibold text-navy-900 dark:text-white leading-none">{user.full_name}</p>
                <p className="text-[10px] text-slate-500 dark:text-zinc-300 leading-none mt-1 truncate max-w-[140px]">{user.email}</p>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="btn-press inline-flex items-center justify-center rounded-lg border border-offwhite-200 dark:border-[#262626] bg-white dark:bg-[#161616] p-2 text-slate-600 dark:text-zinc-200 hover:bg-alert-50 dark:hover:bg-[#281414] hover:text-alert-600 hover:border-alert-100 dark:hover:border-[#4A1E1E]"
              title="Sign Out"
              aria-label="Sign Out"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <div className="flex items-center space-x-2">
            <Link
              href="/login"
              className="btn-press rounded-lg px-3.5 py-1.5 text-xs font-semibold text-navy-900 dark:text-white hover:bg-offwhite-100 dark:hover:bg-[#1E1E1E]"
            >
              Sign In
            </Link>
            <Link
              href="/register"
              className="btn-press rounded-lg bg-navy-900 dark:bg-white dark:text-black px-3.5 py-1.5 text-xs font-bold text-white hover:bg-navy-800 dark:hover:bg-zinc-200"
            >
              Get Started
            </Link>
          </div>
        )}
      </div>
    </header>
  );
};
