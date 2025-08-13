"use client"

import { HeroSection } from "@/components/landing/hero-section"
import { FeaturesSection } from "@/components/landing/features-section"
import { Footer } from "@/components/landing/footer"

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-white dark:bg-[#1E1E1E]">
      <HeroSection />
      <FeaturesSection />
      <Footer />
    </main>
  )
}
