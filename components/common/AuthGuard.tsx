"use client";

import { useGetLoggedInUser } from "@/hooks/server/user/useGetLoggedInUser";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";

interface AuthLayoutProps {
  children: React.ReactNode;
}

export const AuthLayout = ({ children }: AuthLayoutProps) => {
  const { data: user, isLoading, error } = useGetLoggedInUser();
  const router = useRouter();
  const pathname = usePathname();
  const [hasHandledInitialRoute, setHasHandledInitialRoute] = useState(false);

  const protectedRoutes = ["/home", "/team", "/profile"];
  const publicRoutes = ["/"];

  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );
  const isPublicRoute = publicRoutes.includes(pathname);

  useEffect(() => {
    if (isLoading) return;

    const isAuthenticated = !!user && !error;

    if (!hasHandledInitialRoute) {
      if (isAuthenticated) {
        // User is logged in - redirect from public routes to home
        if (pathname === "/" || (isPublicRoute && pathname !== "/home")) {
          router.replace("/home");
          setHasHandledInitialRoute(true);
          return;
        }
      } else {
        // User is not logged in - redirect from protected routes to login
        if (isProtectedRoute) {
          router.replace("/");
          setHasHandledInitialRoute(true);
          return;
        }
      }

      // Mark as handled if no redirect was needed
      setHasHandledInitialRoute(true);
    }
  }, [
    user,
    error,
    isLoading,
    pathname,
    isProtectedRoute,
    isPublicRoute,
    router,
    hasHandledInitialRoute,
  ]);

  // Show loading screen during initial authentication check
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-zinc-900">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  // Show loading while handling the initial route
  if (!hasHandledInitialRoute) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-zinc-900">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  return <>{children}</>;
};
