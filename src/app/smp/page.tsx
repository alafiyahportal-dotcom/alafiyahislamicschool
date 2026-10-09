import React from 'react';
import SchoolLandingTemplate, { SchoolData, FacilityItem } from '@/components/landing/SchoolLandingTemplate';
import { prisma } from '@/lib/prisma';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'SMP IT Al-Afiyah Majalengka | Sekolah Menengah Pertama Islam Terpadu Unggulan',
  description: 'PPDB SMP IT Al-Afiyah Majalengka. Sekolah Menengah Pertama Islam Terpadu dengan target hafalan 3-5 Juz Al-Qur\'an tartil, sains modern, bilingual, dan kepemimpinan islami.',
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
      desc: 'Bimbingan hafalan mutqin & tartil dengan target capaian 3 Juz dasar dan kelas tahfidz unggulan 5 Juz / lebih.',
      badge: 'Tahfidz',
    },
    {
      title: 'Fasih Bahasa Arab Active',
      desc: 'Pembiasaan dan bimbingan aktif komunikasi Bahasa Arab fasih baik lisan maupun tulisan.',
      badge: 'Bilingual',
    },
    {
      title: 'SCD & Mutaba\'ah Digital',
      desc: 'Student Character Development & sistem monitoring pembiasaan ibadah digital kolaborasi siswa, orang tua & sekolah.',
      badge: 'Karakter',
    },
    {
      title: 'Futsal Development Program & Ekskul',
      desc: 'Pengembangan potensi olahraga futsal terarah dan berkelanjutan, pramuka, tata boga, serta pengembangan bakat minat.',
      badge: 'Olahraga & Ekskul',
    },
  ];

  const defaultFacilities: FacilityItem[] = [
    {
      name: 'Ruang Kelas Ber-AC & Nyaman',
      image: '/images/smp-hero-fullday.jpg',
      desc: 'Ruang kelas kondusif yang dilengkapi dengan pendingin udara AC, proyektor multimedia, dan sarana belajar modern.',
      category: 'Fasilitas Belajar',
    },
    {
      name: 'Laboratorium Komputer & Digital Learning',
      image: '/images/smp-hero-bilingual.jpg',
      desc: 'Laboratorium komputer lengkap dengan akses internet high-speed WiFi untuk menunjang literasi digital murid.',
      category: 'Teknologi',
    },
    {
      name: 'Masjid Utama & Lapangan Olahraga',
      image: '/images/smp-hero-pesantren.jpg',
      desc: 'Fasilitas masjid representatif untuk pembiasaan ibadah shalat berjamaah serta lapangan olahraga futsal terpadu.',
      category: 'Ibadah & Olahraga',
    },
  ];

  const schoolData: SchoolData = {
    slug: 'smp',
    name: identityData.name || dbSchool?.name || 'SMP IT Al-Afiyah',
    badgeText: identityData.badgeText || dbSchool?.badgeText || 'SEKOLAH MENENGAH PERTAMA ISLAM TERPADU (SMP IT)',
    tagline: identityData.tagline || dbSchool?.tagline || 'Membentuk Generasi Pemimpin Qur\'ani Berakhlak Mulia & Berwawasan Global',
    primaryColor: dbSchool?.primaryColor || '#064E3B',
    accentColor: dbSchool?.accentColor || '#B45309',
    registrationFee: dbSchool?.registrationFee || 200000,
    waCenterPhone: identityData.whatsappNumber || dbSchool?.waCenterPhone || '6282249357893',
    address: identityData.schoolAddress || identityData.address || dbSchool?.address || 'Jl. Gerakan Koperasi No. 110, Majalengka Wetan, Kab. Majalengka 45411',
    heroHeadline: heroData.headline || 'Mencetak Murid Intelektual, Berwawasan Global & Hafidz Qur\'an',
    heroSubheadline: heroData.subheadline || 'Sekolah Menengah Pertama Islam Terpadu dengan target hafalan Qur\'an mutqin, penguasaan Bahasa Arab aktif, SCD & Mutaba\'ah Digital, serta Futsal Development Program.',
    heroImage: heroData.heroImage || '/images/smp-tubing-1.jpg',
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
    waveName: dbSchool?.waveName || 'Gelombang 1 (Okt 2026 - Feb 2027)',
    spmbData: sectionsMap.spmb,
  };

  return <SchoolLandingTemplate school={schoolData} />;
}
