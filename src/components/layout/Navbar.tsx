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
          logoUrl: undefined,
        };
      case 'sd':
        return {
          code: 'SD',
          arabic: '',
          title: 'SDIT AL-AFIYAH',
          subtitle: 'SMART AKHLAK FITRAH',
          homeUrl: getUnitHomeUrl('sd'),
          ppdbLink: '/sd/spmb',
          ctaText: 'Info SPMB SDIT',
          logoUrl: '/images/sd-logo.png',
        };
      case 'smp':
        return {
          code: 'SMP',
          arabic: '',
          title: 'SMP IT AL-AFIYAH',
          subtitle: 'BE SMART & RELIGIOUS',
          homeUrl: getUnitHomeUrl('smp'),
          ppdbLink: '/smp/spmb',
          ctaText: 'Info SPMB SMP IT',
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
      href: activeSlug === 'sd' ? '/sd/profil' : activeSlug === 'smp' ? '/smp/profil' : '/profil',
      hasDropdown: true,
      items: activeSlug === 'sd'
        ? [
            { label: 'Profil Lengkap SDIT', href: '/sd/profil', desc: 'Visi, misi & identitas resmi SDIT' },
            { label: 'Dewan Guru & Asatidzah', href: '/sd/guru', desc: 'Pendidik tahfidz, sains & pembina karakter' },
            { label: 'Dokumentasi & Belajar SDIT', href: '/sd/dokumentasi', desc: 'Galeri nyata kegiatan belajar & agro-sains' },
            { label: 'Layanan Tata Usaha & Lokasi', href: '/sd/kontak', desc: 'Alamat sekolah & rute Google Maps' },
          ]
        : activeSlug === 'smp'
        ? [
            { label: 'Profil Lengkap SMP IT', href: '/smp/profil', desc: 'Visi, misi & legalitas Terakreditasi A' },
            { label: 'Dewan Asatidz & Pendidik', href: '/smp/guru', desc: 'Pendidik tahfidz, bahasa Arab & pembina santri' },
            { label: 'Sarana & Fasilitas Sekolah', href: '/smp/fasilitas', desc: 'Kelas ber-AC, lab komputer & lapangan futsal' },
            { label: 'Dokumentasi & Outing Santri', href: '/smp/dokumentasi', desc: 'Dokumentasi rihlah tubing, mabit & kegiatan' },
            { label: 'Layanan Tata Usaha & Lokasi', href: '/smp/kontak', desc: 'Alamat resmi Jl. Gerakan Koperasi & rute Maps' },
          ]
        : activeSlug
        ? [
            { label: `Profil & Karakter ${brandConfig.title}`, href: `${brandConfig.homeUrl}#values`, desc: 'Visi, adab nabawi & karakter islami' },
            { label: 'Dewan Guru & Asatidzah', href: `${brandConfig.homeUrl}#teachers`, desc: 'Pendidik tahfidz, sains & pembina karakter' },
            { label: 'Sarana & Fasilitas Belajar', href: `${brandConfig.homeUrl}#facilities`, desc: 'Lingkungan belajar ramah anak & asri' },
            { label: 'Kontak & Lokasi', href: '/kontak', desc: 'Alamat sekolah & peta navigasi' },
          ]
        : [
            { label: 'Tentang Yayasan & Sejarah', href: '/profil#tentang', desc: 'Latar belakang pendirian & amanah dakwah' },
            { label: 'Visi, Misi & 7 Karakter', href: '/profil#visi-misi', desc: 'Pondasi pembinaan adab & akademik' },
            { label: 'Struktur Manajemen Yayasan', href: '/profil#manajemen', desc: 'Dewan Pembina & Pengurus Yayasan' },
            { label: 'Dewan Guru & Asatidzah', href: '/#dewan-guru', desc: 'Pendidik tahfidz, sains & pembina karakter' },
            { label: 'Sarana & Fasilitas Sekolah', href: '/profil#fasilitas', desc: 'Masjid, lab modern & sarana olahraga' },
            { label: 'Selayang Pandang & Legalitas', href: '/profil#legalitas', desc: 'Izin Kemenkumham, Kemendikbud & Kemenag' },
            { label: 'Kontak & Lokasi Sekolah', href: '/kontak', desc: 'Alamat sekolah & peta navigasi' },
          ],
    },
    // Menu "Satuan Pendidikan" HANYA tampil di website utama (Yayasan/Pusat)
    ...(!activeSlug
      ? [
          {
            name: 'Satuan Pendidikan',
            href: '/satuan-pendidikan',
            hasDropdown: true,
            items: [
              {
                label: 'TK IT Al-Afiyah',
                href: getSchoolUrl('tk'),
                desc: 'PAUD & TK Islam Terpadu • Usia 4–6 Tahun',
              },
              {
                label: 'SDIT Al-Afiyah',
                href: getSchoolUrl('sd'),
                desc: 'Sekolah Dasar Islam Terpadu • Kelas 1–6',
              },
              {
                label: 'SMP IT Al-Afiyah',
                href: getSchoolUrl('smp'),
                desc: 'SMP IT Full Day School • Kelas 7–9',
              },
              {
                label: 'Selayang Pandang Satuan Pendidikan',
                href: '/satuan-pendidikan',
                desc: 'Ikhtisar kurikulum terpadu & target tahfidz',
              },
            ],
          },
        ]
      : [
          {
            name: 'Program & Keunggulan',
            href: activeSlug === 'sd' ? '/sd/program' : activeSlug === 'smp' ? '/smp/program' : `${brandConfig.homeUrl}#programs`,
            hasDropdown: true,
            items: activeSlug === 'sd'
              ? [
                  { label: '10 Program Unggulan SDIT', href: '/sd/program', desc: 'Karakter nabawiyah, adab & tahfidz mutqin' },
                  { label: 'Pilar Karakter & Nilai Islami', href: '/sd/karakter', desc: 'Tauhid, 7 pilar adab & kemandirian murid' },
                  { label: 'Kurikulum Smart Akhlak Fitrah', href: '/sd#values', desc: 'Fondasi iman sebelum Qur’an & adab harian' },
                  { label: 'Testimoni Wali Murid', href: '/sd/testimoni', desc: 'Pengalaman & apresiasi orang tua siswa' },
                ]
              : activeSlug === 'smp'
              ? [
                  { label: '6 Program Unggulan SMP IT', href: '/smp/program', desc: 'Tahfidz 3-5+ Juz, Bahasa Arab aktif & Futsal' },
                  { label: 'SCD & Mutaba\'ah Digital', href: '/smp/karakter', desc: 'Student Character Development & adab remaja' },
                  { label: 'Fasilitas & Sarana Belajar', href: '/smp/fasilitas', desc: 'Ruang kelas ber-AC, lab komputer & lapangan' },
                  { label: 'Testimoni Wali Santri', href: '/smp/testimoni', desc: 'Pengalaman & apresiasi orang tua santri' },
                ]
              : [
                  { label: 'Kurikulum & Program Unggulan', href: `${brandConfig.homeUrl}#programs`, desc: 'Pembelajaran terintegrasi & adab harian' },
                  { label: 'Pilar Nilai & Karakter', href: `${brandConfig.homeUrl}#values`, desc: 'Tauhid, tahfidz & budi pekerti luhur' },
                  { label: 'Testimoni Wali Murid', href: `${brandConfig.homeUrl}#testimonials`, desc: 'Pengalaman & apresiasi orang tua' },
                ],
          },
        ]),
    {
      name: 'Berita & Artikel',
      href: activeSlug === 'sd' ? '/sd/berita' : activeSlug === 'smp' ? '/smp/berita' : (activeSlug ? `/berita?school=${activeSlug}` : '/berita'),
      hasDropdown: true,
      items: [
        { label: activeSlug === 'sd' ? 'Warta SDIT Terbaru' : activeSlug === 'smp' ? 'Warta SMP IT Terbaru' : 'Warta Sekolah Terbaru', href: activeSlug === 'sd' ? '/sd/berita' : activeSlug === 'smp' ? '/smp/berita' : (activeSlug ? `/berita?school=${activeSlug}` : '/berita'), desc: 'Liputan kegiatan & informasi terkini' },
        { label: 'Artikel & Kajian Islam', href: activeSlug === 'sd' ? '/sd/berita?cat=kajian' : activeSlug === 'smp' ? '/smp/berita?cat=kajian' : (activeSlug ? `/berita?cat=kajian&school=${activeSlug}` : '/berita?cat=kajian'), desc: 'Tausiyah, adab & wawasan keislaman' },
        { label: activeSlug === 'sd' ? 'Prestasi Murid SDIT' : activeSlug === 'smp' ? 'Prestasi Santri SMP IT' : 'Prestasi Murid Al-Afiyah', href: activeSlug === 'sd' ? '/sd/berita?cat=prestasi' : activeSlug === 'smp' ? '/smp/berita?cat=prestasi' : (activeSlug ? `/berita?cat=prestasi&school=${activeSlug}` : '/berita?cat=prestasi'), desc: 'Juara olimpiade & musabaqah hifdzil Qur’an' },
        { label: 'Agenda & Kalender Akademik', href: activeSlug === 'sd' ? '/sd/agenda' : activeSlug === 'smp' ? '/smp/agenda' : (activeSlug ? `/agenda?school=${activeSlug}` : '/agenda'), desc: 'Jadwal ujian, libur & kegiatan resmi' },
      ],
    },
    {
      name: 'SPMB Online',
      href: activeSlug === 'sd' ? '/sd/spmb' : activeSlug === 'smp' ? '/smp/spmb' : (activeSlug ? `/ppdb/daftar?school=${activeSlug}` : '/ppdb/daftar'),
      hasDropdown: true,
      items: [
        { label: `Informasi & Alur SPMB ${activeSlug ? activeSlug.toUpperCase() + ' IT' : '2027/2028'}`, href: activeSlug === 'sd' ? '/sd/spmb' : activeSlug === 'smp' ? '/smp/spmb' : (activeSlug ? `/ppdb/daftar?school=${activeSlug}` : '/ppdb/daftar'), desc: 'Syarat berkas, tes observasi & kuota' },
        { label: 'Formulir SPMB Online', href: activeSlug === 'sd' ? '/sd/spmb/daftar' : activeSlug === 'smp' ? '/smp/spmb/daftar' : (activeSlug ? `/ppdb/daftar?school=${activeSlug}` : '/ppdb/daftar'), desc: 'Isi formulir biodata calon murid' },
        { label: 'Cek Status SPMB', href: activeSlug === 'sd' ? '/sd/spmb/cek-status' : activeSlug === 'smp' ? '/smp/spmb/cek-status' : (activeSlug ? `/ppdb/cek-status?school=${activeSlug}` : '/ppdb/cek-status'), desc: 'Pantau verifikasi berkas & nomor registrasi' },
        { label: 'Pengumuman SPMB', href: activeSlug === 'sd' ? '/sd/spmb/pengumuman' : activeSlug === 'smp' ? '/smp/spmb/pengumuman' : (activeSlug ? `/ppdb/pengumuman?school=${activeSlug}` : '/ppdb/pengumuman'), desc: 'SK kelulusan murid gelombang 1 & 2' },
        { label: 'Daftar Ulang & Biaya', href: activeSlug === 'sd' ? '/sd/spmb/cek-status' : activeSlug === 'smp' ? '/smp/spmb' : (activeSlug ? `/portal/ppdb/REG-SD-2026-0001/daftar-ulang?school=${activeSlug}` : '/portal/ppdb/REG-SD-2026-0001/daftar-ulang'), desc: 'Rincian biaya & rekening resmi' },
      ],
    },
    {
      name: 'Lainnya',
      href: '#',
      hasDropdown: true,
      items: [
        { label: activeSlug === 'smp' ? 'SIAKAD & Mutaba\'ah Santri' : 'SIAKAD Mobile Murid (iOS)', href: activeSlug === 'sd' ? '/sd/siakad' : activeSlug === 'smp' ? '/smp/siakad' : (activeSlug ? `/portal/siakad?school=${activeSlug}` : '/portal/siakad'), desc: 'Portal presensi QR, capaian tahfidz & rapor digital' },
        { label: 'Kemitraan Mitra Afiliasi', href: activeSlug ? `/affiliate?school=${activeSlug}` : '/affiliate', desc: 'Bagi hasil komisi mitra rujukan pendidikan' },
        { label: 'Doa & Dzikir Harian', href: activeSlug === 'sd' ? '/sd/doa-dzikir' : activeSlug === 'smp' ? '/smp/doa-dzikir' : (activeSlug ? `/doa-dzikir?school=${activeSlug}` : '/doa-dzikir'), desc: 'Al-Ma’tsurat pagi petang & adab penuntut ilmu' },
        { 
          label: activeSlug === 'smp' ? 'Konsultasi Panitia SMP IT' : 'Tanya Ustadz & Konsultasi', 
          href: activeSlug === 'sd' 
            ? 'https://wa.me/6281310139001?text=Assalamu%27alaikum%20Ustadz%20SD%20IT%20Al-Afiyah,%20saya%20ingin%20berkonsultasi' 
            : activeSlug === 'smp'
            ? 'https://wa.me/6282249357893?text=Assalamu%27alaikum%20Panitia%20SPMB%20SMP%20IT%20Al-Afiyah,%20saya%20ingin%20berkonsultasi'
            : 'https://wa.me/6281223344552?text=Assalamu%27alaikum%20Ustadz%2C%20saya%20ingin%20bertanya%20seputar%20pendidikan%20Al-Afiyah', 
          desc: activeSlug === 'smp' ? 'Hotline resmi WhatsApp Panitia 0822-4935-7893' : 'Konsultasi kurikulum adab & syar’i langsung dengan asatidzah', 
          openInNewTab: true 
        },
        { 
          label: activeSlug === 'sd' ? 'Pusat Bantuan WhatsApp SDIT' : activeSlug === 'smp' ? 'Pusat Bantuan WA SMP IT' : 'Pusat Bantuan WhatsApp', 
          href: activeSlug === 'sd' ? 'https://wa.me/6281310139001' : activeSlug === 'smp' ? 'https://wa.me/6282249357893' : 'https://wa.me/6281223344552', 
          desc: 'Respon cepat tim panitia',
          openInNewTab: true 
        },
      ],
    },
  ];

  // Quick search items for modal
  const searchablePages = [
    { title: 'SIAKAD Mobile Murid & Presensi QR', url: '/portal/siakad', cat: 'Akademik' },
    { title: `Pendaftaran PPDB ${activeSlug ? activeSlug.toUpperCase() + ' IT' : '2027/2028'}`, url: brandConfig.ppdbLink, cat: 'PPDB' },
    { title: 'Cek Status Berkas Pendaftar', url: activeSlug ? `/ppdb/cek-status?school=${activeSlug}` : '/ppdb/cek-status', cat: 'PPDB' },
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
        className={`w-full max-w-full overflow-x-clip z-40 transition-all duration-300 ${
          hasDarkHero ? 'fixed top-0 left-0 right-0' : 'sticky top-0'
        }`}
      >
        <header
          className={`w-full max-w-full select-none transition-all duration-300 border-b overflow-x-clip ${
            shouldBeTransparent
              ? 'bg-transparent border-white/10 shadow-none'
              : 'bg-white/95 backdrop-blur-md shadow-md border-slate-200/90'
          }`}
        >
          <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-10 xl:px-12 w-full">
            <div className="flex items-center justify-between h-[64px] sm:h-[72px] w-full min-w-0">
              
              {/* Brand Logo & Typography (Al-Irsyad Inspired, Responsive & Truncated on Mobile) */}
              <Link
                href={brandConfig.homeUrl}
                prefetch={true}
                onClick={() => {
                  if (typeof window !== 'undefined' && pathname === brandConfig.homeUrl) {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }
                }}
                className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1 mr-2 sm:mr-6 xl:mr-10 py-1 group cursor-pointer"
              >
                {brandConfig.logoUrl && (
                  <img
                    src={brandConfig.logoUrl}
                    alt={brandConfig.title}
                    className="w-9 h-9 sm:w-11 sm:h-11 object-contain shrink-0 group-hover:scale-105 transition-transform duration-200 drop-shadow-xs"
                  />
                )}
                <div className="min-w-0 flex flex-col justify-center">
                  {brandConfig.arabic ? (
                    <>
                      {/* Arabic Calligraphy Style Title */}
                      <div
                        className={`text-xs xs:text-sm sm:text-lg xl:text-xl font-bold tracking-normal font-serif transition-colors leading-tight truncate ${
                          shouldBeTransparent
                            ? 'text-white group-hover:text-amber-300 drop-shadow-sm'
                            : 'text-softwater-dark group-hover:text-softwater'
                        }`}
                        title={brandConfig.arabic}
                      >
                        {brandConfig.arabic}
                      </div>

                      {/* Latin Name (Pure White on Transparent, Slate-800 on Scrolled) */}
                      <div className="mt-0.5">
                        <span
                          className={`text-[11px] sm:text-sm font-extrabold uppercase tracking-wider transition-colors truncate block ${
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
                          className={`text-xs xs:text-sm sm:text-base font-extrabold uppercase tracking-wider transition-colors truncate block leading-tight ${
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
                            className={`text-[9px] xs:text-[10px] sm:text-[11px] font-bold uppercase tracking-wider transition-colors truncate block ${
                              shouldBeTransparent
                                ? activeSlug === 'smp'
                                  ? 'text-[#ffd51e] drop-shadow-xs'
                                  : 'text-emerald-300 drop-shadow-xs'
                                : activeSlug === 'smp'
                                ? 'text-[#030164]'
                                : 'text-[#007638]'
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
                  prefetch={true}
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
              <div className="flex lg:hidden items-center gap-1 sm:gap-2 shrink-0 ml-auto">
                <button
                  type="button"
                  onClick={() => setIsSearchOpen(true)}
                  title="Pencarian Cepat"
                  aria-label="Buka pencarian"
                  className={`p-1.5 sm:p-2 rounded-full transition-colors cursor-pointer shrink-0 ${
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
                  className={`p-1.5 sm:p-2 rounded-xl transition-colors cursor-pointer shrink-0 ${
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
                    {brandConfig.arabic ? (
                      <div className="text-sm font-bold text-softwater-dark">
                        {brandConfig.arabic}
                      </div>
                    ) : null}
                    <div className="text-xs font-black uppercase text-slate-800 tracking-wider">
                      {brandConfig.title}
                    </div>
                    {brandConfig.subtitle && (
                      <div className={`text-[10px] font-bold uppercase tracking-wider mt-0.5 ${
                        activeSlug === 'smp' ? 'text-[#030164]' : 'text-[#007638]'
                      }`}>
                        {brandConfig.subtitle}
                      </div>
                    )}
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
                        prefetch={true}
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
                                prefetch={true}
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

            {/* Drawer Bottom Actions: Minimalist, Clear & Left-Aligned */}
            <div className="p-3.5 border-t border-slate-100 bg-white space-y-2">
              {/* Primary Action Button (Rata Kiri) */}
              <Link
                href={brandConfig.ppdbLink}
                prefetch={true}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl ${
                  activeSlug === 'sd'
                    ? 'bg-[#00A651] hover:bg-[#008f45]'
                    : 'bg-softwater-dark hover:bg-softwater-deep'
                } text-white font-extrabold text-xs shadow-sm hover:shadow transition-all group`}
              >
                <div className="text-left">
                  <div className="tracking-wide uppercase leading-tight">
                    {brandConfig.ctaText}
                  </div>
                  <div className="text-[10px] text-emerald-100 font-medium normal-case mt-0.5 opacity-90">
                    Tahun Ajaran 2027/2028
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-white shrink-0 group-hover:translate-x-1 transition-transform" />
              </Link>

              {/* Login Portal Link (Rata Kiri) */}
              <Link
                href={activeSlug ? `/login?unit=${activeSlug}` : '/login'}
                prefetch={true}
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl border border-slate-200 hover:border-emerald-300 bg-slate-50/80 hover:bg-emerald-50/50 text-slate-800 transition-all group"
              >
                <div className="flex items-center gap-2.5 text-left">
                  <LogIn className="w-4 h-4 text-[#00A651] shrink-0" />
                  <div className="text-left">
                    <div className="text-xs font-bold text-slate-800 leading-tight">
                      Login Portal Layanan &amp; Akademik
                    </div>
                    <div className="text-[10px] text-slate-400 font-medium mt-0.5">
                      Akses akun murid &amp; orang tua
                    </div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 group-hover:text-emerald-600 transition-all shrink-0" />
              </Link>

              {/* WhatsApp Helpdesk (Rata Kiri) */}
              <a
                href={activeSlug === 'sd' ? 'https://wa.me/6281310139001' : 'https://wa.me/6281223344552'}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center gap-2.5 px-4 py-2 rounded-xl text-slate-600 hover:text-emerald-700 hover:bg-emerald-50/50 transition-all text-left"
              >
                <MessageCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="text-xs font-semibold">
                  {activeSlug === 'sd' ? 'Pusat Bantuan WhatsApp SDIT' : 'Pusat Bantuan WhatsApp'}
                </span>
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
