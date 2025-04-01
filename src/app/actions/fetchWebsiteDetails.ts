"use server";
import dotenv from "dotenv";
dotenv.config();

const API_KEY = process.env.GOOGLE_API_KEY;
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REFRESH_TOKEN = process.env.REFREST_TOKEN;
const API_URL = process.env.API_URL;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

import { LighthouseData } from "../../../context/LightHouseContext";
import { AuditFix } from "../../../context/LightHouseContext";

let tokenCache: { access_token: string; expires_at: number } | null = null;

async function getAccessToken(): Promise<string> {
  const currentTime = Date.now();
  if (tokenCache && tokenCache.expires_at - 5000 > currentTime) {
    return tokenCache.access_token;
  }

  const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: CLIENT_ID ?? "",
      client_secret: CLIENT_SECRET ?? "",
      refresh_token: REFRESH_TOKEN ?? "",
      grant_type: "refresh_token",
    }),
  });
  const tokenData = await tokenResponse.json();
  // console.log(tokenData);
  if (!tokenData.access_token) {
    throw new Error("Failed to refresh token");
  }
  tokenCache = {
    access_token: tokenData.access_token,
    expires_at: Date.now() + tokenData.expires_in * 1000,
  };
  return tokenData.access_token;
}

export async function sendMail({
  to,
  htmlContent,
}: {
  to: string;
  htmlContent: string;
}) {
  const access_token = await getAccessToken();
  // console.log(to);
  const rawEmail = [
    `From: Dev Modi <devmoditesting@gmail.com>`,
    `To: ${to}`,
    `Subject: Report of your Website Entered`,
    "MIME-Version: 1.0",
    "Content-Type: text/html; charset=UTF-8",
    "",
    htmlContent,
  ].join("\r\n");

  const encodeEmail = Buffer.from(rawEmail)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");

  const emailResponse = await fetch(
    "https://gmail.googleapis.com/gmail/v1/users/me/messages/send",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${access_token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ raw: encodeEmail }),
    }
  );

  const emailData = await emailResponse.json();
  // console.log("Email API Response:", emailData);

  if (!emailResponse) throw new Error("Failed to send Error");
  return "HTML Email Sent Succcessfully!";
}

export async function fetchWebsiteDetails(url: string, email: string) {
  if (!url) {
    throw new Error("URL is required");
  }

  try {
    const fetchWithTimeout = async (resource: string, retries = 3) => {
      const controller = new AbortController();
      const id = setTimeout(() => controller.abort(), 120000);

      try {
        const response = await fetch(resource, {
          signal: controller.signal,
        });
        clearTimeout(id);
        return response;
      } catch (error) {
        clearTimeout(id);
        if (retries > 0) return fetchWithTimeout(resource, retries - 1);
        throw error;
      }
    };

    console.log("Fetching Lighthouse data for:", url);

    const [desktopResponse, mobileResponse] = await Promise.all([
      fetchWithTimeout(
        `${API_URL}?url=${encodeURIComponent(
          url
        )}&category=performance&category=best-practices&category=accessibility&category=seo&key=${API_KEY}`
      ),
      fetchWithTimeout(
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

    const networkRequestsAudit = desktopLighthouse["network-requests"];
    const pageRequests = networkRequestsAudit?.details?.items || [];
    const numberOfPageRequests = pageRequests.length;
    const networkPerformance =
      calculateNetworkPerformance(numberOfPageRequests);
    console.log("Page Size KB", desktopLighthouse["total-byte-weight"]);
    console.log("No. of page requests", desktopLighthouse["network-requests"]);

    const fcp = desktopLighthouse["first-contentful-paint"]?.numericValue || 0;
    const lcp =
      desktopLighthouse["largest-contentful-paint"]?.numericValue || 0;
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
    const simulatedTotalLoadTime =
      connectionTime + ttfb + resourceTime + tbt + renderingOverhead;

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
    const cachingAudit =
      desktopLighthouse["uses-long-cache-ttl"]?.score ?? null;
    const redirectsAudit = desktopLighthouse["redirects"]?.score ?? null;
    const ImageSizeAudit =
      desktopLighthouse["uses-optimized-images"]?.score ?? null;
    const minJSAudit =
      desktopLighthouse["unminified-javascript"]?.score ?? null;
    const minCSS = desktopLighthouse["unminified-css"]?.score ?? null;
    console.log("caching", desktopLighthouse["uses-long-cache-ttl"]);
    console.log("redirects", desktopLighthouse["redirects"]);
    console.log("ImageSize", desktopLighthouse["uses-optimized-images"]);
    console.log("minJS", desktopLighthouse["unminified-javascript"]);
    console.log("minCSS", desktopLighthouse["unminified-css"]);

    // SEO audit checks
    const metaDescriptionAudit =
      desktopLighthouse["meta-description"]?.score ?? null;
    const crawlable = desktopLighthouse["is-crawlable"]?.score ?? null;
    const is_robot = desktopLighthouse["robots-txt"]?.score ?? null;
    const perm_to_index =
      crawlable === 1 && is_robot !== null && is_robot !== 0;
    const pluginsAudit =
      desktopLighthouse["critical-request-chains"]?.score ?? null;
    const linkTextAudit = desktopLighthouse["link-text"]?.score ?? null;
    console.log("metaDescription", desktopLighthouse["meta-description"]);
    console.log("crawlable", desktopLighthouse["is-crawlable"]);
    console.log("is_robot", desktopLighthouse["robots-txt"]);
    console.log("perm_to_index", perm_to_index);
    console.log("pluginsAudit", desktopLighthouse["critical-request-chains"]);
    console.log("linkTextAudit", desktopLighthouse["link-text"]);

    // Mobile audits
    const mobileImageAudit = mobileLighthouse["final-screenshot"];
    const mobileScreenshot = mobileImageAudit?.details?.data ?? null;
    const legibleFontSize = desktopLighthouse["font-size"]?.score ?? null;
    const responsiveCheck = mobileLighthouse["viewport"]?.score ?? null;
    console.log("mobileImageAudit", mobileLighthouse["final-screenshot"]);
    console.log("mobileScreenshot", mobileScreenshot);
    console.log("legibleFontSize", desktopLighthouse["font-size"]);
    console.log("responsiveCheck", mobileLighthouse["viewport"]);

    // Security audits - FIXED
    const isOnHTTPS = desktopLighthouse["is-on-https"]?.score ?? null;
    const redirectsToHTTPS = desktopLighthouse["redirects-http"]?.score ?? null;
    const httpAudit = isOnHTTPS === 1 ? 1 : 0;

    // Additional security checks
    const secureLibAudit =
      "js-libraries" in desktopLighthouse
        ? desktopLighthouse["js-libraries"]?.score ?? null
        : undefined;
    console.log("isOnHTTPS", desktopLighthouse["is-on-https"]);
    console.log("redirectsToHTTPS", desktopLighthouse["redirects-http"]);
    console.log("httpAudit", httpAudit);
    console.log("secureLibAudit", desktopLighthouse["js-libraries"]);

    // User Experience
    const colorAudit = desktopLighthouse["color-contrast"]?.score ?? null;
    const altTextAudit = desktopLighthouse["image-alt"]?.score ?? null;
    const ariaAudits = desktopLighthouse["aria-allowed-attr"]?.score ?? null;
    const tapTargetAudit = desktopLighthouse["tap-targets"];
    console.log("color-audit", desktopLighthouse["color-contrast"]);
    console.log("alttext-audit", desktopLighthouse["image-alt"]);
    console.log("aria-audit", desktopLighthouse["aria-allowed-attr"]);
    console.log("tap-targets", desktopLighthouse["tap-targets"]);

    // Best Practices | Code Health
    const doctypeAudit = desktopLighthouse["doctype"]?.score ?? null;
    const charsetAudit = desktopLighthouse["charset"]?.score ?? null;
    const errorconsoleAudit =
      desktopLighthouse["errors-in-console"]?.score ?? null;
    const deprecationAudit = desktopLighthouse["deprecations"]?.score ?? null;
    const geolocationAudit =
      desktopLighthouse["geolocation-on-start"]?.score ?? null;

    console.log("doctypeAudit", desktopLighthouse["doctype"]);
    console.log("charsetAudit", desktopLighthouse["charset"]);
    console.log("errorconsoleAudit", desktopLighthouse["errors-in-console"]);
    console.log("deprecationAudit", desktopLighthouse["deprecations"]);
    console.log("geolocationAudit", desktopLighthouse["geolocation-on-start"]);

    const cacheQuality: boolean =
      cachingAudit !== undefined && cachingAudit >= 0.5;
    const redirectQuality: boolean =
      redirectsAudit !== undefined && redirectsAudit >= 0.5;
    const imageQuality: boolean =
      ImageSizeAudit !== undefined && ImageSizeAudit >= 0.5;
    const JSQuality: boolean = minJSAudit !== undefined && minJSAudit >= 0.8;
    const CSSQuality: boolean = minCSS !== undefined && minCSS >= 0.8;
    const TextQuality: boolean =
      linkTextAudit !== undefined && linkTextAudit >= 0.5;
    const SecureJS: boolean = secureLibAudit === null || secureLibAudit === 1;

    let websiteData: LighthouseData = {
      audit: {
        url,
        email,
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
        cacheQuality,
        redirectQuality,
        secureLibAudit,
        imageQuality,
        JSQuality,
        CSSQuality,
        TextQuality,
        SecureJS,
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
        altTextAudit,
        colorAudit,
        ariaAudits,
        doctypeAudit,
        charsetAudit,
        errorconsoleAudit,
        deprecationAudit,
        geolocationAudit,
        performanceMetrics: {
          ttfb: (ttfb / 1000).toFixed(2),
          fcp: (fcp / 1000).toFixed(2),
          lcp: (lcp / 1000).toFixed(2),
          tti: (tti / 1000).toFixed(2),
          tbt: (tbt / 1000).toFixed(2),
          cls,
          estimatedFullLoadTime: (totalLoadTime / 1000).toFixed(2),
        },
      },
      score: {
        mainScore: 0,
        mainPerformanceScore: 0,
        mainSEOScore: 0,
        mainMobileScore: 0,
        mainSecurityScore: 0,
        mainCodeHealthScore: 0,
        mainUserExperienceScore: 0,
      },
    };
    websiteData.score = await mainScoreCalculate(websiteData);

    return websiteData;
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

// Adjusted to align with real-world expectation of 10-12 seconds
function calculateRealisticPageSpeed(timeInMS: number) {
  const maxAcceptableTime = 20000;

  if (timeInMS >= maxAcceptableTime) return 0;

  return Math.round(100 * Math.pow(1 - timeInMS / maxAcceptableTime, 2));
}

export async function mainScoreCalculate(websiteData: LighthouseData) {
  let mainPerformanceScore: number = [
    ((websiteData?.audit?.pageSizeScore ?? 0) * 6) / 100,
    ((websiteData?.audit?.networkPerformance ?? 0) * 7) / 100,
    ((websiteData?.audit?.speedPerformance ?? 0) * 7) / 100,
    websiteData?.audit?.cacheQuality ? 2 : 0,
    websiteData?.audit?.redirectQuality ? 2 : 0,
    websiteData?.audit?.imageQuality ? 2 : 0,
    websiteData?.audit?.JSQuality ? 2 : 0,
    websiteData?.audit?.CSSQuality ? 2 : 0,
  ].reduce((sum, value) => sum + value, 0);

  let mainSEOScore: number = [
    websiteData?.audit?.perm_to_index ? 7 : 0,
    websiteData?.audit?.metaDescriptionAudit === 1 ? 7 : 0,
    websiteData?.audit?.TextQuality ? 8 : 0,
    websiteData?.audit?.pluginsAudit === 1 ? 8 : 0,
  ].reduce((sum, value) => sum + value, 0);

  let mainMobileScore: number = [
    websiteData?.audit?.legibleFontSize === 1 ? 10 : 0,
    websiteData?.audit?.metaDescriptionAudit === 1 ? 10 : 0,
    websiteData?.audit?.responsiveCheck === 1 ? 10 : 0,
  ].reduce((sum, value) => sum + value, 0);

  let mainSecurityScore: number = [
    websiteData?.audit?.httpAudit === 1 ? 5 : 0,
    websiteData?.audit?.SecureJS ? 5 : 0,
  ].reduce((sum, value) => sum + value, 0);

  let mainUserExperienceScore: number = [
    websiteData?.audit?.colorAudit ? 2 : 0,
    websiteData?.audit?.ariaAudits ? 3 : 0,
    websiteData?.audit?.altTextAudit ? 3 : 0,
  ].reduce((sum, value) => sum + value, 0);

  let mainCodeHealthScore: number = [
    websiteData?.audit?.doctypeAudit ? 2 : 0,
    websiteData?.audit?.charsetAudit ? 2 : 0,
    websiteData?.audit?.errorconsoleAudit ? 3 : 0,
    websiteData?.audit?.deprecationAudit ? 3 : 0,
  ].reduce((sum, value) => sum + value, 0);

  let mainScore: number =
    ((mainPerformanceScore * 0.5 +
      mainSecurityScore * 0.15 +
      mainSEOScore * 0.2 +
      mainMobileScore * 0.15 +
      mainCodeHealthScore * 0.2) *
      100) /
    29;

  return {
    mainPerformanceScore,
    mainSEOScore,
    mainMobileScore,
    mainSecurityScore,
    mainUserExperienceScore,
    mainCodeHealthScore,
    mainScore,
  };
}

export async function getAISuggestions(
  websiteData: LighthouseData
): Promise<AuditFix[]> {
  const badAudits = [
    websiteData?.audit?.pageSizeKB !== undefined &&
    websiteData?.audit?.pageSizeKB > 3000
      ? {
          audit: "Page Size",
          value: websiteData?.audit?.pageSizeKB,
          issue: "Large page size may slow down loading page",
        }
      : null,
    websiteData?.audit?.numberOfPageRequests !== undefined &&
    websiteData?.audit?.numberOfPageRequests > 30
      ? {
          audit: "Page Requests",
          value: websiteData?.audit?.numberOfPageRequests,
          issue: "Too many requests",
        }
      : null,
    websiteData?.audit?.totalLoadTime !== undefined &&
    websiteData?.audit?.totalLoadTime > 6000
      ? {
          audit: "Total Time",
          value: websiteData?.audit?.totalLoadTime,
          issue: "Page takes too long to load",
        }
      : null,
    !websiteData?.audit?.cachingAudit
      ? { audit: "Browser Caching", value: "No", issue: "No caching found" }
      : null,
    !websiteData?.audit?.redirectsAudit
      ? { audit: "Page Redirects", value: "No", issue: "Too many redirects" }
      : null,
    !websiteData?.audit?.ImageSizeAudit
      ? { audit: "Image Size", value: "No", issue: "Image size is too large" }
      : null,
    !websiteData?.audit?.minJSAudit
      ? {
          audit: "Minified JS",
          value: "No",
          issue: "JavaScript is not minified",
        }
      : null,
    !websiteData?.audit?.minCSS
      ? { audit: "Minified CSS", value: "No", issue: "CSS is not minified" }
      : null,
    !websiteData?.audit?.perm_to_index
      ? {
          audit: "Permission to Index",
          value: "No",
          issue: "No permission to index",
        }
      : null,
    !websiteData?.audit?.metaDescriptionAudit
      ? {
          audit: "Meta Description",
          value: "No",
          issue: "Not enough meta description",
        }
      : null,
    !websiteData?.audit?.pluginsAudit
      ? {
          audit: "Plugin Audit",
          value: "No",
          issue: "More Plugin Audit",
        }
      : null,
    !websiteData?.audit?.TextQuality
      ? {
          audit: "Text Description",
          value: "No",
          issue: "Not descriptive link text",
        }
      : null,
    !websiteData?.audit?.legibleFontSize
      ? {
          audit: "Mobile Font Size",
          value: "No",
          issue: "font size is very less",
        }
      : null,
    !websiteData?.audit?.responsiveCheck
      ? {
          audit: "Mobile Responsive",
          value: "No",
          issue: "Not responsive for mobile",
        }
      : null,
    !websiteData?.audit?.httpAudit
      ? {
          audit: "HTTP Security",
          value: "No",
          issue: "HTTPS not enabled",
        }
      : null,
    !websiteData?.audit?.SecureJS
      ? {
          audit: "JS Libraries Security",
          value: "No",
          issue: "JS Libraries not secured",
        }
      : null,
    !websiteData?.audit?.colorAudit
      ? {
          audit: "Color Contrast",
          value: "No",
          issue: "Color contrast is not good",
        }
      : null,
    !websiteData?.audit?.altTextAudit
      ? {
          audit: "Image Alt Text",
          value: "No",
          issue: "Image alt text is missing",
        }
      : null,
    !websiteData?.audit?.ariaAudits
      ? {
          audit: "ARIA Attributes",
          value: "No",
          issue: "ARIA attributes are missing",
        }
      : null,
    !websiteData?.audit?.doctypeAudit
      ? {
          audit: "Doctype Declaration",
          value: "No",
          issue: "Doctype declaration is missing",
        }
      : null,
    !websiteData?.audit?.charsetAudit
      ? {
          audit: "Charset Declaration",
          value: "No",
          issue: "Charset declaration is missing",
        }
      : null,
    !websiteData?.audit?.errorconsoleAudit
      ? {
          audit: "Error Console",
          value: "Yes",
          issue: "Errors found in console",
        }
      : null,
    !websiteData?.audit?.deprecationAudit
      ? {
          audit: "Deprecation Warnings",
          value: "No",
          issue: "Deprecation warnings found",
        }
      : null,
  ].filter(Boolean);

  // console.log("🛠️ Bad Audits Payload:", JSON.stringify(badAudits, null, 2));

  const prompt = `You are a web performance expert. Provide structured suggestions for improving ALL the failing audits listed below. Ensure EACH audit gets One suggestion of 2 lines.

Here is the list of failing audits: ${JSON.stringify(badAudits)}.

Each audit is given as:
{audit: "audit-name", value: "data or yes/no", issue: "reason of issue"}.
Change your answers all time dont put it same and also main thing you are a website performance checker using Lighthouse so give answer according to it so use some audits term and also I had provide you a limit below give ans according to that
Ensure that EACH audit in the list receives a recommendation.
Just for your reference Page Size is good upto 3000, page request is best upto 30 medium for 60-70 and after that not good, time is also good upto 5 sec then upto 10 sec bad and after worst
this is just for your reference , so change your fix acc to it. 

📌 IMPORTANT: Respond **ONLY** in JSON format as an array, like this:(This is not an answer just a format)
[
  { "audit": "Page Size", "fix": "Enable gzip compression and optimize images to reduce page size." },
  { "audit": "Page Requests", "fix": "Combine JavaScript and CSS files to minimize requests." },
  { "audit": "Total Time", "fix": "Use lazy loading and optimize server response times." },
  { "audit": "Browser Caching", "fix": "Set cache headers for better performance." }
]

📌 IMPORTANT: Do NOT include \`\`\`json or \`\`\` in your response. Just return raw JSON.
`;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-pro:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ role: "user", parts: [{ text: prompt }] }],
          generationConfig: {
            maxOutputTokens: 300,
            temperature: 0.7,
            topP: 1,
          },
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json();
    // console.log("📌 Full API Response:", JSON.stringify(data, null, 2));

    const textResponse =
      data?.candidates?.[0]?.content?.parts?.[0]?.text || "[]";
    const cleanedResponse = textResponse.replace(/```json|```/g, "").trim();

    // console.log("📌 Cleaned AI Response:", cleanedResponse);

    try {
      return JSON.parse(cleanedResponse);
    } catch (error) {
      console.error("⚠️ JSON Parsing Error:", error);
      return [];
    }
  } catch (error) {
    console.log("⚠️ Error fetching AI suggestions:", error);
    return [];
  }
}
