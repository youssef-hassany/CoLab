"use client";

import { Github } from "lucide-react";
import React from "react";

const GithubAuthButton = () => {
  return (
    <button
      onClick={() => (window.location.href = "/api/auth/github")}
      className="w-full inline-flex justify-center items-center gap-2 py-2 px-4 border border-gray-600 rounded-md shadow-sm bg-gray-700 text-sm font-medium text-gray-300 hover:bg-gray-600 cursor-pointer"
    >
      <Github />
      GitHub
    </button>
  );
};

export default GithubAuthButton;
