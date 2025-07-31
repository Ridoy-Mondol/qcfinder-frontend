"use client";
import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import Navbar from "../../../../components/Navbar";
import ProductSection from "../../../../components/ProductSection";
import QCSection from "../../../../components/QCSection";

export default function Page() {
  const [productUrl, setProductUrl] = useState(null);
  const [productData, setProductData] = useState(null);
  const [countdown, setCountdown] = useState(30);
  const [isLoading, setIsLoading] = useState(true);

  const router = useRouter();
  const params = useParams();
  const { platform, id } = params;

  const calledRef = useRef(false);

  useEffect(() => {
    if (!platform || !id) return;

    if (platform === "WD") {
      setProductUrl(`https://weidian.com/item.html?itemID=${id}`);
    } else if (platform === "TB") {
      setProductUrl(`https://item.taobao.com/item.htm?id=${id}`);
    }
  }, [platform, id]);

  // Countdown effect
  useEffect(() => {
    let timer;
    if (isLoading && countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    }

    return () => clearInterval(timer);
  }, [isLoading, countdown]);

  // API call
  useEffect(() => {
    if (!productUrl || calledRef.current) return;

    calledRef.current = true;

    const fetchData = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/scrape`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ url: productUrl }),
        });

        const json = await res.json();

        if (json.success) {
          setProductData(json.data);
          setIsLoading(false);
        } else {
          console.error("Scraper failed:", json.message || "Unknown error");
        }
      } catch (err) {
        console.error("Error calling API:", err);
        router.push("/");
      }
    };

    fetchData();
  }, [productUrl]);

  const initialCountdown = 30;

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white relative overflow-hidden">
        <div className="relative flex flex-col items-center space-y-12 p-12 rounded-3xl bg-white/95 backdrop-blur-2xl shadow-2xl border border-gray-100">
          {/* Orbiting Particle Loader with Glow */}
          <div className="relative w-32 h-32">
            <div className="absolute inset-0 w-32 h-32 border-4 border-t-indigo-600 border-gray-200 rounded-full spin-slow"></div>
            <div className="absolute inset-4 w-24 h-24 border-4 border-r-purple-600 border-gray-200 rounded-full spin-reverse"></div>
            <div className="absolute inset-0 w-8 h-8 bg-indigo-600 rounded-full orbit top-0 left-12"></div>
            <div className="absolute inset-0 w-6 h-6 bg-purple-600 rounded-full orbit delay-300 top-12 left-0"></div>
            <div className="absolute inset-0 w-32 h-32 rounded-full bg-indigo-400/20 pulse-glow"></div>
          </div>

          {/* Countdown */}
          <div className="text-8xl sm:text-9xl font-black text-indigo-700 animate-scale-pulse">
            ⏳ {countdown}s
          </div>

          <p className="text-3xl sm:text-4xl text-indigo-800 font-semibold tracking-wide animate-fade-in">
            Preparing your products... Just a moment!
          </p>

          {/* Progress Bar with Gradient */}
          <div className="w-[28rem] h-5 bg-gray-100 rounded-full overflow-hidden shadow-inner border border-gray-200">
            <div
              className="h-full bg-gradient-to-r from-indigo-600 to-purple-600 transition-all duration-1000 ease-linear"
              style={{
                width: `${
                  ((initialCountdown - countdown) / initialCountdown) * 100
                }%`,
              }}
            ></div>
          </div>
        </div>

        {/* Floating Particles */}
        <div className="absolute top-8 left-8 w-5 h-5 bg-indigo-300 rounded-full particle-1"></div>
        <div className="absolute bottom-8 right-8 w-7 h-7 bg-purple-300 rounded-full particle-2"></div>
        <div className="absolute top-28 right-28 w-4 h-4 bg-indigo-200 rounded-full particle-3"></div>
        <div className="absolute bottom-28 left-28 w-6 h-6 bg-purple-200 rounded-full particle-4"></div>

        {/* Custom Animations */}
        <style jsx>{`
          /* Spin */
          .spin-slow {
            animation: spin 6s linear infinite;
          }
          .spin-reverse {
            animation: spin-reverse 8s linear infinite;
          }
          @keyframes spin {
            0% {
              transform: rotate(0deg);
            }
            100% {
              transform: rotate(360deg);
            }
          }
          @keyframes spin-reverse {
            0% {
              transform: rotate(0deg);
            }
            100% {
              transform: rotate(-360deg);
            }
          }

          /* Orbit */
          .orbit {
            transform-origin: center;
            animation: orbit 4s linear infinite;
          }
          @keyframes orbit {
            0% {
              transform: rotate(0deg) translateX(3rem) rotate(0deg);
            }
            100% {
              transform: rotate(360deg) translateX(3rem) rotate(-360deg);
            }
          }

          /* Glow Pulse */
          .pulse-glow {
            animation: pulse-glow 2s ease-in-out infinite;
          }
          @keyframes pulse-glow {
            0%,
            100% {
              opacity: 0.5;
              transform: scale(0.95);
            }
            50% {
              opacity: 1;
              transform: scale(1.05);
            }
          }

          /* Floating Particles */
          .particle-1 {
            animation: float 4s ease-in-out infinite;
          }
          .particle-2 {
            animation: float 6s ease-in-out infinite reverse;
          }
          .particle-3 {
            animation: float 5s ease-in-out infinite;
          }
          .particle-4 {
            animation: float 7s ease-in-out infinite reverse;
          }
          @keyframes float {
            0%,
            100% {
              transform: translateY(0);
            }
            50% {
              transform: translateY(-10px);
            }
          }
        `}</style>
      </div>
    );
  }

  if (
    !productData ||
    !productData.images ||
    productData.images.length === 0 ||
    !productData.title
  ) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white p-6">
        <h2 className="text-3xl font-bold text-indigo-700 mb-6">
          No Product Found
        </h2>
        <p className="mb-8 text-gray-600 text-center max-w-md">
          Sorry, we couldn't find the product you were looking for. Please try
          again or return home.
        </p>
        <button
          onClick={() => router.push("/")}
          className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-3 rounded-lg shadow-lg hover:from-indigo-700 hover:to-purple-700 transition"
        >
          Back to Home
        </button>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-gray-100 to-white">
      <Navbar />
      <ProductSection productData={productData} />
      <QCSection productData={productData} />
    </div>
  );
}
