"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  History,
  ShieldCheck,
  Filter,
  ArrowUpDown,
  Search,
  CheckCircle2
} from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Sidebar } from "@/components/Sidebar";
import { ActivityItem } from "@/components/ActivityItem";
import {
  getCurrentUser,
  getActivityTimeline,
  User,
  Activity
} from "@/lib/api";

export default function ActivityPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [filterType, setFilterType] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = "Security Audit Trail | IDone";
    const loadData = async () => {
      try {
        const u = await getCurrentUser();
        setUser(u);
        const acts = await getActivityTimeline();
        setActivities(acts);
      } catch (err) {
        router.push("/login");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [router]);

  const filtered = activities.filter((act) => {
    const matchesFilter =
      filterType === "ALL" ||
      (filterType === "IDENTITY" && act.action_type.includes("IDENTITY")) ||
      (filterType === "CREDENTIAL" && act.action_type.includes("CREDENTIAL")) ||
      (filterType === "VAULT" && act.action_type.includes("VAULT"));

    const matchesSearch =
      act.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      act.action_type.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  return (
    <div className="flex min-h-screen flex-col bg-[#F5F5F7] dark:bg-[#000000] text-neutral-900 dark:text-white transition-colors duration-300">
      <title>Security Audit Trail | IDone</title>
      <Navbar user={user} />

      <div className="flex flex-1">
        <Sidebar />

        <main className="flex-1 p-6 md:p-8 max-w-5xl min-w-0">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400">
                Security Audit Log
              </span>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-neutral-900 dark:text-white mt-0.5">
                Audit Trail & Historical Activity
              </h1>
            </div>

            <div className="flex items-center space-x-2">
              <span className="inline-flex items-center rounded-full bg-[#34C759]/10 px-3 py-1 text-xs font-semibold text-[#28A745] dark:text-[#30D158] border border-[#34C759]/20 shadow-xs">
                <span className="h-1.5 w-1.5 rounded-full bg-[#34C759] mr-1.5 shadow-[0_0_6px_#34C759]"></span>
                Tamper-Resistant Logging Active
              </span>
            </div>
          </div>

          {/* Search & Filter Bar */}
          <div className="apple-card p-3.5 mb-6 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-72">
              <Search className="h-4 w-4 text-neutral-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search audit trail..."
                className="w-full rounded-xl border border-black/[0.08] dark:border-white/[0.1] bg-black/[0.02] dark:bg-white/[0.03] pl-9 pr-3.5 py-1.5 text-xs text-neutral-900 dark:text-neutral-100 focus:border-[#0071E3] focus:outline-none transition-colors"
              />
            </div>

            <div className="flex items-center space-x-1.5 overflow-x-auto w-full sm:w-auto p-1 rounded-2xl bg-black/[0.03] dark:bg-white/[0.05]">
              {["ALL", "IDENTITY", "CREDENTIAL", "VAULT"].map((type) => (
                <button
                  key={type}
                  onClick={() => setFilterType(type)}
                  className={`rounded-xl px-3 py-1 text-xs font-semibold transition-all ${
                    filterType === type
                      ? "bg-[#FF2D55] text-white shadow-xs"
                      : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
                  }`}
                >
                  {type === "ALL" ? "All Logs" : type.charAt(0) + type.slice(1).toLowerCase()}
                </button>
              ))}
            </div>
          </div>

          {/* Audit List */}
          <div className="apple-card p-6">
            {loading ? (
              <div className="space-y-4 animate-pulse">
                <div className="h-12 bg-black/[0.04] dark:bg-white/[0.06] rounded-xl"></div>
                <div className="h-12 bg-black/[0.04] dark:bg-white/[0.06] rounded-xl"></div>
                <div className="h-12 bg-black/[0.04] dark:bg-white/[0.06] rounded-xl"></div>
              </div>
            ) : filtered.length === 0 ? (
              <div className="py-12 text-center">
                <History className="h-8 w-8 text-neutral-400 mx-auto mb-2" />
                <p className="text-sm font-bold text-neutral-900 dark:text-white">No matching security events</p>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 max-w-sm mx-auto">
                  Actions such as key rotations, credential issuances, and vault modifications will appear here.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-black/[0.04] dark:divide-white/[0.06]">
                {filtered.map((activity) => (
                  <ActivityItem key={activity.id} activity={activity} />
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
