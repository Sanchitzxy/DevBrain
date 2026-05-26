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
        // Since the actual PostgreSQL database runs locally in Docker, 
        // we'll accept any valid-looking credentials for the live Next.js demo to allow sign-ups and sign-ins to work seamlessly.
        if (credentials?.username && credentials?.password) {
          return { 
            id: Math.random().toString(), 
            name: credentials.username, 
            email: `${credentials.username}@example.com` 
          }
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
