import { getPlaylists, getSession, getUser } from "@/app/utils/util";
import { createClient } from "@supabase/supabase-js";
import axios from "axios";
import { NextRequest, NextResponse } from 'next/server';

export async function POST(
  req: NextRequest,
  res: NextResponse
) {
  try {
    const session = await getSession(req, res);
    console.log('---------------------------------------');
    console.log(session);
    if (!session || !session.user.id || !session.accessToken) {
      return NextResponse.json({ message: "로그인이 필요합니다." }, { status: 401 });
    }
  
    const body = await req.json();
    console.log(body);
    const { playlistId, title, thumbnail } = body;
    if (!playlistId) {
      return NextResponse.json({ message: "required playlistId." }, { status: 400 });
    }
    
    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL ?? '', process.env.SUPABASE_SERVICE_ROLE_KEY ?? '');
    const { data: playlists, error: playlistError } = await supabase
      .from('playlist')
      .upsert({ 
        user_id: session.user.id, 
        playlist_id: playlistId,
        title,
        thumbnail,
      }, {
        onConflict: 'playlist_id'
      })
      .select();
    if (playlistError) {
      return NextResponse.json({ message: playlistError }, { status: 400 });
    }
  
    let musicArr: any[] = [];
    let nextPageToken: string | null = null;

    do {
      const apiUrl: any = `https://www.googleapis.com/youtube/v3/playlistItems?part=id,contentDetails,snippet,status&playlistId=${playlistId}&maxResults=50${nextPageToken ? `&pageToken=${nextPageToken}` : ''}`;
      const { data, status } = await axios.get(apiUrl, {
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
        }
      });
      nextPageToken = data.nextPageToken ?? null;
      musicArr = [...musicArr, ...data.items];
    } while (nextPageToken !== null);
    const createMusicArr: any[] = [];
    musicArr.forEach((music) => {
      // console.log(music);
      if (music.status.privacyStatus === 'private') return;

      createMusicArr.push({
        playlist_id: playlists[0].id,
        music_id: music.id,
        raw_title: music.snippet.title,
        title: "",
        artist: "",
        thumbnail: music.snippet.thumbnails.default.url,
        youtube_id: music.contentDetails.videoId,
        karaoke_info: {},
      });
    });
    
    const { count, error } = await supabase
      .from('music')
      .upsert(createMusicArr, { onConflict: 'music_id' });
  
    if (error) {
      return NextResponse.json({ message: error }, { status: 400 });
    }
  
    return NextResponse.json({ count }, { status: 200 });
  } catch (e) {
    console.error(e);
    return NextResponse.json('', { status: 500 });
  }
}