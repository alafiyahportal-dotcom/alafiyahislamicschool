'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight, ChevronUp, Phone, Mail, Send, LogIn } from 'lucide-react';
import { getSchoolUrl, extractSubdomain, SchoolSlug } from '@/lib/domain';
import FooterVisitorBadge from '@/components/shared/FooterVisitorBadge';

export interface FooterProps {
  schoolSlug?: 'tk' | 'sd' | 'smp' | 'foundation';
}

export default function Footer({ schoolSlug }: FooterProps = {}) {
  const pathname = usePathname() || '';
  const [clientSubdomain, setClientSubdomain] = useState<SchoolSlug | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const sub = extractSubdomain(window.location.host);
      if (sub) setClientSubdomain(sub);
    }
  }, []);

  if (pathname.startsWith('/admin')) {
    return null;
  }

  // Determine active unit: explicit prop > client subdomain > pathname prefix > foundation
  const activeSlug: 'tk' | 'sd' | 'smp' | 'foundation' =
    schoolSlug ||
    clientSubdomain ||
    (pathname === '/tk' || pathname.startsWith('/tk/') || pathname.startsWith('/tk#')
      ? 'tk'
      : pathname === '/sd' || pathname.startsWith('/sd/') || pathname.startsWith('/sd#')
      ? 'sd'
      : pathname === '/smp' || pathname.startsWith('/smp/') || pathname.startsWith('/smp#')
      ? 'smp'
      : 'foundation');

  const scrollToTop = () => {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const unitConfig = {
    sd: {
      displayName: 'SD IT Al-Afiyah',
      copyrightText: '© Copyright SD IT Al-Afiyah x modula.studio 2026.',
      bgMain: 'bg-[#003831]',
      secondaryLogoUrl: '/images/ypib-logo.png',
      logoUrl: '/images/sd-logo.png',
      accreditationLabel: 'Terakreditasi B BAN-S/M',
      pillarTitle: 'Karakter Nabawiyah',
      pillarSubtitle: 'Tahfidz Juz 30 Mutqin',
      address:
        'Lingkungan Giri Asih - Jl. Gerakan Koperasi, Kel. Majalengka Kulon, Kec. Majalengka, Kab. Majalengka, Jawa Barat 45411',
      phones: ['+62 813-1013-9001'],
      email: 'sditalafiyahmjl@gmail.com',
      contactHref: '/sd/kontak',
      loginHref: '/login?unit=sd',
      sitemapLinks: [
        { label: 'Profil, Visi dan Misi', href: '/sd/profil' },
        { label: 'Program Unggulan & Tahfidz', href: '/sd/program' },
        { label: 'Pilar Karakter Nabawiyah', href: '/sd/karakter' },
        { label: 'Struktur & Dewan Pendidik', href: '/sd/guru' },
        { label: 'Informasi & FAQ SPMB', href: '/sd/spmb' },
        { label: 'Berita & Kegiatan Sekolah', href: '/sd/berita' },
        { label: 'Mitra Affiliate SPMB', href: '/affiliate/register?unit=sd' },
      ],
    },
    smp: {
      displayName: 'SMP IT Al-Afiyah',
      copyrightText: '© Copyright SMP IT Al-Afiyah x modula.studio 2026.',
      bgMain: 'bg-[#030164]',
      secondaryLogoUrl: '/images/ypib-logo.png',
      logoUrl: '/images/smp-logo.png',
      accreditationLabel: 'Terakreditasi A BAN-PDM',
      pillarTitle: 'Be Smart & Religious',
      pillarSubtitle: 'Tahfidz 3-5+ Juz & Bahasa Arab',
      address:
        'Lingkungan Giri Asih - Jl. Gerakan Koperasi No. 110, Majalengka Wetan, Kec. Majalengka, Kab. Majalengka, Jawa Barat 45411',
      phones: ['+62 822-4935-7893'],
      email: 'smpit@alafiyah.id',
      contactHref: '/smp/kontak',
      loginHref: '/login?unit=smp',
      sitemapLinks: [
        { label: 'Profil, Visi dan Misi', href: '/smp/profil' },
        { label: '6 Program Unggulan SMP IT', href: '/smp/program' },
        { label: 'SCD & Mutaba’ah Digital', href: '/smp/karakter' },
        { label: 'Struktur & Dewan Pendidik', href: '/smp/guru' },
        { label: 'Informasi & Biaya SPMB', href: '/smp/spmb' },
        { label: 'Berita & Kegiatan Santri', href: '/smp/berita' },
        { label: 'Mitra Affiliate SPMB', href: '/affiliate/register?unit=smp' },
      ],
    },
    tk: {
      displayName: 'TK IT Al-Afiyah',
      copyrightText: '© Copyright TK IT Al-Afiyah x modula.studio 2026.',
      bgMain: 'bg-[#003831]',
      secondaryLogoUrl: '/images/ypib-logo.png',
      logoUrl: '/images/ypib-logo.png',
      accreditationLabel: 'Terakreditasi Resmi PAUD',
      pillarTitle: 'Sentra Bermain Islami',
      pillarSubtitle: 'Doa Harian & Juz 30 Ceria',
      address:
        'Kompleks Pendidikan Islam Imam Bonjol, Kec. Majalengka, Kab. Majalengka, Jawa Barat 45419',
      phones: ['+62 812-2334-4552'],
      email: 'tkit@alafiyah.id',
      contactHref: '/kontak',
      loginHref: '/login?unit=tk',
      sitemapLinks: [
        { label: 'Profil Sentra Ceria', href: '/tk#values' },
        { label: 'Program Usia Dini & Adab', href: '/tk#programs' },
        { label: 'Dewan Guru & Bunda Asatidzah', href: '/tk#teachers' },
        { label: 'Fasilitas & Arena Bermain', href: '/tk#facilities' },
        { label: 'Formulir SPMB TK IT Online', href: '/ppdb/daftar?school=tk' },
        { label: 'Mitra Affiliate SPMB', href: '/affiliate?school=tk' },
      ],
    },
    foundation: {
      displayName: 'Yayasan Pendidikan Imam Bonjol',
      copyrightText: '© Copyright Yayasan Pendidikan Imam Bonjol x modula.studio 2026.',
      bgMain: 'bg-[#003831]',
      secondaryLogoUrl: null,
      logoUrl: '/images/ypib-logo.png',
      accreditationLabel: 'Yayasan Pendidikan Resmi',
      pillarTitle: 'Tahfidz & Karakter',
      pillarSubtitle: 'TK IT • SD IT • SMP IT',
      address:
        'Lingkungan Giri Asih - Jl. Gerakan Koperasi, Kec. Majalengka, Kab. Majalengka, Jawa Barat 45411',
      phones: ['+62 813-1013-9001', '+62 822-4935-7893'],
      email: 'info@alafiyah.id',
      contactHref: '/kontak',
      loginHref: '/login',
      sitemapLinks: [
        { label: 'Profil & Visi Misi Yayasan', href: '/profil' },
        { label: 'TK IT Al-Afiyah', href: getSchoolUrl('tk') },
        { label: 'SD IT Al-Afiyah', href: getSchoolUrl('sd') },
        { label: 'SMP IT Al-Afiyah', href: getSchoolUrl('smp') },
        { label: 'Berita & Khazanah', href: '/berita' },
        { label: 'Mitra Affiliate Al-Afiyah', href: '/affiliate' },
      ],
    },
  };

  const current = unitConfig[activeSlug];

  return (
    <footer className="relative w-full font-sans overflow-x-clip">
      {/* =====================================================================
          TOP MAIN FOOTER AREA (MINIMALIST AL-HIDAYAH / PRADITA 3-COLUMN MODEL)
      ===================================================================== */}
      <div className={`${current.bgMain} text-white pt-14 pb-14 sm:pt-16 sm:pb-16`}>
        <div className="max-w-6xl mx-auto px-6 sm:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 items-start">
            {/* COLUMN 1: Link / Peta Situs */}
            <div className="lg:col-span-4 space-y-5">
              <h2 className="text-xl sm:text-[22px] font-extrabold text-white tracking-tight">
                Link / Peta Situs
              </h2>

              <ul className="space-y-3 text-sm sm:text-[14.5px]">
                {current.sitemapLinks.map((item, idx) => (
                  <li key={idx}>
                    <Link
                      href={item.href}
                      className="group inline-flex items-center gap-2.5 text-white/95 hover:text-[#e5bc20] transition-colors"
                    >
                      <ChevronRight className="w-4 h-4 text-[#e5bc20] stroke-[2.5] shrink-0" />
                      <span>{item.label}</span>
                    </Link>
                  </li>
                ))}
                <li>
                  <Link
                    href={current.loginHref}
                    className="group inline-flex items-center gap-2.5 text-[#e5bc20] hover:text-amber-300 font-semibold transition-colors"
                  >
                    <LogIn className="w-4 h-4 text-[#e5bc20] stroke-[2.5] shrink-0" />
                    <span>Login Portal Admin &amp; Staf</span>
                  </Link>
                </li>
              </ul>
            </div>

            {/* COLUMN 2: Informasi */}
            <div className="lg:col-span-4 space-y-5">
              <h2 className="text-xl sm:text-[22px] font-extrabold text-white tracking-tight">
                Informasi
              </h2>

              <ul className="space-y-3.5 text-sm sm:text-[14.5px]">
                <li className="flex items-start gap-3">
                  <Send className="w-4 h-4 text-[#e5bc20] fill-[#e5bc20] shrink-0 mt-1" />
                  <span className="text-white/95 leading-snug">{current.address}</span>
                </li>
                {current.phones.map((phoneStr, pIdx) => (
                  <li key={pIdx}>
                    <a
                      href={`https://wa.me/${phoneStr.replace(/[^0-9]/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-3 text-white/95 hover:text-[#e5bc20] transition-colors"
                    >
                      <Phone className="w-4 h-4 text-[#e5bc20] fill-[#e5bc20] shrink-0" />
                      <span>{phoneStr}</span>
                    </a>
                  </li>
                ))}
                <li>
                  <a
                    href={`mailto:${current.email}`}
                    className="inline-flex items-center gap-3 text-white/95 hover:text-[#e5bc20] transition-colors break-all"
                  >
                    <Mail className="w-4 h-4 text-[#e5bc20] shrink-0" />
                    <span>{current.email}</span>
                  </a>
                </li>
                <li>
                  <Link
                    href={current.contactHref}
                    className="inline-flex items-center gap-3 text-white/95 hover:text-[#e5bc20] transition-colors"
                  >
                    <Mail className="w-4 h-4 text-[#e5bc20] shrink-0" />
                    <span>Hubungi Kami</span>
                  </Link>
                </li>
              </ul>
            </div>

            {/* COLUMN 3: Yayasan, Unit & Accreditation Emblems Grid (Matches Al-Hidayah Model) */}
            <div className="lg:col-span-4 lg:pt-2 space-y-6">
              {/* Row 1: YPIB Emblem + Unit Logo + Official Seal + SEKOLAH UNGGULAN Mark */}
              <div className="flex flex-wrap items-center gap-4 sm:gap-5">
                {current.secondaryLogoUrl && (
                  <div
                    className="w-14 h-14 flex items-center justify-center shrink-0"
                    title="Yayasan Pendidikan Imam Bonjol (YPIB) Majalengka"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={current.secondaryLogoUrl}
                      alt="Logo YPIB Majalengka"
                      className="w-14 h-14 object-contain drop-shadow-sm"
                    />
                  </div>
                )}

                {current.logoUrl && (
                  <div
                    className="w-14 h-14 flex items-center justify-center shrink-0"
                    title={`Logo ${current.displayName}`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={current.logoUrl}
                      alt={`Logo ${current.displayName}`}
                      className="w-14 h-14 object-contain drop-shadow-sm"
                    />
                  </div>
                )}

                {/* Official Circular Seal Emblem */}
                <div
                  className="w-14 h-14 flex items-center justify-center shrink-0"
                  title={current.accreditationLabel}
                >
                  <svg viewBox="0 0 64 64" className="w-14 h-14 drop-shadow-sm" fill="none">
                    <circle
                      cx="32"
                      cy="32"
                      r="29"
                      fill="#0e2240"
                      stroke="#e5bc20"
                      strokeWidth="2.2"
                    />
                    <circle
                      cx="32"
                      cy="32"
                      r="22.5"
                      fill="#132d54"
                      stroke="#e5bc20"
                      strokeWidth="1.2"
                      strokeDasharray="2.5 2"
                    />
                    <circle cx="32" cy="6.5" r="1.3" fill="#e5bc20" />
                    <circle cx="32" cy="57.5" r="1.3" fill="#e5bc20" />
                    <circle cx="6.5" cy="32" r="1.3" fill="#e5bc20" />
                    <circle cx="57.5" cy="32" r="1.3" fill="#e5bc20" />
                    <path
                      d="M17 25C20 22 24 23 27 26L24 36C20 34 18 30 17 25ZM47 25C44 22 40 23 37 26L40 36C44 34 46 30 47 25Z"
                      fill="#e5bc20"
                    />
                    <path
                      d="M25 22H39V33C39 38.5 32 42 32 42C32 42 25 38.5 25 33V22Z"
                      fill="#d97706"
                      stroke="#fde047"
                      strokeWidth="1.5"
                    />
                    <path
                      d="M32 25.5L33.5 28.8L37 29.2L34.4 31.6L35.1 35L32 33.2L28.9 35L29.6 31.6L27 29.2L30.5 28.8L32 25.5Z"
                      fill="#ffffff"
                    />
                    <path
                      d="M21 45C25 47.5 39 47.5 43 45"
                      stroke="#e5bc20"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>

                {/* SEKOLAH UNGGULAN Mark */}
                <div className="flex items-center gap-2.5">
                  <svg viewBox="0 0 44 40" className="w-10 h-9 shrink-0" fill="none">
                    <path
                      d="M6 16C12 8 24 8 34 14L26 24C18 20 12 20 6 16Z"
                      fill="#dc2626"
                    />
                    <path
                      d="M10 24C18 19 28 20 38 26L28 34C20 30 14 29 10 24Z"
                      fill="#ffffff"
                    />
                    <circle cx="24" cy="10" r="3.5" fill="#dc2626" />
                  </svg>
                  <div className="leading-[1.1] font-extrabold text-white tracking-wide text-xs sm:text-sm uppercase">
                    <div>SEKOLAH</div>
                    <div>ISLAM TERPADU</div>
                  </div>
                </div>
              </div>

              {/* Row 2: YPIB Circle + Karakter Nabawiyah Pill + Sekolah Ramah Anak */}
              <div className="flex flex-wrap items-center gap-4 pt-1">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#38bdf8] to-[#0284c7] p-0.5 shadow-sm flex items-center justify-center shrink-0">
                  <div className="w-full h-full rounded-full border border-white/60 flex flex-col items-center justify-center text-white leading-none">
                    <span className="text-xs font-black tracking-tighter">YPIB</span>
                    <span className="text-[6px] uppercase tracking-widest opacity-90">
                      MAJALENGKA
                    </span>
                  </div>
                </div>

                <div className="h-10 w-px bg-white/30 hidden sm:block" />

                <div className="inline-flex items-center bg-gradient-to-r from-[#0284c7] to-[#38bdf8] rounded-full p-1 pr-4 border border-white/80 shadow-sm">
                  <div className="w-9 h-9 rounded-full bg-white text-[#0284c7] font-black text-sm flex items-center justify-center shrink-0 shadow-xs">
                    A
                  </div>
                  <div className="pl-2.5 leading-tight text-white">
                    <div className="text-[11px] font-bold">{current.pillarTitle}</div>
                    <div className="text-[10px] font-medium text-white/95">
                      {current.pillarSubtitle}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-white/85 pl-1">
                  <svg
                    viewBox="0 0 36 32"
                    className="w-8 h-7 shrink-0"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                  >
                    <path d="M3 10L18 3L33 10H3Z" />
                    <line x1="7" y1="12" x2="7" y2="24" />
                    <line x1="14" y1="12" x2="14" y2="24" />
                    <line x1="22" y1="12" x2="22" y2="24" />
                    <line x1="29" y1="12" x2="29" y2="24" />
                    <line x1="3" y1="26" x2="33" y2="26" />
                    <line x1="1" y1="29" x2="35" y2="29" />
                  </svg>
                  <div className="text-[7.5px] leading-tight uppercase tracking-wider text-white/75 max-w-[85px]">
                    Sekolah Ramah Anak &amp; Fitrah
                  </div>
                </div>
              </div>

              {/* Visitor Counter Badge */}
              <div className="pt-1">
                <FooterVisitorBadge unitSlug={activeSlug} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* =====================================================================
          BOTTOM GOLDEN-YELLOW COPYRIGHT BAR (#E2B714) + SCROLL TO TOP BUTTON
      ===================================================================== */}
      <div className="relative bg-[#e2b714] py-4 px-4 pb-20 sm:pb-4 text-center space-y-0.5">
        <p className="text-xs sm:text-[13.5px] text-[#2c3e50] font-semibold tracking-wide">
          {current.copyrightText}
        </p>
        <p className="text-[11px] sm:text-xs text-[#2c3e50]/90 font-normal tracking-wide">
          Design and Development by modula.studio
        </p>

        {/* Scroll to Top Dark Square Button on Bottom-Right */}
        <button
          type="button"
          onClick={scrollToTop}
          aria-label="Kembali ke atas"
          className="fixed bottom-16 sm:bottom-4 right-4 z-50 w-10 h-10 bg-[#212529] hover:bg-black text-white flex items-center justify-center rounded-[2px] shadow-md transition-colors cursor-pointer"
        >
          <ChevronUp className="w-5 h-5 stroke-[2.5]" />
        </button>
      </div>
    </footer>
  );
}
