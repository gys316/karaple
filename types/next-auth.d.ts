import NextAuth, { DefaultSession } from "next-auth"

declare module "next-auth" {
  // Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
  interface Session {
    error?: "RefreshAccessTokenError",
    accessToken?: string,
    // A JWT which can be used as Authorization header with supabase-js for RLS.
    supabaseAccessToken?: string
    user: {
      id: string | undefined,
    } & DefaultSession["user"]
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    access_token: string
    expires_at: number
    refresh_token: string
    error?: "RefreshAccessTokenError"
  }
}