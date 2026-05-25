import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text", placeholder: "demo" },
        password: { label: "Password", type: "password", placeholder: "demo123" }
      },
      async authorize(credentials) {
        if (credentials?.username === "demo" && credentials?.password === "demo123") {
          return { id: "1", name: "Demo User", email: "demo@example.com" }
        }
        return null
      }
    })
  ],
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET || "super-secret-key-for-dev-brain"
})

export { handler as GET, handler as POST }
