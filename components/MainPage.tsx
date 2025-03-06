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
    <div
      id="main"
      className="relative flex flex-col md:flex-row h-screen overflow-y-auto"
    >
      {/* Sidebar */}
      <div
        className="w-full md:w-1/4 bg-[#2d3e50] text-white p-6 flex flex-col 
        md:sticky md:top-0 md:h-screen md:max-h-screen md:overflow-y-auto scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-gray-700"
      >
        <div className="flex justify-center mb-4">
          <CircleProgress score={data.pageSizeScore} />
        </div>

        <div className="text-xs text-center text-gray-300 mb-6">
          www.youtube.com
        </div>

        {/* Scores */}
        <div className="space-y-5 mt-2">
          {[
            {
              label: "PERFORMANCE",
              score: "15/30",
              width: "w-1/2",
              color: "#00bda5", // This is a valid Tailwind class
            },
            {
              label: "SEO",
              score: "30/30",
              width: "w-full",
              color: "#00bda5", // This is a HEX color (not a Tailwind class)
            },
            {
              label: "MOBILE",
              score: "30/30",
              width: "w-full",
              color: "#00bda5",
            },
            {
              label: "SECURITY",
              score: "10/10",
              width: "w-full",
              color: "#00bda5",
            },
          ].map(({ label, score, width, color }, index) => (
            <div key={index}>
              <div className="flex justify-between text-[14px] font-semibold mb-1">
                <span>{label}</span> <span>{score}</span>
              </div>
              <div className="w-full bg-gray-700 h-1.5 rounded-full overflow-hidden">
                {/* Use inline styles for HEX colors, Tailwind classes as-is */}
                <div
                  className={`h-full rounded-full ${width}`}
                  style={{ backgroundColor: color }}
                ></div>
              </div>
            </div>
          ))}
        </div>

        {/* Promotional Section */}
        <div className="mt-10">
          <h2 className="text-[20px] font-semibold mb-3">
            Is your website slowing you down?
          </h2>
          <p className="text-sm text-white mb-5">
            Create and manage beautiful website pages that get traffic and
            convert leads with HubSpot CMS Free.
          </p>
          <button className="w-full bg-white text-gray-800 py-2 font-medium rounded hover:bg-gray-200 transition-colors duration-200 cursor-pointer">
            Get the Free CMS
          </button>
          <p className="text-xs text-center text-white mt-2">
            No credit card needed
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 min-h-screen relative">
        {/* Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#6a78d1] to-[#00a4bd] h-[600px] -z-10"></div>

        {/* Header */}
        <div className="flex justify-between p-4">
          <div className="flex items-center">
            <Image
              src="/images/hubspot-tools-logo.png"
              alt="HubSpot Logo"
              width={150}
              height={40}
            />
            <div className="ml-2 text-xs text-white">WEBSITE GRADER</div>
          </div>
          <div className="rounded-full px-3 py-1 flex items-center space-x-1 cursor-pointer transition-colors duration-200">
            <Button />
          </div>
        </div>

        {/* Main Content Section */}
        <div className="flex flex-col align-middle mt-20">
          <div className="max-w-2xl mx-auto text-white mb-4">
            <h1 className="text-5xl text-center font-bold mb-3">
              This site is great
            </h1>
            <p className="text-[14px] leading-6">
              You're amazing! Let's all bask in the glow of your amazingness.
              Ahhh. See your scorecard below and take action now by creating a
              high-speed website with HubSpot CMS Free.
            </p>
          </div>

          {/* CTA Button */}
          <div className="flex justify-center mt-6">
            <button className="bg-gray-800 hover:bg-gray-700 text-white py-3 px-5 rounded font-medium transition-colors duration-200">
              Create a high-speed website
            </button>
          </div>

          {/* Image Section */}
          <div className="flex mt-[20px] mb-[20px] justify-center">
          {/* <embed type="image/jpg" src={data.screenshotBase64} width="300" height="200"/> */}
            <Image
              className="text-[14px] font-['Lexend_Deca','Helvetica','Arial',sans-serif]
              text-center text-white box-border border-0 bg-white 
              h-[300px] w-[500px] md:h-[409px] md:w-[760px] max-w-full rounded-b-lg shadow-lg "
              src={data.screenshotBase64}
              
              width={1000}
              height={1000}
              alt={`Screenshot of ${data.url}`}
            />
          </div>
        </div>
        <div className="bg-[#f5f8fa] flex flex-col justify-center text-center font-black">
          <div className="h-full align-middle mb-15">
            <div className="mb-15">
              <div className="flex justify-center mt-15 mb-3 text-center">
                <div className="flex justify-center items-center w-38 object-contain ">
                  <Image
                    src={"/images/file1.png"}
                    width={200}
                    height={200}
                    alt="xyz"
                  />
                </div>
              </div>
              <div className="mt-6">
                <div className="text-5xl font-bold">
                  <span className="text-[#00bda5]">30</span>
                  <span className="text-[#33475b] text-3xl">/30</span>
                </div>
                <div className="mb-[10px] inline-block relative w-60">
                  <div className="bg-[#dbdbdb] h-[10px] rounded-full overflow-hidden">
                    <div className="w-full bg-[#00bda5] h-full"></div>
                  </div>
                </div>
              </div>
              <h3 className="text-[#333] text-[32px] font-bold">Performance</h3>
              <div className="text-[#33475b] text-[16px] font-normal text-center leading-6 relative m-auto w-4/5 max-w-[690px] space-x-0">
                Optimizing your website's performance is crucial to increasing
                traffic, improving conversion rates, generating more leads, and
                increasing revenue.
              </div>
              <div className="flex justify-center">
                <div className="border border-[#dfe3eb] rounded-[40px] bg-white my-[10px] px-5 py-[12px] flex items-center justify-center w-[460px]">
                  {/* Trophy Icon */}
                  <div className="bg-[url('/images/icon-trophy.png')] bg-center bg-no-repeat bg-[length:24px_21px] w-6 h-6 mr-3"></div>

                  {/* Text */}
                  <div className="text-[#516f90] text-xs leading-3 font-light flex">
                    Improve your website performance with&nbsp;
                    <span className="text-[#0073aa] font-bold">
                      free 15-minute lesson
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
