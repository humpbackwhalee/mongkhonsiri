import { Metadata } from 'next';
import BannerSection from "./components/homeSection/BannerSection";
import HighlightSection from "./components/homeSection/HighlightSection";
import OccasionSection from "./components/homeSection/OccasionSection";
import FeatureSection from "./components/homeSection/FeatureSection";

export const metadata: Metadata = {
  title: "มงคลสิริ - บทสวดมนต์และคำสอน",
  description: "รวมบทสวดมนต์ คำสอน และเรื่องราวมงคลต่างๆ เพื่อความเป็นสิริมงคลในชีวิตประจำวัน",
  openGraph: {
    title: "มงคลสิริ - บทสวดมนต์และคำสอน",
    description: "รวมบทสวดมนต์ คำสอน และเรื่องราวมงคลต่างๆ เพื่อความเป็นสิริมงคลในชีวิตประจำวัน",
    url: "https://mongkhonsiri.vercel.app/",
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