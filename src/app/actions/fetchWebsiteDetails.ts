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
    const fetchWithTimeout = async (resource: string, options = {}) => {
      const controller = new AbortController();
      const id = setTimeout(() => controller.abort(), 60000);
      
      try {
        const response = await fetch(resource, {
          ...options,
          signal: controller.signal,
        });
        clearTimeout(id);
        return response;
      } catch (error) {
        clearTimeout(id);
        throw error;
      }
    };

    const [desktopResponse, mobileResponse] = await Promise.all([
      fetchWithTimeout(
        `${API_URL}?url=${encodeURIComponent(
          url
        )}&category=performance&category=best-practices&category=seo&key=${API_KEY}`
      ),
      fetchWithTimeout(
        `${API_URL}?url=${encodeURIComponent(
          url
        )}&category=performance&category=seo&category=best-practices&category=accessibility&strategy=mobile&key=${API_KEY}`
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

    const networkRequestsAudit = desktopLighthouse["network-requests"];
    const pageRequests = networkRequestsAudit?.details?.items || [];
    const numberOfPageRequests = pageRequests.length;
    const networkPerformance = calculateNetworkPerformance(numberOfPageRequests);

    const fcp = desktopLighthouse["first-contentful-paint"]?.numericValue || 0;
    const lcp = desktopLighthouse["largest-contentful-paint"]?.numericValue || 0;
    const tti = desktopLighthouse["interactive"]?.numericValue || 0;
    const tbt = desktopLighthouse["total-blocking-time"]?.numericValue || 0;
    const speedIndex = desktopLighthouse["speed-index"]?.numericValue || 0;
    const ttfb = desktopLighthouse["server-response-time"]?.numericValue || 0;
    const fid = desktopLighthouse["max-potential-fid"]?.numericValue || 0;
    const cls = desktopLighthouse["cumulative-layout-shift"]?.numericValue || 0;
    
    // FIXED: Get network timings from all requests to find true end time
    let longestNetworkTime = 0;
    if (pageRequests.length > 0) {
      for (const request of pageRequests) {
        // Some lighthouse versions use endTime, others use the finish property
        const endTime = request.endTime || request.finish || 0;
        if (endTime > longestNetworkTime) {
          longestNetworkTime = endTime;
        }
      }
    }

    // If we still can't get network time, estimate based on page size
    if (longestNetworkTime <= 0) {
      // Estimate network time based on page size and typical connection speed
      // Average connection speed ~5 Mbps = 640 KB/s
      const estimatedLoadTimeMs = (pageSizeKB / 640) * 1000;
      longestNetworkTime = Math.max(estimatedLoadTimeMs, lcp * 1.5);
      // console.log(`Network time estimated from page size: ${longestNetworkTime.toFixed(2)}ms`);
    }

    // NEW: Calculate more real-world metrics
    
    // 1. DNS resolution + connection setup (typical range: 100-300ms)
    const connectionTime = 200;
    
    // 2. Resource fetch and parsing time
    const resourceTime = Math.max(tti, longestNetworkTime);
    
    // 3. Add browser rendering overhead (typical range: 500-2000ms based on device)
    const renderingOverhead = Math.min(pageSizeKB, 5000) * 0.3;
    
    // 4. Get full page load metrics
    // Full page load should include the complete user experience from search to full render
    const simulatedTotalLoadTime = connectionTime + ttfb + resourceTime + tbt + renderingOverhead;
    
    // Adjust to real-world conditions by applying a scaling factor
    // Simulating differences between lab and real-world timing
    const realWorldFactor = 1.5; // Lab tests are often 1.5-2x faster than real user experience
    const totalLoadTime = simulatedTotalLoadTime * realWorldFactor;
    
    // console.log({
    //   ttfb,
    //   lcp,
    //   tti,
    //   speedIndex,
    //   longestNetworkTime,
    //   tbt,
    //   connectionTime,
    //   resourceTime,
    //   renderingOverhead,
    //   simulatedTotalLoadTime,
    //   realWorldFactor,
    //   totalLoadTime,
    //   totalLoadTimeSeconds: (totalLoadTime / 1000).toFixed(2)
    // });

    // Calculate score based on realistic user perception (10-12 seconds target)
    const speedPerformance = calculateRealisticPageSpeed(totalLoadTime);

    // Audit extraction
    const cachingAudit = desktopLighthouse["uses-long-cache-ttl"]?.score ?? null;
    const redirectsAudit = desktopLighthouse["redirects"]?.score ?? null;
    const ImageSizeAudit = desktopLighthouse["uses-optimized-images"]?.score ?? null;
    const minJSAudit = desktopLighthouse["unminified-javascript"]?.score ?? null;
    const minCSS = desktopLighthouse["unminified-css"]?.score ?? null;

    // SEO audit checks
    const metaDescriptionAudit = desktopLighthouse["meta-description"]?.score ?? null;
    const crawlable = desktopLighthouse["is-crawlable"]?.score ?? null;
    const is_robot = desktopLighthouse["robots-txt"]?.score ?? null;
    const perm_to_index = crawlable === 1 && is_robot !== null && is_robot !== 0;

    // Additional audits
    // const pluginsAudit = desktopLighthouse["plugins"]?.score ?? desktopLighthouse["content-plugins"]?.score ?? null;
    const pluginsAudit = desktopLighthouse["critical-request-chains"]?.score ?? null;
    // console.log(desktopLighthouse["critical-request-chains"])

    const linkTextAudit = desktopLighthouse["link-text"]?.score ?? null;

    // Mobile audits
    const mobileImageAudit = mobileLighthouse["final-screenshot"];
    const mobileScreenshot = mobileImageAudit?.details?.data ?? null;
    const legibleFontSize = mobileLighthouse["font-size"]?.score ?? null;
    const responsiveCheck = mobileLighthouse["viewport"]?.score ?? null;
    // console.log(ImageSizeAudit)
    // console.log(minJSAudit)
    // console.log(pluginsAudit)
    // console.log(legibleFontSize)
    // console.log(metaDescriptionAudit)

    // Security audits - FIXED
    const isOnHTTPS = desktopLighthouse["is-on-https"]?.score ?? null;
    const redirectsToHTTPS = desktopLighthouse["redirects-http"]?.score ?? null;
    const httpAudit = isOnHTTPS === 1 ? 1 : 0;
    
    // Additional security checks
    const secureLibAudit = "js-libraries" in desktopLighthouse
  ? desktopLighthouse["js-libraries"].score
  : undefined;
  console.log(secureLibAudit);
    return {
      url,
      totalPageSize: `${pageSizeKB.toFixed(2)} KB`,
      pageSizeScore,
      screenshotBase64,
      pageSizeKB,
      pageSizeReturn,
      numberOfPageRequests,
      networkPerformance,
      totalLoadTime,
      totalLoadTimeSeconds: (totalLoadTime / 1000).toFixed(2),
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
      performanceMetrics: {
        ttfb: (ttfb / 1000).toFixed(2),
        fcp: (fcp / 1000).toFixed(2),
        lcp: (lcp / 1000).toFixed(2),
        tti: (tti / 1000).toFixed(2),
        tbt: (tbt / 1000).toFixed(2),
        cls,
        estimatedFullLoadTime: (totalLoadTime / 1000).toFixed(2)
      }
    };
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : "An unknown error occurred"
    );
  }
}

// Adjust page size score calculation
function calculatePageSizeScore(kbSize: number) {
  if (kbSize >= 6000) return 0;
  return Math.max(0, Math.round(100 - (kbSize / 6000) * 100));
}

function calculateNetworkPerformance(numberOfPageRequests: number) {
  if (numberOfPageRequests >= 200) return 0;
  return Math.max(0, Math.round(100 - (numberOfPageRequests / 200) * 100));
}

function calculateRealisticPageSpeed(timeInMS: number) {
  const maxAcceptableTime = 20000;
  
  if (timeInMS >= maxAcceptableTime) return 0;
  
  return Math.round(100 * Math.pow(1 - timeInMS / maxAcceptableTime, 2));
}