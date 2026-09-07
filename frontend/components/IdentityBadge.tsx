"use client";

import React, { useState } from "react";
import { Fingerprint, Copy, Check, ShieldCheck, KeyRound } from "lucide-react";
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
    <div className="card-interactive animate-fade-slide-up rounded-xl border border-offwhite-200 bg-white p-5 shadow-card hover:border-slate-300">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        {/* Identity Info */}
        <div className="flex items-start space-x-3.5">
          <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-navy-900 text-white shadow-xs">
            <Fingerprint className="h-6 w-6 text-trust-600" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Decentralized Identifier (DID)
              </span>
              <span
                className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                  identity.status === "Active"
                    ? "bg-success-50 text-success-700 border border-success-100"
                    : "bg-alert-50 text-alert-700 border border-alert-100"
                }`}
              >
                <span className="h-1.5 w-1.5 rounded-full bg-success-600 mr-1 animate-calm-pulse"></span>
                {identity.status}
              </span>
            </div>

            <div className="mt-1 flex items-center space-x-2">
              <code className="font-mono text-sm font-semibold text-navy-900 break-all select-all">
                {identity.did}
              </code>
              <div className="relative">
                <button
                  onClick={copyDid}
                  className="btn-press inline-flex h-7 w-7 flex-shrink-0 items-center justify-center rounded border border-offwhite-200 bg-offwhite-50 text-slate-600 hover:bg-offwhite-100 hover:text-navy-900"
                  title="Copy full DID"
                  aria-label="Copy full DID"
                >
                  {copied ? (
                    <Check className="h-3.5 w-3.5 text-success-600 animate-pop" />
                  ) : (
                    <Copy className="h-3.5 w-3.5" />
                  )}
                </button>
                {copied && (
                  <span className="absolute -top-7 left-1/2 -translate-x-1/2 rounded bg-navy-900 px-2 py-0.5 text-[10px] font-medium text-white shadow-sm animate-fade-slide-up whitespace-nowrap">
                    Copied!
                  </span>
                )}
              </div>
            </div>

            <p className="mt-1.5 text-xs text-slate-500 flex items-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5 text-trust-600 inline" />
              <span>Verification Method:</span>
              <span className="font-mono text-slate-600">{identity.verification_method}</span>
            </p>
          </div>
        </div>

        {/* Rotate Action & Spec Toggle */}
        <div className="flex items-center space-x-2 flex-shrink-0">
          <button
            onClick={() => setShowDoc(!showDoc)}
            className="btn-press inline-flex items-center space-x-1.5 rounded-lg border border-offwhite-200 bg-offwhite-50 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-offwhite-100 hover:text-navy-900"
          >
            <span>{showDoc ? "Hide Document" : "W3C Document"}</span>
          </button>

          {onRotateKey && (
            <button
              onClick={onRotateKey}
              disabled={isRotating}
              className="btn-press inline-flex items-center space-x-2 rounded-lg border border-offwhite-200 bg-white px-3.5 py-2 text-xs font-semibold text-navy-900 hover:bg-offwhite-100 hover:border-slate-300 disabled:opacity-50"
            >
              <KeyRound className={`h-4 w-4 text-trust-600 ${isRotating ? "animate-spin" : ""}`} />
              <span>{isRotating ? "Rotating Key..." : "Rotate Keypair"}</span>
            </button>
          )}
        </div>
      </div>

      {/* Expandable W3C Document Preview */}
      {showDoc && (
        <div className="mt-4 pt-4 border-t border-offwhite-200 animate-fade-slide-down">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Resolved JSON-LD DID Document (W3C Standard)
            </span>
            <span className="text-[10px] font-mono text-slate-400">Ed25519VerificationKey2020</span>
          </div>
          <pre className="rounded-lg bg-navy-900 p-3 font-mono text-[11px] text-offwhite-100 overflow-x-auto max-h-48 border border-navy-800">
            {JSON.stringify(
              {
                "@context": [
                  "https://www.w3.org/ns/did/v1",
                  "https://w3id.org/security/suites/ed25519-2020/v1"
                ],
                id: identity.did,
                verificationMethod: [
                  {
                    id: identity.verification_method,
                    type: "Ed25519VerificationKey2020",
                    controller: identity.did,
                    publicKeyMultibase: "z" + identity.public_key_hex.slice(0, 32) + "..."
                  }
                ],
                authentication: [identity.verification_method],
                assertionMethod: [identity.verification_method]
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
