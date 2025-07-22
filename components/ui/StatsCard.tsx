import { Card, CardContent } from "./card";
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
    <Card>
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
