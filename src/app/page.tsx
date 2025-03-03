import Image from "next/image";
import Link from "next/link";
import React from "react";
import Button from "../../components/Button";
import Form from "../../components/Form";
export default function Component() {
  return (
    <div id="website">
      {/* Main Container */}
      <div className="relative min-h-screen bg-[#2D3E50] font-sans overflow-hidden">
        {/* Background Images (Visible in md+ screens, hidden in sm) */}
        <div className="hidden md:block absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('/images/blobsLeft.png')] bg-left-top bg-no-repeat bg-contain md:bg-auto opacity-100"></div>
          <div className="absolute bottom-0 right-0 w-full h-full bg-[url('/images/blobsRight.png')] bg-right-bottom bg-no-repeat bg-contain md:bg-auto opacity-100"></div>
        </div>

        {/* Header */}
        <header className="relative flex justify-end items-center p-6">
          <div className="flex gap-2">
            <Button />
            <button className="bg-transparent border border-white text-white px-4 py-3 rounded-full text-center hover:bg-slate-700 transition-all duration-300 transform hover:scale-105 flex flex-row">
              FAQ
            </button>
          </div>
        </header>

        {/* Main Content */}
        <main className="relative flex flex-col items-center justify-center pt-16 pb-16 px-4">
          <div className="text-center mb-12">
            <div className="flex justify-center mb-6">
              <Image
                src="/images/hubspot-tools-logo.png"
                alt="HubSpot Logo"
                width={150}
                height={40}
              />
            </div>
            <h1 className="text-lg max-w-md mx-auto md:text-5xl font-bold text-white mb-2">
              Website Grader<sup className="text-xl md:text-3xl">®</sup>
            </h1>
            <p className="text-white text-xs md:text-base max-w-md mx-auto mb-8">
              Grade your website in seconds. Then learn how to improve it for
              free.
            </p>

            {/* Input Form */}
            <Form />
          </div>
        </main>

        {/* Footer */}
        <footer className="relative text-center text-white text-sm">
          <div className="flex justify-center items-center gap-2 mb-1 underline-offset-auto">
            <Link
              href="#"
              className="underline transition-all duration-300 hover:no-underline"
            >
              Privacy Policy
            </Link>
            <span>|</span>
            <Link
              href="#"
              className="underline transition-all duration-300 hover:no-underline"
            >
              Legal stuff
            </Link>
          </div>
          <p>Powered by Google Lighthouse</p>
        </footer>
      </div>
      <div className="bg-white font-sans relative min-h-screen">
      {/* Main Container */}
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Flex Section */}
        <div className="flex flex-col-reverse md:flex-row items-center justify-between gap-8 mb-16 md:mt-10">
          {/* Text Section */}
          <div className="w-full md:w-[48%] text-center md:text-left">
            <h2 className="text-3xl font-bold text-slate-700 mb-4">
              Get Your Website Rating in Seconds
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              HubSpot's free website grader makes understanding website
              performance easy. The hardest part of building a site is often the
              guesswork. Which changes are important, and which aren't? It can
              sometimes feel impossible to tell. Our{" "}
              <span className="text-teal-600 hover:text-teal-700 transition-colors">
                online grader
              </span>{" "}
              demystifies the whole process.
            </p>
            <p className="text-sm text-slate-600 mt-3">
              Learn about your page performance, security, search engine
              optimization (SEO), and mobile experience. Discover what makes
              your site strong and uncover new opportunities for the future.
            </p>
          </div>

          {/* Image Section */}
          <div className="w-full md:w-[48%] flex justify-center">
            <Image
              className="rounded-lg"
              src="/images/website-performance-rating.png"
              alt="Website Performance Rating"
              width={400}
              height={400}
              priority
            />
          </div>
        </div>

        {/* More Information Section */}
        
      </div>
      <div className="bg-slate-100 py-12">
          <h3 className="text-xl font-semibold text-center text-slate-700 mb-6">
            More Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 px-4 md:px-0">
            {[
              {
                title: "What is a website checker?",
                content:
                  "A website checker is a mini site audit, giving you insight into how your website performs. A good website analyzer should audit your site across a range of criteria so you can get an idea of your overall performance, security, mobile experience, and search engine optimization (SEO). If you’re looking for next steps, read",
              },
              {
                title: "How to optimize a website for SEO?",
                content:
                  "There are some concrete steps you can take to optimize your site for SEO. Making sure your pages are indexed (viewable by search engines) is a great start. In addition, making full use of alt-tags and meta-data is advised. If you want to go further, try making sure you have descriptive link text and appropriate content plugins. And if you’re wondering where to start, getting your site's SEO score is a great first step. It just so happens HubSpot's website grader has a built-in SEO test!",
              },
              {
                title: "Why is website performance important?",
                content:
                  "Performance test matters because it is a key factor in user experience. When users get an immediate response, such as a click, a successful login, or confirmation, they are more likely to stay on the page. This fast response is commonly referred to as website speed. Search engines like Google check website speed and interactivity to make sure searchers only see high-quality sites. So beyond building a better user experience, speed tools help you make your site more attractive to search engines – win-win.",
              },
              {
                title: "Why is website grading important?",
                content:
                  "Test grading is important because it can help you build your site smarter and better while monitoring its health along the way. These site testers help show the impact of the steps you’re taking and areas for new opportunities by checking the pages of your website. It can also help you understand what your competitors are doing, and why they do it. Technical evaluation and general assessment are important in any site build. Doing both makes your site successful in the search results and beyond!",
              },
            ].map((item, index) => (
              <details
                key={index}
                className="group border border-gray-300 rounded-md overflow-hidden bg-slate-100 hover:shadow-md transition-shadow duration-300"
              >
                <summary className="flex bg-slate-100 items-center justify-between p-4 cursor-pointer font-medium text-slate-700">
                  <span>{item.title}</span>
                  <span className="text-teal-600 transition-transform duration-300 group-open:rotate-90">
                    <i className="fa-solid fa-chevron-right"></i>
                  </span>
                </summary>
                <div className="p-4 text-slate-600 text-sm bg-slate-100">
                  {item.content}
                </div>
              </details>
            ))}
          </div>
        </div>
    </div>
    </div>
  );
}
