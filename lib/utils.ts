import { PointConversionRounding } from "@/enums";
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

export const generateTransactionDocumentNumber = () => {
  return `TXN-${Date.now()}-${Math.random()
    .toString(36)
    .substring(2, 9)
    .toUpperCase()}`;
};
type CalculateConvertedRewardValuePayload = {
  conversionRate: {
    points: number;
    currency: number;
  };
  points: number;
  conversionRounding?: PointConversionRounding;
};

export const calculateConvertedRewardValue = ({
  conversionRate,
  conversionRounding,
  points,
}: CalculateConvertedRewardValuePayload): number => {
  const { points: conversionPoints, currency } = conversionRate;

  // Base value before rounding
  const rawValue = points * (currency / conversionPoints);

  let rewardValue: number;

  switch (conversionRounding) {
    case PointConversionRounding.RoundDown:
      rewardValue = Math.floor(rawValue * 100) / 100; // Round down to 2 decimal places
      break;

    case PointConversionRounding.RoundUp:
      rewardValue = Math.ceil(rawValue * 100) / 100; // Round up to 2 decimal places
      break;

    case PointConversionRounding.None:
    default:
      rewardValue = parseFloat(rawValue.toFixed(2)); // Normal rounding to 2 decimals
      break;
  }

  return rewardValue;
};
