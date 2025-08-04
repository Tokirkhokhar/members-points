"use client";

import { useEffect } from "react";
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
    isLoading,
    walletData,
    refresh: refreshStatistics,
  } = useGetStatistics();

  // Initial data fetch
  useEffect(() => {
    refreshStatistics();
  }, []);

  const data = walletData?.[0]?.account;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <StateCard
          targetNumber={data?.accumulatedPoints || 0}
          label="Lifetime Earned Points"
        />
        <StateCard
          targetNumber={data?.activePoints || 0}
          label="Wallet Balance"
        />
        <StateCard targetNumber={data?.spentPoints || 0} label="Spent Points" />
        <StateCard
          targetNumber={data?.blockedPoints || 0}
          label="Blocked Points"
        />
        <StateCard
          targetNumber={data?.expiredPoints || 0}
          label="Expired Points"
        />
      </div>

      <PointsHistory />

      {/* <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Monthly Points Earned</CardTitle>
            <CardDescription>
              Points earned over the past months
            </CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={monthlyPointsData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip
                  formatter={(value) => [`${value} points`, "Points"]}
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    borderColor: "hsl(var(--border))",
                    borderRadius: "0.5rem",
                  }}
                />
                <Bar
                  dataKey="points"
                  fill="hsl(var(--chart-1))"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Points Distribution</CardTitle>
            <CardDescription>How you have earned your points</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pointsDistributionData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                >
                  {pointsDistributionData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value) => [`${value} points`, "Points"]}
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    borderColor: "hsl(var(--border))",
                    borderRadius: "0.5rem",
                  }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div> */}
    </div>
  );
}
