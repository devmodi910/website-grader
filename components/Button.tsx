"use client"; // If using Next.js app directory (to enable useState in components)

import { useState } from "react";

export default function Button() {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <div className="relative">
      <button
        className="hidden md:flex items-center border border-white gap-1 text-white px-4 py-2 rounded-full transition-all duration-300"
        onClick={() => setIsOpen(!isOpen)}
      >
        <img src="/images/icon-globe.png" alt="English" className="w-8 h-8"></img>
        English
        <svg
          className={`w-2 h-2.5 ms-1 transition-transform duration-300 ${
            isOpen ? "rotate-180" : "rotate-0"
          }`}
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 10 6"
        >
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="m1 1 4 4 4-4"
          />
        </svg>
      </button>

      {/* Language Dropdown */}
      {isOpen && (
        <div className="absolute mt-2 w-40 bg-white rounded-md shadow-lg z-10 right-0">
          <ul className="py-1">
            {["English", "Español", "Français", "Deutsch"].map((lang) => (
              <li
                key={lang}
                className="px-4 py-2 hover:bg-slate-100 cursor-pointer transition-colors"
                onClick={() => setIsOpen(false)} // Close dropdown on selection
              >
                {lang}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
