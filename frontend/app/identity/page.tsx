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
    <div className="flex min-h-screen flex-col bg-[#F5F5F7] dark:bg-[#000000] text-neutral-900 dark:text-white transition-colors duration-300">
      <title>Decentralized Identity (DID) | IDone</title>
      <Navbar user={user} />

      <div className="flex flex-1">
        <Sidebar />

        <main className="flex-1 p-6 md:p-8 max-w-5xl min-w-0">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400">
                W3C DID Specification
              </span>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-neutral-900 dark:text-white mt-0.5">
                Decentralized Identity & Cryptographic Keys
              </h1>
            </div>

            <button
              onClick={handleRotate}
              disabled={rotating}
              className="apple-btn-secondary px-4 py-2 text-xs hover:border-purple-500/40 disabled:opacity-50"
            >
              <RotateCw className={`h-3.5 w-3.5 mr-1.5 text-purple-600 dark:text-purple-400 ${rotating ? "animate-spin" : ""}`} />
              <span>{rotating ? "Rotating Keypair..." : "Rotate Cryptographic Key"}</span>
            </button>
          </div>

          {identity ? (
            <div className="space-y-6">
              {/* Primary Identity Card with Holographic Apple Accents */}
              <div className="apple-card-holo p-6 md:p-7 relative overflow-hidden bg-gradient-to-br from-white via-white to-purple-500/[0.04] dark:from-[#161618] dark:via-[#161618] dark:to-purple-900/15">
                <div className="absolute -left-12 -top-12 h-44 w-44 rounded-full bg-gradient-to-br from-[#AF52DE]/15 to-[#0071E3]/15 blur-2xl pointer-events-none"></div>

                <div className="flex items-center space-x-3.5 mb-5 relative z-10">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-tr from-[#AF52DE] to-[#BF5AF2] text-white shadow-md shadow-purple-500/25">
                    <Fingerprint className="h-6 w-6" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-neutral-900 dark:text-white">
                      Sovereign Root Identifier (DID)
                    </h2>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400">
                      Your globally resolvable, self-sovereign identity string anchored by Ed25519 cryptography.
                    </p>
                  </div>
                </div>

                <div className="rounded-2xl border border-purple-500/20 bg-purple-500/[0.04] dark:bg-purple-500/[0.08] p-4 relative z-10">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400">DID Identifier</span>
                    <span className="inline-flex items-center rounded-full bg-[#34C759]/10 px-2.5 py-0.5 text-[10px] font-semibold text-[#28A745] dark:text-[#30D158] border border-[#34C759]/20 shadow-xs">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#34C759] mr-1.5 shadow-[0_0_6px_#34C759]"></span>
                      {identity.status}
                    </span>
                  </div>

                  <div className="mt-2 flex items-center justify-between gap-3">
                    <code className="font-mono text-xs md:text-sm font-semibold text-neutral-900 dark:text-white break-all select-all">
                      {identity.did}
                    </code>
                    <button
                      onClick={copyDid}
                      className="inline-flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border border-black/[0.06] dark:border-white/[0.08] bg-black/[0.03] dark:bg-white/[0.06] text-neutral-600 dark:text-neutral-300 hover:bg-black/[0.08] dark:hover:bg-white/[0.12] transition-all active:scale-95"
                      title="Copy DID"
                    >
                      {copiedDid ? (
                        <Check className="h-3.5 w-3.5 text-[#34C759] dark:text-[#30D158]" />
                      ) : (
                        <Copy className="h-3.5 w-3.5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Cryptographic Specifications Grid */}
                <div className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs relative z-10">
                  <div className="rounded-2xl border border-purple-500/15 bg-white/70 dark:bg-black/30 p-4 transition-all hover:border-purple-500/40">
                    <span className="text-[10px] uppercase font-bold text-neutral-400 dark:text-neutral-500 block mb-1.5">Signature Scheme</span>
                    <div className="flex items-center space-x-2 font-semibold text-neutral-900 dark:text-white">
                      <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400">
                        <KeyRound className="h-3.5 w-3.5" />
                      </div>
                      <span>Ed25519 (RFC 8032)</span>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-blue-500/15 bg-white/70 dark:bg-black/30 p-4 transition-all hover:border-blue-500/40">
                    <span className="text-[10px] uppercase font-bold text-neutral-400 dark:text-neutral-500 block mb-1.5">Verification Method</span>
                    <div className="flex items-center space-x-2 font-mono text-neutral-800 dark:text-neutral-200 truncate">
                      <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-blue-500/10 text-[#0071E3] dark:text-[#0A84FF] flex-shrink-0">
                        <Layers className="h-3.5 w-3.5" />
                      </div>
                      <span className="truncate">{identity.verification_method}</span>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-emerald-500/15 bg-white/70 dark:bg-black/30 p-4 transition-all hover:border-emerald-500/40">
                    <span className="text-[10px] uppercase font-bold text-neutral-400 dark:text-neutral-500 block mb-1.5">Blockchain Registry</span>
                    <div className="flex items-center space-x-2 font-semibold text-neutral-900 dark:text-white">
                      <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-emerald-500/10 text-[#34C759] dark:text-[#30D158]">
                        <Cpu className="h-3.5 w-3.5" />
                      </div>
                      <span>IdentityRegistry.sol</span>
                    </div>
                  </div>
                </div>

                {/* Public Key Display */}
                <div className="mt-5 relative z-10">
                  <span className="text-xs font-semibold text-neutral-900 dark:text-white block mb-1.5">
                    Current Public Verification Key (Hex)
                  </span>
                  <div className="rounded-2xl border border-black/[0.06] dark:border-white/[0.08] bg-black/[0.02] dark:bg-white/[0.03] p-3.5 font-mono text-xs text-neutral-700 dark:text-neutral-300 break-all select-all">
                    0x{identity.public_key_hex}
                  </div>
                  <p className="mt-1.5 text-[11px] text-neutral-500 dark:text-neutral-400">
                    Public keys are freely sharable. Private assertion keys remain securely encrypted within your vault.
                  </p>
                </div>
              </div>

              {/* Live W3C DID Document Resolution */}
              <div className="apple-card p-6">
                <div className="flex items-center justify-between pb-3.5 border-b border-black/[0.05] dark:border-white/[0.07] mb-4">
                  <div className="flex items-center space-x-2.5">
                    <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400">
                      <FileCode className="h-4 w-4" />
                    </div>
                    <h3 className="text-sm font-bold text-neutral-900 dark:text-white">
                      Resolved W3C DID Document (JSON-LD)
                    </h3>
                  </div>

                  <button
                    onClick={copyDoc}
                    className="apple-btn-secondary px-3 py-1.5 text-xs"
                  >
                    {copiedDoc ? (
                      <Check className="h-3.5 w-3.5 mr-1.5 text-[#34C759] dark:text-[#30D158]" />
                    ) : (
                      <Copy className="h-3.5 w-3.5 mr-1.5" />
                    )}
                    <span>{copiedDoc ? "Copied" : "Copy Document"}</span>
                  </button>
                </div>

                <pre className="max-h-80 overflow-auto rounded-2xl bg-black/[0.03] dark:bg-black/60 p-4 font-mono text-xs text-neutral-800 dark:text-neutral-200 border border-black/[0.06] dark:border-white/[0.08] leading-relaxed">
                  {didDocument ? JSON.stringify(didDocument, null, 2) : "Resolving DID Document..."}
                </pre>
              </div>
            </div>
          ) : (
            <div className="animate-pulse space-y-4">
              <div className="h-40 bg-white dark:bg-[#161618] rounded-2xl border border-black/[0.06] dark:border-white/[0.08]"></div>
              <div className="h-60 bg-white dark:bg-[#161618] rounded-2xl border border-black/[0.06] dark:border-white/[0.08]"></div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
