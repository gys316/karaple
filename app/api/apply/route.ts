import { getSession } from "@/app/utils/util";
import { createClient } from "@supabase/supabase-js";
import axios from "axios";
import { NextRequest, NextResponse } from 'next/server';

export async function POST(
  req: NextRequest,
  res: NextResponse
) {
  const session = await getSession(req, res);
  if (!session) {
    return NextResponse.json({ message: "로그인이 필요합니다." }, { status: 401 });
  }
  const body = await req.json();
  
  const { data, status } = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/apply`, {
    // userId: user.id,
    // company: user.company,
    ...body,
  });

  console.log(status, data);

  if (status === 200 || status === 201) {
    return NextResponse.json(data, { status: 200 });
  } else {
    return NextResponse.json(data, { status: 500 });
  }
}