"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signupSchema, type SignupSchema } from "@/schemas/signupSchema";
import { useSignup } from "@/hooks/server/auth/useSignup";
import Spinner from "../common/Spinner";

export function SignupForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<SignupSchema>({
    resolver: zodResolver(signupSchema),
  });

  const { mutateAsync: signupUser, isPending } = useSignup();

  const onSubmit = async (data: SignupSchema) => {
    try {
      const formData = new FormData();
      formData.append("username", data.username);
      formData.append("email", data.email);
      formData.append("password", data.password);

      await signupUser(formData);
    } catch (error) {
      setError("root", {
        type: "manual",
        message: error instanceof Error ? error.message : "Signup failed",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <label
          htmlFor="username"
          className="block text-sm font-medium text-gray-300"
        >
          Username
        </label>
        <input
          type="text"
          id="username"
          className="mt-1 block w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm bg-gray-700 text-white focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
          placeholder="Peter Parker"
          {...register("username")}
        />
        {errors.username && (
          <p className="mt-1 text-red-400 text-sm">{errors.username.message}</p>
        )}
      </div>

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
          className="mt-1 block w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm bg-gray-700 text-white focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
          placeholder="you@example.com"
          {...register("email")}
        />
        {errors.email && (
          <p className="mt-1 text-red-400 text-sm">{errors.email.message}</p>
        )}
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
          className="mt-1 block w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm bg-gray-700 text-white focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
          placeholder="••••••••"
          {...register("password")}
        />
        {errors.password && (
          <p className="mt-1 text-red-400 text-sm">{errors.password.message}</p>
        )}
      </div>

      {errors.root && (
        <p className="text-red-400 text-sm">{errors.root.message}</p>
      )}

      <div>
        <button
          disabled={isPending}
          type="submit"
          className={`w-full flex justify-center gap-3 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-gray-900 bg-emerald-400 hover:bg-emerald-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 focus:ring-offset-gray-800 ${
            isPending && "opacity-70"
          }`}
        >
          Create Account {isPending && <Spinner />}
        </button>
      </div>
    </form>
  );
}
