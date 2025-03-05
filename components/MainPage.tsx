"use client";

import { useLighthouse } from "../context/LightHouseContext";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Button from "./Button";
import CircleProgress from "./CircleProgress";

export default function ResultsPage() {
  const { data } = useLighthouse();
  const router = useRouter();

  useEffect(() => {
    if (!data) {
      router.push("/");
    }
  }, [data, router]);

  if (!data) return null;

  return (
    // <div className="max-w-lg mx-auto text-center mt-10">
    //   <h1 className="text-2xl font-bold text-white">Website Grading Results</h1>
    //   <div className="mt-6 p-4 border rounded-lg bg-gray-800 text-white">
    //     <p className="text-lg">URL: <span className="text-blue-400">{data.url}</span></p>
    //     <p className="text-xl font-semibold mt-3">Page Size Score: {data.pageSizeScore} / 100</p>
    //   </div>
    // </div>
    <div id="main">
      <div className="w-full flex font-sans h-screen">
        <div className="w-1/4 bg-gray-800 text-white p-6 flex flex-col overflow-y-auto max-h-screen scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-gray-700">
          <div className="flex justify-center mb-4">
            <CircleProgress score={57} />
          </div>
          <div className="text-xs text-center text-gray-300 mb-6">
            www.youtube.com
          </div>
          <div className="space-y-5 mt-2">
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span>PERFORMANCE</span> <span>15/30</span>
              </div>
              <div className="w-full bg-gray-700 h-1.5 rounded-full overflow-hidden">
                <div className="bg-red-500 h-full rounded-full w-1/2"></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span>SEO</span> <span>30/30</span>
              </div>
              <div className="w-full bg-gray-700 h-1.5 rounded-full overflow-hidden">
                <div className="bg-emerald-400 h-full rounded-full w-full"></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span>MOBILE</span> <span>30/30</span>
              </div>
              <div className="w-full bg-gray-700 h-1.5 rounded-full overflow-hidden">
                <div className="bg-emerald-400 h-full rounded-full w-full"></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span>SECURITY</span> <span>10/10</span>
              </div>
              <div className="w-full bg-gray-700 h-1.5 rounded-full overflow-hidden">
                <div className="bg-red-500 h-full rounded-full w-full"></div>
              </div>
            </div>
          </div>
          <div className="mt-10">
            <h2 className="text-lg font-semibold mb-3">
              Is your website slowing you down?
            </h2>
            <p className="text-sm text-gray-300 mb-5">
              Create and manage beautiful website pages that get traffic and
              convert leads with HubSpot CMS Free.
            </p>
            <button className="w-full bg-white text-gray-800 py-2 font-medium rounded hover:bg-gray-200 transition-colors duration-200">
              Get the Free CMS
            </button>
            <p className="text-xs text-center text-gray-400 mt-2">
              No credit card needed
            </p>
          </div>
        </div>
        <div className="flex-1 bg-gradient-to-br from-[#6a78d1] to-[#00a4bd] h-150">
          <div className="flex justify-between">
            <div className="p-4 flex justify-between items-center">
              <div className="flex items-center">
                <Image
                  src="/images/hubspot-tools-logo.png"
                  alt="HubSpot Logo"
                  width={150}
                  height={40}
                />
                <div className="ml-2 text-xs text-white">WEBSITE GRADER</div>
              </div>
            </div>
            <div className="rounded-full px-3 py-1 flex items-center space-x-1 cursor-pointer transition-colors duration-200">
              <Button />
            </div>
          </div>
          <div className="flex flex-col px-6 mt-20 pb-20">
            <div className="max-w-xl mx-auto text-center text-white mb-4">
              <h1 className="text-4xl font-bold mb-3">This site is good</h1>
              <p className="text-lg">
                Now let&#x27;s take your site from good to great! See your
                scorecard below and take action now by creating a high-speed
                website with HubSpot CMS Free.
              </p>
            </div>
            <div className="flex justify-center mt-6">
              <button className="bg-gray-800 hover:bg-gray-700 text-white py-3 px-5 rounded font-medium transition-colors duration-200">
                Create a high-speed website
              </button>
            </div>
            <div className="flex mt-5 mb-20 justify-center">
                <Image src={'/images/InterstitialBlobs.png'} width={500} height={500} alt="xyz"/>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
