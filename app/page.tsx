"use client";

import { Label } from "@/components/ui/label";
import Image from "next/image";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import axios from "axios";

export default function Home() {
  const [title, setTitle] = useState('');
  const [searchType, setSearchType] = useState<'title' | 'artist'>('title');
  const [results, setResults] = useState<any[]>([]);

  const handleSearch = async () => {
    const { status, data } = await axios.post('/api/karaoke/search', { title, searchType });
    if (status === 200) {
      setResults(data);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div>
        <Input className="mb-4" placeholder="검색어 입력" defaultValue={title} onChange={(e) => setTitle(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSearch()} />
        <Label>검색 결과</Label>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="">제목</TableHead>
              <TableHead>가수</TableHead>
              <TableHead>회사</TableHead>
              <TableHead className="text-right">번호</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {results.map((result, i) => (
              <TableRow key={i}>
                <TableCell className="font-medium">{result.title}</TableCell>
                <TableCell>{result.artist}</TableCell>
                <TableCell>{result.type}</TableCell>
                <TableCell className="text-right">{result.number}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </main>
  );
}
