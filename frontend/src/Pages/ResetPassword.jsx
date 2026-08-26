import { useState } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaLock } from "react-icons/fa";

export default function ResetPassword() {

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token) {
      toast.error("Invalid or missing reset token.");
      return;
    }

    if (!password || !confirmPassword) {
      toast.error("Please fill all fields.");
      return;
    }

    if (password.length < 8) {
      toast.error(
        "Password must be at least 8 characters."
      );
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    try {

      setLoading(true);

      const response = await axios.post(
        "http://127.0.0.1:8000/api/password-reset/confirm/",
        {
          token: token,
          password: password,
        }
      );

      console.log(
        "Reset Password:",
        response.data
      );

      toast.success(
        "Password reset successfully!"
      );

      setPassword("");
      setConfirmPassword("");

      setTimeout(() => {
        navigate("/login");
      }, 2000);

    } catch (error) {

      console.log(
        "Reset Password Error:",
        error.response?.data
      );

      toast.error(
        error.response?.data?.message ||
        error.response?.data?.detail ||
        "Password reset failed."
      );

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-stone-100 px-4 py-8">

      <ToastContainer
        position="top-center"
        autoClose={2500}
        theme="colored"
      />

      <div className="flex min-h-[calc(100vh-64px)] items-center justify-center">

        <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl">

          {/* ICON */}

          <div className="mb-5 text-center">

            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-500 text-white">

              <FaLock className="text-xl" />

            </div>

            <h1 className="text-3xl font-bold text-gray-900">
              Reset Password
            </h1>

            <p className="mt-2 text-sm text-gray-500">
              Enter your new password below.
            </p>

          </div>

          {/* FORM */}

          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >

            {/* PASSWORD */}

            <div>

              <label className="mb-2 block text-sm font-medium text-gray-700">
                New Password
              </label>

              <input
                type="password"
                placeholder="Enter new password"
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
                required
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-red-500 focus:ring-2 focus:ring-red-200"
              />

            </div>

            {/* CONFIRM PASSWORD */}

            <div>

              <label className="mb-2 block text-sm font-medium text-gray-700">
                Confirm Password
              </label>

              <input
                type="password"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) =>
                  setConfirmPassword(e.target.value)
                }
                required
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-red-500 focus:ring-2 focus:ring-red-200"
              />

            </div>

            {/* BUTTON */}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-red-500 px-4 py-3 font-semibold text-white hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-60"
            >

              {loading
                ? "Resetting..."
                : "Reset Password"}

            </button>

          </form>

          <p className="mt-6 text-center text-sm text-gray-600">

            Remember your password?{" "}

            <Link
              to="/login"
              className="font-semibold text-red-500 hover:underline"
            >
              Login
            </Link>

          </p>

        </div>

      </div>

    </div>
  );
}