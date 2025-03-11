"use client";
import { createContext, useContext, useState, ReactNode } from "react";

type LighthouseData = {
  url: string;
  pageSizeScore: number;
  screenshotBase64: string;
  pageSizeReturn:string;
  numberOfPageRequests:number;
  networkPerformance:number;
  totalLoadTime:number;
  speedPerformance:number;
  cachingAudit:number;
  redirectsAudit:number;
  ImageSizeAudit:number;
  minJSAudit:number;
  minCSS:number;
  perm_to_index:boolean;
  metaDescriptionAudit:boolean;
  pluginsAudit:boolean;
  linkTextAudit:number;
  mobileScreenshot:string;
  legibleFontSize:number;
  responsiveCheck:number;
  httpAudit:number;
  secureLibAudit:number;
  
} | null;

type LighthouseContextType = {
  data: LighthouseData;
  setData: (data: LighthouseData) => void;
};

const LighthouseContext = createContext<LighthouseContextType | undefined>(undefined);

export function LighthouseProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<LighthouseData>(null);

  return (
    <LighthouseContext.Provider value={{ data, setData }}>
      {children}
    </LighthouseContext.Provider>
  );
}

export function useLighthouse() {
  const context = useContext(LighthouseContext);
  if (!context) {
    throw new Error("useLighthouse must be used within a LighthouseProvider");
  }
  return context;
}
