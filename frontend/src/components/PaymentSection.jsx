import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  CreditCard,
  Plus,
  Trash2,
  X,
  Check,
} from "lucide-react";
import { toast } from "react-toastify";

const API = "http://127.0.0.1:8000/api";

const PaymentSection = () => {
  const [cards, setCards] = useState([]);
  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState({
    card_holder: "",
    last4: "",
    brand: "Visa",
    expiry_month: "",
    expiry_year: "",
  });

  const getToken = () => localStorage.getItem("access");

  const fetchCards = async () => {
    try {
      const response = await axios.get(
        `${API}/cards/`,
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );

      setCards(response.data);
    } catch (error) {
      console.log(
        "CARDS ERROR:",
        error.response?.data
      );

      toast.error("Unable to load payment methods");
    }
  };

  useEffect(() => {
    fetchCards();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const resetForm = () => {
    setFormData({
      card_holder: "",
      last4: "",
      brand: "Visa",
      expiry_month: "",
      expiry_year: "",
    });

    setShowForm(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.last4.length !== 4) {
      toast.error("Enter the last 4 digits of your card");
      return;
    }

    try {
      await axios.post(
        `${API}/cards/`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );

      toast.success("Payment method added successfully");

      resetForm();
      fetchCards();

    } catch (error) {
      console.log(
        "ADD CARD ERROR:",
        error.response?.data
      );

      toast.error(
        error.response?.data?.message ||
          "Unable to add payment method"
      );
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Remove this card?")) {
      return;
    }

    try {
      await axios.delete(
        `${API}/cards/${id}/`,
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );

      toast.success("Card removed successfully");

      fetchCards();

    } catch (error) {
      console.log(
        "DELETE CARD ERROR:",
        error.response?.data
      );

      toast.error("Unable to remove card");
    }
  };

  const handleDefault = async (id) => {
    try {
      await axios.post(
        `${API}/cards/${id}/default/`,
        {},
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );

      toast.success("Default payment method updated");

      fetchCards();

    } catch (error) {
      console.log(
        "DEFAULT CARD ERROR:",
        error.response?.data
      );

      toast.error(
        "Unable to set default payment method"
      );
    }
  };

  return (
    <div className="mt-8 rounded-2xl bg-white shadow-lg">

      {/* HEADER */}

      <div className="flex flex-col gap-4 border-b border-gray-100 p-5 sm:flex-row sm:items-center sm:justify-between">

        <div className="flex items-center gap-3">

          <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-red-50 text-red-500">
            <CreditCard size={22} />
          </div>

          <div>
            <h2 className="font-bold text-gray-900">
              Payment Methods
            </h2>

            <p className="text-sm text-gray-500">
              Manage your saved cards
            </p>
          </div>

        </div>

        <button
          onClick={() => setShowForm(true)}
          className="flex items-center justify-center gap-2 rounded-lg bg-red-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-600"
        >
          <Plus size={18} />
          Add Card
        </button>

      </div>

      {/* ADD CARD FORM */}

      {showForm && (
        <div className="border-b border-gray-100 bg-gray-50 p-5">

          <div className="mb-5 flex items-center justify-between">

            <h3 className="text-lg font-bold text-gray-900">
              Add Payment Method
            </h3>

            <button
              onClick={resetForm}
              className="text-gray-500 hover:text-red-500"
            >
              <X size={20} />
            </button>

          </div>

          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 gap-4 sm:grid-cols-2"
          >

            {/* Card Holder */}

            <div className="sm:col-span-2">

              <label className="mb-1 block text-sm font-medium text-gray-700">
                Card Holder Name
              </label>

              <input
                type="text"
                name="card_holder"
                value={formData.card_holder}
                onChange={handleChange}
                placeholder="Name on card"
                required
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-red-500 focus:ring-2 focus:ring-red-200"
              />

            </div>

            {/* Last 4 */}

            <div>

              <label className="mb-1 block text-sm font-medium text-gray-700">
                Last 4 Digits
              </label>

              <input
                type="text"
                name="last4"
                value={formData.last4}
                onChange={(e) => {
                  const value = e.target.value
                    .replace(/\D/g, "")
                    .slice(0, 4);

                  setFormData((prev) => ({
                    ...prev,
                    last4: value,
                  }));
                }}
                placeholder="1234"
                maxLength={4}
                required
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-red-500 focus:ring-2 focus:ring-red-200"
              />

            </div>

            {/* Brand */}

            <div>

              <label className="mb-1 block text-sm font-medium text-gray-700">
                Card Brand
              </label>

              <select
                name="brand"
                value={formData.brand}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm outline-none focus:border-red-500 focus:ring-2 focus:ring-red-200"
              >
                <option value="Visa">
                  Visa
                </option>

                <option value="Mastercard">
                  Mastercard
                </option>

                <option value="PayPal">
                  PayPal
                </option>

                <option value="Other">
                  Other
                </option>
              </select>

            </div>

            {/* Expiry Month */}

            <div>

              <label className="mb-1 block text-sm font-medium text-gray-700">
                Expiry Month
              </label>

              <select
                name="expiry_month"
                value={formData.expiry_month}
                onChange={handleChange}
                required
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm outline-none focus:border-red-500 focus:ring-2 focus:ring-red-200"
              >

                <option value="">
                  Month
                </option>

                {Array.from(
                  { length: 12 },
                  (_, index) => {
                    const month = String(
                      index + 1
                    ).padStart(2, "0");

                    return (
                      <option
                        key={month}
                        value={month}
                      >
                        {month}
                      </option>
                    );
                  }
                )}

              </select>

            </div>

            {/* Expiry Year */}

            <div>

              <label className="mb-1 block text-sm font-medium text-gray-700">
                Expiry Year
              </label>

              <select
                name="expiry_year"
                value={formData.expiry_year}
                onChange={handleChange}
                required
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm outline-none focus:border-red-500 focus:ring-2 focus:ring-red-200"
              >

                <option value="">
                  Year
                </option>

                {Array.from(
                  { length: 10 },
                  (_, index) => {
                    const year =
                      new Date().getFullYear() +
                      index;

                    return (
                      <option
                        key={year}
                        value={year}
                      >
                        {year}
                      </option>
                    );
                  }
                )}

              </select>

            </div>

            {/* Buttons */}

            <div className="flex gap-3 sm:col-span-2">

              <button
                type="submit"
                className="rounded-lg bg-red-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-red-600"
              >
                Save Card
              </button>

              <button
                type="button"
                onClick={resetForm}
                className="rounded-lg border border-gray-300 px-6 py-3 text-sm font-semibold text-gray-600 hover:bg-gray-100"
              >
                Cancel
              </button>

            </div>

          </form>

        </div>
      )}

      {/* CARDS */}

      <div className="p-5">

        {cards.length === 0 ? (

          <div className="py-10 text-center">

            <CreditCard
              size={40}
              className="mx-auto mb-3 text-gray-300"
            />

            <p className="font-medium text-gray-600">
              No payment methods added
            </p>

            <p className="mt-1 text-sm text-gray-400">
              Add a card for faster checkout
            </p>

          </div>

        ) : (

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

            {cards.map((card) => (

              <div
                key={card.id}
                className={`rounded-xl border p-5 ${
                  card.is_default
                    ? "border-red-500 bg-rose-50"
                    : "border-gray-200"
                }`}
              >

                {/* CARD TOP */}

                <div className="flex items-start justify-between">

                  <div className="flex items-center gap-3">

                    <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-gray-900 text-white">
                      <CreditCard size={22} />
                    </div>

                    <div>

                      <h3 className="font-bold text-gray-900">
                        {card.brand || "Card"}
                      </h3>

                      <p className="text-sm text-gray-500">
                        •••• •••• •••• {card.last4}
                      </p>

                    </div>

                  </div>

                  {card.is_default && (
                    <span className="rounded-full bg-red-500 px-2 py-1 text-[10px] font-bold text-white">
                      DEFAULT
                    </span>
                  )}

                </div>

                {/* CARD DETAILS */}

                <div className="mt-5">

                  <p className="text-sm font-medium text-gray-700">
                    {card.card_holder}
                  </p>

                  <p className="mt-1 text-xs text-gray-500">
                    Expires {card.expiry_month}/
                    {card.expiry_year}
                  </p>

                </div>

                {/* ACTIONS */}

                <div className="mt-5 flex flex-wrap gap-2">

                  {!card.is_default && (
                    <button
                      onClick={() =>
                        handleDefault(card.id)
                      }
                      className="flex items-center gap-1 rounded-lg border border-green-500 px-3 py-2 text-xs font-semibold text-green-600 transition hover:bg-green-500 hover:text-white"
                    >
                      <Check size={15} />
                      Set Default
                    </button>
                  )}

                  <button
                    onClick={() =>
                      handleDelete(card.id)
                    }
                    className="flex items-center gap-1 rounded-lg border border-red-300 px-3 py-2 text-xs font-semibold text-red-500 transition hover:bg-red-500 hover:text-white"
                  >
                    <Trash2 size={15} />
                    Remove
                  </button>

                </div>

              </div>

            ))}

          </div>

        )}

      </div>

    </div>
  );
};

export default PaymentSection;