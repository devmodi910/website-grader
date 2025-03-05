"use client";
import { createContext, useContext, useState, ReactNode } from "react";

// Define types
type LighthouseData = {
  url: string;
  pageSizeScore: number;
} | null;

type LighthouseContextType = {
  data: LighthouseData;
  setData: (data: LighthouseData) => void;
};

// Create context
const LighthouseContext = createContext<LighthouseContextType | undefined>(undefined);

// Provider component
export function LighthouseProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<LighthouseData>(null);

  return (
    <LighthouseContext.Provider value={{ data, setData }}>
      {children}
    </LighthouseContext.Provider>
  );
}

// Hook to use context
export function useLighthouse() {
  const context = useContext(LighthouseContext);
  if (!context) {
    throw new Error("useLighthouse must be used within a LighthouseProvider");
  }
  return context;
}
