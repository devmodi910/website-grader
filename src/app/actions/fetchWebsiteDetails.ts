"use server";

import { launch } from "chrome-launcher";
import { createRequire } from "module";
import { redirect } from "next/dist/server/api-utils";

const require = createRequire(import.meta.url);
const lighthouse = require("lighthouse").default;

// Function to calculate page size score (0-100 scale)
function calculatePageSizeScore(kbSize: number) {
  if (kbSize <= 500) return 100;
  if (kbSize >= 6000) return 0;
  return Math.max(0, Math.round(100 - ((kbSize - 500) / (6000 - 500)) * 100));
}

export async function fetchWebsiteDetails(url: string) {
  if (!url) {
    return { error: "URL is required" };
  }

  let chrome;

  try {
    chrome = await launch({ chromeFlags: ["--headless"] });

    const options = {
      logLevel: "info",
      output: "json",
      onlyCategories: ["performance"],
      port: chrome.port,
    };

    const result = await lighthouse(url, options);

    if (!result?.lhr?.audits) {
      throw new Error("Failed to retrieve Lighthouse audit results");
    }

    const totalByteWeight = result.lhr.audits["total-byte-weight"]?.numericValue ?? 0;
    const pageSizeKB = totalByteWeight / 1024; // Convert bytes to KB
    const pageSizeScore = calculatePageSizeScore(pageSizeKB);

    console.log("Page Size Score:", pageSizeScore);

    return {
      url,
      totalPageSize: `${pageSizeKB.toFixed(2)} KB`,
      pageSizeScore,
    };
  } catch (error) {
    // ✅ Explicitly assert the error as an instance of `Error`
    if (error instanceof Error) {
      return { error: error.message };
    }
    return { error: "An unknown error occurred" };
  } finally {
    if (chrome) {
      await chrome.kill();
    }
  }
}
