import React from 'react';
import type { Metadata } from 'next';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import StickyMobileBar from '@/components/layout/StickyMobileBar';
import Link from 'next/link';
import Image from 'next/image';
import { prisma } from '@/lib/prisma';
import { ChevronRight, ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Profil Sekolah | SDIT Al-Afiyah Majalengka',
  description:
    'Profil resmi Sekolah Dasar Islam Terpadu (SDIT) Al-Afiyah Majalengka. Visi, misi, identitas satuan pendidikan, dan susunan pimpinan.',
  icons: {
    icon: [
      { url: '/images/sd-logo.png', type: 'image/png' },
      { url: '/favicon.ico' },
    ],
    shortcut: '/images/sd-logo.png',
    apple: '/images/sd-logo.png',
  },
};

export const revalidate = 60;

export default async function SdProfilPage() {
  const defaultIdentitasList = [
    { label: 'Nama Sekolah', value: 'SDIT Al-Afiyah Majalengka' },
    { label: 'Status Akreditasi', value: 'Terakreditasi B (BAN-SM)' },
    { label: 'Yayasan Penyelenggara', value: 'Yayasan Pendidikan Imam Bonjol (YPIB) Majalengka' },
    { label: 'Gugus Sekolah', value: 'Sekolah Imbas dari 7 Sekolah di Gugus 3 Nusa Indah, Kec. Majalengka' },
    { label: 'Kurikulum Pembelajaran', value: 'Perpaduan Kurikulum Diknas & Kurikulum Yayasan berpijak pada Iman dan Taqwa' },
    { label: 'Program Unggulan', value: "Tahsin dan Tahfidz Al-Qur'an & Karakter Nabawiyah" },
    { label: 'Jenjang Pendidikan', value: 'Sekolah Dasar Islam Terpadu (Kelas 1 - 6)' },
    { label: 'Alamat Sekolah', value: 'Lingkungan Giri Asih - Jl. Gerakan Koperasi, Kel. Majalengka Kulon, Kec. Majalengka, Kab. Majalengka, Jawa Barat 45411' },
    { label: 'Telepon / WhatsApp', value: '0813-1013-9001 (Layanan Terpadu Tata Usaha & SPMB)' },
    { label: 'Email Resmi', value: 'sditalafiyahmjl@gmail.com' },
  ];

  const defaultMisiList = [
    'Menumbuhkan nilai-nilai tauhid dalam seluruh aspek pembelajaran dan pembiasaan.',
    'Mengajarkan aqidah dan ibadah yang sohihah sesuai dengan Al-Qur’an dan As-Sunnah sesuai dengan pemahaman salafus sholih.',
    'Membiasakan anak dengan akhlak Islami dalam keseharian.',
    'Mendidik anak agar kreatif dan inovatif.',
    'Menanamkan rasa cinta yang mendalam kepada Allah ﷻ dan Rasul-Nya ﷺ.',
    'Berusaha mendidik murid-murid agar menguasai semua mata pelajaran baik umum maupun agama secara komprehensif.',
  ];

  const leadershipList = [
    { role: 'Ketua Yayasan Pendidikan Imam Bonjol', name: 'Jejen Nurbayan, S.Sos' },
    { role: 'Kepala Sekolah SDIT Al-Afiyah Majalengka', name: 'Febrian Fauzi, S.Pd., M.Pd.' },
    { role: 'Komite Sekolah SDIT Al-Afiyah', name: 'Yayan Herdianto, S.Pd' },
    { role: 'Kasie Kurikulum SDIT Al-Afiyah', name: 'Windi Widayanti, S.Pd' },
    { role: 'Koordinator Tahfidz SDIT Al-Afiyah', name: 'Muhammad Rizki, S.Pd' },
    { role: 'Wakasek Kesiswaan SDIT Al-Afiyah', name: 'Iyan Kusdiana, S.Pd' },
    { role: 'Tata Usaha SDIT Al-Afiyah', name: 'Moch. Ajat Nurhidayat, S.T' },
    { role: 'Bendahara SDIT Al-Afiyah', name: 'Aditya Rahadian, S.TP' },
    { role: 'Lead Developer & IT Systems', name: 'Mulia Rizki' },
  ];

  let identitasList = defaultIdentitasList;
  let misiList = defaultMisiList;
  let visiText =
    'Menjadi Sekolah Dasar Islam Terpadu yang unggul dalam melahirkan generasi bertaqwa, berakhlak mulia, cerdas, terampil, mandiri, dan berwawasan luas berdasarkan Al-Qur\'an dan As-Sunnah.';

  try {
    const school = await prisma.school.findUnique({
      where: { slug: 'sd' },
      include: { cmsSections: true },
    });
    const cmsSec = school?.cmsSections.find((s) => s.sectionKey === 'sd_profil');
    if (cmsSec?.payload) {
      const parsed = JSON.parse(cmsSec.payload);
      if (Array.isArray(parsed.identitasList) && parsed.identitasList.length > 0) {
        identitasList = parsed.identitasList;
      }
      if (Array.isArray(parsed.misiList) && parsed.misiList.length > 0) {
        misiList = parsed.misiList;
      }
      if (parsed.visiText) {
        visiText = parsed.visiText;
      }
    }
  } catch (err) {
    console.error('Error fetching SD profil data from CMS:', err);
  }

  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-800 font-sans">
      <Navbar schoolSlug="sd" transparentAtTop={false} />
      <main className="flex-1 pt-16 sm:pt-20">
        {/* Header Minimalis Al-Hidayah Style */}
        <section className="bg-[#00594f] text-white py-8 sm:py-10 border-b-4 border-[#e5a93b]">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-1.5 text-xs text-emerald-100/80 mb-1.5">
              <Link href="/sd" className="hover:text-[#e5a93b] transition-colors">
                Beranda SDIT
              </Link>
              <ChevronRight className="w-3.5 h-3.5 text-[#e5a93b]" />
              <span className="text-[#e5a93b] font-semibold">Profil</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Profil SDIT Al-Afiyah Majalengka
            </h1>
          </div>
        </section>

        {/* Konten Utama: Tentang, Identitas, Visi Misi & Pimpinan */}
        <section className="py-10 sm:py-14">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
            {/* 1. Tentang & Foto Sekolah */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              <div className="lg:col-span-7 space-y-4">
                <h2 className="text-xl sm:text-2xl font-extrabold text-[#003831]">
                  Tentang Sekolah
                </h2>
                <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                  <strong>SDIT Al-Afiyah Majalengka</strong> adalah Sekolah Dasar Islam Terpadu formal di bawah naungan <strong>Yayasan Pendidikan Imam Bonjol (YPIB)</strong> dan sekolah imbas di Gugus 3 Nusa Indah Kecamatan Majalengka. Kami memadukan Kurikulum Nasional dengan Metode Pendidikan Karakter Nabawiyah (Smart Akhlak Fitrah) serta program unggulan Tahsin dan Tahfidz Al-Qur&apos;an Juz 30 Mutqin.
                </p>

                {/* Tabel Identitas Singkat */}
                <div className="border-t border-b border-slate-200 divide-y divide-slate-200 text-xs sm:text-sm mt-4">
                  {identitasList.map((item, idx) => (
                    <div key={idx} className="py-2.5 grid grid-cols-3 gap-2">
                      <span className="text-slate-500 font-medium">{item.label}</span>
                      <span className="col-span-2 font-bold text-slate-900">
                        {item.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="lg:col-span-5 space-y-4">
                <div className="relative aspect-[4/3] w-full overflow-hidden rounded-sm bg-slate-100 border border-slate-200">
                  <Image
                    src="/images/sd-field-study-banner.jpg"
                    alt="SDIT Al-Afiyah Majalengka"
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 420px"
                  />
                </div>
                <div className="p-4 bg-[#FAF6EC] border border-[#E5D5B2] rounded-sm space-y-2">
                  <p className="text-xs font-extrabold uppercase tracking-wider text-[#003831]">
                    Prakata Kepala Sekolah
                  </p>
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                    &ldquo;Kami meyakini setiap anak lahir dalam keadaan fitrah. Metode Pendidikan Karakter Nabawiyah membimbing anak didik agar tumbuh cerdas, mandiri, mencintai ibadah, dan berakhlak mulia.&rdquo;
                  </p>
                  <p className="text-xs font-bold text-[#00594f] pt-1">
                    — Ust. Febrian Fauzi, S.Pd., M.Pd.
                  </p>
                </div>
              </div>
            </div>

            {/* 2. Visi & Misi (Teks Bersih Minimalis) */}
            <div className="pt-8 border-t border-slate-200 grid grid-cols-1 md:grid-cols-12 gap-8">
              <div className="md:col-span-5 space-y-2">
                <h2 className="text-lg sm:text-xl font-extrabold text-[#003831]">
                  Visi
                </h2>
                <p className="text-sm sm:text-base font-semibold text-slate-800 leading-relaxed">
                  &ldquo;{visiText}&rdquo;
                </p>
              </div>

              <div className="md:col-span-7 space-y-2">
                <h2 className="text-lg sm:text-xl font-extrabold text-[#003831]">
                  Misi
                </h2>
                <ol className="list-decimal list-inside space-y-2 text-sm text-slate-600 leading-relaxed">
                  {misiList.map((misi, idx) => (
                    <li key={idx}>{misi}</li>
                  ))}
                </ol>
              </div>
            </div>

            {/* 3. Pimpinan & Pengelola (Tabel Bersih) */}
            <div className="pt-8 border-t border-slate-200 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <h2 className="text-lg sm:text-xl font-extrabold text-[#003831]">
                  Pimpinan &amp; Pengelola Sekolah
                </h2>
                <Link
                  href="/sd/guru"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#00594f] hover:text-[#003831]"
                >
                  <span>Lihat Struktur &amp; Deskripsi Lengkap</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="overflow-x-auto border border-slate-200">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-600">
                    <tr>
                      <th className="py-3 px-4 font-bold">Jabatan</th>
                      <th className="py-3 px-4 font-bold">Nama</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {leadershipList.map((item, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/60">
                        <td className="py-3 px-4 text-slate-600">{item.role}</td>
                        <td className="py-3 px-4 font-bold text-slate-900">
                          {item.name}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer schoolSlug="sd" />
      <StickyMobileBar schoolSlug="sd" />
    </div>
  );
}
