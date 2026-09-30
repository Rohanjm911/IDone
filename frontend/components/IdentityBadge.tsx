"use client";

import React, { useState } from "react";
import { Fingerprint, Copy, Check, ShieldCheck, KeyRound, Code2 } from "lucide-react";
import { Identity } from "@/lib/api";

interface IdentityBadgeProps {
  identity: Identity;
  onRotateKey?: () => void;
  isRotating?: boolean;
}

export const IdentityBadge: React.FC<IdentityBadgeProps> = ({
  identity,
  onRotateKey,
  isRotating = false,
}) => {
  const [copied, setCopied] = useState(false);
  const [showDoc, setShowDoc] = useState(false);

  const copyDid = () => {
    navigator.clipboard.writeText(identity.did);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="apple-card-holo p-6 relative overflow-hidden bg-gradient-to-br from-white via-white to-blue-500/[0.04] dark:from-[#161618] dark:via-[#161618] dark:to-blue-900/15">
      {/* Subtle Ambient Color Glow */}
      <div className="absolute -left-12 -top-12 h-44 w-44 rounded-full bg-gradient-to-br from-[#AF52DE]/15 to-[#0071E3]/15 blur-2xl pointer-events-none"></div>

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5 relative z-10">
        {/* Left: Identity Info */}
        <div className="flex items-start space-x-4">
          <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-tr from-[#0071E3] to-[#5AC8FA] dark:from-[#0A84FF] dark:to-[#64D2FF] text-white shadow-md shadow-blue-500/20">
            <Fingerprint className="h-6 w-6" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
                W3C Decentralized Identifier
              </span>
              <span
                className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${
                  identity.status === "Active"
                    ? "bg-[#34C759]/10 text-[#28A745] dark:text-[#30D158] border border-[#34C759]/20"
                    : "bg-[#FF3B30]/10 text-[#DC2626] dark:text-[#FF453A] border border-[#FF3B30]/20"
                }`}
              >
                <span className="h-1.5 w-1.5 rounded-full bg-[#34C759] mr-1.5"></span>
                {identity.status}
              </span>
            </div>

            <div className="flex items-center space-x-2.5">
              <code className="font-mono text-xs md:text-sm font-medium text-neutral-900 dark:text-white break-all select-all">
                {identity.did}
              </code>
              <div className="relative">
                <button
                  onClick={copyDid}
                  className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-black/[0.06] dark:border-white/[0.08] bg-black/[0.03] dark:bg-white/[0.06] text-neutral-600 dark:text-neutral-300 hover:bg-black/[0.08] dark:hover:bg-white/[0.12] transition-all active:scale-95"
                  title="Copy DID"
                  aria-label="Copy full DID"
                >
                  {copied ? (
                    <Check className="h-3.5 w-3.5 text-[#34C759] dark:text-[#30D158]" />
                  ) : (
                    <Copy className="h-3.5 w-3.5" />
                  )}
                </button>
                {copied && (
                  <span className="absolute -top-7 left-1/2 -translate-x-1/2 rounded-full bg-neutral-900 dark:bg-white px-2.5 py-0.5 text-[10px] font-medium text-white dark:text-neutral-900 shadow-sm whitespace-nowrap">
                    Copied
                  </span>
                )}
              </div>
            </div>

            <p className="text-xs text-neutral-500 dark:text-neutral-400 flex items-center gap-1.5 pt-0.5">
              <ShieldCheck className="h-3.5 w-3.5 text-[#0071E3] dark:text-[#0A84FF] inline" />
              <span>Verification Method:</span>
              <span className="font-mono text-neutral-700 dark:text-neutral-300">{identity.verification_method}</span>
            </p>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center space-x-2.5 flex-shrink-0">
          <button
            onClick={() => setShowDoc(!showDoc)}
            className="apple-btn-secondary px-4 py-2 text-xs"
          >
            <Code2 className="h-3.5 w-3.5 mr-1.5 opacity-70" />
            <span>{showDoc ? "Hide JSON-LD" : "Inspect DID Doc"}</span>
          </button>

          {onRotateKey && (
            <button
              onClick={onRotateKey}
              disabled={isRotating}
              className="apple-btn-secondary px-4 py-2 text-xs text-[#0071E3] dark:text-[#0A84FF] hover:bg-[#0071E3]/10 dark:hover:bg-[#0A84FF]/10 disabled:opacity-50"
            >
              <KeyRound className={`h-3.5 w-3.5 mr-1.5 ${isRotating ? "animate-spin" : ""}`} />
              <span>{isRotating ? "Rotating..." : "Rotate Keypair"}</span>
            </button>
          )}
        </div>
      </div>

      {/* Expandable W3C JSON-LD Document Drawer */}
      {showDoc && (
        <div className="mt-5 rounded-2xl border border-black/[0.06] dark:border-white/[0.08] bg-black/[0.02] dark:bg-black/60 p-4 transition-all duration-300">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
              W3C DID Document (Resolved)
            </span>
          </div>
          <pre className="font-mono text-[11px] leading-relaxed text-neutral-800 dark:text-neutral-200 overflow-x-auto p-2">
            {JSON.stringify(
              identity.raw_did_document
                ? (typeof identity.raw_did_document === "string" ? JSON.parse(identity.raw_did_document) : identity.raw_did_document)
                : {
                    "@context": [
                      "https://www.w3.org/ns/did/v1",
                      "https://w3id.org/security/suites/ed25519-2020/v1"
                    ],
                    id: identity.did,
                    verificationMethod: [
                      {
                        id: `${identity.did}#${identity.verification_method || "key-1"}`,
                        type: "Ed25519VerificationKey2020",
                        controller: identity.did,
                        publicKeyHex: identity.public_key_hex
                      }
                    ],
                    authentication: [`${identity.did}#${identity.verification_method || "key-1"}`],
                    assertionMethod: [`${identity.did}#${identity.verification_method || "key-1"}`]
                  },
              null,
              2
            )}
          </pre>
        </div>
      )}
    </div>
  );
};
