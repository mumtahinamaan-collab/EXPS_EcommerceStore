
import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  MapPin,
  CreditCard,
  ShoppingBag,
  ArrowLeft,
  Check,
} from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import API_BASE_URL from "../config/api";
import { authFetch } from "../utils/auth";

export default function Checkout() {
  const navigate = useNavigate();
  const location = useLocation();

  const buyNowProduct = location.state?.product || null;
  const buyNowQuantity = Math.max(
    1,
    Number(location.state?.quantity || 1)
  );

  const [address, setAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [cartItems, setCartItems] = useState([]);
  const [loadingCart, setLoadingCart] = useState(true);
  const [placingOrder, setPlacingOrder] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");

    if (!token) {
      toast.error("Please login first");

      setTimeout(() => {
        navigate("/login");
      }, 500);
    }
  }, [navigate]);

  const getProductData = (item) => {
    const product = item?.product || {};

    return {
      id:
        item?.product_id ||
        product?.id ||
        item?.id ||
        null,

      name:
        item?.product_name ||
        product?.name ||
        item?.name ||
        "Product",

      price: Number(
        item?.price ??
          item?.product_price ??
          product?.price ??
          0
      ),

      quantity: Math.max(
        1,
        Number(item?.quantity || 1)
      ),

      image:
        item?.image_url ||
        item?.image ||
        product?.image_url ||
        product?.image ||
        "",
    };
  };

  useEffect(() => {
    const token = localStorage.getItem("accessToken");

    if (!token) return;

    if (buyNowProduct) {
      const buyNowItem = {
        id: buyNowProduct.id,
        product_id: buyNowProduct.id,
        product: buyNowProduct,
        product_name: buyNowProduct.name,
        price: buyNowProduct.price,
        quantity: buyNowQuantity,
        image_url:
          buyNowProduct.image_url ||
          buyNowProduct.image ||
          "",
      };

      setCartItems([buyNowItem]);
      setLoadingCart(false);
      return;
    }

    const loadCart = async () => {
      try {
        setLoadingCart(true);

        const response = await authFetch(
          `${API_BASE_URL}/cart/`,
          {
            method: "GET",
            headers: {
              Accept: "application/json",
            },
          }
        );

        if (response.status === 401) {
          toast.error(
            "Your session has expired. Please login again."
          );

          setTimeout(() => {
            navigate("/login");
          }, 700);

          return;
        }

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data?.message ||
              data?.detail ||
              "Unable to load cart"
          );
        }

        const items = Array.isArray(data)
          ? data
          : data?.results ||
            data?.cart ||
            data?.cart_items ||
            data?.items ||
            [];

        setCartItems(items);
      } catch (error) {
        console.error("Checkout cart error:", error);

        toast.error(
          error?.message || "Unable to load cart"
        );

        setCartItems([]);
      } finally {
        setLoadingCart(false);
      }
    };

    loadCart();
  }, [
    buyNowProduct,
    buyNowQuantity,
    navigate,
  ]);

  const totalPrice = cartItems.reduce(
    (total, item) => {
      const { price, quantity } =
        getProductData(item);

      return total + price * quantity;
    },
    0
  );

  const handlePlaceOrder = async () => {
    const token =
      localStorage.getItem("accessToken");

    if (!token) {
      toast.error("Please login first");
      navigate("/login");
      return;
    }

    if (placingOrder) return;

    if (!address.trim()) {
      toast.error(
        "Please enter delivery address"
      );
      return;
    }

    if (!paymentMethod) {
      toast.error(
        "Please select payment method"
      );
      return;
    }

    if (
      loadingCart ||
      cartItems.length === 0
    ) {
      toast.error("Your cart is empty");
      return;
    }

    try {
      setPlacingOrder(true);

      const orderData = {
        address: address.trim(),
        payment_method: paymentMethod,
      };

      if (buyNowProduct) {
        orderData.buy_now_product_id =
          buyNowProduct.id;

        orderData.buy_now_quantity =
          buyNowQuantity;
      }

      const response = await authFetch(
        `${API_BASE_URL}/orders/place/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify(orderData),
        }
      );

      if (response.status === 401) {
        toast.error(
          "Session expired, login again"
        );

        navigate("/login");
        return;
      }

      const raw = await response.text();

      console.log("STATUS:", response.status);
      console.log("RAW:", raw);

      let result = {};

      try {
        result = raw
          ? JSON.parse(raw)
          : {};
      } catch {
        result = {};
      }

      console.log("RESULT:", result);

      if (!response.ok) {
        toast.error(
          result?.message ||
            result?.error ||
            "Unable to place order"
        );

        return;
      }

      // =====================================================
      // COD SUCCESS
      // =====================================================

      if (paymentMethod === "cod") {
        // Clear checkout cart state
        setCartItems([]);

        // Notify Navbar immediately
        window.dispatchEvent(
          new Event("cartUpdated")
        );

        toast.success(
          result?.message ||
            "Order placed successfully!"
        );

        setTimeout(() => {
          navigate("/myorder");
        }, 800);

        return;
      }

      // =====================================================
      // STRIPE
      // =====================================================

      if (paymentMethod === "stripe") {
        const clientSecret =
          result?.client_secret;

        if (!clientSecret) {
          toast.error(
            "Backend ne client_secret nahi bheja."
          );

          console.error(
            "Missing client_secret:",
            result
          );

          return;
        }

        // Save Stripe payment information
        sessionStorage.setItem(
          "stripeClientSecret",
          clientSecret
        );

        sessionStorage.setItem(
          "stripeOrderNumber",
          result.order_number || ""
        );

        sessionStorage.setItem(
          "stripeTotalAmount",
          String(
            result.total_amount ||
              totalPrice
          )
        );

        toast.success(
          "Stripe initialized"
        );

        navigate("/stripe-payment");
      }
    } catch (e) {
      console.error(
        "PLACE ORDER ERROR:",
        e
      );

      toast.error("Server error");
    } finally {
      setPlacingOrder(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-stone-100 px-4 py-8 pb-24 sm:px-6 lg:px-8">
      <ToastContainer
        position="top-center"
        autoClose={2000}
      />

      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <Link
            to="/cart"
            className="mb-4 inline-flex items-center gap-2 text-sm text-gray-500 transition hover:text-red-500"
          >
            <ArrowLeft size={17} />
            Back to Cart
          </Link>

          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
            Checkout
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Complete your order
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* LEFT */}
          <div className="space-y-6 lg:col-span-2">
            {/* SHIPPING */}
            <div className="rounded-2xl bg-white p-5 shadow-md sm:p-6">
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-50">
                  <MapPin
                    size={20}
                    className="text-red-500"
                  />
                </div>

                <h2 className="text-lg font-bold text-gray-900">
                  Shipping Address
                </h2>
              </div>

              <label
                htmlFor="address"
                className="mb-2 block text-sm font-semibold text-gray-700"
              >
                Delivery Address
              </label>

              <textarea
                id="address"
                value={address}
                onChange={(e) =>
                  setAddress(e.target.value)
                }
                placeholder="Enter your complete delivery address"
                rows={4}
                disabled={placingOrder}
                className="w-full resize-none rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-red-500 focus:ring-1 focus:ring-red-500 disabled:bg-gray-100"
              />
            </div>

            {/* PAYMENT */}
            <div className="rounded-2xl bg-white p-5 shadow-md sm:p-6">
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-50">
                  <CreditCard
                    size={20}
                    className="text-red-500"
                  />
                </div>

                <h2 className="text-lg font-bold text-gray-900">
                  Payment Method
                </h2>
              </div>

              <button
                type="button"
                disabled={placingOrder}
                onClick={() =>
                  setPaymentMethod("cod")
                }
                className={`w-full rounded-xl border p-4 text-left transition ${
                  paymentMethod === "cod"
                    ? "border-red-500 bg-red-50"
                    : "border-gray-200 hover:border-red-300"
                } ${
                  placingOrder
                    ? "cursor-not-allowed opacity-60"
                    : ""
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-gray-900">
                      Cash on Delivery
                    </p>

                    <p className="mt-1 text-sm text-gray-500">
                      Pay when your order arrives
                    </p>
                  </div>

                  {paymentMethod ===
                    "cod" && (
                    <Check
                      size={20}
                      className="text-red-500"
                    />
                  )}
                </div>
              </button>

              <button
                type="button"
                disabled={placingOrder}
                onClick={() =>
                  setPaymentMethod("stripe")
                }
                className={`mt-3 w-full rounded-xl border p-4 text-left transition ${
                  paymentMethod ===
                  "stripe"
                    ? "border-red-500 bg-red-50"
                    : "border-gray-200 hover:border-red-300"
                } ${
                  placingOrder
                    ? "cursor-not-allowed opacity-60"
                    : ""
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <CreditCard
                      size={21}
                      className="text-purple-600"
                    />

                    <div>
                      <p className="font-semibold text-gray-900">
                        Stripe
                      </p>

                      <p className="mt-1 text-sm text-gray-500">
                        Pay securely using Stripe
                      </p>
                    </div>
                  </div>

                  {paymentMethod ===
                    "stripe" && (
                    <Check
                      size={20}
                      className="text-red-500"
                    />
                  )}
                </div>
              </button>

              {paymentMethod && (
                <div className="mt-5 rounded-lg bg-gray-50 p-4">
                  <p className="text-sm text-gray-600">
                    Selected payment method:

                    <span className="ml-1 font-semibold text-gray-900">
                      {paymentMethod ===
                      "cod"
                        ? "Cash on Delivery"
                        : "Stripe"}
                    </span>
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT */}
          <div>
            <div className="sticky top-24 rounded-2xl bg-white p-5 shadow-md sm:p-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">
                  Order Summary
                </h2>

                <ShoppingBag
                  size={21}
                  className="text-red-500"
                />
              </div>

              {buyNowProduct && (
                <div className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-xs font-medium text-red-600">
                  Buy Now
                </div>
              )}

              <div className="mt-5 space-y-4">
                {loadingCart ? (
                  <p className="py-5 text-center text-sm text-gray-400">
                    Loading cart...
                  </p>
                ) : cartItems.length ===
                  0 ? (
                  <p className="py-5 text-center text-sm text-gray-400">
                    Your cart is empty
                  </p>
                ) : (
                  cartItems.map(
                    (item, index) => {
                      const {
                        name,
                        price,
                        quantity,
                        image,
                      } =
                        getProductData(
                          item
                        );

                      const subtotal =
                        price * quantity;

                      return (
                        <div
                          key={
                            item?.id ||
                            item?.product_id ||
                            index
                          }
                          className="flex gap-3 border-b border-gray-100 pb-4"
                        >
                          <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-gray-100">
                            {image ? (
                              <img
                                src={image}
                                alt={name}
                                className="h-full w-full object-cover"
                                onError={(e) => {
                                  e.currentTarget.style.display =
                                    "none";
                                }}
                              />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center">
                                <ShoppingBag
                                  size={22}
                                  className="text-gray-300"
                                />
                              </div>
                            )}
                          </div>

                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-semibold text-gray-800">
                              {name}
                            </p>

                            <p className="mt-1 text-xs text-gray-400">
                              Quantity:{" "}
                              {quantity}
                            </p>

                            <p className="mt-1 text-sm font-medium text-gray-700">
                              $
                              {price.toFixed(
                                2
                              )}
                            </p>
                          </div>

                          <div className="shrink-0 text-right">
                            <p className="text-sm font-bold text-gray-900">
                              $
                              {subtotal.toFixed(
                                2
                              )}
                            </p>
                          </div>
                        </div>
                      );
                    }
                  )
                )}
              </div>

              <div className="mt-5 space-y-3">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Subtotal</span>

                  <span className="font-medium text-gray-800">
                    ${totalPrice.toFixed(2)}
                  </span>
                </div>

                <div className="flex justify-between text-sm text-gray-600">
                  <span>Shipping</span>

                  <span className="font-medium text-green-600">
                    Free
                  </span>
                </div>

                <div className="border-t border-gray-200 pt-4">
                  <div className="flex items-center justify-between">
                    <span className="text-base font-bold text-gray-900">
                      Total
                    </span>

                    <span className="text-xl font-bold text-red-500">
                      $
                      {totalPrice.toFixed(
                        2
                      )}
                    </span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                disabled={
                  placingOrder ||
                  loadingCart ||
                  !cartItems.length ||
                  !paymentMethod ||
                  !address.trim()
                }
                onClick={handlePlaceOrder}
                className="mt-6 flex w-full items-center justify-center cursor-pointer gap-2 rounded-lg bg-red-500 py-3 font-semibold text-white transition hover:bg-red-600 disabled:cursor-not-allowed disabled:bg-gray-400"
              >
                <ShoppingBag size={19} />

                {placingOrder
                  ? paymentMethod ===
                    "stripe"
                    ? "Initializing Payment..."
                    : "Placing Order..."
                  : paymentMethod ===
                    "stripe"
                  ? "Continue to Payment"
                  : "Place Order"}
              </button>

              <Link
                to="/cart"
                className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg border border-gray-200 py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
              >
                <ArrowLeft size={17} />
                Back to Cart
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

