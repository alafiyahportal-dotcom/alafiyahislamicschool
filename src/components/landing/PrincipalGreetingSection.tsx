'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import ScrollReveal from './ScrollReveal';
import { ArrowRight, Check } from 'lucide-react';

interface PrincipalGreetingProps {
  schoolSlug?: string;
}

/* ─── Authentic Vector Illustrations from the Principal's Graphic Slides ─── */

function TreeIllustration({ className = 'w-16 h-16' }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" fill="currentColor" className={className} aria-hidden="true">
      <path d="M32 6c-6.2 0-11.4 4.1-13.1 9.7C13.3 16.5 9 21.3 9 27.2c0 4.4 2.5 8.3 6.2 10.2-.2.9-.2 1.8-.2 2.6 0 5.5 4.5 10 10 10 1.4 0 2.8-.3 4-.9V56c0 1.1-.9 2-2 2h-2v2h14v-2h-2c-1.1 0-2-.9-2-2v-6.9c1.2.6 2.6.9 4 .9 5.5 0 10-4.5 10-10 0-.8-.1-1.7-.2-2.6 3.7-1.9 6.2-5.8 6.2-10.2 0-5.9-4.3-10.7-9.9-11.5C43.4 10.1 38.2 6 32 6zm-3 36.2c-2.2-1.8-3.8-4.2-4.5-6.9h2.6c.6 1.7 1.6 3.2 2.9 4.4v2.5zm6 0v-2.5c1.3-1.2 2.3-2.7 2.9-4.4h2.6c-.7 2.7-2.3 5.1-4.5 6.9z" />
    </svg>
  );
}

function HeartIllustration({ className = 'w-16 h-16' }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" fill="currentColor" className={className} aria-hidden="true">
      <path d="M32 56.6l-3.9-3.5C14.4 40.7 6 33.1 6 22.9 6 14.8 12.3 8.5 20.4 8.5c4.6 0 9 2.1 11.6 5.5 2.6-3.4 7-5.5 11.6-5.5C51.7 8.5 58 14.8 58 22.9c0 10.2-8.4 17.8-22.1 30.2L32 56.6z" />
    </svg>
  );
}

function BrainIllustration({ className = 'w-16 h-16' }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" fill="currentColor" className={className} aria-hidden="true">
      <path d="M32 10c-4.5 0-8.4 2.5-10.4 6.2C16.2 16.9 12 21.5 12 27c0 2.8 1.1 5.4 2.9 7.3-.6 1.4-.9 3-.9 4.7 0 6.1 4.9 11 11 11h3v6h4V46c0-4.4 3.6-8 8-8h2v-4h-2c-3.5 0-6.6 1.5-8.8 3.9V30h5.2l3.4-3.4-2.8-2.8L33 28.2V22h-4v8.2l-4.4-4.4-2.8 2.8L26.2 33H29v13h-4c-3.9 0-7-3.1-7-7 0-1.3.4-2.6 1.1-3.6l.8-1.2-1-.9C17.1 31.7 16 29.4 16 27c0-3.9 3.1-7 7-7h1.3l.6-1.2C26.3 15.9 29 14 32 14s5.7 1.9 7.1 4.8l.6 1.2H41c3.9 0 7 3.1 7 7 0 2.4-1.1 4.7-2.9 6.3l-1 .9.8 1.2c.7 1 1.1 2.3 1.1 3.6 0 3.9-3.1 7-7 7h-3v6h4v-2.1c5.1-.5 9-4.8 9-9.9 0-1.7-.3-3.3-.9-4.7 1.8-1.9 2.9-4.5 2.9-7.3 0-5.5-4.2-10.1-9.6-10.8C40.4 12.5 36.5 10 32 10z" />
    </svg>
  );
}

function PodiumIllustration({ className = 'w-16 h-16' }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" fill="currentColor" className={className} aria-hidden="true">
      <circle cx="32" cy="11" r="4" />
      <path d="M23 14l5 5h8l5-5 2.5 2.5-6.5 6.5V35h-3v-7h-4v7h-3V23l-6.5-6.5L23 14z" />
      <circle cx="15" cy="19" r="3.5" />
      <path d="M11 25h8c1.7 0 3 1.3 3 3v7h-2.5v6h-9v-6H8v-7c0-1.7 1.3-3 3-3z" />
      <circle cx="49" cy="21" r="3.5" />
      <path d="M45 27h8c1.7 0 3 1.3 3 3v7h-2.5v6h-9v-6H42v-7c0-1.7 1.3-3 3-3z" />
      <path d="M6 43h16v-6h20v8h16v11H6V43z" />
    </svg>
  );
}

function GrowthStageIllustration({ className = 'w-16 h-16' }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" fill="currentColor" className={className} aria-hidden="true">
      <circle cx="46" cy="18" r="7.5" />
      <path d="M22 28c4.5 0 11 1.5 15 5l6 10c1 1.7.4 3.8-1.3 4.8-1.7 1-3.8.4-4.8-1.3l-4.6-7.7-8.3-1.3v9.5c0 2.2-1.8 4-4 4h-7c-2.2 0-4-1.8-4-4s1.8-4 4-4h3v-7c0-4.4 3.6-8 6-8z" />
    </svg>
  );
}

interface SlideTopic {
  id: string;
  title: string;
  subtitle: string;
  iconColor: string;
  accentLineColor: string;
  iconType: 'tree' | 'equality' | 'heart' | 'brain' | 'podium' | 'growth';
  description: string[];
  comparisonColumns?: {
    leftTitle: string;
    leftOutcome: string;
    leftItems: string[];
    rightTitle: string;
    rightOutcome: string;
    rightItems: string[];
  };
  numberedPrinciples?: string[];
}

const CHARACTER_SLIDES: SlideTopic[] = [
  {
    id: 'nabawiyah',
    title: 'Pendidikan Karakter Nabawiyah',
    subtitle: 'Metode Generasi Terbaik: Rasulullah ﷺ, Para Sahabat, Tabi’in & Tabi’ut Tabi’in',
    iconColor: 'text-[#d9f99d]',
    accentLineColor: 'bg-[#facc15]',
    iconType: 'tree',
    description: [],
    numberedPrinciples: [
      'Pendidikan karakter adalah pendidikan yang meyakini bahwa setiap anak terlahir dalam keadaan fitrah.',
      'Pendidikan karakter adalah pendidikan yang menjaga dan menumbuhkan karakter-karakter yang sudah ada pada diri anak.',
      'Pendidikan karakter menggunakan metode pembelajaran yang telah diwahyukan kepada Rasulullah ﷺ.',
    ],
  },
  {
    id: 'kadar-karakter',
    title: 'Kadar Kesamaan Karakter Antarpribadi Anak',
    subtitle: 'Karakter pembawaan yang telah ada pada diri manusia terbagi menjadi dua:',
    iconColor: 'text-[#d9f99d]',
    accentLineColor: 'bg-[#a3e635]',
    iconType: 'equality',
    description: [],
    comparisonColumns: {
      leftTitle: '1. Semua Anak Sama',
      leftOutcome: 'Ditumbuhkan ke Semua Anak',
      leftItems: [
        'Kecintaan kepada Allah ﷻ',
        'Kecintaan Ibadah',
        'Adab dan Akhlak',
        'Kecintaan belajar dan karakter perkembangan',
      ],
      rightTitle: '2. Masing-Masing Anak Berbeda',
      rightOutcome: 'Anak Menjadi Unik • Penumbuhannya Menyesuaikan Keunikan Anak',
      rightItems: [
        'Allah Ta’ala memberikan karunia karakter yang berbeda-beda pada setiap anak',
        'Gaya belajar dan bakat berbeda pada setiap individu anak',
      ],
    },
  },
  {
    id: 'iman',
    title: 'Karakter Iman',
    subtitle: 'Pondasi Tauhid, Kecintaan Syariat & Ilmu sebagai Dasar Perilaku',
    iconColor: 'text-[#ff3b30]',
    accentLineColor: 'bg-[#ff3b30]',
    iconType: 'heart',
    description: [
      'Dengan sepenuh hati guru menyajikan pendidikan iman, menumbuhkan kecintaan dan kesadaran terhadap syariat agama, mencintai ibadah, berakhlak mulia, dan menjadikan ilmu sebagai dasar seluruh perilaku.',
    ],
  },
  {
    id: 'belajar',
    title: 'Karakter Belajar',
    subtitle: 'Menumbuhkan Rasa Ingin Tahu & Ketangguhan Belajar',
    iconColor: 'text-[#f1f5f9]',
    accentLineColor: 'bg-[#38bdf8]',
    iconType: 'brain',
    description: [
      'Anak ditumbuhkan rasa ingin tahunya, menampakkan gaya belajar anak, semangat menjelajah, keberanian mencoba, dan ketangguhan dalam proses belajar. Di sekolah, anak merasa aman meski berbuat salah, karena kesalahan adalah bagian dari perjalanan tumbuh—sebab Allah Ta’ala menciptakan setiap manusia sebagai pembelajar yang tangguh. Apabila kecintaan sudah tumbuh, maka anak akan belajar dengan sendirinya.',
    ],
  },
  {
    id: 'bakat',
    title: 'Karakter Bakat',
    subtitle: 'Menghebat pada Waktunya & Berperan bagi Peradaban',
    iconColor: 'text-[#facc15]',
    accentLineColor: 'bg-[#facc15]',
    iconType: 'podium',
    description: [
      'Setiap anak dianugerahi oleh Allah bakat yang hebat dengan potensi unik. Sekolah membantu mereka menjaga fitrahnya dan mengembangkan bakatnya tanpa terburu-buru, karena setiap anak akan menghebat pada waktunya. Tugas kita adalah menumbuhkan kemandirian anak dalam melaksanakan segala sesuatu yang dipelajarinya.',
      'Setelah kecintaan telah tumbuh, sifat pembelajar telah tumbuh, dan kemandirian telah tumbuh, maka diharapkan anak sudah mulai berperan pada peradaban sebagaimana seorang yang telah tumbuh dewasa—berperan sebagai seseorang yang memiliki akhlak mulia, kreatif, dan produktif.',
    ],
  },
  {
    id: 'perkembangan',
    title: 'Karakter Perkembangan',
    subtitle: 'Proses Bertahap, Sistematis & Berkesinambungan Menuju Kedewasaan',
    iconColor: 'text-[#cbd5e1]',
    accentLineColor: 'bg-[#4ade80]',
    iconType: 'growth',
    description: [
      'Setiap manusia akan mengalami fase perkembangan dalam hidupnya, mulai dari penciptaan sampai usia tua dan tutup usia. Perkembangan manusia adalah proses terjadinya berbagai perubahan bertahap yang dialami individu menuju tingkat kedewasaan atau kematangan, yang berlangsung secara sistematis, berproses, dan berkesinambungan—baik fisik maupun psikis.',
    ],
  },
];

function renderIllustration(type: SlideTopic['iconType'], className = 'w-14 h-14') {
  switch (type) {
    case 'tree':
    case 'equality':
      return <TreeIllustration className={className} />;
    case 'heart':
      return <HeartIllustration className={className} />;
    case 'brain':
      return <BrainIllustration className={className} />;
    case 'podium':
      return <PodiumIllustration className={className} />;
    case 'growth':
      return <GrowthStageIllustration className={className} />;
  }
}

export default function PrincipalGreetingSection({ schoolSlug = 'sd' }: PrincipalGreetingProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  const totalSlides = CHARACTER_SLIDES.length;
  const activeSlide = CHARACTER_SLIDES[activeIndex];

  // Pure automatic rotation without buttons or interruptions
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % totalSlides);
    }, 5500);
    return () => clearInterval(timer);
  }, [totalSlides]);

  return (
    <section className="py-16 sm:py-24 bg-[#f7f9f5] relative overflow-hidden border-b border-emerald-900/10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <ScrollReveal yOffset={24} duration={500}>
          {/* Minimalist Pro Graphic Design Canvas — Deep Forest Green Editorial Poster */}
          <div className="rounded-[28px] bg-[#0d4a22] text-white shadow-2xl relative overflow-hidden">
            {/* Subtle Graphic Design Background Art */}
            <svg
              viewBox="0 0 800 600"
              fill="none"
              className="absolute inset-0 w-full h-full object-cover opacity-[0.06] pointer-events-none"
              preserveAspectRatio="xMidYMid slice"
            >
              <circle cx="720" cy="80" r="260" stroke="#ffffff" strokeWidth="2" />
              <circle cx="720" cy="80" r="190" stroke="#ffffff" strokeWidth="1" />
              <path
                d="M-60 620 C 180 440, 420 560, 860 320"
                stroke="#a3e635"
                strokeWidth="3"
              />
              <path
                d="M-60 560 C 220 380, 460 500, 860 240"
                stroke="#ffffff"
                strokeWidth="1.5"
              />
            </svg>

            {/* Warm Ambient Light Accent */}
            <div className="absolute -top-32 -left-24 w-96 h-96 bg-[#4ade80]/15 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-32 -right-24 w-96 h-96 bg-[#facc15]/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 p-7 sm:p-12 lg:p-16">
              {/* Top Graphic Header & Core Philosophy */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start pb-10 sm:pb-12 border-b border-white/15">
                {/* Left Column: Graphic Display Title */}
                <div className="lg:col-span-5 space-y-3">
                  <p className="text-xs sm:text-sm font-bold uppercase tracking-[0.22em] text-[#facc15]">
                    Sambutan Kepala Sekolah
                  </p>
                  <h2 className="text-3xl sm:text-4xl lg:text-[44px] font-black tracking-tight leading-[1.08] text-white">
                    SDIT Al-Afiyah
                    <span className="block text-[#86efac] font-extrabold text-xl sm:text-2xl mt-2">
                      Bukan Sekadar Tempat Belajar,
                    </span>
                    <span className="block text-[#facc15] font-black text-2xl sm:text-3xl mt-0.5">
                      Namun Juga Tempat Bertumbuh.
                    </span>
                  </h2>

                  <div className="pt-4">
                    <p className="text-sm sm:text-base font-extrabold text-white">
                      Ust. Febrian Fauzi, S.Pd., M.Pd.
                    </p>
                    <p className="text-xs text-emerald-200/80 font-medium">
                      Kepala Sekolah SDIT Al-Afiyah Majalengka
                    </p>
                  </div>
                </div>

                {/* Right Column: Main Literary Paragraph from the Principal */}
                <div className="lg:col-span-7 space-y-4 text-sm sm:text-[15px] lg:text-base text-emerald-50/95 leading-relaxed font-normal">
                  <p className="text-xs sm:text-sm font-bold uppercase tracking-widest text-[#86efac]">
                    Bismillaahirrohmaanirrohiim — Assalamu’alaikum Warahmatullahi Wabarakatuh
                  </p>
                  <p>
                    <strong className="text-white font-bold">SDIT Al-Afiyah</strong> meyakini bahwa setiap anak lahir dalam keadaan <strong className="text-[#facc15] font-bold">fitrah</strong>, yaitu memiliki kecenderungan untuk menerima kebenaran dan mengamalkannya. Karena setiap anak memiliki <strong className="text-white font-semibold">karakter iman</strong>—yaitu dilahirkan dalam keadaan mentauhidkan Allah—setiap anak juga memiliki <strong className="text-white font-semibold">karakter belajar</strong> yang diberikan oleh Allah, serta dianugerahi <strong className="text-white font-semibold">bakat yang unik</strong> dan potensi hebat yang akan tumbuh pada waktunya.
                  </p>
                  <p>
                    Oleh karena itu, sekolah tidak hanya menjadi ruang transfer ilmu, tetapi menjadi lingkungan tumbuh yang aman, menyenangkan, dan penuh makna dengan mengusung konsep <strong className="text-[#86efac] font-bold">Metode Pendidikan Karakter Nabawiyah</strong> yang dibawa oleh generasi terbaik, yaitu generasi Nabi Muhammad ﷺ, para sahabatnya, tabi’in, dan tabi’ut tabi’in.
                  </p>
                </div>
              </div>

              {/* Minimalist Auto-Rotating Motion Stage (No Buttons, No Pills, Pure Editorial Flow) */}
              <div className="pt-10 min-h-[240px] sm:min-h-[210px] flex items-center">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeSlide.id}
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -18 }}
                    transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                    className="w-full"
                  >
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                      {/* Left Graphic Focal Point (Large Vector Symbol + Title) */}
                      <div className="lg:col-span-4 flex flex-col items-start">
                        <motion.div
                          initial={{ scale: 0.85, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ duration: 0.38 }}
                          className={`${activeSlide.iconColor} mb-4`}
                        >
                          {renderIllustration(activeSlide.iconType, 'w-16 h-16 sm:w-20 sm:h-20')}
                        </motion.div>

                        <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-tight">
                          {activeSlide.title}
                        </h3>
                        <div className={`w-14 h-1 ${activeSlide.accentLineColor} mt-3 mb-2`} />
                        <p className="text-xs sm:text-sm text-emerald-100/80 font-medium leading-relaxed">
                          {activeSlide.subtitle}
                        </p>
                      </div>

                      {/* Right Editorial Content Area */}
                      <div className="lg:col-span-8 lg:pl-8 lg:border-l lg:border-white/15 space-y-5">
                        {activeSlide.description.length > 0 && (
                          <div className="space-y-4 text-sm sm:text-base lg:text-[17px] text-white/95 leading-relaxed font-normal">
                            {activeSlide.description.map((para, i) => (
                              <p key={i}>{para}</p>
                            ))}
                          </div>
                        )}

                        {/* Slide 1: 3 Principles in Clean Typographic List */}
                        {activeSlide.numberedPrinciples && (
                          <div className="space-y-4">
                            {activeSlide.numberedPrinciples.map((principle, idx) => (
                              <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.08 * (idx + 1), duration: 0.3 }}
                                className="flex items-baseline gap-4"
                              >
                                <span className="text-xl sm:text-2xl font-black text-[#facc15] shrink-0">
                                  {idx + 1}.
                                </span>
                                <p className="text-sm sm:text-base text-white/95 font-medium leading-relaxed">
                                  {principle}
                                </p>
                              </motion.div>
                            ))}
                          </div>
                        )}

                        {/* Slide 2: Two-Column Editorial Comparison */}
                        {activeSlide.comparisonColumns && (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <motion.div
                              initial={{ opacity: 0, y: 12 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.08, duration: 0.35 }}
                              className="space-y-3"
                            >
                              <h4 className="text-base sm:text-lg font-black text-[#facc15]">
                                {activeSlide.comparisonColumns.leftTitle}
                              </h4>
                              <ul className="space-y-2 text-sm sm:text-[15px] text-white/95">
                                {activeSlide.comparisonColumns.leftItems.map((item, i) => (
                                  <li key={i} className="flex items-start gap-2.5">
                                    <span className="text-[#86efac] font-bold">•</span>
                                    <span>{item}</span>
                                  </li>
                                ))}
                              </ul>
                              <div className="pt-2 flex items-center gap-2 text-sm font-extrabold text-[#86efac]">
                                <Check className="w-5 h-5 stroke-[3] text-white shrink-0" />
                                <span>{activeSlide.comparisonColumns.leftOutcome}</span>
                              </div>
                            </motion.div>

                            <motion.div
                              initial={{ opacity: 0, y: 12 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.16, duration: 0.35 }}
                              className="space-y-3 md:pl-8 md:border-l md:border-white/15"
                            >
                              <h4 className="text-base sm:text-lg font-black text-[#facc15]">
                                {activeSlide.comparisonColumns.rightTitle}
                              </h4>
                              <ul className="space-y-2 text-sm sm:text-[15px] text-white/95">
                                {activeSlide.comparisonColumns.rightItems.map((item, i) => (
                                  <li key={i} className="flex items-start gap-2.5">
                                    <span className="text-[#facc15] font-bold">•</span>
                                    <span>{item}</span>
                                  </li>
                                ))}
                              </ul>
                              <div className="pt-2 flex items-center gap-2 text-sm font-extrabold text-[#facc15]">
                                <Check className="w-5 h-5 stroke-[3] text-white shrink-0" />
                                <span>{activeSlide.comparisonColumns.rightOutcome}</span>
                              </div>
                            </motion.div>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Clean Bottom Sign-off & Links */}
              <div className="mt-10 pt-6 border-t border-white/15 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <p className="text-xs text-emerald-200/80">
                  Wassalamu’alaikum Warahmatullahi Wabarakatuh • Yayasan Pendidikan Imam Bonjol Majalengka
                </p>

                <div className="flex flex-wrap items-center gap-5">
                  <Link
                    href="/sd/profil"
                    className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-white hover:text-[#facc15] transition-colors"
                  >
                    <span>Lihat Profil Lengkap SDIT</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  <Link
                    href="https://wa.me/6281310139001?text=Assalamu%27alaikum%20Kepala%20Sekolah%20SDIT%20Al-Afiyah%2C%20saya%20ingin%20konsultasi%20pendidikan%20ananda"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-xs sm:text-sm font-black text-[#facc15] hover:text-white transition-colors"
                  >
                    <span>Konsultasi via WhatsApp</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
