"use client";

// import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

export default function ErrorPage() {
//   const searchParams = useSearchParams();
//   const errorMessage =
//     searchParams.get("message") || "An unknown error occurred";
//   const router = useRouter();

  return (
    <div className="relative min-h-screen bg-[#2D3E50] font-sans overflow-hidden">
      {/* Background Images */}
      <div className="hidden md:block absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('/images/blobsLeft.webp')] bg-left-top bg-no-repeat bg-contain md:bg-auto opacity-100"></div>
        <div className="absolute bottom-0 right-0 w-full h-full bg-[url('/images/blobsRight.webp')] bg-right-bottom bg-no-repeat bg-contain md:bg-auto opacity-100"></div>
      </div>

      {/* Main Content */}
      <main className="relative z-20 flex flex-col items-center justify-center h-[92vh] text-white">
        <Image src="/images/file1.webp" height={150} width={150} alt="Website grader logo" />
        <h1 className="text-4xl font-bold justify-center pb-10 pt-2">
          Website grader
        </h1>
        <p className="text-2xl mb-2 text-red-400">Error!!! Failed to fetch URL</p>
        <p className="text-md mb-2">Check your URL or Try it after sometime...</p>
        <Link
          href="/"
          className="block bg-orange-500 text-white px-5 py-2 rounded-sm font-normal w-40 transition-all duration-300 text-center"
        >
          Go Back
        </Link>
      </main>

      {/* Footer */}
      <footer className="relative z-20 text-center text-white text-sm">
        <div className="flex justify-center items-center gap-2 mb-1">
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
  );
}