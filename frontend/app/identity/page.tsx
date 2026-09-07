"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Fingerprint,
  Copy,
  Check,
  KeyRound,
  ShieldCheck,
  FileCode,
  RotateCw,
  Cpu,
  Layers
} from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Sidebar } from "@/components/Sidebar";
import {
  getCurrentUser,
  getIdentity,
  rotateIdentityKey,
  resolveDID,
  User,
  Identity
} from "@/lib/api";

export default function IdentityPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [identity, setIdentity] = useState<Identity | null>(null);
  const [didDocument, setDidDocument] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [rotating, setRotating] = useState(false);
  const [copiedDid, setCopiedDid] = useState(false);
  const [copiedDoc, setCopiedDoc] = useState(false);

  useEffect(() => {
    document.title = "Decentralized Identity (DID) | IDone";
    const loadData = async () => {
      try {
        const u = await getCurrentUser();
        setUser(u);
        const id = await getIdentity();
        setIdentity(id);

        const doc = await resolveDID(id.did);
        setDidDocument(doc);
      } catch (err) {
        console.warn("Failed to load identity:", err);
        router.push("/login");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [router]);

  const handleRotate = async () => {
    if (!confirm("Rotate Ed25519 keypair? This creates a new verification method for future assertions while preserving your DID.")) {
      return;
    }
    setRotating(true);
    try {
      const updated = await rotateIdentityKey();
      setIdentity(updated);
      const doc = await resolveDID(updated.did);
      setDidDocument(doc);
    } catch (err: any) {
      alert(err.message || "Failed to rotate key");
    } finally {
      setRotating(false);
    }
  };

  const copyDid = () => {
    if (identity) {
      navigator.clipboard.writeText(identity.did);
      setCopiedDid(true);
      setTimeout(() => setCopiedDid(false), 2000);
    }
  };

  const copyDoc = () => {
    if (didDocument) {
      navigator.clipboard.writeText(JSON.stringify(didDocument, null, 2));
      setCopiedDoc(true);
      setTimeout(() => setCopiedDoc(false), 2000);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-offwhite-50">
      <title>Decentralized Identity (DID) | IDone</title>
      <Navbar user={user} />

      <div className="flex flex-1">
        <Sidebar />

        <main className="flex-1 p-6 md:p-8 max-w-5xl">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                W3C DID Specification
              </span>
              <h1 className="text-2xl font-extrabold tracking-tight text-navy-900 mt-0.5">
                Decentralized Identity & Cryptographic Keys
              </h1>
            </div>

            <button
              onClick={handleRotate}
              disabled={rotating}
              className="btn-press inline-flex items-center space-x-2 rounded-lg bg-navy-900 px-4 py-2 text-xs font-semibold text-white hover:bg-navy-800 disabled:opacity-50 shadow-xs"
            >
              <RotateCw className={`h-3.5 w-3.5 text-trust-600 ${rotating ? "animate-spin" : ""}`} />
              <span>{rotating ? "Rotating Keypair..." : "Rotate Cryptographic Key"}</span>
            </button>
          </div>

          {identity ? (
            <div className="space-y-6 animate-fade-slide-up">
              {/* Primary Identity Card */}
              <div className="card-interactive rounded-xl border border-offwhite-200 bg-white p-6 shadow-card hover:border-slate-300">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-navy-900 text-white shadow-xs">
                    <Fingerprint className="h-5 w-5 text-trust-600" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-navy-900">
                      Sovereign Root Identifier (DID)
                    </h2>
                    <p className="text-xs text-slate-500">
                      Your globally resolvable, self-sovereign identity string.
                    </p>
                  </div>
                </div>

                <div className="rounded-lg border border-offwhite-200 bg-offwhite-50 p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-500">DID Identifier</span>
                    <span className="inline-flex items-center rounded-full bg-success-50 px-2 py-0.5 text-[10px] font-semibold text-success-700 border border-success-100">
                      <span className="h-1.5 w-1.5 rounded-full bg-success-600 mr-1 animate-calm-pulse"></span>
                      {identity.status}
                    </span>
                  </div>

                  <div className="mt-2 flex items-center justify-between gap-3">
                    <code className="font-mono text-sm font-bold text-navy-900 break-all select-all">
                      {identity.did}
                    </code>
                    <button
                      onClick={copyDid}
                      className="btn-press inline-flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg border border-offwhite-200 bg-white hover:bg-offwhite-100 hover:border-slate-300"
                      title="Copy DID"
                    >
                      {copiedDid ? (
                        <Check className="h-4 w-4 text-success-600 animate-pop" />
                      ) : (
                        <Copy className="h-4 w-4 text-slate-600" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Cryptographic Specifications Grid */}
                <div className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                  <div className="rounded-lg border border-offwhite-200 bg-white p-3.5 transition-colors hover:border-slate-300 shadow-xs">
                    <span className="text-slate-500 block mb-1">Signature Scheme</span>
                    <div className="flex items-center space-x-1.5 font-semibold text-navy-900">
                      <KeyRound className="h-4 w-4 text-trust-600" />
                      <span>Ed25519 (RFC 8032)</span>
                    </div>
                  </div>

                  <div className="rounded-lg border border-offwhite-200 bg-white p-3.5 transition-colors hover:border-slate-300 shadow-xs">
                    <span className="text-slate-500 block mb-1">Verification Method</span>
                    <div className="flex items-center space-x-1.5 font-mono text-slate-700 truncate">
                      <Layers className="h-4 w-4 text-trust-600 flex-shrink-0" />
                      <span className="truncate">{identity.verification_method}</span>
                    </div>
                  </div>

                  <div className="rounded-lg border border-offwhite-200 bg-white p-3.5 transition-colors hover:border-slate-300 shadow-xs">
                    <span className="text-slate-500 block mb-1">Blockchain Registry</span>
                    <div className="flex items-center space-x-1.5 font-semibold text-navy-900">
                      <Cpu className="h-4 w-4 text-trust-600" />
                      <span>IdentityRegistry.sol</span>
                    </div>
                  </div>
                </div>

                {/* Public Key Display */}
                <div className="mt-5">
                  <span className="text-xs font-semibold text-navy-900 block mb-1">
                    Current Public Verification Key (Hex)
                  </span>
                  <div className="rounded-lg border border-offwhite-200 bg-offwhite-50 p-3 font-mono text-xs text-slate-700 break-all select-all">
                    0x{identity.public_key_hex}
                  </div>
                  <p className="mt-1.5 text-[11px] text-slate-500">
                    Public keys are freely sharable. Private assertion keys remain securely encrypted within your vault.
                  </p>
                </div>
              </div>

              {/* Live W3C DID Document Resolution */}
              <div className="card-interactive rounded-xl border border-offwhite-200 bg-white p-6 shadow-card hover:border-slate-300">
                <div className="flex items-center justify-between pb-3 border-b border-offwhite-200 mb-4">
                  <div className="flex items-center space-x-2">
                    <FileCode className="h-4 w-4 text-trust-600" />
                    <h3 className="text-sm font-bold text-navy-900">
                      Resolved W3C DID Document (JSON-LD)
                    </h3>
                  </div>

                  <button
                    onClick={copyDoc}
                    className="btn-press inline-flex items-center space-x-1 rounded-lg border border-offwhite-200 px-3 py-1 text-xs font-semibold text-navy-900 hover:bg-offwhite-100 hover:border-slate-300"
                  >
                    {copiedDoc ? (
                      <Check className="h-3.5 w-3.5 text-success-600 animate-pop" />
                    ) : (
                      <Copy className="h-3.5 w-3.5" />
                    )}
                    <span>{copiedDoc ? "Copied" : "Copy Document"}</span>
                  </button>
                </div>

                <pre className="max-h-80 overflow-auto rounded-lg bg-navy-900 p-4 font-mono text-xs text-offwhite-100 border border-navy-800">
                  {didDocument ? JSON.stringify(didDocument, null, 2) : "Resolving DID Document..."}
                </pre>
              </div>
            </div>
          ) : (
            <div className="animate-pulse space-y-4">
              <div className="h-40 bg-white rounded-xl border border-offwhite-200"></div>
              <div className="h-60 bg-white rounded-xl border border-offwhite-200"></div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
