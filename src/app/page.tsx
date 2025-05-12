import BannerSection from "./components/homeSection/BannerSection";
import HighlightSection from "./components/homeSection/HighlightSection";
import OccasionSection from "./components/homeSection/OccasionSection";
import FeatureSection from "./components/homeSection/FeatureSection";

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