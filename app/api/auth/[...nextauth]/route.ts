import NextAuth, { type NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

export const authOptions: NextAuthOptions = {
  providers: [
    // Student provider (S# only, no password)
    CredentialsProvider({
      id: "student-credentials",
      name: "Student",
      credentials: {
        studentId: { label: "Student ID", type: "text", placeholder: "S12345678" },
      },
      async authorize(credentials) {
        if (!credentials?.studentId) {
          return null
        }

        // Normalize student ID (remove spaces, ensure uppercase S)
        const normalizedId = credentials.studentId.trim().toUpperCase()
        if (!normalizedId.startsWith("S") || normalizedId.length !== 9) {
          throw new Error("Invalid Student ID format. Should be S followed by 8 digits.")
        }

        // Check if student exists, create if not
        let student = await prisma.student.findUnique({
          where: { studentId: normalizedId },
        })

        if (!student) {
          // Create a new student record
          student = await prisma.student.create({
            data: {
              studentId: normalizedId,
              name: "Student", // Default name, can be updated later
            },
          })
        }

        return {
          id: student.id,
          studentId: student.studentId,
          name: student.name,
          role: "student",
        }
      },
    }),

    // Admin provider (email + password)
    CredentialsProvider({
      id: "admin-credentials",
      name: "Admin",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        })

        if (!user || !user.passwordHash) {
          throw new Error("Invalid email or password")
        }

        const isPasswordValid = await bcrypt.compare(credentials.password, user.passwordHash)

        if (!isPasswordValid) {
          throw new Error("Invalid email or password")
        }

        return {
          id: user.id,
          email: user.email,
          role: user.role,
        }
      },
    }),
  ],
  pages: {
    signIn: "/auth/signin",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = user.role
        if (user.studentId) {
          token.studentId = user.studentId
        }
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string
        session.user.role = token.role as string
        if (token.studentId) {
          session.user.studentId = token.studentId as string
        }
      }
      return session
    },
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }
