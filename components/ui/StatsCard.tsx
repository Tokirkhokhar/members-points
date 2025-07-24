import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./card";
import { CountUp } from "./countUp";

export const StatsCard = ({
  icon,
  title,
  value,
  isCountUp = false,
}: {
  icon: React.ReactNode;
  title: string;
  value: number;
  isCountUp?: boolean;
}) => {
  return (
    <Card className="hover:bg-primary/10 hover:scale-[1.03] transition-all cursor-pointer block border border-input rounded-[8px] shadow-sm">
      <CardContent className="p-6">
        <div className="flex flex-col gap-2">
          <div className="flex gap-2 items-center">
            {icon}
            <p className="text-base text-muted-foreground">{title}</p>
          </div>
          {isCountUp ? (
            <CountUp className="text-xl font-bold ml-6" targetNumber={value} />
          ) : (
            <p className="text-xl font-bold ml-6">{value}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

type StateCardProps = {
  targetNumber: number;
  label: string;
};

export const StatisticsCard = ({ targetNumber, label }: StateCardProps) => {
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
