'use client';

import React from 'react';
import Link from 'next/link';
import ScrollReveal from './ScrollReveal';
import { 
  FileText, 
  CreditCard, 
  Users, 
  GraduationCap, 
  ArrowRight, 
  CheckCircle2, 
  Clock, 
  PhoneCall
} from 'lucide-react';

interface SpmbRoadmapProps {
  registrationFee?: number;
  waCenterPhone?: string;
  ppdbUrl?: string;
}

export default function SpmbRoadmapSection({
  registrationFee = 250000,
  waCenterPhone = '0813-1013-9001',
  ppdbUrl = '/sd/spmb/daftar'
}: SpmbRoadmapProps) {
  const steps = [
    {
      num: '01',
      title: 'Registrasi Formulir Digital',
      badge: 'Tahap 1',
      time: '± 5-10 Menit',
      icon: FileText,
      tagline: '28 Poin Standar Dapodik',
      desc: 'Orang tua mengisi formulir biodata ananda & keluarga secara online melalui portal SPMB SD IT. Langsung mendapatkan ID Pendaftaran resmi serta akses kartu pendaftaran.',
      color: 'from-emerald-500 to-teal-600',
    },
    {
      num: '02',
      title: 'Infaq Pendaftaran & Berkas',
      badge: 'Tahap 2',
      time: 'Verifikasi Cepat',
      icon: CreditCard,
      tagline: `Infaq Rp ${registrationFee.toLocaleString('id-ID')}`,
      desc: 'Penyelesaian infaq formulir melalui transfer ke rekening resmi yayasan dan upload dokumen kelengkapan (scan Akta Kelahiran, Kartu Keluarga, dan KTP orang tua) via portal.',
      color: 'from-teal-600 to-emerald-700',
    },
    {
      num: '03',
      title: 'Observasi Fitrah & Ta’aruf',
      badge: 'Tahap 3',
      time: 'Ramah & Membahagiakan',
      icon: Users,
      tagline: 'Bukan Tes Tulis Kognitif',
      desc: 'Ananda diajak berinteraksi riang untuk pemetaan fitrah, kematangan motorik & sensorik. Ayah Bunda mengikuti sesi ta’aruf untuk menyelaraskan visi tarbiyah rumah dan sekolah.',
      color: 'from-emerald-600 to-green-700',
    },
    {
      num: '04',
      title: 'Pengumuman & Daftar Ulang',
      badge: 'Tahap 4',
      time: 'Penyambutan Murid',
      icon: GraduationCap,
      tagline: 'Kuota 2 Rombel Terbatas',
      desc: 'Hasil kelulusan diumumkan via portal & WhatsApp resmi. Dilanjutkan pelunasan infaq sarana pendidikan, pengukuran seragam resmi, dan pengenalan lingkungan sekolah (ta’aruf).',
      color: 'from-green-600 to-emerald-800',
    },
  ];

  return (
    <section className="py-16 sm:py-24 bg-slate-900 text-white relative overflow-hidden border-b border-slate-800">
      {/* Background glow effects */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute inset-0 opacity-5 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <ScrollReveal yOffset={24} duration={500} className="text-center max-w-3xl mx-auto mb-14 sm:mb-18">
          <span className="text-xs font-bold text-emerald-300 uppercase tracking-widest bg-emerald-950/80 px-3.5 py-1.5 rounded-full border border-emerald-500/30 inline-flex items-center gap-1.5 shadow-inner">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00A651]" />
            <span>Alur Pendaftaran Resmi TP 2027/2028</span>
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight mt-3">
            4 Langkah Mudah Menjadi Murid <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-teal-200 to-green-300">
              SD IT Al-Afiyah Majalengka
            </span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-2.5 leading-relaxed">
            Sistem penerimaan yang ramah keluarga, transparan, dan terintegrasi digital tanpa prosedur yang berbelit.
          </p>
        </ScrollReveal>

        {/* 4 Steps Visual Roadmap Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 lg:gap-6 relative">
          {/* Connector Line behind cards on desktop */}
          <div className="hidden lg:block absolute top-1/2 left-8 right-8 h-0.5 bg-gradient-to-r from-emerald-500/30 via-emerald-400/50 to-teal-500/30 -translate-y-12 z-0 pointer-events-none" />

          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <ScrollReveal
                key={step.num}
                delay={idx * 0.1}
                yOffset={24}
                duration={500}
                className="relative z-10"
              >
                <div className="h-full bg-slate-800/90 rounded-2xl sm:rounded-3xl p-5 sm:p-6 border border-slate-700/80 hover:border-emerald-400/60 shadow-lg hover:shadow-emerald-950/50 transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1">
                  <div>
                    {/* Top step indicator */}
                    <div className="flex items-center justify-between gap-2 mb-4">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center font-mono font-black text-base text-white shadow-md shadow-emerald-900/50 group-hover:scale-105 transition-transform">
                        {step.num}
                      </div>
                      <span className="text-[10px] font-bold text-emerald-300 uppercase tracking-wider px-2.5 py-1 rounded-full bg-emerald-950/70 border border-emerald-500/30">
                        {step.badge}
                      </span>
                    </div>

                    <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-emerald-300 transition-colors leading-snug">
                      {step.title}
                    </h3>

                    <p className="text-[11px] font-semibold text-emerald-400/90 mt-1">
                      {step.tagline}
                    </p>

                    <p className="text-xs text-slate-300/80 mt-3 leading-relaxed font-normal">
                      {step.desc}
                    </p>
                  </div>

                  {/* Card bottom timing badge */}
                  <div className="mt-5 pt-3.5 border-t border-slate-700/60 flex items-center justify-between text-[11px] font-medium text-slate-400">
                    <span className="flex items-center gap-1.5 text-emerald-300">
                      <Clock className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{step.time}</span>
                    </span>
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 opacity-60 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>
              </ScrollReveal>
            );
          })}
        </div>

        {/* Action CTA Bar */}
        <ScrollReveal delay={0.4} yOffset={20} duration={500} className="mt-12 sm:mt-16">
          <div className="bg-gradient-to-r from-emerald-950/80 via-slate-800 to-slate-900 rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-emerald-500/30 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left">
              <h4 className="text-lg sm:text-xl font-bold text-white">
                Siap Mendaftarkan Ananda di SD IT Al-Afiyah?
              </h4>
              <p className="text-xs sm:text-sm text-slate-300 mt-1">
                Kuota rombel terbatas hanya 2 kelas (maks. 60 murid) untuk menjamin kualitas pembinaan intensif.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 shrink-0">
              <Link
                href={ppdbUrl}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#00A651] hover:bg-[#008f45] text-white text-xs sm:text-sm font-bold transition-all shadow-lg shadow-emerald-900/40 hover:-translate-y-0.5 active:scale-95"
              >
                <span>Daftar Formulir Sekarang</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                href={`https://wa.me/${waCenterPhone.replace(/[^0-9]/g, '')}?text=Assalamu%27alaikum%20Panitia%20SPMB%20SDIT%20Al-Afiyah%2C%20saya%20ingin%20konsultasi%20tahapan%20pendaftaran`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs sm:text-sm font-semibold transition-all border border-slate-700"
              >
                <PhoneCall className="w-3.5 h-3.5 text-emerald-400" />
                <span>Tanya Panitia SPMB</span>
              </Link>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
