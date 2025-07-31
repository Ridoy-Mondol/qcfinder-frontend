"use client";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";

export default function Home({ productData }) {
  const [mainImage, setMainImage] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const carouselRef = useRef(null);
  const router = useRouter();

  const images =
    (productData?.images || []).filter(
      (img) => typeof img === "string" && img.trim() !== ""
    ) || [];

  useEffect(() => {
    if (images?.length > 0) {
      setMainImage(images[0]);
    } else {
      setMainImage(null);
    }
  }, [productData]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024); // Mobile and tablet breakpoint
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleInteraction = (index) => {
    if (!images[index]) return;
    setMainImage(images[index]);
    setActiveIndex(index);

    const visibleCount = isMobile ? 3 : 6;
    if (carouselRef.current) {
      const currentSlide = carouselRef.current.state.currentSlide;
      const isLastInView = index === currentSlide + visibleCount - 1;
      const isFirstInView = index === currentSlide;

      if (isLastInView && index < images.length - 1) {
        carouselRef.current.next();
      } else if (isFirstInView && index > 0) {
        carouselRef.current.previous();
      }
    }
  };

  const responsive = {
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 6,
      slidesToSlide: 1,
    },
    tablet: {
      breakpoint: { max: 1024, min: 640 },
      items: 4,
      slidesToSlide: 1,
    },
    mobile: {
      breakpoint: { max: 640, min: 0 },
      items: 3,
      slidesToSlide: 1,
    },
  };

  return (
    <div className="flex flex-col min-h-screen p-4 mt-[7.75rem] sm:mt-[4rem] sm:p-6 md:p-7 lg:flex-row">
      <div className="w-full h-[400px] sm:h-[500px] md:h-[600px] lg:h-[700px] lg:w-1/2 p-4 sm:p-6 md:p-7 bg-white shadow-xl rounded-xl flex flex-col justify-between gap-0">
        <div className="w-full flex-1 flex justify-center overflow-hidden">
          {mainImage && (
            <Image
              src={mainImage.startsWith("//") ? "https:" + mainImage : mainImage}
              alt="Main"
              width={300}
              height={0}
              className="w-full h-auto max-h-full object-contain rounded-lg mb-4 sm:mb-8 md:mb-12 border-4 border-gray-200"
            />
          )}
        </div>

        <div>
          <Carousel
            ref={carouselRef}
            responsive={responsive}
            arrows={true}
            infinite={false}
            draggable={true}
            swipeable={true}
            keyBoardControl={true}
            shouldResetAutoplay
            customTransition="transform 0.4s ease"
            transitionDuration={400}
            containerClass="carousel-container"
            itemClass="px-1"
          >
            {images.map((img, idx) => (
              <div
                key={idx}
                onClick={isMobile ? () => handleInteraction(idx) : undefined}
                onMouseOver={!isMobile ? () => handleInteraction(idx) : undefined}
                className={`cursor-pointer p-[2px] rounded-md transition-all duration-200 ${
                  activeIndex === idx
                    ? "bg-gradient-to-r from-indigo-600 to-purple-600"
                    : "bg-transparent"
                }`}
              >
                <Image
                  src={img.startsWith("//") ? "https:" + img : img}
                  alt={`Thumbnail ${idx}`}
                  width={100}
                  height={100}
                  className="w-full h-[80px] sm:h-[100px] object-cover rounded-md border hover:shadow-lg"
                />
              </div>
            ))}
          </Carousel>
        </div>
      </div>

      <div className="w-full lg:w-1/2 p-4 sm:p-6 bg-white shadow-xl rounded-xl mt-4 sm:mt-6 lg:mt-0 lg:ml-6">
        <div className="flex items-center gap-3 mb-4">
          <Image
            src={
              productData?.seller === "Weidian"
                ? "/assets/weidian-logo.png"
                : "/assets/taobao-logo.svg"
            }
            alt="Source logo"
            width={50}
            height={20}
            className="h-5 w-auto object-contain sm:h-6"
          />
          {productData?.originalProductUrl && (
            <Link
              href={productData.originalProductUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 font-medium underline text-sm sm:text-base"
            >
              {productData.originalProductUrl}
            </Link>
          )}
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mt-2 mb-4">
          {productData?.title}
        </h1>

        <div className="text-3xl sm:text-4xl font-bold text-red-600 mb-4">
          ${productData?.priceUSD}
          <span className="text-gray-500 text-lg sm:text-xl ml-2">
            ¥{productData?.priceCNY}
          </span>
        </div>

        <div className="mt-4 sm:mt-6 flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
          <button
            className="bg-orange-500 text-white px-4 py-2 sm:px-6 sm:py-3 rounded-lg hover:bg-orange-600 transition duration-200 shadow-md cursor-pointer text-sm sm:text-base"
            onClick={() => router.push(productData?.originalProductUrl)}
          >
            Buy Now
          </button>
          <button className="bg-green-500 text-white px-4 py-2 sm:px-6 sm:py-3 rounded-lg hover:bg-green-600 transition duration-200 shadow-md cursor-pointer text-sm sm:text-base">
            Join Community
          </button>
        </div>
      </div>
    </div>
  );
}