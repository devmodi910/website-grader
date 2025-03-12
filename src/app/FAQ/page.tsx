"use client";
import Link from "next/link";
import React, { useState } from "react";
import Button from "../../../components/Button";

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqData = [
    {
      question: "What does Website Grader do?",
      answer: (
        <>
          <p>
            Website Grader analyzes your website to discover what it does well
            and flags areas where it could improve to benefit more from search
            traffic. It analyzes your site for:
          </p>
          <ul className="list-disc list-inside mt-2">
            <li>Site performance</li>
            <li>Search Engine Optimization</li>
            <li>Mobile Friendliness</li>
            <li>Security</li>
          </ul>
        </>
      ),
    },

    {
      question: "How does Website Grader work?",
      answer:
        "It runs various tests using Google Lighthouse and other tools to assess your website’s strengths and weaknesses.",
    },
    {
      question: "Is Website Grader a free SEO Checker?",
      answer:
        "Yes! You can use it as many times you’d like, for as many sites you’d like, with absolutely no fee. HubSpot created it to help online businesses grow better - for free.",
    },
    {
      question: "How can I check if a website is safe?",
      answer:
        "We offer a “Security” audit as part of Website Grader. It will tell you if the protocol the site uses is safe and if its libraries are secure.",
    },
    {
      question: "What should I do once I have my results?",
      answer:
        "Once you get your results, it is time to implement the recommendations. Some changes will require no coding knowledge. Others may require working with a web developer or designer.Still don't know where to start? Try our Academy courses on Improving Website Performance and Enhancing SEO for a website",
    },
  ];

  return (
    <div
      id="website"
      className="flex flex-col h-screen bg-[#2D3E50] text-white font-sans"
    >
      {/* Background Images */}
      <div className="hidden md:block absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('/images/blobsLeft.webp')] bg-left-top bg-no-repeat bg-contain md:bg-auto"></div>
        <div className="absolute bottom-0 right-0 w-full h-full bg-[url('/images/blobsRight.webp')] bg-right-bottom bg-no-repeat bg-contain md:bg-auto"></div>
      </div>

      {/* Header */}
      <header className="p-4 flex justify-end items-center bg-[#2D3E50]">
        <div className="flex gap-2">
          <Button />
          <Link
            href="/FAQ"
            className="border border-white px-4 py-2 rounded-full hover:bg-slate-700 transition-all transform hover:scale-105"
          >
            FAQ
          </Link>
        </div>
      </header>

      {/* Main Content (Centers Everything) */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 relative">
        {/* FAQ Container */}
        <div className="relative w-full max-w-xl">
          {/* Back Button */}
          <div className="relative flex justify-start top-6">
            <span className="text-orange-400 cursor-pointer hover:underline">
              &lt; Back
            </span>
          </div>

          {/* FAQ Title */}
          <h1 className="text-4xl font-bold text-center">
            FAQ
            <div className="w-16 h-1 bg-orange-400 mx-auto mt-2"></div>
          </h1>

          {/* FAQ Items */}
          <div className="mt-6">
            {faqData.map((item, index) => (
              <div key={index} className="border-t border-gray-400 py-4">
                <button
                  className="flex justify-between items-center w-full text-left text-[18px] font-medium"
                  onClick={() =>
                    setOpenIndex(openIndex === index ? null : index)
                  }
                >
                  <span>{item.question}</span>
                  <span className="text-gray-300">
                    {openIndex === index ? "▲" : "▼"}
                  </span>
                </button>

                {/* Answer Section - Expands Naturally */}
                {openIndex === index && (
                  <p className="mt-2 text-gray-300 text-sm">{item.answer}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="p-4 text-sm text-center text-gray-400">
        <div className="flex justify-center gap-2 mb-1">
          <a href="#" className="underline hover:no-underline">
            Privacy Policy
          </a>
          <span>|</span>
          <a href="#" className="underline hover:no-underline">
            Legal Stuff
          </a>
        </div>
        <p>Powered by Google Lighthouse</p>
      </footer>
    </div>
  );
}
