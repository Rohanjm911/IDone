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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy-900/60 p-4 animate-fade-in">
      <div className="relative w-full max-w-lg rounded-xl bg-white p-6 shadow-modal border border-offwhite-200 animate-scale-in">
        <div className="flex items-center justify-between pb-3 border-b border-offwhite-200">
          <div className="flex items-center space-x-2">
            <Share2 className="h-4 w-4 text-trust-600" />
            <h3 className="text-sm font-bold text-navy-900">Selective Credential Disclosure</h3>
          </div>
          <button
            onClick={onClose}
            className="btn-press rounded p-1 text-slate-400 hover:bg-offwhite-100 hover:text-navy-900"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {!shareResult ? (
          <form onSubmit={handleShare} className="mt-4 space-y-4">
            <div>
              <p className="text-xs text-slate-500">
                You are preparing a selective disclosure proof for:
              </p>
              <p className="text-sm font-bold text-navy-900 mt-0.5">{credential.title}</p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-navy-900 mb-1">
                Verifier Email
              </label>
              <input
                type="email"
                required
                value={recipientEmail}
                onChange={(e) => setRecipientEmail(e.target.value)}
                placeholder="verifier@organization.com"
                className="w-full rounded-lg border border-offwhite-200 px-3 py-2 text-xs text-navy-900 focus:border-trust-600 focus:outline-none"
              />
            </div>

            {/* Selectable Claims */}
            <div>
              <label className="block text-xs font-semibold text-navy-900 mb-1.5">
                Claims to Disclose (Selective Disclosure)
              </label>
              <div className="space-y-1.5 rounded-lg border border-offwhite-200 bg-offwhite-50 p-3 max-h-40 overflow-y-auto">
                {availableFields.map((field) => (
                  <label
                    key={field}
                    className="flex items-center space-x-2 text-xs text-navy-900 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={selectedFields.includes(field)}
                      onChange={() => toggleField(field)}
                      className="rounded border-offwhite-200 text-trust-600 focus:ring-trust-600"
                    />
                    <span className="font-mono text-xs">{field}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Privacy Redaction Toggle */}
            <div className="rounded-lg border border-offwhite-200 p-3 bg-white">
              <label className="flex items-center justify-between cursor-pointer">
                <div>
                  <span className="text-xs font-semibold text-navy-900 block">
                    Redact Sensitive PII
                  </span>
                  <span className="text-[11px] text-slate-500">
                    Omit national ID, SSN, and birth date from proof
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={!includePersonal}
                  onChange={(e) => setIncludePersonal(!e.target.checked)}
                  className="rounded border-offwhite-200 text-trust-600 focus:ring-trust-600 h-4 w-4"
                />
              </label>
            </div>

            {error && <div className="text-xs font-semibold text-alert-600">{error}</div>}

            <div className="flex justify-end space-x-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg border border-offwhite-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-offwhite-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="rounded-lg bg-trust-600 px-4 py-2 text-xs font-semibold text-white hover:bg-trust-700 disabled:opacity-50 transition-colors"
              >
                {submitting ? "Generating Proof..." : "Generate Shared Proof"}
              </button>
            </div>
          </form>
        ) : (
          <div className="mt-4 space-y-4">
            <div className="rounded-lg bg-success-50 p-4 border border-success-100 text-center">
              <ShieldCheck className="h-8 w-8 text-success-600 mx-auto mb-2" />
              <h4 className="text-sm font-bold text-success-800">
                Verifiable Presentation Compiled
              </h4>
              <p className="text-xs text-success-700 mt-1">
                Authorized for {shareResult.recipient_email}
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">
                Presentation Verification Token
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  readOnly
                  value={shareResult.share_token}
                  className="w-full rounded-lg border border-offwhite-200 bg-offwhite-50 px-3 py-2 font-mono text-xs text-navy-900"
                />
                <button
                  onClick={copyToken}
                  className="inline-flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg border border-offwhite-200 bg-white hover:bg-offwhite-100 transition-colors"
                  title="Copy Token"
                >
                  {copied ? (
                    <Check className="h-4 w-4 text-success-600" />
                  ) : (
                    <Copy className="h-4 w-4 text-slate-600" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={onClose}
                className="rounded-lg bg-navy-900 px-4 py-2 text-xs font-semibold text-white hover:bg-navy-800"
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
