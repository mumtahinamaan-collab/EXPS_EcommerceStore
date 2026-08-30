import React from "react";

const Loader = ({ text = "Loading..." }) => {
  return (
    <div className="flex min-h-[300px] w-full items-center justify-center bg-white">
      <div className="flex flex-col items-center justify-center">
        {/* Spinner */}
        <div className="relative h-12 w-12">
          <div className="absolute inset-0 rounded-full border-4 border-red-100"></div>

          <div className="absolute inset-0 animate-spin rounded-full border-4 border-transparent border-t-red-500"></div>
        </div>

        {/* Shopora */}
        <p className="mt-4 font-serif text-lg font-semibold tracking-wide text-red-500">
          SHOPORA
        </p>

        <p className="mt-1 text-xs text-gray-400">{text}</p>
      </div>
    </div>
  );
};

export default Loader;
