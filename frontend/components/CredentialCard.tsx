"use client";

import React, { useState } from "react";
import { Award, CheckCircle, AlertOctagon, Share2, Eye, Trash2, ShieldCheck, X } from "lucide-react";
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

  const statusBadge = isRevoked ? (
    <span className="inline-flex items-center rounded-full bg-alert-50 px-2.5 py-0.5 text-xs font-semibold text-alert-700 border border-alert-100">
      <AlertOctagon className="mr-1 h-3 w-3 text-alert-600" />
      Revoked
    </span>
  ) : isExpired ? (
    <span className="inline-flex items-center rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-semibold text-amber-700 border border-amber-100">
      Expired
    </span>
  ) : (
    <span className="inline-flex items-center rounded-full bg-success-50 px-2.5 py-0.5 text-xs font-semibold text-success-700 border border-success-100">
      <span className="h-1.5 w-1.5 rounded-full bg-success-600 mr-1.5 animate-calm-pulse"></span>
      <CheckCircle className="mr-1 h-3 w-3 text-success-600" />
      Cryptographically Valid
    </span>
  );

  return (
    <div className="card-interactive animate-fade-slide-up rounded-xl border border-offwhite-200 bg-white p-5 shadow-card hover:shadow-card-hover hover:border-slate-300">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center space-x-3">
          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-navy-900 text-white shadow-xs">
            <Award className="h-5 w-5 text-trust-600" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                {credential.type_name}
              </span>
            </div>
            <h3 className="text-base font-bold text-navy-900 mt-0.5 leading-snug">
              {credential.title}
            </h3>
          </div>
        </div>

        <div>{statusBadge}</div>
      </div>

      {/* Details */}
      <div className="mt-4 rounded-lg bg-offwhite-50 p-3 text-xs space-y-1.5 border border-offwhite-200">
        <div className="flex justify-between">
          <span className="text-slate-500">Issuer:</span>
          <span className="font-semibold text-navy-900 flex items-center gap-1">
            <ShieldCheck className="h-3.5 w-3.5 text-trust-600" />
            {credential.issuer_name}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-500">Issued:</span>
          <span className="font-mono text-slate-700">
            {new Date(credential.issuance_date).toLocaleDateString()}
          </span>
        </div>
        {credential.expiration_date && (
          <div className="flex justify-between">
            <span className="text-slate-500">Expires:</span>
            <span className="font-mono text-slate-700">
              {new Date(credential.expiration_date).toLocaleDateString()}
            </span>
          </div>
        )}
        {credential.blockchain_hash && (
          <div className="flex justify-between items-center pt-1 border-t border-offwhite-200">
            <span className="text-slate-500">Anchor Hash:</span>
            <span className="font-mono text-[10px] text-slate-600 truncate max-w-[170px]">
              0x{credential.blockchain_hash}
            </span>
          </div>
        )}
        {isRevoked && credential.revocation_reason && (
          <div className="pt-1 text-alert-700 font-medium">
            Reason: {credential.revocation_reason}
          </div>
        )}
      </div>

      {/* Action Toolbar */}
      <div className="mt-4 flex items-center justify-between pt-3 border-t border-offwhite-200">
        <button
          onClick={() => setShowJson(true)}
          className="btn-press inline-flex items-center space-x-1 text-xs font-semibold text-slate-600 hover:text-navy-900"
        >
          <Eye className="h-3.5 w-3.5" />
          <span>JSON-LD</span>
        </button>

        <div className="flex items-center space-x-2">
          {!isRevoked && (
            <>
              <button
                onClick={() => onShare(credential)}
                className="btn-press inline-flex items-center space-x-1.5 rounded-lg border border-offwhite-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-navy-900 hover:bg-offwhite-100 hover:border-slate-300"
              >
                <Share2 className="h-3.5 w-3.5 text-trust-600" />
                <span>Share</span>
              </button>

              <button
                onClick={() => onRevoke(credential)}
                className="btn-press inline-flex items-center rounded-lg border border-offwhite-200 bg-white px-2 py-1.5 text-xs font-semibold text-alert-600 hover:bg-alert-50 hover:border-alert-100"
                title="Revoke Credential"
              >
                Revoke
              </button>
            </>
          )}

          <button
            onClick={() => onDelete(credential.id)}
            className="btn-press inline-flex items-center p-1.5 rounded text-slate-400 hover:text-alert-600 hover:bg-offwhite-100"
            title="Delete from local vault"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Raw JSON-LD Modal */}
      {showJson && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy-900/60 p-4 animate-fade-in">
          <div className="relative w-full max-w-2xl rounded-xl bg-white p-6 shadow-modal border border-offwhite-200 animate-scale-in">
            <div className="flex items-center justify-between pb-3 border-b border-offwhite-200">
              <div>
                <h4 className="text-sm font-bold text-navy-900">
                  W3C Verifiable Credential Payload
                </h4>
                <p className="text-[11px] text-slate-500">RFC 8785 Canonical JSON Signature Vector</p>
              </div>
              <button
                onClick={() => setShowJson(false)}
                className="btn-press rounded p-1 text-slate-400 hover:bg-offwhite-100 hover:text-navy-900"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <pre className="mt-4 max-h-96 overflow-auto rounded-lg bg-navy-900 p-4 font-mono text-xs text-offwhite-100 border border-navy-800">
              {JSON.stringify(JSON.parse(credential.raw_credential_json), null, 2)}
            </pre>
            <div className="mt-4 flex items-center justify-between">
              <button
                onClick={copyJson}
                className="btn-press inline-flex items-center space-x-1.5 rounded-lg border border-offwhite-200 bg-offwhite-50 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-offwhite-100 hover:text-navy-900"
              >
                <span>{copiedJson ? "Copied JSON!" : "Copy Payload"}</span>
              </button>
              <button
                onClick={() => setShowJson(false)}
                className="btn-press rounded-lg bg-navy-900 px-4 py-2 text-xs font-semibold text-white hover:bg-navy-800"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
