"use client";
import { motion, useInView } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useRef, useEffect, useState } from "react";

export default function ProductSection() {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-600px" });
  const [hasAnimated, setHasAnimated] = useState(false);

  const fetchProducts = async (pageNumber = 1) => {
    setLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/products?page=${pageNumber}`
      );
      const data = await res.json();
      if (data.success) {
        setProducts((prev) => [...prev, ...data.products]);
        setHasMore(data.hasMore);
      }
    } catch (err) {
      console.error("❌ Failed to fetch products:", err);
    } finally {
      setLoading(false);
    }
  };

  // 📦 Initial load
  useEffect(() => {
    fetchProducts(page);
  }, [page]);

  // 🔁 Infinite scroll
  useEffect(() => {
    const onScroll = () => {
      if (
        window.innerHeight + window.scrollY >=
          document.body.offsetHeight - 400 &&
        hasMore &&
        !loading
      ) {
        setPage((prev) => prev + 1);
      }
    };

    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, [hasMore, loading]);

  useEffect(() => {
    if (isInView) {
      setHasAnimated(true);
    }
  }, [isInView]);

  // Truncate title to fit max two lines (approx 40 characters)
  const truncateTitle = (title) => {
    if (title.length > 40) {
      return title.slice(0, 37) + "...";
    }
    return title;
  };

  // Animation variants for cards
  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.15, duration: 0.6, ease: "easeOut" },
    }),
  };

  return (
    <section
      ref={sectionRef}
      className="w-full px-4 py-16 sm:py-20 md:py-24 bg-gradient-to-br from-indigo-50 via-white to-purple-50 text-center relative overflow-hidden"
    >
      {/* Subtle animated gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-indigo-100/20 via-transparent to-purple-100/20 animate-gradient-x"></div>

      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-800 mb-12 text-center tracking-tight font-sans">
          🔍 Explore Top QC Drops
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product, index) => (
            <motion.div
              key={index}
              variants={cardVariants}
              initial="hidden"
              animate={hasAnimated ? "visible" : "hidden"}
              custom={index}
              className="relative bg-white/20 backdrop-blur-xl border border-white/50 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer overflow-hidden group flex flex-col"
            >
              {/* Gradient border on hover */}
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 opacity-0 group-hover:opacity-30 transition-opacity duration-400 rounded-3xl"></div>

              {/* Header */}
              <div className="flex items-center justify-between px-4 pt-4 z-10">
                <p className="text-sm font-medium text-gray-700 truncate max-w-[70%]">
                  {product.seller}
                </p>
                <Image
                  src={
                    product.originalProductUrl.includes("https://weidian.com")
                      ? "/assets/weidian-logo.png"
                      : "/assets/taobao-logo.svg"
                  }
                  alt="Source logo"
                  width={50}
                  height={20}
                  className="h-5 w-auto object-contain"
                />
              </div>

              {/* Image */}
              <div className="aspect-square mt-2 relative overflow-hidden">
                <Image
                  src={
                    product.images[0]?.startsWith("//")
                      ? "https:" + product.images[0]
                      : product.images[0]
                  }
                  alt={product.title}
                  fill
                  sizes="100vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                  onClick={() =>
                    router.push(
                      product.seller === "Weidian"
                        ? `/details/WD/${product.productId}`
                        : `/details/TB/${product.productId}`
                    )
                  }
                />
              </div>

              {/* Info */}
              <div className="p-4 space-y-2 z-10 flex flex-col flex-grow">
                <p
                  className="text-sm font-semibold text-gray-900 min-h-[2.5rem] leading-tight text-left"
                  style={{
                    WebkitLineClamp: 2,
                    lineClamp: 2,
                    display: "-webkit-box",
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                  }}
                >
                  {truncateTitle(product.title)}
                </p>
                <p className="text-indigo-600 font-bold text-base text-left">
                  {product.priceUSD}
                  <span className="text-gray-400 font-medium">
                    {" "}
                    | {product.priceCNY}
                  </span>
                </p>
                <div className="flex justify-between text-sm text-gray-500 font-medium">
                  {/* <p>
                    <span className="text-indigo-600">{0}</span> QC Video
                  </p> */}
                  <p>
                    <span className="text-indigo-600">
                      {product.qcImages.length}
                    </span>{" "}
                    QC Pics
                  </p>
                </div>
                <button
                  className="w-full mt-auto bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-2 rounded-full font-semibold text-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5 relative overflow-hidden group/button cursor-pointer"
                  onClick={() =>
                    router.push(
                      product.seller === "Weidian"
                        ? `/details/WD/${product.productId}`
                        : `/details/TB/${product.productId}`
                    )
                  }
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 opacity-0 group-hover/button:opacity-40 transition-opacity duration-300"></span>
                  <span className="relative">View Details</span>
                </button>
              </div>
            </motion.div>
          ))}

          {/* Loader for pagination */}
          {loading && (
            <div className="fixed bottom-6 left-1/2 -translate-x-1/2">
              <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
