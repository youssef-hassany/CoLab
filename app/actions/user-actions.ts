"use server";

import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { generateJWT } from "@/lib/session";
import { prisma } from "@/lib/db";

/* ---------------- INTERFACES ---------------- */
interface SignupData {
  email: string;
  password: string;
  name: string;
}

interface LoginData {
  email: string;
  password: string;
}

interface UserWithoutPassword {
  id: string;
  email: string;
  name: string;
  createdAt: Date;
}

/* ---------------- SIGNUP ---------------- */
export async function signup(prevState: any, formData: FormData) {
  try {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const username = formData.get("name") as string; // Matches form's `name` field

    // Check if user already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { name: username }],
      },
    });

    if (existingUser) {
      if (existingUser.email === email) {
        return { error: "Email already in use" };
      }
      if (existingUser.name === username) {
        return { error: "Username already taken" };
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        email,
        name: username,
        passwordHash: hashedPassword,
      },
    });
    // Generate JWT
    const token = await generateJWT({
      userId: newUser.id,
      email: newUser.email,
      username: newUser.name,
    });

    // Store JWT in cookies
    (await cookies()).set("colab-token", token, {
      httpOnly: true,
      secure: true,
      maxAge: 60 * 60 * 24 * 30,
      path: "/",
    });

    const userData: UserWithoutPassword = {
      id: newUser.id,
      email: newUser.email,
      name: newUser.name,
      createdAt: newUser.createdAt,
    };

    return { success: true, user: userData };
  } catch (error) {
    console.error("Signup error:", error);
    return { error: "Failed to create account" };
  }
}

/* ---------------- LOGIN ---------------- */
export async function login(prevState: any, formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  try {
    const user = await prisma.user.findUnique({
      where: { email: email },
    });

    if (!user) {
      return { error: "Invalid email or password" };
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

    if (!isPasswordValid) {
      return { error: "Invalid email or password" };
    }

    const token = await generateJWT({
      userId: user.id,
      email: user.email,
      username: user.name,
    });

    (await cookies()).set("colab-token", token, {
      httpOnly: true,
      secure: true,
      maxAge: 60 * 60 * 24 * 30,
      path: "/",
    });

    return { success: true, message: "User logged in successfully" };
  } catch (error) {
    console.error("Login error:", error);
    return { error: "Failed to login" };
  }
}

/* ---------------- LOGOUT ---------------- */
export async function logout() {
  (await cookies()).delete("colab-token");
  redirect("/");
}
