import AboutSection from "../components/AboutSection";
import AnimatedSection from "../components/AnimatedSection";
import BallotingSection from "../components/BallotingSection";
import CTASection from "../components/CTASection";
import Footer from "../components/Footer";
import HeroSection from "../components/HeroSection";
import HowItWorksSection from "../components/HowItWorksSection";
import MouseGlow from "../components/MouseGlow";
import Navbar from "../components/Navbar";
import PartnershipSection from "../components/PartnershipSection";
import ReferralProgramSection from "../components/ReferralProgramSection";
import ServicesSection from "../components/ServicesSection";
import WhyEZLifeSection from "../components/WhyEZLifeSection";

export default function HomePage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#0F172A]">
      <MouseGlow />

      <Navbar />

      <HeroSection />

      <AnimatedSection>
        <AboutSection />
      </AnimatedSection>

      <AnimatedSection>
        <ServicesSection />
      </AnimatedSection>

      <AnimatedSection>
        <WhyEZLifeSection />
      </AnimatedSection>

      <AnimatedSection>
        <HowItWorksSection />
      </AnimatedSection>

      <AnimatedSection>
        <ReferralProgramSection />
      </AnimatedSection>

      <AnimatedSection>
        <BallotingSection />
      </AnimatedSection>

      <AnimatedSection>
        <PartnershipSection />
      </AnimatedSection>

      <AnimatedSection>
        <CTASection />
      </AnimatedSection>

      <Footer />
    </main>
  );
}
