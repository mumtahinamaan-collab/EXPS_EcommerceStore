import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  MapPin,
  Plus,
  Trash2,
  Edit,
  X,
  Check,
} from "lucide-react";
import { toast } from "react-toastify";

const API = "http://127.0.0.1:8000/api";

const AddressSection = () => {
  const [addresses, setAddresses] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    full_name: "",
    phone: "",
    address_line1: "",
    address_line2: "",
    city: "",
    state: "",
    postal_code: "",
    country: "Pakistan",
    is_default: false,
  });

  const getToken = () => localStorage.getItem("access");

  const fetchAddresses = async () => {
    try {
      const response = await axios.get(
        `${API}/addresses/`,
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );

      setAddresses(response.data);
    } catch (error) {
      console.log("ADDRESS ERROR:", error.response?.data);
      toast.error("Unable to load addresses");
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const resetForm = () => {
    setFormData({
      full_name: "",
      phone: "",
      address_line1: "",
      address_line2: "",
      city: "",
      state: "",
      postal_code: "",
      country: "Pakistan",
      is_default: false,
    });

    setEditingId(null);
    setShowForm(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingId) {
        await axios.put(
          `${API}/addresses/${editingId}/`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${getToken()}`,
            },
          }
        );

        toast.success("Address updated successfully");
      } else {
        await axios.post(
          `${API}/addresses/`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${getToken()}`,
            },
          }
        );

        toast.success("Address added successfully");
      }

      resetForm();
      fetchAddresses();

    } catch (error) {
      console.log("ADDRESS SAVE ERROR:", error.response?.data);

      toast.error(
        error.response?.data?.message ||
          "Unable to save address"
      );
    }
  };

  const handleEdit = (address) => {
    setFormData({
      full_name: address.full_name || "",
      phone: address.phone || "",
      address_line1: address.address_line1 || "",
      address_line2: address.address_line2 || "",
      city: address.city || "",
      state: address.state || "",
      postal_code: address.postal_code || "",
      country: address.country || "Pakistan",
      is_default: address.is_default || false,
    });

    setEditingId(address.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this address?")) {
      return;
    }

    try {
      await axios.delete(
        `${API}/addresses/${id}/`,
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );

      toast.success("Address deleted");
      fetchAddresses();

    } catch (error) {
      console.log("DELETE ADDRESS ERROR:", error.response?.data);
      toast.error("Unable to delete address");
    }
  };

  const handleDefault = async (id) => {
    try {
      await axios.post(
        `${API}/addresses/${id}/default/`,
        {},
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );

      toast.success("Default address updated");
      fetchAddresses();

    } catch (error) {
      console.log(
        "DEFAULT ADDRESS ERROR:",
        error.response?.data
      );

      toast.error("Unable to set default address");
    }
  };

  return (
    <div className="mt-8 rounded-2xl bg-white shadow-lg">

      {/* HEADER */}

      <div className="flex flex-col gap-4 border-b border-gray-100 p-5 sm:flex-row sm:items-center sm:justify-between">

        <div className="flex items-center gap-3">

          <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-red-50 text-red-500">
            <MapPin size={22} />
          </div>

          <div>
            <h2 className="font-bold text-gray-900">
              My Addresses
            </h2>

            <p className="text-sm text-gray-500">
              Manage your delivery addresses
            </p>
          </div>

        </div>

        <button
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
          className="flex items-center justify-center gap-2 rounded-lg bg-red-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-600"
        >
          <Plus size={18} />
          Add Address
        </button>

      </div>

      {/* ADD / EDIT FORM */}

      {showForm && (
        <div className="border-b border-gray-100 bg-gray-50 p-5">

          <div className="mb-5 flex items-center justify-between">

            <h3 className="text-lg font-bold text-gray-900">
              {editingId ? "Edit Address" : "Add New Address"}
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

            <input
              type="text"
              name="full_name"
              value={formData.full_name}
              onChange={handleChange}
              placeholder="Full Name"
              required
              className="rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-red-500 focus:ring-2 focus:ring-red-200"
            />

            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Phone Number"
              required
              className="rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-red-500 focus:ring-2 focus:ring-red-200"
            />

            <input
              type="text"
              name="address_line1"
              value={formData.address_line1}
              onChange={handleChange}
              placeholder="Address Line 1"
              required
              className="rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-red-500 focus:ring-2 focus:ring-red-200 sm:col-span-2"
            />

            <input
              type="text"
              name="address_line2"
              value={formData.address_line2}
              onChange={handleChange}
              placeholder="Address Line 2 (Optional)"
              className="rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-red-500 focus:ring-2 focus:ring-red-200 sm:col-span-2"
            />

            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              placeholder="City"
              required
              className="rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-red-500 focus:ring-2 focus:ring-red-200"
            />

            <input
              type="text"
              name="state"
              value={formData.state}
              onChange={handleChange}
              placeholder="State / Province"
              className="rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-red-500 focus:ring-2 focus:ring-red-200"
            />

            <input
              type="text"
              name="postal_code"
              value={formData.postal_code}
              onChange={handleChange}
              placeholder="Postal Code"
              className="rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-red-500 focus:ring-2 focus:ring-red-200"
            />

            <input
              type="text"
              name="country"
              value={formData.country}
              onChange={handleChange}
              placeholder="Country"
              required
              className="rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-red-500 focus:ring-2 focus:ring-red-200"
            />

            <label className="flex items-center gap-2 text-sm text-gray-600 sm:col-span-2">
              <input
                type="checkbox"
                name="is_default"
                checked={formData.is_default}
                onChange={handleChange}
                className="h-4 w-4 accent-red-500"
              />

              Make this my default address
            </label>

            <div className="flex gap-3 sm:col-span-2">

              <button
                type="submit"
                className="rounded-lg bg-red-500 px-6 py-3 text-sm font-semibold text-white hover:bg-red-600"
              >
                {editingId ? "Update Address" : "Save Address"}
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

      {/* ADDRESSES */}

      <div className="p-5">

        {addresses.length === 0 ? (

          <div className="py-10 text-center">

            <MapPin
              size={40}
              className="mx-auto mb-3 text-gray-300"
            />

            <p className="font-medium text-gray-600">
              No addresses added yet
            </p>

            <p className="mt-1 text-sm text-gray-400">
              Add an address for faster checkout
            </p>

          </div>

        ) : (

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

            {addresses.map((address) => (

              <div
                key={address.id}
                className={`rounded-xl border p-5 ${
                  address.is_default
                    ? "border-red-500 bg-rose-50"
                    : "border-gray-200"
                }`}
              >

                <div className="flex items-start justify-between">

                  <div>

                    <div className="flex items-center gap-2">

                      <h3 className="font-bold text-gray-900">
                        {address.full_name}
                      </h3>

                      {address.is_default && (
                        <span className="rounded-full bg-red-500 px-2 py-1 text-[10px] font-bold text-white">
                          DEFAULT
                        </span>
                      )}

                    </div>

                    <p className="mt-1 text-sm text-gray-500">
                      {address.phone}
                    </p>

                  </div>

                  <MapPin
                    size={20}
                    className="text-red-500"
                  />

                </div>

                <div className="mt-4 text-sm leading-6 text-gray-600">

                  <p>{address.address_line1}</p>

                  {address.address_line2 && (
                    <p>{address.address_line2}</p>
                  )}

                  <p>
                    {address.city}
                    {address.state
                      ? `, ${address.state}`
                      : ""}
                  </p>

                  {address.postal_code && (
                    <p>{address.postal_code}</p>
                  )}

                  <p>{address.country}</p>

                </div>

                {/* ACTIONS */}

                <div className="mt-5 flex flex-wrap gap-2">

                  {!address.is_default && (
                    <button
                      onClick={() =>
                        handleDefault(address.id)
                      }
                      className="flex items-center gap-1 rounded-lg border border-green-500 px-3 py-2 text-xs font-semibold text-green-600 hover:bg-green-500 hover:text-white"
                    >
                      <Check size={15} />
                      Set Default
                    </button>
                  )}

                  <button
                    onClick={() => handleEdit(address)}
                    className="flex items-center gap-1 rounded-lg border border-gray-300 px-3 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100"
                  >
                    <Edit size={15} />
                    Edit
                  </button>

                  <button
                    onClick={() =>
                      handleDelete(address.id)
                    }
                    className="flex items-center gap-1 rounded-lg border border-red-300 px-3 py-2 text-xs font-semibold text-red-500 hover:bg-red-500 hover:text-white"
                  >
                    <Trash2 size={15} />
                    Delete
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

export default AddressSection;