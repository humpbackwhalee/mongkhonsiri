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

export const metadata: Metadata = {
  title: "สวดมนต์ | Mongkhonsiri",
  description: "สวดมนต์",
  openGraph: {
    title: "สวดมนต์ | Mongkhonsiri",
    description: "สวดมนต์",
    url: "https://mongkhonsiri.vercel.app",
    siteName: "Mongkhonsiri",
    images: [
      {
        url: "https://mongkhonsiri.vercel.app/images/og-image.png",
        width: 1200,
        height: 630,
        alt: "Mongkhonsiri OG Image",
      },
    ],
    locale: "th_TH",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    site: "@MongkhonsiriApp",
    creator: "@yourpersonalhandle",
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
