import NextAuth, { NextAuthOptions, TokenSet } from "next-auth"
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
          access_type: "offline",
          prompt: "consent",
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
    async session({ session, token }) {
      session.user.id = token.id as string;
      session.error = token.error;
      session.accessToken = token.accessToken as string;
      return session;
    },
    async jwt({ token, account, user }) {
      if (account) {
        token.id = user.id;

        if (account.access_token) {
          token.accessToken = account.access_token;
          token.refreshToken = account.refresh_token;
          token.accessTokenExpires = Date.now() + Number(account.expires_in) * 1000;
        }
      }

      // Return previous token if the access token has not expired yet
      if (Date.now() < Number(token.accessTokenExpires)) {
        return token;
      }

      // Access token has expired, try to update it
      return refreshAccessToken(token);
    },
  },
  session: {
    strategy: 'jwt',
  },
};

async function refreshAccessToken(token: any) {
  try {
    const url = `https://oauth2.googleapis.com/token`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: process.env.GOOGLE_CLIENT_ID ?? '',
        client_secret: process.env.GOOGLE_CLIENT_SECRET ?? '',
        refresh_token: token.refreshToken,
        grant_type: 'refresh_token',
      }),
    });

    const refreshedTokens = await response.json();

    if (!response.ok) {
      throw refreshedTokens;
    }

    return {
      ...token,
      accessToken: refreshedTokens.access_token,
      accessTokenExpires: Date.now() + refreshedTokens.expires_in * 1000,
      refreshToken: refreshedTokens.refresh_token ?? token.refreshToken, // Fall back to old refresh token
    };
  } catch (error) {
    console.error('RefreshAccessTokenError', error);

    return {
      ...token,
      error: "RefreshAccessTokenError",
    };
  }
};