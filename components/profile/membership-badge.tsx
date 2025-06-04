"use client";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
export enum MembershipLevel {
  Bronze = "Bronze",
  Silver = "Silver",
  Gold = "Gold",
  Platinum = "Platinum",
  Diamond = "Diamond",
}

type MembershipBadgeProps = {
  level: MembershipLevel;
  size?: "sm" | "md" | "lg";
};

export function MembershipBadge({ level, size = "md" }: MembershipBadgeProps) {
  const getLevelStyles = () => {
    switch (level) {
      case "Bronze":
        return "bg-amber-700/20 text-amber-700 dark:bg-amber-700/30 dark:text-amber-400 hover:bg-amber-700/30";
      case "Silver":
        return "bg-slate-300/30 text-slate-700 dark:bg-slate-400/30 dark:text-slate-300 hover:bg-slate-300/40";
      case "Gold":
        return "bg-amber-300/30 text-amber-700 dark:bg-amber-400/30 dark:text-amber-300 hover:bg-amber-300/40";
      case "Platinum":
        return "bg-emerald-300/30 text-emerald-800 dark:bg-emerald-400/30 dark:text-emerald-300 hover:bg-emerald-300/40";
      case "Diamond":
        return "bg-blue-300/30 text-blue-800 dark:bg-blue-400/30 dark:text-blue-300 hover:bg-blue-300/40";
      default:
        return "bg-gray-300/30 text-gray-800 dark:bg-gray-400/30 dark:text-gray-300 hover:bg-gray-300/40";
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case "sm":
        return "text-xs px-2 py-0.5";
      case "lg":
        return "text-base px-4 py-1.5";
      case "md":
      default:
        return "text-sm px-3 py-1";
    }
  };

  return (
    <Badge className={cn(getLevelStyles(), getSizeStyles(), "font-semibold")}>
      {level} Member
    </Badge>
  );
}
