'use client';

import { useRouter } from "next/navigation";

export default function PlaylistsPage() {
    const router = useRouter();
  
    return (
      <div className="bg-white p-8">
        <div className="flex items-center justify-start pb-2">
          <div className="flex items-center space-x-2">
            <h2 className="text-2xl font-bold">재생목록</h2>
          </div>
        </div>
        <div className="mt-4">
          <div className="bg-white shadow rounded-lg p-4">

          </div>
        </div>
      </div>
    );
  }
  