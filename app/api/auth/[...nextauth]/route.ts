import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Email",
      credentials: {
        email: { label: "البريد الإلكتروني", type: "email", placeholder: "user@example.com" },
        password: { label: "كلمة المرور", type: "password" }
      },
      async authorize(credentials) {
        if (credentials?.email) {
          return { id: "1", name: "مستخدم EgyCar", email: credentials.email };
        }
        return null;
      }
    })
  ],
  secret: process.env.NEXTAUTH_SECRET || "egycar_secret_key_123_very_secure",
  trustHost: true,
});

export { handler as GET, handler as POST };