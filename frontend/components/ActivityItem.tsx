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
  const getIcon = (action: string) => {
    switch (action) {
      case "IDENTITY_CREATED":
      case "KEY_ROTATED":
        return <KeyRound className="h-4 w-4 text-trust-600" />;
      case "CREDENTIAL_ISSUED":
      case "CREDENTIAL_IMPORTED":
        return <Award className="h-4 w-4 text-success-600" />;
      case "CREDENTIAL_SHARED":
        return <Share2 className="h-4 w-4 text-trust-600" />;
      case "CREDENTIAL_REVOKED":
      case "CREDENTIAL_DELETED":
        return <Trash2 className="h-4 w-4 text-alert-600" />;
      case "VAULT_ITEM_ADDED":
      case "VAULT_ACCESSED":
        return <Lock className="h-4 w-4 text-navy-800" />;
      default:
        return <Shield className="h-4 w-4 text-slate-500" />;
    }
  };

  return (
    <div className="animate-fade-slide-up flex items-start space-x-3.5 py-2.5 px-2 -mx-2 rounded-lg border-b border-offwhite-200 last:border-0 hover:bg-offwhite-50 transition-colors">
      <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-offwhite-100 border border-offwhite-200 shadow-xs">
        {getIcon(activity.action_type)}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <p className="text-xs font-bold text-navy-900 truncate">
            {activity.action_type.replace(/_/g, " ")}
          </p>
          <span className="text-[10px] text-slate-400 font-mono">
            {new Date(activity.timestamp).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        </div>
        <p className="text-xs text-slate-600 mt-0.5 break-words">{activity.description}</p>
      </div>
    </div>
  );
};
