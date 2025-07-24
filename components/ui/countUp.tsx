import { useState, useEffect } from "react";

interface Props {
  targetNumber: number;
  className?: string;
}

export const CountUp = ({ targetNumber, className }: Props) => {
  const [count, setCount] = useState(0.0);

  // Reset count whenever targetNumber changes
  useEffect(() => {
    setCount(0);
  }, [targetNumber]);

  useEffect(() => {
    if (count < targetNumber) {
      const increment = Math.ceil(targetNumber / 10);
      const timeout = setTimeout(() => {
        setCount((prevCount) => Math.min(prevCount + increment, targetNumber));
      }, 100);
      return () => clearTimeout(timeout);
    }
  }, [count, targetNumber]);

  return <span className={className}>{count.toFixed(2)}</span>;
};
