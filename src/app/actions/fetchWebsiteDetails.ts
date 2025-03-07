"use server";

import { launch } from "chrome-launcher";

export async function fetchWebsiteDetails(url: string) {
  if (!url) {
    throw new Error("URL is required");
  }

  let chrome;

  try {
    chrome = await launch({ chromeFlags: ["--headless"] },);
    

    const options = {
      logLevel: "silent" as const,
      output: "json" as const,
      onlyCategories: ["performance"] as string[],
      port: chrome.port,
    };

    const lighthouse = (await import("lighthouse")).default;
    const result = await lighthouse(url, options);

    if (!result?.lhr?.audits) {
      throw new Error("Failed to retrieve Lighthouse audit results");
    }

    const totalByteWeight = result.lhr.audits["total-byte-weight"]?.numericValue ?? 0;
    const screenshotDetails = result.lhr.audits["final-screenshot"]?.details;
    const screenshotBase64 =
      (screenshotDetails as { data?: string })?.data ?? null;
    const pageSizeKB = totalByteWeight / 1024;
    const pageSizeScore = calculatePageSizeScore(pageSizeKB);

    return { url, totalPageSize: `${pageSizeKB.toFixed(2)} KB`, pageSizeScore,screenshotBase64 };
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : "An unknown error occurred");
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
