import { PublicNavbar } from "@/components/layout/public-navbar";
import { Footer } from "@/components/layout/footer";
import { HeroSection } from "@/components/landing/hero-section";
import { FeaturesSection } from "@/components/landing/features-section";
import { CoursePreviewSection } from "@/components/landing/course-preview-section";
import { FAQSection } from "@/components/landing/faq-section";
import { CTASection } from "@/components/landing/cta-section";

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <PublicNavbar />
      <main className="flex-1">
        <HeroSection />
        <FeaturesSection />
        <CoursePreviewSection />
        <FAQSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}
