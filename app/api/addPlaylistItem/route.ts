import { getPlaylists, getSession, getUser } from "@/app/utils/util";
import { createClient } from "@supabase/supabase-js";
import axios from "axios";
import { NextRequest, NextResponse } from 'next/server';

export async function POST(
  req: NextRequest,
  res: NextResponse
) {
  const session = await getSession(req, res);
  console.log('---------------------------------------');
  console.log(session);
  if (!session || !session.user.id || !session.accessToken) {
    return NextResponse.json({ message: "로그인이 필요합니다." }, { status: 401 });
  }

  const { playlistId } = await req.json();
  if (!playlistId) {
    return NextResponse.json({ message: "required playlistId." }, { status: 400 });
  }

  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL ?? '', process.env.SUPABASE_SERVICE_ROLE_KEY ?? '');
  const { data: playlists, error: playlistError } = await supabase
    .from('playlist')
    .upsert({ user_id: session.user.id, playlist_id: playlistId })
    .select();
  if (playlistError) {
    return NextResponse.json({ message: playlistError }, { status: 400 });
  }
  console.log('playlists', playlists);

  const apiUrl = `https://www.googleapis.com/youtube/v3/playlistItems?part=id,contentDetails,snippet,status&playlistId=${playlistId}&maxResults=50`;
  const { data, status } = await axios.get(apiUrl, {
    headers: {
      Authorization: `Bearer ${session.accessToken}`,
    }
  });

  console.log(status, data);

  const { count, error } = await supabase
    .from('music')
    .upsert([
      {
        playlist_id: playlistId,
        music_id: '',
        raw_title: '',
        title: '',
        artist: '',
        thumbnail: '',
        youtube_id: '',
        karaoke_info: {},
      },
    ]);

  return NextResponse.json(playlists, { status: 200 });
}