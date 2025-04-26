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
    const storedState = (await cookies()).get("github_auth_state")?.value;
    if (!storedState || storedState !== state) {
      return Response.redirect(`${baseUrl}/?error=invalid_state`, 302);
    }

    // Exchange code for token
    const tokenResponse = await fetch(
      "https://github.com/login/oauth/access_token",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          client_id: process.env.GITHUB_CLIENT_ID,
          client_secret: process.env.GITHUB_CLIENT_SECRET,
          code,
          redirect_uri:
            process.env.NODE_ENV === "production"
              ? `https://colab.vercel.app/api/auth/github/callback`
              : `http://localhost:3000/api/auth/github/callback`,
          state,
        }),
      }
    );

    const tokenData = await tokenResponse.json();

    if (!tokenData.access_token) {
      return Response.redirect(`${baseUrl}/?error=token_error`, 302);
    }

    // Get user data from GitHub API
    const userResponse = await fetch("https://api.github.com/user", {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
      },
    });

    const userData = await userResponse.json();

    // Get user's email (GitHub may not provide email in user data if it's private)
    let userEmail = userData.email;

    // If email is not available, fetch from emails endpoint
    if (!userEmail) {
      const emailsResponse = await fetch("https://api.github.com/user/emails", {
        headers: {
          Authorization: `Bearer ${tokenData.access_token}`,
        },
      });

      const emails = await emailsResponse.json();
      // Find the primary email
      const primaryEmail = emails.find((email: any) => email.primary === true);
      userEmail = primaryEmail ? primaryEmail.email : emails[0]?.email;
    }

    if (!userEmail) {
      return Response.redirect(`${baseUrl}/?error=email_required`, 302);
    }

    // Check if user exists in the database
    let user = await prisma.user.findUnique({
      where: { email: userEmail },
    });

    // If user doesn't exist, create a new one
    if (!user) {
      user = await prisma.user.create({
        data: {
          email: userEmail,
          name: userData.name || userData.login,
          // Store the profile picture URL
          profilePic: userData.avatar_url || null,
          // Generate a random password since the user won't use it
          passwordHash: Math.random().toString(36).substring(2),
        },
      });
    } else {
      // Update existing user with latest GitHub info
      user = await prisma.user.update({
        where: { id: user.id },
        data: {
          // Update the profile picture if it exists
          profilePic: userData.avatar_url || user.profilePic,
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
    (await cookies()).delete("github_auth_state");

    return Response.redirect(`${baseUrl}/dashboard`, 302);
  } catch (error) {
    console.error("GitHub auth callback error:", error);
    return Response.redirect(`${baseUrl}/?error=server_error`, 302);
  }
}
