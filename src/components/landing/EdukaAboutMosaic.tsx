'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Award,
  BookCheck,
  HeartHandshake,
  CheckCircle2,
  PhoneCall,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';

export default function EdukaAboutMosaic() {
  return (
    <section id="profil" className="py-20 lg:py-28 bg-white relative overflow-hidden">
      {/* Subtle Background Geometric Accents */}
      <div className="absolute top-10 right-0 w-96 h-96 bg-amber-50 rounded-full blur-3xl -z-10 pointer-events-none" />
      <div className="absolute bottom-10 left-0 w-96 h-96 bg-[#2D7A70]/5 rounded-full blur-3xl -z-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* ================================================================= */}
          {/* LEFT COLUMN: MOSAIC MULTI-PHOTO WITH ARCH FRAMES & BADGES        */}
          {/* ================================================================= */}
          <div className="lg:col-span-6 relative">
            <div className="grid grid-cols-12 gap-3 sm:gap-4 items-center">
              
              {/* Main Vertical Photo with Rounded Arch Top */}
              <div className="col-span-7 relative">
                <div className="relative h-[380px] sm:h-[460px] rounded-t-[100px] rounded-b-2xl overflow-hidden shadow-2xl border-4 border-white">
                  <Image
                    src="/images/eduka-about-portrait.jpg"
                    alt="Murid Putri Berprestasi Al-Afiyah"
                    fill
                    className="object-cover object-center transform hover:scale-105 transition-transform duration-700"
                    sizes="(max-width: 768px) 100vw, 35vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                  
                  {/* Floating Pill on bottom of arch */}
                  <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-xl shadow-lg border border-slate-100 flex items-center space-x-2.5">
                    <div className="w-8 h-8 rounded-lg bg-emerald-100 text-[#2D7A70] flex items-center justify-center font-bold text-xs flex-shrink-0">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-[11px] font-extrabold text-slate-900 leading-tight">Terakreditasi Resmi</div>
                      <div className="text-[10px] text-slate-500 font-medium">BAN-S/M &amp; Kemenag</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Stack of Mosaic Photos */}
              <div className="col-span-5 space-y-3 sm:space-y-4">
                
                {/* Secondary Photo: Group Classroom Study */}
                <div className="relative h-[180px] sm:h-[210px] rounded-2xl overflow-hidden shadow-xl border-4 border-white">
                  <Image
                    src="/images/eduka-study-group.jpg"
                    alt="Pembelajaran Al-Qur'an dan Sains Interaktif"
                    fill
                    className="object-cover object-center transform hover:scale-105 transition-transform duration-700"
                    sizes="(max-width: 768px) 100vw, 25vw"
                  />
                </div>

                {/* Third Photo: Students or Tahfidz Activity */}
                <div className="relative h-[150px] sm:h-[180px] rounded-2xl overflow-hidden shadow-xl border-4 border-white">
                  <Image
                    src="/images/arc-ustadz.jpg"
                    alt="Bimbingan Dewan Guru Al-Afiyah"
                    fill
                    className="object-cover object-center transform hover:scale-105 transition-transform duration-700"
                    sizes="(max-width: 768px) 100vw, 25vw"
                  />
                </div>

              </div>
            </div>

            {/* Floating Warm Golden Experience Badge (Eduka Style) */}
            <div className="absolute bottom-2 left-2 sm:-bottom-6 sm:-left-6 bg-gradient-to-br from-amber-500 to-orange-600 text-white p-3.5 sm:p-5 rounded-2xl shadow-xl shadow-amber-600/30 border-2 border-white flex items-center space-x-3 transform hover:scale-105 transition-transform max-w-[calc(100%-16px)]">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center flex-shrink-0">
                <Award className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
              </div>
              <div>
                <div className="text-xl sm:text-3xl font-extrabold font-mono leading-none">30+</div>
                <div className="text-[10px] sm:text-xs font-semibold text-amber-100 uppercase tracking-wider mt-0.5 whitespace-nowrap">
                  Tahun Amanah Mendidik
                </div>
              </div>
            </div>

          </div>

          {/* ================================================================= */}
          {/* RIGHT COLUMN: TEXT CONTENT, HIGHLIGHTS, STATS & HOTLINE          */}
          {/* ================================================================= */}
          <div className="lg:col-span-6 space-y-6 text-left">
            
            {/* Tagline Badge */}
            <div className="inline-flex items-center px-3 sm:px-3.5 py-1.5 rounded-full bg-amber-100/80 border border-amber-300 text-amber-900 max-w-full">
              <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider truncate">
                TENTANG YAYASAN PENDIDIKAN IMAM BONJOL
              </span>
            </div>

            {/* Headline */}
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight leading-[1.2]">
              Sistem Pendidikan Islam Terpadu yang{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-orange-600">
                Menginspirasi Masa Depan
              </span>{' '}
              Ananda
            </h2>

            {/* Body Text */}
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              Yayasan Pendidikan Imam Bonjol Majalengka mengelola ekosistem pendidikan Al-Afiyah yang menaungi jenjang <strong>TK IT</strong>, <strong>SD IT</strong>, dan <strong>SMP IT</strong>. Kami memadukan kurikulum resmi pemerintah dengan keunggulan Al-Qur’an (Tahfidz &amp; Tahsin), pembinaan akhlakul karimah, serta literasi sains dan teknologi masa kini.
            </p>

            {/* 2 Feature Points with Circular Badges */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 hover:border-amber-200 transition-colors">
                <div className="w-10 h-10 rounded-lg bg-amber-500/10 text-amber-700 flex items-center justify-center mb-3">
                  <BookCheck className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-sm text-slate-900 mb-1">Kurikulum Terpadu</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Integrasi Kurikulum Merdeka Kemendikbud &amp; Kemenag dengan muatan lokal tahfidz.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 hover:border-emerald-200 transition-colors">
                <div className="w-10 h-10 rounded-lg bg-emerald-500/10 text-[#2D7A70] flex items-center justify-center mb-3">
                  <HeartHandshake className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-sm text-slate-900 mb-1">Karakter &amp; Adab Mulia</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Pembiasaan shalat berjamaah, hafalan hadits pilihan, dan adab murid dalam keseharian.
                </p>
              </div>
            </div>

            {/* Quote / Satisfaction Counter Box */}
            <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200/80 flex items-center space-x-4">
              <div className="text-3xl sm:text-4xl font-extrabold font-mono text-amber-600">
                99%
              </div>
              <p className="text-xs sm:text-sm text-amber-950 font-medium leading-snug">
                Tingkat kepuasan orang tua murid atas perkembangan hafalan Al-Qur’an, kemandirian ibadah, dan prestasi akademik ananda.
              </p>
            </div>

            {/* Dual Actions: Button + WhatsApp Hotline Pill */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center space-y-3 sm:space-y-0 sm:space-x-5">
              <Link
                href="/ppdb/daftar"
                className="px-7 py-3.5 rounded-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-bold text-sm shadow-lg shadow-amber-600/20 hover:shadow-amber-600/40 transition-all flex items-center justify-center space-x-2 cursor-pointer group"
              >
                <span>Daftar Murid Baru</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>

              <a
                href="https://wa.me/6282123456789?text=Assalamu%27alaikum%20Admin%20Yayasan%20Imam%20Bonjol%20Al-Afiyah,%20saya%20ingin%20konsultasi%20pendidikan%20ananda."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center space-x-3 px-5 py-3 rounded-full bg-[#E8F3F1] hover:bg-[#D4EBE7] text-[#184F48] transition-colors cursor-pointer border border-[#2D7A70]/30"
              >
                <div className="w-8 h-8 rounded-full bg-[#2D7A70] text-white flex items-center justify-center flex-shrink-0">
                  <PhoneCall className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <div className="text-[10px] text-slate-500 uppercase font-semibold">Konsultasi Hotline</div>
                  <div className="text-xs font-extrabold text-[#184F48] font-mono">+62 821-2345-6789</div>
                </div>
              </a>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
