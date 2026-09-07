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
    <div className="flex min-h-screen flex-col bg-offwhite-50">
      <title>Security Audit Trail | IDone</title>
      <Navbar user={user} />

      <div className="flex flex-1">
        <Sidebar />

        <main className="flex-1 p-6 md:p-8 max-w-5xl">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Security Audit Log
              </span>
              <h1 className="text-2xl font-extrabold tracking-tight text-navy-900 mt-0.5">
                Audit Trail & Historical Activity
              </h1>
            </div>

            <div className="flex items-center space-x-2">
              <span className="inline-flex items-center rounded-full bg-success-50 px-2.5 py-1 text-xs font-medium text-success-700 border border-success-100">
                <CheckCircle2 className="h-3.5 w-3.5 text-success-600 mr-1" />
                Tamper-Resistant Logging Active
              </span>
            </div>
          </div>

          {/* Search & Filter Bar */}
          <div className="animate-fade-slide-up rounded-xl border border-offwhite-200 bg-white p-4 shadow-card mb-6 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-72">
              <Search className="h-4 w-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search audit trail..."
                className="w-full rounded-lg border border-offwhite-200 pl-9 pr-3 py-1.5 text-xs text-navy-900 focus:border-trust-600 focus:outline-none transition-colors"
              />
            </div>

            <div className="flex items-center space-x-1.5 overflow-x-auto w-full sm:w-auto">
              {["ALL", "IDENTITY", "CREDENTIAL", "VAULT"].map((type) => (
                <button
                  key={type}
                  onClick={() => setFilterType(type)}
                  className={`btn-press rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                    filterType === type
                      ? "bg-navy-900 text-white shadow-xs"
                      : "text-slate-600 hover:bg-offwhite-100 hover:text-navy-900"
                  }`}
                >
                  {type === "ALL" ? "All Logs" : type.charAt(0) + type.slice(1).toLowerCase()}
                </button>
              ))}
            </div>
          </div>

          {/* Audit List */}
          <div className="animate-fade-slide-up rounded-xl border border-offwhite-200 bg-white p-6 shadow-card">
            {loading ? (
              <div className="space-y-4 animate-pulse">
                <div className="h-12 bg-offwhite-100 rounded"></div>
                <div className="h-12 bg-offwhite-100 rounded"></div>
                <div className="h-12 bg-offwhite-100 rounded"></div>
              </div>
            ) : filtered.length === 0 ? (
              <div className="py-12 text-center animate-fade-slide-up">
                <History className="h-8 w-8 text-slate-400 mx-auto mb-2" />
                <p className="text-sm font-semibold text-navy-900">No matching security events</p>
                <p className="text-xs text-slate-500 mt-1">
                  Actions such as key rotations, credential issuances, and vault modifications will appear here.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-offwhite-200">
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
