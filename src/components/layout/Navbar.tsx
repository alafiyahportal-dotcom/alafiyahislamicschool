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
  const isSubdomain = Boolean(clientSubdomain);
  const getUnitHomeUrl = (slug: 'tk' | 'sd' | 'smp' | 'foundation') => {
    if (slug === 'foundation') return isSubdomain ? getSchoolUrl('foundation') : '/';
    return isSubdomain && clientSubdomain === slug ? '/' : `/${slug}`;
  };

  const brandConfig = (() => {
    switch (activeSlug) {
      case 'tk':
        return {
          code: 'TK',
          arabic: 'روضة الأطفال الإسلامية العافية',
          title: schoolName || 'TK IT Al-Afiyah',
          subtitle: 'Pendidikan Anak Usia Dini • Majalengka',
          homeUrl: getUnitHomeUrl('tk'),
          ppdbLink: '/ppdb/daftar?school=tk',
          ctaText: 'Info SPMB TK IT',
          secondaryLogoUrl: undefined,
          logoUrl: undefined,
        };
      case 'sd':
        return {
          code: 'SD',
          arabic: '',
          title: 'SDIT AL-AFIYAH',
          subtitle: 'SMART AKHLAK FITRAH',
          homeUrl: getUnitHomeUrl('sd'),
          ppdbLink: '/sd/spmb/daftar',
          ctaText: 'DAFTAR',
          secondaryLogoUrl: '/images/ypib-logo.png',
          logoUrl: '/images/sd-logo.png',
        };
      case 'smp':
        return {
          code: 'SMP',
          arabic: '',
          title: 'SMP IT AL-AFIYAH',
          subtitle: 'BE SMART & RELIGIOUS',
          homeUrl: getUnitHomeUrl('smp'),
          ppdbLink: '/smp/spmb/daftar',
          ctaText: 'Daftar SPMB Online',
          secondaryLogoUrl: '/images/ypib-logo.png',
          logoUrl: '/images/smp-logo.png',
        };
      default:
        return {
          code: 'IB',
          arabic: 'معهد العافية الإسلامي',
          title: 'Yayasan Pendidikan Imam Bonjol',
          subtitle: 'Ekosistem Pendidikan Terpadu Al-Afiyah Majalengka',
          homeUrl: getUnitHomeUrl('foundation'),
          ppdbLink: '/ppdb/daftar',
          ctaText: 'Info SPMB Online',
          secondaryLogoUrl: undefined,
          logoUrl: '/images/ypib-logo.png',
        };
    }
  })();

  const navStructure = [
    {
      name: 'Beranda',
      href: brandConfig.homeUrl,
      hasDropdown: false,
    },
    {
      name: 'Profil',
      href: activeSlug === 'sd' ? '/sd/profil' : activeSlug === 'smp' ? '/smp/profil' : '/profil',
      hasDropdown: true,
      items: activeSlug === 'sd'
        ? [
            { label: 'Profil Sekolah', href: '/sd/profil' },
            { label: 'Struktur & Dewan Pendidik', href: '/sd/guru' },
            { label: 'Dokumentasi & Fasilitas', href: '/sd/dokumentasi' },
            { label: 'Kontak & Lokasi', href: '/sd/kontak' },
          ]
        : activeSlug === 'smp'
        ? [
            { label: 'Profil Sekolah', href: '/smp/profil' },
            { label: 'Struktur & Dewan Pendidik', href: '/smp/guru' },
            { label: 'Sarana & Fasilitas', href: '/smp/fasilitas' },
            { label: 'Galeri & Dokumentasi', href: '/smp/dokumentasi' },
            { label: 'Kontak & Lokasi', href: '/smp/kontak' },
          ]
        : activeSlug
        ? [
            { label: `Profil ${brandConfig.title}`, href: `${brandConfig.homeUrl}#values` },
            { label: 'Dewan Guru & Asatidzah', href: `${brandConfig.homeUrl}#teachers` },
            { label: 'Sarana & Fasilitas', href: `${brandConfig.homeUrl}#facilities` },
            { label: 'Kontak & Lokasi', href: '/kontak' },
          ]
        : [
            { label: 'Tentang Yayasan', href: '/profil#tentang' },
            { label: 'Visi, Misi & Karakter', href: '/profil#visi-misi' },
            { label: 'Struktur Manajemen', href: '/profil#manajemen' },
            { label: 'Dewan Guru & Asatidzah', href: '/#dewan-guru' },
            { label: 'Sarana & Fasilitas', href: '/profil#fasilitas' },
            { label: 'Kontak & Lokasi', href: '/kontak' },
          ],
    },
    ...(!activeSlug
      ? [
          {
            name: 'Satuan Pendidikan',
            href: '/satuan-pendidikan',
            hasDropdown: true,
            items: [
              { label: 'TK IT Al-Afiyah', href: getSchoolUrl('tk') },
              { label: 'SDIT Al-Afiyah', href: getSchoolUrl('sd') },
              { label: 'SMP IT Al-Afiyah', href: getSchoolUrl('smp') },
              { label: 'Selayang Pandang Unit', href: '/satuan-pendidikan' },
            ],
          },
        ]
      : [
          {
            name: 'Program',
            href: activeSlug === 'sd' ? '/sd/program' : activeSlug === 'smp' ? '/smp/program' : `${brandConfig.homeUrl}#programs`,
            hasDropdown: true,
            items: activeSlug === 'sd'
              ? [
                  { label: 'Program Unggulan & Kurikulum', href: '/sd/program' },
                  { label: 'Pilar Karakter Nabawiyah', href: '/sd/karakter' },
                  { label: 'Testimoni Wali Murid', href: '/sd/testimoni' },
                ]
              : activeSlug === 'smp'
              ? [
                  { label: 'Program Unggulan & Kurikulum', href: '/smp/program' },
                  { label: 'Karakter SCD & Mutaba\'ah Digital', href: '/smp/karakter' },
                  { label: 'Sarana & Fasilitas', href: '/smp/fasilitas' },
                  { label: 'Testimoni & Suara Sekolah', href: '/smp/testimoni' },
                ]
              : [
                  { label: 'Program Unggulan', href: `${brandConfig.homeUrl}#programs` },
                  { label: 'Pilar Karakter', href: `${brandConfig.homeUrl}#values` },
                  { label: 'Testimoni Wali Murid', href: `${brandConfig.homeUrl}#testimonials` },
                ],
          },
        ]),
    {
      name: 'Berita & Agenda',
      href: activeSlug === 'sd' ? '/sd/berita' : activeSlug === 'smp' ? '/smp/berita' : (activeSlug ? `/berita?school=${activeSlug}` : '/berita'),
      hasDropdown: true,
      items: [
        { label: 'Berita & Kegiatan Terbaru', href: activeSlug === 'sd' ? '/sd/berita' : activeSlug === 'smp' ? '/smp/berita' : (activeSlug ? `/berita?school=${activeSlug}` : '/berita') },
        { label: 'Prestasi Murid', href: activeSlug === 'sd' ? '/sd/berita?cat=prestasi' : activeSlug === 'smp' ? '/smp/berita?cat=prestasi' : (activeSlug ? `/berita?cat=prestasi&school=${activeSlug}` : '/berita?cat=prestasi') },
        { label: 'Agenda & Kalender Akademik', href: activeSlug === 'sd' ? '/sd/agenda' : activeSlug === 'smp' ? '/smp/agenda' : (activeSlug ? `/agenda?school=${activeSlug}` : '/agenda') },
      ],
    },
    {
      name: 'SPMB',
      href: activeSlug === 'sd' ? '/sd/spmb' : activeSlug === 'smp' ? '/smp/spmb' : (activeSlug ? `/ppdb/daftar?school=${activeSlug}` : '/ppdb/daftar'),
      hasDropdown: true,
      items: [
        { label: 'Informasi & Alur SPMB', href: activeSlug === 'sd' ? '/sd/spmb' : activeSlug === 'smp' ? '/smp/spmb' : (activeSlug ? `/ppdb/daftar?school=${activeSlug}` : '/ppdb/daftar') },
        { label: 'Formulir Pendaftaran Online', href: activeSlug === 'sd' ? '/sd/spmb/daftar' : activeSlug === 'smp' ? '/smp/spmb/daftar' : (activeSlug ? `/ppdb/daftar?school=${activeSlug}` : '/ppdb/daftar') },
        { label: 'Cek Status Seleksi', href: activeSlug === 'sd' ? '/sd/spmb/cek-status' : activeSlug === 'smp' ? '/smp/spmb/cek-status' : (activeSlug ? `/ppdb/cek-status?school=${activeSlug}` : '/ppdb/cek-status') },
        { label: 'Pengumuman Kelulusan', href: activeSlug === 'sd' ? '/sd/spmb/pengumuman' : activeSlug === 'smp' ? '/smp/spmb/pengumuman' : (activeSlug ? `/ppdb/pengumuman?school=${activeSlug}` : '/ppdb/pengumuman') },
      ],
    },
    {
      name: 'Lainnya',
      href: '#',
      hasDropdown: true,
      items: [
        { label: 'Program Affiliate Wali Murid', href: activeSlug ? `/affiliate?school=${activeSlug}` : '/affiliate' },
        { label: 'Doa & Dzikir Harian', href: activeSlug === 'sd' ? '/sd/doa-dzikir' : activeSlug === 'smp' ? '/smp/doa-dzikir' : (activeSlug ? `/doa-dzikir?school=${activeSlug}` : '/doa-dzikir') },
        {
          label: 'Hubungi via WhatsApp',
          href: activeSlug === 'sd'
            ? 'https://wa.me/6281310139001?text=Assalamu%27alaikum%20Panitia%20SDIT%20Al-Afiyah'
            : activeSlug === 'smp'
            ? 'https://wa.me/6282249357893?text=Assalamu%27alaikum%20Panitia%20SMP%20IT%20Al-Afiyah'
            : 'https://wa.me/6281223344552?text=Assalamu%27alaikum%20Al-Afiyah',
          openInNewTab: true,
        },
      ],
    },
  ];

  // Quick search items for modal
  const searchablePages = [
    { title: `Pendaftaran PPDB ${activeSlug ? activeSlug.toUpperCase() + ' IT' : '2027/2028'}`, url: brandConfig.ppdbLink, cat: 'PPDB' },
    { title: 'Cek Status Berkas Pendaftar', url: activeSlug === 'sd' ? '/sd/spmb/cek-status' : activeSlug === 'smp' ? '/smp/spmb/cek-status' : (activeSlug ? `/ppdb/cek-status?school=${activeSlug}` : '/ppdb/cek-status'), cat: 'PPDB' },
    { title: 'Pengumuman Kelulusan Murid', url: '/ppdb/pengumuman', cat: 'PPDB' },
    { title: 'Profil Yayasan Pendidikan Imam Bonjol', url: '/profil', cat: 'Profil' },
    ...(!activeSlug
      ? [
          { title: 'TK IT Al-Afiyah Majalengka', url: getSchoolUrl('tk'), cat: 'Unit' },
          { title: 'SDIT Al-Afiyah Majalengka', url: getSchoolUrl('sd'), cat: 'Unit' },
          { title: 'SMP IT Al-Afiyah Majalengka', url: getSchoolUrl('smp'), cat: 'Unit' },
        ]
      : []),
    { title: 'Agenda & Kalender Kegiatan', url: '/agenda', cat: 'Informasi' },
    { title: 'Berita & Kajian Artikel Islam', url: '/berita', cat: 'Artikel' },
    { title: 'Doa & Dzikir Harian Murid', url: '/doa-dzikir', cat: 'Ibadah' },
    { title: 'Tanya Ustadz & Konsultasi Syar’i', url: 'https://wa.me/6281223344552', cat: 'Konsultasi' },
    { title: 'Affiliate Al-Afiyah', url: '/affiliate', cat: 'Affiliate' },
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
        className={`w-full max-w-full overflow-x-clip z-40 transition-all duration-300 ${
          hasDarkHero ? 'fixed top-0 left-0 right-0' : 'sticky top-0'
        }`}
      >
        <header
          className={`w-full max-w-full select-none transition-all duration-300 border-b overflow-x-clip ${
            isMobileMenuOpen
              ? activeSlug === 'smp'
                ? 'bg-[#020148] border-white/10 shadow-lg'
                : activeSlug === 'sd'
                ? 'bg-[#034433] border-white/10 shadow-lg'
                : 'bg-[#08352c] border-white/10 shadow-lg'
              : shouldBeTransparent
              ? activeSlug === 'sd'
                ? 'bg-[#034433]/95 backdrop-blur-md border-white/10 shadow-none'
                : activeSlug === 'smp'
                ? 'bg-[#020148]/90 backdrop-blur-md border-white/10 shadow-none'
                : 'bg-[#08352c]/90 backdrop-blur-md border-white/10 shadow-none'
              : activeSlug === 'smp'
              ? 'max-lg:bg-[#020148] max-lg:border-white/10 bg-white/95 backdrop-blur-md shadow-md border-slate-200/90'
              : activeSlug === 'sd'
              ? 'max-lg:bg-[#034433] max-lg:border-white/10 bg-white/95 backdrop-blur-md shadow-md border-slate-200/90'
              : 'max-lg:bg-[#08352c] max-lg:border-white/10 bg-white/95 backdrop-blur-md shadow-md border-slate-200/90'
          }`}
        >
          <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-10 xl:px-12 w-full">
            <div className="flex items-center justify-between h-[60px] xs:h-[64px] sm:h-[72px] lg:h-[78px] w-full min-w-0">
              
              {/* Brand Logo & Typography (Al-Irsyad Inspired, Responsive & Truncated on Mobile) */}
              <Link
                href={brandConfig.homeUrl}
                prefetch={true}
                onClick={() => {
                  if (typeof window !== 'undefined' && pathname === brandConfig.homeUrl) {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }
                }}
                className="flex items-center gap-2 xs:gap-2.5 sm:gap-3 min-w-0 lg:shrink-0 mr-2 sm:mr-4 py-1 group cursor-pointer"
              >
                <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                  {brandConfig.secondaryLogoUrl && (
                    <img
                      src={brandConfig.secondaryLogoUrl}
                      alt="Logo Yayasan Pendidikan Imam Bonjol"
                      className="w-8 h-8 xs:w-[34px] xs:h-[34px] sm:w-9 sm:h-9 lg:w-[40px] lg:h-[40px] object-contain shrink-0 group-hover:scale-105 transition-transform duration-200 drop-shadow-sm"
                    />
                  )}
                  {brandConfig.logoUrl && (
                    <img
                      src={brandConfig.logoUrl}
                      alt={brandConfig.title}
                      className={`${
                        brandConfig.secondaryLogoUrl
                          ? 'w-[30px] h-[30px] xs:w-8 xs:h-8 sm:w-[34px] sm:h-[34px] lg:w-[38px] lg:h-[38px]'
                          : 'w-9 h-9 xs:w-10 xs:h-10 sm:w-[44px] sm:h-[44px] lg:w-[48px] lg:h-[48px]'
                      } object-contain shrink-0 group-hover:scale-105 transition-transform duration-200 drop-shadow-sm`}
                    />
                  )}
                </div>
                <div className="min-w-0 flex flex-col justify-center">
                  {brandConfig.arabic ? (
                    <>
                      {/* Arabic Calligraphy Style Title */}
                      <div
                        className={`text-[13px] xs:text-[14px] sm:text-base lg:text-lg font-bold tracking-normal font-serif transition-colors leading-tight truncate max-lg:text-white ${
                          shouldBeTransparent
                            ? 'text-white group-hover:text-amber-300 drop-shadow-sm'
                            : 'text-softwater-dark group-hover:text-softwater'
                        }`}
                        title={brandConfig.arabic}
                      >
                        {brandConfig.arabic}
                      </div>

                      {/* Latin Name (Pure White on Transparent & Mobile, Slate-800 on Desktop Scrolled) */}
                      <div className="mt-0.5">
                        <span
                          className={`text-[10px] xs:text-[11px] sm:text-xs font-black uppercase tracking-wider transition-colors truncate block max-lg:text-white ${
                            shouldBeTransparent
                              ? 'text-white group-hover:text-amber-300 drop-shadow-sm'
                              : 'text-slate-800 group-hover:text-softwater-dark'
                          }`}
                        >
                          {brandConfig.title}
                        </span>
                      </div>
                    </>
                  ) : (
                    <>
                      {/* Latin Name as Primary Headline on Top */}
                      <div>
                        <span
                          className={`text-[12.5px] xs:text-[13.5px] sm:text-[15px] lg:text-[16px] font-black uppercase tracking-wider transition-colors truncate lg:overflow-visible lg:whitespace-nowrap block leading-tight max-lg:text-white ${
                            shouldBeTransparent
                              ? 'text-white group-hover:text-amber-300 drop-shadow-sm'
                              : activeSlug === 'smp'
                              ? 'text-slate-900 group-hover:text-[#030164]'
                              : 'text-slate-900 group-hover:text-[#00A651]'
                          }`}
                        >
                          {brandConfig.title}
                        </span>
                      </div>

                      {/* Subtitle Below */}
                      {brandConfig.subtitle && (
                        <div className="mt-0.5">
                          <span
                            className={`text-[9px] xs:text-[9.5px] sm:text-[11px] lg:text-[11.5px] font-bold uppercase tracking-wider transition-colors truncate lg:overflow-visible lg:whitespace-nowrap block ${
                              activeSlug === 'smp'
                                ? 'max-lg:text-[#ffd51e]'
                                : 'max-lg:text-emerald-200/95'
                            } ${
                              shouldBeTransparent
                                ? activeSlug === 'smp'
                                  ? 'text-[#ffd51e] drop-shadow-xs'
                                  : 'text-emerald-200/95 drop-shadow-xs'
                                : activeSlug === 'smp'
                                ? 'text-[#030164]'
                                : 'text-[#00684e]'
                            }`}
                          >
                            {brandConfig.subtitle}
                          </span>
                        </div>
                      )}
                    </>
                  )}
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
                          prefetch={true}
                          onClick={() => {
                            if (nav.name === 'Beranda' && pathname === nav.href && typeof window !== 'undefined') {
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
                      {/* DROPDOWN MENU CARD (Minimalist Al-Hidayah White Dropdown)  */}
                      {/* ========================================================= */}
                      {nav.hasDropdown && isHovered && (
                        <div className="absolute left-0 top-full pt-1.5 z-50 animate-in fade-in duration-150">
                          <div
                            className={`w-60 bg-white text-slate-800 shadow-lg rounded-xs border border-slate-200 border-t-2 overflow-hidden py-1 divide-y divide-slate-100 ${
                              activeSlug === 'smp'
                                ? 'border-t-[#ffd51e]'
                                : 'border-t-[#e5a93b]'
                            }`}
                          >
                            {nav.items?.map((item) => {
                              const isSubdomainUrl =
                                item.href.includes('tk.') ||
                                item.href.includes('sd.') ||
                                item.href.includes('smp.');
                              const isExternalUrl =
                                item.href.startsWith('http') &&
                                !item.href.includes('alafiyah.id') &&
                                !item.href.includes('localhost');
                              const shouldOpenNewTab = Boolean((item as any).openInNewTab) || isSubdomainUrl || isExternalUrl;

                              const itemInner = (
                                <div className="flex items-center justify-between px-4 py-2.5 hover:bg-slate-50 transition-colors group/item">
                                  <span
                                    className={`text-xs font-bold transition-colors ${
                                      activeSlug === 'smp'
                                        ? 'text-slate-800 group-hover/item:text-[#030164]'
                                        : 'text-slate-800 group-hover/item:text-[#00594f]'
                                    }`}
                                  >
                                    {item.label}
                                  </span>
                                  <ChevronRight
                                    className={`w-3.5 h-3.5 text-slate-400 transition-transform group-hover/item:translate-x-0.5 shrink-0 ${
                                      activeSlug === 'smp'
                                        ? 'group-hover/item:text-[#030164]'
                                        : 'group-hover/item:text-[#00594f]'
                                    }`}
                                  />
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
                                      prefetch={true}
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

              {/* Desktop Actions: Search, Daftar & Login */}
              <div className="hidden lg:flex items-center gap-2 xl:gap-2.5 flex-shrink-0">
                {/* Search Modal Trigger Button */}
                <button
                  type="button"
                  onClick={() => setIsSearchOpen(true)}
                  title="Pencarian Cepat"
                  aria-label="Buka pencarian"
                  className={`p-2 rounded-xs transition-colors cursor-pointer shrink-0 ${
                    shouldBeTransparent
                      ? 'text-white hover:text-amber-300 hover:bg-white/10'
                      : 'text-slate-600 hover:text-softwater-dark hover:bg-slate-100'
                  }`}
                >
                  <Search className="w-4 h-4 xl:w-4.5 xl:h-4.5" />
                </button>

                <Link
                  href={brandConfig.ppdbLink}
                  prefetch={true}
                  className={`px-4 py-2 rounded-xs text-[11px] xl:text-xs font-extrabold uppercase tracking-wider shadow-xs transition-colors inline-flex items-center gap-1.5 shrink-0 ${
                    activeSlug === 'smp'
                      ? 'bg-[#ffd51e] hover:bg-amber-300 text-[#030164]'
                      : 'bg-[#e5a93b] hover:bg-[#d4962a] text-white'
                  }`}
                >
                  <span>DAFTAR</span>
                </Link>
                <Link
                  href={activeSlug ? `/login?unit=${activeSlug}` : '/login'}
                  prefetch={true}
                  title="Login"
                  className="px-4 py-2 rounded-xs bg-white hover:bg-slate-100 text-slate-800 border border-slate-200/90 text-[11px] xl:text-xs font-extrabold uppercase tracking-wider shadow-xs transition-colors inline-flex items-center gap-1.5 shrink-0"
                >
                  <span>LOGIN</span>
                </Link>
              </div>

              {/* Mobile & Tablet Right Actions: Minimalist "DAFTAR" + Square Menu Toggle */}
              <div className="flex lg:hidden items-center gap-2 shrink-0 ml-auto">
                <Link
                  href={brandConfig.ppdbLink}
                  prefetch={true}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`px-3 py-1.5 rounded-xs text-[11px] font-extrabold uppercase tracking-wider shadow-xs transition-colors inline-flex items-center shrink-0 ${
                    activeSlug === 'smp'
                      ? 'bg-[#ffd51e] hover:bg-amber-300 text-[#030164]'
                      : 'bg-[#e5a93b] hover:bg-[#d4962a] text-white'
                  }`}
                >
                  <span>DAFTAR</span>
                </Link>

                <button
                  type="button"
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  aria-label={isMobileMenuOpen ? 'Tutup menu navigasi' : 'Buka menu navigasi'}
                  className="w-9 h-9 rounded-xs bg-white/10 hover:bg-white/20 border border-white/20 text-white flex items-center justify-center transition-colors cursor-pointer shrink-0"
                >
                  {isMobileMenuOpen ? (
                    <X className="w-5 h-5" strokeWidth={2.2} />
                  ) : (
                    <Menu className="w-5 h-5" strokeWidth={2.2} />
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* ========================================================= */}
          {/* MINIMALIST AL-HIDAYAH MOBILE NAVIGATION PANEL             */}
          {/* ========================================================= */}
          {isMobileMenuOpen && (
            <div
              className={`lg:hidden w-full border-t border-white/15 px-4 pt-2 pb-4 shadow-xl transition-all duration-150 max-h-[calc(100dvh-60px)] overflow-y-auto ${
                activeSlug === 'smp'
                  ? 'bg-[#030164] border-b-4 border-b-[#ffd51e]'
                  : activeSlug === 'sd'
                  ? 'bg-[#003831] border-b-4 border-b-[#e5a93b]'
                  : 'bg-[#08352c] border-b-4 border-b-[#e5a93b]'
              }`}
            >
              {/* Clean Navigation List */}
              <div className="divide-y divide-white/10">
                {navStructure.map((nav) => {
                  const isExpanded = mobileExpandedSection === nav.name;
                  const isActive =
                    pathname === nav.href ||
                    (nav.href !== '/' &&
                      nav.href !== '#' &&
                      pathname.startsWith(nav.href.split('#')[0]));
                  const accentText = activeSlug === 'smp' ? 'text-[#ffd51e]' : 'text-[#e5a93b]';
                  const accentBorder = activeSlug === 'smp' ? 'border-[#ffd51e]' : 'border-[#e5a93b]';

                  if (!nav.hasDropdown) {
                    return (
                      <div key={nav.name}>
                        <Link
                          href={nav.href}
                          prefetch={true}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className={`flex items-center justify-between px-2 py-3 text-xs font-extrabold uppercase tracking-wider transition-colors ${
                            isActive
                              ? `${accentText} border-l-2 ${accentBorder} pl-3`
                              : 'text-white hover:text-white/80'
                          }`}
                        >
                          <span>{nav.name}</span>
                        </Link>
                      </div>
                    );
                  }

                  return (
                    <div key={nav.name}>
                      <button
                        type="button"
                        onClick={() =>
                          setMobileExpandedSection(isExpanded ? null : nav.name)
                        }
                        className={`w-full flex items-center justify-between px-2 py-3 text-xs font-extrabold uppercase tracking-wider text-left transition-colors cursor-pointer ${
                          isActive || isExpanded
                            ? `${accentText}`
                            : 'text-white hover:text-white/80'
                        }`}
                      >
                        <span>{nav.name}</span>
                        <ChevronDown
                          className={`w-4 h-4 transition-transform duration-150 ${
                            isExpanded
                              ? `rotate-180 ${accentText}`
                              : 'text-white/60'
                          }`}
                        />
                      </button>

                      {isExpanded && (
                        <div className="mb-2.5 ml-2 pl-3 border-l border-white/20 divide-y divide-white/5">
                          {nav.items?.map((item) => {
                            const isItemExt =
                              item.href.startsWith('http') &&
                              !item.href.includes('alafiyah.id') &&
                              !item.href.includes('localhost');
                            const isSubdomainUrl =
                              item.href.includes('tk.') ||
                              item.href.includes('sd.') ||
                              item.href.includes('smp.');
                            const shouldOpenNewTab =
                              Boolean((item as any).openInNewTab) ||
                              isItemExt ||
                              isSubdomainUrl;

                            const subItemContent = (
                              <div className="flex items-center justify-between py-2.5 px-2 hover:bg-white/5 transition-colors group/sub">
                                <span className="text-xs font-semibold text-white/90 group-hover/sub:text-white">
                                  {item.label}
                                </span>
                                <ChevronRight className="w-3.5 h-3.5 text-white/40 group-hover/sub:text-white shrink-0" />
                              </div>
                            );

                            if (shouldOpenNewTab) {
                              return (
                                <a
                                  key={item.label}
                                  href={item.href}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  onClick={() => setIsMobileMenuOpen(false)}
                                  className="block"
                                >
                                  {subItemContent}
                                </a>
                              );
                            }

                            if (item.href.startsWith('http')) {
                              return (
                                <a
                                  key={item.label}
                                  href={item.href}
                                  onClick={() => setIsMobileMenuOpen(false)}
                                  className="block"
                                >
                                  {subItemContent}
                                </a>
                              );
                            }

                            return (
                              <Link
                                key={item.label}
                                href={item.href}
                                prefetch={true}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="block"
                              >
                                {subItemContent}
                              </Link>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Bottom Minimalist Action Row: LOGIN & CARI */}
              <div className="mt-3 pt-3 border-t border-white/15 grid grid-cols-2 gap-2">
                <Link
                  href={activeSlug ? `/login?unit=${activeSlug}` : '/login'}
                  prefetch={true}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="py-2.5 px-3 rounded-xs bg-white hover:bg-slate-100 text-slate-900 font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>LOGIN</span>
                </Link>

                <button
                  type="button"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    setIsSearchOpen(true);
                  }}
                  className="py-2.5 px-3 rounded-xs bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-extrabold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Search className="w-3.5 h-3.5" />
                  <span>CARI</span>
                </button>
              </div>
            </div>
          )}
        </header>
      </div>

      {/* Backdrop Overlay when Mobile Menu is Open */}
      {isMobileMenuOpen && (
        <div
          onClick={() => setIsMobileMenuOpen(false)}
          className="lg:hidden fixed inset-0 z-30 bg-slate-950/55 backdrop-blur-[2px] animate-in fade-in duration-150"
        />
      )}

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
    </>
  );
}
