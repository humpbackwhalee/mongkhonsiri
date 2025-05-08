import BannerSection from "./components/homeSection/BannerSection";
import HightlightSection from "./components/homeSection/HighlightSection";
import OccasionSection from "./components/homeSection/OccasionSection";
import FeatureSection from "./components/homeSection/FeatureSection";

export default function HomePage() {
  return (
    <section className="flex flex-col items-center">
      <BannerSection />
      <HightlightSection />
      <OccasionSection />
      <FeatureSection />
    </section>
  );
}
