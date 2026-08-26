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

export default function MyOrders() {
  const userId = localStorage.getItem("userId");
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openOrder, setOpenOrder] = useState(null);
  const [cancelling, setCancelling] = useState(null);

  // =========================
  // GET ORDERS
  // =========================

  useEffect(() => {
    if (!userId) {
      navigate("/login");
      return;
    }

    fetch(`https://exps-ecommercestore.onrender.com/api/orders/${userId}/`)
      .then(async (res) => {
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || "Unable to load orders");
        }

        return data;
      })
      .then((data) => {
        setOrders(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Orders error:", error);
        setOrders([]);
        setLoading(false);
        toast.error(error.message || "Unable to load orders");
      });
  }, [userId, navigate]);

  // =========================
  // CANCEL ORDER
  // =========================

  const cancelOrder = async (orderNumber) => {
    const confirmCancel = window.confirm(
      "Are you sure you want to cancel this order?"
    );

    if (!confirmCancel) return;

    setCancelling(orderNumber);

    try {
      const response = await fetch(
        `https://exps-ecommercestore.onrender.com/api/orders/${orderNumber}/cancel/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: userId,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to cancel order");
      }

      toast.success("Order cancelled successfully");

      const ordersResponse = await fetch(
        `https://exps-ecommercestore.onrender.com/api/orders/${userId}/`
      );

      const ordersData = await ordersResponse.json();

      setOrders(Array.isArray(ordersData) ? ordersData : []);
    } catch (error) {
      console.error("Cancel error:", error);
      toast.error(error.message || "Unable to cancel order");
    } finally {
      setCancelling(null);
    }
  };

  // =========================
  // STATUS
  // =========================

  const statuses = [
    "pending",
    "processing",
    "shipped",
    "delivered",
  ];

  const getCurrentStatus = (order) => {
    if (order.tracking && order.tracking.length > 0) {
      return (
        order.tracking[order.tracking.length - 1]?.status ||
        "pending"
      );
    }

    return "pending";
  };

  const getStatusLabel = (status) => {
    const labels = {
      pending: "Pending",
      processing: "Processing",
      shipped: "Shipped",
      delivered: "Delivered",
      cancelled: "Cancelled",
    };

    return labels[status] || "Pending";
  };

  const getStatusColor = (status) => {
    if (status === "delivered") {
      return "bg-green-100 text-green-700";
    }

    if (status === "shipped") {
      return "bg-blue-100 text-blue-700";
    }

    if (status === "processing") {
      return "bg-purple-100 text-purple-700";
    }

    if (status === "cancelled") {
      return "bg-red-100 text-red-700";
    }

    return "bg-yellow-100 text-yellow-700";
  };

  const formatDate = (date) => {
    if (!date) return "—";

    return new Date(date).toLocaleDateString("en-US", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatTime = (date) => {
    if (!date) return "—";

    return new Date(date).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDateTime = (date) => {
    if (!date) return "—";

    return new Date(date).toLocaleString("en-US", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  // =========================
  // LOADING
  // =========================

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-stone-100 px-4 py-10">
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-stone-100 px-4 py-8 sm:px-6 lg:px-8">
      <ToastContainer
        position="top-center"
        autoClose={2000}
      />

      <div className="mx-auto max-w-6xl">

        {/* ================= HEADER ================= */}

        <div className="mb-8 flex items-center gap-3">
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
              View your orders and track their status
            </p>
          </div>
        </div>

        {/* ================= NO ORDERS ================= */}

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

            <p className="mx-auto mt-2 max-w-md text-sm text-gray-500">
              You haven't placed any orders yet.
            </p>

            <Link
              to="/"
              className="mt-6 inline-flex items-center gap-2 rounded-lg bg-red-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-red-600"
            >
              <ShoppingBag size={18} />
              Start Shopping
            </Link>
          </div>
        )}

        {/* ================= ORDERS ================= */}

        <div className="space-y-6">

          {orders.map((order) => {
            const currentStatus = getCurrentStatus(order);

            const isCancelled =
              currentStatus === "cancelled";

            const isPending =
              currentStatus === "pending";

            const isOpen =
              openOrder === order.order_number;

            const currentIndex =
              statuses.indexOf(currentStatus);

            return (
              <div
                key={order.id}
                className="overflow-hidden rounded-2xl bg-white shadow-md"
              >

                {/* ================= ORDER HEADER ================= */}

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
                        #{order.order_number}
                      </p>
                    </div>
                  </div>

                  <span
                    className={`w-fit rounded-full px-4 py-2 text-xs font-semibold ${getStatusColor(
                      currentStatus
                    )}`}
                  >
                    {getStatusLabel(currentStatus)}
                  </span>
                </div>

                {/* ================= BASIC INFO ================= */}

                <div className="grid gap-5 p-5 sm:grid-cols-2 lg:grid-cols-4">

                  {/* DATE */}

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
                        {formatDateTime(order.order_at)}
                      </p>
                    </div>
                  </div>

                  {/* PAYMENT */}

                  <div className="flex gap-3">
                    <CreditCard
                      size={20}
                      className="mt-1 shrink-0 text-gray-400"
                    />

                    <div>
                      <p className="text-xs text-gray-400">
                        Payment Method
                      </p>

                      <p className="mt-1 text-sm font-semibold uppercase text-gray-800">
                        {order.payment_method === "cod"
                          ? "Cash on Delivery"
                          : order.payment_method === "online"
                          ? "Online Payment"
                          : order.payment_method || "—"}
                      </p>
                    </div>
                  </div>

                  {/* ADDRESS */}

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
                        {order.address || "No address"}
                      </p>
                    </div>
                  </div>

                  {/* TOTAL */}

                  <div>
                    <p className="text-xs text-gray-400">
                      Total Amount
                    </p>

                    <p className="mt-1 text-xl font-bold text-red-500">
                      $
                      {Number(
                        order.total_amount || 0
                      ).toFixed(2)}
                    </p>
                  </div>

                </div>

                {/* ================= VIEW DETAILS ================= */}

                <button
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
                    <ChevronUp size={18} />
                  ) : (
                    <ChevronDown size={18} />
                  )}
                </button>

                {/* ================= DETAILS ================= */}

                {isOpen && (
                  <div className="border-t border-gray-100 px-5 py-6">

                    {/* PRODUCTS */}

                    {order.products &&
                      order.products.length > 0 && (
                        <div className="mb-8">

                          <h3 className="mb-4 text-base font-bold text-gray-900">
                            Order Items
                          </h3>

                          <div className="space-y-3">
                            {order.products.map(
                              (product, index) => (
                                <div
                                  key={index}
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
                                        {product.product_name}
                                      </p>

                                      <p className="mt-1 text-xs text-gray-400">
                                        Quantity:{" "}
                                        {product.quantity}
                                      </p>
                                    </div>

                                  </div>

                                  <p className="shrink-0 text-sm font-bold text-gray-700">
                                    $
                                    {Number(
                                      product.price || 0
                                    ).toFixed(2)}
                                  </p>

                                </div>
                              )
                            )}
                          </div>

                        </div>
                      )}

                    {/* ================= TRACKING ================= */}

                    <div>

                      <h3 className="mb-7 text-base font-bold text-gray-900">
                        Order Tracking
                      </h3>

                      {isCancelled ? (

                        /* CANCELLED */

                        <div className="rounded-xl border border-red-100 bg-red-50 p-5">
                          <div className="flex items-center gap-4">

                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-red-500 text-white">
                              <XCircle size={21} />
                            </div>

                            <div>
                              <p className="font-bold text-red-600">
                                Order Cancelled
                              </p>

                              {order.tracking?.find(
                                (item) =>
                                  item.status ===
                                  "cancelled"
                              ) && (
                                <p className="mt-1 text-xs text-gray-500">
                                  {formatDateTime(
                                    order.tracking.find(
                                      (item) =>
                                        item.status ===
                                        "cancelled"
                                    ).status_date
                                  )}
                                </p>
                              )}
                            </div>

                          </div>
                        </div>

                      ) : (

                        /* HORIZONTAL TRACKING */

                        <div className="overflow-x-auto pb-3">

                          <div className="min-w-[680px] px-3 sm:px-6">

                            <div className="relative">

                              {/* GRAY LINE */}

                              <div className="absolute left-[12.5%] right-[12.5%] top-[58px] h-1 rounded-full bg-gray-200" />

                              {/* RED LINE */}

                              <div
                                className="absolute left-[12.5%] top-[58px] h-1 rounded-full bg-red-500 transition-all duration-500"
                                style={{
                                  width:
                                    currentIndex <= 0
                                      ? "0%"
                                      : currentIndex === 1
                                      ? "25%"
                                      : currentIndex === 2
                                      ? "50%"
                                      : "75%",
                                }}
                              />

                              {/* STATUSES */}

                              <div className="relative grid grid-cols-4">

                                {statuses.map(
                                  (status, index) => {
                                    const trackingItem =
                                      order.tracking?.find(
                                        (item) =>
                                          item.status ===
                                          status
                                      );

                                    const completed =
                                      index <=
                                      currentIndex;

                                    const isCurrent =
                                      status ===
                                      currentStatus;

                                    return (
                                      <div
                                        key={status}
                                        className="flex flex-col items-center text-center"
                                      >

                                        {/* STATUS NAME */}

                                        <div className="mb-4 h-9">

                                          <p
                                            className={`text-sm font-semibold ${
                                              isCurrent
                                                ? "text-red-600"
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
                                            <span className="mt-1 inline-block rounded-full bg-red-50 px-2 py-0.5 text-[10px] font-medium text-red-500">
                                              Current
                                            </span>
                                          )}

                                        </div>

                                        {/* POINT */}

                                        <div
                                          className={`relative z-10 flex h-12 w-12 items-center justify-center rounded-full border-4 border-white ${
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
                                              size={20}
                                              strokeWidth={3}
                                            />
                                          ) : (
                                            <Circle
                                              size={13}
                                            />
                                          )}
                                        </div>

                                        {/* DATE */}

                                        <div className="mt-4 min-h-[50px]">

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

                                        {/* REMARK */}

                                        {trackingItem?.remark && (
                                          <p className="mt-1 max-w-[140px] text-[11px] text-gray-400">
                                            {
                                              trackingItem.remark
                                            }
                                          </p>
                                        )}

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

                {/* ================= CANCEL ================= */}

                {isPending && !isCancelled && (
                  <div className="border-t border-gray-100 p-4">

                    <button
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
                      <XCircle size={18} />

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