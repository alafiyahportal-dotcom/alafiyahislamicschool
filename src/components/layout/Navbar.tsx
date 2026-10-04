'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { getSchoolUrl, extractSubdomain, SchoolSlug } from '@/lib/domain';
import {
  ArrowRight,
  Menu,
  X,
  LogIn,
  School,
  UserCheck,
  GraduationCap,
  BookOpen,
  Trophy,
  CalendarDays,
  Home,
  ChevronDown,
  ChevronRight,
  Building2,
  Building,
  Search,
  Phone,
  FileText,
  HeartHandshake,
  Download,
  HelpCircle,
  Clock,
  MapPin,
  Compass,
  MessageCircle,
} from 'lucide-react';

interface NavbarProps {
  schoolName?: string;
  badgeText?: string;
  schoolSlug?: 'tk' | 'sd' | 'smp';
  ppdbUrl?: string;
  waPhone?: string;
  transparentAtTop?: boolean;
}

export default function Navbar({
  schoolName,
  schoolSlug,
  transparentAtTop,
}: NavbarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mobileExpandedSection, setMobileExpandedSection] = useState<string | null>(null);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [clientSubdomain, setClientSubdomain] = useState<SchoolSlug | null>(null);
  const pathname = usePathname();
  const router = useRouter();
  const dropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const sub = extractSubdomain(window.location.host);
      if (sub) setClientSubdomain(sub);
    }
  }, []);

  // Detect which unit is currently being visited (props > subdomain > pathname prefix)
  const activeSlug: SchoolSlug | null =
    schoolSlug ||
    clientSubdomain ||
    (pathname.startsWith('/tk')
      ? 'tk'
      : pathname.startsWith('/sd')
      ? 'sd'
      : pathname.startsWith('/smp')
      ? 'smp'
      : null);

  const [isScrolled, setIsScrolled] = useState(false);

  // Check if current page has a full-bleed dark hero banner where navbar starts transparent
  const isDarkHeroPage =
    pathname === '/' ||
    pathname.startsWith('/sd') ||
    pathname.startsWith('/tk') ||
    pathname.startsWith('/smp') ||
    pathname.startsWith('/ppdb') ||
    pathname.startsWith('/profil') ||
    pathname.startsWith('/affiliate') ||
    Boolean(schoolSlug);

  const hasDarkHero = transparentAtTop !== undefined ? transparentAtTop : isDarkHeroPage;
  const shouldBeTransparent = hasDarkHero && !isScrolled;

  // Close dropdown on route change
  useEffect(() => {
    setActiveDropdown(null);
    setActiveSubmenu(null);
    setIsMobileMenuOpen(false);
    setIsSearchOpen(false);
  }, [pathname]);

  // Detect scroll position to elevate sticky header
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });
    window.addEventListener('hashchange', handleScroll, { passive: true });
    const t1 = setTimeout(handleScroll, 100);
    const t2 = setTimeout(handleScroll, 500);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
      window.removeEventListener('hashchange', handleScroll);
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [pathname]);

  const handleMouseEnter = (name: string) => {
    if (dropdownTimeoutRef.current) clearTimeout(dropdownTimeoutRef.current);
    setActiveDropdown(name);
  };

  const handleMouseLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
      setActiveSubmenu(null);
    }, 200);
  };

  // Brand config
  const brandConfig = (() => {
    switch (activeSlug) {
      case 'tk':
        return {
          code: 'TK',
          arabic: 'روضة الأطفال الإسلامية العافية',
          title: schoolName || 'TK IT Al-Afiyah',
          subtitle: 'Pendidikan Anak Usia Dini • Majalengka',
          homeUrl: getSchoolUrl('tk'),
          ppdbLink: '/ppdb/daftar?school=tk',
          ctaText: 'Info Pendaftaran TK',
          logoUrl: undefined,
        };
      case 'sd':
        return {
          code: 'SD',
          arabic: 'المدرسة الابتدائية الإسلامية العافية',
          title: schoolName || 'SD IT Al-Afiyah',
          subtitle: 'Smart Akhlaq Fitrah • Majalengka',
          homeUrl: getSchoolUrl('sd'),
          ppdbLink: '/ppdb/daftar?school=sd',
          ctaText: 'Info SPMB SD IT',
          logoUrl: '/images/sd-logo.png',
        };
      case 'smp':
        return {
          code: 'SMP',
          arabic: 'المدرسة المتوسطة الإسلامية العافية',
          title: schoolName || 'SMP IT Al-Afiyah',
          subtitle: 'Sekolah Menengah Pertama Islam Terpadu',
          homeUrl: getSchoolUrl('smp'),
          ppdbLink: '/ppdb/daftar?school=smp',
          ctaText: 'Info Pendaftaran SMP',
          logoUrl: undefined,
        };
      default:
        return {
          code: 'IB',
          arabic: 'معهد العافية الإسلامي',
          title: 'Yayasan Pendidikan Imam Bonjol',
          subtitle: 'Ekosistem Pendidikan Terpadu Al-Afiyah Majalengka',
          homeUrl: getSchoolUrl('foundation'),
          ppdbLink: '/ppdb/daftar',
          ctaText: 'Info Pendaftaran',
          logoUrl: undefined,
        };
    }
  })();

  // Multi-Level Navigation Menu Items (Al-Irsyad Style)
  const navStructure = [
    {
      name: 'Beranda',
      href: brandConfig.homeUrl,
      hasDropdown: false,
    },
    {
      name: 'Profil',
      href: '/profil',
      hasDropdown: true,
      items: activeSlug
        ? [
            { label: `Profil & Karakter ${brandConfig.title}`, href: `${brandConfig.homeUrl}#values`, desc: 'Visi, adab nabawi & karakter islami' },
            { label: 'Dewan Guru & Asatidzah', href: `${brandConfig.homeUrl}#teachers`, desc: 'Pendidik tahfidz, sains & pembina karakter' },
            { label: 'Sarana & Fasilitas Belajar', href: `${brandConfig.homeUrl}#facilities`, desc: 'Lingkungan belajar ramah anak & asri' },
            { label: 'Tentang Yayasan Pembina', href: '/profil', desc: 'Yayasan Pendidikan Imam Bonjol Majalengka' },
            { label: 'Kontak & Lokasi', href: '/kontak', desc: 'Alamat kampus & peta navigasi' },
          ]
        : [
            { label: 'Tentang Yayasan & Sejarah', href: '/profil#tentang', desc: 'Latar belakang pendirian & amanah dakwah' },
            { label: 'Visi, Misi & 7 Karakter', href: '/profil#visi-misi', desc: 'Pondasi pembinaan adab & akademik' },
            { label: 'Struktur Manajemen Yayasan', href: '/profil#manajemen', desc: 'Dewan Pembina & Pengurus Yayasan' },
            { label: 'Dewan Guru & Asatidzah', href: '/#dewan-guru', desc: 'Pendidik tahfidz, sains & pembina karakter' },
            { label: 'Sarana & Fasilitas Sekolah', href: '/profil#fasilitas', desc: 'Masjid, lab modern & sarana olahraga' },
            { label: 'Selayang Pandang & Legalitas', href: '/profil#legalitas', desc: 'Izin Kemenkumham, Kemendikbud & Kemenag' },
            { label: 'Kontak & Lokasi Sekolah', href: '/kontak', desc: 'Alamat kampus & peta navigasi' },
          ],
    },
    // Menu "Satuan Pendidikan" HANYA tampil di website utama (Yayasan/Pusat)
    ...(!activeSlug
      ? [
          {
            name: 'Satuan Pendidikan',
            href: '/satuan-pendidikan',
            hasDropdown: true,
            openInNewTab: true,
            items: [
              {
                label: 'TK IT Al-Afiyah',
                href: getSchoolUrl('tk'),
                desc: 'PAUD & TK Islam Terpadu • Usia 4–6 Tahun',
                openInNewTab: true,
              },
              {
                label: 'SD IT Al-Afiyah',
                href: getSchoolUrl('sd'),
                desc: 'Sekolah Dasar Islam Terpadu • Kelas 1–6',
                openInNewTab: true,
              },
              {
                label: 'SMP IT Al-Afiyah',
                href: getSchoolUrl('smp'),
                desc: 'SMP IT Full Day School • Kelas 7–9',
                openInNewTab: true,
              },
              {
                label: 'Selayang Pandang Satuan Pendidikan',
                href: '/satuan-pendidikan',
                desc: 'Ikhtisar kurikulum terpadu & target tahfidz',
                openInNewTab: true,
              },
            ],
          },
        ]
      : [
          {
            name: 'Program & Keunggulan',
            href: `${brandConfig.homeUrl}#programs`,
            hasDropdown: true,
            items: [
              { label: 'Kurikulum & Program Unggulan', href: `${brandConfig.homeUrl}#programs`, desc: 'Pembelajaran terintegrasi & adab harian' },
              { label: 'Pilar Karakter & Nilai Islami', href: `${brandConfig.homeUrl}#values`, desc: 'Tauhid, tahfidz & budi pekerti luhur' },
              { label: 'Sarana & Lingkungan Belajar', href: `${brandConfig.homeUrl}#facilities`, desc: 'Fasilitas nyaman, aman & asri' },
              { label: 'Dewan Guru & Asatidzah', href: `${brandConfig.homeUrl}#teachers`, desc: 'Pendidik berdedikasi & profesional' },
              { label: 'Testimoni Wali Murid', href: `${brandConfig.homeUrl}#testimonials`, desc: 'Pengalaman & apresiasi orang tua' },
            ],
          },
        ]),
    {
      name: 'Berita & Artikel',
      href: '/berita',
      hasDropdown: true,
      items: [
        { label: 'Warta Sekolah Terbaru', href: '/berita', desc: 'Liputan kegiatan & informasi terkini' },
        { label: 'Artikel & Kajian Islam', href: '/berita?cat=kajian', desc: 'Tausiyah, adab & wawasan keislaman' },
        { label: 'Prestasi Murid Al-Afiyah', href: '/berita?cat=prestasi', desc: 'Juara olimpiade & musabaqah hifdzil Qur’an' },
        { label: 'Agenda & Kalender Akademik', href: '/agenda', desc: 'Jadwal ujian, libur & kegiatan resmi' },
      ],
    },
    {
      name: 'PPDB Online',
      href: activeSlug ? `/ppdb/daftar?school=${activeSlug}` : '/ppdb/daftar',
      hasDropdown: true,
      openInNewTab: Boolean(activeSlug),
      items: [
        { label: `Informasi & Alur PPDB ${activeSlug ? activeSlug.toUpperCase() + ' IT' : '2026/2027'}`, href: activeSlug ? `/ppdb/daftar?school=${activeSlug}` : '/ppdb/daftar', desc: 'Syarat berkas, tes observasi & kuota', openInNewTab: Boolean(activeSlug) },
        { label: 'Formulir Pendaftaran Online', href: activeSlug ? `/ppdb/daftar?school=${activeSlug}` : '/ppdb/daftar', desc: 'Isi formulir biodata calon murid', openInNewTab: Boolean(activeSlug) },
        { label: 'Cek Status Pendaftaran', href: '/ppdb/cek-status', desc: 'Pantau verifikasi berkas & nomor registrasi', openInNewTab: Boolean(activeSlug) },
        { label: 'Pengumuman Kelulusan Resmi', href: '/ppdb/pengumuman', desc: 'SK kelulusan murid gelombang 1 & 2', openInNewTab: Boolean(activeSlug) },
        { label: 'Daftar Ulang & Seragam', href: '/portal/ppdb/REG-SD-2026-0001/daftar-ulang', desc: 'Fitting seragam & pelunasan biaya', openInNewTab: Boolean(activeSlug) },
      ],
    },
    {
      name: 'Lainnya',
      href: '#',
      hasDropdown: true,
      items: [
        { label: 'SIAKAD Mobile Murid (iOS)', href: '/portal/siakad', desc: 'Portal presensi QR, capaian tahfidz & rapor digital' },
        { label: 'Kemitraan Mitra Afiliasi', href: '/affiliate', desc: 'Bagi hasil komisi mitra rujukan pendidikan' },
        { label: 'Doa & Dzikir Harian', href: '/doa-dzikir', desc: 'Al-Ma’tsurat pagi petang & adab penuntut ilmu' },
        { label: 'Tanya Ustadz & Konsultasi', href: 'https://wa.me/6281223344552?text=Assalamu%27alaikum%20Ustadz%2C%20saya%20ingin%20bertanya%20seputar%20pendidikan%20Al-Afiyah', desc: 'Konsultasi kurikulum adab & syar’i langsung dengan asatidzah', openInNewTab: true },
        { label: 'Hubungi Sekretariat Yayasan', href: '/kontak', desc: 'Layanan konsultasi offline & Google Maps' },
        { label: 'Pusat Bantuan WhatsApp', href: 'https://wa.me/6282123456789', desc: 'Respon cepat tim sekretariat' },
      ],
    },
  ];

  // Quick search items for modal
  const searchablePages = [
    { title: 'SIAKAD Mobile Murid & Presensi QR', url: '/portal/siakad', cat: 'Akademik' },
    { title: `Pendaftaran PPDB ${activeSlug ? activeSlug.toUpperCase() + ' IT' : '2026/2027'}`, url: brandConfig.ppdbLink, cat: 'PPDB' },
    { title: 'Cek Status Berkas Pendaftar', url: '/ppdb/cek-status', cat: 'PPDB' },
    { title: 'Pengumuman Kelulusan Murid', url: '/ppdb/pengumuman', cat: 'PPDB' },
    { title: 'Profil Yayasan Pendidikan Imam Bonjol', url: '/profil', cat: 'Profil' },
    ...(!activeSlug
      ? [
          { title: 'TK IT Al-Afiyah Majalengka', url: getSchoolUrl('tk'), cat: 'Unit' },
          { title: 'SD IT Al-Afiyah Majalengka', url: getSchoolUrl('sd'), cat: 'Unit' },
          { title: 'SMP IT Al-Afiyah Majalengka', url: getSchoolUrl('smp'), cat: 'Unit' },
        ]
      : []),
    { title: 'Agenda & Kalender Kegiatan', url: '/agenda', cat: 'Informasi' },
    { title: 'Berita & Kajian Artikel Islam', url: '/berita', cat: 'Artikel' },
    { title: 'Doa & Dzikir Harian Murid', url: '/doa-dzikir', cat: 'Ibadah' },
    { title: 'Tanya Ustadz & Konsultasi Syar’i', url: 'https://wa.me/6281223344552', cat: 'Konsultasi' },
    { title: 'Program Kemitraan Mitra Afiliasi', url: '/affiliate', cat: 'Kemitraan' },
    { title: 'Kontak & Lokasi Sekolah Terpadu', url: '/kontak', cat: 'Kontak' },
    { title: 'Login Portal Admin & Panitia', url: '/login', cat: 'Portal' },
  ];

  const searchResults = searchQuery.trim() === ''
    ? []
    : searchablePages.filter((p) =>
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.cat.toLowerCase().includes(searchQuery.toLowerCase())
      );

  return (
    <>
      {/* ========================================================= */}
      {/* MAIN NAVIGATION (Transparent at Top, Solid White on Scroll) */}
      {/* ========================================================= */}
      <div
        className={`w-full z-40 transition-all duration-300 ${
          hasDarkHero ? 'fixed top-0 left-0 right-0' : 'sticky top-0'
        }`}
      >
        <header
          className={`w-full select-none transition-all duration-300 border-b ${
            shouldBeTransparent
              ? 'bg-gradient-to-b from-black/75 via-black/40 to-transparent border-white/10 shadow-none'
              : 'bg-white/95 backdrop-blur-md shadow-md border-slate-200/90'
          }`}
        >
          <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 xl:px-12">
            <div className="flex items-center justify-between h-[72px]">
              
              {/* Brand Logo & Typography (Al-Irsyad Inspired) */}
              <Link
                href={brandConfig.homeUrl}
                onClick={() => {
                  if (typeof window !== 'undefined') {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }
                }}
                className="flex items-center gap-3 flex-shrink-0 group cursor-pointer mr-6 xl:mr-10 py-1"
              >
                {brandConfig.logoUrl && (
                  <img
                    src={brandConfig.logoUrl}
                    alt={brandConfig.title}
                    className="w-10 h-10 sm:w-11 sm:h-11 object-contain shrink-0 group-hover:scale-105 transition-transform duration-200 drop-shadow-xs"
                  />
                )}
                <div className="flex flex-col justify-center">
                  {/* Arabic Calligraphy Style Title */}
                  <div
                    className={`text-base sm:text-lg xl:text-xl font-bold tracking-normal font-serif transition-colors leading-tight ${
                      shouldBeTransparent
                        ? 'text-white group-hover:text-amber-300 drop-shadow-sm'
                        : 'text-softwater-dark group-hover:text-softwater'
                    }`}
                  >
                    {brandConfig.arabic}
                  </div>

                  {/* Latin Name (Pure White on Transparent, Slate-800 on Scrolled) */}
                  <div className="mt-0.5">
                    <span
                      className={`text-xs sm:text-sm font-extrabold uppercase tracking-wider transition-colors whitespace-nowrap ${
                        shouldBeTransparent
                          ? 'text-white group-hover:text-amber-300 drop-shadow-sm'
                          : 'text-slate-800 group-hover:text-softwater-dark'
                      }`}
                    >
                      {brandConfig.title}
                    </span>
                  </div>
                </div>
              </Link>

              {/* Desktop Navigation Items */}
              <nav className="hidden lg:flex items-center h-full space-x-0.5 xl:space-x-1 flex-nowrap shrink-0">
                {navStructure.map((nav) => {
                  const isHovered = activeDropdown === nav.name;
                  const isActive = pathname === nav.href;

                  const navLinkClass = `relative h-full flex items-center px-2 xl:px-2.5 text-[11.5px] xl:text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer group ${
                    shouldBeTransparent
                      ? isActive || isHovered
                        ? 'text-amber-300 font-bold'
                        : 'text-white/90 hover:text-white'
                      : isActive || isHovered
                        ? 'text-softwater-dark font-bold'
                        : 'text-slate-700 hover:text-softwater-dark'
                  }`;

                  return (
                    <div
                      key={nav.name}
                      className="relative h-full flex items-center"
                      onMouseEnter={() => nav.hasDropdown && handleMouseEnter(nav.name)}
                      onMouseLeave={handleMouseLeave}
                    >
                      {Boolean((nav as any).openInNewTab) ? (
                        <a
                          href={nav.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={navLinkClass}
                        >
                          <span className="relative inline-flex items-center space-x-1 py-1">
                            <span>{nav.name}</span>
                            {nav.hasDropdown && (
                              <ChevronDown
                                className={`w-3 h-3 transition-transform duration-200 shrink-0 ${
                                  isHovered
                                    ? `rotate-180 ${shouldBeTransparent ? 'text-amber-300' : 'text-softwater-dark'}`
                                    : shouldBeTransparent
                                      ? 'text-white/70 group-hover:text-white'
                                      : 'text-slate-400 group-hover:text-slate-700'
                                }`}
                              />
                            )}

                            {/* Thin, minimalist indicator directly under the navbar text */}
                            {(isHovered || (isActive && !activeDropdown)) && (
                              <span
                                className={`absolute -bottom-1 left-0 right-0 h-[2px] rounded-full transition-all duration-200 ${
                                  shouldBeTransparent ? 'bg-amber-400' : 'bg-softwater-dark'
                                }`}
                              />
                            )}
                          </span>
                        </a>
                      ) : (
                        <Link
                          href={nav.href}
                          onClick={() => {
                            if (nav.name === 'Beranda' && typeof window !== 'undefined') {
                              window.scrollTo({ top: 0, behavior: 'smooth' });
                            }
                          }}
                          className={navLinkClass}
                        >
                          <span className="relative inline-flex items-center space-x-1 py-1">
                            <span>{nav.name}</span>
                            {nav.hasDropdown && (
                              <ChevronDown
                                className={`w-3 h-3 transition-transform duration-200 shrink-0 ${
                                  isHovered
                                    ? `rotate-180 ${shouldBeTransparent ? 'text-amber-300' : 'text-softwater-dark'}`
                                    : shouldBeTransparent
                                      ? 'text-white/70 group-hover:text-white'
                                      : 'text-slate-400 group-hover:text-slate-700'
                                }`}
                              />
                            )}

                            {/* Thin, minimalist indicator directly under the navbar text */}
                            {(isHovered || (isActive && !activeDropdown)) && (
                              <span
                                className={`absolute -bottom-1 left-0 right-0 h-[2px] rounded-full transition-all duration-200 ${
                                  shouldBeTransparent ? 'bg-amber-400' : 'bg-softwater-dark'
                                }`}
                              />
                            )}
                          </span>
                        </Link>
                      )}

                      {/* ========================================================= */}
                      {/* DROPDOWN MENU CARD (Sleek Dark Charcoal - Al-Irsyad Style)*/}
                      {/* ========================================================= */}
                      {nav.hasDropdown && isHovered && (
                        <div className="absolute left-0 top-full pt-1.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                          <div className="w-80 bg-[#2B2A2A] text-white shadow-2xl rounded-xl border border-stone-700 overflow-hidden py-1 divide-y divide-stone-700/60">
                            {nav.items?.map((item) => {
                              const isSubdomainUrl =
                                item.href.includes('tk.') ||
                                item.href.includes('sd.') ||
                                item.href.includes('smp.');
                              const isExternalUrl =
                                item.href.startsWith('http') &&
                                !item.href.includes('alafiyah.sch.id') &&
                                !item.href.includes('localhost');
                              const shouldOpenNewTab = Boolean((item as any).openInNewTab) || isSubdomainUrl || isExternalUrl;

                              const itemInner = (
                                <div className="flex items-center justify-between px-4 py-2.5 hover:bg-stone-800/90 transition-colors group/item">
                                  <div className="pr-2">
                                    <p className="text-xs font-bold text-slate-100 group-hover/item:text-amber-300 transition-colors">
                                      {item.label}
                                    </p>
                                    {'desc' in item && item.desc && (
                                      <p className="text-[10px] text-stone-400 group-hover/item:text-stone-300 line-clamp-1 mt-0.5 font-normal">
                                        {item.desc}
                                      </p>
                                    )}
                                  </div>
                                  <ArrowRight className="w-3.5 h-3.5 text-stone-500 group-hover/item:text-amber-300 group-hover/item:translate-x-0.5 transition-all shrink-0" />
                                </div>
                              );

                              return (
                                <div key={item.label}>
                                  {shouldOpenNewTab ? (
                                    <a
                                      href={item.href}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="block"
                                    >
                                      {itemInner}
                                    </a>
                                  ) : item.href.startsWith('http') ? (
                                    <a
                                      href={item.href}
                                      className="block"
                                    >
                                      {itemInner}
                                    </a>
                                  ) : (
                                    <Link
                                      href={item.href}
                                      className="block"
                                    >
                                      {itemInner}
                                    </Link>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </nav>

              {/* Desktop Actions: Search & Login */}
              <div className="hidden lg:flex items-center gap-2 xl:gap-3 flex-shrink-0">
                {/* Search Modal Trigger Button */}
                <button
                  type="button"
                  onClick={() => setIsSearchOpen(true)}
                  title="Pencarian Cepat"
                  aria-label="Buka pencarian"
                  className={`p-2 rounded-full transition-colors cursor-pointer shrink-0 ${
                    shouldBeTransparent
                      ? 'text-white hover:text-amber-300 hover:bg-white/10'
                      : 'text-slate-600 hover:text-softwater-dark hover:bg-slate-100'
                  }`}
                >
                  <Search className="w-4 h-4 xl:w-5 xl:h-5" />
                </button>

                {/* Login Link (Clean Text Only) */}
                <Link
                  href="/login"
                  title="Masuk ke Portal Layanan & Sistem Akademik"
                  className={`px-3 py-1.5 xl:py-2 rounded-full text-xs font-semibold tracking-wide transition-all shrink-0 ${
                    shouldBeTransparent
                      ? 'text-white/90 hover:text-amber-300 hover:bg-white/10'
                      : 'text-slate-700 hover:text-softwater-dark hover:bg-slate-100'
                  }`}
                >
                  <span>Login</span>
                </Link>
              </div>

              {/* Mobile & Tablet Right Actions (Search + Hamburger Drawer Trigger) */}
              <div className="flex lg:hidden items-center gap-1.5 sm:gap-2 flex-shrink-0">
                <button
                  type="button"
                  onClick={() => setIsSearchOpen(true)}
                  title="Pencarian Cepat"
                  aria-label="Buka pencarian"
                  className={`p-2 rounded-full transition-colors cursor-pointer shrink-0 ${
                    shouldBeTransparent
                      ? 'text-white hover:bg-white/10'
                      : 'text-slate-600 hover:text-softwater-dark hover:bg-slate-100'
                  }`}
                >
                  <Search className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>

                <button
                  type="button"
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  aria-label="Buka menu navigasi"
                  className={`p-2 rounded-xl transition-colors cursor-pointer ${
                    shouldBeTransparent
                      ? 'text-white hover:bg-white/10'
                      : 'text-slate-700 hover:text-softwater-dark hover:bg-slate-100'
                  }`}
                >
                  {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
              </div>
            </div>
          </div>
        </header>
      </div>

      {/* ========================================================= */}
      {/* 3. QUICK SPOTLIGHT SEARCH MODAL                           */}
      {/* ========================================================= */}
      {isSearchOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div
            className="w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Search Input Bar */}
            <div className="p-4 border-b border-slate-100 flex items-center space-x-3">
              <Search className="w-5 h-5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
                placeholder="Ketik kata kunci (misal: PPDB, TK IT, Guru, Biaya, Doa)..."
                className="flex-1 text-sm text-slate-900 placeholder-slate-400 bg-transparent focus:outline-none font-medium"
              />
              <button
                type="button"
                onClick={() => setIsSearchOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg text-xs font-semibold"
              >
                ESC
              </button>
            </div>

            {/* Search Results */}
            <div className="max-h-80 overflow-y-auto p-2 divide-y divide-slate-50">
              {searchQuery.trim() === '' ? (
                <div className="p-6 text-center text-xs text-slate-400">
                  Ketik apa yang ingin Anda cari dalam Ekosistem Pendidikan Al-Afiyah
                </div>
              ) : searchResults.length === 0 ? (
                <div className="p-6 text-center text-xs text-slate-500">
                  Tidak ditemukan hasil untuk &quot;{searchQuery}&quot;. Silakan coba kata kunci lain.
                </div>
              ) : (
                searchResults.map((item) => {
                  const isExt = item.url.startsWith('http');
                  return isExt ? (
                    <a
                      key={item.url}
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => setIsSearchOpen(false)}
                      className="flex items-center justify-between p-3 rounded-xl hover:bg-emerald-50/70 transition-colors group cursor-pointer"
                    >
                      <div>
                        <p className="text-xs font-bold text-slate-900 group-hover:text-softwater-dark">
                          {item.title}
                        </p>
                        <p className="text-[10px] text-slate-400 font-mono mt-0.5">{item.url}</p>
                      </div>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 group-hover:bg-softwater-dark group-hover:text-white transition-colors">
                        {item.cat}
                      </span>
                    </a>
                  ) : (
                    <Link
                      key={item.url}
                      href={item.url}
                      onClick={() => setIsSearchOpen(false)}
                      className="flex items-center justify-between p-3 rounded-xl hover:bg-emerald-50/70 transition-colors group cursor-pointer"
                    >
                      <div>
                        <p className="text-xs font-bold text-slate-900 group-hover:text-softwater-dark">
                          {item.title}
                        </p>
                        <p className="text-[10px] text-slate-400 font-mono mt-0.5">{item.url}</p>
                      </div>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 group-hover:bg-softwater-dark group-hover:text-white transition-colors">
                        {item.cat}
                      </span>
                    </Link>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 4. MOBILE ACCORDION DRAWER                                */}
      {/* ========================================================= */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex justify-end">
          <div className="w-80 max-w-[85vw] h-full bg-white shadow-2xl flex flex-col justify-between overflow-y-auto animate-in slide-in-from-right duration-200">
            
            {/* Drawer Header */}
            <div>
              <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                <div className="flex items-center gap-2.5">
                  {brandConfig.logoUrl && (
                    <img
                      src={brandConfig.logoUrl}
                      alt={brandConfig.title}
                      className="w-9 h-9 object-contain shrink-0"
                    />
                  )}
                  <div>
                    <div className="text-sm font-bold text-softwater-dark">
                      {brandConfig.arabic}
                    </div>
                    <div className="text-[11px] font-semibold text-slate-700">
                      {brandConfig.title}
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Accordion List */}
              <div className="p-3 space-y-1">
                {navStructure.map((nav) => {
                  const isExpanded = mobileExpandedSection === nav.name;

                  if (!nav.hasDropdown) {
                    return (
                      <Link
                        key={nav.name}
                        href={nav.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="block px-3 py-2.5 rounded-xl text-xs font-bold text-slate-800 hover:bg-slate-50 hover:text-softwater-dark transition-colors"
                      >
                        {nav.name}
                      </Link>
                    );
                  }

                  return (
                    <div key={nav.name} className="border-b border-slate-100 pb-1">
                      <button
                        type="button"
                        onClick={() => setMobileExpandedSection(isExpanded ? null : nav.name)}
                        className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold text-slate-800 hover:bg-slate-50 text-left transition-colors"
                      >
                        <span>{nav.name}</span>
                        <ChevronDown
                          className={`w-4 h-4 text-slate-400 transition-transform ${
                            isExpanded ? 'rotate-180 text-softwater-dark' : ''
                          }`}
                        />
                      </button>

                      {isExpanded && (
                        <div className="pl-4 pr-2 py-1 space-y-1 bg-slate-50/70 rounded-xl mb-1">
                          {nav.items?.map((item) => {
                            const isItemExt =
                              item.href.startsWith('http') &&
                              !item.href.includes('alafiyah.sch.id') &&
                              !item.href.includes('localhost');
                            const isSubdomain =
                              item.href.includes('tk.') ||
                              item.href.includes('sd.') ||
                              item.href.includes('smp.');
                            const shouldOpenNewTab = Boolean((item as any).openInNewTab) || isItemExt || isSubdomain;

                            if (shouldOpenNewTab) {
                              return (
                                <a
                                  key={item.label}
                                  href={item.href}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  onClick={() => setIsMobileMenuOpen(false)}
                                  className="block px-3 py-2 text-xs font-medium text-slate-600 hover:text-softwater-dark hover:bg-white rounded-lg transition-colors"
                                >
                                  {item.label}
                                </a>
                              );
                            }

                            if (item.href.startsWith('http')) {
                              return (
                                <a
                                  key={item.label}
                                  href={item.href}
                                  onClick={() => setIsMobileMenuOpen(false)}
                                  className="block px-3 py-2 text-xs font-medium text-slate-600 hover:text-softwater-dark hover:bg-white rounded-lg transition-colors"
                                >
                                  {item.label}
                                </a>
                              );
                            }

                            return (
                              <Link
                                key={item.label}
                                href={item.href}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="block px-3 py-2 text-xs font-medium text-slate-600 hover:text-softwater-dark hover:bg-white rounded-lg transition-colors"
                              >
                                {item.label}
                              </Link>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Drawer Bottom CTAs */}
            <div className="p-4 border-t border-slate-100 bg-slate-50 space-y-2">
              <Link
                href={brandConfig.ppdbLink}
                target={activeSlug ? '_blank' : undefined}
                rel={activeSlug ? 'noopener noreferrer' : undefined}
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full py-3 px-4 rounded-full bg-softwater-dark text-white text-xs font-bold text-center block shadow-md hover:bg-softwater-deep transition-all"
              >
                {brandConfig.ctaText}
              </Link>
              <Link
                href="/login"
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full py-2.5 px-4 rounded-full border border-slate-300 text-slate-700 text-xs font-bold text-center flex items-center justify-center space-x-2 hover:bg-white transition-all"
              >
                <LogIn className="w-4 h-4 text-amber-600" />
                <span>Login Portal Layanan &amp; Akademik</span>
              </Link>
              <a
                href="https://wa.me/6281223344552"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2 px-4 rounded-full text-slate-600 text-xs font-medium text-center flex items-center justify-center space-x-2 hover:text-softwater-dark transition-all"
              >
                <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                <span>Pusat Bantuan WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
