import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import AuthContext from "@/context/AuthContext";
import Header from "@/components/header/header";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Karaple",
  description: "편리한 노래방 검색기",
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthContext>
          <Header />
          <div>
            {children}
          </div>
        </AuthContext>
      </body>
    </html>
  );
}
