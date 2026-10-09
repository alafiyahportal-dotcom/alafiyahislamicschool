'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Star,
  Quote,
  ArrowRight,
  PhoneCall,
  Calendar,
  CheckCircle2,
  ShieldCheck
} from 'lucide-react';
import { getStoredReferralCode } from '@/lib/referral';

interface TestimonialItem {
  name: string;
  role: string;
  unit: string;
  quote: string;
  rating: number;
}

const testimonials: TestimonialItem[] = [
  {
    name: 'Bpk. Hendra Gunawan, S.T.',
    role: 'Wali Murid Kelas 4 SDIT',
    unit: 'SDIT Al-Afiyah',
    quote:
      'Alhamdulillah, ananda Farhan sejak masuk SDIT Al-Afiyah menjadi sangat gemar membaca Al-Qur’an. Hafalannya sudah masuk Juz 29 dan shalat fardhu selalu di awal waktu tanpa harus disuruh.',
    rating: 5
  },
  {
    name: 'Ibu Hj. Siti Aisyah, M.Pd.',
    role: 'Wali Murid Putri Kelas 8 SMP IT Al-Afiyah',
    unit: 'SMP IT Al-Afiyah',
    quote:
      'Program Fullday di SMP IT Al-Afiyah sangat berkualitas dan kekeluargaan. Dewan gurunya mendidik dengan penuh keteladanan dan kasih sayang, hafalan ananda terjaga mutqin serta percakapan bahasa Arab dan Inggrisnya berkembang pesat.',
    rating: 5
  },
  {
    name: 'Bpk. dr. Ridwan Kamiludin',
    role: 'Wali Murid TK B',
    unit: 'TK IT Al-Afiyah',
    quote:
      'Sistem pembiasaan mandiri dan toilet training di TK IT Al-Afiyah sangat luar biasa. Guru-gurunya sabar dan telaten. Sangat merekomendasikan untuk orang tua di Majalengka.',
    rating: 5
  }
];

export default function TestimonialAndCtaSection() {
  const [refCode, setRefCode] = useState<string | null>(null);
  const [isOpeningSpmb, setIsOpeningSpmb] = useState(false);

  useEffect(() => {
    setRefCode(getStoredReferralCode());
  }, []);

  let targetUrl = '/ppdb/daftar';
  if (refCode) {
    targetUrl += `?ref=${encodeURIComponent(refCode)}`;
  }

  return (
    <section className="py-20 lg:py-28 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-14">
          <div className="inline-flex items-center px-3.5 py-1.5 rounded-full bg-amber-100/80 border border-amber-300 text-amber-900 text-xs font-bold uppercase tracking-wider">
            <span>TESTIMONI WALI MURID</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Apa Kata Para Orang Tua{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-orange-600">
              Tentang Al-Afiyah?
            </span>
          </h2>

          <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
            Kepercayaan ratusan keluarga di Kabupaten Majalengka adalah amanah terbesar kami dalam mendidik generasi penerus bangsa.
          </p>
        </div>

        {/* 3 Testimonial Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mb-20">
          {testimonials.map((t, idx) => (
            <div
              key={idx}
              className="bg-slate-50/80 rounded-3xl p-7 border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between relative group hover:bg-white"
            >
              <div className="space-y-4">
                {/* Star Ratings + Quote Icon */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1">
                    {[...Array(t.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />
                    ))}
                  </div>
                  <Quote className="w-8 h-8 text-amber-200 group-hover:text-amber-400 transition-colors" />
                </div>

                {/* Quote Text */}
                <p className="text-sm text-slate-700 leading-relaxed italic">
                  “{t.quote}”
                </p>
              </div>

              {/* Author Info */}
              <div className="pt-6 border-t border-slate-200/80 mt-6 flex items-center justify-between">
                <div>
                  <div className="font-extrabold text-sm text-slate-900">{t.name}</div>
                  <div className="text-xs text-slate-500">{t.role}</div>
                </div>
                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#E8F3F1] text-[#184F48] border border-[#2D7A70]/30">
                  {t.unit}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* ================================================================= */}
        {/* HIGH-CONVERSION PPDB CALL TO ACTION BANNER (Eduka Style)          */}
        {/* ================================================================= */}
        <div className="relative rounded-3xl overflow-hidden shadow-2xl bg-gradient-to-br from-[#184F48] via-[#2D7A70] to-amber-700 text-white p-8 sm:p-12 lg:p-16">
          {/* Subtle Background Pattern */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-400/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Content */}
            <div className="lg:col-span-8 space-y-4 text-left">
              <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/20 backdrop-blur-md">
                <Calendar className="w-4 h-4 text-amber-300" />
                <span className="text-xs font-bold uppercase tracking-wider text-amber-200">
                  SPMB TAHUN PELAJARAN 2027 / 2028
                </span>
              </div>

              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white leading-tight">
                Pendaftaran Murid Baru Telah Dibuka! Kuota Terbatas.
              </h2>

              <p className="text-sm sm:text-base text-slate-100 max-w-2xl leading-relaxed">
                Segera daftarkan ananda untuk mendapatkan fasilitas beasiswa prestasi, diskon pendaftaran gelombang dini, dan kemudahan proses online yang dapat diselesaikan dalam 5 menit.
              </p>

              <div className="flex flex-wrap items-center gap-4 text-xs text-amber-100/90 pt-1">
                <div className="flex items-center space-x-1.5">
                  <CheckCircle2 className="w-4 h-4 text-amber-300" />
                  <span>Isi Formulir Cepat</span>
                </div>
                <span>•</span>
                <div className="flex items-center space-x-1.5">
                  <CheckCircle2 className="w-4 h-4 text-amber-300" />
                  <span>Kuitansi Digital Instan</span>
                </div>
                <span>•</span>
                <div className="flex items-center space-x-1.5">
                  <CheckCircle2 className="w-4 h-4 text-amber-300" />
                  <span>Ukur Seragam Online</span>
                </div>
              </div>
            </div>

            {/* Right Buttons */}
            <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-3 justify-center">
              <a
                href={targetUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => {
                  setIsOpeningSpmb(true);
                  setTimeout(() => setIsOpeningSpmb(false), 2000);
                }}
                className="px-8 py-4 rounded-full bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold text-sm sm:text-base shadow-xl shadow-amber-950/30 transition-all flex items-center justify-center space-x-2 cursor-pointer transform hover:-translate-y-0.5 active:scale-95 group text-center"
              >
                {isOpeningSpmb ? (
                  <>
                    <span className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin shrink-0" />
                    <span>Membuka SPMB...</span>
                  </>
                ) : (
                  <>
                    <span>Daftar SPMB Online</span>
                    <ArrowRight className="w-4 h-4 text-slate-950 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </a>

              <a
                href="https://wa.me/6282123456789?text=Assalamu%27alaikum,%20saya%20ingin%20bertanya%20mengenai%20pendaftaran%20murid%20baru%20Al-Afiyah."
                target="_blank"
                rel="noopener noreferrer"
                className="px-7 py-3.5 rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/30 font-bold text-xs sm:text-sm backdrop-blur-md transition-all flex items-center justify-center space-x-2 cursor-pointer text-center"
              >
                <PhoneCall className="w-4 h-4 text-amber-300" />
                <span>Konsultasi Panitia SPMB</span>
              </a>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
