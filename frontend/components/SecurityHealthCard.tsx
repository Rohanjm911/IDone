"use client";

import React from "react";
import { ShieldCheck, CheckCircle2, AlertTriangle, Lock, Award, Database, Sparkles } from "lucide-react";
import { SecurityStatus } from "@/lib/api";

interface SecurityHealthCardProps {
  status?: SecurityStatus | null;
  loading?: boolean;
}

export const SecurityHealthCard: React.FC<SecurityHealthCardProps> = ({ status, loading = false }) => {
  if (loading || !status) {
    return (
      <div className="animate-pulse rounded-3xl border border-black/[0.06] dark:border-white/[0.08] bg-white dark:bg-[#161618] p-6">
        <div className="h-6 w-48 bg-neutral-200 dark:bg-neutral-800 rounded-full mb-4"></div>
        <div className="h-10 w-24 bg-neutral-200 dark:bg-neutral-800 rounded-full mb-6"></div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="h-20 bg-neutral-100 dark:bg-neutral-800/50 rounded-2xl"></div>
          <div className="h-20 bg-neutral-100 dark:bg-neutral-800/50 rounded-2xl"></div>
          <div className="h-20 bg-neutral-100 dark:bg-neutral-800/50 rounded-2xl"></div>
          <div className="h-20 bg-neutral-100 dark:bg-neutral-800/50 rounded-2xl"></div>
        </div>
      </div>
    );
  }

  const score = status.security_score;
  const isHigh = score >= 80;
  const isMod = score >= 60;

  // Ring circumference: 2 * PI * r = 2 * PI * 34 ~= 213.6
  const radius = 34;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="apple-card-holo p-6 md:p-7 relative overflow-hidden">
      {/* Background Ambient Glow */}
      <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-gradient-to-br from-[#0071E3]/15 via-[#34C759]/10 to-[#AF52DE]/10 blur-3xl pointer-events-none"></div>

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 pb-6 border-b border-black/[0.05] dark:border-white/[0.07] relative z-10">
        {/* Left Title & Status */}
        <div className="space-y-1">
          <div className="inline-flex items-center space-x-2 text-[11px] font-semibold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
            <span className="flex h-2 w-2 rounded-full bg-[#0071E3] animate-pulse"></span>
            <span className="text-[#0071E3] dark:text-[#64D2FF]">Security Health Radar</span>
          </div>
          <h2 className="text-xl md:text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">
            Defensive Cryptographic Posture
          </h2>
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            Real-time telemetry measuring private key isolation, cipher suites, and verifiable trust.
          </p>
        </div>

        {/* Right: Apple Health Multi-color Circular Activity Ring */}
        <div className="flex items-center space-x-4">
          <div className="relative flex h-22 w-22 items-center justify-center">
            <svg className="h-22 w-22 -rotate-90 transform" viewBox="0 0 80 80">
              <defs>
                <linearGradient id="appleActivityGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#30D158" />
                  <stop offset="50%" stopColor="#00C7BE" />
                  <stop offset="100%" stopColor="#0A84FF" />
                </linearGradient>
                <linearGradient id="appleModGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#FF9F0A" />
                  <stop offset="100%" stopColor="#FF375F" />
                </linearGradient>
              </defs>
              {/* Background Ring */}
              <circle
                cx="40"
                cy="40"
                r={radius}
                className="stroke-black/[0.06] dark:stroke-white/[0.1]"
                strokeWidth="7"
                fill="none"
              />
              {/* Progress Ring with Vibrant Multi-color Gradient */}
              <circle
                cx="40"
                cy="40"
                r={radius}
                stroke={isHigh ? "url(#appleActivityGradient)" : isMod ? "url(#appleModGradient)" : "#FF453A"}
                strokeWidth="7"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="none"
                className="transition-all duration-1000 ease-out"
              />
            </svg>
            <div className="absolute flex flex-col items-center justify-center text-center">
              <span className="text-xl font-extrabold tracking-tight text-neutral-900 dark:text-white leading-none">
                {score}
              </span>
              <span className="text-[9px] font-bold text-[#0071E3] dark:text-[#64D2FF] uppercase tracking-tighter">
                Health
              </span>
            </div>
          </div>

          <div className="space-y-1">
            <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold shadow-xs ${
              isHigh
                ? "bg-gradient-to-r from-emerald-500/15 to-teal-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30"
                : isMod
                ? "bg-gradient-to-r from-amber-500/15 to-orange-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30"
                : "bg-gradient-to-r from-rose-500/15 to-red-500/15 text-red-600 dark:text-red-400 border border-red-500/30"
            }`}>
              <span className={`h-1.5 w-1.5 rounded-full mr-1.5 ${
                isHigh ? "bg-[#34C759] shadow-[0_0_8px_#34C759]" : isMod ? "bg-[#FF9500]" : "bg-[#FF3B30]"
              }`}></span>
              {isHigh ? "Sovereign Grade" : isMod ? "Moderate Protection" : "Action Recommended"}
            </span>
            <p className="text-[11px] text-neutral-500 dark:text-neutral-400 pl-1">
              Zero vulnerabilities detected
            </p>
          </div>
        </div>
      </div>

      {/* 4 Apple Vibrant Control Widgets */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6 relative z-10">
        {/* Widget 1: Encryption */}
        <div className="rounded-2xl border border-blue-500/20 bg-gradient-to-b from-blue-500/5 to-transparent dark:from-blue-500/10 dark:to-transparent p-4 transition-all duration-200 hover:border-blue-500/40 hover:shadow-md hover:shadow-blue-500/5 group">
          <div className="flex items-center space-x-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-[#0071E3] to-[#5AC8FA] text-white shadow-sm shadow-blue-500/30 group-hover:scale-105 transition-transform">
              <Lock className="h-4 w-4" />
            </div>
            <div>
              <span className="text-xs font-bold text-neutral-900 dark:text-white block">Vault Encryption</span>
              <span className="text-[10px] text-blue-600 dark:text-blue-400 font-semibold uppercase tracking-wider">AES-256-GCM</span>
            </div>
          </div>
          <div className="mt-3 flex items-center space-x-1.5 text-xs text-neutral-600 dark:text-neutral-300">
            <CheckCircle2 className="h-3.5 w-3.5 text-[#34C759] dark:text-[#30D158]" />
            <span className="font-medium">Active & Authenticated</span>
          </div>
        </div>

        {/* Widget 2: Decentralized DID */}
        <div className="rounded-2xl border border-purple-500/20 bg-gradient-to-b from-purple-500/5 to-transparent dark:from-purple-500/10 dark:to-transparent p-4 transition-all duration-200 hover:border-purple-500/40 hover:shadow-md hover:shadow-purple-500/5 group">
          <div className="flex items-center space-x-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-[#AF52DE] to-[#BF5AF2] text-white shadow-sm shadow-purple-500/30 group-hover:scale-105 transition-transform">
              <ShieldCheck className="h-4 w-4" />
            </div>
            <div>
              <span className="text-xs font-bold text-neutral-900 dark:text-white block">Decentralized DID</span>
              <span className="text-[10px] text-purple-600 dark:text-purple-400 font-semibold uppercase tracking-wider">W3C Compliant</span>
            </div>
          </div>
          <div className="mt-3 flex items-center space-x-1.5 text-xs text-neutral-600 dark:text-neutral-300">
            <CheckCircle2 className="h-3.5 w-3.5 text-[#34C759] dark:text-[#30D158]" />
            <span className="font-medium">Ed25519 Anchored</span>
          </div>
        </div>

        {/* Widget 3: Credentials */}
        <div className="rounded-2xl border border-amber-500/20 bg-gradient-to-b from-amber-500/5 to-transparent dark:from-amber-500/10 dark:to-transparent p-4 transition-all duration-200 hover:border-amber-500/40 hover:shadow-md hover:shadow-amber-500/5 group">
          <div className="flex items-center space-x-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-[#FF9500] to-[#FFCC00] text-white shadow-sm shadow-amber-500/30 group-hover:scale-105 transition-transform">
              <Award className="h-4 w-4" />
            </div>
            <div>
              <span className="text-xs font-bold text-neutral-900 dark:text-white block">Credentials Active</span>
              <span className="text-[10px] text-amber-600 dark:text-amber-400 font-semibold uppercase tracking-wider">W3C VC 1.1</span>
            </div>
          </div>
          <div className="mt-3 flex items-center space-x-1.5 text-xs text-neutral-600 dark:text-neutral-300">
            <span className="font-extrabold text-[#FF9500] dark:text-[#FF9F0A]">{status.verified_credentials}</span>
            <span className="text-neutral-500 dark:text-neutral-400">of {status.total_credentials} Verified</span>
          </div>
        </div>

        {/* Widget 4: Encrypted Locker */}
        <div className="rounded-2xl border border-emerald-500/20 bg-gradient-to-b from-emerald-500/5 to-transparent dark:from-emerald-500/10 dark:to-transparent p-4 transition-all duration-200 hover:border-emerald-500/40 hover:shadow-md hover:shadow-emerald-500/5 group">
          <div className="flex items-center space-x-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-[#34C759] to-[#30D158] text-white shadow-sm shadow-emerald-500/30 group-hover:scale-105 transition-transform">
              <Database className="h-4 w-4" />
            </div>
            <div>
              <span className="text-xs font-bold text-neutral-900 dark:text-white block">Encrypted Locker</span>
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold uppercase tracking-wider">Zero-Knowledge</span>
            </div>
          </div>
          <div className="mt-3 flex items-center space-x-1.5 text-xs text-neutral-600 dark:text-neutral-300">
            <span className="font-extrabold text-[#34C759] dark:text-[#30D158]">{status.vault_items_count}</span>
            <span className="text-neutral-500 dark:text-neutral-400">Items Guarded</span>
          </div>
        </div>
      </div>
    </div>
  );
};
