"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Shield, Lock, ArrowRight, AlertCircle } from "lucide-react";
import { loginUser, registerUser } from "@/lib/api";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await loginUser({ email, password });
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message || "Failed to authenticate. Check credentials.");
    } finally {
      setLoading(false);
    }
  };

  const fillDemoAccount = async () => {
    setEmail("alice@idone.vault");
    setPassword("MasterPassword123!");
    setLoading(true);
    setError("");
    try {
      // First try login, if not present create demo account
      try {
        await loginUser({ email: "alice@idone.vault", password: "MasterPassword123!" });
      } catch {
        await registerUser({
          full_name: "Alice Nakamoto",
          email: "alice@idone.vault",
          password: "MasterPassword123!",
          confirm_password: "MasterPassword123!",
        });
      }
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message || "Demo sign-in failed.");
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    document.title = "Sign In | IDone Vault";
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center bg-offwhite-50 px-4 py-12">
      <title>Sign In | IDone Vault</title>
      <div className="w-full max-w-md space-y-6">
        {/* Brand Header */}
        <div className="text-center">
          <Link href="/" className="inline-flex items-center space-x-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-navy-900 text-white">
              <Shield className="h-5 w-5 text-trust-600" />
            </div>
            <span className="text-2xl font-bold tracking-tight text-navy-900">IDone</span>
          </Link>
          <h2 className="mt-4 text-xl font-bold text-navy-900">Unlock Sovereign Vault</h2>
          <p className="mt-1 text-xs text-slate-500">
            Sign in with your master passphrase to decrypt your decentralized identity.
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
                Vault Account Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full rounded-lg border border-offwhite-200 px-3.5 py-2.5 text-xs text-navy-900 focus:border-trust-600 focus:outline-none transition-colors"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-navy-900">
                  Master Passphrase
                </label>
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full rounded-lg border border-offwhite-200 px-3.5 py-2.5 text-xs text-navy-900 focus:border-trust-600 focus:outline-none transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-press flex w-full items-center justify-center space-x-2 rounded-lg bg-navy-900 py-2.5 text-xs font-semibold text-white hover:bg-navy-800 disabled:opacity-50 shadow-xs"
            >
              <Lock className="h-3.5 w-3.5 text-trust-600" />
              <span>{loading ? "Authenticating & Decrypting..." : "Decrypt & Enter Vault"}</span>
            </button>
          </form>

          {/* Quick Demo Login */}
          <div className="mt-5 pt-4 border-t border-offwhite-200">
            <button
              type="button"
              onClick={fillDemoAccount}
              disabled={loading}
              className="btn-press flex w-full items-center justify-center space-x-2 rounded-lg border border-trust-100 bg-trust-50 py-2 text-xs font-semibold text-trust-700 hover:bg-trust-100"
            >
              <span>Instant Demo Sign-in (Alice Nakamoto)</span>
            </button>
          </div>
        </div>

        {/* Register Prompt */}
        <p className="text-center text-xs text-slate-500">
          Do not possess a sovereign vault yet?{" "}
          <Link href="/register" className="font-semibold text-trust-600 hover:underline">
            Initialize New Identity
          </Link>
        </p>
      </div>
    </div>
  );
}
