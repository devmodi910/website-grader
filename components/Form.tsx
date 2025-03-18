"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { fetchWebsiteDetails } from "@/app/actions/fetchWebsiteDetails";
import { useLighthouse } from "../context/LightHouseContext";
import Link from "next/link";

export default function Form() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { setData } = useLighthouse();

  async function submit(formData: FormData) {
    let url = formData.get("url") as string;

    if (!url) {
      console.error("URL is required");
      return;
    }

    if (!/^https?:\/\//i.test(url)) {
      url = `https://${url}`;
    }

    setLoading(true); // Set loading to true to show the loading state

    try {
      console.log("Fetching data directly from fetchWebsiteDetails...");
      const data = await fetchWebsiteDetails(url);

      console.log("Fetched Data:", data);
      setData({
        url,
        pageSizeScore: data.pageSizeScore,
        screenshotBase64: data.screenshotBase64,
        pageSizeReturn: data.pageSizeReturn,
        pageSizeKB: data.pageSizeKB,
        numberOfPageRequests: data.numberOfPageRequests,
        totalLoadTime: data.totalLoadTime,
        cachingAudit: data.cachingAudit,
        redirectsAudit: data.redirectsAudit,
        ImageSizeAudit: data.ImageSizeAudit,
        minJSAudit: data.minJSAudit,
        minCSS: data.minCSS,
        perm_to_index: data.perm_to_index,
        metaDescriptionAudit: data.metaDescriptionAudit,
        pluginsAudit: data.pluginsAudit,
        linkTextAudit: data.linkTextAudit,
        mobileScreenshot: data.mobileScreenshot,
        legibleFontSize: data.legibleFontSize,
        responsiveCheck: data.responsiveCheck,
        httpAudit: data.httpAudit,
        secureLibAudit: data.secureLibAudit,
        networkPerformance: data.networkPerformance,
        speedPerformance: data.speedPerformance,
      });

      router.push(`/results`);
    } catch (error) {
      router.push(`/error?message=Failed to fetch website details`);
    } finally {
      setLoading(false); // Set loading to false after fetching completes
    }
  }

  return (
    <div className="relative max-w-md mx-auto w-full">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const form = e.target as HTMLFormElement;
          submit(new FormData(form));
        }}
      >
        <input
          type="url"
          name="url"
          id="urlInput"
          required
          placeholder="Website (e.g., example.com or https://example.com)"
          className="w-full p-3 mb-4 rounded bg-transparent text-center border-b-2 border-slate-500 text-white focus:border-blue-400 outline-none transition-colors focus:placeholder-transparent"
          onBlur={(e) => {
            let value = e.target.value.trim();
            if (value && !/^https?:\/\//i.test(value)) {
              e.target.value = `https://${value}`;
            }
          }}
        />

        <input
          type="email"
          placeholder="Email"
          className="w-full p-3 mb-4 rounded bg-transparent text-center border-b-2 border-slate-500 text-white focus:border-blue-400 outline-none transition-colors focus:placeholder-transparent"
        />

        <p className="text-white text-xs mb-6 text-left">
          We're committed to your privacy. HubSpot uses the information you
          provide to us to contact you about our relevant content, products, and
          services. You may unsubscribe from these communications at any time.
          For more information, check out our{" "}
          <Link href="/webgrader" className="text-blue-400 hover:underline">
            Privacy Policy.
          </Link>
        </p>

        <button
          className="bg-orange-500 text-white px-5 py-2 rounded-sm font-normal w-40 transition-all duration-300 transform cursor-pointer"
          disabled={loading}
        >
          {loading ? "Checking..." : "Get your score"}
        </button>
      </form>
    </div>
  );
}
