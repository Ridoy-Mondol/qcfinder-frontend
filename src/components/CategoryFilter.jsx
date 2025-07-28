"use client";
import { useState } from "react";

const categories = [
  "All",
  "Sneakers",
  "Apparel",
  "Accessories",
  "Luxury",
  "Others",
];

export default function CategoryFilter({ selected, onChange }) {
  const [active, setActive] = useState(selected || "All");

  const handleSelect = (category) => {
    setActive(category);
    onChange(category);
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-4 flex flex-wrap gap-3 justify-center">
      {categories.map((cat) => (
        <button
          key={cat}
          onClick={() => handleSelect(cat)}
          className={`px-4 py-2 text-sm rounded-full transition-all font-medium ${
            active === cat
              ? "bg-blue-600 text-white shadow-md"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          {cat}
        </button>
      ))}
    </div>
  );
}
