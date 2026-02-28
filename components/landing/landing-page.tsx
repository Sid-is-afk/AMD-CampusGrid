'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ThemeToggle } from '@/components/theme-toggle';
import { HeroSection } from './hero-section';
import { FeaturesSection } from './features-section';
import { HowItWorks } from './how-it-works';
import { PromotionsSection } from './promotions-section';
import { TestimonialsSection } from './testimonials-section';
import { Footer } from './footer';

export function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navigation Header */}
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-xl border-b border-border/30">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2">
              <div className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                CampusGrid
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex gap-8">
              {[
                { label: 'Features', href: '#features' },
                { label: 'How It Works', href: '#how-it-works' },
                { label: 'Events', href: '#events' },
              ].map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="text-muted-foreground hover:text-foreground transition-colors text-sm font-medium"
                >
                  {item.label}
                </a>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Link href="/?mode=signin">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-2 rounded-lg border border-border bg-card/50 hover:bg-card text-foreground font-medium transition-colors text-sm"
              >
                Sign In
              </motion.button>
            </Link>
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main className="relative">
        <HeroSection />

        <section id="features">
          <FeaturesSection />
        </section>

        <section id="how-it-works">
          <HowItWorks />
        </section>

        <section id="events">
          <PromotionsSection />
        </section>

        <TestimonialsSection />
      </main>

      <Footer />
    </div>
  );
}
