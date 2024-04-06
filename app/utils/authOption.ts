import NextAuth, { NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import { SupabaseAdapter } from "@auth/supabase-adapter"
import jwt from "jsonwebtoken"

export const authOptions: NextAuthOptions = {
  debug: true,
  // Configure one or more authentication providers
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? '',
    }),
  ],
  // @ts-expect-error
  adapter: SupabaseAdapter({
    url: process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
    secret: process.env.SUPABASE_SERVICE_ROLE_KEY ?? "",
  }),
  callbacks: {
    async session({ session, user, newSession, token, trigger }) {
      // console.log('session', session);
      // console.log('user', user);
      // console.log('newSession', newSession);
      // console.log('token', token);
      // console.log('trigger', trigger);
      const userObj = user ?? session.user;
      const signingSecret = process.env.SUPABASE_JWT_SECRET;
      if (signingSecret) {
        const payload = {
          aud: "authenticated",
          exp: Math.floor(new Date(session.expires).getTime() / 1000),
          sub: userObj?.id ?? userObj.name,
          email: userObj.email,
          role: "authenticated",
        };
        session.supabaseAccessToken = jwt.sign(payload, signingSecret);
        session.user = {
          ...session.user,
          id: token.sub,
        }
      }

      return session;
    },
  }
};