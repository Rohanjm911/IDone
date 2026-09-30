"use client";

import React from "react";
import { CheckCircle2, XCircle, AlertTriangle, ShieldCheck, Hash, Calendar, User } from "lucide-react";
import { VerificationResult } from "@/lib/api";

interface VerificationResultCardProps {
  result: VerificationResult;
}

export const VerificationResultCard: React.FC<VerificationResultCardProps> = ({ result }) => {
  const [copiedReport, setCopiedReport] = React.useState(false);
  const isValid = result.is_valid;
  const isRevoked = result.status === "REVOKED";

  const copyReport = () => {
    const report = `IDONE VERIFICATION REPORT
Status: ${result.status}
Subject: ${result.holder_did}
Issuer: ${result.issuer_name} (${result.issuer_did})
Checks Passed: ${result.checks.filter((c) => c.passed).length}/${result.checks.length}
Timestamp: ${new Date().toUTCString()}`;
    navigator.clipboard.writeText(report);
    setCopiedReport(true);
    setTimeout(() => setCopiedReport(false), 2000);
  };

  return (
    <div className="apple-card p-6 md:p-8 animate-fade-slide-up relative overflow-hidden">
      {/* Banner */}
      <div
        className={`animate-scale-in rounded-2xl p-5 border flex flex-col sm:flex-row sm:items-start justify-between gap-4 ${
          isValid
            ? "bg-emerald-500/[0.08] border-emerald-500/25 text-emerald-950 dark:text-emerald-200"
            : isRevoked
            ? "bg-rose-500/[0.08] border-rose-500/25 text-rose-950 dark:text-rose-200"
            : "bg-amber-500/[0.08] border-amber-500/25 text-amber-950 dark:text-amber-200"
        }`}
      >
        <div className="flex items-start space-x-3.5">
          <div className="flex-shrink-0 mt-0.5">
            {isValid ? (
              <CheckCircle2 className="h-7 w-7 text-[#34C759] dark:text-[#30D158] animate-pop" />
            ) : isRevoked ? (
              <XCircle className="h-7 w-7 text-[#FF3B30] dark:text-[#FF453A] animate-pop" />
            ) : (
              <AlertTriangle className="h-7 w-7 text-[#FF9500] dark:text-[#FF9F0A] animate-pop" />
            )}
          </div>

          <div>
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-bold uppercase tracking-wider">
                {isValid ? "Cryptographic Verification Succeeded" : "Verification Invalidation Detected"}
              </span>
              <span
                className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold shadow-xs ${
                  isValid
                    ? "bg-[#34C759] text-white"
                    : isRevoked
                    ? "bg-[#FF3B30] text-white"
                    : "bg-[#FF9500] text-white"
                }`}
              >
                {isValid && <span className="h-1.5 w-1.5 rounded-full bg-white mr-1.5 animate-pulse"></span>}
                {result.status}
              </span>
            </div>

            <h3 className="text-lg font-bold text-neutral-900 dark:text-white mt-1">
              {result.title || result.type_name || "Verifiable Credential"}
            </h3>

            <p className="text-xs mt-1 text-neutral-600 dark:text-neutral-300 leading-relaxed">
              {isValid
                ? "All Ed25519 digital signatures, canonical hashes (RFC 8785), and on-chain status registries verified successfully."
                : result.error_message || "Cryptographic proof validation failed."}
            </p>
          </div>
        </div>

        <button
          onClick={copyReport}
          className="apple-btn-secondary px-3.5 py-1.5 text-xs self-start"
        >
          {copiedReport ? "Report Copied!" : "Copy Report"}
        </button>
      </div>

      {/* Credential Metadata */}
      <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
        <div className="rounded-2xl border border-black/[0.06] dark:border-white/[0.08] bg-black/[0.02] dark:bg-white/[0.03] p-3.5 transition-all">
          <span className="text-[10px] uppercase font-bold text-neutral-400 dark:text-neutral-500 block mb-0.5">Issuer Authority</span>
          <span className="font-semibold text-neutral-900 dark:text-white flex items-center gap-1.5">
            <ShieldCheck className="h-3.5 w-3.5 text-[#0071E3] dark:text-[#64D2FF]" />
            {result.issuer_name || "Accredited Issuer"}
          </span>
          <span className="font-mono text-[10px] text-neutral-500 dark:text-neutral-400 truncate block mt-0.5">
            {result.issuer_did}
          </span>
        </div>

        <div className="rounded-2xl border border-black/[0.06] dark:border-white/[0.08] bg-black/[0.02] dark:bg-white/[0.03] p-3.5 transition-all">
          <span className="text-[10px] uppercase font-bold text-neutral-400 dark:text-neutral-500 block mb-0.5">Subject Identity</span>
          <span className="font-mono text-xs font-semibold text-neutral-900 dark:text-white truncate block">
            {result.holder_did || "Subject Identity"}
          </span>
        </div>

        {result.issuance_date && (
          <div className="rounded-2xl border border-black/[0.06] dark:border-white/[0.08] bg-black/[0.02] dark:bg-white/[0.03] p-3.5 transition-all">
            <span className="text-[10px] uppercase font-bold text-neutral-400 dark:text-neutral-500 block mb-0.5">Issuance Timestamp</span>
            <span className="font-mono text-xs text-neutral-800 dark:text-neutral-200">
              {new Date(result.issuance_date).toUTCString()}
            </span>
          </div>
        )}

        {result.blockchain_hash && (
          <div className="rounded-2xl border border-black/[0.06] dark:border-white/[0.08] bg-black/[0.02] dark:bg-white/[0.03] p-3.5 transition-all">
            <span className="text-[10px] uppercase font-bold text-neutral-400 dark:text-neutral-500 block mb-0.5">Blockchain Anchor Hash</span>
            <span className="font-mono text-[10px] text-neutral-700 dark:text-neutral-300 truncate block">
              0x{result.blockchain_hash}
            </span>
          </div>
        )}
      </div>

      {/* Verification Steps Breakdown */}
      <div className="mt-6">
        <h4 className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500 mb-3">
          Multi-Step Cryptographic Engine Audit
        </h4>

        <div className="space-y-2">
          {result.checks.map((check, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between rounded-2xl border border-black/[0.06] dark:border-white/[0.08] p-3.5 text-xs bg-black/[0.015] dark:bg-white/[0.02] hover:bg-black/[0.03] dark:hover:bg-white/[0.04] transition-all"
            >
              <div className="flex items-center space-x-3">
                {check.passed ? (
                  <CheckCircle2 className="h-4 w-4 text-[#34C759] dark:text-[#30D158] flex-shrink-0 animate-pop" />
                ) : (
                  <XCircle className="h-4 w-4 text-[#FF3B30] dark:text-[#FF453A] flex-shrink-0 animate-pop" />
                )}
                <div>
                  <span className="font-bold text-neutral-900 dark:text-white block">{check.name}</span>
                  <span className="text-[11px] text-neutral-500 dark:text-neutral-400">{check.details}</span>
                </div>
              </div>

              <span
                className={`text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full border ${
                  check.passed
                    ? "bg-[#34C759]/10 text-[#28A745] dark:text-[#30D158] border-[#34C759]/20"
                    : "bg-[#FF3B30]/10 text-[#DC2626] dark:text-[#FF453A] border-[#FF3B30]/20"
                }`}
              >
                {check.passed ? "Passed" : "Failed"}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
