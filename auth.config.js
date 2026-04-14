export const authConfig = {
  pages: {
    signIn: "/login", // Custom login page path
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isRegisterPage = nextUrl.pathname === "/dashboard/register" || nextUrl.pathname === "/register";
      const isOnDashboard = nextUrl.pathname.startsWith("/dashboard"); // Protect admin routes

      if (isOnDashboard && !isRegisterPage) {
        if (isLoggedIn) return true;
        return false; // Redirect unauthenticated users to login
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role; // Database theke role token-e pass kora
      }
      return token;
    },
    async session({ session, token }) {
      if (token?.role) {
        session.user.role = token.role;
      }
      return session;
    },
  },
  providers: [], // Providers amra auth.js file-e add korbo
};