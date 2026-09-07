"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Award,
  Plus,
  FileDown,
  Filter,
  ShieldCheck,
  X,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Sidebar } from "@/components/Sidebar";
import { CredentialCard } from "@/components/CredentialCard";
import { ShareModal } from "@/components/ShareModal";
import {
  getCurrentUser,
  getCredentials,
  issueCredential,
  importCredential,
  deleteCredential,
  revokeCredential,
  User,
  Credential
} from "@/lib/api";

export default function CredentialsPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [credentials, setCredentials] = useState<Credential[]>([]);
  const [filteredStatus, setFilteredStatus] = useState<string>("ALL");
  const [loading, setLoading] = useState(true);

  // Modals
  const [showIssueModal, setShowIssueModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [sharingCredential, setSharingCredential] = useState<Credential | null>(null);

  // Form states: Issue
  const [issueType, setIssueType] = useState("UniversityCredential");
  const [issueTitle, setIssueTitle] = useState("");
  const [issuerName, setIssuerName] = useState("IDone Accredited Authority");
  const [claimKey1, setClaimKey1] = useState("degreeOrField");
  const [claimVal1, setClaimVal1] = useState("Computer Science & Cryptography");
  const [claimKey2, setClaimKey2] = useState("honorsOrGrade");
  const [claimVal2, setClaimVal2] = useState("Summa Cum Laude");
  const [expirationDays, setExpirationDays] = useState(1460);
  const [issueError, setIssueError] = useState("");
  const [submittingIssue, setSubmittingIssue] = useState(false);

  // Form states: Import
  const [importJson, setImportJson] = useState("");
  const [importError, setImportError] = useState("");
  const [submittingImport, setSubmittingImport] = useState(false);

  useEffect(() => {
    document.title = "Verifiable Credentials Hub | IDone";
    const loadData = async () => {
      try {
        const u = await getCurrentUser();
        setUser(u);
        const creds = await getCredentials();
        setCredentials(creds);
      } catch (err) {
        router.push("/login");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [router]);

  const handleIssueSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!issueTitle) {
      setIssueError("Please provide a credential title.");
      return;
    }

    setSubmittingIssue(true);
    setIssueError("");

    try {
      const claims: Record<string, any> = {};
      if (claimKey1 && claimVal1) claims[claimKey1] = claimVal1;
      if (claimKey2 && claimVal2) claims[claimKey2] = claimVal2;

      await issueCredential({
        type_name: issueType,
        title: issueTitle,
        issuer_name: issuerName,
        claims,
        expiration_days: Number(expirationDays),
      });

      setShowIssueModal(false);
      setIssueTitle("");
      const updated = await getCredentials();
      setCredentials(updated);
    } catch (err: any) {
      setIssueError(err.message || "Failed to issue credential.");
    } finally {
      setSubmittingIssue(false);
    }
  };

  const handleImportSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!importJson.trim()) {
      setImportError("Please paste a valid JSON-LD credential.");
      return;
    }

    setSubmittingImport(true);
    setImportError("");

    try {
      await importCredential(importJson);
      setShowImportModal(false);
      setImportJson("");
      const updated = await getCredentials();
      setCredentials(updated);
    } catch (err: any) {
      setImportError(err.message || "Invalid or tampered credential. Import rejected.");
    } finally {
      setSubmittingImport(false);
    }
  };

  const handleDeleteCred = async (id: string) => {
    if (!confirm("Remove this credential from your vault?")) return;
    try {
      await deleteCredential(id);
      setCredentials(credentials.filter((c) => c.id !== id));
    } catch (err: any) {
      alert(err.message || "Failed to remove credential");
    }
  };

  const handleRevokeCred = async (credential: Credential) => {
    const reason = prompt(`Enter revocation reason for '${credential.title}':`, "Holder revocation request");
    if (!reason) return;
    try {
      await revokeCredential(credential.id, reason);
      const updated = await getCredentials();
      setCredentials(updated);
    } catch (err: any) {
      alert(err.message || "Revocation failed");
    }
  };

  const filteredCredentials = credentials.filter((c) => {
    if (filteredStatus === "ALL") return true;
    return c.status === filteredStatus;
  });

  return (
    <div className="flex min-h-screen flex-col bg-offwhite-50">
      <title>Verifiable Credentials Hub | IDone</title>
      <Navbar user={user} />

      <div className="flex flex-1">
        <Sidebar />

        <main className="flex-1 p-6 md:p-8 max-w-7xl">
          {/* Header & Controls */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                W3C VC Data Model v1.1
              </span>
              <h1 className="text-2xl font-extrabold tracking-tight text-navy-900 mt-0.5">
                Verifiable Credentials Hub
              </h1>
            </div>

            <div className="flex items-center space-x-2.5">
              <button
                onClick={() => setShowImportModal(true)}
                className="btn-press inline-flex items-center space-x-1.5 rounded-lg border border-offwhite-200 bg-white px-3.5 py-2 text-xs font-semibold text-navy-900 hover:bg-offwhite-100 hover:border-slate-300 shadow-xs"
              >
                <FileDown className="h-4 w-4 text-trust-600" />
                <span>Import JSON-LD</span>
              </button>

              <button
                onClick={() => setShowIssueModal(true)}
                className="btn-press inline-flex items-center space-x-1.5 rounded-lg bg-navy-900 px-3.5 py-2 text-xs font-semibold text-white hover:bg-navy-800 shadow-xs"
              >
                <Plus className="h-4 w-4 text-trust-600" />
                <span>Issue Credential</span>
              </button>
            </div>
          </div>

          {/* Status Tabs */}
          <div className="flex items-center space-x-1 border-b border-offwhite-200 pb-3 mb-6 overflow-x-auto">
            {["ALL", "VALID", "REVOKED", "EXPIRED"].map((tab) => (
              <button
                key={tab}
                onClick={() => setFilteredStatus(tab)}
                className={`btn-press rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                  filteredStatus === tab
                    ? "bg-navy-900 text-white shadow-xs"
                    : "text-slate-600 hover:bg-offwhite-100 hover:text-navy-900"
                }`}
              >
                {tab === "ALL" ? "All Credentials" : tab.charAt(0) + tab.slice(1).toLowerCase()}
                <span className="ml-1.5 text-[10px] opacity-75 font-mono">
                  (
                  {tab === "ALL"
                    ? credentials.length
                    : credentials.filter((c) => c.status === tab).length}
                  )
                </span>
              </button>
            ))}
          </div>

          {/* Credential Cards Grid */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
              <div className="h-60 bg-white rounded-xl border border-offwhite-200"></div>
              <div className="h-60 bg-white rounded-xl border border-offwhite-200"></div>
              <div className="h-60 bg-white rounded-xl border border-offwhite-200"></div>
            </div>
          ) : filteredCredentials.length === 0 ? (
            <div className="rounded-xl border border-dashed border-offwhite-200 bg-white p-12 text-center">
              <Award className="h-10 w-10 text-slate-400 mx-auto mb-2" />
              <h3 className="text-base font-bold text-navy-900">No Credentials in this View</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                Issue a signed cryptographic credential or import an existing verifiable JSON-LD file.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCredentials.map((cred) => (
                <CredentialCard
                  key={cred.id}
                  credential={cred}
                  onShare={(c) => setSharingCredential(c)}
                  onRevoke={handleRevokeCred}
                  onDelete={handleDeleteCred}
                />
              ))}
            </div>
          )}
        </main>
      </div>

      {/* Issue Modal */}
      {showIssueModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy-900/60 p-4 animate-fade-in">
          <div className="relative w-full max-w-lg rounded-xl bg-white p-6 shadow-modal border border-offwhite-200 animate-scale-in">
            <div className="flex items-center justify-between pb-3 border-b border-offwhite-200">
              <h3 className="text-sm font-bold text-navy-900">Issue Verifiable Credential</h3>
              <button
                onClick={() => setShowIssueModal(false)}
                className="btn-press rounded p-1 text-slate-400 hover:bg-offwhite-100 hover:text-navy-900"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {issueError && (
              <div className="mt-3 rounded-lg bg-alert-50 p-2.5 text-xs text-alert-700 border border-alert-100">
                {issueError}
              </div>
            )}

            <form onSubmit={handleIssueSubmit} className="mt-4 space-y-3">
              <div>
                <label className="block text-xs font-semibold text-navy-900 mb-1">
                  Credential Type
                </label>
                <select
                  value={issueType}
                  onChange={(e) => setIssueType(e.target.value)}
                  className="w-full rounded-lg border border-offwhite-200 bg-white px-3 py-2 text-xs text-navy-900 focus:border-trust-600 focus:outline-none"
                >
                  <option value="UniversityCredential">University Degree / Diploma</option>
                  <option value="ProfessionalLicense">Professional License / Certificate</option>
                  <option value="SecurityClearance">Cybersecurity Clearance</option>
                  <option value="CitizenshipProof">Digital Proof of Citizenship</option>
                  <option value="ProofOfResidence">Verified Proof of Residence</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-navy-900 mb-1">
                  Credential Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Master of Science in Cyber Security"
                  value={issueTitle}
                  onChange={(e) => setIssueTitle(e.target.value)}
                  className="w-full rounded-lg border border-offwhite-200 px-3 py-2 text-xs text-navy-900 focus:border-trust-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-navy-900 mb-1">
                  Issuing Authority
                </label>
                <input
                  type="text"
                  value={issuerName}
                  onChange={(e) => setIssuerName(e.target.value)}
                  className="w-full rounded-lg border border-offwhite-200 px-3 py-2 text-xs text-navy-900 focus:border-trust-600 focus:outline-none"
                />
              </div>

              {/* Claims Pair 1 */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 mb-0.5">
                    Claim Key
                  </label>
                  <input
                    type="text"
                    value={claimKey1}
                    onChange={(e) => setClaimKey1(e.target.value)}
                    className="w-full rounded-lg border border-offwhite-200 px-2.5 py-1.5 text-xs text-navy-900 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 mb-0.5">
                    Claim Value
                  </label>
                  <input
                    type="text"
                    value={claimVal1}
                    onChange={(e) => setClaimVal1(e.target.value)}
                    className="w-full rounded-lg border border-offwhite-200 px-2.5 py-1.5 text-xs text-navy-900"
                  />
                </div>
              </div>

              {/* Claims Pair 2 */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 mb-0.5">
                    Claim Key
                  </label>
                  <input
                    type="text"
                    value={claimKey2}
                    onChange={(e) => setClaimKey2(e.target.value)}
                    className="w-full rounded-lg border border-offwhite-200 px-2.5 py-1.5 text-xs text-navy-900 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 mb-0.5">
                    Claim Value
                  </label>
                  <input
                    type="text"
                    value={claimVal2}
                    onChange={(e) => setClaimVal2(e.target.value)}
                    className="w-full rounded-lg border border-offwhite-200 px-2.5 py-1.5 text-xs text-navy-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-navy-900 mb-1">
                  Validity Period (Days)
                </label>
                <input
                  type="number"
                  value={expirationDays}
                  onChange={(e) => setExpirationDays(Number(e.target.value))}
                  className="w-full rounded-lg border border-offwhite-200 px-3 py-2 text-xs text-navy-900"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowIssueModal(false)}
                  className="rounded-lg border border-offwhite-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-offwhite-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingIssue}
                  className="rounded-lg bg-navy-900 px-4 py-2 text-xs font-semibold text-white hover:bg-navy-800 disabled:opacity-50 transition-colors"
                >
                  {submittingIssue ? "Signing with Ed25519..." : "Issue & Anchor Credential"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Import Modal */}
      {showImportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy-900/60 p-4 animate-fade-in">
          <div className="relative w-full max-w-lg rounded-xl bg-white p-6 shadow-modal border border-offwhite-200 animate-scale-in">
            <div className="flex items-center justify-between pb-3 border-b border-offwhite-200">
              <h3 className="text-sm font-bold text-navy-900">Import Verifiable Credential</h3>
              <button
                onClick={() => setShowImportModal(false)}
                className="btn-press rounded p-1 text-slate-400 hover:bg-offwhite-100 hover:text-navy-900"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {importError && (
              <div className="mt-3 rounded-lg bg-alert-50 p-2.5 text-xs text-alert-700 border border-alert-100 animate-fade-slide-down">
                {importError}
              </div>
            )}

            <form onSubmit={handleImportSubmit} className="mt-4 space-y-3">
              <div>
                <label className="block text-xs font-semibold text-navy-900 mb-1">
                  W3C JSON-LD Credential Payload
                </label>
                <textarea
                  required
                  rows={8}
                  value={importJson}
                  onChange={(e) => setImportJson(e.target.value)}
                  placeholder='{"@context": [...], "id": "urn:uuid:...", "type": ["VerifiableCredential"], "proof": {...}}'
                  className="w-full rounded-lg border border-offwhite-200 p-3 font-mono text-xs text-navy-900 focus:border-trust-600 focus:outline-none transition-colors"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowImportModal(false)}
                  className="btn-press rounded-lg border border-offwhite-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-offwhite-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingImport}
                  className="btn-press rounded-lg bg-trust-600 px-4 py-2 text-xs font-semibold text-white hover:bg-trust-700 disabled:opacity-50 shadow-xs"
                >
                  {submittingImport ? "Verifying Proof..." : "Verify & Import"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Selective Disclosure Modal */}
      {sharingCredential && (
        <ShareModal
          credential={sharingCredential}
          onClose={() => setSharingCredential(null)}
        />
      )}
    </div>
  );
}
