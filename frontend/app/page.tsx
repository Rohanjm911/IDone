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
  Cpu,
  Sparkles,
  Layers,
  KeyRound,
  ShieldCheck
} from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Logo } from "@/components/Logo";

export default function HomePage() {
  React.useEffect(() => {
    document.title = "IDone — Decentralized Identity Vault";
  }, []);

  return (
    <div className="min-h-screen bg-[#F5F5F7] dark:bg-[#000000] text-neutral-900 dark:text-white flex flex-col justify-between transition-colors duration-300">
      <title>IDone — Decentralized Identity Vault</title>

      {/* Apple Frosted Glass Navigation Bar */}
      <header className="sticky top-0 z-40 apple-glass transition-all duration-300">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-6">
          <div className="flex items-center space-x-6">
            <Link href="/" className="inline-flex items-center group">
              <Logo variant="main" size="sm" priority />
            </Link>

            <nav className="hidden md:flex items-center space-x-5 text-xs font-medium text-neutral-600 dark:text-neutral-400">
              <a href="#overview" className="hover:text-neutral-900 dark:hover:text-white transition-colors">Overview</a>
              <a href="#architecture" className="hover:text-neutral-900 dark:hover:text-white transition-colors">Architecture</a>
              <Link href="/vault" className="hover:text-neutral-900 dark:hover:text-white transition-colors">Vault</Link>
              <Link href="/verify" className="hover:text-neutral-900 dark:hover:text-white transition-colors">Verify</Link>
            </nav>
          </div>

          <div className="flex items-center space-x-3 sm:space-x-4">
            <Link
              href="/login"
              className="text-xs font-medium text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/register"
              className="apple-btn-primary px-4 py-1.5 text-xs shadow-xs"
            >
              Open Vault
            </Link>

            {/* iOS Theme Switcher */}
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1" id="overview">
        <section className="mx-auto max-w-5xl px-6 pt-16 pb-16 text-center apple-mesh-hero relative">
          {/* Apple Pill Badge with Vibrant Glow */}
          <div className="inline-flex items-center space-x-2 rounded-full border border-blue-500/20 bg-blue-500/[0.06] dark:bg-blue-500/[0.12] backdrop-blur-md px-4 py-1.5 text-xs font-semibold text-blue-700 dark:text-blue-300 mb-8 shadow-xs">
            <span className="h-2 w-2 rounded-full bg-[#0071E3] dark:bg-[#0A84FF] animate-pulse shadow-[0_0_8px_#0A84FF]"></span>
            <span>Decentralized Identity Vault & W3C Verifiable Credentials</span>
          </div>

          {/* Apple Style Headline with Rainbow Gradient */}
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-neutral-900 dark:text-white leading-[1.08]">
            Your Identity. <br />
            <span className="apple-vibrant-rainbow">
              Pure Sovereignty.
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-base sm:text-lg text-neutral-600 dark:text-neutral-400 leading-relaxed font-normal">
            A privacy-first digital identity vault combining the elegance of Apple Wallet,
            the cryptographic security of hardware keys, and the defensive precision of enterprise zero-knowledge architecture.
          </p>

          {/* Apple Primary CTAs */}
          <div className="mt-9 flex flex-col sm:flex-row items-center justify-center gap-3.5">
            <Link
              href="/register"
              className="apple-btn-primary w-full sm:w-auto px-7 py-3 text-sm font-semibold shadow-md shadow-blue-500/25 hover:shadow-blue-500/40"
            >
              <span>Initialize Sovereign Identity</span>
              <ArrowRight className="h-4 w-4 ml-2" />
            </Link>
            <Link
              href="/verify"
              className="apple-btn-secondary w-full sm:w-auto px-7 py-3 text-sm font-semibold hover:border-blue-500/30"
            >
              <span>Public Verification Engine</span>
            </Link>
          </div>

          {/* Apple Wallet Holographic Card Simulation */}
          <div className="mt-14 max-w-2xl mx-auto text-left">
            <div className="apple-wallet-pass apple-card-holo p-6 md:p-8 bg-gradient-to-br from-white via-white to-blue-500/[0.04] dark:from-[#18181A] dark:via-[#161618] dark:to-blue-900/15 shadow-2xl relative overflow-hidden group">
              {/* Dynamic Top Rainbow Gradient Ribbon */}
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#0071E3] via-[#AF52DE] to-[#34C759]"></div>

              {/* Ambient Glow Orbs */}
              <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-gradient-to-br from-[#0071E3]/20 via-[#AF52DE]/15 to-transparent blur-3xl pointer-events-none"></div>

              {/* Card Header */}
              <div className="flex items-center justify-between pb-5 border-b border-black/[0.05] dark:border-white/[0.07] relative z-10">
                <div className="flex items-center space-x-3.5">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-tr from-[#0071E3] to-[#5AC8FA] text-white shadow-md shadow-blue-500/25">
                    <ShieldCheck className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                      IDone Sovereign Pass
                    </span>
                    <h3 className="text-sm font-bold text-neutral-900 dark:text-white">
                      Cryptographic Identity Anchor
                    </h3>
                  </div>
                </div>

                <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400 border border-emerald-500/25 shadow-xs">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#34C759] mr-1.5 shadow-[0_0_6px_#34C759]"></span>
                  Verified Active
                </span>
              </div>

              {/* Card Body */}
              <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-3 relative z-10">
                <div className="rounded-2xl bg-blue-500/[0.04] dark:bg-blue-500/[0.08] p-3 border border-blue-500/15">
                  <span className="text-[10px] uppercase font-bold text-blue-600 dark:text-blue-400 block">Identifier</span>
                  <span className="font-mono text-xs font-semibold text-neutral-900 dark:text-white truncate block mt-0.5">
                    did:idone:quantum-01
                  </span>
                </div>
                <div className="rounded-2xl bg-purple-500/[0.04] dark:bg-purple-500/[0.08] p-3 border border-purple-500/15">
                  <span className="text-[10px] uppercase font-bold text-purple-600 dark:text-purple-400 block">Signature Suite</span>
                  <span className="font-mono text-xs font-semibold text-neutral-900 dark:text-white truncate block mt-0.5">
                    Ed25519-RFC8785
                  </span>
                </div>
                <div className="rounded-2xl bg-emerald-500/[0.04] dark:bg-emerald-500/[0.08] p-3 border border-emerald-500/15">
                  <span className="text-[10px] uppercase font-bold text-emerald-600 dark:text-emerald-400 block">Blockchain Anchor</span>
                  <span className="font-mono text-xs font-semibold text-[#34C759] dark:text-[#30D158] truncate block mt-0.5">
                    0xe7f172...0512
                  </span>
                </div>
              </div>

              {/* Apple Wallet Barcode / NFC Strip */}
              <div className="mt-4 flex items-center justify-between px-1 text-[10px] font-mono text-neutral-400 dark:text-neutral-500 border-t border-dashed border-black/[0.08] dark:border-white/[0.1] pt-3 relative z-10">
                <span className="flex items-center gap-1.5">
                  <span className="inline-block h-2 w-2 rounded-full bg-emerald-500"></span>
                  <span>W3C SECURE ELEMENT • READY</span>
                </span>
                <span className="tracking-widest opacity-80 font-bold">|||| | ||| | |||||</span>
              </div>
            </div>
          </div>

          {/* Apple Keynote Hardware-Grade Security Metric Strip */}
          <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6 text-center border-y border-black/[0.06] dark:border-white/[0.08] py-10 bg-black/[0.015] dark:bg-white/[0.02] rounded-3xl">
            <div>
              <div className="text-3xl md:text-5xl font-extrabold tracking-tight text-neutral-900 dark:text-white">
                256<span className="text-[#0071E3] dark:text-[#0A84FF] text-2xl md:text-3xl font-bold">-bit</span>
              </div>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 font-medium">
                Authenticated AES-GCM Cipher
              </p>
            </div>
            <div>
              <div className="text-3xl md:text-5xl font-extrabold tracking-tight text-neutral-900 dark:text-white">
                0<span className="text-[#34C759] dark:text-[#30D158] text-2xl md:text-3xl font-bold"> Knowledge</span>
              </div>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 font-medium">
                Client-Side Cryptographic Isolation
              </p>
            </div>
            <div>
              <div className="text-3xl md:text-5xl font-extrabold tracking-tight text-neutral-900 dark:text-white">
                100<span className="text-[#AF52DE] dark:text-[#BF5AF2] text-2xl md:text-3xl font-bold">%</span>
              </div>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 font-medium">
                W3C VC 1.1 & RFC 8785 Compliant
              </p>
            </div>
            <div>
              <div className="text-3xl md:text-5xl font-extrabold tracking-tight text-neutral-900 dark:text-white">
                0<span className="text-[#FF9500] dark:text-[#FF9F0A] text-2xl md:text-3xl font-bold"> PII</span>
              </div>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 font-medium">
                Exposed to Centralized Servers
              </p>
            </div>
          </div>
        </section>

        {/* Bento Grid: 6 Pillars of Sovereign Architecture */}
        <section className="mx-auto max-w-6xl px-6 py-20 border-t border-black/[0.05] dark:border-white/[0.07]" id="architecture">
          <div className="text-center mb-14 space-y-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
              Architecture & Security
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-neutral-900 dark:text-white">
              Engineered with Mathematical Precision.
            </h2>
            <p className="text-sm text-neutral-500 dark:text-neutral-400 max-w-xl mx-auto">
              Every layer of IDone is designed around zero-trust cryptography and user-owned cryptographic keys.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Bento Card 1: W3C DIDs (Royal Blue Theme) */}
            <div className="apple-card p-6 flex flex-col justify-between border border-blue-500/20 bg-gradient-to-b from-blue-500/[0.03] to-transparent hover:border-blue-500/50 hover:shadow-lg hover:shadow-blue-500/10 relative overflow-hidden group">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#0071E3] to-[#5AC8FA]"></div>
              <div>
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-tr from-[#0071E3] to-[#5AC8FA] text-white shadow-md shadow-blue-500/25 mb-4 group-hover:scale-105 transition-transform">
                  <Fingerprint className="h-5 w-5" />
                </div>
                <h3 className="text-base font-bold text-neutral-900 dark:text-white mb-1.5">
                  W3C Decentralized DIDs
                </h3>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
                  Cryptographically derived identifiers anchored by Ed25519 keypairs. Your identity lives on your device, not in a centralized silo.
                </p>
              </div>
              <div className="mt-5 pt-3 border-t border-blue-500/10 text-[11px] font-mono text-blue-600 dark:text-blue-400 font-medium">
                W3C DID v1.0 • RFC 8032
              </div>
            </div>

            {/* Bento Card 2: Verifiable Credentials (Sunset Amber Theme) */}
            <div className="apple-card p-6 flex flex-col justify-between border border-amber-500/20 bg-gradient-to-b from-amber-500/[0.03] to-transparent hover:border-amber-500/50 hover:shadow-lg hover:shadow-amber-500/10 relative overflow-hidden group">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#FF9500] to-[#FFCC00]"></div>
              <div>
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-tr from-[#FF9500] to-[#FFCC00] text-white shadow-md shadow-amber-500/25 mb-4 group-hover:scale-105 transition-transform">
                  <Award className="h-5 w-5" />
                </div>
                <h3 className="text-base font-bold text-neutral-900 dark:text-white mb-1.5">
                  Verifiable Credentials
                </h3>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
                  Tamper-evident digital certificates signed by accredited authorities using canonical JSON-LD serialization under RFC 8785.
                </p>
              </div>
              <div className="mt-5 pt-3 border-t border-amber-500/10 text-[11px] font-mono text-amber-600 dark:text-amber-400 font-medium">
                W3C VC 1.1 • RFC 8785 JCS
              </div>
            </div>

            {/* Bento Card 3: Zero-Knowledge Vault (Emerald Mint Theme) */}
            <div className="apple-card p-6 flex flex-col justify-between border border-emerald-500/20 bg-gradient-to-b from-emerald-500/[0.03] to-transparent hover:border-emerald-500/50 hover:shadow-lg hover:shadow-emerald-500/10 relative overflow-hidden group">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#34C759] to-[#30D158]"></div>
              <div>
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-tr from-[#34C759] to-[#30D158] text-white shadow-md shadow-emerald-500/25 mb-4 group-hover:scale-105 transition-transform">
                  <Lock className="h-5 w-5" />
                </div>
                <h3 className="text-base font-bold text-neutral-900 dark:text-white mb-1.5">
                  Zero-Knowledge Locker
                </h3>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
                  Client-side authenticated AES-256-GCM encryption with unique random IVs. Plaintext secrets never leave your local session.
                </p>
              </div>
              <div className="mt-5 pt-3 border-t border-emerald-500/10 text-[11px] font-mono text-emerald-600 dark:text-emerald-400 font-medium">
                AES-256-GCM • PBKDF2 / Argon2id
              </div>
            </div>

            {/* Bento Card 4: Blockchain Anchors (Violet/Purple Theme) */}
            <div className="apple-card p-6 flex flex-col justify-between border border-purple-500/20 bg-gradient-to-b from-purple-500/[0.03] to-transparent hover:border-purple-500/50 hover:shadow-lg hover:shadow-purple-500/10 relative overflow-hidden group">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#AF52DE] to-[#BF5AF2]"></div>
              <div>
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-tr from-[#AF52DE] to-[#BF5AF2] text-white shadow-md shadow-purple-500/25 mb-4 group-hover:scale-105 transition-transform">
                  <Cpu className="h-5 w-5" />
                </div>
                <h3 className="text-base font-bold text-neutral-900 dark:text-white mb-1.5">
                  EVM Blockchain Anchors
                </h3>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
                  Smart contracts register cryptographic status hashes only. Revocations are instantaneously verifiable without exposing PII.
                </p>
              </div>
              <div className="mt-5 pt-3 border-t border-purple-500/10 text-[11px] font-mono text-purple-600 dark:text-purple-400 font-medium">
                EIP-1056 • Sepolia Anchors
              </div>
            </div>

            {/* Bento Card 5: Selective Disclosure (Cyan/Sky Theme) */}
            <div className="apple-card p-6 flex flex-col justify-between border border-cyan-500/20 bg-gradient-to-b from-cyan-500/[0.03] to-transparent hover:border-cyan-500/50 hover:shadow-lg hover:shadow-cyan-500/10 relative overflow-hidden group">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#00C7BE] to-[#64D2FF]"></div>
              <div>
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-tr from-[#00C7BE] to-[#64D2FF] text-white shadow-md shadow-cyan-500/25 mb-4 group-hover:scale-105 transition-transform">
                  <Share2 className="h-5 w-5" />
                </div>
                <h3 className="text-base font-bold text-neutral-900 dark:text-white mb-1.5">
                  Selective Disclosure
                </h3>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
                  Share only what is required. Prove your age without revealing your birth date or full identity details to verifiers.
                </p>
              </div>
              <div className="mt-5 pt-3 border-t border-cyan-500/10 text-[11px] font-mono text-cyan-600 dark:text-cyan-400 font-medium">
                Zero Over-sharing • Privacy-First
              </div>
            </div>

            {/* Bento Card 6: Argon2id Master Passphrase (Rose/Pink Theme) */}
            <div className="apple-card p-6 flex flex-col justify-between border border-rose-500/20 bg-gradient-to-b from-rose-500/[0.03] to-transparent hover:border-rose-500/50 hover:shadow-lg hover:shadow-rose-500/10 relative overflow-hidden group">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#FF2D55] to-[#FF375F]"></div>
              <div>
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-tr from-[#FF2D55] to-[#FF375F] text-white shadow-md shadow-rose-500/25 mb-4 group-hover:scale-105 transition-transform">
                  <KeyRound className="h-5 w-5" />
                </div>
                <h3 className="text-base font-bold text-neutral-900 dark:text-white mb-1.5">
                  Argon2id Master Passphrase
                </h3>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
                  Memory-hard password hashing that defeats GPU and ASIC brute-force attacks, protecting your root recovery seed.
                </p>
              </div>
              <div className="mt-5 pt-3 border-t border-rose-500/10 text-[11px] font-mono text-rose-600 dark:text-rose-400 font-medium">
                RFC 9106 Winner • Memory-Hard
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Apple Minimalist Footer */}
      <footer className="border-t border-black/[0.05] dark:border-white/[0.07] bg-white/50 dark:bg-black/40 py-8 transition-colors">
        <div className="mx-auto max-w-7xl px-6 flex flex-col sm:flex-row items-center justify-between text-xs text-neutral-500 dark:text-neutral-400 gap-4">
          <div className="flex items-center space-x-2.5">
            <Logo variant="mark" size="xs" />
            <span className="font-semibold text-neutral-900 dark:text-white">IDone</span>
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
