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
      time: 'Waktu: ± 5-10 Menit',
      icon: FileText,
      tagline: '28 Poin Standar Dapodik',
      desc: 'Orang tua mengisi formulir biodata ananda & keluarga secara online melalui portal SPMB SD IT. Langsung mendapatkan ID Pendaftaran resmi serta akses kartu pendaftaran.',
    },
    {
      num: '02',
      title: 'Infaq Pendaftaran & Berkas',
      badge: 'Tahap 2',
      time: 'Verifikasi Otomatis',
      icon: CreditCard,
      tagline: `Infaq Rp ${registrationFee.toLocaleString('id-ID')}`,
      desc: 'Penyelesaian infaq formulir melalui transfer ke rekening resmi yayasan dan upload dokumen kelengkapan (scan Akta Kelahiran, Kartu Keluarga, dan KTP orang tua) via portal.',
    },
    {
      num: '03',
      title: 'Observasi Fitrah & Ta’aruf',
      badge: 'Tahap 3',
      time: 'Ramah & Membahagiakan',
      icon: Users,
      tagline: 'Bukan Tes Tulis Kognitif',
      desc: 'Ananda diajak berinteraksi riang untuk pemetaan fitrah, kematangan motorik & sensorik. Ayah Bunda mengikuti sesi ta’aruf untuk menyelaraskan visi tarbiyah rumah dan sekolah.',
    },
    {
      num: '04',
      title: 'Pengumuman & Daftar Ulang',
      badge: 'Tahap 4',
      time: 'Penyambutan Murid',
      icon: GraduationCap,
      tagline: 'Kuota 2 Rombel Terbatas',
      desc: 'Hasil kelulusan diumumkan via portal & WhatsApp resmi. Dilanjutkan pelunasan infaq sarana pendidikan, pengukuran seragam resmi, dan pengenalan lingkungan sekolah (ta’aruf).',
    },
  ];

  return (
    <section 
      id="spmb-roadmap" 
      className="py-16 sm:py-20 bg-emerald-950 scroll-mt-16 sm:scroll-mt-20 w-full text-white relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header - Styled Exactly Like Program Unggulan */}
        <ScrollReveal yOffset={24} duration={500} className="mb-12 max-w-3xl">
          <span className="text-xs font-bold text-white uppercase tracking-widest bg-[#00A651] px-3.5 py-1.5 rounded-full border border-emerald-400/30 inline-block shadow-sm">
            Tahapan SPMB T.A. 2027/2028
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight mt-3">
            4 Langkah Mudah Menjadi Murid <span className="text-amber-400">SD IT Al-Afiyah</span>
          </h2>
          <p className="text-xs sm:text-sm text-emerald-100/90 mt-2 max-w-2xl leading-relaxed">
            Sistem penerimaan yang ramah keluarga, transparan, dan terintegrasi digital tanpa prosedur yang berbelit.
          </p>
        </ScrollReveal>

        {/* 4 Steps - White High-Contrast Cards matching Program Unggulan */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, idx) => (
            <ScrollReveal
              key={step.num}
              delay={(idx % 4) * 0.12}
              yOffset={24}
              duration={500}
              className="h-full flex flex-col"
            >
              <div className="bg-white rounded-2xl p-5 border border-white/90 shadow-md hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between h-full group text-slate-900">
                <div className="flex-1 pb-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="inline-block px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-[#007638] border border-[#00A651]/20">
                      {step.badge}
                    </span>
                    <span className="text-xs font-black text-[#00A651] font-mono">{step.num}</span>
                  </div>
                  <h3 className="text-sm sm:text-base font-bold text-slate-900 mb-1 group-hover:text-[#00A651] transition-colors leading-snug">
                    {step.title}
                  </h3>
                  <p className="text-[11px] font-semibold text-[#00A651] mb-2">
                    {step.tagline}
                  </p>
                  <p className="text-xs text-slate-600 leading-relaxed font-normal">
                    {step.desc}
                  </p>
                </div>
                <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between w-full text-xs font-semibold text-[#00A651]">
                  <span>{step.time}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#00A651] group-hover:translate-x-0.5 transition-all" />
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>

        {/* Direct Action Banner at Bottom */}
        <ScrollReveal delay={0.3} yOffset={20} duration={500} className="mt-12 sm:mt-16">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-white/15 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left">
              <h4 className="text-lg sm:text-xl font-bold text-white">
                Siap Mendaftarkan Ananda di SD IT Al-Afiyah?
              </h4>
              <p className="text-xs sm:text-sm text-emerald-100/90 mt-1">
                Kuota rombel terbatas hanya 2 kelas (maks. 60 murid) untuk menjamin kualitas pembinaan intensif.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 shrink-0">
              <Link
                href={ppdbUrl}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#00A651] hover:bg-[#008f45] text-white text-xs sm:text-sm font-bold transition-all shadow-md active:scale-95"
              >
                <span>Daftar Formulir Sekarang</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                href={`https://wa.me/${waCenterPhone.replace(/[^0-9]/g, '')}?text=Assalamu%27alaikum%20Panitia%20SPMB%20SDIT%20Al-Afiyah%2C%20saya%20ingin%20konsultasi%20tahapan%20pendaftaran`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white/15 hover:bg-white/20 text-white text-xs sm:text-sm font-semibold transition-all border border-white/20"
              >
                <PhoneCall className="w-3.5 h-3.5 text-emerald-300" />
                <span>Tanya Panitia SPMB</span>
              </Link>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
