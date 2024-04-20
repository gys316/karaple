'use client';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Link from "next/link";
import { useState } from "react";
import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function Header() {
  const router = useRouter();
  const { data } = useSession();
  const [isBlock, setIsBlock] = useState(false);

  const handleClick = () => {
    setIsBlock(!isBlock);
  }

  return (
    <header className='flex shadow-md py-4 px-4 sm:px-10 bg-white font-[sans-serif] w-full min-h-[70px] tracking-wide relative z-50'>
      <div className='flex flex-wrap items-center justify-between gap-5 w-full'>
        <Link href="/">
          <Label>Karaple</Label>
        </Link>
        <div className='flex max-lg:ml-auto space-x-3'>
          {
            data &&
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar className="cursor-pointer">
                  <AvatarImage src={data?.user?.image ?? '/fallback_user_icon.png'} />
                  <AvatarFallback>{data?.user?.name}</AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-48">
                <DropdownMenuLabel>
                  <Label>{data?.user?.name}</Label>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer" onClick={() => signOut()}>
                  로그아웃
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          }
          {!data &&
            <Button variant="ghost" onClick={() => signIn('google')}>로그인</Button>
          }
        </div>
      </div>
    </header>
  )
}