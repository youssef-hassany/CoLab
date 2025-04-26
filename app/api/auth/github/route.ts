import { cookies } from "next/headers";

export async function GET() {
  const githubClientId = process.env.GITHUB_CLIENT_ID;
  const redirectUri =
    process.env.NODE_ENV === "production"
      ? `https://colab.vercel.app/api/auth/github/callback`
      : `http://localhost:3000/api/auth/github/callback`;

  // Generate a random state value for security
  const state = Math.random().toString(36).substring(2);

  // Store the state in cookies
  (await cookies()).set("github_auth_state", state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 600, // 10 minutes
    path: "/",
    sameSite: "lax",
  });

  // Build the GitHub authorization URL
  const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${githubClientId}&redirect_uri=${encodeURIComponent(
    redirectUri
  )}&state=${state}&scope=user:email`;

  return Response.redirect(githubAuthUrl, 302);
}
