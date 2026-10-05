'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { getSchoolUrl, SchoolSlug } from '@/lib/domain';
import {
  ArrowRight,
  ShieldCheck,
  Users,
  BookOpen,
  GraduationCap,
  Clock,
  CheckCircle2,
  ExternalLink
} from 'lucide-react';

interface SchoolUnitItem {
  slug: SchoolSlug;
  name: string;
  subdomainLabel: string;
  levelBadge: string;
  badgeBg: string;
  image: string;
  ageGroup: string;
  tahfidzTarget: string;
  curriculum: string;
  features: string[];
  quota: string;
  ppdbHref: string;
}

const units: SchoolUnitItem[] = [
  {
    slug: 'tk',
    name: 'TK IT Al-Afiyah Majalengka',
    subdomainLabel: 'tk.alafiyah.sch.id',
    levelBadge: 'Pendidikan Anak Usia Dini (PAUD/TK)',
    badgeBg: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    image: '/images/tk-hero-kids.jpg',
    ageGroup: 'Usia 4 - 6 Tahun (Kelompok A & B)',
    tahfidzTarget: 'Hafalan Juz 30 & 20 Doa Harian',
    curriculum: 'Kurikulum Merdeka PAUD & Pembiasaan Adab Nabawi',
    features: [
      'Stimulasi Motorik Kasar & Halus Terpadu',
      'Toilet Training & Pembiasaan Mandiri',
      'Sentra Belajar Kreatif & Islami'
    ],
    quota: 'Tersedia 40 Kursi',
    ppdbHref: '/ppdb/daftar?school=tk'
  },
  {
    slug: 'sd',
    name: 'SDIT Al-Afiyah Majalengka',
    subdomainLabel: 'sd.alafiyah.sch.id',
    levelBadge: 'Smart Akhlaq Fitrah • SDIT',
    badgeBg: 'bg-amber-100 text-amber-900 border-amber-300',
    image: '/images/sd-spmb-poster-2027.jpg',
    ageGroup: 'Usia 6 - 12 Tahun (Kelas 1 s/d 6)',
    tahfidzTarget: 'Tahfidz Juz 30 Mutqin & Karakter Nabawiyah',
    curriculum: 'Kurikulum Merdeka + Pendidikan Karakter Nabawiyah',
    features: [
      'Bukan Sekadar Belajar Namun Tempat Bertumbuh',
      'Mendidik dengan Sunnah & Iman Sebelum Qur\'an',
      'Outdoor Learning, Kebun Asri & Greenhouse',
      'Pelatihan Aqil-Baligh, Skill & Kemandirian'
    ],
    quota: 'Kuota Terbatas: Hanya 2 Rombel',
    ppdbHref: '/ppdb/daftar?school=sd'
  },
  {
    slug: 'smp',
    name: 'SMP IT Al-Afiyah Majalengka',
    subdomainLabel: 'smp.alafiyah.sch.id',
    levelBadge: 'Sekolah Menengah Pertama Islam Terpadu',
    badgeBg: 'bg-teal-100 text-teal-900 border-teal-300',
    image: '/images/eduka-about-portrait.jpg',
    ageGroup: 'Usia 12 - 15 Tahun (Fullday School)',
    tahfidzTarget: 'Target 3 s/d 5 Juz Mutqin & Tartil',
    curriculum: 'Kurikulum Nasional Terpadu + Sains & Teknologi',
    features: [
      'Program Khusus Tahfidz & Tasmi\' Al-Qur\'an Tartil',
      'Pengembangan Bahasa Arab & Inggris Aktif',
      'Leadership Murid & Kesiapan Menuju SMA Unggulan'
    ],
    quota: 'Tersedia 60 Kursi',
    ppdbHref: '/ppdb/daftar?school=smp'
  }
];

export default function EdukaUnitCards() {
  return (
    <section id="unit-pendidikan" className="py-20 lg:py-28 bg-[#F8FAFC] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-14 sm:mb-16">
          <div className="inline-flex items-center px-3.5 py-1.5 rounded-full bg-amber-100/80 border border-amber-300 text-amber-900 text-xs font-bold uppercase tracking-wider">
            <span>UNIT PENDIDIKAN AL-AFIYAH</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Pilihan Jenjang Pendidikan{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-orange-600">
              Terbaik untuk Ananda
            </span>
          </h2>

          <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
            Setiap unit dirancang berjenjang dengan pembinaan berkesinambungan mulai dari usia dini hingga jenjang menengah pertama dengan fasilitas modern.
          </p>
        </div>

        {/* 3 Large Course / Unit Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {units.map((unit) => {
            const schoolUrl = getSchoolUrl(unit.slug);

            return (
              <div
                key={unit.slug}
                className="group bg-white rounded-3xl overflow-hidden border border-slate-200/80 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 flex flex-col justify-between"
              >
                <div>
                  {/* Card Image Banner - Clickable to School Subdomain */}
                  <a
                    href={schoolUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="relative h-60 w-full block overflow-hidden cursor-pointer"
                    title={`Kunjungi Website Resmi ${unit.name} (Buka di Tab Baru)`}
                  >
                    <Image
                      src={unit.image}
                      alt={unit.name}
                      fill
                      className="object-cover object-center group-hover:scale-110 transition-transform duration-700"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                    {/* Top Left Badge */}
                    <div className="absolute top-4 left-4">
                      <span className={`inline-block px-3 py-1 rounded-full text-[11px] font-bold border backdrop-blur-md shadow-xs ${unit.badgeBg}`}>
                        {unit.levelBadge}
                      </span>
                    </div>

                    {/* Subdomain Pill Overlay (Top Right) */}
                    <div className="absolute top-4 right-4 flex items-center space-x-1 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full text-amber-300 text-[10px] font-mono font-bold border border-white/10 shadow-xs">
                      <span>{unit.subdomainLabel}</span>
                      <ExternalLink className="w-3 h-3" />
                    </div>

                    {/* Accreditation Badge Overlay */}
                    <div className="absolute bottom-3 left-4 flex items-center space-x-1.5 bg-black/50 backdrop-blur-md px-2.5 py-1 rounded-full text-white text-xs font-bold">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Terakreditasi Resmi</span>
                    </div>

                    {/* Quota Badge Right */}
                    <div className="absolute bottom-3 right-4 bg-amber-500 text-white font-bold text-[10px] px-2.5 py-1 rounded-full shadow-xs">
                      {unit.quota}
                    </div>
                  </a>

                  {/* Card Content Body */}
                  <div className="p-6 sm:p-7 space-y-4">
                    
                    {/* Unit Title */}
                    <h3 className="text-xl font-extrabold text-slate-900 group-hover:text-[#184F48] transition-colors leading-snug">
                      <a
                        href={schoolUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:underline flex items-center justify-between gap-2"
                        title={`Buka web resmi ${unit.name} di tab baru`}
                      >
                        <div className="flex items-center gap-2.5">
                          {unit.slug === 'sd' && (
                            <img
                              src="/images/sd-logo.png"
                              alt="Logo SD IT Al-Afiyah"
                              className="w-7 h-7 object-contain shrink-0"
                            />
                          )}
                          <span>{unit.name}</span>
                        </div>
                        <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-[#184F48] shrink-0 ml-2" />
                      </a>
                    </h3>

                    {/* Meta Specs */}
                    <div className="space-y-2 text-xs text-slate-600 border-y border-slate-100 py-3">
                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4 text-amber-500 flex-shrink-0" />
                        <span>{unit.ageGroup}</span>
                      </div>
                      <div className="flex items-center space-x-2 font-semibold text-[#184F48]">
                        <BookOpen className="w-4 h-4 text-[#2D7A70] flex-shrink-0" />
                        <span>{unit.tahfidzTarget}</span>
                      </div>
                    </div>

                    {/* Key Highlights Bullet List */}
                    <div className="space-y-2 pt-1">
                      {unit.features.map((feat, idx) => (
                        <div key={idx} className="flex items-start space-x-2 text-xs text-slate-600">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>

                  </div>
                </div>

                {/* Card Footer Actions */}
                <div className="p-6 pt-0 border-t border-slate-100/80 mt-4 flex items-center justify-between gap-3">
                  <a
                    href={schoolUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-1/2 py-2.5 text-center rounded-xl border border-slate-200 hover:border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors flex items-center justify-center space-x-1"
                    title="Buka website resmi di tab baru"
                  >
                    <span>Web Resmi Unit</span>
                    <ExternalLink className="w-3 h-3 text-slate-500" />
                  </a>
                  <Link
                    href={unit.ppdbHref}
                    className="w-1/2 py-2.5 text-center rounded-xl bg-[#2D7A70] hover:bg-[#184F48] text-white text-xs font-bold shadow-sm hover:shadow-md transition-all flex items-center justify-center space-x-1.5"
                  >
                    <span>Daftar Unit</span>
                    <ArrowRight className="w-3.5 h-3.5 text-amber-300" />
                  </Link>
                </div>

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
