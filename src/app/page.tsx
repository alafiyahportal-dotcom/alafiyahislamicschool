import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import StickyMobileBar from '@/components/layout/StickyMobileBar';
import EdukaHeroSlider from '@/components/landing/EdukaHeroSlider';
import FloatingFeatureCards from '@/components/landing/FloatingFeatureCards';
import SatuanPendidikanSection from '@/components/landing/SatuanPendidikanSection';
import EdukaAboutMosaic from '@/components/landing/EdukaAboutMosaic';
import TealStatsCounterBar from '@/components/landing/TealStatsCounterBar';
import HavenlyArchCarousel from '@/components/landing/HavenlyArchCarousel';
import VideoTourSection from '@/components/landing/VideoTourSection';
import TeacherShowcaseSection from '@/components/landing/TeacherShowcaseSection';
import TestimonialAndCtaSection from '@/components/landing/TestimonialAndCtaSection';
import CampusLocationMapSection from '@/components/landing/CampusLocationMapSection';
import ScrollFadeIn from '@/components/landing/ScrollFadeIn';
import { prisma } from '@/lib/prisma';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Yayasan Pendidikan Imam Bonjol Majalengka | Ekosistem Pendidikan Terpadu Al-Afiyah',
  description:
    'Lembaga pendidikan Islam terpadu resmi menaungi TK IT, SDIT, dan SMP IT Al-Afiyah Majalengka. Memadukan tahfidz Al-Qur’an 30 juz, sains modern, dan adab mulia.',
};

export default async function HomePage() {
  const foundation = await prisma.school.findUnique({
    where: { slug: 'foundation' },
    include: {
      cmsSections: true,
    },
  });

  const heroSection = foundation?.cmsSections.find((s) => s.sectionKey === 'hero');
  let heroData: any = {};
  if (heroSection) {
    try {
      heroData = JSON.parse(heroSection.payload);
    } catch {
      heroData = {};
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] text-slate-800 font-sans selection:bg-amber-200 selection:text-amber-950 overflow-x-clip w-full max-w-full">
      {/* Top Navbar */}
      <Navbar />

      {/* 1. Hero Section (Eduka-Style Campus Banner Slider with Dual CTA) */}
      <EdukaHeroSlider customSlides={heroData.slides} />

      {/* 2. Overlapping Floating Feature Cards (01-04 Numbered Badges) */}
      <ScrollFadeIn>
        <FloatingFeatureCards />
      </ScrollFadeIn>

      {/* 3. Satuan Pendidikan Al-Afiyah (Inspired by Pesantren Al-Irsyad: Left Intro + Staggered Multi-Unit Cards) */}
      <ScrollFadeIn>
        <SatuanPendidikanSection />
      </ScrollFadeIn>

      {/* 4. About Us Section (3-Photo Mosaic with Arch Frame & Narrative) */}
      <ScrollFadeIn>
        <EdukaAboutMosaic />
      </ScrollFadeIn>

      {/* 4. Inspiring Student & Teacher Highlights (Havenly Radial Arc Dial Carousel) */}
      <ScrollFadeIn>
        <section className="py-16 sm:py-20 bg-gradient-to-b from-[#F2F8F7] via-white to-[#F8FAFC] border-y border-[#D4EBE7]/60 relative overflow-hidden">
          {/* Subtle decorative background glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-[#2D7A70]/5 blur-3xl rounded-full pointer-events-none" />
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
            <div className="inline-flex items-center px-3.5 py-1.5 rounded-full bg-[#E8F3F1] border border-[#2D7A70]/20 text-[#184F48] text-xs font-bold uppercase tracking-wider mb-3">
              <span>Figur Inspiratif &amp; Karakter Unggul Al-Afiyah</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-normal [word-spacing:0.14em] max-w-3xl mx-auto leading-tight">
              Menumbuhkan Generasi Beradab,{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2D7A70] to-[#184F48]">
                Cerdas &amp; Berprestasi Nyata
              </span>
            </h2>
            <p className="mt-3 text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed [word-spacing:0.04em]">
              Potret keteladanan murid dan dedikasi guru pendidik Al-Afiyah dalam memadukan mutqin tahfidz Al-Qur&apos;an, adab mulia, serta wawasan sains modern.
            </p>

            <div className="mt-4">
              <HavenlyArchCarousel />
            </div>
          </div>
        </section>
      </ScrollFadeIn>

      {/* 5. Full-Width Teal Stats Counter Bar (Mowilex Soft Water Parallax) */}
      <ScrollFadeIn>
        <TealStatsCounterBar />
      </ScrollFadeIn>

      {/* 6. Campus Video Tour & Why Choose Us (Pulsating Play Button & 4 Pillars) */}
      <ScrollFadeIn>
        <VideoTourSection />
      </ScrollFadeIn>

      {/* 7. Meet Our Teachers (Dewan Guru Berpengalaman) */}
      <ScrollFadeIn>
        <TeacherShowcaseSection />
      </ScrollFadeIn>

      {/* 8. Parent Testimonials & High-Conversion PPDB Call to Action Banner */}
      <ScrollFadeIn>
        <TestimonialAndCtaSection />
      </ScrollFadeIn>

      {/* 9. Campus Location & Interactive Map Section */}
      <ScrollFadeIn>
        <CampusLocationMapSection unitSlug="foundation" />
      </ScrollFadeIn>

      {/* Footer */}
      <Footer />

      {/* Sticky Mobile Quick Navigation Bar */}
      <StickyMobileBar />
    </div>
  );
}
