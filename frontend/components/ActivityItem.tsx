"use client";

import React from "react";
import {
  Shield,
  KeyRound,
  Award,
  Lock,
  Share2,
  Trash2,
  CheckCircle,
  AlertTriangle
} from "lucide-react";
import { Activity } from "@/lib/api";

interface ActivityItemProps {
  activity: Activity;
}

export const ActivityItem: React.FC<ActivityItemProps> = ({ activity }) => {
  const getBadgeDetails = (action: string) => {
    switch (action) {
      case "IDENTITY_CREATED":
      case "KEY_ROTATED":
        return {
          icon: <KeyRound className="h-3.5 w-3.5" />,
          gradient: "bg-gradient-to-tr from-[#AF52DE] to-[#BF5AF2] text-white shadow-purple-500/25",
        };
      case "CREDENTIAL_ISSUED":
      case "CREDENTIAL_IMPORTED":
        return {
          icon: <Award className="h-3.5 w-3.5" />,
          gradient: "bg-gradient-to-tr from-[#FF9500] to-[#FFCC00] text-white shadow-amber-500/25",
        };
      case "CREDENTIAL_SHARED":
        return {
          icon: <Share2 className="h-3.5 w-3.5" />,
          gradient: "bg-gradient-to-tr from-[#0071E3] to-[#5AC8FA] text-white shadow-blue-500/25",
        };
      case "CREDENTIAL_REVOKED":
      case "CREDENTIAL_DELETED":
        return {
          icon: <Trash2 className="h-3.5 w-3.5" />,
          gradient: "bg-gradient-to-tr from-[#FF3B30] to-[#FF453A] text-white shadow-red-500/25",
        };
      case "VAULT_ITEM_ADDED":
      case "VAULT_ACCESSED":
        return {
          icon: <Lock className="h-3.5 w-3.5" />,
          gradient: "bg-gradient-to-tr from-[#34C759] to-[#30D158] text-white shadow-emerald-500/25",
        };
      default:
        return {
          icon: <Shield className="h-3.5 w-3.5" />,
          gradient: "bg-gradient-to-tr from-neutral-600 to-neutral-400 text-white shadow-neutral-500/20",
        };
    }
  };

  const { icon, gradient } = getBadgeDetails(activity.action_type);

  return (
    <div className="flex items-start space-x-3.5 py-3 px-2 -mx-2 rounded-xl border-b border-black/[0.04] dark:border-white/[0.06] last:border-0 hover:bg-black/[0.02] dark:hover:bg-white/[0.04] transition-all">
      <div className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl shadow-sm ${gradient}`}>
        {icon}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <p className="text-xs font-bold text-neutral-900 dark:text-white truncate">
            {activity.action_type.replace(/_/g, " ")}
          </p>
          <span className="text-[10px] text-neutral-400 dark:text-neutral-500 font-mono">
            {new Date(activity.timestamp).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        </div>
        <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-0.5 break-words leading-relaxed">{activity.description}</p>
      </div>
    </div>
  );
};
