import { Header } from "../components/Header";
import { HeroSection } from "../components/Hero-section";
import { FeaturedProducts } from "../components/Featured-products";
import { PromotionalBanner } from "../components/Promotional-banner";
import { Footer } from "../components/Footer"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroSection />
        <FeaturedProducts />
        <PromotionalBanner />
      </main>
      <Footer />
    </div>
  )
}
