import Navbar from '@/components/navigation/Navbar'
import HeroSection from '@/components/sections/HeroSection'
import ServicesSection from '@/components/sections/ServicesSection'
import BrandStripSection from '@/components/sections/BrandStripSection'
import TestimonialsSection from '@/components/sections/TestimonialsSection'
import GallerySection from '@/components/sections/GallerySection'
import CtaBannerSection from '@/components/sections/CtaBannerSection'
import FaqSection from '@/components/sections/FaqSection'
import Footer from '@/components/footer/Footer'

/**
 * Maison Élite — Luxury Beauty Salon Landing Page
 * Visual prototype · Quiet Luxury aesthetic
 *
 * CTA inventory:
 *   #1 — Navbar (sticky)
 *   #2 — Hero Section body
 *   #3 — Services Section (below cards)
 *   #4 — Mid-page CTA Banner
 *   #5 — Footer Tier 1 concierge bar
 */
export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#F9F8F6]">
      {/* Sticky Navigation — CTA #1 embedded inside */}
      <Navbar />

      <main id="main-content">
        {/* Hero — CTA #2 */}
        <HeroSection />

        {/* Services — CTA #3 */}
        <ServicesSection />

        {/* Brand trust strip */}
        <BrandStripSection />

        {/* Social proof */}
        <TestimonialsSection />

        {/* Before/After gallery */}
        <GallerySection />

        {/* FAQ */}
        <FaqSection />

        {/* Mid-page CTA banner — CTA #4 */}
        <CtaBannerSection />
      </main>

      {/* Footer — CTA #5 embedded inside */}
      <Footer />
    </div>
  )
}
