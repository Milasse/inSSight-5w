import "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      email?: string | null
      name?: string | null
      image?: string | null
      role: string
      studentId?: string
    }
  }

  interface User {
    id: string
    email?: string | null
    name?: string | null
    image?: string | null
    role: string
    studentId?: string
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
    role: string
    studentId?: string
  }
}
