"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Shield, Lock, ArrowRight, AlertCircle, CheckCircle2 } from "lucide-react";
import { registerUser } from "@/lib/api";

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
    <div className="flex min-h-screen items-center justify-center bg-offwhite-50 px-4 py-12">
      <title>Create Sovereign Identity | IDone</title>
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center">
          <Link href="/" className="inline-flex items-center space-x-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-navy-900 text-white">
              <Shield className="h-5 w-5 text-trust-600" />
            </div>
            <span className="text-2xl font-bold tracking-tight text-navy-900">IDone</span>
          </Link>
          <h2 className="mt-4 text-xl font-bold text-navy-900">Initialize Sovereign Identity</h2>
          <p className="mt-1 text-xs text-slate-500">
            Generate your W3C DID, cryptographic keypairs, and encrypted digital vault.
          </p>
        </div>

        {/* Card */}
        <div className="card-interactive animate-fade-slide-up rounded-xl border border-offwhite-200 bg-white p-7 shadow-card">
          {error && (
            <div className="mb-5 flex items-start space-x-2 rounded-lg bg-alert-50 p-3 text-xs text-alert-700 border border-alert-100 animate-fade-slide-down">
              <AlertCircle className="h-4 w-4 text-alert-600 flex-shrink-0 mt-0.5 animate-pop" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-navy-900 mb-1">
                Legal or Primary Name
              </label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Alice Nakamoto"
                className="w-full rounded-lg border border-offwhite-200 px-3.5 py-2 text-xs text-navy-900 focus:border-trust-600 focus:outline-none transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-navy-900 mb-1">
                Vault Identifier Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="alice@example.com"
                className="w-full rounded-lg border border-offwhite-200 px-3.5 py-2 text-xs text-navy-900 focus:border-trust-600 focus:outline-none transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-navy-900 mb-1">
                Master Passphrase
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimum 8 characters"
                className="w-full rounded-lg border border-offwhite-200 px-3.5 py-2 text-xs text-navy-900 focus:border-trust-600 focus:outline-none transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-navy-900 mb-1">
                Confirm Master Passphrase
              </label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter password"
                className="w-full rounded-lg border border-offwhite-200 px-3.5 py-2 text-xs text-navy-900 focus:border-trust-600 focus:outline-none transition-colors"
              />
            </div>

            {/* Security Guarantee */}
            <div className="rounded-lg bg-offwhite-50 p-3 border border-offwhite-200 text-[11px] text-slate-500 space-y-1">
              <div className="flex items-center space-x-1.5 text-navy-900 font-semibold">
                <CheckCircle2 className="h-3.5 w-3.5 text-success-600" />
                <span>Argon2id & AES-256-GCM Guaranteed</span>
              </div>
              <p>Your password is hashed with memory-hard Argon2id. Private keys are never stored in cleartext.</p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-press flex w-full items-center justify-center space-x-2 rounded-lg bg-navy-900 py-2.5 text-xs font-semibold text-white hover:bg-navy-800 disabled:opacity-50 shadow-xs"
            >
              <Lock className="h-3.5 w-3.5 text-trust-600" />
              <span>{loading ? "Generating Ed25519 & Initializing Vault..." : "Initialize Identity Vault"}</span>
            </button>
          </form>
        </div>

        {/* Login Link */}
        <p className="text-center text-xs text-slate-500">
          Already established an identity vault?{" "}
          <Link href="/login" className="font-semibold text-trust-600 hover:underline">
            Unlock Existing Vault
          </Link>
        </p>
      </div>
    </div>
  );
}
