"use client";

import React from "react";
import { ShieldCheck, CheckCircle2, AlertTriangle, Lock, Award, Database } from "lucide-react";
import { SecurityStatus } from "@/lib/api";

interface SecurityHealthCardProps {
  status?: SecurityStatus | null;
  loading?: boolean;
}

export const SecurityHealthCard: React.FC<SecurityHealthCardProps> = ({ status, loading = false }) => {
  if (loading || !status) {
    return (
      <div className="animate-pulse rounded-xl border border-offwhite-200 bg-white p-6">
        <div className="h-6 w-48 bg-offwhite-200 rounded mb-4"></div>
        <div className="h-10 w-24 bg-offwhite-200 rounded mb-6"></div>
        <div className="grid grid-cols-2 gap-4">
          <div className="h-12 bg-offwhite-100 rounded"></div>
          <div className="h-12 bg-offwhite-100 rounded"></div>
        </div>
      </div>
    );
  }

  const score = status.security_score;
  const scoreColor =
    score >= 80 ? "text-success-600" : score >= 60 ? "text-amber-600" : "text-alert-600";
  const badgeBg =
    score >= 80 ? "bg-success-50 text-success-700" : score >= 60 ? "bg-amber-50 text-amber-700" : "bg-alert-50 text-alert-700";

  return (
    <div className="card-interactive animate-fade-slide-up rounded-xl border border-offwhite-200 bg-white p-6 shadow-card hover:border-slate-300">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
            System Security Health
          </span>
          <h2 className="text-xl font-bold text-navy-900 mt-0.5">Defensive Posture & Verification</h2>
        </div>

        <div className="flex items-center space-x-3">
          <div className="text-right">
            <span className={`text-2xl font-extrabold tracking-tight ${scoreColor}`}>{score}</span>
            <span className="text-xs text-slate-500">/100</span>
          </div>
          <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${badgeBg}`}>
            <span className={`h-1.5 w-1.5 rounded-full mr-1.5 animate-calm-pulse ${score >= 80 ? "bg-success-600" : score >= 60 ? "bg-amber-600" : "bg-alert-600"}`}></span>
            {score >= 80 ? "High Integrity" : score >= 60 ? "Moderate" : "Review Required"}
          </span>
        </div>
      </div>

      {/* Solid Animated Score Bar */}
      <div className="w-full bg-offwhite-200 h-2 rounded-full overflow-hidden mb-5">
        <div
          className={`h-full transition-all duration-700 ease-out ${
            score >= 80 ? "bg-success-600" : score >= 60 ? "bg-amber-600" : "bg-alert-600"
          }`}
          style={{ width: `${score}%` }}
        ></div>
      </div>

      {/* Pillars Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-lg border border-offwhite-200 bg-offwhite-50 p-3.5 transition-all duration-200 hover:border-slate-300 hover:bg-white">
          <div className="flex items-center space-x-2">
            <Lock className="h-4 w-4 text-trust-600" />
            <span className="text-xs font-semibold text-navy-900">Vault Encryption</span>
          </div>
          <div className="mt-2 flex items-center space-x-1.5">
            <CheckCircle2 className="h-3.5 w-3.5 text-success-600" />
            <span className="text-xs font-medium text-slate-600">AES-256-GCM Active</span>
          </div>
        </div>

        <div className="rounded-lg border border-offwhite-200 bg-offwhite-50 p-3.5 transition-all duration-200 hover:border-slate-300 hover:bg-white">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="h-4 w-4 text-trust-600" />
            <span className="text-xs font-semibold text-navy-900">Decentralized DID</span>
          </div>
          <div className="mt-2 flex items-center space-x-1.5">
            <CheckCircle2 className="h-3.5 w-3.5 text-success-600" />
            <span className="text-xs font-medium text-slate-600">Ed25519 Verified</span>
          </div>
        </div>

        <div className="rounded-lg border border-offwhite-200 bg-offwhite-50 p-3.5 transition-all duration-200 hover:border-slate-300 hover:bg-white">
          <div className="flex items-center space-x-2">
            <Award className="h-4 w-4 text-trust-600" />
            <span className="text-xs font-semibold text-navy-900">Credentials Valid</span>
          </div>
          <div className="mt-2 flex items-center space-x-1.5">
            <span className="text-xs font-bold text-navy-900">{status.verified_credentials}</span>
            <span className="text-xs text-slate-500">of {status.total_credentials} Active</span>
          </div>
        </div>

        <div className="rounded-lg border border-offwhite-200 bg-offwhite-50 p-3.5 transition-all duration-200 hover:border-slate-300 hover:bg-white">
          <div className="flex items-center space-x-2">
            <Database className="h-4 w-4 text-trust-600" />
            <span className="text-xs font-semibold text-navy-900">Encrypted Locker</span>
          </div>
          <div className="mt-2 flex items-center space-x-1.5">
            <span className="text-xs font-bold text-navy-900">{status.vault_items_count}</span>
            <span className="text-xs text-slate-500">Items Guarded</span>
          </div>
        </div>
      </div>
    </div>
  );
};
