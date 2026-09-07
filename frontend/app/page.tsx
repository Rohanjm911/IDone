"use client";

import React from "react";
import Link from "next/link";
import {
  Shield,
  Lock,
  Award,
  Fingerprint,
  CheckCircle2,
  Share2,
  ArrowRight,
  Database,
  Cpu
} from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";

export default function HomePage() {
  React.useEffect(() => {
    document.title = "IDone — Decentralized Identity Vault";
  }, []);

  return (
    <div className="min-h-screen bg-offwhite-50 dark:bg-[#0A0A0A] text-navy-900 dark:text-[#F5F5F5] flex flex-col justify-between transition-colors duration-200">
      <title>IDone — Decentralized Identity Vault</title>
      {/* Navigation Header */}
      <header className="border-b border-offwhite-200 dark:border-[#262626] bg-white dark:bg-[#101010] transition-colors">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <div className="flex items-center space-x-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-navy-900 dark:bg-[#1A1A1A] text-white border border-navy-700 dark:border-[#2E2E2E]">
              <Shield className="h-5 w-5 text-trust-600 dark:text-[#E5E5E5]" />
            </div>
            <span className="text-xl font-bold tracking-tight text-navy-900 dark:text-white">IDone</span>
          </div>

          <div className="flex items-center space-x-3 sm:space-x-4">
            <Link
              href="/verify"
              className="text-xs font-semibold text-slate-600 dark:text-zinc-200 hover:text-navy-900 dark:hover:text-white transition-colors"
            >
              Verify Credential
            </Link>
            <Link
              href="/login"
              className="text-xs font-semibold text-navy-900 dark:text-white hover:text-trust-600 dark:hover:text-zinc-200 transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/register"
              className="btn-press rounded-lg bg-navy-900 dark:bg-white dark:text-black px-4 py-2 text-xs font-bold text-white hover:bg-navy-800 dark:hover:bg-zinc-200 transition-colors shadow-xs"
            >
              Open Vault
            </Link>

            {/* Dark Mode / Light Mode Toggle */}
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1">
        <section className="mx-auto max-w-5xl px-6 py-16 text-center animate-fade-slide-up">
          {/* Trust Pill */}
          <div className="inline-flex items-center space-x-2 rounded-full border border-trust-100 dark:border-zinc-700 bg-trust-50 dark:bg-zinc-900 px-3.5 py-1.5 text-xs font-semibold text-trust-700 dark:text-zinc-100 mb-6 shadow-xs">
            <span className="h-2 w-2 rounded-full bg-trust-600 dark:bg-emerald-400 animate-calm-pulse"></span>
            <span>Decentralized Identity Vault & W3C Verifiable Credentials</span>
          </div>

          <h1 className="text-4xl font-extrabold tracking-tight text-navy-900 dark:text-white sm:text-5xl md:text-6xl">
            Your Identity. Your Credentials. <br className="hidden sm:inline" />
            <span className="text-trust-600 dark:text-zinc-200">Your Control.</span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-base text-slate-600 dark:text-zinc-300 leading-relaxed font-normal">
            A privacy-focused decentralized identity vault combining the security of a hardware-backed
            digital wallet, the calm assurance of modern banking, and the defensive precision of
            enterprise cybersecurity.
          </p>

          {/* Primary CTAs */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/register"
              className="btn-press flex w-full sm:w-auto items-center justify-center space-x-2 rounded-lg bg-navy-900 dark:bg-white dark:text-black px-6 py-3 text-sm font-bold text-white hover:bg-navy-800 dark:hover:bg-zinc-200 shadow-card"
            >
              <span className="dark:text-black">Create Sovereign Identity</span>
              <ArrowRight className="h-4 w-4 text-white dark:text-black" />
            </Link>
            <Link
              href="/verify"
              className="btn-press flex w-full sm:w-auto items-center justify-center space-x-2 rounded-lg border border-offwhite-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-6 py-3 text-sm font-semibold text-navy-900 dark:text-white hover:bg-offwhite-100 dark:hover:bg-zinc-800 hover:border-slate-300 dark:hover:border-zinc-600 shadow-xs"
            >
              <span>Public Verification Engine</span>
            </Link>
          </div>

          {/* Interactive Cryptographic Simulation Card */}
          <div className="mt-12 text-left rounded-xl border border-offwhite-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 shadow-card max-w-3xl mx-auto card-interactive">
            <div className="flex items-center justify-between pb-3 border-b border-offwhite-200 dark:border-zinc-800">
              <div className="flex items-center space-x-2">
                <Shield className="h-4 w-4 text-trust-600 dark:text-zinc-200" />
                <span className="text-xs font-bold text-navy-900 dark:text-white uppercase tracking-wider">
                  Live Cryptographic Verification Engine
                </span>
              </div>
              <span className="inline-flex items-center rounded-full bg-success-50 dark:bg-zinc-950 px-2.5 py-0.5 text-[10px] font-bold text-success-700 dark:text-emerald-400 border border-success-100 dark:border-zinc-800">
                <span className="h-1.5 w-1.5 rounded-full bg-success-600 mr-1 animate-calm-pulse"></span>
                Ed25519 + RFC 8785 Active
              </span>
            </div>

            <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
              <div className="rounded-lg bg-offwhite-50 dark:bg-zinc-950 p-2.5 border border-offwhite-200 dark:border-zinc-800">
                <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-zinc-300 block">Identifier</span>
                <span className="font-mono text-[11px] font-semibold text-navy-900 dark:text-white truncate block mt-0.5">did:idone:quantum-key-01</span>
              </div>
              <div className="rounded-lg bg-offwhite-50 dark:bg-zinc-950 p-2.5 border border-offwhite-200 dark:border-zinc-800">
                <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-zinc-300 block">Signature Suite</span>
                <span className="font-mono text-[11px] font-semibold text-navy-900 dark:text-white truncate block mt-0.5">Ed25519VerificationKey2020</span>
              </div>
              <div className="rounded-lg bg-offwhite-50 dark:bg-zinc-950 p-2.5 border border-offwhite-200 dark:border-zinc-800">
                <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-zinc-300 block">Anchor State</span>
                <span className="font-mono text-[11px] font-semibold text-success-600 dark:text-emerald-400 truncate block mt-0.5">Immutable Status Valid</span>
              </div>
            </div>
          </div>

          {/* Security Standards Bar */}
          <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-4 text-left">
            <div className="card-interactive rounded-xl border border-offwhite-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4 shadow-card hover:border-slate-300 dark:hover:border-zinc-700">
              <div className="flex items-center space-x-2 text-trust-600 dark:text-zinc-200 mb-1">
                <Fingerprint className="h-4 w-4" />
                <span className="text-xs font-bold text-navy-900 dark:text-white">W3C DIDs</span>
              </div>
              <p className="text-xs text-slate-500 dark:text-zinc-200 font-normal">Ed25519 cryptographic keypairs and resolvable DID documents.</p>
            </div>

            <div className="card-interactive rounded-xl border border-offwhite-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4 shadow-card hover:border-slate-300 dark:hover:border-zinc-700">
              <div className="flex items-center space-x-2 text-success-600 dark:text-zinc-200 mb-1">
                <Award className="h-4 w-4" />
                <span className="text-xs font-bold text-navy-900 dark:text-white">Verifiable Credentials</span>
              </div>
              <p className="text-xs text-slate-500 dark:text-zinc-200 font-normal">Tamper-evident JSON-LD credentials signed by accredited issuers.</p>
            </div>

            <div className="card-interactive rounded-xl border border-offwhite-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4 shadow-card hover:border-slate-300 dark:hover:border-zinc-700">
              <div className="flex items-center space-x-2 text-navy-900 dark:text-zinc-200 mb-1">
                <Lock className="h-4 w-4" />
                <span className="text-xs font-bold text-navy-900 dark:text-white">Zero-Knowledge</span>
              </div>
              <p className="text-xs text-slate-500 dark:text-zinc-200 font-normal">AES-256-GCM client-side encryption. Zero plaintext on servers.</p>
            </div>

            <div className="card-interactive rounded-xl border border-offwhite-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4 shadow-card hover:border-slate-300 dark:hover:border-zinc-700">
              <div className="flex items-center space-x-2 text-amber-600 dark:text-zinc-200 mb-1">
                <Cpu className="h-4 w-4" />
                <span className="text-xs font-bold text-navy-900 dark:text-white">Blockchain Anchors</span>
              </div>
              <p className="text-xs text-slate-500 dark:text-zinc-200 font-normal">EVM smart contracts store status hashes only. Zero PII on-chain.</p>
            </div>
          </div>
        </section>

        {/* Philosophy & Architecture Section */}
        <section className="border-t border-offwhite-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 py-16">
          <div className="mx-auto max-w-5xl px-6">
            <div className="text-center mb-12">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-300">
                Core Principles
              </span>
              <h2 className="text-2xl font-bold text-navy-900 dark:text-white sm:text-3xl mt-1">
                Engineered for Privacy, Sovereignty & High Integrity
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="space-y-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-offwhite-100 dark:bg-zinc-900 text-trust-600 dark:text-zinc-200 border border-transparent dark:border-zinc-800">
                  <Share2 className="h-5 w-5" />
                </div>
                <h3 className="text-base font-bold text-navy-900 dark:text-white">Selective Disclosure</h3>
                <p className="text-xs text-slate-600 dark:text-zinc-200 leading-relaxed">
                  Share exact proofs—such as proving you hold an active professional license or are over 21—without exposing your full name, SSN, or home address.
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-offwhite-100 dark:bg-zinc-900 text-success-600 dark:text-zinc-200 border border-transparent dark:border-zinc-800">
                  <CheckCircle2 className="h-5 w-5" />
                </div>
                <h3 className="text-base font-bold text-navy-900 dark:text-white">Instant Verification</h3>
                <p className="text-xs text-slate-600 dark:text-zinc-200 leading-relaxed">
                  Cryptographically inspect any credential without calling external authorities. Signatures and canonical JSON representations verify in milliseconds.
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-offwhite-100 dark:bg-zinc-900 text-navy-900 dark:text-zinc-200 border border-transparent dark:border-zinc-800">
                  <Database className="h-5 w-5" />
                </div>
                <h3 className="text-base font-bold text-navy-900 dark:text-white">Off-Chain Data Protection</h3>
                <p className="text-xs text-slate-600 dark:text-zinc-200 leading-relaxed">
                  Your identity records reside in your personal encrypted vault. Blockchains are utilized exclusively as immutable trust anchors for status checking.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Calm Footer */}
      <footer className="border-t border-offwhite-200 dark:border-zinc-800 bg-offwhite-100 dark:bg-zinc-950 py-8 transition-colors">
        <div className="mx-auto max-w-7xl px-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 dark:text-zinc-300 gap-4">
          <div className="flex items-center space-x-2">
            <Shield className="h-4 w-4 text-trust-600 dark:text-zinc-300" />
            <span className="font-semibold text-navy-900 dark:text-white">IDone</span>
            <span>— Decentralized Identity Vault</span>
          </div>
          <div>
            <span>Built with strict security primitives • RFC 8785 • W3C VC 1.1 • Ed25519</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
