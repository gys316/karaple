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

export default function PlaylistsPage() {
    const router = useRouter();
    const { data: session, status } = useSession();
    const [playlists, setPlaylists] = useState([]);
    
    console.log('status', status, 'session', session);
    useEffect(() => {
      axios.get('/api/getPlaylists')
          .then((res) => {
            setPlaylists(res.data);
          })
    }, []);
  
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
              <Card>
                <CardHeader>
                  <CardTitle></CardTitle>
                  <CardDescription></CardDescription>
                  <CardContent>

                  </CardContent>
                  <CardFooter>

                  </CardFooter>
                </CardHeader>
              </Card>
            </div>
          </div>
        </div>
      </div>
    );
  }
  