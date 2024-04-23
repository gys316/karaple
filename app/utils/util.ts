import { SupabaseClient, createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "./authOption";

export async function getSession(req: NextRequest, res: NextResponse) {
  try {
    const session = await getServerSession(
      req as unknown as NextApiRequest,
      {
        ...res,
        getHeader: (name: string) => res.headers?.get(name),
        setHeader: (name: string, value: string) => res.headers?.set(name, value),
      } as unknown as NextApiResponse,
      authOptions
    );
    console.log('session', session);

    return session;
  } catch (e) {
    return null;
  }
};

export async function getUser(userId: string) {
  try {
    const supabase = new SupabaseClient(process.env.NEXT_PUBLIC_SUPABASE_URL ?? '', process.env.SUPABASE_SERVICE_ROLE_KEY ?? '');

    const users = await supabase.schema('next_auth').from('accounts').select('*').eq('userId', userId);
    console.log('getUser => ', users)
    if (users.error) {
      console.error(users.error);
      return null;
    }
    if (users.data) {
      return users.data[0];
    }

    return null;
  } catch (e) {
    console.error(e);
    return null;
  }
}

export async function getPlaylists(userId: string) {
  try {
    const supabase = new SupabaseClient(process.env.NEXT_PUBLIC_SUPABASE_URL ?? '', process.env.SUPABASE_SERVICE_ROLE_KEY ?? '');

    const playlists = await supabase.schema('public').from('playlist').select().eq('user_id', userId);
    if (playlists.count ?? 0 > 0) {
      return playlists.data;
    }

    return null;
  } catch (e) {
    console.error(e);
    return null;
  }
}