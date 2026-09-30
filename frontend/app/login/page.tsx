"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Shield, Lock, ArrowRight, AlertCircle, Sparkles } from "lucide-react";
import { Logo } from "@/components/Logo";
import { loginUser, registerUser } from "@/lib/api";
import { ThemeToggle } from "@/components/ThemeToggle";

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
      setError(err.message || "Invalid email or master passphrase. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const fillDemoAccount = async () => {
    setEmail("alice@idone.crypto");
    setPassword("MasterVaultKey#2026");
    setLoading(true);
    setError("");
    try {
      await loginUser({ email: "alice@idone.crypto", password: "MasterVaultKey#2026" });
      router.push("/dashboard");
    } catch {
      try {
        await registerUser({
          full_name: "Alice Nakamoto",
          email: "alice@idone.crypto",
          password: "MasterVaultKey#2026",
          confirm_password: "MasterVaultKey#2026"
        });
        await loginUser({ email: "alice@idone.crypto", password: "MasterVaultKey#2026" });
        router.push("/dashboard");
      } catch (err: any) {
        setError(err.message || "Demo sign-in failed.");
      }
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    document.title = "Sign In | IDone Vault";
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F5F5F7] dark:bg-[#000000] px-4 py-12 transition-colors duration-300 relative overflow-hidden">
      <title>Sign In | IDone Vault</title>

      {/* Ambient Color Glow Orbs */}
      <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-gradient-to-br from-[#0071E3]/20 via-[#AF52DE]/15 to-transparent blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-gradient-to-tl from-[#34C759]/15 via-[#00C7BE]/15 to-transparent blur-3xl pointer-events-none"></div>

      {/* Floating Theme Switcher */}
      <div className="absolute top-6 right-6 z-10">
        <ThemeToggle />
      </div>

      <div className="w-full max-w-md space-y-6 relative z-10">
        {/* Brand Header */}
        <div className="text-center">
          <Link href="/" className="inline-flex items-center justify-center">
            <Logo variant="main" size="md" priority />
          </Link>
          <h2 className="mt-5 text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">
            Unlock Sovereign Vault
          </h2>
          <p className="mt-1.5 text-xs text-neutral-500 dark:text-neutral-400">
            Authenticate with your master passphrase to decrypt your local keys.
          </p>
        </div>

        {/* Apple ID Style Card */}
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
                Vault Account Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full rounded-xl border border-black/[0.1] dark:border-white/[0.12] bg-black/[0.02] dark:bg-white/[0.04] px-4 py-2.5 text-xs text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#0071E3]/40 focus:border-[#0071E3] transition-all"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                  Master Passphrase
                </label>
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full rounded-xl border border-black/[0.1] dark:border-white/[0.12] bg-black/[0.02] dark:bg-white/[0.04] px-4 py-2.5 text-xs text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#0071E3]/40 focus:border-[#0071E3] transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="apple-btn-primary w-full py-3 text-xs shadow-md mt-2 disabled:opacity-50"
            >
              <Lock className="h-3.5 w-3.5 mr-1.5" />
              <span>{loading ? "Decrypting Vault Keys..." : "Decrypt & Enter Vault"}</span>
            </button>
          </form>

          {/* Quick Demo Login */}
          <div className="mt-6 pt-5 border-t border-black/[0.05] dark:border-white/[0.07]">
            <button
              type="button"
              onClick={fillDemoAccount}
              disabled={loading}
              className="apple-btn-secondary w-full py-2.5 text-xs text-[#0071E3] dark:text-[#0A84FF] hover:bg-[#0071E3]/10 dark:hover:bg-[#0A84FF]/10"
            >
              <Sparkles className="h-3.5 w-3.5 mr-1.5" />
              <span>Instant Demo Sign-in (Alice Nakamoto)</span>
            </button>
          </div>
        </div>

        {/* Register Prompt */}
        <p className="text-center text-xs text-neutral-500 dark:text-neutral-400">
          New to IDone?{" "}
          <Link
            href="/register"
            className="font-semibold text-[#0071E3] dark:text-[#0A84FF] hover:underline"
          >
            Create a sovereign identity
          </Link>
        </p>
      </div>
    </div>
  );
}
