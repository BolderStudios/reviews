"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Buttons/button";
import { useRouter } from "next/navigation";

export default function NotFoundContent() {
  const [previousPath, setPreviousPath] = useState("/");
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const prevPath = sessionStorage.getItem("previousPath") || "/";
      
      setPreviousPath(prevPath);
    }
  }, []);

  const handleGoBack = (e) => {
    e.preventDefault();
    router.back();
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 overflow-hidden">
      <div className="text-center relative">
        <div className="mb-8 animate-float">
          <svg
            className="mx-auto h-24 w-24 text-gray-400"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
            <line x1="11" y1="8" x2="11" y2="14" />
            <line x1="8" y1="11" x2="14" y2="11" />
          </svg>
        </div>
        <h1 className="text-8xl font-bold text-black mb-4 animate-pulse">
          404
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          We couldn't find the page you're looking for.
        </p>
        <div className="space-x-4">
          <Button
            variant="outline"
            onClick={handleGoBack}
            className="px-6 py-2 border border-gray-300 rounded-md text-black hover:bg-gray-100 transition-all hover:scale-105 inline-flex items-center"
          >
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              ></path>
            </svg>
            Go Back
          </Button>
          <Button
            variant="outline"
            asChild
            className="px-6 py-2 border border-gray-300 rounded-md text-black hover:bg-gray-100 transition-all hover:scale-105 inline-flex items-center"
          >
            <Link href={`${process.env.NEXT_PUBLIC_SITE_URL}`}>
              <svg
                className="w-4 h-4 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                ></path>
              </svg>
              Home Page
            </Link>
          </Button>
        </div>
      </div>
      <style jsx>{`
        @keyframes float {
          0% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-10px) rotate(5deg);
          }
          100% {
            transform: translateY(0px) rotate(0deg);
          }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        @keyframes pulse {
          0%,
          100% {
            opacity: 1;
          }
          50% {
            opacity: 0.7;
          }
        }
        .animate-pulse {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      `}</style>
    </div>
  );
}
