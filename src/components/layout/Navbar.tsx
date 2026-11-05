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
            { label: 'Prestasi & Capaian Murid', href: '/sd#prestasi', desc: 'Piala juara tahfidz, sains & kejuaraan murid' },
            { label: 'Struktur & Dewan Pendidik', href: '/sd/guru', desc: 'Struktur kepengurusan, asatidzah & tim IT' },
            { label: 'Dokumentasi & Belajar SDIT', href: '/sd/dokumentasi', desc: 'Galeri nyata kegiatan belajar & agro-sains' },
            { label: 'Layanan Tata Usaha & Lokasi', href: '/sd/kontak', desc: 'Alamat sekolah & rute Google Maps' },
          ]
        : activeSlug === 'smp'
        ? [
            { label: 'Profil Lengkap SMP IT', href: '/smp/profil', desc: 'Visi, misi & legalitas Terakreditasi A' },
            { label: 'Prestasi & Capaian Santri', href: '/smp#prestasi', desc: 'Piala kejuaraan MHQ, tahfidz & akademik santri' },
            { label: 'Struktur & Dewan Pendidik', href: '/smp/guru', desc: 'Struktur kepengurusan, asatidzah & tim IT' },
            { label: 'Sarana & Fasilitas Sekolah', href: '/smp/fasilitas', desc: 'Kelas ber-AC, lab komputer & lapangan futsal' },
            { label: 'Dokumentasi & Galeri Murid', href: '/smp/dokumentasi', desc: 'Haflah kelulusan, wisuda tahfidz & rihlah murid' },
            { label: 'Layanan Tata Usaha & Lokasi', href: '/smp/kontak', desc: 'Alamat resmi Jl. Gerakan Koperasi & rute Maps' },
          ]
        : activeSlug
        ? [
            { label: `Profil & Karakter ${brandConfig.title}`, href: `${brandConfig.homeUrl}#values`, desc: 'Visi, adab nabawi & karakter islami' },
            { label: 'Prestasi & Capaian Murid', href: `${brandConfig.homeUrl}#prestasi`, desc: 'Kejuaraan & prestasi murid' },
            { label: 'Dewan Guru & Asatidzah', href: `${brandConfig.homeUrl}#teachers`, desc: 'Pendidik tahfidz, sains & pembina karakter' },
            { label: 'Sarana & Fasilitas Belajar', href: `${brandConfig.homeUrl}#facilities`, desc: 'Lingkungan belajar ramah anak & asri' },
            { label: 'Kontak & Lokasi', href: '/kontak', desc: 'Alamat sekolah & peta navigasi' },
          ]
        : [
            { label: 'Tentang Yayasan & Sejarah', href: '/profil#tentang', desc: 'Latar belakang pendirian & amanah dakwah' },
            { label: 'Galeri Prestasi Murid', href: '/#prestasi', desc: 'Papan kejuaraan & piala murid Al-Afiyah' },
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
            name: 'Program',
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
                  { label: 'Testimoni Wali Murid', href: '/smp/testimoni', desc: 'Pengalaman & apresiasi orang tua murid' },
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
        { label: activeSlug === 'sd' ? 'Prestasi Murid SDIT' : activeSlug === 'smp' ? 'Prestasi Murid SMP IT' : 'Prestasi Murid Al-Afiyah', href: activeSlug === 'sd' ? '/sd/berita?cat=prestasi' : activeSlug === 'smp' ? '/smp/berita?cat=prestasi' : (activeSlug ? `/berita?cat=prestasi&school=${activeSlug}` : '/berita?cat=prestasi'), desc: 'Juara turnamen futsal, tahfidz & sains' },
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
        { label: 'Affiliate Al-Afiyah', href: activeSlug ? `/affiliate?school=${activeSlug}` : '/affiliate', desc: 'Bagi hasil komisi rujukan Affiliate Al-Afiyah' },
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
                                !item.href.includes('alafiyah.id') &&
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

              {/* Desktop Actions: Search, Daftar & Login */}
              <div className="hidden lg:flex items-center gap-2 xl:gap-2.5 flex-shrink-0">
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
                  <Search className="w-4 h-4 xl:w-4.5 xl:h-4.5" />
                </button>

                <Link
                  href={brandConfig.ppdbLink}
                  prefetch={true}
                  className={`px-4 py-2 rounded-full text-[11px] xl:text-xs font-extrabold uppercase tracking-wider shadow-sm transition-all hover:scale-[1.02] active:scale-95 inline-flex items-center gap-1.5 shrink-0 ${
                    activeSlug === 'smp'
                      ? 'bg-[#ffd51e] hover:bg-amber-300 text-[#030164]'
                      : 'bg-[#f59e0b] hover:bg-[#d97706] text-white'
                  }`}
                >
                  <GraduationCap className="w-3.5 h-3.5 stroke-[2.3]" />
                  <span>DAFTAR</span>
                </Link>
                <Link
                  href={activeSlug ? `/login?unit=${activeSlug}` : '/login'}
                  prefetch={true}
                  title="Masuk ke Portal Layanan & Sistem Akademik"
                  className="px-4 py-2 rounded-full bg-white hover:bg-slate-100 text-slate-800 border border-slate-200/90 text-[11px] xl:text-xs font-extrabold uppercase tracking-wider shadow-sm transition-all hover:scale-[1.02] active:scale-95 inline-flex items-center gap-1.5 shrink-0"
                >
                  <svg className="w-3.5 h-3.5 text-slate-700 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <rect width="7" height="7" x="3" y="3" rx="1" />
                    <rect width="7" height="7" x="14" y="3" rx="1" />
                    <rect width="7" height="7" x="14" y="14" rx="1" />
                    <rect width="7" height="7" x="3" y="14" rx="1" />
                  </svg>
                  <span>LOGIN</span>
                </Link>
              </div>

              {/* Mobile & Tablet Right Actions: Pill "DAFTAR" + Rounded Square Menu/Close Toggle */}
              <div className="flex lg:hidden items-center gap-2 sm:gap-2.5 shrink-0 ml-auto">
                <Link
                  href={brandConfig.ppdbLink}
                  prefetch={true}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`px-3 xs:px-3.5 py-1.5 xs:py-2 rounded-full text-[11px] xs:text-xs font-extrabold uppercase tracking-wider shadow-md transition-all active:scale-95 inline-flex items-center gap-1.5 shrink-0 ${
                    activeSlug === 'smp'
                      ? 'bg-[#ffd51e] hover:bg-amber-300 text-[#030164]'
                      : 'bg-[#f59e0b] hover:bg-[#d97706] text-white'
                  }`}
                >
                  <GraduationCap className="w-3.5 h-3.5 stroke-[2.4]" />
                  <span>DAFTAR</span>
                </Link>

                <button
                  type="button"
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  aria-label={isMobileMenuOpen ? 'Tutup menu navigasi' : 'Buka menu navigasi'}
                  className="w-9 h-9 xs:w-10 xs:h-10 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-white flex items-center justify-center transition-all cursor-pointer shrink-0 active:scale-95"
                >
                  {isMobileMenuOpen ? (
                    <X className="w-5 h-5 xs:w-[22px] xs:h-[22px]" strokeWidth={2.4} />
                  ) : (
                    <Menu className="w-5 h-5 xs:w-[22px] xs:h-[22px]" strokeWidth={2.4} />
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* ========================================================= */}
          {/* BESPOKE AL-AFIYAH TOP-DOWN MOBILE NAVIGATION PANEL        */}
          {/* ========================================================= */}
          {isMobileMenuOpen && (
            <div
              className={`lg:hidden w-full border-t border-white/10 px-4 pt-3 pb-5 shadow-2xl rounded-b-3xl transition-all duration-200 max-h-[calc(100dvh-64px)] overflow-y-auto ${
                activeSlug === 'smp'
                  ? 'bg-gradient-to-b from-[#020148] via-[#030164] to-[#010030] border-b-2 border-b-[#ffd51e]/35'
                  : activeSlug === 'sd'
                  ? 'bg-gradient-to-b from-[#034433] via-[#04543f] to-[#023326] border-b-2 border-b-[#f59e0b]/35'
                  : 'bg-gradient-to-b from-[#08352c] via-[#0B332B] to-[#05241e] border-b-2 border-b-amber-400/35'
              }`}
            >
              {/* Navigation Rows */}
              <div className="divide-y divide-white/10">
                {navStructure.map((nav) => {
                  const isExpanded = mobileExpandedSection === nav.name;
                  const isActive =
                    pathname === nav.href ||
                    (nav.href !== '/' &&
                      nav.href !== '#' &&
                      pathname.startsWith(nav.href.split('#')[0]));

                  if (!nav.hasDropdown) {
                    return (
                      <div key={nav.name} className="py-1">
                        <Link
                          href={nav.href}
                          prefetch={true}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                            isActive
                              ? 'bg-white/12 text-[#ffd51e] border-l-4 border-[#ffd51e] shadow-xs'
                              : 'text-white/95 hover:bg-white/8 hover:text-[#ffd51e]'
                          }`}
                        >
                          <span>{nav.name}</span>
                          {isActive && (
                            <span className="w-2 h-2 rounded-full bg-[#ffd51e] shadow-[0_0_8px_#ffd51e]" />
                          )}
                        </Link>
                      </div>
                    );
                  }

                  return (
                    <div key={nav.name} className="py-1">
                      <button
                        type="button"
                        onClick={() =>
                          setMobileExpandedSection(isExpanded ? null : nav.name)
                        }
                        className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-bold text-left transition-all cursor-pointer ${
                          isActive || isExpanded
                            ? 'bg-white/12 text-[#ffd51e] border-l-4 border-[#ffd51e]'
                            : 'text-white/95 hover:bg-white/8'
                        }`}
                      >
                        <span>{nav.name}</span>
                        <ChevronDown
                          className={`w-4 h-4 transition-transform duration-200 ${
                            isExpanded
                              ? 'rotate-180 text-[#ffd51e]'
                              : 'text-white/60'
                          }`}
                        />
                      </button>

                      {isExpanded && (
                        <div className="mt-1.5 mb-2 ml-3 pl-3 border-l-2 border-white/15 space-y-1">
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
                              <div className="flex items-center justify-between px-3 py-2.5 rounded-xl bg-black/15 hover:bg-white/10 transition-colors group/sub">
                                <div className="min-w-0 pr-2">
                                  <p className="text-xs font-bold text-white group-hover/sub:text-[#ffd51e] transition-colors">
                                    {item.label}
                                  </p>
                                  {'desc' in item && item.desc && (
                                    <p className="text-[10px] text-white/65 line-clamp-1 mt-0.5">
                                      {item.desc}
                                    </p>
                                  )}
                                </div>
                                <ChevronRight className="w-3.5 h-3.5 text-white/40 group-hover/sub:text-[#ffd51e] shrink-0" />
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

              {/* Bottom Full-Width White LOGIN Button + Quick Utility Pills */}
              <div className="mt-4 pt-3 border-t border-white/15 space-y-2.5">
                <Link
                  href={activeSlug ? `/login?unit=${activeSlug}` : '/login'}
                  prefetch={true}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full py-3.5 px-4 rounded-xl bg-white hover:bg-slate-100 text-slate-900 font-extrabold text-xs sm:text-sm uppercase tracking-wider shadow-lg transition-all active:scale-[0.99] flex items-center justify-center gap-2.5"
                >
                  <svg
                    className="w-4 h-4 text-slate-800 shrink-0"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect width="7" height="7" x="3" y="3" rx="1" />
                    <rect width="7" height="7" x="14" y="3" rx="1" />
                    <rect width="7" height="7" x="14" y="14" rx="1" />
                    <rect width="7" height="7" x="3" y="14" rx="1" />
                  </svg>
                  <span>LOGIN</span>
                </Link>

                {/* Distinctive Al-Afiyah Quick Utility Pills */}
                <div className="grid grid-cols-2 gap-2">
                  <Link
                    href={activeSlug ? `/affiliate/register?unit=${activeSlug}` : '/affiliate'}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="py-2.5 px-3 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 text-white text-[11px] font-bold flex items-center justify-center gap-1.5 transition-all"
                  >
                    <HeartHandshake className="w-3.5 h-3.5 text-[#ffd51e] shrink-0" />
                    <span className="truncate">Daftar Affiliate</span>
                  </Link>

                  <button
                    type="button"
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      setIsSearchOpen(true);
                    }}
                    className="py-2.5 px-3 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 text-white text-[11px] font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                  >
                    <Search className="w-3.5 h-3.5 text-[#ffd51e] shrink-0" />
                    <span className="truncate">Cari Cepat</span>
                  </button>
                </div>
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
