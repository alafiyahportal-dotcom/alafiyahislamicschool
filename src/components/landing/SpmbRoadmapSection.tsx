'use client';

import React from 'react';
import Link from 'next/link';
import ScrollReveal from './ScrollReveal';
import { ArrowRight, PhoneCall } from 'lucide-react';

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
      title: 'Isi Formulir Online',
      badge: 'Tahap 1',
      actionText: 'Daftar Sekarang',
      href: ppdbUrl,
      desc: 'Isi biodata singkat calon murid secara online.',
    },
    {
      num: '02',
      title: 'Biaya & Berkas',
      badge: 'Tahap 2',
      actionText: 'Info Biaya',
      href: '/sd/spmb#biaya',
      desc: `Transfer formulir Rp ${registrationFee.toLocaleString('id-ID')} & unggah berkas.`,
    },
    {
      num: '03',
      title: 'Observasi & Ta’aruf',
      badge: 'Tahap 3',
      actionText: 'Info Observasi',
      href: '/sd/spmb',
      desc: 'Observasi kesiapan anak (bukan tes calistung) & wawancara.',
    },
    {
      num: '04',
      title: 'Pengumuman & Daftar Ulang',
      badge: 'Tahap 4',
      actionText: 'Cek Pengumuman',
      href: '/sd/spmb/pengumuman',
      desc: 'Hasil seleksi via WhatsApp & daftar ulang.',
    },
  ];

  return (
    <section 
      id="spmb-roadmap" 
      className="py-14 sm:py-16 bg-gradient-to-br from-[#064e3b] via-[#047857] to-[#00A651] scroll-mt-16 sm:scroll-mt-20 w-full text-white relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <ScrollReveal yOffset={24} duration={500} className="mb-8 max-w-2xl">
          <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-[#ffd51e] mb-2">
            <span className="w-5 h-[2px] bg-[#ffd51e] rounded-full inline-block" />
            <span>Alur Pendaftaran SPMB</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight">
            4 Langkah Mudah Daftar <span className="text-[#ffd51e]">SDIT Al-Afiyah</span>
          </h2>
        </ScrollReveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {steps.map((step, idx) => (
            <ScrollReveal
              key={step.num}
              delay={(idx % 4) * 0.1}
              yOffset={24}
              duration={500}
              className="h-full flex flex-col"
            >
              <Link
                href={step.href}
                className="bg-white rounded-2xl p-5 border-2 border-white/90 shadow-lg hover:shadow-2xl hover:border-[#ffd51e] hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between h-full group text-slate-900 cursor-pointer"
              >
                <div className="pb-3">
                  <div className="flex items-center justify-between mb-2.5">
                    <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-[#064e3b] border border-[#064e3b]/20">
                      {step.badge}
                    </span>
                    <span className="text-xs font-black text-[#064e3b] font-mono">{step.num}</span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mb-1.5 group-hover:text-[#064e3b] transition-colors">
                    {step.title}
                  </h3>
                  <p className="text-xs text-slate-600 leading-snug">
                    {step.desc}
                  </p>
                </div>
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between w-full text-xs font-bold text-[#064e3b]">
                  <span>{step.actionText}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#064e3b] group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal delay={0.2} yOffset={20} duration={500} className="mt-8">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 sm:p-6 border border-white/15 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-center md:text-left">
              <h4 className="text-base sm:text-lg font-bold text-white">
                Kuota Terbatas Hanya 2 Rombel
              </h4>
              <p className="text-xs text-emerald-100/90 mt-0.5">
                Segera amankan kursi putra-putri Anda di Gelombang 1.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 shrink-0">
              <Link
                href={ppdbUrl}
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#ffd51e] hover:bg-yellow-400 text-[#064e3b] text-xs sm:text-sm font-black transition-all shadow-md active:scale-95"
              >
                <span>Daftar Sekarang</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                href={`https://wa.me/${waCenterPhone.replace(/[^0-9]/g, '')}?text=Assalamu%27alaikum%20Panitia%20SPMB%20SDIT%20Al-Afiyah%2C%20saya%20ingin%20konsultasi%20pendaftaran`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white/15 hover:bg-white/20 text-white text-xs sm:text-sm font-semibold transition-all border border-white/20"
              >
                <PhoneCall className="w-3.5 h-3.5 text-emerald-300" />
                <span>Hubungi Panitia</span>
              </Link>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
