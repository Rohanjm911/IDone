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
      gradient: "from-[#0071E3] to-[#5AC8FA]",
      color: "text-[#0071E3] dark:text-[#64D2FF]",
      bgSoft: "bg-blue-500/10 text-[#0071E3] dark:text-[#64D2FF]",
      activeBg: "bg-blue-500/10 border-blue-500/30 text-blue-600 dark:text-blue-300 font-semibold shadow-xs",
    },
    {
      label: "Decentralized Identity",
      href: "/identity",
      icon: Fingerprint,
      gradient: "from-[#AF52DE] to-[#BF5AF2]",
      color: "text-[#AF52DE] dark:text-[#BF5AF2]",
      bgSoft: "bg-purple-500/10 text-[#AF52DE] dark:text-[#BF5AF2]",
      activeBg: "bg-purple-500/10 border-purple-500/30 text-purple-600 dark:text-purple-300 font-semibold shadow-xs",
    },
    {
      label: "Verifiable Credentials",
      href: "/credentials",
      icon: Award,
      gradient: "from-[#FF9500] to-[#FFCC00]",
      color: "text-[#FF9500] dark:text-[#FF9F0A]",
      bgSoft: "bg-amber-500/10 text-[#FF9500] dark:text-[#FF9F0A]",
      activeBg: "bg-amber-500/10 border-amber-500/30 text-amber-600 dark:text-amber-300 font-semibold shadow-xs",
    },
    {
      label: "Encrypted Vault",
      href: "/vault",
      icon: Lock,
      gradient: "from-[#34C759] to-[#30D158]",
      color: "text-[#34C759] dark:text-[#30D158]",
      bgSoft: "bg-emerald-500/10 text-[#34C759] dark:text-[#30D158]",
      activeBg: "bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-300 font-semibold shadow-xs",
    },
    {
      label: "Verification Tool",
      href: "/verify",
      icon: CheckCheck,
      gradient: "from-[#0071E3] to-[#00C7BE]",
      color: "text-[#00C7BE] dark:text-[#64D2FF]",
      bgSoft: "bg-cyan-500/10 text-[#00C7BE] dark:text-[#64D2FF]",
      activeBg: "bg-cyan-500/10 border-cyan-500/30 text-cyan-600 dark:text-cyan-300 font-semibold shadow-xs",
    },
    {
      label: "Audit & Activity",
      href: "/activity",
      icon: History,
      gradient: "from-[#FF2D55] to-[#FF375F]",
      color: "text-[#FF2D55] dark:text-[#FF375F]",
      bgSoft: "bg-rose-500/10 text-[#FF2D55] dark:text-[#FF375F]",
      activeBg: "bg-rose-500/10 border-rose-500/30 text-rose-600 dark:text-rose-300 font-semibold shadow-xs",
    },
  ];

  return (
    <aside className="hidden md:flex w-64 flex-shrink-0 flex-col sticky top-16 h-[calc(100vh-4rem)] self-start overflow-y-auto border-r border-black/[0.06] dark:border-white/[0.08] bg-white/70 dark:bg-black/60 backdrop-blur-xl z-30 transition-all duration-300">
      <div className="flex min-h-full flex-col justify-between p-4">
        {/* Navigation Links */}
        <nav className="space-y-1.5" aria-label="Main Navigation">
          <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
            Platform Hub
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`group relative flex items-center justify-between rounded-xl px-3 py-2.5 text-xs font-medium transition-all duration-200 border ${
                  isActive
                    ? item.activeBg
                    : "border-transparent text-neutral-600 dark:text-neutral-400 hover:bg-black/[0.03] dark:hover:bg-white/[0.05] hover:text-neutral-900 dark:hover:text-white"
                }`}
              >
                <div className="flex items-center space-x-2.5">
                  <div className={`flex h-7 w-7 items-center justify-center rounded-lg transition-all ${
                    isActive
                      ? `bg-gradient-to-tr ${item.gradient} text-white shadow-sm`
                      : `${item.bgSoft} group-hover:scale-105`
                  }`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <span>{item.label}</span>
                </div>
                {isActive && (
                  <div className="flex items-center space-x-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-current"></span>
                  </div>
                )}
              </Link>
            );
          })}
        </nav>

        {/* macOS Style Trust Guarantee Card with Vivid Gradient Accent */}
        <div className="rounded-2xl border border-emerald-500/20 bg-gradient-to-br from-emerald-500/5 via-teal-500/5 to-transparent p-3.5 transition-all duration-200">
          <div className="flex items-center space-x-2 text-neutral-900 dark:text-white mb-1.5">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-gradient-to-tr from-[#34C759] to-[#30D158] text-white shadow-xs">
              <ShieldCheck className="h-3.5 w-3.5" />
            </div>
            <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400">Zero-Knowledge Vault</span>
          </div>
          <p className="text-[11px] leading-relaxed text-neutral-500 dark:text-neutral-400">
            Keys & decrypted credentials never leave your local device unencrypted.
          </p>
        </div>
      </div>
    </aside>
  );
};
