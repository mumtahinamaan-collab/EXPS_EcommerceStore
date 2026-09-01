
import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";

import { ArrowLeft, Plus, Minus, ShoppingCart } from "lucide-react";

import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";

import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import API_BASE_URL from "../config/api";
import { authFetch } from "../utils/auth";

const ProductDetail = () => {
  const { productSlug } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);

  // =========================
  // GET PRODUCT
  // Public API - authFetch not needed
  // =========================

  useEffect(() => {
    fetch(`${API_BASE_URL}/products/${productSlug}/`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Product not found");
        }

        return response.json();
      })
      .then((data) => {
        setProduct(data);
      })
      .catch(() => {
        toast.error("Product not loading");
      });
  }, [productSlug]);

  // =========================
  // ADD TO CART
  // =========================

  const handleAddToCart = async () => {
    const accessToken = localStorage.getItem("accessToken");

    if (!accessToken) {
      toast.error("Please login first");
      navigate("/login");
      return;
    }

    if (!product?.in_stock) {
      toast.error("Product is out of stock");
      return;
    }

    try {
      const response = await authFetch(`${API_BASE_URL}/cart/add/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
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
        toast.success(
          result.message || "Item added to cart"
        );

        // Navbar cart count update
        window.dispatchEvent(new Event("cartUpdated"));

        setTimeout(() => {
          navigate("/cart");
        }, 1000);

        return;
      }

      // =========================
      // AUTH FAILED AFTER REFRESH
      // =========================

      if (response.status === 401) {
        toast.error(
          "Your session has expired. Please login again."
        );

        window.dispatchEvent(new Event("authChanged"));

        navigate("/login");

        return;
      }

      // =========================
      // OTHER API ERROR
      // =========================

      toast.error(
        result.message ||
          result.detail ||
          "Unable to add item to cart"
      );
    } catch {
      toast.error("Unable to add item to cart");
    }
  };

  // =========================
  // BUY NOW
  // =========================

  const handleBuyNow = () => {
    const accessToken = localStorage.getItem("accessToken");

    if (!accessToken) {
      toast.error("Please login first");
      navigate("/login");
      return;
    }

    if (!product?.in_stock) {
      toast.error("Product is out of stock");
      return;
    }

    navigate("/checkout", {
      state: {
        product: product,
        quantity: quantity,
      },
    });
  };

  // =========================
  // PRODUCT NOT LOADED
  // =========================

  if (!product) {
    return (
      <>
        <ToastContainer
          position="top-center"
          autoClose={2000}
        />

        <div className="flex min-h-screen items-center justify-center">
          <p className="text-gray-500">
            Product not available
          </p>
        </div>
      </>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-stone-100 px-4 py-8">
      <ToastContainer
        position="top-center"
        autoClose={2000}
      />

      <div className="mx-auto max-w-6xl">

        {/* BACK */}

        <Link
          to="/products"
          className="mb-6 inline-flex items-center gap-2 text-sm text-gray-500 hover:text-red-500"
        >
          <ArrowLeft size={18} />
          Back to Products
        </Link>

        {/* PRODUCT */}

        <div className="grid grid-cols-1 gap-8 rounded-2xl bg-white p-2 shadow-md md:grid-cols-2 md:p-8">

          {/* IMAGE */}

          <div className="relative flex h-[450px] items-center justify-center overflow-hidden rounded-xl bg-gray-100">
            <Zoom>
              <img
                src={product.image_url}
                alt={product.name}
                className="h-full w-full cursor-zoom-in object-contain p-5"
              />
            </Zoom>
          </div>

          {/* PRODUCT INFO */}

          <div>

            {/* NAME */}

            <h1 className="text-2xl font-bold text-gray-900">
              {product.name}
            </h1>

            {/* STOCK */}

            <div className="mt-5">
              {product.in_stock ? (
                <p className="font-semibold text-green-600">
                  ✓ In Stock
                </p>
              ) : (
                <p className="font-semibold text-red-500">
                  ✕ Out of Stock
                </p>
              )}
            </div>

            {/* DELIVERY */}

            <div className="p-2">
              <p className="text-md font-semibold">
                🚚 Fast & Free Delivery
              </p>

              <p className="mt-1 text-sm text-gray-500">
                On all orders
              </p>

              <p className="mt-1 text-sm text-gray-500">
                Get your order within 2–3 business days
              </p>
            </div>

            {/* PRICE */}

            <p className="text-3xl font-bold text-red-500">
              ${product.price}
            </p>

            {/* QUANTITY */}

            <div className="mt-4 flex items-center gap-2">
              <span className="font-semibold">
                Quantity:
              </span>

              <div className="flex items-center overflow-hidden rounded-md border">

                <button
                  type="button"
                  disabled={quantity <= 1}
                  onClick={() =>
                    setQuantity((prev) => prev - 1)
                  }
                  className={`flex h-9 w-9 items-center justify-center ${
                    !product.in_stock
                      ? "cursor-not-allowed bg-black text-white"
                      : "hover:bg-gray-100 cursor-pointer"
                  }`}
                >
                  <Minus size={12} />
                </button>

                <span className="flex h-9 min-w-10 items-center justify-center border-x bg-white">
                  {quantity}
                </span>

                <button
                  type="button"
                  disabled={quantity >= 5}
                  onClick={() =>
                    setQuantity((prev) => prev + 1)
                  }
                  className={`flex h-9 w-9 items-center justify-center ${
                    !product.in_stock
                      ? "cursor-not-allowed bg-black text-white"
                      : "hover:bg-gray-100 cursor-pointer"
                  }`}
                >
                  <Plus size={16} />
                </button>

              </div>
            </div>

            {/* BUTTONS */}

            <div className="mt-16 flex flex-col gap-4">

              {/* BUY NOW */}

              <button
                type="button"
                disabled={!product.in_stock}
                onClick={handleBuyNow}
                className="w-full rounded-lg border  border-red-500 cursor-pointer bg-red-500 py-2 font-semibold text-white transition hover:bg-red-600 disabled:cursor-not-allowed disabled:border-black disabled:bg-black disabled:text-white"
              >
                Buy it Now
              </button>

              {/* ADD TO CART */}

              <button
                type="button"
                disabled={!product.in_stock}
                onClick={handleAddToCart}
                className="flex w-full items-center justify-center gap-2 rounded-lg border border-red-500 bg-white py-2 font-semibold text-red-500 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:border-black disabled:bg-black disabled:text-white cursor-pointer"
              >
                <ShoppingCart size={19} />
                Add To Cart
              </button>

            </div>
          </div>
        </div>

        {/* DETAILS */}

        <div className="mt-8 grid gap-6 md:grid-cols-2">

          {/* PRODUCT DETAILS */}

          <div className="rounded-2xl bg-white p-6 shadow-md">
            <h2 className="text-xl font-bold">
              Product Details
            </h2>

            <p className="mt-4 leading-7 text-gray-600">
              {product.description}
            </p>
          </div>

          {/* MORE INFORMATION */}

          <div className="rounded-2xl bg-white p-6 shadow-md">
            <h2 className="text-xl font-bold">
              More Information
            </h2>

            <div className="mt-5 space-y-4 text-sm">

              <div className="flex justify-between">
                <span className="font-semibold">
                  Category
                </span>

                <span className="text-gray-600">
                  {product.category_name}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="font-semibold">
                  SKU
                </span>

                <span className="text-gray-600">
                  {product.sku}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="font-semibold">
                  Brand
                </span>

                <span className="text-gray-600">
                  {product.brand}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="font-semibold">
                  ↩ 7 Days Return
                </span>

                <span className="text-gray-600">
                  Easy returns
                </span>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ProductDetail;

