"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Fingerprint,
  Award,
  Lock,
  CheckCheck,
  History,
  ShieldCheck,
  ChevronRight
} from "lucide-react";

export const Sidebar: React.FC = () => {
  const pathname = usePathname();

  const navItems = [
    {
      label: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      label: "Decentralized Identity",
      href: "/identity",
      icon: Fingerprint,
    },
    {
      label: "Verifiable Credentials",
      href: "/credentials",
      icon: Award,
    },
    {
      label: "Encrypted Vault",
      href: "/vault",
      icon: Lock,
    },
    {
      label: "Verification Tool",
      href: "/verify",
      icon: CheckCheck,
    },
    {
      label: "Audit & Activity",
      href: "/activity",
      icon: History,
    },
  ];

  return (
    <aside className="hidden w-64 flex-shrink-0 flex-col border-r border-offwhite-200 dark:border-[#262626] bg-white dark:bg-[#0D0D0D] transition-colors md:flex">
      <div className="flex flex-1 flex-col justify-between p-4">
        {/* Navigation Links */}
        <nav className="space-y-1.5" aria-label="Main Navigation">
          <div className="px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-300">
            Platform Hub
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`group relative flex items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-150 btn-press ${
                  isActive
                    ? "bg-navy-900 dark:bg-[#262626] text-white font-semibold shadow-xs border border-transparent dark:border-[#3E3E3E]"
                    : "text-slate-600 dark:text-[#E2E8F0] hover:bg-offwhite-100 dark:hover:bg-[#222222] hover:text-navy-900 dark:hover:text-white hover:translate-x-1"
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Icon
                    className={`h-4 w-4 transition-colors ${
                      isActive ? "text-trust-600 dark:text-white" : "text-slate-500 dark:text-zinc-300 group-hover:text-navy-900 dark:group-hover:text-white"
                    }`}
                  />
                  <span>{item.label}</span>
                </div>
                {isActive && (
                  <div className="flex items-center space-x-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-trust-600 dark:bg-emerald-400 animate-calm-pulse"></span>
                    <ChevronRight className="h-3.5 w-3.5 text-slate-400 dark:text-zinc-400" />
                  </div>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Calm Trust Guarantee Footer */}
        <div className="rounded-xl border border-offwhite-200 dark:border-[#262626] bg-offwhite-50 dark:bg-[#141414] p-3.5 transition-all duration-200 hover:border-slate-300 dark:hover:border-[#383838]">
          <div className="flex items-center space-x-2 text-trust-700 dark:text-zinc-200 mb-1.5">
            <ShieldCheck className="h-4 w-4 text-trust-600 dark:text-zinc-200" />
            <span className="text-xs font-bold uppercase tracking-wider">Zero-Knowledge</span>
          </div>
          <p className="text-[11px] leading-relaxed text-slate-500 dark:text-zinc-200 font-normal">
            Keys and decrypted credentials never leave your browser unencrypted.
          </p>
        </div>
      </div>
    </aside>
  );
};
