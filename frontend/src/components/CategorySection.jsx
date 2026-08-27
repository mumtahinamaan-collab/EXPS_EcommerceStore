import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function CategorySection() {
  const [categories, setCategories] = useState([]);
  const categoryScrollRef = useRef(null);

  useEffect(() => {
    axios
      .get("https://exps-ecommercestore.onrender.com/api/categories/")
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
    <div className="relative">
      <button
        onClick={() => scrollCategories("left")}
        className="absolute left-1 top-1/2 z-10 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-white text-xl shadow-md"
      >
        ‹
      </button>

      {/* Categories */}

      <div
        ref={categoryScrollRef}
        className="flex gap-4 overflow-x-auto scroll-smooth px-10"
      >
        {categories.map((category) => (
          <Link
            key={category.id}
            to={`/products/${category.slug}`}
            className="group min-w-[80px] shrink-0 text-center sm:min-w-[100px]"
          >
            {/* Image Circle */}

            <div className="w-24 h-24 mx-auto rounded-full bg-gray-100 flex items-center justify-center overflow-hidden transition-all duration-300 group-hover:shadow-md group-hover:scale-105">
              <img
                src={category.image}
                alt={category.name}
                className="w-full h-full object-contain"
              />
            </div>

            {/* Category Name */}

            <p className="mt-3 text-sm font-medium text-gray-800 group-hover:text-red-500 transition-colors">
              {category.name}
            </p>
          </Link>
        ))}
      </div>
      <button
        onClick={() => scrollCategories("right")}
        className="absolute right-1 top-1/2 z-10 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-white text-xl shadow-md"
      >
        ›
      </button>
    </div>
  );
}

export default CategorySection;
