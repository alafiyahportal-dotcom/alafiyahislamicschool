'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ScrollReveal from './ScrollReveal';

interface PrincipalGreetingProps {
  schoolSlug?: string;
}

const SLIDE_DURATION_MS = 12000; // 12 detik per slide agar nyaman dibaca

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
    subtitle: 'Metode Generasi Terbaik: Rasulullah ﷺ, Para Sahabat, Tabi’in & Tabi’ut Tabi’in',
    principles: [
      'Pendidikan yang meyakini bahwa setiap anak terlahir dalam keadaan fitrah.',
      'Pendidikan yang menjaga dan menumbuhkan karakter-karakter baik yang sudah ada pada diri anak.',
      'Pendidikan yang menggunakan metode pembelajaran yang telah diwahyukan kepada Rasulullah ﷺ.',
    ],
  },
  {
    id: 'kadar-karakter',
    title: 'Kadar Kesamaan & Keunikan Karakter Anak',
    subtitle: 'Karakter pembawaan pada diri setiap anak ditumbuhkan melalui dua pendekatan yang selaras:',
    comparison: {
      leftTitle: '1. Semua Anak Sama',
      leftSubtitle: 'Ditumbuhkan ke Semua Anak',
      leftItems: [
        'Kecintaan kepada Allah ﷻ',
        'Kecintaan kepada Ibadah',
        'Adab dan Akhlak Mulia',
        'Kecintaan Belajar & Karakter Perkembangan',
      ],
      rightTitle: '2. Masing-Masing Anak Berbeda',
      rightSubtitle: 'Anak Menjadi Unik — Menyesuaikan Keunikan Anak',
      rightItems: [
        'Allah Ta’ala memberikan karunia karakter yang berbeda-beda pada setiap anak',
        'Gaya belajar dan bakat yang unik pada masing-masing individu anak',
      ],
    },
  },
  {
    id: 'iman',
    title: 'Karakter Iman',
    subtitle: 'Pondasi Tauhid, Kecintaan Ibadah & Ilmu sebagai Dasar Perilaku',
    quoteOrLead: (
      <>
        Dengan sepenuh hati guru menyajikan <strong className="text-[#064e3b] font-bold">pendidikan iman</strong>, menumbuhkan kecintaan dan kesadaran terhadap <strong className="text-[#064e3b] font-bold">syariat agama</strong>, mencintai ibadah, berakhlak mulia, serta menjadikan <strong className="text-[#064e3b] font-bold">ilmu sebagai dasar seluruh perilaku</strong>.
      </>
    ),
  },
  {
    id: 'belajar',
    title: 'Karakter Belajar',
    subtitle: 'Menumbuhkan Rasa Ingin Tahu dalam Lingkungan yang Aman & Menyenangkan',
    quoteOrLead: (
      <>
        Anak ditumbuhkan <strong className="text-[#064e3b] font-bold">rasa ingin tahunya</strong>, gaya belajarnya, semangat menjelajah, keberanian mencoba, dan ketangguhan dalam belajar. Di sekolah, <strong className="text-[#064e3b] font-bold">anak merasa aman meski berbuat salah</strong>, karena kesalahan adalah bagian dari perjalanan tumbuh—sebab Allah Ta’ala menciptakan setiap manusia sebagai pembelajar yang tangguh. <strong className="text-[#064e3b] font-bold">Apabila kecintaan sudah tumbuh, maka anak akan belajar dengan sendirinya.</strong>
      </>
    ),
  },
  {
    id: 'bakat',
    title: 'Karakter Bakat',
    subtitle: 'Menghebat pada Waktunya & Berperan bagi Peradaban',
    quoteOrLead: (
      <>
        Setiap anak dianugerahi oleh Allah bakat yang hebat dengan potensi unik. Sekolah membantu mereka menjaga fitrahnya dan mengembangkan bakatnya <strong className="text-[#064e3b] font-bold">tanpa terburu-buru, karena setiap anak akan menghebat pada waktunya</strong>. Tugas kita adalah menumbuhkan <strong className="text-[#064e3b] font-bold">kemandirian anak</strong> dalam mengamalkan apa yang dipelajarinya—hingga siap berperan bagi peradaban sebagai pribadi yang <strong className="text-[#064e3b] font-bold">berakhlak mulia, kreatif, dan produktif</strong>.
      </>
    ),
  },
  {
    id: 'perkembangan',
    title: 'Karakter Perkembangan',
    subtitle: 'Proses Bertahap, Sistematis & Berkesinambungan Menuju Kedewasaan',
    quoteOrLead: (
      <>
        Setiap manusia mengalami fase perkembangan dalam hidupnya. Perkembangan manusia adalah <strong className="text-[#064e3b] font-bold">proses perubahan bertahap</strong> menuju tingkat kedewasaan dan kematangan yang berlangsung secara <strong className="text-[#064e3b] font-bold">sistematis, berproses, dan berkesinambungan</strong>—baik secara fisik maupun psikis.
      </>
    ),
  },
];

export default function PrincipalGreetingSection({ schoolSlug = 'sd' }: PrincipalGreetingProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isLocked, setIsLocked] = useState(false);

  const totalSlides = CHARACTER_SLIDES.length;
  const activeSlide = CHARACTER_SLIDES[activeIndex];
  const isPaused = isHovered || isLocked;

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % totalSlides);
    }, SLIDE_DURATION_MS);
    return () => clearInterval(timer);
  }, [isPaused, totalSlides, activeIndex]);

  return (
    <section className="py-16 sm:py-24 bg-[#FAF8F3] relative overflow-hidden border-b border-stone-200/80">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <ScrollReveal yOffset={24} duration={500}>
          {/* Editorial Paper Canvas — High Contrast & Focused on Typography */}
          <div className="rounded-3xl bg-white border border-stone-200/90 shadow-lg shadow-stone-900/5 overflow-hidden">
            {/* Top Editorial Masthead & Core Welcome */}
            <div className="p-7 sm:p-12 lg:p-14 border-b border-stone-200/80">
              <div className="max-w-3xl">
                <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-[#00A651] mb-3">
                  Sambutan Kepala Sekolah SDIT Al-Afiyah
                </p>

                <h2 className="text-2xl sm:text-4xl lg:text-[40px] font-black text-slate-900 tracking-tight leading-[1.15]">
                  Bukan Sekadar Tempat Belajar,{' '}
                  <span className="text-[#064e3b] underline decoration-[#facc15] decoration-4 underline-offset-4">
                    Namun Juga Tempat Bertumbuh.
                  </span>
                </h2>
              </div>

              <div className="mt-7 space-y-4 text-sm sm:text-base lg:text-[17px] text-slate-700 leading-[1.8] font-normal">
                <p className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[#064e3b]">
                  Bismillaahirrohmaanirrohiim — Assalamu’alaikum Warahmatullahi Wabarakatuh
                </p>
                <p>
                  <strong className="text-slate-900 font-bold">SDIT Al-Afiyah</strong> meyakini bahwa setiap anak lahir dalam keadaan <strong className="text-[#064e3b] font-bold">fitrah</strong>, yaitu memiliki kecenderungan untuk menerima kebenaran dan mengamalkannya. Karena setiap anak memiliki <strong className="text-slate-900 font-semibold">karakter iman</strong>—yaitu dilahirkan dalam keadaan mentauhidkan Allah—setiap anak juga memiliki <strong className="text-slate-900 font-semibold">karakter belajar</strong> yang diberikan oleh Allah, serta dianugerahi <strong className="text-slate-900 font-semibold">bakat yang unik</strong> dan potensi hebat yang akan tumbuh pada waktunya.
                </p>
                <p>
                  Oleh karena itu, sekolah tidak hanya menjadi ruang transfer ilmu, tetapi menjadi <strong className="text-[#064e3b] font-bold">lingkungan tumbuh yang aman, menyenangkan, dan penuh makna</strong> dengan mengusung konsep <strong className="text-slate-900 font-bold">Metode Pendidikan Karakter Nabawiyah</strong> yang dibawa oleh generasi terbaik, yaitu generasi Nabi Muhammad ﷺ, para sahabatnya, tabi’in, dan tabi’ut tabi’in.
                </p>
              </div>

              <div className="mt-6 pt-5 border-t border-stone-100 flex items-center justify-between">
                <div>
                  <p className="text-sm sm:text-base font-black text-slate-900">
                    Ust. Febrian Fauzi, S.Pd., M.Pd.
                  </p>
                  <p className="text-xs text-[#064e3b] font-semibold">
                    Kepala Sekolah SDIT Al-Afiyah Majalengka
                  </p>
                </div>
              </div>
            </div>

            {/* Focused Reading Stage — Warm Sage Canvas where the Words Take Center Stage */}
            <div
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              onTouchStart={() => setIsHovered(true)}
              onTouchEnd={() => setIsHovered(false)}
              onClick={() => setIsLocked((prev) => !prev)}
              title={isPaused ? 'Klik untuk melanjutkan putar otomatis' : 'Arahkan kursor atau klik untuk menahan bacaan'}
              className="bg-[#F3F7F2] p-7 sm:p-12 lg:p-14 cursor-pointer select-text transition-colors"
            >
              <div className="min-h-[220px] sm:min-h-[195px] flex flex-col justify-center">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeSlide.id}
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -14 }}
                    transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                    className="border-l-4 border-[#064e3b] pl-5 sm:pl-8 space-y-4"
                  >
                    <div>
                      <h3 className="text-xl sm:text-2xl lg:text-3xl font-black text-[#064e3b] tracking-tight">
                        {activeSlide.title}
                      </h3>
                      <p className="text-xs sm:text-sm font-semibold text-slate-500 mt-1">
                        {activeSlide.subtitle}
                      </p>
                    </div>

                    {/* Large, Focused Typography for the Core Message */}
                    {activeSlide.quoteOrLead && (
                      <p className="text-base sm:text-lg lg:text-[20px] text-slate-800 leading-[1.75] font-normal max-w-4xl">
                        {activeSlide.quoteOrLead}
                      </p>
                    )}

                    {/* Slide 1: 3 Principles */}
                    {activeSlide.principles && (
                      <ol className="space-y-3 pt-1">
                        {activeSlide.principles.map((item, idx) => (
                          <li
                            key={idx}
                            className="flex items-baseline gap-3.5 text-sm sm:text-base lg:text-[18px] text-slate-800 leading-relaxed font-medium"
                          >
                            <span className="text-base sm:text-lg font-black text-[#00A651] shrink-0">
                              {idx + 1}.
                            </span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ol>
                    )}

                    {/* Slide 2: Two-Column Comparison */}
                    {activeSlide.comparison && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-10 pt-2">
                        <div className="space-y-2.5">
                          <h4 className="text-base sm:text-lg font-black text-slate-900">
                            {activeSlide.comparison.leftTitle}
                          </h4>
                          <p className="text-xs font-extrabold uppercase tracking-wider text-[#00A651]">
                            ✓ {activeSlide.comparison.leftSubtitle}
                          </p>
                          <ul className="space-y-1.5 text-sm sm:text-base text-slate-700">
                            {activeSlide.comparison.leftItems.map((item, i) => (
                              <li key={i} className="flex items-start gap-2">
                                <span className="text-[#064e3b] font-bold">•</span>
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="space-y-2.5 md:pl-8 md:border-l md:border-stone-300/80">
                          <h4 className="text-base sm:text-lg font-black text-slate-900">
                            {activeSlide.comparison.rightTitle}
                          </h4>
                          <p className="text-xs font-extrabold uppercase tracking-wider text-amber-700">
                            ✓ {activeSlide.comparison.rightSubtitle}
                          </p>
                          <ul className="space-y-1.5 text-sm sm:text-base text-slate-700">
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

              {/* Minimalist Segmented Progress Lines */}
              <div
                className="grid grid-cols-6 gap-2.5 pt-8"
                onClick={(e) => e.stopPropagation()}
              >
                {CHARACTER_SLIDES.map((slide, idx) => {
                  const isCurrent = idx === activeIndex;
                  const isPast = idx < activeIndex;
                  return (
                    <button
                      key={slide.id}
                      type="button"
                      onClick={() => setActiveIndex(idx)}
                      aria-label={slide.title}
                      className="group py-2 focus:outline-none"
                    >
                      <div className="h-[3px] w-full bg-stone-300/80 overflow-hidden rounded-full">
                        {isCurrent ? (
                          <motion.div
                            key={`${slide.id}-${isPaused ? 'paused' : 'playing'}`}
                            initial={{ width: isPaused ? '100%' : '0%' }}
                            animate={{ width: '100%' }}
                            transition={{
                              duration: isPaused ? 0.15 : SLIDE_DURATION_MS / 1000,
                              ease: 'linear',
                            }}
                            className="h-full bg-[#064e3b]"
                          />
                        ) : (
                          <div
                            className={`h-full transition-colors ${
                              isPast ? 'w-full bg-[#00A651]/60' : 'w-0 group-hover:w-full group-hover:bg-stone-400'
                            }`}
                          />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
