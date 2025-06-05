"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PointsStatistics as PointsStatsType } from "@/services/points-service";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";

type PointsStatisticsProps = {
  statistics: PointsStatsType;
};

const Progress = ({ value }: { value: number }) => {
  return (
    <div className="relative h-4 w-full overflow-hidden rounded-full bg-secondary">
      <div
        className="h-full w-full flex-1 bg-primary transition-all"
        style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
      />
    </div>
  );
};

export function PointsStatistics({ statistics }: PointsStatisticsProps) {
  // Mock data for monthly points chart
  const monthlyPointsData = [
    { name: "Jan", points: 350 },
    { name: "Feb", points: 420 },
    { name: "Mar", points: 380 },
    { name: "Apr", points: 510 },
    { name: "May", points: statistics.pointsThisMonth },
    { name: "Jun", points: 0 },
    { name: "Jul", points: 0 },
    { name: "Aug", points: 0 },
    { name: "Sep", points: 0 },
    { name: "Oct", points: 0 },
    { name: "Nov", points: 0 },
    { name: "Dec", points: 0 },
  ];

  // Mock data for points distribution
  const pointsDistributionData = [
    { name: "Purchases", value: 4200 },
    { name: "Referrals", value: 1800 },
    { name: "Promotions", value: 1200 },
    { name: "Activities", value: 650 },
  ];

  const COLORS = [
    "hsl(var(--chart-1))",
    "hsl(var(--chart-2))",
    "hsl(var(--chart-3))",
    "hsl(var(--chart-4))",
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Points</CardDescription>
            <CardTitle className="text-3xl">
              {statistics.totalPoints.toLocaleString()}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              {statistics.currentLevel} Member
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Points This Month</CardDescription>
            <CardTitle className="text-3xl">
              {statistics.pointsThisMonth.toLocaleString()}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Earned in May</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Next Level</CardDescription>
            <CardTitle className="text-xl">{statistics.nextLevel}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>
                  {statistics.pointsToNextLevel.toLocaleString()} points needed
                </span>
                <span>{statistics.percentToNextLevel}%</span>
              </div>
              {statistics?.percentToNextLevel && (
                <Progress value={statistics.percentToNextLevel} />
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Membership Since</CardDescription>
            <CardTitle className="text-xl">
              {new Date().getFullYear() - 2} years
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Joined May 12, {new Date().getFullYear() - 2}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
      </div>
    </div>
  );
}
