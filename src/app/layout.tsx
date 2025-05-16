import type { Metadata } from "next";
import { Prompt, IBM_Plex_Sans_Thai_Looped } from "next/font/google";
import "./globals.css";

import Header from "./components/Header";
import Footer from "./components/Footer";

const prompt = Prompt({
  subsets: ["thai"],
  display: "swap",
  weight: ["300", "400", "600"],
  variable: "--font-prompt",
});

const ibmPlexSansThaiLooped = IBM_Plex_Sans_Thai_Looped({
  weight: ["300", "400", "600"],
  variable: "--font-ibm_plex_sans_thai_looped",
  subsets: ["thai"],
});

// Need to Update
export const metadata: Metadata = {
  title: "สวดมนต์ | มงคลสิริ",
  description: "สวดมนต์ก่อนนอน สวดมนตอนเช้า สวดมนต์ออนไลน์ สะดวก รวดเร็ว รวมบทสวดมนต์หลากหลาย เสริมสิริมงคลในชีวิตประจำวัน",
  keywords: "สวดมนต์, สวดมนต์ออนไลน์, บทสวดมนต์, สวดมนต์ก่อนนอน, สวดมนต์เช้า, สวดมนต์ประจำวัน, ไหว้พระสวดมนต์, แผ่เมตตา, ชินบัญชร, มงคลสิริ",
  openGraph: {
    title: "สวดมนต์ | มงคลสิริ",
    description: "สวดมนต์ออนไลน์ สะดวก รวดเร็ว พร้อมบทสวดมนต์หลากหลาย เสริมสิริมงคลในชีวิตประจำวัน",
    url: "https://mongkhonsiri.vercel.app",
    siteName: "มงคลสิริ",
    images: [
      {
        url: "https://mongkhonsiri.vercel.app/images/og-image.png",
        width: 1200,
        height: 630,
        alt: "ภาพหน้าจอแอปพลิเคชัน Mongkhonsiri แสดงบทสวดมนต์และฟังก์ชันการใช้งาน",
      },
    ],
    locale: "th_TH",
    type: "website",
  },

  // Need to Update
  twitter: {
    card: "summary_large_image",
    site: "@MongkhonsiriApp",
    creator: "@R&D_dev",
    description: "แอปพลิเคชันสวดมนต์ออนไลน์ สะดวก รวดเร็ว พร้อมบทสวดมนต์หลากหลาย",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th">
      <body
        className={`${prompt.variable} ${ibmPlexSansThaiLooped.variable} antialiased flex flex-col min-h-screen items-center`}
      >
        <Header />
        <main>
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}