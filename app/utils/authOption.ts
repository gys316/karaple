import NextAuth, { NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import { SupabaseAdapter } from "@auth/supabase-adapter"
import jwt from "jsonwebtoken"

export const authOptions: NextAuthOptions = {
  debug: false,
  // Configure one or more authentication providers
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? '',
      authorization: {
        params: {
          scope: 'openid email profile https://www.googleapis.com/auth/youtube.readonly',
        }
      }
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
      session.user = {
        ...session.user,
        id: token?.id as string ?? '',
      };

      return session;
    },
    async jwt({ token, account, user, profile }) {
      console.log('profile', profile);
      console.log('account', account);

      // profile, account 는 로그인 직후 1회만 반환됨
      if (account) {
        token.id = user.id;
      }

      return token;
    },
  },
  session: {
    strategy: 'jwt',
  },
};