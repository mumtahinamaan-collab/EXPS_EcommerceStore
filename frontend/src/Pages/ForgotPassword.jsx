import { useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link } from "react-router-dom";
import { FaLock, FaPaperPlane } from "react-icons/fa";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim()) {
      toast.error("Please enter your email");
      return;
    }

    try {
      setLoading(true);

      const response = await axios.post(
        "https://exps-ecommercestore.onrender.com/api/password-reset/",
        {
          email: email.trim(),
        }
      );

      console.log("Forgot Password:", response.data);

      toast.success(
        "Password reset link has been sent to your email."
      );

      setEmail("");

    } catch (error) {
      console.log(
        "Forgot Password Error:",
        error.response?.data
      );

      toast.error(
        error.response?.data?.message ||
        error.response?.data?.detail ||
        "Something went wrong."
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
              Forgot Password?
            </h1>

            <p className="mt-2 text-sm text-gray-500">
              Enter your email and we will send you a
              password reset link.
            </p>

          </div>

          {/* FORM */}

          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >

            <div>

              <label
                htmlFor="email"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Email
              </label>

              <input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-red-500 focus:ring-2 focus:ring-red-200"
              />

            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-red-500 px-4 py-3 font-semibold text-white hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-60"
            >

              {loading ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Sending...
                </>
              ) : (
                <>
                  <FaPaperPlane />
                  Send Reset Link
                </>
              )}

            </button>

          </form>

          {/* LOGIN */}

          <p className="mt-6 text-center text-sm text-gray-600">

            Remember your password?{" "}

            <Link
              to="/login"
              className="font-semibold text-red-500 hover:text-red-600 hover:underline"
            >
              Login here
            </Link>

          </p>

        </div>

      </div>

    </div>
  );
}