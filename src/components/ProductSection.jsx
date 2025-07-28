"use client";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";

export default function Home({ productData }) {
  const [mainImage, setMainImage] = useState(null);
  const [startIndex, setStartIndex] = useState(0); // Track the starting index of the visible set
  const [isAnimating, setIsAnimating] = useState(false);
  // Control animation state

  useEffect(() => {
    if (productData?.images?.length > 0) {
      setMainImage(productData.images[0]);
    } else {
      setMainImage(null);
    }
  }, [productData]);

  const images =
    (productData?.images || []).filter(
      (img) => typeof img === "string" && img.trim() !== ""
    ) || null;

  const visibleImages = Array.from({ length: 7 }, (_, i) => {
    const index = startIndex + i;
    return index < images.length ? index : images.length - 1; // Ensure no out-of-bounds
  }).filter((v, i, self) => self.indexOf(v) === i); // Remove duplicates

  const handleHover = (index) => {
    const currentPosition = visibleImages.indexOf(index);
    if (currentPosition === 6 && index < images.length - 1) {
      // Move to next set
      setIsAnimating(true);
      setTimeout(() => {
        setStartIndex((prev) => Math.min(prev + 1, images.length - 7));
        setIsAnimating(false);
      }, 300); // Match animation duration
    } else if (currentPosition === 6 && index >= visibleImages[5]) {
      // Move to previous set when hovering the most right
      setIsAnimating(true);
      setTimeout(() => {
        setStartIndex((prev) => Math.max(prev - 1, 0));
        setIsAnimating(false);
      }, 300); // Match animation duration
    } else if (currentPosition === 0 && index > 0) {
      // Move to previous set
      setIsAnimating(true);
      setTimeout(() => {
        setStartIndex((prev) => Math.max(prev - 1, 0));
        setIsAnimating(false);
      }, 300); // Match animation duration
    }
    setMainImage(images[index]);
  };

  const containerRef = useRef(null);

  return (
    <div className="flex flex-col md:flex-row min-h-screen p-6">
      <div className="w-full md:w-1/2 p-6 bg-white shadow-xl rounded-xl transform hover:scale-105 transition duration-300 relative">
        {mainImage ? (
          <Image
            src={mainImage?.startsWith('//') ? 'https:' + mainImage : mainImage}
            alt="High quality pure cotton made pony hoodie"
            width={300}
            height={400}
            className="w-full max-h-[80%] h-auto object-cover rounded-lg mb-12 border-4 border-gray-200"
            style={{ height: "auto" }}
          />
        ) : null}
        <div
          ref={containerRef}
          className="flex space-x-3 overflow-hidden absolute bottom-6 w-full"
        >
          {images && images.length > 1
            ? visibleImages.map((index) => (
                <Image
                  key={`image-${index}`}
                  src={images[index]?.startsWith('//') ? 'https:' + images[index] : images[index]}
                  alt={`Hoodie variant ${index + 1}`}
                  width={80}
                  height={100}
                  className={`w-20 h-24 object-cover rounded-md hover:shadow-lg transition-transform duration-300 ease-in-out ${
                    index === visibleImages[6] ? "w-10 opacity-50" : ""
                  } ${
                    isAnimating
                      ? startIndex > visibleImages[0]
                        ? "translate-x-[-80px]"
                        : "translate-x-[80px]"
                      : ""
                  }`}
                  onMouseOver={() => handleHover(index)}
                  style={{ flexShrink: 0 }}
                />
              ))
            : null}
        </div>
      </div>

      <div className="w-full md:w-1/2 p-6 bg-white shadow-xl rounded-xl mt-6 md:mt-0 md:ml-6">
        <div className="flex items-center gap-3 mb-4">
          <Image
            src={
              productData?.seller == "Weidian"
                ? "/assets/weidian-logo.png"
                : "/assets/taobao-logo.svg"
            }
            alt="Source logo"
            width={50}
            height={20}
            className="h-6 w-auto object-contain"
          />
          {productData?.originalProductUrl && (
            <Link
              href={productData?.originalProductUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 font-medium underline"
            >
              {productData?.originalProductUrl}
            </Link>
          )}
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mt-2 mb-4">
          {productData?.title}
        </h1>
        <div className="text-4xl font-bold text-red-600 mb-4">
          ${productData?.priceUSD}{" "}
          <span className="text-gray-500 text-xl">
            ¥{productData?.priceCNY}
          </span>
        </div>
        {/* <div className="bg-gray-50 p-4 rounded-lg">
          <p className="text-gray-700 text-lg">
            Premium cotton blend for ultimate comfort.
          </p>
          <p className="text-gray-600 mt-2">
            Available in multiple colors and sizes.
          </p>
        </div> */}
        <div className="mt-6 flex space-x-4">
          <button className="bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition duration-200 shadow-md">
            Buy Now
          </button>
          <button className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition duration-200 shadow-md">
            Join Community
          </button>
        </div>
      </div>
    </div>
  );
}
