import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const publicPaths = ["/forgot-password", "/"];

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("colab-token")?.value;
  const path = request.nextUrl.pathname;

  // If the path is root ("/") and we have a valid token, redirect to /home
  if (path === "/" && token) {
    try {
      const JWT_SECRET = process.env.JWT_SECRET as string;
      const secretKey = new TextEncoder().encode(JWT_SECRET);

      await jwtVerify(token, secretKey);

      // If token is valid, redirect to home
      return NextResponse.redirect(new URL("/home", request.url));
    } catch (error) {
      // If token is invalid, clear it and continue to the regular flow
      request.cookies.delete("colab-token");
    }
  }

  // Handle other public paths
  if (publicPaths.includes(path)) {
    return NextResponse.next();
  }

  // Check if token exists for protected routes
  if (!token) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Verify token for protected routes
  try {
    const JWT_SECRET = process.env.JWT_SECRET as string;
    const secretKey = new TextEncoder().encode(JWT_SECRET);

    await jwtVerify(token, secretKey);

    return NextResponse.next();
  } catch (error) {
    request.cookies.delete("colab-token");
    return NextResponse.redirect(new URL("/", request.url));
  }
}

export const config = {
  matcher: ["/forgot-password", "/home", "/profile", "/team/:path*", "/"],
};
