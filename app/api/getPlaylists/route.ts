import { getPlaylists, getSession, getUser } from "@/app/utils/util";
import { createClient } from "@supabase/supabase-js";
import axios from "axios";
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  req: NextRequest,
  res: NextResponse
) {
  const session = await getSession(req, res);
  console.log('---------------------------------------');
  console.log(session);
  if (!session || !session.user.id || !session.accessToken) {
    return NextResponse.json({ message: "로그인이 필요합니다." }, { status: 401 });
  }
  
  let playlists = await getPlaylists(session.user.id);
  console.log('playlists', playlists);
  
  // 재생목록이 없을 경우
  if (!playlists || playlists.length === 0) {
    const apiUrl = `https://www.googleapis.com/youtube/v3/playlists?part=id,contentDetails,snippet,status&mine=true&maxResults=50`;
    const { data, status } = await axios.get(apiUrl, {
      headers: {
        Authorization: `Bearer ${session.accessToken}`,
      }
    });

    console.log(status, data);
    playlists = data;
  }

  return NextResponse.json(playlists, { status: 200 });
}