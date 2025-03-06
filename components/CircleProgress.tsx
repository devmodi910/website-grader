import { motion } from "framer-motion";
import { useEffect, useState } from "react";

type CircleProgressProps = {
  score: number;
};

const CircleProgress: React.FC<CircleProgressProps> = ({ score }) => {
  const [progress, setProgress] = useState<number>(0);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setProgress(score);
    }, 200);
    return () => clearTimeout(timeout);
  }, [score]);

  const circumference: number = 100 * Math.PI;
  const strokeDashoffset: number = circumference - (progress / 100) * circumference;

  return (
    <div className="relative w-45 h-45 flex items-center justify-center">
      <svg
        className="w-full h-full rotate-[-90deg]"
        viewBox="0 0 120 120"
        fill="none"
      >
        <circle
          cx="60"   
          cy="60"
          r="50"
          stroke="#dbdbdb"
          strokeWidth="7"
          fill="none"
        />
        <motion.circle
          cx="60"
          cy="60"
          r="50"
          stroke="#00bda5"
          strokeWidth="7"
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          transition={{ duration: 1.5, ease: "easeInOut" }}
        />
      </svg>
      <span className="absolute text-4xl font-bold text-white">{progress}</span>
    </div>
  );
};

export default CircleProgress;
