import React, { useState } from "react";
import { FaUser, FaLock, FaSignInAlt } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import register from "../assets/register.png";
const Register = () => {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    repeat_password: "",
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const { first_name, last_name, email, password, repeat_password } =
      formData;
    if (password !== repeat_password) {
      toast.error("Password and Confirm Password do not match");
      return;
    }
    try {
      const response = await fetch("https://exps-ecommercestore.onrender.com/api/register/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ first_name, last_name, email, password }),
      });
      const result = await response.json();
      if (response.status === 201) {
        toast.success(result.message || "Registration successful!");
        setFormData({
          first_name: "",
          last_name: "",
          email: "",
          password: "",
          repeat_password: "",
        });
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } else {
        toast.error(
          result.message || "Something went wrong. Please try again.",
        );
      }
    } catch (error) {
      toast.error("Error connecting to server");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-stone-100 px-4 py-10">
      <ToastContainer position="top-center" autoClose={2000} />

      <div className="mx-auto grid min-h-[85vh] w-full max-w-6xl grid-cols-1 overflow-hidden rounded-3xl bg-white shadow-2xl md:grid-cols-2">
        {/* LEFT HALF - REGISTER */}
        <div className="flex items-center justify-center p-6 sm:p-8 md:p-10">
          <div className="w-full max-w-md">
            {/* Heading */}
            <div className="mb-8 text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-500 text-white shadow-md">
                <FaUser className="text-xl" />
              </div>

              <h4 className="text-2xl font-bold text-gray-900">
                Create Your Account
              </h4>

              <p className="mt-1 text-sm text-gray-500">
                Register to start shopping with us
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* First + Last Name */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    First Name
                  </label>

                  <input
                    type="text"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleChange}
                    placeholder="Enter your first name"
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-red-500 focus:ring-2 focus:ring-red-200"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Last Name
                  </label>

                  <input
                    type="text"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleChange}
                    placeholder="Enter your last name"
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-red-500 focus:ring-2 focus:ring-red-200"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Email
                </label>

                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-red-500 focus:ring-2 focus:ring-red-200"
                />
              </div>

              {/* Password */}
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Password
                </label>

                <div className="flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-3 focus-within:border-red-500 focus-within:ring-2 focus-within:ring-red-200">
                  <FaLock className="text-gray-400" />

                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    className="w-full bg-transparent text-sm outline-none"
                  />
                </div>
              </div>

              {/* Repeat Password */}
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Repeat Password
                </label>

                <div className="flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-3 focus-within:border-red-500 focus-within:ring-2 focus-within:ring-red-200">
                  <FaLock className="text-gray-400" />

                  <input
                    type="password"
                    name="repeat_password"
                    value={formData.repeat_password}
                    onChange={handleChange}
                    placeholder="Repeat your password"
                    className="w-full bg-transparent text-sm outline-none"
                  />
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-red-500 py-3 font-semibold text-white transition hover:bg-red-600"
              >
                <FaSignInAlt />
                Submit
              </button>
            </form>

            {/* Login Link */}
            <p className="mt-6 text-center text-sm text-gray-600">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-semibold text-red-500 hover:underline"
              >
                Login here
              </Link>
            </p>
          </div>
        </div>

        {/* RIGHT HALF - IMAGE */}
        <div className="hidden items-center justify-center md:flex">
          <img
            src={register}
            alt="Shopora Shopping"
            className="h-full w-full object-cover"
          />
        </div>
      </div>
    </div>
  );
};

export default Register;
