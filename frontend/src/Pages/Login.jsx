import React, { useState } from "react";
import { FaUser, FaLock, FaSignInAlt } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import loginImage from "../assets/register.jpg";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import API_BASE_URL from "../config/api";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
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
    const email = formData.email.trim().toLowerCase();
    const password = formData.password;
    if (!email || !password) {
      toast.error("Email and password are required");
      return;
    }
    try {
      const response = await fetch(`${API_BASE_URL}/login/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      let result = {};

      try {
        result = await response.json();
      } catch {
        result = {};
      }
      if (response.ok) {
        toast.success(result.message || "Login successful!");
        localStorage.setItem("userId", result.userId);
        localStorage.setItem("userName", result.userName);
        localStorage.setItem("email", email);
        localStorage.setItem("accessToken", result.access);
        localStorage.setItem("refreshToken", result.refresh);
        setFormData({
          email: "",
          password: "",
        });
      window.dispatchEvent(new Event("authChanged"));
        setTimeout(() => {
          navigate("/");
        }, 500);
      } else {
        toast.error(result.message || "Invalid email or password");
      }
    } catch (error) {
      toast.error("Error connecting to server");
      console.log("LOGIN ERROR:", error);
    } finally {
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-stone-100 px-4 py-10">
      <ToastContainer position="top-center" autoClose={2000} />
      <div className="mx-auto grid min-h-[85vh] w-full max-w-6xl grid-cols-1 overflow-hidden rounded-3xl bg-white shadow-2xl md:grid-cols-2">
        {/* LEFT HALF - LOGIN FORM */}
        <div className="flex items-center justify-center p-6 sm:p-8 md:p-10">
          <div className="w-full max-w-md">
            {/* Heading */}
            <div className="mb-8 text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-500 text-white shadow-md">
                <FaUser className="text-xl" />
              </div>

              <h1 className="text-2xl font-bold text-gray-900">Welcome Back</h1>

              <p className="mt-1 text-sm text-gray-500">
                Login to continue shopping with us
              </p>
            </div>

            {/* LOGIN FORM */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email */}
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Email
                </label>

                <div className="flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-3 transition focus-within:border-red-500 focus-within:ring-2 focus-within:ring-red-200">
                  <FaUser className="text-gray-400" />

                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    className="w-full bg-transparent text-sm outline-none"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Password
                </label>

                <div className="flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-3 transition focus-within:border-red-500 focus-within:ring-2 focus-within:ring-red-200">
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

              {/* Forgot Password */}
              <div className="flex justify-end">
                <Link
                  to="/forgot-password"
                  className="text-sm font-medium text-red-500 hover:underline"
                >
                  Forgot Password?
                </Link>
              </div>

              {/* Login Button */}
              <button
                type="submit"
                className="flex w-full items-center cursor-pointer justify-center gap-2 rounded-lg bg-red-500 py-3 font-semibold text-white transition hover:bg-red-600"
              >
                <FaSignInAlt />
                Login
              </button>
            </form>

            {/* Register Link */}
            <p className="mt-6 text-center text-sm text-gray-600">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="font-semibold text-red-500 hover:underline"
              >
                Register here
              </Link>
            </p>
          </div>
        </div>

        {/* RIGHT HALF - IMAGE */}
        <div className="hidden md:flex items-center justify-center bg-white">
          <img
            src={loginImage}
            alt="Shopora Shopping"
            className="h-full w-full object-cover"
          />
        </div>
      </div>
    </div>
  );
};

export default Login;
