import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import API_BASE_URL from "../config/api";
import Loader from "./Loader";

function CategorySection() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const categoryScrollRef = useRef(null);

  useEffect(() => {
    setLoading(true);

    axios
      .get(`${API_BASE_URL}/categories/`)
      .then((response) => {
        setCategories(response.data);
      })
      .catch((error) => {
        console.error("Category API Error:", error);
      })
      .finally(() => {
        setLoading(false);
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

  // LOADER
  if (loading) {
    return (
      <div className="w-full py-10">
        <Loader text="Loading categories..." />
      </div>
    );
  }

  return (
    <div className="relative w-full">

      {/* LEFT ARROW */}
      <button
        type="button"
        onClick={() => scrollCategories("left")}
        className="
          absolute
          left-1
          top-1/2
          z-10
          flex
          h-9
          w-9
          -translate-y-1/2
          items-center
          justify-center
          rounded-full
          bg-white
          text-2xl
          text-gray-700
          shadow-md
          transition
          hover:bg-gray-100
        "
      >
        ‹
      </button>

      {/* CATEGORIES SCROLLER */}
      <div
        ref={categoryScrollRef}
        className="
          flex
          w-full
          flex-nowrap
          gap-1
          overflow-x-auto
          overflow-y-hidden
          scroll-smooth
          px-4
          scrollbar-hide
          no-scrollbar
        "
      >
        {categories.map((category) => (
          <Link
            key={category.id}
            to={`/products/${category.slug}`}
            className="
              group
              w-[150px]
              min-w-[150px]
              shrink-0
              text-center
            "
          >
            {/* CATEGORY IMAGE */}
            <div
              className="
                mx-auto
                flex
                h-20
                w-20
                items-center
                justify-center
                overflow-hidden
                rounded-full
                bg-gray-100
                transition-all
                duration-300
                group-hover:scale-105
                group-hover:shadow-md
                sm:h-24
                sm:w-24
              "
            >
              <img
                src={category.image}
                alt={category.name}
                className="h-full w-full object-contain"
                onError={(e) => {
                  console.error(
                    "Image failed:",
                    category.image
                  );
                }}
              />
            </div>

            {/* CATEGORY NAME */}
            <p
              className="
                mt-3
                truncate
                text-sm
                font-medium
                text-gray-800
                transition-colors
                group-hover:text-red-500
              "
            >
              {category.name}
            </p>
          </Link>
        ))}
      </div>

      {/* RIGHT ARROW */}
      <button
        type="button"
        onClick={() => scrollCategories("right")}
        className="
          absolute
          right-1
          top-1/2
          z-10
          flex
          h-9
          w-9
          -translate-y-1/2
          items-center
          justify-center
          rounded-full
          bg-white
          text-2xl
          text-gray-700
          shadow-md
          transition
          hover:bg-gray-100
        "
      >
        ›
      </button>

    </div>
  );
}

export default CategorySection;