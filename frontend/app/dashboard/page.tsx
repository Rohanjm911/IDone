"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Award,
  Lock,
  Plus,
  ArrowRight,
  ShieldCheck,
  CheckCheck,
  Activity as ActivityIcon
} from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Sidebar } from "@/components/Sidebar";
import { IdentityBadge } from "@/components/IdentityBadge";
import { SecurityHealthCard } from "@/components/SecurityHealthCard";
import { CredentialCard } from "@/components/CredentialCard";
import { ActivityItem } from "@/components/ActivityItem";
import { ShareModal } from "@/components/ShareModal";
import {
  getCurrentUser,
  getIdentity,
  getSecurityStatus,
  getCredentials,
  getActivityTimeline,
  rotateIdentityKey,
  deleteCredential,
  revokeCredential,
  User,
  Identity,
  SecurityStatus,
  Credential,
  Activity
} from "@/lib/api";

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [identity, setIdentity] = useState<Identity | null>(null);
  const [securityStatus, setSecurityStatus] = useState<SecurityStatus | null>(null);
  const [credentials, setCredentials] = useState<Credential[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [rotatingKey, setRotatingKey] = useState(false);
  const [sharingCredential, setSharingCredential] = useState<Credential | null>(null);

  useEffect(() => {
    document.title = "Command Center Dashboard | IDone";
    const loadData = async () => {
      try {
        const u = await getCurrentUser();
        setUser(u);

        const [id, sec, creds, acts] = await Promise.all([
          getIdentity(),
          getSecurityStatus(),
          getCredentials(),
          getActivityTimeline(),
        ]);

        setIdentity(id);
        setSecurityStatus(sec);
        setCredentials(creds);
        setActivities(acts);
      } catch (err) {
        console.warn("Authentication failed, redirecting to login:", err);
        router.push("/login");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [router]);

  const handleRotateKey = async () => {
    if (!confirm("Are you sure you want to rotate your Ed25519 keypair? Your DID verification method will be updated.")) {
      return;
    }
    setRotatingKey(true);
    try {
      const updated = await rotateIdentityKey();
      setIdentity(updated);
      const acts = await getActivityTimeline();
      setActivities(acts);
    } catch (err: any) {
      alert(err.message || "Failed to rotate key");
    } finally {
      setRotatingKey(false);
    }
  };

  const handleDeleteCred = async (id: string) => {
    if (!confirm("Remove this credential from your vault?")) return;
    try {
      await deleteCredential(id);
      setCredentials(credentials.filter((c) => c.id !== id));
      const sec = await getSecurityStatus();
      setSecurityStatus(sec);
    } catch (err: any) {
      alert(err.message || "Failed to remove credential");
    }
  };

  const handleRevokeCred = async (credential: Credential) => {
    const reason = prompt(`Enter revocation reason for '${credential.title}':`, "Holder request");
    if (!reason) return;
    try {
      await revokeCredential(credential.id, reason);
      const updated = await getCredentials();
      setCredentials(updated);
      const sec = await getSecurityStatus();
      setSecurityStatus(sec);
      const acts = await getActivityTimeline();
      setActivities(acts);
    } catch (err: any) {
      alert(err.message || "Revocation failed");
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#F5F5F7] dark:bg-[#000000] text-neutral-900 dark:text-white transition-colors duration-300">
      <title>Command Center Dashboard | IDone</title>
      <Navbar user={user} />

      <div className="flex flex-1">
        <Sidebar />

        <main className="flex-1 p-6 md:p-8 max-w-7xl min-w-0">
          {/* Welcome & Command Center Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-7">
            <div className="space-y-0.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                Sovereign Command Center
              </span>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-neutral-900 dark:text-white">
                Welcome back, {user ? user.full_name : "Holder"}
              </h1>
            </div>

            {/* Apple Quick Action Buttons */}
            <div className="flex items-center space-x-2.5">
              <Link
                href="/credentials"
                className="apple-btn-primary px-4 py-2 text-xs shadow-xs"
              >
                <Plus className="h-3.5 w-3.5 mr-1.5" />
                <span>Issue Credential</span>
              </Link>
              <Link
                href="/vault"
                className="apple-btn-secondary px-4 py-2 text-xs"
              >
                <Lock className="h-3.5 w-3.5 mr-1.5 text-[#0071E3] dark:text-[#0A84FF]" />
                <span>Encrypted Locker</span>
              </Link>
            </div>
          </div>

          {/* Identity & DID Banner */}
          {identity && (
            <div className="mb-7">
              <IdentityBadge
                identity={identity}
                onRotateKey={handleRotateKey}
                isRotating={rotatingKey}
              />
            </div>
          )}

          {/* Security Health Radar */}
          <div className="mb-8">
            <SecurityHealthCard status={securityStatus} loading={loading} />
          </div>

          {/* Grid Layout: Recent Credentials (2/3) + Activity Audit (1/3) */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Credentials Column */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-base font-bold text-neutral-900 dark:text-white">
                    Vault Credentials ({credentials.length})
                  </h2>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">
                    Cryptographically authenticated W3C Verifiable Credentials
                  </p>
                </div>
                <Link
                  href="/credentials"
                  className="inline-flex items-center space-x-1 text-xs font-medium text-[#0071E3] dark:text-[#0A84FF] hover:underline"
                >
                  <span>View all</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>

              {credentials.length === 0 ? (
                <div className="apple-card p-10 text-center border-dashed border-black/[0.08] dark:border-white/[0.1]">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#0071E3]/10 text-[#0071E3] dark:text-[#0A84FF] mx-auto mb-3">
                    <Award className="h-6 w-6" />
                  </div>
                  <p className="text-sm font-semibold text-neutral-900 dark:text-white">No credentials stored yet</p>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 max-w-sm mx-auto">
                    Issue an accredited verifiable credential or import an existing JSON-LD cryptographic proof.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {credentials.slice(0, 4).map((cred) => (
                    <CredentialCard
                      key={cred.id}
                      credential={cred}
                      onShare={(c) => setSharingCredential(c)}
                      onRevoke={handleRevokeCred}
                      onDelete={handleDeleteCred}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Audit & Activity Timeline Column */}
            <div>
              <div className="apple-card p-5">
                <div className="flex items-center justify-between pb-3.5 border-b border-black/[0.05] dark:border-white/[0.07]">
                  <div className="flex items-center space-x-2">
                    <ActivityIcon className="h-4 w-4 text-[#0071E3] dark:text-[#0A84FF]" />
                    <h3 className="text-sm font-bold text-neutral-900 dark:text-white">Security Audit Log</h3>
                  </div>
                  <Link
                    href="/activity"
                    className="text-[11px] font-semibold text-[#0071E3] dark:text-[#0A84FF] hover:underline"
                  >
                    All Logs
                  </Link>
                </div>

                <div className="mt-2 divide-y divide-black/[0.04] dark:divide-white/[0.06] max-h-[380px] overflow-y-auto">
                  {activities.length === 0 ? (
                    <p className="py-8 text-center text-xs text-neutral-400">
                      No security events recorded yet.
                    </p>
                  ) : (
                    activities.slice(0, 6).map((act) => (
                      <ActivityItem key={act.id} activity={act} />
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Selective Disclosure Modal */}
      {sharingCredential && (
        <ShareModal
          credential={sharingCredential}
          onClose={() => setSharingCredential(null)}
        />
      )}
    </div>
  );
}
