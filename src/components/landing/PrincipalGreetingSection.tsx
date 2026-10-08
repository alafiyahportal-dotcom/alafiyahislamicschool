'use client';

import React from 'react';
import Link from 'next/link';
import ScrollReveal from './ScrollReveal';
import { Quote, ArrowRight, HeartHandshake } from 'lucide-react';

interface PrincipalGreetingProps {
  schoolSlug?: string;
}

export default function PrincipalGreetingSection({ schoolSlug = 'sd' }: PrincipalGreetingProps) {
  return (
    <section className="py-16 sm:py-20 bg-gradient-to-b from-white via-slate-50/60 to-white relative overflow-hidden border-b border-slate-200/70">
      {/* Decorative ambient background rings */}
      <div className="absolute top-10 right-[-100px] w-96 h-96 bg-emerald-100/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-[-100px] w-96 h-96 bg-teal-100/30 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <ScrollReveal yOffset={24} duration={500} className="text-center max-w-2xl mx-auto mb-10 sm:mb-12">
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

        {/* Direct Editorial Message Card (Tanpa Tab Profil Terpisah Sesuai Arahan User) */}
        <ScrollReveal delay={0.15} yOffset={24} duration={500}>
          <div className="bg-white rounded-3xl p-6 sm:p-10 lg:p-12 shadow-sm border border-slate-200/90 relative overflow-hidden">
            <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-emerald-600 via-[#00A651] to-emerald-700" />
            <Quote className="absolute top-6 right-6 sm:top-8 sm:right-8 w-12 h-12 text-emerald-100/80 pointer-events-none" />

            <div className="text-xs font-extrabold text-[#007638] tracking-wider uppercase mb-2">
              Bismillaahirrohmaanirrohiim
            </div>
            <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 mb-5 leading-snug">
              Assalamu’alaikum Warahmatullahi Wabarakatuh
            </h3>

            <div className="space-y-4 text-xs sm:text-sm sm:text-[15px] text-slate-700 leading-relaxed font-normal">
              <p>
                Segala puji hanya bagi Allah Ta’ala yang telah melimpahkan nikmat iman, islam, dan kesehatan kepada kita semua. Shalawat serta salam semoga senantiasa tercurah kepada uswah hasanah kita, Nabi Muhammad ﷺ, beserta keluarga, sahabat, dan pengikutnya hingga akhir zaman.
              </p>
              <p>
                Ayah dan Bunda yang dirahmati Allah, mendidik anak di era modern ini bukan sekadar mengejar angka dan keunggulan akademis kognitif semata. Lebih dari itu, tantangan terpenting kita adalah <strong className="text-slate-900 font-semibold">menjaga fitrah keimanan</strong> anak agar tetap murni serta membekali mereka dengan akhlaqul karimah.
              </p>
              <p>
                Di SD IT Al-Afiyah Majalengka, kami memegang teguh prinsip <span className="bg-emerald-50 text-emerald-950 font-semibold px-2 py-0.5 rounded border border-emerald-200">“Adab Sebelum Ilmu, dan Iman Sebelum Al-Qur’an”</span>. Melalui kurikulum Smart Akhlaq Fitrah dan suasana sekolah yang asri di Lingkungan Giri Asih Majalengka Wetan, kami berikhtiar menciptakan atmosfer belajar yang membahagiakan, ramah anak, dan bebas dari perundungan.
              </p>
              <p>
                Kami menyambut hangat kehadiran putra-putri tercinta Ayah dan Bunda untuk bertumbuh bersama keluarga besar SD IT Al-Afiyah, menjadi generasi sholeh-sholehah yang mencintai Al-Qur’an dan berbakti kepada orang tua.
              </p>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
              <div>
                <p className="text-xs text-slate-500">Wassalamu’alaikum Warahmatullahi Wabarakatuh,</p>
                <p className="text-base font-black text-slate-900 mt-1">Ust. Febrian Fauzi, S.Pd.</p>
                <p className="text-xs text-[#007638] font-semibold">Kepala Sekolah SD IT Al-Afiyah Majalengka</p>
                <p className="text-[11px] text-slate-400 mt-0.5">Yayasan Pendidikan Imam Bonjol (YPIB) Majalengka</p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <Link
                  href="/sd/profil"
                  className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-all"
                >
                  <span>Lihat Profil SD IT</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
                <Link
                  href="https://wa.me/6281310139001?text=Assalamu%27alaikum%20Kepala%20Sekolah%20SDIT%20Al-Afiyah%2C%20saya%20ingin%20konsultasi%20pendidikan%20ananda"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#00A651] hover:bg-[#008f45] text-white text-xs font-bold transition-all shadow-sm hover:shadow active:scale-95"
                >
                  <span>Konsultasi via WhatsApp</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
