import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import ProviderLogos from "@/components/ProviderLogos";
import FeaturesSection from "@/components/FeaturesSection";
import PrivacyBanner from "@/components/PrivacyBanner";
import HowItWorks from "@/components/HowItWorks";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <ProviderLogos />
      <FeaturesSection />
      <PrivacyBanner />
      <HowItWorks />
      <Footer />
    </div>
  );
};

export default Index;
