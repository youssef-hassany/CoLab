"use client";

import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";

const Providers = ({ children }: { children: React.ReactNode }) => {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <Toaster
        theme="dark"
        richColors
        closeButton
        toastOptions={{
          style: {
            background: "oklch(0.205 0 0)",
            color: "oklch(0.985 0 0)",
            border: "1px solid oklch(1 0 0 / 10%)",
          },
          className:
            "dark:bg-zinc-800 dark:text-white dark:border-zinc-700 [&>div]:text-green-500 [&>svg]:text-green-500",
        }}
      />
      {children}
    </QueryClientProvider>
  );
};

export default Providers;
