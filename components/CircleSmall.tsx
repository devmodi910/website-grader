import { motion } from "framer-motion";
import { useEffect, useState } from "react";

type CircleProgressProps = {
  score: number;
};

const CircleSmall: React.FC<CircleProgressProps> = ({ score }) => {
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
    <div className="flex flex-col items-center justify-center">
      <div className="relative flex h-[140px] w-[140px] items-center justify-center">
        <svg
          className="w-full h-full rotate-[-90deg]"
          viewBox="0 0 120 120"
          fill="none"
        >
          {/* Background Circle */}
          <circle
            cx="60"
            cy="60"
            r="50"
            stroke="#dbdbdb"
            strokeWidth="7"
            fill="none"
          />
          {/* Progress Circle with Animation */}
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
        {/* Score Text */}
        <span className="absolute text-3xl font-bold text-[#2d3e50]">
          {progress}
        </span>
      </div>
      {/* Title Below Circle */}
      
    </div>
  );
};

export default CircleSmall;
