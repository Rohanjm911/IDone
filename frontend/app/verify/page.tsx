"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Shield,
  CheckCircle2,
  AlertTriangle,
  Play,
  RotateCcw,
  CheckCheck,
  FileCheck
} from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { ThemeToggle } from "@/components/ThemeToggle";
import { VerificationResultCard } from "@/components/VerificationResultCard";
import { verifyCredentialData, VerificationResult } from "@/lib/api";

const SAMPLE_VALID = {
  "@context": [
    "https://www.w3.org/2018/credentials/v1",
    "https://schema.org"
  ],
  "id": "urn:uuid:7f14b620-e47c-48a5-9bb9-b873d6118b62",
  "type": [
    "VerifiableCredential",
    "UniversityCredential"
  ],
  "issuer": {
    "id": "did:idone:accredited:university",
    "name": "MIT Open Credential Authority"
  },
  "issuanceDate": "2026-09-01T00:00:00Z",
  "expirationDate": "2030-09-01T00:00:00Z",
  "credentialSubject": {
    "id": "did:idone:z6MkuV8s7T2w9XNalice",
    "degree": "Master of Science in Computer Science",
    "honors": "Summa Cum Laude"
  },
  "proof": {
    "type": "Ed25519Signature2020",
    "created": "2026-09-01T00:00:00Z",
    "verificationMethod": "did:idone:accredited:university#key-1",
    "proofPurpose": "assertionMethod",
    "proofValue": "4a72d3f98c4b1e5a2d6f8e0b3c5a7e9d1f3b5d7a9c1e3f5b7d9a1c3e5f7b9d1a4c6e8f0a2b4d6f8a0c2e4b6d8f0a2c4e6b8d0f2a4c6e8f0b2d4f6a8c0e2b4d6"
  }
};

const SAMPLE_TAMPERED = {
  ...SAMPLE_VALID,
  "credentialSubject": {
    "id": "did:idone:z6MkuV8s7T2w9XNalice",
    "degree": "Doctor of Philosophy in Artificial General Intelligence (TAMPERED)",
    "honors": "Summa Cum Laude"
  }
};

const SAMPLE_EXPIRED = {
  ...SAMPLE_VALID,
  "issuanceDate": "2020-01-01T00:00:00Z",
  "expirationDate": "2022-01-01T00:00:00Z",
};

export default function VerifyPage() {
  const [jsonInput, setJsonInput] = useState(JSON.stringify(SAMPLE_VALID, null, 2));
  const [verifying, setVerifying] = useState(false);
  const [result, setResult] = useState<VerificationResult | null>(null);
  const [error, setError] = useState("");

  const handleVerify = async () => {
    setError("");
    setVerifying(true);
    setResult(null);

    try {
      let parsedData: any;
      try {
        parsedData = JSON.parse(jsonInput);
      } catch (parseErr) {
        throw new Error("Invalid JSON formatting. Please verify brackets, quotes, and commas.");
      }

      const res = await verifyCredentialData(parsedData);
      setResult(res);
    } catch (err: any) {
      setError(err.message || "Cryptographic verification failed.");
    } finally {
      setVerifying(false);
    }
  };

  React.useEffect(() => {
    document.title = "Cryptographic Verifier | IDone";
  }, []);

  const loadSample = (sample: any) => {
    setJsonInput(JSON.stringify(sample, null, 2));
    setResult(null);
    setError("");
  };

  return (
    <div className="min-h-screen bg-offwhite-50 flex flex-col justify-between">
      <title>Cryptographic Verifier | IDone</title>
      {/* Top Bar */}
      <header className="border-b border-offwhite-200 bg-white">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <Link href="/" className="flex items-center space-x-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-navy-900 text-white">
              <Shield className="h-5 w-5 text-trust-600" />
            </div>
            <span className="text-xl font-bold tracking-tight text-navy-900">IDone</span>
            <span className="rounded bg-trust-50 px-2 py-0.5 text-xs font-semibold text-trust-700 border border-trust-100">
              Verifier
            </span>
          </Link>

          <div className="flex items-center space-x-3">
            <Link
              href="/dashboard"
              className="text-xs font-semibold text-navy-900 hover:text-trust-600 transition-colors"
            >
              Dashboard
            </Link>
            <Link
              href="/login"
              className="rounded-lg bg-navy-900 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-navy-800 transition-colors"
            >
              Enter Vault
            </Link>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Main Area */}
      <main className="mx-auto max-w-5xl flex-1 px-6 py-10 w-full">
        <div className="text-center mb-8">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Independent Audit Engine
          </span>
          <h1 className="text-3xl font-extrabold text-navy-900 mt-1">
            Cryptographic Credential Verification
          </h1>
          <p className="text-xs text-slate-600 max-w-xl mx-auto mt-2">
            Verify Ed25519 digital signatures, canonical JSON hashes (RFC 8785), W3C JSON-LD
            contexts, and on-chain revocation states without relying on centralized intermediaries.
          </p>
        </div>

        {/* Demo Preset Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-6">
          <span className="text-xs font-semibold text-slate-500 mr-1">Load Demo Payload:</span>
          <button
            onClick={() => loadSample(SAMPLE_VALID)}
            className="btn-press rounded-lg border border-offwhite-200 bg-white px-3 py-1.5 text-xs font-semibold text-navy-900 hover:bg-offwhite-100 hover:border-slate-300 shadow-xs"
          >
            Valid Degree (Valid)
          </button>
          <button
            onClick={() => loadSample(SAMPLE_TAMPERED)}
            className="btn-press rounded-lg border border-alert-200 bg-alert-50 px-3 py-1.5 text-xs font-semibold text-alert-700 hover:bg-alert-100 shadow-xs"
          >
            Tampered Payload (Attack Simulation)
          </button>
          <button
            onClick={() => loadSample(SAMPLE_EXPIRED)}
            className="btn-press rounded-lg border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-700 hover:bg-amber-100 shadow-xs"
          >
            Expired Credential (Time Drift)
          </button>
        </div>

        {/* Verification Form Card */}
        <div className="card-interactive animate-fade-slide-up rounded-xl border border-offwhite-200 bg-white p-6 shadow-card mb-8">
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-bold uppercase tracking-wider text-navy-900">
              W3C Verifiable Credential JSON Payload
            </label>
            <span className="text-[11px] text-slate-400 font-mono">JSON-LD 1.1 Compliant</span>
          </div>

          <textarea
            rows={12}
            value={jsonInput}
            onChange={(e) => setJsonInput(e.target.value)}
            className="w-full rounded-lg border border-offwhite-200 p-3.5 font-mono text-xs text-navy-900 focus:border-trust-600 focus:outline-none transition-colors"
          />

          {error && (
            <div className="mt-3 flex items-start space-x-2 rounded-lg bg-alert-50 p-3 text-xs text-alert-700 border border-alert-100 animate-fade-slide-down">
              <AlertTriangle className="h-4 w-4 text-alert-600 flex-shrink-0 mt-0.5 animate-pop" />
              <span>{error}</span>
            </div>
          )}

          <div className="mt-4 flex items-center justify-between">
            <button
              onClick={() => setJsonInput("")}
              className="btn-press text-xs font-semibold text-slate-500 hover:text-navy-900"
            >
              Clear Editor
            </button>

            <button
              onClick={handleVerify}
              disabled={verifying}
              className="btn-press inline-flex items-center space-x-2 rounded-lg bg-trust-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-trust-700 disabled:opacity-50 shadow-card"
            >
              <Play className={`h-3.5 w-3.5 fill-current ${verifying ? "animate-spin" : ""}`} />
              <span>{verifying ? "Executing Verification Engine..." : "Verify Cryptographic Proof"}</span>
            </button>
          </div>
        </div>

        {/* Verification Results Display */}
        {result && (
          <div className="animate-fade-slide-up">
            <VerificationResultCard result={result} />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-offwhite-200 bg-white py-6 text-center text-xs text-slate-500">
        IDone Independent Verification Engine • Nonce & Proof Checking • RFC 8785 Canonicalization
      </footer>
    </div>
  );
}
