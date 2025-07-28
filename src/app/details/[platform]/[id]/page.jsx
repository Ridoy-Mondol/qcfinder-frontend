"use client";
import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
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
        const res = await fetch("http://localhost:4000/api/scrape", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ url: productUrl }),
        });

        const json = await res.json();
        console.log("Scraper response:", json);

        if (json.success) {
          setProductData(json.data);
          setIsLoading(false);
        } else {
          console.error("Scraper failed:", json.message || "Unknown error");
          router.push("/");
        }
      } catch (err) {
        console.error("Error calling API:", err);
        router.push("/");
      }
    };

    fetchData();
  }, [productUrl]);

  if (!productUrl) {
    return (
      <div className="text-center py-20 text-red-500 font-semibold">
        ❌ Invalid platform. Only Taobao or Weidian supported.
      </div>
    );
  }

  if (isLoading && countdown > 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white">
        <div className="relative flex flex-col items-center space-y-12 p-12 rounded-3xl bg-white/95 backdrop-blur-2xl shadow-2xl border border-gray-100">
          {/* Orbiting Particle Loader with Glow */}
          <div className="relative w-32 h-32">
            <div className="absolute inset-0 w-32 h-32 border-4 border-t-emerald-500 border-gray-200 rounded-full animate-spin-slow"></div>
            <div className="absolute inset-4 w-24 h-24 border-4 border-r-gold-400 border-gray-200 rounded-full animate-spin-reverse"></div>
            <div className="absolute inset-0 w-8 h-8 bg-emerald-500 rounded-full animate-orbit top-0 left-12"></div>
            <div className="absolute inset-0 w-6 h-6 bg-gold-400 rounded-full animate-orbit delay-300 top-12 left-0"></div>
            <div className="absolute inset-0 w-32 h-32 rounded-full bg-emerald-300/20 animate-pulse-glow"></div>
          </div>

          {/* Countdown with Green Text and Subtle Scale Animation */}
          <div className="text-8xl sm:text-9xl font-black text-green-900 animate-scale-pulse">
            ⏳ {countdown}s
          </div>

          {/* Professional Message with Fade-in Animation */}
          <p className="text-3xl sm:text-4xl text-green-900 font-semibold tracking-wide animate-fade-in">
            Preparing your products... Just a moment!
          </p>

          {/* Sleek Progress Bar with Animated Gradient */}
          <div className="w-[28rem] h-5 bg-gray-100 rounded-full overflow-hidden shadow-inner border border-gray-200">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 to-gold-400 animate-gradient-flow transition-all duration-1000 ease-out"
              style={{ width: `${(countdown / 10) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Subtle Floating Particles */}
        <div className="absolute top-8 left-8 w-5 h-5 bg-emerald-300 rounded-full animate-particle-1"></div>
        <div className="absolute bottom-8 right-8 w-7 h-7 bg-gold-300 rounded-full animate-particle-2"></div>
        <div className="absolute top-28 right-28 w-4 h-4 bg-emerald-200 rounded-full animate-particle-3"></div>
        <div className="absolute bottom-28 left-28 w-6 h-6 bg-gold-200 rounded-full animate-particle-4"></div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-gray-100 to-white">
      <ProductSection productData={productData} />
      <QCSection productData={productData} />
    </div>
  );
}
