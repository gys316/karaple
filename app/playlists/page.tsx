'use client';

import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import axios from "axios";
import { Playlist } from "./interfaces/playlist";
import { Button } from "@/components/ui/button";

export default function PlaylistsPage() {
  const router = useRouter();
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      console.log('로그인이 필요합니다.');
    }
  });
  const [playlists, setPlaylists] = useState<Playlist>();

  console.log('status', status, 'session', session);
  useEffect(() => {
    if (status !== 'authenticated') return;
    
    axios.get('/api/getPlaylists')
      .then((res) => {
        setPlaylists(res.data);
      })
  }, [session, status]);

  return (
    <div className="bg-white p-8">
      <div className="flex items-center justify-start pb-2">
        <div className="flex items-center space-x-2">
          <h2 className="text-2xl font-bold">재생목록</h2>
        </div>
      </div>
      <div className="mt-4">
        <div className="bg-white">
          <div className="flex flex-col">
            {
              playlists && playlists.items.map((p, i) => {
                return (
                  <Card key={i}>
                    <CardHeader>
                      <CardTitle>{p.snippet.title}</CardTitle>
                      <CardDescription>{p.snippet.description}</CardDescription>
                      <CardContent>
                        <img src={p.snippet.thumbnails.default.url}></img>
                      </CardContent>
                      <CardFooter>
                        <Button onClick={() => console.log(p.id)}>추가</Button>
                      </CardFooter>
                    </CardHeader>
                  </Card>
                )
              })
            }
          </div>
        </div>
      </div>
    </div>
  );
}
