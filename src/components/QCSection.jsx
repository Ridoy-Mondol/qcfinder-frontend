"use client";
import Image from "next/image";
import { useState } from "react";

export default function QCSection({ productData }) {
  const [selectedImage, setSelectedImage] = useState(null);

  const qcPhotos =
    (productData?.qcImages || []).filter(
      (img) => typeof img === "string" && img.trim() !== ""
    ) || null;

  return (
    <div className="px-6">
      <div className="w-full bg-white p-6 shadow-xl rounded-xl relative">
        <h1 className="text-3xl font-bold text-gray-900 mt-2 mb-4 text-center">
          QC Photos
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {qcPhotos && qcPhotos.length > 0
            ? qcPhotos.map((photo, index) => (
                <div
                  key={index}
                  className="relative bg-white shadow-md rounded-md overflow-hidden cursor-pointer transition-shadow duration-200 hover:shadow-lg"
                  onClick={() => setSelectedImage(photo)}
                >
                  <div className="absolute top-2 left-2 z-10 space-y-2">
                    <div className="bg-white/80 backdrop-blur-sm text-xs text-gray-800 font-semibold py-1 px-2 rounded-full shadow-sm">
                      {productData?.scrapedAt && (
                        <p>
                          Scraped At:{" "}
                          {new Date(productData.scrapedAt).toLocaleString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                              hour: "numeric",
                              minute: "2-digit",
                              hour12: true,
                              timeZoneName: "short",
                            }
                          )}
                        </p>
                      )}
                    </div>
                  </div>
                  <Image
                    src={photo}
                    alt={`QC Photo ${index}`}
                    width={600}
                    height={600}
                    quality={100}
                    className="w-full h-[15rem] object-cover rounded-md"
                  />
                </div>
              ))
            : null}
        </div>
        {selectedImage && (
          <div
            className="fixed inset-0 bg-[rgba(0,0,0,0.4)] flex items-center justify-center z-50 overflow-hidden"
            onClick={() => setSelectedImage(null)}
          >
            <Image
              src={selectedImage}
              alt="Enlarged QC Photo"
              width={1200}
              height={1800}
              sizes="70vw"
              className="max-h-[90vh] h-[90vh] object-contain z-60 transition-opacity duration-300 ease-in-out"
              style={{
                animation: selectedImage
                  ? "fadeIn 0.3s ease-in-out"
                  : "fadeOut 0.3s ease-in-out forwards",
              }}
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        )}
        <style>
          {`
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          @keyframes fadeOut {
            from { opacity: 1; }
            to { opacity: 0; }
          }
        `}
        </style>
      </div>
    </div>
  );
}
