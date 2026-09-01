import React from "react";
import { Link } from "react-router-dom";
import { Home, ArrowLeft, Search } from "lucide-react";

const NotFound = () => {
  return (
    <div className="flex min-h-[80vh] items-center justify-center bg-gradient-to-br from-rose-50 via-white to-stone-100 px-4 py-12">
      <div className="w-full max-w-2xl text-center">

        {/* 404 */}
        <div className="relative mb-6">
          <h1 className="text-[120px] font-black leading-none tracking-tight text-red-500 sm:text-[160px]">
            404
          </h1>

          {/* Decorative lines */}
          <div className="absolute left-1/2 top-1/2 h-1 w-24 -translate-x-1/2 rotate-[-8deg] rounded-full bg-red-200 sm:w-32" />
        </div>

        {/* Heading */}
        <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
          Oops! Page Not Found
        </h2>

        <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-gray-500 sm:text-base">
          The page you're looking for doesn't exist or may have been moved.
          Let's get you back to Shopora.
        </p>

        {/* Buttons */}
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">

          <Link
            to="/"
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-red-500 px-6 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-red-600 hover:shadow-lg sm:w-auto"
          >
            <Home size={18} />
            Back to Home
          </Link>

          <Link
            to="/products"
            className="flex w-full items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-6 py-3 text-sm font-semibold text-gray-700 transition hover:border-red-400 hover:bg-red-50 hover:text-red-500 sm:w-auto"
          >
            <Search size={18} />
            Browse Products
          </Link>

        </div>

        {/* Back link */}
        <button
          onClick={() => window.history.back()}
          className="mt-6 inline-flex items-center gap-1 text-sm font-medium text-gray-500 transition hover:text-red-500"
        >
          <ArrowLeft size={16} />
          Go back
        </button>

        {/* Brand */}
        <div className="mt-12">
          <h3 className="font-serif text-xl font-semibold tracking-wide text-red-500">
            SHOPORA
          </h3>

          <div className="mt-1 flex items-center justify-center gap-2">
            <span className="h-px w-5 bg-red-300" />

            <span className="text-[8px] font-medium uppercase tracking-[2px] text-red-400">
              FIND YOUR STYLE
            </span>

            <span className="h-px w-5 bg-red-300" />
          </div>
        </div>

      </div>
    </div>
  );
};

export default NotFound;