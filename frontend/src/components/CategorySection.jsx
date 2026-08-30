import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import API_BASE_URL from "../config/api";

function CategorySection() {
  const [categories, setCategories] = useState([]);
  const categoryScrollRef = useRef(null);

  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/categories/`)
      .then((response) => {
        setCategories(response.data);
      })
      .catch((error) => {
        console.error("Category API Error:", error);
      });
  }, []);

  const scrollCategories = (direction) => {
    if (categoryScrollRef.current) {
      categoryScrollRef.current.scrollBy({
        left: direction === "left" ? -300 : 300,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="relative w-full">
      {/* LEFT ARROW - MOBILE/TABLET ONLY */}
      <button
        onClick={() => scrollCategories("left")}
        className="absolute left-1 top-1/2 z-10 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-white text-xl shadow-md lg:hidden"
      >
        ‹
      </button>

      {/* CATEGORIES */}
      <div
        ref={categoryScrollRef}
        className="flex gap-4 overflow-x-auto scroll-smooth px-10 scrollbar-hide lg:grid lg:grid-cols-7 lg:gap-6 lg:overflow-x-visible lg:px-0"
      >
        {categories.slice(0, 7).map((category) => (
          <Link
            key={category.id}
            to={`/products/${category.slug}`}
            className="group min-w-[80px] shrink-0 text-center sm:min-w-[100px] lg:min-w-0"
          >
            {/* IMAGE */}
            <div className="mx-auto flex h-20 w-20 items-center justify-center overflow-hidden rounded-full bg-gray-100 transition-all duration-300 group-hover:scale-105 group-hover:shadow-md sm:h-24 sm:w-24">
              <img
                src={category.image}
                alt={category.name}
                className="h-full w-full object-contain"
              />
            </div>

            {/* CATEGORY NAME */}
            <p className="mt-3 truncate text-sm font-medium text-gray-800 transition-colors group-hover:text-red-500">
              {category.name}
            </p>
          </Link>
        ))}
      </div>

      {/* RIGHT ARROW - MOBILE/TABLET ONLY */}
      <button
        onClick={() => scrollCategories("right")}
        className="absolute right-1 top-1/2 z-10 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-white text-xl shadow-md lg:hidden"
      >
        ›
      </button>
    </div>
  );
}

export default CategorySection;