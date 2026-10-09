'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { getSchoolUrl } from '@/lib/domain';
import {
  ArrowRight,
  BookOpen,
  ShieldCheck,
  Leaf,
  Award,
  Globe,
} from 'lucide-react';

interface UnitCardData {
  id: string;
  name: string;
  hashtag: string;
  image: string;
  features: Array<{
    icon: React.ComponentType<{ className?: string }>;
    text: string;
    iconColor: string;
  }>;
  description: string;
  primaryBtnText: string;
  primaryBtnLink: string;
  secondaryBtnText?: string;
  secondaryBtnLink?: string;
  isFeatured?: boolean;
}

const unitCards: UnitCardData[] = [
  {
    id: 'tk',
    name: 'PAUD & TK IT Al-Afiyah',
    hashtag: '# PAUD & TKIT',
    image: '/images/tk-hero-kids.jpg',
    features: [
      {
        icon: Award,
        text: 'Sentra Fitrah & Karakter Usia Emas',
        iconColor: 'text-amber-600',
      },
      {
        icon: BookOpen,
        text: 'Hafalan Juz 30 & Doa Harian Aplikatif',
        iconColor: 'text-[#0D5C54]',
      },
    ],
    description:
      'Memadukan stimulasi fitrah usia emas dengan pengenalan huruf hijaiyah ceria, pembiasaan adab harian nabawiyah, sentra eksplorasi motorik, dan toilet training dengan bimbingan ustadzah penuh kasih sayang.',
    primaryBtnText: 'Profil TK IT',
    primaryBtnLink: getSchoolUrl('tk'),
    secondaryBtnText: 'Daftar SPMB TK',
    secondaryBtnLink: '/ppdb/daftar?school=tk',
  },
  {
    id: 'sd',
    name: 'SD IT Al-Afiyah',
    hashtag: '# SDIT Smart Akhlak Fitrah',
    image: '/images/sd-hero-greenhouse.jpg',
    isFeatured: true,
    features: [
      {
        icon: ShieldCheck,
        text: 'Smart Akhlak Fitrah & Sunnah Nabawiyah',
        iconColor: 'text-amber-600',
      },
      {
        icon: Leaf,
        text: 'Outdoor Learning & Greenhouse Agro-Sains',
        iconColor: 'text-[#0D5C54]',
      },
    ],
    description:
      'Bukan sekadar tempat belajar, SD IT Al-Afiyah adalah tempat bertumbuh yang mendidik dengan keteladanan sunnah Rasulullah ﷺ, penanaman iman sebelum Al-Qur\'an, tahfidz Juz 30 mutqin, serta literasi numerasi sains modern.',
    primaryBtnText: 'Profil SD IT',
    primaryBtnLink: getSchoolUrl('sd'),
    secondaryBtnText: 'Daftar SPMB SD',
    secondaryBtnLink: '/ppdb/daftar?school=sd',
  },
  {
    id: 'smp',
    name: 'SMP IT Al-Afiyah',
    hashtag: '# SMPIT Fullday & Asrama',
    image: '/images/smp-hero-fullday.jpg',
    features: [
      {
        icon: Award,
        text: 'Target Tahfidz 3 s/d 5 Juz Mutqin',
        iconColor: 'text-amber-600',
      },
      {
        icon: Globe,
        text: 'Bilingual (Arab-Inggris) & Sains Teknologi',
        iconColor: 'text-[#0D5C54]',
      },
    ],
    description:
      'Sekolah Menengah Pertama Islam Terpadu dengan sistem fullday school dan asrama unggulan. Memadukan penguasaan akademik berstandar nasional, pembiasaan adab kemandirian aqil-baligh, dan kepemimpinan islami.',
    primaryBtnText: 'Profil SMP IT',
    primaryBtnLink: getSchoolUrl('smp'),
    secondaryBtnText: 'Daftar SPMB SMP',
    secondaryBtnLink: '/ppdb/daftar?school=smp',
  },
];

export default function SatuanPendidikanSection() {
  return (
    <section
      id="satuan-pendidikan"
      className="py-20 lg:py-28 relative overflow-hidden bg-gradient-to-b from-[#F7FAF9] via-[#FAF7F2]/50 to-[#F8FAFC]"
    >
      {/* Background Soft Organic Flow Accents */}
      <div className="absolute top-0 right-0 w-[550px] h-[550px] bg-[#0D5C54]/5 rounded-full blur-3xl pointer-events-none -mr-40 -mt-20" />
      <div className="absolute bottom-10 left-0 w-[450px] h-[450px] bg-amber-400/5 rounded-full blur-3xl pointer-events-none -ml-40" />

      {/* Decorative Subtle Organic Grid */}
      <div
        className="absolute inset-0 opacity-[0.025] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(#0D5C54 1.5px, transparent 1.5px)`,
          backgroundSize: '32px 32px',
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* ===================================================
            SECTION HEADER: Al-Irsyad Style Kicker, Title & Institutional Narrative
            =================================================== */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 lg:gap-12 mb-12 lg:mb-16">
          {/* Left Title & Kicker */}
          <div className="lg:max-w-xl">
            <div className="inline-flex items-center space-x-2 text-[#0D5C54] font-bold text-xs sm:text-sm tracking-wider uppercase mb-3">
              <span className="w-2.5 h-2.5 rounded-full bg-[#D97706]" />
              <span>DI YAYASAN PENDIDIKAN IMAM BONJOL MAJALENGKA</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#08433D] tracking-tight leading-[1.12]">
              Satuan{' '}
              <span className="text-[#0D5C54]">Pendidikan</span>
            </h2>

            <p className="mt-4 text-sm sm:text-base text-slate-700 leading-relaxed font-normal">
              Yayasan Pendidikan Imam Bonjol Majalengka merupakan wadah pendidikan
              Islam terpadu yang mengembangkan pendidikan keislaman nabawiyah dan umum secara
              harmonis, untuk mencetak generasi Muslim yang kuat dalam iman, luas dalam ilmu,
              serta adaptif terhadap perkembangan zaman.
            </p>
          </div>

          {/* Right Narrative & Action Button */}
          <div className="lg:max-w-md flex flex-col items-start lg:items-end justify-between">
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal mb-5 lg:text-right">
              Seluruh satuan pendidikan dirancang berkesinambungan: mulai dari
              PAUD &amp; TK IT usia emas, SD IT dengan karakter Smart Akhlak Fitrah,
              hingga SMP IT unggulan dengan sistem fullday &amp; asrama.
            </p>

            <Link
              href="/satuan-pendidikan"
              className="inline-flex items-center space-x-2.5 px-7 py-3.5 rounded-full bg-[#0D5C54] hover:bg-[#08433D] text-white font-semibold text-sm sm:text-base shadow-md hover:shadow-lg transition-all duration-200 transform hover:-translate-y-0.5 group"
            >
              <span>Lihat Selengkapnya</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

        {/* ===================================================
            3 SATUAN PENDIDIKAN CARDS: TK IT, SD IT, SMP IT
            Symmetric, Generous 3-Column Grid matching Al-Irsyad Style
            =================================================== */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 items-stretch">
          {unitCards.map((card, idx) => (
            <div
              key={card.id}
              className={`bg-white rounded-3xl p-6 sm:p-7 shadow-[0_4px_25px_rgba(0,0,0,0.05)] hover:shadow-[0_16px_40px_rgba(13,92,84,0.12)] border transition-all duration-300 flex flex-col justify-between group ${
                card.isFeatured
                  ? 'border-[#2D7A70]/30 shadow-[0_8px_30px_rgba(13,92,84,0.08)] lg:-translate-y-2'
                  : 'border-slate-100'
              }`}
            >
              <div>
                {/* Inset Top Image Banner (Curved inside card padding) */}
                <div className="relative w-full aspect-[16/10] rounded-2xl overflow-hidden mb-5 bg-slate-100 shadow-2xs">
                  <Image
                    src={card.image}
                    alt={card.name}
                    fill
                    className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  {card.isFeatured && (
                    <div className="absolute top-3 right-3 bg-[#0D5C54]/90 backdrop-blur-md text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
                      Smart Akhlak Fitrah
                    </div>
                  )}
                </div>

                {/* Card Title */}
                <h3 className="text-xl sm:text-2xl font-bold text-[#0D5C54] group-hover:text-[#08433D] transition-colors leading-snug">
                  {card.name}
                </h3>

                {/* Hashtag / Sub-badge */}
                <span className="text-slate-400 font-semibold text-xs sm:text-sm tracking-wide mt-1 mb-3.5 block">
                  {card.hashtag}
                </span>

                {/* Highlight Feature Box (Reference Al-Irsyad Style) */}
                <div className="bg-[#FAF7F2] border border-[#EFE9DF] rounded-xl p-3 sm:p-3.5 my-3.5 space-y-2 text-xs text-slate-700">
                  {card.features.map((feat, fIdx) => {
                    const IconComp = feat.icon;
                    return (
                      <div key={fIdx} className="flex items-center space-x-2 font-medium">
                        <IconComp className={`w-4 h-4 ${feat.iconColor} shrink-0`} />
                        <span className="leading-snug">{feat.text}</span>
                      </div>
                    );
                  })}
                </div>

                {/* Description Paragraph */}
                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mb-6 font-normal">
                  {card.description}
                </p>
              </div>

              {/* Action Buttons (Clean Outlined Rounded Pills) */}
              <div className="flex flex-col sm:flex-row gap-2.5 pt-2 mt-auto">
                <Link
                  href={card.primaryBtnLink}
                  className="flex-1 border border-[#2D7A70] text-[#0D5C54] hover:bg-[#0D5C54] hover:text-white rounded-full py-2.5 px-4 font-semibold text-xs sm:text-sm transition-all duration-200 text-center block shadow-2xs"
                >
                  {card.primaryBtnText}
                </Link>
                {card.secondaryBtnText && card.secondaryBtnLink && (
                  <Link
                    href={card.secondaryBtnLink}
                    target={card.secondaryBtnLink.startsWith('http') ? '_blank' : undefined}
                    rel={card.secondaryBtnLink.startsWith('http') ? 'noopener noreferrer' : undefined}
                    className="flex-1 border border-[#2D7A70]/30 text-[#2D7A70] hover:bg-[#F2F8F7] hover:border-[#2D7A70] rounded-full py-2.5 px-4 font-semibold text-xs sm:text-sm transition-all duration-200 text-center block"
                  >
                    {card.secondaryBtnText}
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
