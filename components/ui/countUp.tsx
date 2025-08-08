import { useState, useEffect } from "react";

interface Props {
  targetNumber: number | string;
  decimalPlaces?: number; // Optional: for consistent formatting
  className?: string;
}

export const CountUp = ({
  targetNumber,
  decimalPlaces = 0,
  className,
}: Props) => {
  const parsedTarget =
    typeof targetNumber === "string" ? parseFloat(targetNumber) : targetNumber;
  const [count, setCount] = useState(0);

  useEffect(() => {
    setCount(0);
  }, [parsedTarget]);

  useEffect(() => {
    if (count < parsedTarget) {
      const increment = Math.ceil(parsedTarget / 10);
      const timeout = setTimeout(() => {
        setCount((prevCount) => Math.min(prevCount + increment, parsedTarget));
      }, 100);
      return () => clearTimeout(timeout);
    }
  }, [count, parsedTarget]);

  const formattedCount =
    decimalPlaces > 0
      ? count.toFixed(decimalPlaces)
      : Math.round(count).toString();

  return <span className={className}>{formattedCount}</span>;
};
