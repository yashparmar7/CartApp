import React from "react";
import "../index.css";

const Loader = () => {
  return (
    <div className="min-h-[100vh] flex flex-col items-center justify-center bg-gray-50">
      <div className="loader mb-10"></div>
      <h1 className="text-2xl font-semibold text-gray-900 mb-2">Loading...</h1>
      <p className="text-gray-600 max-w-md mx-auto">Please wait a moment.</p>
    </div>
  );
};

export default Loader;
