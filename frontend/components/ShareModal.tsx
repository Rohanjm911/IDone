"use client";

import React, { useState } from "react";
import { X, Share2, Check, Copy, Shield, ShieldCheck } from "lucide-react";
import { Credential, shareCredential } from "@/lib/api";

interface ShareModalProps {
  credential: Credential;
  onClose: () => void;
}

export const ShareModal: React.FC<ShareModalProps> = ({ credential, onClose }) => {
  const [recipientEmail, setRecipientEmail] = useState("");
  const [includePersonal, setIncludePersonal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [shareResult, setShareResult] = useState<{
    share_token: string;
    recipient_email: string;
    shared_at: string;
  } | null>(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");

  // Extract available claims from raw JSON
  let availableFields: string[] = [];
  try {
    const raw = JSON.parse(credential.raw_credential_json);
    const subject = raw.credentialSubject || {};
    availableFields = Object.keys(subject).filter((k) => k !== "id");
  } catch {
    availableFields = ["title", "gradeOrLevel", "licenseNumber"];
  }

  const [selectedFields, setSelectedFields] = useState<string[]>(availableFields);

  const toggleField = (field: string) => {
    if (selectedFields.includes(field)) {
      setSelectedFields(selectedFields.filter((f) => f !== field));
    } else {
      setSelectedFields([...selectedFields, field]);
    }
  };

  const handleShare = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!recipientEmail) {
      setError("Please provide a valid verifier email.");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const res = await shareCredential(credential.id, {
        recipient_email: recipientEmail,
        shared_fields: selectedFields,
        include_personal_info: includePersonal,
      });
      setShareResult(res);
    } catch (err: any) {
      setError(err.message || "Failed to generate selective presentation.");
    } finally {
      setSubmitting(false);
    }
  };

  const copyToken = () => {
    if (shareResult) {
      navigator.clipboard.writeText(shareResult.share_token);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xl p-4 animate-fade-in">
      <div className="apple-glass-card relative w-full max-w-lg p-6 md:p-7 shadow-2xl animate-scale-in border border-black/[0.08] dark:border-white/[0.1] overflow-hidden">
        {/* Top Rainbow Accent Ribbon */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#00C7BE] via-[#0071E3] to-[#AF52DE]"></div>

        <div className="flex items-center justify-between pb-4 border-b border-black/[0.05] dark:border-white/[0.07]">
          <div className="flex items-center space-x-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-tr from-[#00C7BE] to-[#64D2FF] text-white shadow-xs">
              <Share2 className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-neutral-900 dark:text-white">Selective Credential Disclosure</h3>
              <p className="text-[10px] text-neutral-500 dark:text-neutral-400">Zero-knowledge attribute presentation</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="inline-flex h-7 w-7 items-center justify-center rounded-full text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-black/[0.05] dark:hover:bg-white/[0.1] transition-all"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {!shareResult ? (
          <form onSubmit={handleShare} className="mt-4 space-y-4">
            <div className="rounded-2xl bg-black/[0.02] dark:bg-white/[0.03] p-3 border border-black/[0.04] dark:border-white/[0.06]">
              <p className="text-[10px] uppercase font-bold text-neutral-400 dark:text-neutral-500">
                Source Verifiable Credential
              </p>
              <p className="text-xs font-bold text-neutral-900 dark:text-white mt-0.5">{credential.title}</p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                Recipient / Verifier Email
              </label>
              <input
                type="email"
                required
                value={recipientEmail}
                onChange={(e) => setRecipientEmail(e.target.value)}
                placeholder="verifier@organization.com"
                className="w-full rounded-xl border border-black/[0.1] dark:border-white/[0.12] bg-black/[0.02] dark:bg-white/[0.04] px-3.5 py-2 text-xs text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#0071E3]/40 focus:border-[#0071E3] transition-all"
              />
            </div>

            {/* Selectable Claims */}
            <div>
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5">
                Claims to Disclose (Zero-Knowledge Selection)
              </label>
              <div className="space-y-1.5 rounded-2xl border border-black/[0.06] dark:border-white/[0.08] bg-black/[0.02] dark:bg-white/[0.03] p-3 max-h-40 overflow-y-auto">
                {availableFields.map((field) => (
                  <label
                    key={field}
                    className="flex items-center space-x-2.5 text-xs text-neutral-800 dark:text-neutral-200 cursor-pointer p-1.5 rounded-lg hover:bg-black/[0.03] dark:hover:bg-white/[0.05] transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={selectedFields.includes(field)}
                      onChange={() => toggleField(field)}
                      className="rounded-md border-black/[0.15] dark:border-white/[0.2] text-[#0071E3] focus:ring-[#0071E3] h-4 w-4"
                    />
                    <span className="font-mono text-xs font-medium">{field}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Privacy Redaction Toggle */}
            <div className="rounded-2xl border border-black/[0.06] dark:border-white/[0.08] p-3.5 bg-black/[0.02] dark:bg-white/[0.03]">
              <label className="flex items-center justify-between cursor-pointer">
                <div>
                  <span className="text-xs font-bold text-neutral-900 dark:text-white block">
                    Redact Sensitive PII
                  </span>
                  <span className="text-[11px] text-neutral-500 dark:text-neutral-400">
                    Omit national ID, SSN, and birth date from proof
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={!includePersonal}
                  onChange={(e) => setIncludePersonal(!e.target.checked)}
                  className="rounded-md border-black/[0.15] dark:border-white/[0.2] text-[#34C759] focus:ring-[#34C759] h-4 w-4"
                />
              </label>
            </div>

            {error && (
              <div className="text-xs font-semibold text-[#FF3B30] dark:text-[#FF453A] bg-[#FF3B30]/10 p-2.5 rounded-xl border border-[#FF3B30]/20">
                {error}
              </div>
            )}

            <div className="flex justify-end space-x-2.5 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="apple-btn-secondary px-4 py-2 text-xs"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="apple-btn-primary px-5 py-2 text-xs shadow-xs disabled:opacity-50"
              >
                {submitting ? "Generating Proof..." : "Generate Shared Proof"}
              </button>
            </div>
          </form>
        ) : (
          <div className="mt-4 space-y-4">
            <div className="rounded-2xl bg-emerald-500/10 p-5 border border-emerald-500/20 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-[#34C759] to-[#30D158] text-white mx-auto mb-2 shadow-xs">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <h4 className="text-sm font-bold text-emerald-800 dark:text-emerald-300">
                Verifiable Presentation Compiled
              </h4>
              <p className="text-xs text-emerald-700 dark:text-emerald-400 mt-0.5">
                Authorized for {shareResult.recipient_email}
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-500 dark:text-neutral-400 mb-1">
                Presentation Verification Token
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  readOnly
                  value={shareResult.share_token}
                  className="w-full rounded-xl border border-black/[0.08] dark:border-white/[0.1] bg-black/[0.02] dark:bg-white/[0.04] px-3.5 py-2 font-mono text-xs text-neutral-900 dark:text-white"
                />
                <button
                  onClick={copyToken}
                  className="apple-btn-secondary inline-flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl"
                  title="Copy Token"
                >
                  {copied ? (
                    <Check className="h-4 w-4 text-[#34C759] dark:text-[#30D158]" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={onClose}
                className="apple-btn-primary px-6 py-2 text-xs shadow-xs"
              >
                Done
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
