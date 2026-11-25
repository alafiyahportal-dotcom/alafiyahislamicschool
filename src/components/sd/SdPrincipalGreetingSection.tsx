'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ScrollReveal from '@/components/landing/ScrollReveal';

interface PrincipalGreetingProps {
  schoolSlug?: string;
}

const SLIDE_DURATION_MS = 7000;

interface SlideTopic {
  id: string;
  title: string;
  subtitle: string;
  quoteOrLead?: React.ReactNode;
  principles?: string[];
  comparison?: {
    leftTitle: string;
    leftSubtitle: string;
    leftItems: string[];
    rightTitle: string;
    rightSubtitle: string;
    rightItems: string[];
  };
}

const CHARACTER_SLIDES: SlideTopic[] = [
  {
    id: 'nabawiyah',
    title: 'Pendidikan Karakter Nabawiyah',
    subtitle: 'Metode Generasi Terbaik Rasulullah ﷺ & Para Sahabat',
    principles: [
      'Meyakini setiap anak lahir dalam keadaan fitrah.',
      'Menjaga dan menumbuhkan karakter baik pada diri anak.',
      'Mendidik dengan teladan dan metode Rasulullah ﷺ.',
    ],
  },
  {
    id: 'kadar-karakter',
    title: 'Kesamaan & Keunikan Anak',
    subtitle: 'Dua pendekatan selaras dalam mendidik setiap anak:',
    comparison: {
      leftTitle: '1. Ditumbuhkan pada Semua Anak',
      leftSubtitle: 'Pondasi Bersama',
      leftItems: [
        'Cinta Allah ﷻ & Ibadah',
        'Adab dan Akhlak Mulia',
        'Semangat Belajar',
      ],
      rightTitle: '2. Menyesuaikan Keunikan Anak',
      rightSubtitle: 'Potensi Individu',
      rightItems: [
        'Karakter unik karunia Allah Ta’ala pada tiap anak',
        'Pendampingan sesuai gaya belajar dan bakat anak',
      ],
    },
  },
  {
    id: 'iman',
    title: 'Karakter Iman',
    subtitle: 'Pondasi Tauhid & Cinta Ibadah',
    quoteOrLead: (
      <>
        Menumbuhkan kecintaan kepada Allah, kesadaran beribadah, akhlak mulia, serta menjadikan <strong className="text-[#064e3b] font-bold">ilmu sebagai dasar perilaku</strong> sehari-hari.
      </>
    ),
  },
  {
    id: 'belajar',
    title: 'Karakter Belajar',
    subtitle: 'Lingkungan Belajar yang Aman & Menyenangkan',
    quoteOrLead: (
      <>
        Menumbuhkan rasa ingin tahu dan keberanian mencoba. <strong className="text-[#064e3b] font-bold">Saat cinta belajar sudah tumbuh, anak akan semangat belajar dengan sendirinya.</strong>
      </>
    ),
  },
  {
    id: 'bakat',
    title: 'Karakter Bakat',
    subtitle: 'Menghebat pada Waktunya',
    quoteOrLead: (
      <>
        Mengembangkan potensi unik setiap anak tanpa terburu-buru hingga tumbuh menjadi pribadi yang <strong className="text-[#064e3b] font-bold">mandiri, berakhlak mulia, dan produktif</strong>.
      </>
    ),
  },
];

export default function PrincipalGreetingSection({ schoolSlug = 'sd' }: PrincipalGreetingProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  const totalSlides = CHARACTER_SLIDES.length;
  const activeSlide = CHARACTER_SLIDES[activeIndex];

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % totalSlides);
    }, SLIDE_DURATION_MS);
    return () => clearInterval(timer);
  }, [totalSlides]);

  return (
    <section className="py-12 sm:py-16 bg-[#FAF8F3] relative overflow-hidden border-b border-stone-200/80">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <ScrollReveal yOffset={24} duration={500}>
          <div className="rounded-3xl bg-white border border-stone-200/90 shadow-lg shadow-stone-900/5 overflow-hidden">
            {/* Top Editorial Masthead & Core Welcome */}
            <div className="p-6 sm:p-10 border-b border-stone-200/80">
              <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-[#00A651] mb-2">
                Sambutan Kepala Sekolah SDIT Al-Afiyah
              </p>

              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight leading-tight">
                Bukan Sekadar Tempat Belajar,{' '}
                <span className="text-[#064e3b] underline decoration-[#facc15] decoration-4 underline-offset-4">
                  Namun Juga Tempat Bertumbuh.
                </span>
              </h2>

              <p className="mt-4 text-sm sm:text-base text-slate-700 leading-relaxed max-w-3xl">
                Kami meyakini setiap anak lahir dalam keadaan <strong className="text-[#064e3b] font-bold">fitrah</strong> dengan potensi iman, belajar, dan bakat yang unik. <strong className="text-slate-900 font-bold">SDIT Al-Afiyah</strong> hadir sebagai lingkungan tumbuh yang aman dan menyenangkan melalui <strong className="text-slate-900 font-bold">Metode Pendidikan Karakter Nabawiyah</strong>.
              </p>
            </div>

            {/* Auto-Slide Reading Stage */}
            <div className="bg-[#F3F7F2] p-6 sm:p-10 overflow-hidden">
              <div className="min-h-[160px] flex flex-col justify-center">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeSlide.id}
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -30 }}
                    transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                    className="border-l-4 border-[#064e3b] pl-4 sm:pl-6 space-y-3"
                  >
                    <div>
                      <h3 className="text-lg sm:text-2xl font-black text-[#064e3b] tracking-tight">
                        {activeSlide.title}
                      </h3>
                      <p className="text-xs sm:text-sm font-semibold text-slate-500">
                        {activeSlide.subtitle}
                      </p>
                    </div>

                    {activeSlide.quoteOrLead && (
                      <p className="text-sm sm:text-base lg:text-lg text-slate-800 leading-relaxed font-normal max-w-3xl">
                        {activeSlide.quoteOrLead}
                      </p>
                    )}

                    {activeSlide.principles && (
                      <ol className="space-y-2 pt-1">
                        {activeSlide.principles.map((item, idx) => (
                          <li
                            key={idx}
                            className="flex items-baseline gap-2.5 text-sm sm:text-base text-slate-800 font-medium"
                          >
                            <span className="font-black text-[#00A651] shrink-0">
                              {idx + 1}.
                            </span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ol>
                    )}

                    {activeSlide.comparison && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-1">
                        <div className="space-y-1.5">
                          <h4 className="text-sm sm:text-base font-black text-slate-900">
                            {activeSlide.comparison.leftTitle}
                          </h4>
                          <ul className="space-y-1 text-xs sm:text-sm text-slate-700">
                            {activeSlide.comparison.leftItems.map((item, i) => (
                              <li key={i} className="flex items-start gap-2">
                                <span className="text-[#064e3b] font-bold">•</span>
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="space-y-1.5 md:pl-6 md:border-l md:border-stone-300/80">
                          <h4 className="text-sm sm:text-base font-black text-slate-900">
                            {activeSlide.comparison.rightTitle}
                          </h4>
                          <ul className="space-y-1 text-xs sm:text-sm text-slate-700">
                            {activeSlide.comparison.rightItems.map((item, i) => (
                              <li key={i} className="flex items-start gap-2">
                                <span className="text-amber-600 font-bold">•</span>
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>

              <div className="mt-6 pt-4 border-t border-stone-200/80 flex items-center justify-between flex-wrap gap-2">
                <div>
                  <p className="text-sm sm:text-base font-black text-slate-900">
                    Ust. Febrian Fauzi, S.Pd., M.Pd.
                  </p>
                  <p className="text-xs text-[#064e3b] font-semibold">
                    Kepala Sekolah SDIT Al-Afiyah Majalengka
                  </p>
                </div>
                <div className="flex items-center gap-1.5">
                  {CHARACTER_SLIDES.map((s, idx) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => setActiveIndex(idx)}
                      className={`h-2 rounded-full transition-all cursor-pointer ${
                        idx === activeIndex ? 'w-6 bg-[#064e3b]' : 'w-2 bg-stone-300'
                      }`}
                      aria-label={s.title}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
