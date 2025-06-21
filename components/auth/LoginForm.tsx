"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginSchema } from "@/schemas/loginSchema";
import { useLogin } from "@/hooks/server/auth/useLogin";
import Spinner from "../common/Spinner";

export function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const { mutateAsync: loginUser, isPending } = useLogin();

  const onSubmit = async (data: LoginSchema) => {
    try {
      const formData = new FormData();
      formData.append("identifier", data.identifier);
      formData.append("password", data.password);

      await loginUser(formData);
    } catch (error) {
      setError("root", {
        type: "manual",
        message: error instanceof Error ? error.message : "Login failed",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <label
          htmlFor="identifier"
          className="block text-sm font-medium text-gray-300"
        >
          Email or Username
        </label>
        <input
          id="identifier"
          className="mt-1 block w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm bg-gray-700 text-white focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
          placeholder="you@example.com"
          {...register("identifier")}
        />
        {errors.identifier && (
          <p className="mt-1 text-red-400 text-sm">
            {errors.identifier.message}
          </p>
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
          Log in {isPending && <Spinner />}
        </button>
      </div>
    </form>
  );
}
