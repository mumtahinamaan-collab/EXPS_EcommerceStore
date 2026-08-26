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

export default function Checkout() {
  const navigate = useNavigate();
  const location = useLocation();

  const userId = localStorage.getItem("userId");

  // =====================================================
  // BUY NOW DATA
  // ProductDetail se state mein product + quantity aa rahi hai
  // =====================================================

  const buyNowProduct = location.state?.product || null;
  const buyNowQuantity = Number(location.state?.quantity || 1);

  // =====================================================
  // STATES
  // =====================================================

  const [paymentMethod, setPaymentMethod] = useState("");
  const [address, setAddress] = useState("");

  const [cartItems, setCartItems] = useState([]);
  const [loadingCart, setLoadingCart] = useState(true);
  const [placingOrder, setPlacingOrder] = useState(false);

  // CARD DETAILS
  const [cardDetails, setCardDetails] = useState({
    cardNumber: "",
    cvv: "",
    expiry: "",
    cardHolder: "",
  });

  // =====================================================
  // GET CART
  // Buy Now ho to cart fetch ki zaroorat nahi
  // =====================================================

  useEffect(() => {
    if (!userId) {
      navigate("/login");
      return;
    }

    // -----------------------------------------
    // BUY NOW
    // -----------------------------------------

    if (buyNowProduct) {
      setCartItems([
        {
          id: buyNowProduct.id,
          product: buyNowProduct,
          product_name: buyNowProduct.name,
          product_price: buyNowProduct.price,
          price: buyNowProduct.price,
          quantity: buyNowQuantity,
          image_url: buyNowProduct.image_url,
        },
      ]);

      setLoadingCart(false);
      return;
    }

    // -----------------------------------------
    // NORMAL CART CHECKOUT
    // -----------------------------------------

    fetch(`https://exps-ecommercestore.onrender.com/api/cart/${userId}/`)
      .then(async (res) => {
        const data = await res.json();

        if (!res.ok) {
          throw new Error(
            data.message || "Unable to load cart"
          );
        }

        return data;
      })
      .then((data) => {
        const items = Array.isArray(data)
          ? data
          : data.results ||
            data.cart ||
            data.cart_items ||
            data.items ||
            [];

        setCartItems(items);
        setLoadingCart(false);
      })
      .catch((error) => {
        console.error("Cart error:", error);

        setCartItems([]);
        setLoadingCart(false);

        toast.error("Unable to load cart");
      });
  }, [
    userId,
    navigate,
    buyNowProduct,
    buyNowQuantity,
  ]);

  // =====================================================
  // CARD CHANGE
  // =====================================================

  const handleCardChange = (e) => {
    const { name, value } = e.target;

    setCardDetails((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // =====================================================
  // TOTAL PRICE
  // =====================================================

  const totalPrice = cartItems.reduce(
    (total, item) => {
      const product = item.product || {};

      const price = Number(
        item.price ||
          item.product_price ||
          product.price ||
          0
      );

      const quantity = Number(
        item.quantity || 1
      );

      return total + price * quantity;
    },
    0
  );

  // =====================================================
  // PLACE ORDER
  // =====================================================

  const handlePlaceOrder = async () => {
    // -----------------------------------------
    // ADDRESS
    // -----------------------------------------

    if (!address.trim()) {
      toast.error("Please enter delivery address");
      return;
    }

    // -----------------------------------------
    // PAYMENT METHOD
    // -----------------------------------------

    if (!paymentMethod) {
      toast.error("Please select payment method");
      return;
    }

    // -----------------------------------------
    // CART CHECK
    // -----------------------------------------

    if (!cartItems.length) {
      toast.error("Your cart is empty");
      return;
    }

    // -----------------------------------------
    // CARD VALIDATION
    // -----------------------------------------

    if (paymentMethod === "online") {
      const {
        cardNumber,
        cvv,
        expiry,
        cardHolder,
      } = cardDetails;

      if (
        !cardNumber.trim() ||
        !cvv.trim() ||
        !expiry.trim() ||
        !cardHolder.trim()
      ) {
        toast.error("Please fill all card details");
        return;
      }
    }

    try {
      setPlacingOrder(true);

      // -----------------------------------------
      // DEBUG
      // -----------------------------------------

      console.log(
        "PAYMENT METHOD SENT:",
        paymentMethod
      );

      // -----------------------------------------
      // ORDER DATA
      // -----------------------------------------

      const orderData = {
        userId: userId,

        address: address,

        // MUST BE "cod" OR "online"
        paymentMethod: paymentMethod,

        cardNumber:
          paymentMethod === "online"
            ? cardDetails.cardNumber
            : "",

        cvv:
          paymentMethod === "online"
            ? cardDetails.cvv
            : "",

        expiry:
          paymentMethod === "online"
            ? cardDetails.expiry
            : "",

        cardHolder:
          paymentMethod === "online"
            ? cardDetails.cardHolder
            : "",
      };

      console.log(
        "ORDER DATA:",
        orderData
      );

      // -----------------------------------------
      // CREATE ORDER
      // -----------------------------------------

      const response = await fetch(
        "https://exps-ecommercestore.onrender.com/api/place_order/",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify(orderData),
        }
      );

      const result = await response.json();

      console.log(
        "ORDER RESPONSE:",
        result
      );

      // -----------------------------------------
      // SUCCESS
      // -----------------------------------------

      if (response.ok) {
        toast.success(
          result.message ||
            "Order placed successfully"
        );

        setTimeout(() => {
          navigate("/myorder");
        }, 1500);
      } else {
        toast.error(
          result.message ||
            "Something went wrong"
        );
      }
    } catch (error) {
      console.error(
        "PLACE ORDER ERROR:",
        error
      );

      toast.error(
        "Error connecting to server"
      );
    } finally {
      setPlacingOrder(false);
    }
  };

  // =====================================================
  // PRODUCT ITEM DATA
  // =====================================================

  const getProductData = (item) => {
    const product = item.product || {};

    const name =
      item.product_name ||
      product.name ||
      item.name ||
      "Product";

    const price = Number(
      item.price ||
        item.product_price ||
        product.price ||
        0
    );

    const quantity = Number(
      item.quantity || 1
    );

    const image =
      item.image_url ||
      item.image ||
      product.image_url ||
      product.image ||
      "";

    return {
      name,
      price,
      quantity,
      image,
    };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-stone-100 px-4 py-8 pb-24 sm:px-6 lg:px-8">

      <ToastContainer
        position="top-center"
        autoClose={2000}
      />

      <div className="mx-auto max-w-6xl">

        {/* =================================================
            HEADER
        ================================================= */}

        <div className="mb-8">

          <Link
            to="/cart"
            className="mb-4 inline-flex items-center gap-2 text-sm text-gray-500 hover:text-red-500"
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

        {/* =================================================
            CONTENT
        ================================================= */}

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">

          {/* =================================================
              LEFT
          ================================================= */}

          <div className="space-y-6 lg:col-span-2">

            {/* =================================================
                SHIPPING ADDRESS
            ================================================= */}

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
                className="w-full resize-none rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-red-500 focus:ring-1 focus:ring-red-500"
              />

            </div>

            {/* =================================================
                PAYMENT
            ================================================= */}

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

              {/* =================================================
                  COD
              ================================================= */}

              <button
                type="button"
                onClick={() =>
                  setPaymentMethod("cod")
                }
                className={`w-full rounded-xl border p-4 text-left transition ${
                  paymentMethod === "cod"
                    ? "border-red-500 bg-red-50"
                    : "border-gray-200 hover:border-red-300"
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

                  {paymentMethod === "cod" && (
                    <Check
                      size={20}
                      className="text-red-500"
                    />
                  )}

                </div>

              </button>

              {/* =================================================
                  ONLINE
              ================================================= */}

              <button
                type="button"
                onClick={() =>
                  setPaymentMethod("online")
                }
                className={`mt-3 w-full rounded-xl border p-4 text-left transition ${
                  paymentMethod === "online"
                    ? "border-red-500 bg-red-50"
                    : "border-gray-200 hover:border-red-300"
                }`}
              >

                <div className="flex items-center justify-between">

                  <div>
                    <p className="font-semibold text-gray-900">
                      Card Payment
                    </p>

                    <p className="mt-1 text-sm text-gray-500">
                      Pay using your card
                    </p>
                  </div>

                  {paymentMethod === "online" && (
                    <Check
                      size={20}
                      className="text-red-500"
                    />
                  )}

                </div>

              </button>

              {/* =================================================
                  CARD DETAILS
              ================================================= */}

              {paymentMethod === "online" && (

                <div className="mt-5 space-y-4">

                  {/* CARD HOLDER */}

                  <div>

                    <label className="mb-2 block text-sm font-semibold text-gray-700">
                      Card Holder Name
                    </label>

                    <input
                      type="text"
                      name="cardHolder"
                      value={
                        cardDetails.cardHolder
                      }
                      onChange={
                        handleCardChange
                      }
                      placeholder="Enter card holder name"
                      className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-red-500"
                    />

                  </div>

                  {/* CARD NUMBER */}

                  <div>

                    <label className="mb-2 block text-sm font-semibold text-gray-700">
                      Card Number
                    </label>

                    <input
                      type="text"
                      name="cardNumber"
                      value={
                        cardDetails.cardNumber
                      }
                      onChange={
                        handleCardChange
                      }
                      placeholder="Enter card number"
                      maxLength={19}
                      className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-red-500"
                    />

                  </div>

                  {/* EXPIRY + CVV */}

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

                    <div>

                      <label className="mb-2 block text-sm font-semibold text-gray-700">
                        Expiry Date
                      </label>

                      <input
                        type="text"
                        name="expiry"
                        value={
                          cardDetails.expiry
                        }
                        onChange={
                          handleCardChange
                        }
                        placeholder="MM/YY"
                        maxLength={5}
                        className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-red-500"
                      />

                    </div>

                    <div>

                      <label className="mb-2 block text-sm font-semibold text-gray-700">
                        CVV
                      </label>

                      <input
                        type="password"
                        name="cvv"
                        value={
                          cardDetails.cvv
                        }
                        onChange={
                          handleCardChange
                        }
                        placeholder="CVV"
                        maxLength={3}
                        className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-red-500"
                      />

                    </div>

                  </div>

                </div>
              )}

            </div>

          </div>

          {/* =================================================
              ORDER SUMMARY
          ================================================= */}

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

              {/* =================================================
                  BUY NOW LABEL
              ================================================= */}

              {buyNowProduct && (
                <div className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-xs font-medium text-red-600">
                  Buy Now
                </div>
              )}

              {/* =================================================
                  PRODUCTS
              ================================================= */}

              <div className="mt-5 space-y-4">

                {loadingCart ? (

                  <p className="py-5 text-center text-sm text-gray-400">
                    Loading cart...
                  </p>

                ) : cartItems.length === 0 ? (

                  <p className="py-5 text-center text-sm text-gray-400">
                    Your cart is empty
                  </p>

                ) : (

                  cartItems.map((item, index) => {

                    const {
                      name,
                      price,
                      quantity,
                      image,
                    } = getProductData(item);

                    const subtotal =
                      price * quantity;

                    return (
                      <div
                        key={
                          item.id || index
                        }
                        className="flex gap-3 border-b border-gray-100 pb-4"
                      >

                        {/* IMAGE */}

                        <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-gray-100">

                          {image ? (
                            <img
                              src={image}
                              alt={name}
                              className="h-full w-full object-cover"
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

                        {/* INFO */}

                        <div className="min-w-0 flex-1">

                          <p className="truncate text-sm font-semibold text-gray-800">
                            {name}
                          </p>

                          <p className="mt-1 text-xs text-gray-400">
                            Quantity: {quantity}
                          </p>

                          <p className="mt-1 text-sm font-medium text-gray-700">
                            ${price.toFixed(2)}
                          </p>

                        </div>

                        {/* SUBTOTAL */}

                        <div className="shrink-0 text-right">

                          <p className="text-sm font-bold text-gray-900">
                            ${subtotal.toFixed(2)}
                          </p>

                        </div>

                      </div>
                    );
                  })
                )}

              </div>

              {/* =================================================
                  PRICE
              ================================================= */}

              <div className="mt-5 space-y-3">

                <div className="flex justify-between text-sm text-gray-600">

                  <span>
                    Subtotal
                  </span>

                  <span className="font-medium text-gray-800">
                    ${totalPrice.toFixed(2)}
                  </span>

                </div>

                <div className="flex justify-between text-sm text-gray-600">

                  <span>
                    Shipping
                  </span>

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
                      ${totalPrice.toFixed(2)}
                    </span>

                  </div>

                </div>

              </div>

              {/* =================================================
                  PLACE ORDER
              ================================================= */}

              <button
                type="button"
                disabled={
                  placingOrder ||
                  loadingCart ||
                  cartItems.length === 0
                }
                onClick={handlePlaceOrder}
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg border border-red-500 bg-red-500 py-3 font-semibold text-white transition hover:bg-red-600 disabled:cursor-not-allowed disabled:border-black disabled:bg-black disabled:text-white"
              >

                <ShoppingBag size={19} />

                {placingOrder
                  ? "Placing Order..."
                  : "Place Order"}

              </button>

              {/* =================================================
                  BACK
              ================================================= */}

              <Link
                to="/cart"
                className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg border border-gray-200 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50"
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