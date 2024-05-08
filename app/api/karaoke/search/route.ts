import { getPlaylists, getSession, getUser } from "@/app/utils/util";
import { createClient } from "@supabase/supabase-js";
import axios from "axios";
import { NextRequest, NextResponse } from 'next/server';

export async function POST(
  req: NextRequest,
  res: NextResponse
) {
  // const session = await getSession(req, res);
  // if (!session || !session.user.id) {
  //   return NextResponse.json({ message: "로그인이 필요합니다." }, { status: 401 });
  // }

  const { title } = await req.json();

  const searchJoysound = async () => {
    const url = 'https://mspxy.joysound.com/Common/ContentsList';
    const body = {
      format: 'all',
      kindCnt: 1,
      start: 1,
      count: 20,
      sort: 'popular',
      order: 'desc',
      kind1: 'song',
      word1: title,
      match1: 'partial',
      apiVer: 1.0,
    };
    const { data, status } = await axios.post(url, body, {
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Accept-Encoding': 'gzip, deflate, br, zstd',
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
        'Origin': 'https://www.joysound.com',
        'Referer': 'https://www.joysound.com/',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        'X-Jsp-App-Name': '0000800',
      }
    });
  
    console.log(status, data);
  
    const songs = data.contentsList?.map((song: any) => {
      const serviceList: any[] = song?.serviceTypeList ?? [];
      const isHomeService = serviceList.some((serv) => serv?.serviceType === '100000000');
  
      return {
        'title': song.songName,
        'artist': song.artistName,
        'number': song.selSongNo,
        'type': 'joysound',
        'additional_info': {
          isHomeService
        },
      }
    });

    return songs;
  };
  const searchDam = async () => {
    const url = 'https://www.clubdam.com/dkwebsys/search-api/SearchMusicByKeywordApi';
    const body = {
      modelTypeCode: "1",
      serialNo: "AT00001",
      keyword: "ginger",
      compId: "1",
      authKey: "2/Qb9R@8s*",
      contentsCode: null,
      serviceCode: null,
      sort: "2",
      dispCount: "100",
      pageNo: "1",
    };
    const { data, status } = await axios.post(url, body, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json, text/javascript, */*; q=0.01',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        'Origin': 'https://www.clubdam.com',
        'Referer': `https://www.clubdam.com/karaokesearch/?keyword=${encodeURIComponent(title)}&type=song`,
        'X-Requested-With': 'XMLHttpRequest',
      }
    });
  
    console.log(status, data);
  
    const songs = data.list?.map((song: any) => {
      return {
        'title': song.title,
        'artist': song.artist,
        'number': song.requestNo,
        'type': 'dam',
        'additional_info': {},
      }
    });

    return songs;
  };
  const searchTj = async () => {
    const url = 'https://www.tjmedia.com/tjsong/song_search_list.asp';
    const body = {
      searchOrderItem: "",
      searchOrderType: "",
      strCond: 0,
      natType: "",
      strType: 1,
      strText: title,
    };
    const { data, status } = await axios.post(url, body, {
      headers: {
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
        'Accept-Encoding': 'gzip, deflate, br, zstd',
        'Content-Type': 'application/x-www-form-urlencoded',
        'Origin': 'https://www.tjmedia.com',
        'Referer': 'https://www.tjmedia.com/tjsong/song_search_list.asp',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
      }
    });
  
    console.log(status, data);
  
    // const songs = data.contentsList?.map((song: any) => {
    //   const serviceList: any[] = song?.serviceTypeList ?? [];
    //   const isHomeService = serviceList.some((serv) => serv?.serviceType === '100000000');
  
    //   return {
    //     'title': song.songName,
    //     'artist': song.artistName,
    //     'number': song.selSongNo,
    //     'type': 'tj',
    //     'additional_info': {
    //       isHomeService
    //     },
    //   }
    // });

    return songs;
  };
  
  // const songs = await Promise.all([
  //   searchJoysound()
  // ]);
  const songs = await searchDam();

  console.log(songs);

  return NextResponse.json(songs, { status: 200 });
}