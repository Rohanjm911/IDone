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
    <div className="animate-fade-slide-up rounded-xl border border-offwhite-200 bg-white p-6 shadow-card">
      {/* Banner */}
      <div
        className={`animate-scale-in rounded-xl p-5 border flex items-start justify-between space-x-4 ${
          isValid
            ? "bg-success-50 border-success-100 text-success-900"
            : isRevoked
            ? "bg-alert-50 border-alert-100 text-alert-900"
            : "bg-amber-50 border-amber-100 text-amber-900"
        }`}
      >
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0 mt-0.5">
            {isValid ? (
              <CheckCircle2 className="h-7 w-7 text-success-600 animate-pop" />
            ) : isRevoked ? (
              <XCircle className="h-7 w-7 text-alert-600 animate-pop" />
            ) : (
              <AlertTriangle className="h-7 w-7 text-amber-600 animate-pop" />
            )}
          </div>

          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold uppercase tracking-wider">
                {isValid ? "Cryptographic Verification Succeeded" : "Verification Invalidation Detected"}
              </span>
              <span
                className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold ${
                  isValid
                    ? "bg-success-600 text-white"
                    : isRevoked
                    ? "bg-alert-600 text-white"
                    : "bg-amber-600 text-white"
                }`}
              >
                {isValid && <span className="h-1.5 w-1.5 rounded-full bg-white mr-1 animate-calm-pulse"></span>}
                {result.status}
              </span>
            </div>

            <h3 className="text-lg font-extrabold mt-1">
              {result.title || result.type_name || "Verifiable Credential"}
            </h3>

            <p className="text-xs mt-1 opacity-90">
              {isValid
                ? "All Ed25519 digital signatures, canonical hashes, and on-chain status registries verified successfully."
                : result.error_message || "Cryptographic proof validation failed."}
            </p>
          </div>
        </div>

        <button
          onClick={copyReport}
          className="btn-press flex-shrink-0 rounded-lg border border-offwhite-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-offwhite-100 shadow-xs"
        >
          {copiedReport ? "Report Copied!" : "Copy Report"}
        </button>
      </div>

      {/* Credential Metadata */}
      <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
        <div className="rounded-lg border border-offwhite-200 bg-offwhite-50 p-3 transition-colors hover:border-slate-300">
          <span className="text-slate-500 block mb-0.5">Issuer Authority</span>
          <span className="font-bold text-navy-900 flex items-center gap-1">
            <ShieldCheck className="h-3.5 w-3.5 text-trust-600" />
            {result.issuer_name || "Accredited Issuer"}
          </span>
          <span className="font-mono text-[10px] text-slate-500 truncate block mt-0.5">
            {result.issuer_did}
          </span>
        </div>

        <div className="rounded-lg border border-offwhite-200 bg-offwhite-50 p-3 transition-colors hover:border-slate-300">
          <span className="text-slate-500 block mb-0.5">Subject Identity</span>
          <span className="font-mono text-xs font-semibold text-navy-900 truncate block">
            {result.holder_did || "Subject Identity"}
          </span>
        </div>

        {result.issuance_date && (
          <div className="rounded-lg border border-offwhite-200 bg-offwhite-50 p-3 transition-colors hover:border-slate-300">
            <span className="text-slate-500 block mb-0.5">Issuance Timestamp</span>
            <span className="font-mono text-xs text-navy-900">
              {new Date(result.issuance_date).toUTCString()}
            </span>
          </div>
        )}

        {result.blockchain_hash && (
          <div className="rounded-lg border border-offwhite-200 bg-offwhite-50 p-3 transition-colors hover:border-slate-300">
            <span className="text-slate-500 block mb-0.5">Blockchain Anchor Hash</span>
            <span className="font-mono text-[10px] text-slate-700 truncate block">
              0x{result.blockchain_hash}
            </span>
          </div>
        )}
      </div>

      {/* Verification Steps Breakdown with Staggered Animations */}
      <div className="mt-6">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
          Multi-Step Verification Engine Checklist
        </h4>

        <div className="space-y-2">
          {result.checks.map((check, idx) => (
            <div
              key={idx}
              style={{ animationDelay: `${idx * 75}ms` }}
              className="animate-fade-slide-up flex items-center justify-between rounded-lg border border-offwhite-200 p-3 text-xs bg-white transition-all duration-150 hover:border-slate-300 shadow-xs"
            >
              <div className="flex items-center space-x-2.5">
                {check.passed ? (
                  <CheckCircle2 className="h-4 w-4 text-success-600 flex-shrink-0 animate-pop" />
                ) : (
                  <XCircle className="h-4 w-4 text-alert-600 flex-shrink-0 animate-pop" />
                )}
                <div>
                  <span className="font-semibold text-navy-900 block">{check.name}</span>
                  <span className="text-[11px] text-slate-500">{check.details}</span>
                </div>
              </div>

              <span
                className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                  check.passed
                    ? "bg-success-50 text-success-700 border border-success-100"
                    : "bg-alert-50 text-alert-700 border border-alert-100"
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
