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
    const response = await fetch(
      `${API_URL}?url=${encodeURIComponent(url)}&category=performance&category=seo&key=${API_KEY}`
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch data: ${response.statusText}`);
    }

    const data = await response.json();
    const lighthouseResult = data.lighthouseResult.audits;

    const totalByteWeight =
      lighthouseResult["total-byte-weight"]?.numericValue ?? 0;
    const pageSizeKB = totalByteWeight / 1024;
    const pageSizeMB = (pageSizeKB / 1024).toFixed(2);
    const pageSizeReturn =
      pageSizeKB < 1000 ? pageSizeKB.toFixed(2) : pageSizeMB;
    const pageSizeScore = calculatePageSizeScore(pageSizeKB);

    const screenshotAudit = lighthouseResult["final-screenshot"];
    const screenshotBase64 = screenshotAudit?.details?.data ?? null;

    const networkRequestsAudit = lighthouseResult["network-requests"]?.details;
    const pageRequests =
      (networkRequestsAudit as { items?: any[] })?.items ?? [];
    const numberOfPageRequests = pageRequests.length;

    const ttfb = lighthouseResult["server-response-time"]?.numericValue || 0;
    const fcp = lighthouseResult["first-contentful-paint"]?.numericValue || 0;
    const lcp =
    lighthouseResult["largest-contentful-paint"]?.numericValue || 0;
    const tbt = lighthouseResult["total-blocking-time"]?.numericValue || 0;
    const totalLoadTime = ((ttfb + (lcp - fcp) + tbt) / 1000).toFixed(2);

    const cachingAudit = lighthouseResult["uses-long-cache-ttl"].score ?? null;

    const redirectsAudit = lighthouseResult["redirects"].score ?? null;

    const ImageSizeAudit =
      lighthouseResult["uses-optimized-images"].score ?? null;

    const minJSAudit = lighthouseResult["unminified-javascript"].score ?? null;

    const minCSS = lighthouseResult["unminified-css"].score ?? null;

    const metaDescriptionAudit =
      lighthouseResult["meta-description"]?.score ?? null;
    const crawlable = lighthouseResult["is-crawlable"]?.score ?? null;
    const is_robot = lighthouseResult["robots-txt"]?.score ?? null;
    const perm_to_index =
      crawlable === 1 && is_robot !== null && is_robot !== 0;

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
        perm_to_index,
        metaDescriptionAudit,
      };
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : "An unknown error occurred"
    );
  }
}

function calculatePageSizeScore(kbSize: number) {
  if (kbSize <= 500) return 100;
  if (kbSize >= 6000) return 0;
  return Math.max(0, Math.round(100 - ((kbSize - 500) / (6000 - 500)) * 100));
}
