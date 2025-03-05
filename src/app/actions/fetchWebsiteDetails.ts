"use server";

import { launch } from "chrome-launcher";

export async function fetchWebsiteDetails(url: string) {
  if (!url) {
    return { error: "URL is required" };
  }

  let chrome;

  try {
    chrome = await launch({ chromeFlags: ["--headless"] });

    const options = {
      logLevel: "info" as const,
      output: "json" as const,
      onlyCategories: ["performance"] as string[],
      port: chrome.port,
    };

    // Dynamically import Lighthouse
    const lighthouse = (await import("lighthouse")).default;
    const result = await lighthouse(url, options);

    if (!result?.lhr?.audits) {
      throw new Error("Failed to retrieve Lighthouse audit results");
    }

    const totalByteWeight = result.lhr.audits["total-byte-weight"]?.numericValue ?? 0;
    const pageSizeKB = totalByteWeight / 1024;
    const pageSizeScore = calculatePageSizeScore(pageSizeKB);

    return {
      url,
      totalPageSize: `${pageSizeKB.toFixed(2)} KB`,
      pageSizeScore,
    };
  } catch (error) {
    return { error: error instanceof Error ? error.message : "An unknown error occurred" };
  } finally {
    if (chrome) {
      await chrome.kill();
    }
  }
}

// Example scoring function (you can modify it)
function calculatePageSizeScore(kbSize: number) {
  if (kbSize <= 500) return 100;
  if (kbSize >= 6000) return 0;
  return Math.max(0, Math.round(100 - ((kbSize - 500) / (6000 - 500)) * 100));
}