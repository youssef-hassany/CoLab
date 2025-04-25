import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const publicPaths = ["/forgot-password", "/"];

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("colab-token")?.value;
  const path = request.nextUrl.pathname;

  if (publicPaths.includes(path)) {
    return NextResponse.next();
  }

  if (!token) {
    return NextResponse.redirect(new URL("/", request.url));
  }

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
