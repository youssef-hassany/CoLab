"use client";

import { login } from "@/app/actions/user-actions";
import { useActionState } from "react";
import SubmitButton from "../common/SubmitButton";

export function LoginForm() {
  const [state, formAction] = useActionState(login, null);

  return (
    <form action={formAction} className="space-y-6">
      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-300"
        >
          Email
        </label>
        <input
          type="email"
          id="email"
          name="email"
          className="mt-1 block w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm bg-gray-700 text-white focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
          placeholder="you@example.com"
          required
        />
      </div>

      <div>
        <label
          htmlFor="password"
          className="block text-sm font-medium text-gray-300"
        >
          Password
        </label>
        <input
          type="password"
          id="password"
          name="password"
          className="mt-1 block w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm bg-gray-700 text-white focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
          placeholder="••••••••"
          required
        />
      </div>

      {state?.error && <p className="text-red-400 text-sm">{state.error}</p>}

      <div>
        <SubmitButton>Sign in</SubmitButton>
      </div>
    </form>
  );
}
