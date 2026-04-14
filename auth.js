import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { authConfig } from "./auth.config";
import { connectDB } from "@/db/dbConfig";
import Admin from "@/models/Admin";
import bcrypt from "bcryptjs";

export const { auth, signIn, signOut, handlers } = NextAuth({
  ...authConfig,
  secret: process.env.AUTH_SECRET,
  providers: [
    Credentials({
      async authorize(credentials) {
        try {
          await connectDB();

          // ১. ইমেইল থেকে অতিরিক্ত স্পেস বাদ দেওয়া এবং ছোট হাতের করা
          const email = credentials.email.toLowerCase().trim();
          const password = credentials.password;

          console.log("Attempting login for:", email);

          // ২. ডাটাবেসে ইউজার খোঁজা
          const allUsers = await Admin.find({}).lean();
          console.log(`DEBUG: Total users found in 'admin' collection: ${allUsers.length}`);
          if (allUsers.length > 0) {
            console.log("DEBUG: First user email looks like:", allUsers[0].email);
          }

          const user = await Admin.findOne({ email }).lean();

          if (!user) {
            console.error("DEBUG: User not found in database for email:", email);
            return null;
          }

          // ৩. পাসওয়ার্ড চেক করা
          const isPasswordCorrect = await bcrypt.compare(password, user.password);

          if (!isPasswordCorrect) {
            console.error("DEBUG: Password mismatch for:", email);
            return null;
          }

          console.log("DEBUG: Login successful for:", email);

          // ৪. ডাটা রিটার্ন (মঙ্গোডিবি এর _id কে id হিসেবে পাস করা)
          return {
            id: user._id.toString(),
            email: user.email,
            role: user.role
          };
        } catch (error) {
          console.error("CRITICAL AUTH ERROR:", error);
          throw new Error("Internal Server Error occurred during login.");
        }
      },
    }),
  ],
});