"use server";
import dotenv from "dotenv";
dotenv.config();

const API_KEY = process.env.API_KEY;
const API_URL = "https://www.googleapis.com/pagespeedonline/v5/runPagespeed";

export async function fetchWebsiteDetails(url: string) {
  if (!url) {
    throw new Error("URL is required");
  }

  try {
    const [desktopResponse, mobileResponse] = await Promise.all([
      fetch(
        `${API_URL}?url=${encodeURIComponent(
          url
        )}&category=performance&category=best-practices&category=seo&key=${API_KEY}`
        ),
        fetch(
        `${API_URL}?url=${encodeURIComponent(
          url
        )}&category=performance&category=seo&category=accessibility&strategy=mobile&key=${API_KEY}`
      ),
    ]);

    if (!desktopResponse.ok || !mobileResponse.ok) {
      throw new Error("Failed to fetch Lighthouse data");
    }

    const [desktopData, mobileData] = await Promise.all([
      desktopResponse.json(),
      mobileResponse.json(),
    ]);

    const desktopLighthouse = desktopData.lighthouseResult.audits;
    const mobileLighthouse = mobileData.lighthouseResult.audits;

    const totalByteWeight =
      desktopLighthouse["total-byte-weight"]?.numericValue ?? 0;
    const pageSizeKB = totalByteWeight / 1024;
    const pageSizeMB = (pageSizeKB / 1024).toFixed(2);
    const pageSizeReturn =
      pageSizeKB < 1000 ? pageSizeKB.toFixed(2) : pageSizeMB;
    const pageSizeScore = calculatePageSizeScore(pageSizeKB);

    const screenshotAudit = desktopLighthouse["final-screenshot"];
    const screenshotBase64 = screenshotAudit?.details?.data ?? null;

    const networkRequestsAudit = desktopLighthouse["network-requests"]?.details;
    const pageRequests =
      (networkRequestsAudit as { items?: any[] })?.items ?? [];
    const numberOfPageRequests = pageRequests.length;
    const networkPerformance =
      calculateNetworkPerformance(numberOfPageRequests);

    const ttfb = desktopLighthouse["server-response-time"]?.numericValue || 0;
    const fcp = desktopLighthouse["first-contentful-paint"]?.numericValue || 0;
    const lcp =
      desktopLighthouse["largest-contentful-paint"]?.numericValue || 0;
    const tti = desktopLighthouse["interactive"]?.numericValue || 0;
    const fid = desktopLighthouse["max-potential-fid"]?.numericValue || 0;
    const tbt = desktopLighthouse["total-blocking-time"]?.numericValue || 0;
    const speedIndex = desktopLighthouse["speed-index"]?.numericValue || 0;
    const loadTime = desktopLighthouse["load"]?.numericValue || 0; // Page Load Event
    const fullyLoaded = desktopLighthouse["fully-loaded"]?.numericValue || 0; // All assets loaded

    // 🚀 Corrected Calculation
    const totalLoadTime = Math.max(
      ttfb + tti + fid + tbt, // Main processing delays
      lcp, // Largest visible element
      speedIndex, // When most content appears
      loadTime, // Document Load Event
      fullyLoaded // Everything including scripts, APIs, etc.
    );

    // console.log(`Total Load Time (ms):`, totalLoadTime);
    // console.log(`Total Load Time (s):`, (totalLoadTime / 1000).toFixed(2));

    const speedPerformance = calculatePageSpeed(totalLoadTime);
    // console.log(`Speed Performance Score:`, speedPerformance);

    const cachingAudit = desktopLighthouse["uses-long-cache-ttl"].score ?? null;
    const redirectsAudit = desktopLighthouse["redirects"].score ?? null;
    const ImageSizeAudit =
      desktopLighthouse["uses-optimized-images"].score ?? null;
    console.log(desktopLighthouse["uses-optimized-images"])
    const minJSAudit = desktopLighthouse["unminified-javascript"].score ?? null;
    const minCSS = desktopLighthouse["unminified-css"].score ?? null;

    console.log(cachingAudit,redirectsAudit,ImageSizeAudit,minJSAudit,minCSS)
    const metaDescriptionAudit =
      desktopLighthouse["meta-description"]?.score ?? null;
    const crawlable = desktopLighthouse["is-crawlable"]?.score ?? null;
    const is_robot = desktopLighthouse["robots-txt"]?.score ?? null;
    const perm_to_index =
      crawlable === 1 && is_robot !== null && is_robot !== 0;

    const pluginsAudit = desktopLighthouse["content-plugins"]?.score ?? null;

    const linkTextAudit = desktopLighthouse["link-text"]?.score ?? null;

    const mobileImageAudit = mobileLighthouse["final-screenshot"];
    const mobileScreenshot = mobileImageAudit?.details?.data ?? null;
    const legibleFontSize = mobileLighthouse["font-display"]?.score ?? null;
    const responsiveCheck = mobileLighthouse["viewport"]?.score ?? null;

    const isOnHTTP = desktopLighthouse["is-on-http"]?.score ?? null;
    const redirectsToHTTPS = desktopLighthouse["redirects-http"]?.score ?? null;

    // console.log("HTTP Audit Results:", { isOnHTTP, redirectsToHTTPS });

    // const secureLibAudit1 = desktopLighthouse["no-vulnerable-libraries"]?.score ?? null;
    // console.log(secureLibAudit1);
    // const jsLibraries = desktopLighthouse["js-libraries"]?.details?.items ?? [];
    // const thirdPartyScripts =
    //   desktopLighthouse["third-party-summary"]?.details?.items ?? [];

    // console.log("JS Libraries Used:", jsLibraries);
    // console.log("Third-Party Scripts Loaded:", thirdPartyScripts);

    const httpAudit = 1;
    const secureLibAudit = 1;
    return {
      url,
      totalPageSize: `${pageSizeKB.toFixed(2)} KB`,
      pageSizeScore,
      screenshotBase64,
      pageSizeReturn,
      numberOfPageRequests,
      networkPerformance,
      totalLoadTime,
      speedPerformance,
      cachingAudit,
      redirectsAudit,
      ImageSizeAudit,
      minJSAudit,
      minCSS,
      perm_to_index,
      metaDescriptionAudit,
      pluginsAudit,
      linkTextAudit,
      mobileScreenshot,
      legibleFontSize,
      responsiveCheck,
      httpAudit,
      secureLibAudit,
    };
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : "An unknown error occurred"
    );
  }
}

function calculatePageSizeScore(kbSize: number) {
  if (kbSize >= 6000) return 0;
  return Math.max(0, Math.round(100 - (kbSize / 6000) * 100));
}

function calculateNetworkPerformance(numberOfPageRequests: number) {
  if (numberOfPageRequests >= 200) return 0;
  return Math.max(0, Math.round(100 - (numberOfPageRequests / 200) * 100));
}

function calculatePageSpeed(timeInMM: number) {
  if (timeInMM >= 15000) return 0;

  return Math.max(
    0,
    Math.round(100 - ((timeInMM - 1500) / (15000 - 1500)) * 100)
  );
}
