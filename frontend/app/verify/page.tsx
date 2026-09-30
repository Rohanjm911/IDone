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
import { Logo } from "@/components/Logo";

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
    <div className="min-h-screen bg-[#F5F5F7] dark:bg-[#000000] text-neutral-900 dark:text-white flex flex-col justify-between transition-colors duration-300">
      <title>Cryptographic Verifier | IDone</title>
      {/* Apple Frosted Glass Header */}
      <header className="sticky top-0 z-40 apple-glass transition-all duration-300">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <Link href="/" className="inline-flex items-center group">
            <Logo variant="main" size="sm" priority />
            <span className="ml-2.5 rounded-full bg-cyan-500/10 dark:bg-cyan-500/15 px-2.5 py-0.5 text-[10px] font-bold text-cyan-600 dark:text-cyan-400 border border-cyan-500/20">
              Verifier
            </span>
          </Link>

          <div className="flex items-center space-x-3">
            <Link
              href="/dashboard"
              className="text-xs font-medium text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors"
            >
              Dashboard
            </Link>
            <Link
              href="/login"
              className="apple-btn-primary px-3.5 py-1.5 text-xs shadow-xs"
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
          <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-600 dark:text-cyan-400">
            Independent Audit Engine
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-neutral-900 dark:text-white mt-1">
            Cryptographic Credential Verification
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 max-w-xl mx-auto mt-2 leading-relaxed">
            Verify Ed25519 digital signatures, canonical JSON hashes (RFC 8785), W3C JSON-LD
            contexts, and on-chain revocation states without relying on centralized intermediaries.
          </p>
        </div>

        {/* Apple Demo Preset Buttons with Vibrant Accent Tints */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-7">
          <span className="text-xs font-semibold text-neutral-400 dark:text-neutral-500 mr-1">Load Demo Payload:</span>
          <button
            onClick={() => loadSample(SAMPLE_VALID)}
            className="flex items-center space-x-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20 transition-all shadow-xs"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
            <span>Valid Degree (Verified)</span>
          </button>
          <button
            onClick={() => loadSample(SAMPLE_TAMPERED)}
            className="flex items-center space-x-1.5 rounded-full border border-rose-500/30 bg-rose-500/10 px-3.5 py-1.5 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-500/20 transition-all shadow-xs"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-rose-500"></span>
            <span>Tampered Payload (Attack Simulation)</span>
          </button>
          <button
            onClick={() => loadSample(SAMPLE_EXPIRED)}
            className="flex items-center space-x-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-3.5 py-1.5 text-xs font-semibold text-amber-600 dark:text-amber-400 hover:bg-amber-500/20 transition-all shadow-xs"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-amber-500"></span>
            <span>Expired Credential (Time Drift)</span>
          </button>
        </div>

        {/* Verification Form Card */}
        <div className="apple-card p-6 md:p-8 mb-8 relative overflow-hidden group">
          <div className="flex items-center justify-between mb-3">
            <label className="text-xs font-bold uppercase tracking-wider text-neutral-900 dark:text-white">
              W3C Verifiable Credential JSON Payload
            </label>
            <span className="text-[11px] text-cyan-600 dark:text-cyan-400 font-mono font-semibold">JSON-LD 1.1 Compliant</span>
          </div>

          <textarea
            rows={12}
            value={jsonInput}
            onChange={(e) => setJsonInput(e.target.value)}
            className="w-full rounded-2xl border border-black/[0.08] dark:border-white/[0.1] bg-black/[0.02] dark:bg-white/[0.03] p-4 font-mono text-xs text-neutral-900 dark:text-neutral-100 focus:border-[#0071E3] focus:outline-none transition-all leading-relaxed"
          />

          {error && (
            <div className="mt-3 flex items-start space-x-2 rounded-2xl bg-rose-500/10 p-3.5 text-xs text-rose-600 dark:text-rose-400 border border-rose-500/20">
              <AlertTriangle className="h-4 w-4 text-rose-500 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <div className="mt-5 flex items-center justify-between">
            <button
              onClick={() => setJsonInput("")}
              className="text-xs font-semibold text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition-colors"
            >
              Clear Editor
            </button>

            <button
              onClick={handleVerify}
              disabled={verifying}
              className="apple-btn-primary px-6 py-2.5 text-xs font-bold shadow-md shadow-blue-500/25 hover:shadow-blue-500/40 disabled:opacity-50"
            >
              <Play className={`h-3.5 w-3.5 mr-1.5 fill-current ${verifying ? "animate-spin" : ""}`} />
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

      {/* Apple Minimal Footer */}
      <footer className="border-t border-black/[0.05] dark:border-white/[0.07] bg-white/50 dark:bg-black/40 py-6 text-center text-xs text-neutral-500 dark:text-neutral-400">
        IDone Independent Verification Engine • Nonce & Proof Checking • RFC 8785 Canonicalization
      </footer>
    </div>
  );
}
