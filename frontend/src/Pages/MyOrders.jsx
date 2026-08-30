
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ShoppingBag,
  Package,
  Calendar,
  MapPin,
  CreditCard,
  ChevronDown,
  ChevronUp,
  XCircle,
  Check,
  Circle,
} from "lucide-react";

import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import API_BASE_URL from "../config/api";
import { authFetch, logoutUser } from "../utils/auth";

export default function MyOrders() {
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openOrder, setOpenOrder] = useState(null);
  const [cancelling, setCancelling] = useState(null);

  // =========================================================
  // UNAUTHORIZED
  // =========================================================

  const handleUnauthorized = () => {
    logoutUser();

    toast.error(
      "Session expired. Please login again"
    );

    setTimeout(() => {
      navigate("/login");
    }, 500);
  };

  // =========================================================
  // LOAD ORDERS
  // =========================================================

  const loadOrders = async () => {
    const token =
      localStorage.getItem("accessToken");

    if (!token) {
      navigate("/login");
      return;
    }

    try {
      setLoading(true);

      const response = await authFetch(
        `${API_BASE_URL}/orders/?_=${Date.now()}`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
          },
        }
      );

      if (response.status === 401) {
        handleUnauthorized();
        return;
      }

      let data;

      try {
        data = await response.json();
      } catch {
        data = [];
      }

      if (!response.ok) {
        throw new Error(
          data?.message ||
            data?.detail ||
            "Unable to load orders"
        );
      }

      const orderList = Array.isArray(data)
        ? data
        : data?.results ||
          data?.orders ||
          [];

      setOrders(
        Array.isArray(orderList)
          ? orderList
          : []
      );
    } catch (error) {
      console.error(
        "Orders error:",
        error
      );

      setOrders([]);

      toast.error(
        error?.message ||
          "Unable to load orders"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  // =========================================================
  // CANCEL ORDER
  // ONLY PENDING ORDERS
  // =========================================================

  const cancelOrder = async (orderNumber) => {
    const selectedOrder = orders.find(
      (order) =>
        String(order.order_number) ===
        String(orderNumber)
    );

    // Frontend protection
    if (
      !selectedOrder ||
      String(
        selectedOrder.status || ""
      )
        .toLowerCase()
        .trim() !== "pending"
    ) {
      toast.error(
        "Only pending orders can be cancelled"
      );

      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to cancel this order?"
    );

    if (!confirmed) return;

    try {
      setCancelling(orderNumber);

      const response = await authFetch(
        `${API_BASE_URL}/orders/${orderNumber}/cancel/`,
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
            Accept: "application/json",
          },
        }
      );

      if (response.status === 401) {
        handleUnauthorized();
        return;
      }

      const data =
        await response
          .json()
          .catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          data?.message ||
            data?.detail ||
            "Unable to cancel order"
        );
      }

      toast.success(
        data?.message ||
          "Order cancelled successfully"
      );

      // Reload orders
      await loadOrders();
    } catch (error) {
      console.error(
        "Cancel order error:",
        error
      );

      toast.error(
        error?.message ||
          "Unable to cancel order"
      );
    } finally {
      setCancelling(null);
    }
  };

  // =========================================================
  // STATUS
  // =========================================================

  const statuses = [
    "pending",
    "processing",
    "shipped",
    "delivered",
  ];

  const getCurrentStatus = (order) => {
    if (!order) return "pending";

    const mainStatus = String(
      order.status || "pending"
    )
      .toLowerCase()
      .trim();

    if (mainStatus === "cancelled") {
      return "cancelled";
    }

    return mainStatus;
  };

  const getStatusLabel = (status) => {
    const labels = {
      pending: "Pending",
      processing: "Processing",
      shipped: "Shipped",
      delivered: "Delivered",
      cancelled: "Cancelled",
      confirmed: "Confirmed",
    };

    return (
      labels[
        String(status).toLowerCase()
      ] || "Pending"
    );
  };

  const getStatusConfig = (status) => {
    switch (
      String(status).toLowerCase()
    ) {
      case "delivered":
        return {
          bg: "bg-emerald-50",
          text: "text-emerald-700",
          dot: "bg-emerald-500",
          border: "border-emerald-200",
        };

      case "shipped":
        return {
          bg: "bg-blue-50",
          text: "text-blue-700",
          dot: "bg-blue-500",
          border: "border-blue-200",
        };

      case "processing":
        return {
          bg: "bg-violet-50",
          text: "text-violet-700",
          dot: "bg-violet-500",
          border: "border-violet-200",
        };

      case "confirmed":
        return {
          bg: "bg-indigo-50",
          text: "text-indigo-700",
          dot: "bg-indigo-500",
          border: "border-indigo-200",
        };

      case "cancelled":
        return {
          bg: "bg-red-50",
          text: "text-red-700",
          dot: "bg-red-500",
          border: "border-red-200",
        };

      default:
        return {
          bg: "bg-amber-50",
          text: "text-amber-700",
          dot: "bg-amber-500",
          border: "border-amber-200",
        };
    }
  };

  // =========================================================
  // DATE / PAYMENT / PRODUCTS
  // =========================================================

  const formatDateTime = (date) => {
    if (!date) return "—";

    const d = new Date(date);

    return isNaN(d.getTime())
      ? "—"
      : d.toLocaleString("en-US", {
          dateStyle: "medium",
          timeStyle: "short",
        });
  };

  const formatDate = (date) => {
    if (!date) return "—";

    const d = new Date(date);

    return isNaN(d.getTime())
      ? "—"
      : d.toLocaleDateString("en-US", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        });
  };

  const formatTime = (date) => {
    if (!date) return "—";

    const d = new Date(date);

    return isNaN(d.getTime())
      ? "—"
      : d.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
        });
  };

  const getPaymentLabel = (method) => {
    if (method === "cod") {
      return "Cash on Delivery";
    }

    if (method === "stripe") {
      return "Stripe";
    }

    return method || "—";
  };

  const getOrderItems = (order) => {
    if (Array.isArray(order.products)) {
      return order.products;
    }

    if (Array.isArray(order.items)) {
      return order.items;
    }

    return [];
  };

  const getProductName = (product) => {
    return (
      product?.product_name ||
      product?.name ||
      product?.product?.name ||
      "Product"
    );
  };

  const getProductPrice = (product) => {
    return Number(
      product?.price ||
        product?.product_price ||
        product?.product?.price ||
        0
    );
  };

  const getProductQuantity = (product) => {
    return Number(
      product?.quantity || 1
    );
  };

  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-stone-100 px-4 py-10">
        <ToastContainer
          position="top-center"
          autoClose={2000}
        />

        <div className="mx-auto max-w-6xl">
          <div className="rounded-2xl bg-white p-12 text-center shadow-md">
            <Package
              size={38}
              className="mx-auto mb-4 animate-pulse text-red-400"
            />

            <p className="text-gray-500">
              Loading your orders...
            </p>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================
  // UI
  // =========================================================

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-stone-100 px-4 py-8 sm:px-6 lg:px-8">
      <ToastContainer
        position="top-center"
        autoClose={2000}
      />

      <div className="mx-auto max-w-6xl">
        {/* HEADER */}

        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-50">
              <ShoppingBag
                size={25}
                className="text-red-500"
              />
            </div>

            <div>
              <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                My Orders
              </h1>

              <p className="mt-1 text-sm text-gray-500">
                View your orders and track
                their status
              </p>
            </div>
          </div>

          <button
            onClick={loadOrders}
            className="rounded-lg border bg-white px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50"
          >
            Refresh
          </button>
        </div>

        {/* NO ORDERS */}

        {orders.length === 0 && (
          <div className="rounded-2xl bg-white px-6 py-14 text-center shadow-md">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-red-50">
              <ShoppingBag
                size={40}
                className="text-red-400"
              />
            </div>

            <h2 className="mt-6 text-2xl font-bold text-gray-900">
              No Orders Yet
            </h2>

            <Link
              to="/"
              className="mt-6 inline-flex items-center gap-2 rounded-lg bg-red-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-red-600"
            >
              <ShoppingBag size={18} />
              Start Shopping
            </Link>
          </div>
        )}

        {/* ORDERS */}

        <div className="space-y-6">
          {orders.map((order) => {
            const currentStatus =
              getCurrentStatus(order);

            const config =
              getStatusConfig(
                currentStatus
              );

            const isCancelled =
              currentStatus ===
              "cancelled";

            const isPending =
              String(
                order.status || ""
              )
                .toLowerCase()
                .trim() === "pending";

            const isOpen =
              openOrder ===
              order.order_number;

            const currentIndex =
              statuses.indexOf(
                currentStatus
              );

            const orderItems =
              getOrderItems(order);

            return (
              <div
                key={
                  order.id ||
                  order.order_number
                }
                className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-md"
              >
                {/* ORDER HEADER */}

                <div className="flex flex-col gap-4 border-b border-gray-100 p-5 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-red-50">
                      <Package
                        size={21}
                        className="text-red-500"
                      />
                    </div>

                    <div>
                      <p className="text-xs uppercase tracking-wide text-gray-400">
                        Order Number
                      </p>

                      <p className="mt-1 font-bold text-gray-900">
                        #
                        {
                          order.order_number
                        }
                      </p>
                    </div>
                  </div>

                  <span
                    className={`inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-bold tracking-wide shadow-sm ${config.bg} ${config.text} ${config.border}`}
                  >
                    <span
                      className={`h-2 w-2 rounded-full ${config.dot} ${
                        !isCancelled &&
                        currentStatus !==
                          "delivered"
                          ? "animate-pulse"
                          : ""
                      }`}
                    />

                    {getStatusLabel(
                      currentStatus
                    )}
                  </span>
                </div>

                {/* ORDER INFO */}

                <div className="grid gap-5 p-5 sm:grid-cols-2 lg:grid-cols-4">
                  <div className="flex gap-3">
                    <Calendar
                      size={20}
                      className="mt-1 shrink-0 text-gray-400"
                    />

                    <div>
                      <p className="text-xs text-gray-400">
                        Order Date
                      </p>

                      <p className="mt-1 text-sm font-medium text-gray-800">
                        {formatDateTime(
                          order.created_at ||
                            order.order_at
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <CreditCard
                      size={20}
                      className="mt-1 shrink-0 text-gray-400"
                    />

                    <div>
                      <p className="text-xs text-gray-400">
                        Payment Method
                      </p>

                      <p className="mt-1 text-sm font-semibold text-gray-800">
                        {getPaymentLabel(
                          order.payment_method
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <MapPin
                      size={20}
                      className="mt-1 shrink-0 text-gray-400"
                    />

                    <div className="min-w-0">
                      <p className="text-xs text-gray-400">
                        Delivery Address
                      </p>

                      <p className="mt-1 line-clamp-2 text-sm font-medium text-gray-800">
                        {order.address ||
                          "No address"}
                      </p>
                    </div>
                  </div>

                  <div>
                    <p className="text-xs text-gray-400">
                      Total Amount
                    </p>

                    <p className="mt-1 text-xl font-bold text-red-500">
                      $
                      {Number(
                        order.total_amount ||
                          0
                      ).toFixed(2)}
                    </p>
                  </div>
                </div>

                {/* DETAILS BUTTON */}

                <button
                  type="button"
                  onClick={() =>
                    setOpenOrder(
                      isOpen
                        ? null
                        : order.order_number
                    )
                  }
                  className="flex w-full items-center justify-center gap-2 border-t border-gray-100 px-5 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
                >
                  {isOpen
                    ? "Hide Order Details"
                    : "View Order Details"}

                  {isOpen ? (
                    <ChevronUp
                      size={18}
                    />
                  ) : (
                    <ChevronDown
                      size={18}
                    />
                  )}
                </button>

                {/* DETAILS */}

                {isOpen && (
                  <div className="border-t border-gray-100 px-5 py-6">
                    {/* ORDER ITEMS */}

                    {orderItems.length >
                      0 && (
                      <div className="mb-8">
                        <h3 className="mb-4 text-base font-bold text-gray-900">
                          Order Items
                        </h3>

                        <div className="space-y-3">
                          {orderItems.map(
                            (
                              product,
                              index
                            ) => (
                              <div
                                key={
                                  product.id ||
                                  index
                                }
                                className="flex items-center justify-between gap-4 rounded-xl bg-gray-50 p-4"
                              >
                                <div className="flex min-w-0 items-center gap-3">
                                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white">
                                    <ShoppingBag
                                      size={18}
                                      className="text-gray-400"
                                    />
                                  </div>

                                  <div className="min-w-0">
                                    <p className="truncate text-sm font-semibold text-gray-800">
                                      {getProductName(
                                        product
                                      )}
                                    </p>

                                    <p className="mt-1 text-xs text-gray-400">
                                      Qty:{" "}
                                      {getProductQuantity(
                                        product
                                      )}{" "}
                                      | $
                                      {getProductPrice(
                                        product
                                      ).toFixed(
                                        2
                                      )}
                                    </p>
                                  </div>
                                </div>

                                <p className="text-sm font-bold text-gray-700">
                                  $
                                  {(
                                    getProductPrice(
                                      product
                                    ) *
                                    getProductQuantity(
                                      product
                                    )
                                  ).toFixed(
                                    2
                                  )}
                                </p>
                              </div>
                            )
                          )}
                        </div>
                      </div>
                    )}

                    {/* TRACKING */}

                    <div>
                      <h3 className="mb-7 text-base font-bold text-gray-900">
                        Order Tracking
                      </h3>

                      {isCancelled ? (
                        <div className="rounded-xl border border-red-100 bg-red-50 p-5">
                          <div className="flex items-center gap-4">
                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-red-500 text-white">
                              <XCircle
                                size={21}
                              />
                            </div>

                            <p className="font-bold text-red-600">
                              Order Cancelled
                            </p>
                          </div>
                        </div>
                      ) : (
                        <div className="overflow-x-auto pb-3">
                          <div className="min-w-[600px] px-3 sm:px-6">
                            <div className="relative">
                              {/* BASE LINE */}

                              <div className="absolute left-[12.5%] right-[12.5%] top-[58px] h-1 rounded-full bg-gray-200" />

                              {/* PROGRESS LINE */}

                              <div
                                className="absolute left-[12.5%] top-[58px] h-1 rounded-full bg-red-500 transition-all duration-700"
                                style={{
                                  width:
                                    currentIndex <=
                                    0
                                      ? "0%"
                                      : currentIndex ===
                                          1
                                        ? "33%"
                                        : currentIndex ===
                                            2
                                          ? "66%"
                                          : "100%",
                                }}
                              />

                              {/* STATUS STEPS */}

                              <div className="relative grid grid-cols-4">
                                {statuses.map(
                                  (
                                    status,
                                    index
                                  ) => {
                                    const trackingItem =
                                      order.tracking?.find(
                                        (item) =>
                                          String(
                                            item.status
                                          ).toLowerCase() ===
                                          status
                                      );

                                    const completed =
                                      currentIndex >=
                                      index;

                                    const isCurrent =
                                      status ===
                                      currentStatus;

                                    return (
                                      <div
                                        key={
                                          status
                                        }
                                        className="flex flex-col items-center text-center"
                                      >
                                        <div className="mb-4 h-9">
                                          <p
                                            className={`text-sm font-semibold ${
                                              isCurrent
                                                ? config.text
                                                : completed
                                                  ? "text-gray-800"
                                                  : "text-gray-400"
                                            }`}
                                          >
                                            {getStatusLabel(
                                              status
                                            )}
                                          </p>

                                          {isCurrent && (
                                            <span
                                              className={`mt-1 inline-block rounded-full px-2 py-0.5 text-xs font-medium ${config.bg} ${config.text}`}
                                            >
                                              Current
                                            </span>
                                          )}
                                        </div>

                                        <div
                                          className={`relative z-10 flex h-12 w-12 items-center justify-center rounded-full border-4 border-white shadow-sm ${
                                            completed
                                              ? "bg-red-500 text-white"
                                              : "bg-gray-200 text-gray-400"
                                          } ${
                                            isCurrent
                                              ? "ring-4 ring-red-100"
                                              : ""
                                          }`}
                                        >
                                          {completed ? (
                                            <Check
                                              size={
                                                20
                                              }
                                              strokeWidth={
                                                3
                                              }
                                            />
                                          ) : (
                                            <Circle
                                              size={
                                                13
                                              }
                                            />
                                          )}
                                        </div>

                                        <div className="mt-4 min-h-[35px]">
                                          {trackingItem ? (
                                            <>
                                              <p className="text-xs font-semibold text-gray-700">
                                                {formatDate(
                                                  trackingItem.status_date
                                                )}
                                              </p>

                                              <p className="mt-1 text-xs text-gray-400">
                                                {formatTime(
                                                  trackingItem.status_date
                                                )}
                                              </p>
                                            </>
                                          ) : (
                                            <p className="text-xs text-gray-300">
                                              —
                                            </p>
                                          )}
                                        </div>
                                      </div>
                                    );
                                  }
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* =================================================
                    CANCEL BUTTON
                    ONLY PENDING
                    ================================================= */}

                {isPending && (
                  <div className="border-t border-gray-100 p-4">
                    <button
                      type="button"
                      onClick={() =>
                        cancelOrder(
                          order.order_number
                        )
                      }
                      disabled={
                        cancelling ===
                        order.order_number
                      }
                      className="flex w-full items-center justify-center gap-2 rounded-lg border border-red-200 px-4 py-3 text-sm font-semibold text-red-500 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50 sm:ml-auto sm:w-auto"
                    >
                      <XCircle
                        size={18}
                      />

                      {cancelling ===
                      order.order_number
                        ? "Cancelling..."
                        : "Cancel Order"}
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

