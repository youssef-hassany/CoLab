import { cookies } from "next/headers";
import { prisma } from "@/lib/db";
import { generateJWT } from "@/lib/session";

export async function GET(request: Request) {
  const baseUrl =
    process.env.NODE_ENV === "production"
      ? "https://colab.vercel.app"
      : "http://localhost:3000";

  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get("code");
    const state = searchParams.get("state");
    const error = searchParams.get("error");

    // Check if there was an error or if code is missing
    if (error || !code) {
      return Response.redirect(`${baseUrl}/?error=oauth_error`, 302);
    }

    // Verify state to prevent CSRF
    const storedState = (await cookies()).get("google_auth_state")?.value;
    if (!storedState || storedState !== state) {
      return Response.redirect(`${baseUrl}/?error=invalid_state`, 302);
    }

    // Exchange code for tokens
    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        code,
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        redirect_uri:
          process.env.NODE_ENV === "production"
            ? `https://colab.vercel.app/api/auth/google/callback`
            : `http://localhost:3000/api/auth/google/callback`,
        grant_type: "authorization_code",
      }),
    });

    const tokenData = await tokenResponse.json();

    if (!tokenData.access_token) {
      return Response.redirect(`${baseUrl}/?error=token_error`, 302);
    }

    // Get user profile with the access token
    const userResponse = await fetch(
      "https://www.googleapis.com/oauth2/v2/userinfo",
      {
        headers: {
          Authorization: `Bearer ${tokenData.access_token}`,
        },
      }
    );

    const userData = await userResponse.json();

    if (!userData.email) {
      return Response.redirect(`${baseUrl}/?error=profile_error`, 302);
    }

    // Check if user exists in the database
    let user = await prisma.user.findUnique({
      where: { email: userData.email },
    });

    // If user doesn't exist, create a new one
    if (!user) {
      user = await prisma.user.create({
        data: {
          email: userData.email,
          name: userData.name || userData.email.split("@")[0],
          // Store the profile picture URL
          profilePic: userData.picture || null,
          // Generate a random password since the user won't use it
          passwordHash: Math.random().toString(36).substring(2),
        },
      });
    } else {
      // Update existing user with latest profile picture if they've logged in with Google
      user = await prisma.user.update({
        where: { id: user.id },
        data: {
          // Update the profile picture if it exists
          profilePic: userData.picture || user.profilePic,
        },
      });
    }

    // Generate JWT
    const token = await generateJWT({
      userId: user.id,
      email: user.email,
      username: user.name,
      profilePicture: user.profilePic,
    });

    // Set the JWT in cookies
    (await cookies()).set("colab-token", token, {
      httpOnly: true,
      secure: true,
      maxAge: 60 * 60 * 24 * 30,
      path: "/",
    });

    // Clean up the state cookie
    (await cookies()).delete("google_auth_state");

    return Response.redirect(`${baseUrl}/home`, 302);
  } catch (error) {
    console.error("Google auth callback error:", error);
    return Response.redirect(`${baseUrl}/?error=profile_error`, 302);
  }
}
