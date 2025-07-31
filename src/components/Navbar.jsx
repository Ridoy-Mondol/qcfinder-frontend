import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const [input, setInput] = useState('');
  const router = useRouter();

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
      alert('❌ Please paste a valid Weidian or Taobao product URL.');
    }
  };

  return (
    <nav className="bg-white shadow-md fixed top-0 left-0 right-0 z-50">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-3 sm:py-4">
          {/* Logo */}
          <div className="flex-shrink-0 mb-2 sm:mb-0">
            <Link
              href="/"
              className="text-lg sm:text-xl lg:text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent"
            >
              QCfinder
            </Link>
          </div>

          {/* Search Bar */}
          <form
            onSubmit={handleSubmit}
            className="flex flex-col sm:flex-row items-center gap-2 w-full sm:max-w-md lg:max-w-lg"
          >
            <div className="relative flex-grow w-full">
              <input
                type="url"
                value={input}
                onChange={handleInputChange}
                placeholder="Paste your Taobao or Weidian product link..."
                className="w-full py-1.5 sm:py-2 pl-8 sm:pl-10 pr-3 sm:pr-4 text-gray-800 bg-white border border-gray-200 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 placeholder-gray-400 text-xs sm:text-sm"
              />
              <svg
                className="absolute left-2 sm:left-3 top-1/2 transform -translate-y-1/2 w-3 sm:w-4 h-3 sm:h-4 text-gray-400"
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
              className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-full font-medium text-xs sm:text-sm shadow-md hover:shadow-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 transform hover:-translate-y-0.5 w-full sm:w-auto"
            >
              <span className="flex items-center justify-center gap-1">
                <svg
                  className="w-3 sm:w-4 h-3 sm:h-4"
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
        </div>
      </div>
    </nav>
  );
}