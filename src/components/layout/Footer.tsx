'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Phone, MapPin, Mail, ShieldCheck } from 'lucide-react';
import { getSchoolUrl, extractSubdomain, SchoolSlug } from '@/lib/domain';

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

  // School-specific configuration tailored to each unit without cross-unit mentions
  const unitConfig = {
    sd: {
      name: 'SDIT Al-Afiyah',
      subheading: 'Yayasan Pendidikan Imam Bonjol Majalengka',
      logoUrl: '/images/sd-logo.png',
      badgeLetter: 'SD',
      description:
        'SDIT Al-Afiyah — Bukan sekadar tempat belajar, namun juga tempat bertumbuh. Memadukan kurikulum Diknas & yayasan dalam mutu berpijak iman dan taqwa, dengan program unggulan Tahsin & Tahfidz Al-Qur\'an.',
      accreditation: 'Terakreditasi B',
      permit: 'YPIB • Gugus 3 Nusa Indah',
      address:
        'Lingkungan Giri Asih - Jl. Gerakan Koperasi, Kec. Majalengka, Kab. Majalengka, Jawa Barat 45411',
      hotline: '+62 813-1013-9001',
      hotlineWa: 'https://wa.me/6281310139001',
      email: 'sditalafiyahmjl@gmail.com',
      navTitle: 'Navigasi SDIT',
      navLinks: [
        { label: 'Profil & Karakter Nabawi', href: '/sd#values' },
        { label: 'Program Unggulan', href: '/sd#programs' },
        { label: 'Dewan Asatidzah & Guru', href: '/sd#teachers' },
        { label: 'Fasilitas & Greenhouse', href: '/sd#facilities' },
        { label: 'Kabar & Artikel SDIT', href: '/sd/berita' },
        { label: 'Agenda & Kalender Akademik', href: '/sd/agenda' },
        { label: 'Cek Status SPMB SDIT', href: '/sd/spmb/cek-status' },
        { label: 'Formulir SPMB SDIT Online', href: '/sd/spmb/daftar', isHighlighted: true },
      ],
      bottomCopyright: '© 2026 SDIT Al-Afiyah Majalengka • Yayasan Pendidikan Imam Bonjol. Seluruh Hak Cipta Dilindungi.',
      bottomLinks: [],
    },
    tk: {
      name: 'TK IT Al-Afiyah',
      subheading: 'Yayasan Pendidikan Imam Bonjol Majalengka',
      logoUrl: null,
      badgeLetter: 'TK',
      description:
        'Pendidikan Anak Usia Dini & TK Islam Terpadu ceria. Menumbuhkan adab, kecintaan Al-Qur\'an, ibadah kreatif, dan fitrah anak dengan bimbingan penuh kasih sayang.',
      accreditation: 'Terakreditasi Resmi',
      permit: 'Izin Kemenag & Kemdikbud',
      address:
        'Kompleks Pendidikan Islam Imam Bonjol, Kec. Majalengka, Kab. Majalengka, Jawa Barat 45419',
      hotline: '+62 812-2334-4552',
      hotlineWa: 'https://wa.me/6281223344552',
      email: 'tkit@alafiyah.sch.id',
      navTitle: 'Navigasi TK IT',
      navLinks: [
        { label: 'Profil Sentra Ceria', href: '/tk#values' },
        { label: 'Program Usia Dini & Adab', href: '/tk#programs' },
        { label: 'Dewan Guru & Bunda Asatidzah', href: '/tk#teachers' },
        { label: 'Fasilitas & Arena Bermain', href: '/tk#facilities' },
        { label: 'Formulir SPMB TK IT Online', href: '/ppdb/daftar?school=tk', isHighlighted: true },
      ],
      bottomCopyright: '© 2026 TK IT Al-Afiyah Majalengka • Yayasan Pendidikan Imam Bonjol. Seluruh Hak Cipta Dilindungi.',
      bottomLinks: [
        { label: 'Login Portal', href: '/login', isGold: true },
        { label: 'Doa & Dzikir', href: '/doa-dzikir' },
        { label: 'Info SPMB TK IT', href: '/ppdb/daftar?school=tk' },
        { label: 'Hotline Panitia', href: 'https://wa.me/6281223344552', isExternal: true },
      ],
    },
    smp: {
      name: 'SMP IT Al-Afiyah',
      subheading: 'Yayasan Pendidikan Imam Bonjol Majalengka',
      logoUrl: '/images/smp-logo.png',
      badgeLetter: 'SMP',
      description:
        'SMP IT Al-Afiyah — Be Smart & Religious. Sekolah Menengah Pertama Islam Terpadu Terakreditasi A dengan target tahfidz 3-5+ juz mutqin, fasih Bahasa Arab aktif, SCD & Mutaba\'ah Digital, serta Futsal Development Program.',
      accreditation: 'Terakreditasi A (BAN-S/M)',
      permit: 'YPIB • Majalengka',
      address:
        'Jl. Gerakan Koperasi No. 110, Majalengka Wetan, Kec. Majalengka, Kab. Majalengka, Jawa Barat 45411',
      hotline: '+62 822-4935-7893',
      hotlineWa: 'https://wa.me/6282249357893',
      email: 'smpit@alafiyah.sch.id',
      instagramUrl: 'https://instagram.com/smpitalafiyahmjl',
      facebookUrl: 'https://facebook.com/smpitalafiyah',
      youtubeUrl: 'https://youtube.com/@smpitalafiyah',
      navTitle: 'Navigasi SMP IT',
      navLinks: [
        { label: 'Profil SMP IT Al-Afiyah', href: '/smp/profil' },
        { label: 'Program Unggulan 5+ Juz & Futsal', href: '/smp/program' },
        { label: 'Jadwal Gelombang & Diskon SPMB', href: '/smp/spmb' },
        { label: 'Sarana & Fasilitas Sekolah', href: '/smp/fasilitas' },
        { label: 'Formulir SPMB SMP IT Online', href: '/smp/spmb/daftar', isHighlighted: true },
      ],
      bottomCopyright: '© 2026 SMP IT Al-Afiyah Majalengka • Yayasan Pendidikan Imam Bonjol. Seluruh Hak Cipta Dilindungi.',
      bottomLinks: [
        { label: 'Login Portal', href: '/login', isGold: true },
        { label: 'Doa & Dzikir', href: '/smp/doa-dzikir' },
        { label: 'Info SPMB SMP IT', href: '/smp/spmb/daftar' },
        { label: 'Hotline Panitia', href: 'https://wa.me/6282249357893', isExternal: true },
      ],
    },
    foundation: {
      name: 'Yayasan Pendidikan Imam Bonjol',
      subheading: 'Majalengka • Jawa Barat',
      logoUrl: null,
      badgeLetter: 'IB',
      description:
        'Mewujudkan ekosistem pendidikan Islam terpadu yang memadukan kedalaman adab dan Al-Qur\'an, kemuliaan akhlakul karimah, serta keunggulan intelektual dan sains modern sejak usia dini hingga menengah.',
      accreditation: 'Terakreditasi Resmi',
      permit: 'Izin Kemenag & Kemdikbud',
      address:
        'Kompleks Pendidikan Islam Imam Bonjol, Kec. Majalengka, Kab. Majalengka, Jawa Barat 45419',
      hotline: '+62 812-2334-4552',
      hotlineWa: 'https://wa.me/6281223344552',
      email: 'info@alafiyah.sch.id',
      navTitle: 'Unit Pendidikan',
      navLinks: [
        { label: 'TK IT Al-Afiyah', href: getSchoolUrl('tk') },
        { label: 'SDIT Al-Afiyah', href: getSchoolUrl('sd') },
        { label: 'SMP IT Al-Afiyah', href: getSchoolUrl('smp') },
        { label: 'Mitra Afiliasi', href: '/affiliate', isGold: true },
      ],
      bottomCopyright: '© 2026 Yayasan Pendidikan Imam Bonjol Majalengka. Seluruh Hak Cipta Dilindungi.',
      bottomLinks: [
        { label: 'Login Portal', href: '/login', isGold: true },
        { label: 'Doa & Dzikir', href: '/doa-dzikir' },
        { label: 'Mitra Afiliasi', href: '/affiliate' },
        { label: 'Pendaftaran Murid', href: '/ppdb/daftar' },
      ],
    },
  };

  const current = unitConfig[activeSlug];

  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-20 sm:pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-6 xl:gap-8 pb-12 border-b border-slate-800">
          {/* Col 1: Unit / Foundation Brand Info & Social Media */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center space-x-3.5">
              {current.logoUrl ? (
                <img
                  src={current.logoUrl}
                  alt={`Logo ${current.name}`}
                  className="w-14 h-14 object-contain shrink-0 drop-shadow-sm"
                />
              ) : (
                <div className="w-12 h-12 rounded-xl luxury-gradient flex items-center justify-center text-white font-bold text-lg shadow-sm shrink-0">
                  {current.badgeLetter}
                </div>
              )}
              <div>
                <h3 className="text-base sm:text-lg font-bold text-white leading-tight">
                  {current.name}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  {current.subheading}
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              {current.description}
            </p>

            <div className="flex items-center space-x-3 pt-1 text-xs text-slate-400">
              <span className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded-md bg-slate-800 border ${
                activeSlug === 'smp' ? 'text-[#ffd51e] border-blue-900/60' : 'text-emerald-400 border-slate-700'
              }`}>
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>{current.accreditation}</span>
              </span>
              <span>{current.permit}</span>
            </div>

            {/* Social Media Media Links Row */}
            <div className="pt-2">
              <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2.5">
                Media Sosial Resmi
              </p>
              <div className="flex items-center space-x-2.5 text-slate-300">
                {/* Instagram */}
                <a
                  href={(current as any).instagramUrl || "https://instagram.com/alafiyah_majalengka"}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Instagram Resmi ${current.name}`}
                  title={`Instagram Resmi ${(current as any).instagramUrl ? '@smpitalafiyahmjl' : '@alafiyah_majalengka'}`}
                  className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-pink-600/20 text-slate-400 hover:text-pink-400 border border-slate-700/70 flex items-center justify-center transition-all"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>
                {/* Facebook */}
                <a
                  href={(current as any).facebookUrl || "https://facebook.com/alafiyah.official"}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Facebook Resmi ${current.name}`}
                  title={`Facebook ${current.name}`}
                  className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-blue-600/20 text-slate-400 hover:text-blue-400 border border-slate-700/70 flex items-center justify-center transition-all"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M9 8H6v4h3v12h5V12h3.642L18 8h-4V6.333C14 5.374 14.456 5 15.5 5H18V0h-3.808C10.595 0 9 1.583 9 4.615V8z"/>
                  </svg>
                </a>
                {/* YouTube */}
                <a
                  href={(current as any).youtubeUrl || "https://youtube.com/@alafiyah_school"}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`YouTube ${current.name}`}
                  title={`YouTube Channel ${current.name}`}
                  className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-red-600/20 text-slate-400 hover:text-red-400 border border-slate-700/70 flex items-center justify-center transition-all"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                </a>
                {/* WhatsApp */}
                <a
                  href={current.hotlineWa}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="WhatsApp Layanan Hotline"
                  title={`WhatsApp Hotline ${current.hotline}`}
                  className={`w-8 h-8 rounded-lg bg-slate-800 border border-slate-700/70 flex items-center justify-center transition-all ${
                    activeSlug === 'smp'
                      ? 'hover:bg-blue-600/20 text-slate-400 hover:text-[#ffd51e]'
                      : 'hover:bg-emerald-600/20 text-slate-400 hover:text-emerald-400'
                  }`}
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>

          {/* Col 2: Unit Navigation (No other units mentioned) */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              {current.navTitle}
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              {current.navLinks.map((item, idx) => {
                const isExternal = item.href.startsWith('http');
                const isHighlight = (item as any).isHighlighted;
                const isGold = (item as any).isGold;

                const hoverClass = activeSlug === 'smp' ? 'hover:text-[#ffd51e]' : 'hover:text-emerald-400';
                const highlightClass = activeSlug === 'smp' ? 'text-[#ffd51e] font-semibold' : 'text-emerald-400 font-medium';

                if (isExternal) {
                  return (
                    <li key={idx}>
                      <a
                        href={item.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`${hoverClass} transition-colors flex items-center space-x-2 ${
                          isGold ? 'text-amber-400 font-medium' : ''
                        }`}
                      >
                        <span>•</span>
                        <span>{item.label}</span>
                      </a>
                    </li>
                  );
                }

                return (
                  <li key={idx}>
                    <Link
                      href={item.href}
                      className={`${hoverClass} transition-colors flex items-center space-x-2 ${
                        isHighlight
                          ? highlightClass
                          : isGold
                          ? 'text-amber-400 font-medium'
                          : ''
                      }`}
                    >
                      <span>•</span>
                      <span>{item.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Col 3: Layanan & Kajian Islami */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Layanan &amp; Kajian Islami
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <Link 
                  href={activeSlug === 'sd' ? '/sd/berita?cat=kajian' : activeSlug === 'smp' ? '/smp/berita?cat=kajian' : '/berita?cat=kajian'} 
                  className={`${activeSlug === 'smp' ? 'hover:text-[#ffd51e]' : 'hover:text-emerald-400'} transition-colors flex items-center space-x-2`}
                >
                  <span>•</span>
                  <span>Artikel &amp; Kajian Islam</span>
                </Link>
              </li>
              <li>
                <Link 
                  href={activeSlug === 'sd' ? '/sd/doa-dzikir' : activeSlug === 'smp' ? '/smp/doa-dzikir' : '/doa-dzikir'} 
                  className={`${activeSlug === 'smp' ? 'hover:text-[#ffd51e]' : 'hover:text-emerald-400'} transition-colors flex items-center space-x-2`}
                >
                  <span>•</span>
                  <span>Doa &amp; Dzikir Harian Murid</span>
                </Link>
              </li>
              <li>
                <Link 
                  href={activeSlug === 'sd' ? '/sd/agenda' : activeSlug === 'smp' ? '/smp/agenda' : '/agenda'} 
                  className={`${activeSlug === 'smp' ? 'hover:text-[#ffd51e]' : 'hover:text-emerald-400'} transition-colors flex items-center space-x-2`}
                >
                  <span>•</span>
                  <span>Agenda &amp; Kalender Akademik</span>
                </Link>
              </li>
              <li>
                <a 
                  href={
                    activeSlug === 'smp'
                      ? 'https://wa.me/6282249357893?text=Assalamu%27alaikum%20Panitia%20SMP%20IT%20Al-Afiyah,%20saya%20ingin%20berkonsultasi'
                      : activeSlug === 'sd'
                      ? 'https://wa.me/6281310139001?text=Assalamu%27alaikum%20Ustadz%20SD%20IT%20Al-Afiyah,%20saya%20ingin%20berkonsultasi'
                      : 'https://wa.me/6281223344552?text=Assalamu%27alaikum%20Ustadz%2C%20saya%20ingin%20bertanya%20seputar%20layanan%20pendidikan%20Al-Afiyah'
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${activeSlug === 'smp' ? 'hover:text-[#ffd51e]' : 'hover:text-emerald-400'} transition-colors flex items-center space-x-2`}
                >
                  <span>•</span>
                  <span>Tanya Panitia (Konsultasi Pendidikan)</span>
                </a>
              </li>
              <li>
                <Link 
                  href={activeSlug === 'sd' ? '/sd/siakad' : activeSlug === 'smp' ? '/smp/siakad' : '/portal/siakad'} 
                  className={`${activeSlug === 'smp' ? 'hover:text-[#ffd51e]' : 'hover:text-emerald-400'} transition-colors flex items-center space-x-2`}
                >
                  <span>•</span>
                  <span>SIAKAD Mobile Murid</span>
                </Link>
              </li>
              <li>
                <Link 
                  href={activeSlug ? `/login?unit=${activeSlug}` : '/login'} 
                  className="hover:text-amber-300 transition-colors flex items-center space-x-2 text-amber-300 font-medium"
                >
                  <span>•</span>
                  <span>Login Portal Layanan &amp; Akademik</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Contact & School Address */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              {activeSlug === 'sd'
                ? 'Sekretariat SDIT & Kontak'
                : activeSlug === 'tk'
                ? 'Sekretariat TK IT & Kontak'
                : activeSlug === 'smp'
                ? 'Sekretariat SMP IT & Kontak'
                : 'Sekretariat Pusat & Kontak'}
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li className="flex items-start space-x-2.5">
                <MapPin className={`w-4 h-4 flex-shrink-0 mt-0.5 ${activeSlug === 'smp' ? 'text-[#ffd51e]' : 'text-emerald-400'}`} />
                <span>{current.address}</span>
              </li>
              <li className="flex items-center space-x-2.5">
                <Phone className={`w-4 h-4 flex-shrink-0 ${activeSlug === 'smp' ? 'text-[#ffd51e]' : 'text-emerald-400'}`} />
                <span>
                  {activeSlug !== 'foundation'
                    ? `Hotline SPMB: ${current.hotline}`
                    : `Hotline PPDB: ${current.hotline}`}
                </span>
              </li>
              <li className="flex items-center space-x-2.5">
                <Mail className={`w-4 h-4 flex-shrink-0 ${activeSlug === 'smp' ? 'text-[#ffd51e]' : 'text-emerald-400'}`} />
                <span>{current.email}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 space-y-3 sm:space-y-0 text-center sm:text-left">
          <p className="leading-relaxed">
            <span>{current.bottomCopyright.replace(/Seluruh Hak Cipta Dilindungi\./, '').trim()}</span>{' '}
            <span className="block sm:inline whitespace-nowrap">Seluruh Hak Cipta Dilindungi.</span>
          </p>
          {'bottomLinks' in current && current.bottomLinks && current.bottomLinks.length > 0 && (
          <div className="flex items-center space-x-4">
            {current.bottomLinks.map((item, idx) => (
              <React.Fragment key={idx}>
                {idx > 0 && <span>•</span>}
                {(item as any).isExternal ? (
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`${activeSlug === 'smp' ? 'hover:text-[#ffd51e]' : 'hover:text-emerald-400'} text-slate-400`}
                  >
                    {item.label}
                  </a>
                ) : (
                  <Link
                    href={item.href}
                    className={
                      (item as any).isGold
                        ? 'hover:text-amber-300 text-slate-400 font-medium'
                        : activeSlug === 'smp'
                        ? 'hover:text-[#ffd51e] text-slate-400'
                        : 'hover:text-slate-300'
                    }
                  >
                    {item.label}
                  </Link>
                )}
              </React.Fragment>
            ))}
          </div>
          )}
        </div>
      </div>
    </footer>
  );
}
