import { PointTransactionType } from "@/enums";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getCookie = (name: string) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift();
};

export const removeCookie = (name: string) => {
  document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/";
};

export const getBadgeColorClass = (type: PointTransactionType) => {
  switch (type) {
    case PointTransactionType.Earned:
      return "bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400";
    case PointTransactionType.Expired:
      return "bg-red-100 dark:bg-red-800 text-red-600 dark:text-red-400";
    case PointTransactionType.Redeemed:
      return "bg-amber-100 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400";
    default:
      return "bg-gray-100 dark:bg-gray-900/20 text-gray-600 dark:text-gray-400";
  }
};

export const getPointsColorClass = (type: PointTransactionType) => {
  switch (type) {
    case PointTransactionType.Earned:
      return "text-green-600 dark:text-green-400";
    case PointTransactionType.Expired:
      return "text-red-600 dark:text-red-400";
    case PointTransactionType.Redeemed:
      return "text-amber-600 dark:text-amber-400";
    default:
      return "text-gray-600 dark:text-gray-400";
  }
};
