import NextAuth from "next-auth";
import { authConfig } from "./auth.config";

export default NextAuth(authConfig).auth;

export const config = {
  // Ekhon theke /admin er niche sob route protected
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};