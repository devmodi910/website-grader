"use server";

import { launch } from "chrome-launcher";

export async function fetchWebsiteDetails(url: string) {
  if (!url) {
    throw new Error("URL is required");
  }

  let chrome;

  try {
    chrome = await launch({ chromeFlags: ["--headless"] });

    const options = {
      logLevel: "silent" as const,
      output: "json" as const,
      onlyCategories: ["performance"] as string[],
      port: chrome.port,
      formFactor: "desktop" as const,
      screenEmulation: { disabled: true } as const,
    };

    const lighthouse = (await import("lighthouse")).default;
    const result = await lighthouse(url, options);

    if (!result?.lhr?.audits) {
      throw new Error("Failed to retrieve Lighthouse audit results");
    }

    const totalByteWeight =
      result.lhr.audits["total-byte-weight"]?.numericValue ?? 0;
    const pageSizeKB = totalByteWeight / 1024;
    const pageSizeMB = (pageSizeKB / 1024).toFixed(2);
    const pageSizeReturn =
      pageSizeKB < 1000 ? pageSizeKB.toFixed(2) : pageSizeMB;
    const pageSizeScore = calculatePageSizeScore(pageSizeKB);

    const screenshotDetails = result.lhr.audits["final-screenshot"]?.details;
    const screenshotBase64 =
      (screenshotDetails as { data?: string })?.data ?? null;

    const networkRequestsAudit = result.lhr.audits["network-requests"]?.details;
    const pageRequests =
      (networkRequestsAudit as { items?: any[] })?.items ?? [];
    const numberOfPageRequests = pageRequests.length;

    const ttfb = result.lhr.audits["server-response-time"]?.numericValue || 0;
    const fcp = result.lhr.audits["first-contentful-paint"]?.numericValue || 0;
    const lcp =
      result.lhr.audits["largest-contentful-paint"]?.numericValue || 0;
    const tbt = result.lhr.audits["total-blocking-time"]?.numericValue || 0;
    const totalLoadTime = ((ttfb + (lcp - fcp) + tbt) / 1000).toFixed(2);

    const cachingAudit = result.lhr.audits["uses-long-cache-ttl"].score ?? null;

    const redirectsAudit = result.lhr.audits["redirects"].score ?? null;

    const ImageSizeAudit =
      result.lhr.audits["uses-optimized-images"].score ?? null;

    const minJSAudit = result.lhr.audits["unminified-javascript"].score ?? null;

    const minCSS = result.lhr.audits["unminified-css"].score ?? null;

    // const crawlable = result.lhr.audits["is-crawlable"]?.score ?? null;
    // console.log(crawlable)
    // const is_robot = result.lhr.audits["robots-txt"]?.score ?? null;
    // console.log(is_robot)
    // const perm_to_index =
    //   crawlable === 1 && is_robot !== null && is_robot !== 0;

    return {
      url,
      totalPageSize: `${pageSizeKB.toFixed(2)} KB`,
      pageSizeScore,
      screenshotBase64,
      pageSizeReturn,
      numberOfPageRequests,
      totalLoadTime,
      cachingAudit,
      redirectsAudit,
      ImageSizeAudit,
      minJSAudit,
      minCSS,
      // perm_to_index,
    };
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : "An unknown error occurred"
    );
  } finally {
    if (chrome) {
      await chrome.kill();
    }
  }
}

// Scoring function
function calculatePageSizeScore(kbSize: number) {
  if (kbSize <= 500) return 100;
  if (kbSize >= 6000) return 0;
  return Math.max(0, Math.round(100 - ((kbSize - 500) / (6000 - 500)) * 100));
}
