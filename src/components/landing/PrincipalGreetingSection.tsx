'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import ScrollReveal from './ScrollReveal';
import { Quote, Sparkles, CheckCircle2, ArrowRight, ShieldCheck, HeartHandshake, BookOpen } from 'lucide-react';

interface PrincipalGreetingProps {
  schoolSlug?: string;
}

export default function PrincipalGreetingSection({ schoolSlug = 'sd' }: PrincipalGreetingProps) {
  return (
    <section className="py-16 sm:py-24 bg-gradient-to-b from-white via-slate-50/60 to-white relative overflow-hidden border-b border-slate-200/70">
      {/* Decorative ambient background rings */}
      <div className="absolute top-10 right-[-100px] w-96 h-96 bg-emerald-100/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-[-100px] w-96 h-96 bg-teal-100/30 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <ScrollReveal yOffset={24} duration={500} className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <span className="text-xs font-bold text-emerald-800 uppercase tracking-widest bg-emerald-50 px-3.5 py-1.5 rounded-full border border-emerald-200/80 inline-flex items-center gap-1.5 shadow-xs">
            <HeartHandshake className="w-3.5 h-3.5 text-emerald-600" />
            <span>Sambutan Kepala Sekolah</span>
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight mt-3">
            Mendidik dengan Keteladanan, <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-700 via-teal-700 to-emerald-800">
              Menanamkan Adab Sebelum Ilmu
            </span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-2.5 leading-relaxed">
            Pesan hangat dan komitmen pendidikan dari Mudir / Kepala Sekolah SD IT Al-Afiyah Majalengka untuk ayah bunda sekalian.
          </p>
        </ScrollReveal>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Portrait & Identity Card */}
          <div className="lg:col-span-5">
            <ScrollReveal delay={0.1} yOffset={24} duration={500}>
              <div className="relative mx-auto max-w-md bg-white rounded-3xl p-6 sm:p-7 shadow-[0_12px_40px_rgba(0,0,0,0.06)] border border-slate-200/80 overflow-hidden group hover:border-emerald-300 transition-all duration-300">
                {/* Accent Top Bar */}
                <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600" />

                {/* Profile Header */}
                <div className="relative flex flex-col items-center text-center pt-2">
                  <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-2xl p-1 bg-gradient-to-tr from-emerald-600 to-teal-400 shadow-md mb-4">
                    <div className="w-full h-full rounded-[14px] bg-slate-100 flex items-center justify-center overflow-hidden border-2 border-white">
                      {/* Authentic avatar monogram / portrait */}
                      <div className="w-full h-full bg-gradient-to-br from-emerald-700 via-emerald-800 to-slate-900 flex flex-col items-center justify-center text-white">
                        <span className="text-2xl sm:text-3xl font-black tracking-wider">FF</span>
                        <span className="text-[10px] uppercase tracking-widest text-emerald-200 mt-0.5 font-medium">Ust. Febrian</span>
                      </div>
                    </div>
                    <div className="absolute -bottom-2 -right-2 bg-emerald-600 text-white rounded-full p-1.5 shadow-md border-2 border-white">
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                    Ust. Febrian Fauzi, S.Pd.
                  </h3>
                  <p className="text-xs sm:text-sm font-semibold text-emerald-700 mt-0.5">
                    Kepala Sekolah SD IT Al-Afiyah Majalengka
                  </p>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Yayasan Pendidikan Imam Bonjol (YPIB) Majalengka
                  </p>

                  <div className="mt-5 w-full pt-5 border-t border-slate-100 grid grid-cols-2 gap-3 text-left">
                    <div className="bg-emerald-50/60 rounded-xl p-3 border border-emerald-100/80">
                      <p className="text-[10px] font-bold text-emerald-800 uppercase tracking-wide flex items-center gap-1">
                        <BookOpen className="w-3 h-3 text-emerald-600" />
                        <span>Fokus Utama</span>
                      </p>
                      <p className="text-xs font-bold text-slate-800 mt-1">
                        Adab &amp; Tahfidz
                      </p>
                      <p className="text-[10px] text-slate-500 mt-0.5">Metode Talaqqi Tartil</p>
                    </div>

                    <div className="bg-emerald-50/60 rounded-xl p-3 border border-emerald-100/80">
                      <p className="text-[10px] font-bold text-emerald-800 uppercase tracking-wide flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-emerald-600" />
                        <span>Pendekatan</span>
                      </p>
                      <p className="text-xs font-bold text-slate-800 mt-1">
                        Smart Akhlaq Fitrah
                      </p>
                      <p className="text-[10px] text-slate-500 mt-0.5">Karakter Nabawiyah</p>
                    </div>
                  </div>

                  <div className="mt-5 w-full">
                    <Link
                      href="/sd/profil"
                      className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-sm group-hover:shadow"
                    >
                      <span>Lihat Profil &amp; Legalitas SD IT</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>

          {/* Right Column: Editorial Message */}
          <div className="lg:col-span-7">
            <ScrollReveal delay={0.2} yOffset={24} duration={500}>
              <div className="bg-white rounded-3xl p-6 sm:p-9 shadow-sm border border-slate-200/90 relative">
                <Quote className="absolute top-6 right-6 w-12 h-12 text-emerald-100 pointer-events-none" />

                <div className="text-xs font-extrabold text-emerald-700 tracking-wider uppercase mb-2">
                  Bismillaahirrohmaanirrohiim
                </div>
                <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 mb-4 leading-snug">
                  Assalamu’alaikum Warahmatullahi Wabarakatuh
                </h3>

                <div className="space-y-4 text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                  <p>
                    Segala puji hanya bagi Allah Ta’ala yang telah melimpahkan nikmat iman, islam, dan kesehatan kepada kita semua. Shalawat serta salam semoga senantiasa tercurah kepada uswah hasanah kita, Nabi Muhammad ﷺ, beserta keluarga, sahabat, dan pengikutnya hingga akhir zaman.
                  </p>
                  <p>
                    Ayah dan Bunda yang dirahmati Allah, mendidik anak di era modern ini bukan sekadar mengejar angka dan keunggulan akademis kognitif semata. Lebih dari itu, tantangan terpenting kita adalah <strong className="text-slate-800 font-semibold">menjaga fitrah keimanan</strong> anak agar tetap murni serta membekali mereka dengan akhlaqul karimah.
                  </p>
                  <p>
                    Di SD IT Al-Afiyah Majalengka, kami memegang teguh prinsip <span className="bg-emerald-50 text-emerald-900 font-semibold px-2 py-0.5 rounded border border-emerald-200">“Adab Sebelum Ilmu, dan Iman Sebelum Al-Qur’an”</span>. Melalui kurikulum Smart Akhlaq Fitrah dan suasana sekolah yang asri di Lingkungan Giri Asih Majalengka Wetan, kami berikhtiar menciptakan atmosfer belajar yang membahagiakan, ramah anak, dan bebas dari perundungan.
                  </p>
                  <p>
                    Kami menyambut hangat kehadiran putra-putri tercinta Ayah dan Bunda untuk bertumbuh bersama keluarga besar SD IT Al-Afiyah, menjadi generasi sholeh-sholehah yang mencintai Al-Qur’an dan berbakti kepada orang tua.
                  </p>
                </div>

                <div className="mt-6 pt-5 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <p className="text-xs text-slate-500">Wassalamu’alaikum Warahmatullahi Wabarakatuh,</p>
                    <p className="text-sm font-black text-slate-900 mt-1">Ust. Febrian Fauzi, S.Pd.</p>
                    <p className="text-[11px] text-emerald-700 font-semibold">Kepala Sekolah SD IT Al-Afiyah Majalengka</p>
                  </div>

                  <Link
                    href="https://wa.me/6281310139001?text=Assalamu%27alaikum%20Kepala%20Sekolah%20SDIT%20Al-Afiyah%2C%20saya%20ingin%20konsultasi%20pendidikan%20ananda"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-sm hover:shadow active:scale-95"
                  >
                    <span>Konsultasi via WhatsApp</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </div>
    </section>
  );
}
