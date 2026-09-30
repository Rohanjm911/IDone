"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Shield, Lock, ArrowRight, AlertCircle, CheckCircle2 } from "lucide-react";
import { Logo } from "@/components/Logo";
import { registerUser } from "@/lib/api";
import { ThemeToggle } from "@/components/ThemeToggle";

export default function RegisterPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Master passphrases do not match.");
      return;
    }
    if (password.length < 8) {
      setError("Passphrase must be at least 8 characters long.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await registerUser({
        full_name: fullName,
        email,
        password,
        confirm_password: confirmPassword,
      });
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message || "Registration failed. Try a different email.");
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    document.title = "Create Sovereign Identity | IDone";
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F5F5F7] dark:bg-[#000000] px-4 py-12 transition-colors duration-300 relative overflow-hidden">
      <title>Create Sovereign Identity | IDone</title>

      {/* Ambient Color Glow Orbs */}
      <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-gradient-to-br from-[#0071E3]/20 via-[#AF52DE]/15 to-transparent blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-gradient-to-tl from-[#34C759]/15 via-[#00C7BE]/15 to-transparent blur-3xl pointer-events-none"></div>

      {/* Floating Theme Switcher */}
      <div className="absolute top-6 right-6 z-10">
        <ThemeToggle />
      </div>

      <div className="w-full max-w-md space-y-6 relative z-10">
        {/* Header */}
        <div className="text-center">
          <Link href="/" className="inline-flex items-center justify-center">
            <Logo variant="main" size="md" priority />
          </Link>
          <h2 className="mt-5 text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">
            Initialize Sovereign Identity
          </h2>
          <p className="mt-1.5 text-xs text-neutral-500 dark:text-neutral-400">
            Generate your W3C DID, cryptographic keypairs, and encrypted digital vault.
          </p>
        </div>

        {/* Card */}
        <div className="apple-card-holo p-8 shadow-2xl relative overflow-hidden">
          {/* Top Rainbow Accent Ribbon */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#0071E3] via-[#AF52DE] to-[#34C759]"></div>

          {error && (
            <div className="mb-5 flex items-start space-x-2.5 rounded-2xl bg-rose-500/10 p-3.5 text-xs text-rose-600 dark:text-rose-400 border border-rose-500/20">
              <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5">
                Legal or Primary Name
              </label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Alice Nakamoto"
                className="w-full rounded-xl border border-black/[0.1] dark:border-white/[0.12] bg-black/[0.02] dark:bg-white/[0.04] px-4 py-2.5 text-xs text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#0071E3]/40 focus:border-[#0071E3] transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5">
                Vault Identifier Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="alice@example.com"
                className="w-full rounded-xl border border-black/[0.1] dark:border-white/[0.12] bg-black/[0.02] dark:bg-white/[0.04] px-4 py-2.5 text-xs text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#0071E3]/40 focus:border-[#0071E3] transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5">
                Master Passphrase
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimum 8 characters"
                className="w-full rounded-xl border border-black/[0.1] dark:border-white/[0.12] bg-black/[0.02] dark:bg-white/[0.04] px-4 py-2.5 text-xs text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#0071E3]/40 focus:border-[#0071E3] transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5">
                Confirm Master Passphrase
              </label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter passphrase"
                className="w-full rounded-xl border border-black/[0.1] dark:border-white/[0.12] bg-black/[0.02] dark:bg-white/[0.04] px-4 py-2.5 text-xs text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#0071E3]/40 focus:border-[#0071E3] transition-all"
              />
            </div>

            {/* Apple Style Security Guarantee Box */}
            <div className="rounded-2xl bg-black/[0.02] dark:bg-white/[0.03] p-3.5 border border-black/[0.05] dark:border-white/[0.07] text-[11px] text-neutral-500 dark:text-neutral-400 space-y-1">
              <div className="flex items-center space-x-1.5 text-neutral-900 dark:text-white font-semibold">
                <CheckCircle2 className="h-3.5 w-3.5 text-[#34C759] dark:text-[#30D158]" />
                <span>Argon2id & AES-256-GCM Guaranteed</span>
              </div>
              <p>Your password is derived via memory-hard Argon2id. Private keys never leave your device.</p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="apple-btn-primary w-full py-3 text-xs shadow-md mt-2 disabled:opacity-50"
            >
              <Lock className="h-3.5 w-3.5 mr-1.5" />
              <span>{loading ? "Generating Ed25519 & Initializing Vault..." : "Initialize Identity Vault"}</span>
            </button>
          </form>
        </div>

        {/* Login Link */}
        <p className="text-center text-xs text-neutral-500 dark:text-neutral-400">
          Already established an identity vault?{" "}
          <Link href="/login" className="font-semibold text-[#0071E3] dark:text-[#0A84FF] hover:underline">
            Unlock Existing Vault
          </Link>
        </p>
      </div>
    </div>
  );
}
