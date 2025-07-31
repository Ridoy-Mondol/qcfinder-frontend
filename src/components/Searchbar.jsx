"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SearchBar() {
  const [input, setInput] = useState("");
  const [typedText, setTypedText] = useState("");
  const mainTitle = "Discover Hidden Gems.";

  const router = useRouter();

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      if (index < mainTitle.length) {
        setTypedText(mainTitle.slice(0, index + 1));
        index++;
      } else {
        clearInterval(interval);
      }
    }, 100);
    return () => clearInterval(interval);
  }, []);

  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const url = input.trim();
    const weidianMatch = url.match(/weidian\.com\/item\.html\?itemID=(\d+)/i);
    const taobaoMatch = url.match(/taobao\.com\/item\.htm\?id=(\d+)/i);

    if (weidianMatch) {
      const productId = weidianMatch[1];
      router.push(`/details/WD/${productId}`);
    } else if (taobaoMatch) {
      const productId = taobaoMatch[1];
      router.push(`/details/TB/${productId}`);
    } else {
      alert("❌ Please paste a valid Weidian or Taobao product URL.");
    }
  };

  return (
    <section className="w-full px-4 py-14 sm:py-20 md:py-24 bg-gradient-to-br from-indigo-50 via-white to-purple-50 text-center relative overflow-hidden">
      {/* Subtle animated gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-indigo-100/20 via-transparent to-purple-100/20 animate-gradient-x"></div>

      {/* Title + Subtitle */}
      <h1 className="relative text-4xl sm:text-5xl md:text-6xl font-extrabold text-gray-900 leading-tight tracking-tight">
        <div>{typedText}</div>
        <div className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
          QC Smarter. Shop Better.
        </div>
      </h1>
      <p className="relative mt-4 text-gray-600 max-w-xl mx-auto text-base sm:text-lg md:text-xl font-medium">
        Explore the largest collection of QC images from agent sites — powered
        by real shoppers.
      </p>

      {/* Search Form */}
      <form
        onSubmit={handleSubmit}
        className="relative mt-10 flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto px-2 sm:px-0"
      >
        <div className="relative flex-grow">
          <input
            type="url"
            value={input}
            onChange={handleInputChange}
            placeholder="Paste your Taobao or Weidian product link..."
            className="w-full py-4 pl-12 pr-4 text-gray-800 bg-white border border-gray-200 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 placeholder-gray-400 text-base sm:text-lg"
          />
          <svg
            className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 transition-transform duration-300 ease-in-out"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            ></path>
          </svg>
        </div>
        <button
          type="submit"
          className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-4 rounded-full font-semibold text-base sm:text-lg shadow-md hover:shadow-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 transform hover:-translate-y-0.5 cursor-pointer"
        >
          <span className="flex items-center gap-2">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              ></path>
            </svg>
            Search
          </span>
        </button>
      </form>
    </section>
  );
}
