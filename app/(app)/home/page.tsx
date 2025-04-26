"use client";

import { logout } from "@/app/actions/user-actions";
import { cookies } from "next/headers";

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-900">
      <button
        className="m-4 p-4 rounded bg-emerald-500 cursor-pointer"
        onClick={logout}
      >
        Logout
      </button>
    </main>
  );
}
