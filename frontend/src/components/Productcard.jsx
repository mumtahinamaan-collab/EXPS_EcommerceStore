
import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart } from "lucide-react";
import React, { useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import API_BASE_URL from "../config/api";
import { authFetch } from "../utils/auth";

export default function ProductCard({ product }) {
  const navigate = useNavigate();

  const [quantity] = useState(1);

  const productUrl = `/products/${product?.category_slug}/${product?.slug}`;

  // =========================
  // ADD TO CART
  // =========================

  const handleAddToCart = async () => {
    const accessToken = localStorage.getItem("accessToken");

    // User login nahi hai
    if (!accessToken) {
      toast.error("Please login first");
      navigate("/login");
      return;
    }

    try {
      const response = await authFetch(`${API_BASE_URL}/cart/add/`, {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          productId: product.id,
          quantity: quantity,
        }),
      });

      let result = {};

      try {
        result = await response.json();
      } catch {
        result = {};
      }

      // =========================
      // SUCCESS
      // =========================

      if (response.ok) {
        toast.success(result.message || "Product added to cart");

        // Navbar cart count update
        window.dispatchEvent(new Event("cartUpdated"));

        return;
      }

      // =========================
      // AUTH FAILED
      // =========================

      if (response.status === 401) {
        toast.error("Your session has expired. Please login again.");
        navigate("/login");
        return;
      }

      // =========================
      // OTHER API ERROR
      // =========================

      toast.error(
        result.message ||
          result.detail ||
          "Unable to add product to cart"
      );
    } catch {
      toast.error("Unable to connect to server");
    }
  };

  return (
    <div className="group w-full rounded-xl bg-white p-3 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg sm:p-4">

      {/* IMAGE */}

      <div className="relative mb-4 flex h-44 w-full items-center justify-center overflow-hidden rounded-lg bg-gray-50 sm:h-48 md:h-52">

        <Link
          to={productUrl}
          className="flex h-full w-full items-center justify-center"
        >
          <img
            src={product?.image_url}
            alt={product?.name || "Product"}
            loading="lazy"
            className="h-full w-full object-contain p-3 transition-transform duration-500 group-hover:scale-105 sm:p-4"
          />
        </Link>

      </div>

      {/* DESCRIPTION */}

      <Link
        to={productUrl}
        className="mb-1 block text-xs text-gray-500 hover:text-red-500 sm:text-sm"
      >
        {product?.description
          ? `${product.description.slice(0, 50)}${
              product.description.length > 50 ? "..." : ""
            }`
          : "No description available"}
      </Link>

      {/* NAME */}

      <Link
        to={productUrl}
        className="mb-2 block min-h-[42px] line-clamp-2 text-sm font-bold text-gray-900 hover:text-red-500 sm:text-base md:text-lg"
      >
        {product?.name || "Product"}
      </Link>

      {/* PRICE + CART */}

      <div className="flex items-center justify-between gap-2">

        <span className="text-lg font-bold text-red-500 sm:text-xl">
          ${product?.price}
        </span>

        <button
          type="button"
          disabled={!product?.in_stock}
          onClick={handleAddToCart}
          aria-label="Add to cart"
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border transition-all duration-200 sm:h-10 sm:w-10 ${
            !product?.in_stock
              ? "cursor-not-allowed border-black bg-black text-white"
              : "border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
          }`}
        >
          <ShoppingCart size={18} />
        </button>

      </div>

    </div>
  );
}

