"use client";

import { Suspense, useState } from "react";
import { useRouter } from "next/navigation";
import { useLighthouse } from "../context/LightHouseContext";
import Link from "next/link";

export default function Form() {
  const [loading, setLoading] = useState(false);
  const router = useRouter(); // ✅ Initialize Next.js router
  const { setData } = useLighthouse();

  async function submit(formData: FormData) {
    const url = formData.get("url") as string;

    if (!url) {
      console.error("URL is required");
      return;
    }

    setLoading(true); // ✅ Start loading state

    try {
      const response = await fetch(
        `/api/lighthouse?url=${encodeURIComponent(url)}`,
        {
          method: "GET",
        }
      );

      const data = await response.json();
      // ✅ Redirect to results page with URL as query param
      setData({
        url,
        pageSizeScore: data.pageSizeScore,
        screenshotBase64: data.screenshotBase64,
        pageSizeReturn: data.pageSizeReturn,
        numberOfPageRequests: data.numberOfPageRequests,
        totalLoadTime: data.totalLoadTime,
        cachingAudit: data.cachingAudit,
        redirectsAudit: data.redirectsAudit,
        ImageSizeAudit: data.ImageSizeAudit,
        minJSAudit: data.minJSAudit,
        minCSS:data.minCSS,
        perm_to_index:data.perm_to_index
      });
      router.push(`/results`);
    } catch (error) {
      console.error("Error fetching Lighthouse results:", error);
    } finally {
      setLoading(false); // ✅ Stop loading state
    }
  }

  return (
    <div className="max-w-md mx-auto w-full">
      <form action={submit}>
        <input
          type="url"
          name="url"
          id="url"
          required
          placeholder="Website"
          className="w-full p-3 mb-4 rounded bg-transparent text-center border-b-2 border-slate-500 text-white focus:border-blue-400 outline-none transition-colors focus:placeholder-transparent"
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
          disabled={loading} // ✅ Disable button when loading
        >
          {loading ? "Checking..." : "Get your score"}
        </button>
      </form>
    </div>
  );
}
