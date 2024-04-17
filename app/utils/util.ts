import { createClient } from "@supabase/supabase-js";
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

    return session?.supabaseAccessToken;
  } catch (e) {
    return null;
  }
};