import { cookies } from "next/headers";

export async function GET() {
  const googleClientId = process.env.GOOGLE_CLIENT_ID;
  const redirectUri =
    process.env.NODE_ENV === "production"
      ? `https://colab.vercel.app/api/auth/google/callback`
      : `http://localhost:3000/api/auth/google/callback`;

  const scope = encodeURIComponent("email profile");

  // Generate a random state value for security
  const state = Math.random().toString(36).substring(2);

  // Store the state in cookies using the cookies() API rather than headers
  (await cookies()).set("google_auth_state", state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 600, // 10 minutes
    path: "/",
    sameSite: "lax",
  });

  const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${googleClientId}&redirect_uri=${encodeURIComponent(
    redirectUri
  )}&response_type=code&scope=${scope}&state=${state}&access_type=offline&prompt=consent`;

  // Create a Response object with redirect
  const response = Response.redirect(googleAuthUrl, 302);

  return response;
}
