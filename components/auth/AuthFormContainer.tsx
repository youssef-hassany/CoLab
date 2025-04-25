"use client";

import { useState } from "react";
import { LoginForm } from "./LoginForm";
import { SignupForm } from "./SignupForm";

export function AuthFormsContainer() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="w-full max-w-md relative overflow-hidden">
      <div className="flex gap-4">
        <button
          onClick={() => setIsLogin(true)}
          className={`w-1/2 py-2 text-center rounded-md transition-colors cursor-pointer ${
            isLogin
              ? "bg-emerald-400 text-gray-900"
              : "bg-gray-700 text-gray-300 hover:bg-gray-600"
          }`}
        >
          Login
        </button>
        <button
          onClick={() => setIsLogin(false)}
          className={`w-1/2 py-2 text-center rounded-md transition-colors cursor-pointer ${
            !isLogin
              ? "bg-emerald-400 text-gray-900"
              : "bg-gray-700 text-gray-300 hover:bg-gray-600"
          }`}
        >
          Sign Up
        </button>
      </div>

      <div className="relative mt-3">
        <div
          className={`transition-transform duration-300 ease-in-out flex ${
            isLogin ? "translate-x-0" : "-translate-x-1/2"
          }`}
          style={{ width: "200%" }}
        >
          <div className="w-1/2 inline-block">
            <LoginForm />
          </div>
          <div className="w-1/2 inline-block">
            <SignupForm />
          </div>
        </div>
      </div>
    </div>
  );
}
