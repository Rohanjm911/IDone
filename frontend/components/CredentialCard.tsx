"use client";

import React, { useState } from "react";
import { Award, CheckCircle, AlertOctagon, Share2, Eye, Trash2, ShieldCheck, X, Sparkles } from "lucide-react";
import { Credential } from "@/lib/api";

interface CredentialCardProps {
  credential: Credential;
  onShare: (credential: Credential) => void;
  onRevoke: (credential: Credential) => void;
  onDelete: (id: string) => void;
}

export const CredentialCard: React.FC<CredentialCardProps> = ({
  credential,
  onShare,
  onRevoke,
  onDelete,
}) => {
  const [showJson, setShowJson] = useState(false);
  const [copiedJson, setCopiedJson] = useState(false);

  const isRevoked = credential.status === "REVOKED";
  const isExpired = credential.status === "EXPIRED";

  const copyJson = () => {
    try {
      const formatted = JSON.stringify(JSON.parse(credential.raw_credential_json), null, 2);
      navigator.clipboard.writeText(formatted);
      setCopiedJson(true);
      setTimeout(() => setCopiedJson(false), 2000);
    } catch {
      navigator.clipboard.writeText(credential.raw_credential_json);
      setCopiedJson(true);
      setTimeout(() => setCopiedJson(false), 2000);
    }
  };

  // Color theme tailored by Credential Type
  const isUniversity = credential.type_name.toLowerCase().includes("university") || credential.type_name.toLowerCase().includes("degree");
  const isLicense = credential.type_name.toLowerCase().includes("license") || credential.type_name.toLowerCase().includes("certificate");
  const isSecurity = credential.type_name.toLowerCase().includes("security") || credential.type_name.toLowerCase().includes("clearance");

  const theme = isUniversity
    ? {
        accent: "from-[#0071E3] to-[#5AC8FA]",
        border: "border-blue-500/20 hover:border-blue-500/40",
        bgTint: "from-blue-500/[0.03] to-transparent",
        badge: "text-[#0071E3] dark:text-[#64D2FF]",
      }
    : isLicense
    ? {
        accent: "from-[#FF9500] to-[#FFCC00]",
        border: "border-amber-500/20 hover:border-amber-500/40",
        bgTint: "from-amber-500/[0.03] to-transparent",
        badge: "text-[#FF9500] dark:text-[#FF9F0A]",
      }
    : isSecurity
    ? {
        accent: "from-[#AF52DE] to-[#BF5AF2]",
        border: "border-purple-500/20 hover:border-purple-500/40",
        bgTint: "from-purple-500/[0.03] to-transparent",
        badge: "text-[#AF52DE] dark:text-[#BF5AF2]",
      }
    : {
        accent: "from-[#34C759] to-[#30D158]",
        border: "border-emerald-500/20 hover:border-emerald-500/40",
        bgTint: "from-emerald-500/[0.03] to-transparent",
        badge: "text-[#34C759] dark:text-[#30D158]",
      };

  const statusBadge = isRevoked ? (
    <span className="inline-flex items-center rounded-full bg-[#FF3B30]/10 px-2.5 py-0.5 text-[11px] font-semibold text-[#FF3B30] dark:text-[#FF453A] border border-[#FF3B30]/20">
      <AlertOctagon className="mr-1 h-3 w-3" />
      Revoked
    </span>
  ) : isExpired ? (
    <span className="inline-flex items-center rounded-full bg-[#FF9500]/10 px-2.5 py-0.5 text-[11px] font-semibold text-[#FF9500] dark:text-[#FF9F0A] border border-[#FF9500]/20">
      Expired
    </span>
  ) : (
    <span className="inline-flex items-center rounded-full bg-[#34C759]/10 px-2.5 py-0.5 text-[11px] font-semibold text-[#28A745] dark:text-[#30D158] border border-[#34C759]/25 shadow-xs">
      <span className="h-1.5 w-1.5 rounded-full bg-[#34C759] mr-1.5 shadow-[0_0_6px_#34C759]"></span>
      Valid Proof
    </span>
  );

  return (
    <div className={`apple-wallet-pass apple-card p-5 group flex flex-col justify-between border bg-gradient-to-b ${theme.border} ${theme.bgTint} relative overflow-hidden transition-all duration-300`}>
      {/* Top Gradient Accent Ribbon */}
      <div className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${theme.accent} opacity-90`}></div>

      <div>
        {/* Header with NFC wave indicator */}
        <div className="flex items-start justify-between gap-3 pt-1">
          <div className="flex items-center space-x-3">
            <div className={`flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-tr ${theme.accent} text-white shadow-sm shadow-blue-500/25 group-hover:scale-105 transition-transform`}>
              <Award className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className={`text-[10px] font-bold uppercase tracking-wider ${theme.badge}`}>
                  {credential.type_name}
                </span>
                <span className="text-[9px] font-mono text-neutral-400 dark:text-neutral-500">
                  PASS #{credential.id.slice(0, 6).toUpperCase()}
                </span>
              </div>
              <h3 className="text-base font-bold text-neutral-900 dark:text-white mt-0.5 leading-snug">
                {credential.title}
              </h3>
            </div>
          </div>
          <div className="flex flex-col items-end space-y-1">
            {statusBadge}
          </div>
        </div>

        {/* Apple Wallet Style Details Box */}
        <div className="mt-4 rounded-2xl bg-black/[0.02] dark:bg-white/[0.03] p-3.5 text-xs space-y-2 border border-black/[0.04] dark:border-white/[0.06]">
          <div className="flex justify-between items-center">
            <span className="text-neutral-500 dark:text-neutral-400 font-medium">Accredited Authority:</span>
            <span className="font-semibold text-neutral-900 dark:text-white flex items-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5 text-[#0071E3] dark:text-[#64D2FF]" />
              {credential.issuer_name}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-neutral-500 dark:text-neutral-400 font-medium">Issuance Date:</span>
            <span className="font-mono text-neutral-700 dark:text-neutral-300">
              {new Date(credential.issuance_date).toLocaleDateString(undefined, {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </span>
          </div>
          {credential.expiration_date && (
            <div className="flex justify-between items-center">
              <span className="text-neutral-500 dark:text-neutral-400 font-medium">Valid Until:</span>
              <span className="font-mono text-neutral-700 dark:text-neutral-300">
                {new Date(credential.expiration_date).toLocaleDateString(undefined, {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </span>
            </div>
          )}
          {credential.blockchain_hash && (
            <div className="flex justify-between items-center pt-1.5 border-t border-black/[0.04] dark:border-white/[0.06]">
              <span className="text-neutral-500 dark:text-neutral-400 font-medium">On-Chain Proof:</span>
              <span className="font-mono text-[10px] text-neutral-600 dark:text-neutral-300 truncate max-w-[160px]">
                0x{credential.blockchain_hash}
              </span>
            </div>
          )}
          {isRevoked && credential.revocation_reason && (
            <div className="pt-1 text-[#FF3B30] dark:text-[#FF453A] font-semibold text-[11px]">
              Revocation Reason: {credential.revocation_reason}
            </div>
          )}
        </div>

        {/* Apple Wallet Pass Barcode Strip Simulation */}
        <div className="mt-3.5 flex items-center justify-between px-1 text-[10px] font-mono text-neutral-400 dark:text-neutral-500 border-t border-dashed border-black/[0.08] dark:border-white/[0.1] pt-2.5">
          <span className="flex items-center gap-1.5">
            <span className="inline-block h-2 w-2 rounded-full bg-emerald-500"></span>
            <span>NFC SECURE ELEMENT</span>
          </span>
          <span className="tracking-widest opacity-80">||| | |||| | ||||</span>
        </div>
      </div>

      {/* Action Toolbar */}
      <div className="mt-5 flex items-center justify-between pt-3 border-t border-black/[0.04] dark:border-white/[0.06]">
        <button
          onClick={() => setShowJson(true)}
          className="apple-btn-secondary px-3 py-1.5 text-xs text-neutral-600 dark:text-neutral-300"
        >
          <Eye className="h-3.5 w-3.5 mr-1 opacity-70" />
          <span>JSON-LD</span>
        </button>

        <div className="flex items-center space-x-2">
          {!isRevoked && (
            <>
              <button
                onClick={() => onShare(credential)}
                className="apple-btn-secondary px-3 py-1.5 text-xs text-[#0071E3] dark:text-[#64D2FF] hover:bg-[#0071E3]/10"
              >
                <Share2 className="h-3.5 w-3.5 mr-1" />
                <span>Share</span>
              </button>

              <button
                onClick={() => onRevoke(credential)}
                className="apple-btn-secondary px-3 py-1.5 text-xs text-[#FF3B30] dark:text-[#FF453A] hover:bg-[#FF3B30]/10"
                title="Revoke Credential"
              >
                Revoke
              </button>
            </>
          )}

          <button
            onClick={() => onDelete(credential.id)}
            className="inline-flex h-7 w-7 items-center justify-center rounded-full text-neutral-400 hover:text-[#FF3B30] dark:hover:text-[#FF453A] hover:bg-black/[0.04] dark:hover:bg-white/[0.06] transition-colors"
            title="Delete from local vault"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Raw JSON-LD Modal */}
      {showJson && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-md p-4">
          <div className="apple-glass-card max-h-[85vh] w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col">
            <div className="flex items-center justify-between border-b border-black/[0.06] dark:border-white/[0.08] px-6 py-4">
              <div>
                <h4 className="text-base font-bold text-neutral-900 dark:text-white">
                  {credential.title} — W3C JSON-LD Proof
                </h4>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">
                  Cryptographically canonicalized JSON-LD under RFC 8785
                </p>
              </div>
              <button
                onClick={() => setShowJson(false)}
                className="inline-flex h-8 w-8 items-center justify-center rounded-full text-neutral-500 hover:bg-black/[0.05] dark:hover:bg-white/[0.1]"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 bg-black/[0.02] dark:bg-black/40">
              <pre className="font-mono text-xs text-neutral-800 dark:text-neutral-200 leading-relaxed whitespace-pre-wrap">
                {(() => {
                  try {
                    return JSON.stringify(JSON.parse(credential.raw_credential_json), null, 2);
                  } catch {
                    return credential.raw_credential_json;
                  }
                })()}
              </pre>
            </div>

            <div className="flex items-center justify-end space-x-3 border-t border-black/[0.06] dark:border-white/[0.08] px-6 py-3.5 bg-white/50 dark:bg-black/20">
              <button
                onClick={copyJson}
                className="apple-btn-secondary px-4 py-2 text-xs"
              >
                {copiedJson ? "Copied to Clipboard!" : "Copy JSON"}
              </button>
              <button
                onClick={() => setShowJson(false)}
                className="apple-btn-primary px-5 py-2 text-xs"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
