'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import {
  Play,
  X,
  ShieldCheck,
  Building2,
  Compass,
  HeartHandshake,
  CheckCircle2
} from 'lucide-react';

export default function VideoTourSection() {
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

  const pillars = [
    {
      title: 'Lingkungan Sekolah Asri & Nyaman',
      desc: 'Lingkungan sekolah yang mandiri yang tenang, rindang, dan ramah anak di Kabupaten Majalengka.',
      icon: Building2,
      accent: 'text-emerald-600 bg-emerald-50'
    },
    {
      title: 'Pembiasaan Adab & Ibadah Terjadwal',
      desc: 'Shalat fardhu berjamaah, dhuha bersama, doa harian, dan pembinaan karakter istiqomah.',
      icon: HeartHandshake,
      accent: 'text-amber-600 bg-amber-50'
    },
    {
      title: 'Portal Murid Mandiri Online',
      desc: 'Kemudahan cek kelulusan, jadwal observasi, kuitansi lunas kas, hingga ukuran seragam.',
      icon: Compass,
      accent: 'text-teal-600 bg-teal-50'
    },
    {
      title: 'Legalitas Resmi & Terakreditasi',
      desc: 'Izin operasional lengkap Dinas Pendidikan dan Kemenag dengan status Terakreditasi BAN-S/M Resmi.',
      icon: ShieldCheck,
      accent: 'text-sky-600 bg-sky-50'
    }
  ];

  return (
    <section id="fasilitas" className="py-20 lg:py-28 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-12 sm:mb-16">
          <div className="inline-flex items-center px-3.5 py-1.5 rounded-full bg-emerald-100/80 border border-emerald-300 text-emerald-900 text-xs font-bold uppercase tracking-wider">
            <span>TUR FASILITAS &amp; SUASANA SEKOLAH</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Mengapa Ratusan Wali Murid{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2D7A70] to-[#184F48]">
              Mempercayakan Ananda
            </span>{' '}
            di Al-Afiyah?
          </h2>

          <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
            Saksikan bagaimana para murid belajar, menghafal Al-Qur’an, dan bertumbuh dalam suasana penuh kasih sayang dan dedikasi.
          </p>
        </div>

        {/* Video Banner Container with Pulsating Play Button (Eduka Style) */}
        <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-slate-100 aspect-video max-h-[480px] w-full mx-auto group">
          <Image
            src="/images/eduka-hero-campus.jpg"
            alt="Tur Video Lingkungan Sekolah Al-Afiyah Majalengka"
            fill
            className="object-cover object-center group-hover:scale-105 transition-transform duration-700"
            sizes="(max-width: 1280px) 100vw, 1200px"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/30" />

          {/* Centered Pulsating Play Button */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4">
            <button
              onClick={() => setIsVideoModalOpen(true)}
              aria-label="Putar Tur Video Sekolah"
              className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-tr from-amber-500 to-orange-500 text-white flex items-center justify-center shadow-2xl shadow-amber-500/50 hover:scale-110 transition-transform cursor-pointer group"
            >
              {/* Pulsating Ripple Rings */}
              <span className="absolute inset-0 rounded-full bg-amber-400 animate-ping opacity-35 pointer-events-none" />
              <Play className="w-8 h-8 sm:w-10 sm:h-10 fill-white translate-x-1" />
            </button>

            <h3 className="mt-6 text-xl sm:text-2xl font-bold text-white drop-shadow-md">
              Tur Suasana Lingkungan Sekolah Al-Afiyah
            </h3>
            <p className="text-xs sm:text-sm text-slate-200 mt-1 max-w-md">
              Klik untuk melihat keseharian murid, fasilitas kelas multimedia, lab komputer, dan lingkungan belajar.
            </p>
          </div>
        </div>

        {/* 4 Pillars Under Video */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
          {pillars.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-slate-50 border border-slate-100 hover:border-[#2D7A70]/40 hover:bg-white transition-all shadow-xs hover:shadow-lg space-y-3"
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${item.accent}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-base text-slate-900 leading-snug">
                  {item.title}
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            );
          })}
        </div>

      </div>

      {/* Video Modal Player */}
      {isVideoModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="relative w-full max-w-4xl bg-slate-900 rounded-2xl overflow-hidden shadow-2xl border border-white/20">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 bg-slate-950 text-white border-b border-white/10">
              <div className="flex items-center space-x-2">
                <span className="text-sm font-bold">Profil &amp; Tur Lingkungan Sekolah Al-Afiyah Majalengka</span>
              </div>
              <button
                onClick={() => setIsVideoModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Video Player Frame */}
            <div className="relative aspect-video w-full bg-black flex items-center justify-center">
              <iframe
                className="w-full h-full"
                src="https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?autoplay=1"
                title="Tur Lingkungan Sekolah Al-Afiyah"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
