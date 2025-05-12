import { Metadata } from 'next';
import BannerSection from "./components/homeSection/BannerSection";
import HighlightSection from "./components/homeSection/HighlightSection";
import OccasionSection from "./components/homeSection/OccasionSection";
import FeatureSection from "./components/homeSection/FeatureSection";

// Need to Update
export const metadata: Metadata = {
  title: "หน้าหลัก | มงคลสิริ",
  description: "คำอธิบายที่น่าสนใจเกี่ยวกับหน้าหลักของเว็บไซต์คุณ พร้อมคีย์เวิร์ดที่เกี่ยวข้อง",
  openGraph: {
    title: "หน้าหลัก | มงคลสิริ",
    description: "คำอธิบายที่น่าสนใจเกี่ยวกับหน้าหลักของเว็บไซต์คุณ พร้อมคีย์เวิร์ดที่เกี่ยวข้อง",
    url: "https://yourwebsite.com",
    siteName: "มงคลสิริ",
  },
};

export default function HomePage() {
  return (
    <main className="flex flex-col items-center w-full">
      <BannerSection />
      <HighlightSection />
      <OccasionSection />
      <FeatureSection />
    </main>
  );
}