"use client";
import { LighthouseData } from "../context/LightHouseContext";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  fetchWebsiteDetails,
  getAISuggestions,
  sendMail,
} from "../src/app/actions/fetchWebsiteDetails";
import { useLighthouse } from "../context/LightHouseContext";
import Link from "next/link";

export default function Form() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { setData, setAIsuggestions } = useLighthouse();

  function getHTML(finalScore: LighthouseData) {
    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Website Score Report</title>
          <link rel="preconnect" href="https://fonts.googleapis.com">
          <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600&display=swap">
          <style>
              body {
                  font-family: 'Poppins', sans-serif;
                  background: linear-gradient(135deg, #1e3c72, #2a5298);
                  color: #fff;
                  text-align: center;
                  padding: 30px;
              }
              .container {
                  max-width: 600px;
                  background: #2d3e50;
                  padding: 25px;
                  border-radius: 12px;
                  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
                  margin: auto;
                  color: #fff;
                  text-align: center;
              }
              h2 {
                  font-weight: 600;
                  front-size: 32px;
                  margin-bottom: 15px;
              }
              .main-score {
                  width: 120px;
                  height: 120px;
                  border-radius: 50%;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  font-size: 36px;
                  font-weight: bold;
                  color: white;
                  margin: auto;
                  background: conic-gradient(#4CAF50 ${Math.floor(
                    finalScore?.score?.mainScore ?? 0
                  )}%, #ddd 0%);
                  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
              }
              .score-container {
                  display: grid;
                  grid-template-columns: repeat(2, 1fr);
                  gap: 10px;
                  margin-top: 20px;
                  justify-items: center;
              }
              .score {
                  font-size: 18px;
                  display: flex;
                  justify-content: center;
                  justify-items: center;
                  align-items: center;
                  font-weight: 600;
                  margin: 10px;
                  padding: 12px;
                  border-radius: 8px;
                  color: #fff;
                  width: 40%; /* Adjusted */
                  text-align: center;
              }
              .high { background: #00bda5; }  /* Green */
              .medium { background: #00bda5; } /* Orange */
              .low { background: #00bda5; }  /* Red */
              @media (max-width: 480px) { /* Adjusted breakpoint */
                  .score-container {
                      grid-template-columns: 1fr;
                  }
                  .score {
                      width: 100%;
                  }
              }
          </style>
      </head>
      <body>
          <div class="container">
              <h2>Website Score Report</h2>
              <div class="main-score">${Math.floor(
                finalScore?.score?.mainScore ?? 0
              )}</div>
              <div class="score-container">
                  <div class="score medium">SEO Score: ${Math.floor(
                    finalScore?.score?.mainSEOScore ?? 0
                  )}/30</div>
                  <div class="score medium">Performance: ${Math.floor(
                    finalScore?.score?.mainPerformanceScore ?? 0
                  )}/30</div>
                  <div class="score low">Mobile Performance: ${Math.floor(
                    finalScore?.score?.mainMobileScore ?? 0
                  )}/30</div>
                  <div class="score high">User Experience: ${Math.floor(
                    finalScore?.score?.mainUserExperienceScore ?? 0
                  )}/10</div>
                  <div class="score medium">Code Health: ${Math.floor(
                    finalScore?.score?.mainCodeHealthScore ?? 0
                  )}/10</div>
                  <div class="score high">Security: ${Math.floor(
                    finalScore?.score?.mainSecurityScore ?? 0
                  )}/10</div>
              </div>
          </div>
      </body>
      </html>
      `;
  }

  async function submit(formData: FormData) {
    let url = formData.get("url") as string;
    let email = formData.get("email") as string;

    if (!url) {
      console.error("URL is required");
      return;
    }

    if (!/^https?:\/\//i.test(url)) {
      url = `https://${url}`;
    }

    setLoading(true);

    try {
      console.log("Fetching data directly from fetchWebsiteDetails...");
      const data = await fetchWebsiteDetails(url, email);

      console.log("Fetched Data:", data);
      setData(data as LighthouseData);
      const AIsugg = await getAISuggestions(data as LighthouseData);

      setAIsuggestions(AIsugg);
      const htmlContent = getHTML(data as LighthouseData);
      await sendMail({ to: email, htmlContent });
      router.push(`/results`);
    } catch (error) {
      router.push(`/error`);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="fetching-container">⏳ Fetching Lighthouse Data...</div>
    );
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
