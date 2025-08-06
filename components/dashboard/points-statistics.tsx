"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useGetStatistics } from "@/hooks/useGetStatistics";
import { PointsStatistics as PointsStatsType } from "@/services/points-service";
// import {
//   BarChart,
//   Bar,
//   PieChart,
//   Pie,
//   Cell,
//   ResponsiveContainer,
//   XAxis,
//   YAxis,
//   Tooltip,
//   Legend,
// } from "recharts";
import { PointsHistory } from "./points-history";
import { CountUp } from "../ui/countUp";
import { Skeleton } from "../ui/skeleton";
import {
  BadgeMinus,
  BadgePlus,
  BlocksIcon,
  CircleX,
  CrossIcon,
  Info,
  Wallet,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

type StateCardProps = {
  targetNumber: number;
  label: string;
};

const StateCard = ({ targetNumber, label }: StateCardProps) => {
  return (
    <Card className="hover:bg-primary/10 hover:scale-[1.03] transition-all cursor-pointer block border border-input rounded-[8px] shadow-sm">
      <CardHeader className="pb-2">
        <CardDescription>{label}</CardDescription>
        <CardTitle className="text-3xl">
          <CountUp targetNumber={targetNumber} />
        </CardTitle>
      </CardHeader>
    </Card>
  );
};

// const Progress = ({ value }: { value: number }) => {
//   return (
//     <div className="relative h-4 w-full overflow-hidden rounded-full bg-secondary">
//       <div
//         className="h-full w-full flex-1 bg-primary transition-all"
//         style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
//       />
//     </div>
//   );
// };

export function PointsStatistics() {
  const {
    isLoading: isPointsStatisticsLoading,
    walletData,
    refresh: refreshStatistics,
  } = useGetStatistics();

  // Initial data fetch
  useEffect(() => {
    refreshStatistics();
  }, []);

  const [selectedWallet, setSelectedWallet] = useState<{
    walletTypeId: string;
    unitsName?: string;
  }>();

  const handleWalletChange = (walletTypeId: string) => {
    setSelectedWallet({
      walletTypeId,
      unitsName:
        walletData?.find(
          ({ walletType }) => walletType.walletTypeId === walletTypeId
        )?.walletType.unitPluralName || "Points",
    });
  };

  useEffect(() => {
    if (walletData?.length) {
      const defaultWallet = walletData?.find(
        ({ walletType }) => walletType.isDefault
      );

      if (defaultWallet) {
        setSelectedWallet({
          walletTypeId: defaultWallet?.walletType.walletTypeId,
          unitsName: defaultWallet?.walletType.unitPluralName || "Points",
        });
      } else {
        setSelectedWallet({
          walletTypeId: walletData?.[0]?.walletType.walletTypeId,
          unitsName: walletData?.[0]?.walletType.unitPluralName || "Points",
        });
      }
    }
  }, [walletData]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Wallet Statistics</h2>
        <div className="w-64">
          <Select
            value={
              selectedWallet?.walletTypeId ||
              walletData?.[0]?.walletType.walletTypeId
            }
            onValueChange={(walletTypeId) => handleWalletChange(walletTypeId)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Wallet" />
            </SelectTrigger>
            <SelectContent>
              {walletData?.map((wallet) => (
                <SelectItem
                  key={wallet.walletType.walletTypeId}
                  value={wallet.walletType.walletTypeId}
                >
                  {wallet.walletType.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Points Statistics */}
      {isPointsStatisticsLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-24 rounded-lg" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-6 gap-4">
          {(() => {
            const selectedWalletData = selectedWallet
              ? walletData?.find(
                  ({ walletType }) =>
                    walletType.walletTypeId === selectedWallet.walletTypeId
                )
              : walletData?.[0];

            if (!selectedWalletData) {
              return null;
            }

            const accountData = selectedWalletData.account;

            const stats = [
              {
                title: "Accumulated Points",
                value: accountData.accumulatedPoints,
                icon: <BadgePlus className="h-5 w-5" />,
                color: "text-green-500",
              },
              {
                title: "Active Points",
                value: accountData.activePoints,
                icon: <Wallet className="h-5 w-5" />,
                color: "text-primary",
              },
              {
                title: "Spent Points",
                value: accountData.spentPoints,
                icon: <BadgeMinus className="h-5 w-5" />,
                color: "text-amber-500",
              },
              {
                title: "Expired Points",
                value: accountData.expiredPoints,
                icon: <Info className="h-5 w-5" />,
                color: "text-destructive",
              },
              {
                title: "Blocked Points",
                value: accountData.blockedPoints,
                icon: <CircleX className="h-5 w-5" />,
                color: "text-destructive",
              },
              {
                title: "Locked Points",
                value: accountData.lockedPoints,
                icon: <CircleX className="h-5 w-5" />,
                color: "text-destructive",
              },
            ];

            return stats.map((stat, index) => (
              <Card
                key={index}
                className="p-4 border border-border hover:shadow-md hover:scale-[1.02] transition-all block rounded-[8px] shadow-sm"
              >
                <div className="flex items-center gap-2">
                  <div
                    className={`p-2 rounded-full ${stat.color} bg-opacity-10`}
                  >
                    {stat.icon}
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      {stat.title}
                    </p>
                    <h3 className="text-2xl font-bold">
                      <CountUp targetNumber={stat.value} decimalPlaces={2} />
                    </h3>
                  </div>
                </div>
              </Card>
            ));
          })()}
        </div>
      )}

      {/* Points History */}
      <PointsHistory selectedWallet={selectedWallet} />
    </div>
  );
}
