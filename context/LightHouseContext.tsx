"use client";
import { createContext, useContext, useState, ReactNode } from "react";

export interface AuditFix {
  audit: string;
  fix: string;
}


export type LighthouseData = {
  audit: {
    url: string;
    email: string;
    pageSizeScore: number;
    totalPageSize?: string;
    screenshotBase64: string;
    pageSizeKB: number;
    pageSizeReturn: string;
    numberOfPageRequests: number;
    networkPerformance: number;
    totalLoadTime: number;
    totalLoadTimeSeconds?: string;
    speedPerformance: number;
    cacheQuality: boolean;
    redirectQuality: boolean;
    imageQuality: boolean;
    JSQuality: boolean;
    CSSQuality: boolean;
    TextQuality: boolean;
    SecureJS: boolean;
    cachingAudit: number;
    redirectsAudit: number;
    ImageSizeAudit: number;
    minJSAudit: number;
    minCSS: number;
    perm_to_index: boolean;
    metaDescriptionAudit: number;
    pluginsAudit: number;
    linkTextAudit: number;
    mobileScreenshot: string;
    legibleFontSize: number;
    responsiveCheck: number;
    httpAudit: number;
    secureLibAudit: number;
    altTextAudit: boolean;
    colorAudit: boolean;
    ariaAudits: boolean;
    doctypeAudit: boolean;
    charsetAudit: boolean;
    errorconsoleAudit: boolean;
    deprecationAudit: boolean;
    geolocationAudit: boolean;
    performanceMetrics?: {
      ttfb: string;
      fcp: string;
      lcp: string;
      tti: string;
      tbt: string;
      cls: number;
      estimatedFullLoadTime: string;
    };
  } | null;
  score: {
    mainScore: number;
    mainPerformanceScore: number;
    mainSEOScore: number;
    mainMobileScore: number;
    mainSecurityScore: number;
    mainCodeHealthScore: number;
    mainUserExperienceScore: number;
  } | null;
} | null;


type LighthouseContextType = {
  data: LighthouseData;
  setData: (data: LighthouseData) => void;
  aiSuggestions: AuditFix[];
  setAIsuggestions: (suggestions :AuditFix[]) => void;
};

const LighthouseContext = createContext<LighthouseContextType | undefined>(undefined);

export function LighthouseProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<LighthouseData>(null);
  const [aiSuggestions,setAIsuggestions] = useState<AuditFix[]>([]);

  return (
    <LighthouseContext.Provider value={{ data, setData,aiSuggestions,setAIsuggestions }}>
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

// import React, { useContext, useEffect, useState } from "react";
// import Card from "../components/card";
// import { context } from "../context/contextProvider";

// const Posts = () => {
//   const { posts, setPosts } = useContext(context);
//   const [loading, setIsLoading] = useState(false);

//   useEffect(() => {
//     setIsLoading(true);
//     fetch("https://jsonplaceholder.typicode.com/todos")
//       .then((res) => res.json())
//       .then((res) => {
//         setPosts(res);
//         setIsLoading(false);
//       })
//       .catch(() => setIsLoading(false));
//   }, [setPosts]);

//   const toggle = (id) => {
//     setPosts((prevPosts) =>
//       prevPosts.map((post) =>
//         post.id === id ? { ...post, completed: !post.completed } : post
//       )
//     );
//   };

//   return (
//     <div className="posts-container">
//       {loading ? (
//         <p>Loading...</p>
//       ) : (
//         posts?.map((post) => (
//           <Card key={post.id} data={post} toggleSwitch={() => toggle(post.id)} />
//         ))
//       )}

//       <div>
//         <button>Prev</button>
//         <button>Next</button>
//       </div>
//     </div>
//   );
// };

// export default Posts;
