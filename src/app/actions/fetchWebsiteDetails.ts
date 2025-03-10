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
      fetch(`${API_URL}?url=${encodeURIComponent(url)}&category=performance&category=seo&key=${API_KEY}`),
      fetch(`${API_URL}?url=${encodeURIComponent(url)}&category=performance&category=seo&category=accessibility&strategy=mobile&key=${API_KEY}`)
    ]);

    if (!desktopResponse.ok || !mobileResponse.ok) {
      throw new Error("Failed to fetch Lighthouse data");
    }

    const [desktopData, mobileData] = await Promise.all([
      desktopResponse.json(),
      mobileResponse.json()
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

    const ttfb = desktopLighthouse["server-response-time"]?.numericValue || 0;
    const fcp = desktopLighthouse["first-contentful-paint"]?.numericValue || 0;
    const lcp =
    desktopLighthouse["largest-contentful-paint"]?.numericValue || 0;
    const tbt = desktopLighthouse["total-blocking-time"]?.numericValue || 0;
    const totalLoadTime = ((ttfb + (lcp - fcp) + tbt) / 1000).toFixed(2);

    const cachingAudit = desktopLighthouse["uses-long-cache-ttl"].score ?? null;

    const redirectsAudit = desktopLighthouse["redirects"].score ?? null;

    const ImageSizeAudit =
    desktopLighthouse["uses-optimized-images"].score ?? null;

    const minJSAudit = desktopLighthouse["unminified-javascript"].score ?? null;

    const minCSS = desktopLighthouse["unminified-css"].score ?? null;

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
    console.log(mobileScreenshot)
    console.log("Available Mobile Audits: ",Object.keys(mobileLighthouse));
    const legibleFontSize = mobileLighthouse["font-display"]?.score ?? null
    console.log(legibleFontSize)
    console.log(mobileLighthouse["tap-targets"]?.score ?? "Audit not found");
    const responsiveCheck = mobileLighthouse["viewport"]?.score ?? null
    console.log(responsiveCheck)

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
        pluginsAudit,
        linkTextAudit,
        mobileScreenshot,
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
