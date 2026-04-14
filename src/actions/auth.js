"use server";

import { signIn, signOut } from "../../auth";
import { AuthError } from "next-auth";
import { z } from "zod";
import bcrypt from "bcryptjs";
import Admin from "@/models/Admin"; // Apnar Admin model path
import { connectDB } from "@/db/dbConfig";

import sanitize from "mongo-sanitize";

// Registration Validation Schema
const RegisterSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email." }),
  password: z.string().min(8, { message: "Password must be at least 8 characters long." }),
});

// --- ADMIN REGISTER ACTION ---
export async function handleRegister(prevState, formData) {
  try {
    const rawData = Object.fromEntries(formData.entries());
    const sanitizedData = sanitize(rawData);

    const validatedFields = RegisterSchema.safeParse(sanitizedData);

    if (!validatedFields.success) {
      return {
        error: validatedFields.error.flatten().fieldErrors,
        message: "Validation Error",
      };
    }

    const { email, password } = validatedFields.data;
    const normalizedEmail = email.toLowerCase().trim();

    await connectDB();

    // Check existing user
    const existingUser = await Admin.findOne({ email: normalizedEmail });
    if (existingUser) {
      return { message: "User already exists." };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // LOGIC: Check if this is the first user (Express logic maintained)
    const userCount = await Admin.countDocuments();
    const role = userCount === 0 ? "superAdmin" : "admin";

    await Admin.create({
      email: normalizedEmail,
      password: hashedPassword,
      role,
    });

    return { success: true, message: "Admin registered successfully!" };
  } catch (error) {
    console.error("Registration error:", error);
    return { message: "Failed to create admin." };
  }
}

export async function handleLogin(prevState, formData) {
  const email = sanitize(formData.get("email"));
  const password = sanitize(formData.get("password"));

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: "/dashboard",
    });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return "Invalid email or password.";
        default:
          return "Something went wrong.";
      }
    }

    throw error;
  }
}

export async function logout() {
  await signOut({ redirectTo: "/login" });
}