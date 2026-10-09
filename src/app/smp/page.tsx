import React from 'react';
import SchoolLandingTemplate, { SchoolData, FacilityItem } from '@/components/landing/SchoolLandingTemplate';
import { prisma } from '@/lib/prisma';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'SMP IT Al-Afiyah Majalengka | Be Smart & Religious • Terakreditasi A',
  description: 'Penerimaan Murid Baru (SPMB) SMP IT Al-Afiyah Majalengka T.A. 2027/2028. Terakreditasi A BAN-S/M, target tahfidz 3-5+ juz mutqin, Bahasa Arab aktif, SCD, Mutaba\'ah Digital, & Futsal Development Program. Diskon uang bangunan s.d. 70%.',
  icons: {
    icon: [
      { url: '/images/smp-logo.png', type: 'image/png' },
      { url: '/smp-favicon.ico', sizes: 'any' },
    ],
    shortcut: '/images/smp-logo.png',
    apple: '/images/smp-logo.png',
  },
  openGraph: {
    title: 'SMP IT Al-Afiyah Majalengka | Be Smart & Religious',
    description: 'SPMB SMP IT Al-Afiyah T.A. 2027/2028 Gelombang 1 dibuka. Diskon Uang Bangunan 70% (SDIT) dan 50% (Umum).',
    images: ['/images/smp-spmb-poster.png'],
  },
};

export const revalidate = 60;

export default async function SmpLandingPage() {
  let dbSchool = null;
  try {
    dbSchool = await prisma.school.findUnique({
      where: { slug: 'smp' },
      include: {
        cmsSections: true,
        teachers: {
          where: { isActive: true },
          orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
        },
        newsPosts: {
          where: { isPublished: true },
          orderBy: [{ publishedAt: 'desc' }, { createdAt: 'desc' }],
          take: 3,
        },
      },
    });
  } catch (err) {
    console.error('Error fetching SMP school data, falling back to static content:', err);
  }

  const sectionsMap: Record<string, any> = {};
  for (const sec of dbSchool?.cmsSections || []) {
    try {
      sectionsMap[sec.sectionKey] = JSON.parse(sec.payload);
    } catch {
      sectionsMap[sec.sectionKey] = sec.payload;
    }
  }

  const heroData = sectionsMap.hero || {};
  const identityData = sectionsMap.identity || sectionsMap.contact || {};

  const defaultPrograms = [
    {
      title: 'Tahfidz Juz 28, 29, 30 & Unggulan 5+ Juz',
      desc: 'Bimbingan hafalan Al-Qur\'an mutqin & tartil dengan target capaian 3 Juz dasar (Juz 28, 29, 30) serta kelas tahfidz unggulan 5 Juz / lebih.',
      badge: 'Tahfidz Qur\'an',
    },
    {
      title: 'Fasih Berbahasa Arab',
      desc: 'Pembiasaan dan pembinaan aktif penguasaan Bahasa Arab fasih baik kemampuan lisan maupun tulisan.',
      badge: 'Bahasa Arab Aktif',
    },
    {
      title: 'SCD (Student Character Development)',
      desc: 'Penempaan karakter islami, keteladanan adab nabawi, kepemimpinan, dan kemandirian santri.',
      badge: 'Karakter & Adab',
    },
    {
      title: 'Mutaba\'ah Digital',
      desc: 'Program pembiasaan dan monitoring ibadah harian berbasis digital yang melibatkan kolaborasi antara siswa, orang tua, dan sekolah.',
      badge: 'Digital Monitoring',
    },
    {
      title: 'Futsal Development Program',
      desc: 'Program unggulan SMP IT Al Afiyah yang berfokus pada pembinaan dan pengembangan potensi siswa dalam bidang olahraga futsal secara terarah dan berkelanjutan.',
      badge: 'Olahraga Prestasi',
    },
    {
      title: 'Ekstrakurikuler Pilihan',
      desc: 'Pramuka, Tata Boga, Bahasa Arab, dan Futsal sebagai wadah pengembangan bakat, minat, serta kecakapan hidup santri.',
      badge: 'Bakat & Minat',
    },
  ];

  const defaultFacilities: FacilityItem[] = [
    {
      name: 'Ruang Kelas Ber-AC & Nyaman',
      image: '/images/smp-hero-fullday.jpg',
      desc: 'Ruang kelas kondusif yang dilengkapi fasilitas pendingin udara (AC), proyektor multimedia, dan sarana belajar bersih terawat.',
      category: 'Fasilitas Belajar',
    },
    {
      name: 'Laboratorium Komputer',
      image: '/images/smp-hero-bilingual.jpg',
      desc: 'Laboratorium komputer lengkap dengan akses internet high-speed Wi-Fi untuk menunjang literasi digital dan sains murid.',
      category: 'Teknologi',
    },
    {
      name: 'Lapangan Olahraga',
      image: '/images/smp-hero-pesantren.jpg',
      desc: 'Sarana olahraga representatif untuk latihan intensif Futsal Development Program dan kebugaran fisik santri.',
      category: 'Olahraga',
    },
    {
      name: 'Masjid / Mushola Sekolah',
      image: '/images/smp-outing-3.jpg',
      desc: 'Pusat ibadah shalat berjamaah, pembinaan akhlak mulia, dan halaqah tahfidz Al-Qur\'an santri bersama para asatidz.',
      category: 'Ibadah',
    },
    {
      name: 'Akses Internet / Wi-Fi',
      image: '/images/smp-tubing-1.jpg',
      desc: 'Jaringan koneksi internet sekolah untuk mendukung sistem Mutaba\'ah Digital dan integrasi akademik modern.',
      category: 'Teknologi',
    },
  ];

  const schoolData: SchoolData = {
    slug: 'smp',
    name: identityData.name || dbSchool?.name || 'SMP IT Al-Afiyah',
    badgeText: identityData.badgeText || dbSchool?.badgeText || 'TERAKREDITASI A • SMP ISLAM TERPADU AL-AFIYAH',
    tagline: identityData.tagline || dbSchool?.tagline || 'Be Smart & Religious',
    primaryColor: dbSchool?.primaryColor || '#030164',
    accentColor: dbSchool?.accentColor || '#ffd51e',
    registrationFee: dbSchool?.registrationFee || 200000,
    waCenterPhone: identityData.whatsappNumber || dbSchool?.waCenterPhone || '6282249357893',
    address: identityData.schoolAddress || identityData.address || dbSchool?.address || 'Jl. Gerakan Koperasi No. 110, Majalengka Wetan, Kab. Majalengka 45411',
    heroHeadline: heroData.headline || 'Mencetak Generasi Smart & Religious Berakhlak Qur\'ani',
    heroSubheadline: heroData.subheadline || 'Sekolah Menengah Pertama Islam Terpadu Terakreditasi A dengan target tahfidz 3-5+ Juz mutqin, penguasaan Bahasa Arab aktif, SCD, Mutaba\'ah Digital, serta Futsal Development Program.',
    heroImage: heroData.heroImage || '/images/smp-spmb-poster.png',
    heroSlides: heroData.slides,
    stats: sectionsMap.stats || heroData.stats,
    values: sectionsMap.values,
    programs: sectionsMap.programs || defaultPrograms,
    facilities: sectionsMap.facilities || defaultFacilities,
    testimonials: sectionsMap.testimonials,
    teachers: dbSchool?.teachers || [],
    newsPosts: dbSchool?.newsPosts || [],
    bankName: dbSchool?.bankName || 'Bank Muamalat',
    bankAccountNumber: dbSchool?.bankAccountNumber || '1360012405',
    bankAccountHolder: dbSchool?.bankAccountHolder || 'SMP IT Al Afiyah',
    waveName: dbSchool?.waveName || 'Gelombang 1 (1 Okt 2026 - 28 Feb 2027)',
    spmbData: sectionsMap.tuition || sectionsMap.spmb,
  };

  return <SchoolLandingTemplate school={schoolData} />;
}
