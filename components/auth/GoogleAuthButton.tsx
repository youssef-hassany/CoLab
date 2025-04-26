"use client";

import { Chrome } from "lucide-react";
import React from "react";

const GoogleAuthButton = () => {
  return (
    <button
      onClick={() => (window.location.href = "/api/auth/google")}
      className="w-full inline-flex justify-center items-center gap-2 py-2 px-4 border border-gray-600 rounded-md shadow-sm bg-gray-700 text-sm font-medium text-gray-300 hover:bg-gray-600 cursor-pointer"
    >
      <Chrome />
      Google
    </button>
  );
};

export default GoogleAuthButton;
