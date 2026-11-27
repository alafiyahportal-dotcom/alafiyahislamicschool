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
  title: 'Profil Sekolah | SMP IT Al-Afiyah Majalengka (Terakreditasi A)',
  description:
    'Profil resmi SMP IT Al-Afiyah Majalengka (Terakreditasi A - SK No. 012/BAN-PDM/SK/2025). Visi, misi, identitas satuan pendidikan, dan susunan pimpinan.',
  icons: {
    icon: [
      { url: '/images/smp-icon-192.png', type: 'image/png' },
      { url: '/smp-favicon.ico', sizes: 'any' },
    ],
    shortcut: '/images/smp-icon-192.png',
    apple: '/images/smp-icon-192.png',
  },
};

export const revalidate = 60;

export default async function SmpProfilPage() {
  const defaultIdentitasList = [
    { label: 'Nama Sekolah Resmi', value: 'SMP IT Al-Afiyah Majalengka' },
    { label: 'Status Akreditasi', value: 'Terakreditasi A (SK No. 012/BAN-PDM/SK/2025)' },
    { label: 'Tagline & Semboyan', value: 'Be Smart and Be Religious' },
    { label: 'Yayasan Penyelenggara', value: 'Yayasan Pendidikan Imam Bonjol (YPIB) Majalengka' },
    { label: 'Ketua Yayasan', value: 'Jejen Nurbayan, S.Sos.' },
    { label: 'Kepala Sekolah', value: 'Jaja Madhuri, S.Pd., M.Pd.' },
    { label: 'Jenjang Pendidikan', value: 'Sekolah Menengah Pertama Islam Terpadu (Kelas VII – IX)' },
    { label: 'Kurikulum Utama', value: 'Integrasi Kurikulum Nasional & Kurikulum Pesantren Terpadu Al-Afiyah' },
    { label: 'Target Tahfidz', value: "Minimal 3 – 5+ Juz Al-Qur'an Mutqin & Bersyahadah" },
    { label: 'Alamat Sekolah', value: 'Lingkungan Giri Asih - Jl. Gerakan Koperasi No. 110, Majalengka Wetan, Kec. Majalengka, Kab. Majalengka, Jawa Barat 45411' },
    { label: 'WhatsApp Resmi', value: '0822-4935-7893 (Layanan Tata Usaha & SPMB)' },
    { label: 'Rekening Resmi', value: 'Bank Muamalat 1360012405 a.n. SMP IT Al Afiyah' },
  ];

  const defaultMisiList = [
    'Menetapkan motto sekolah yaitu Be Smart and Be Religious.',
    'Membiasakan murid menggunakan Bahasa Arab dan Inggris di lingkungan sekolah, sehingga fasih baik lisan maupun tulisan.',
    'Membiasakan murid menghafalkan Al-Qur’an minimal 3 juz mutqin.',
    'Menanamkan nilai-nilai tauhid, mengajarkan akidah ahlussunnah dan ibadah yang shahihah mengikuti Al-Qur’an dan As-Sunnah sesuai dengan pemahaman salafus shalih.',
    'Membiasakan anak dengan akhlak Islami, mendidik anak agar kreatif dan inovatif, serta menanamkan rasa cinta kepada Allah ﷻ dan Rasul-Nya ﷺ.',
    'Mendidik murid agar mampu menguasai semua pelajaran baik umum maupun agama termasuk teknologi informatika, sehingga dapat menciptakan SDM yang handal.',
    'Mengembangkan literasi digital, kecakapan hidup (life skills), dan penguatan pendidikan karakter (Student Character Development).',
  ];

  const leadershipList = [
    { role: 'Ketua Yayasan Pendidikan Imam Bonjol', name: 'Jejen Nurbayan, S.Sos.' },
    { role: 'Kepala Sekolah SMP IT Al-Afiyah', name: 'Jaja Madhuri, S.Pd., M.Pd.' },
    { role: 'PKS Kurikulum (Pembantu Kepala Sekolah)', name: 'M. Akbar Pratama, S.Pd.' },
    { role: 'PKS Kesiswaan (Pembantu Kepala Sekolah)', name: 'Rio Satrio, S.Pd.' },
    { role: 'Sarpras (Sarana & Prasarana)', name: 'Muhamad Eechram Riady, S.Pd.' },
    { role: 'Tata Usaha & Administrasi', name: 'Iip Zaenal Arifin, S.Pd.' },
    { role: 'Humas (Hubungan Masyarakat)', name: 'Amelia Kartika, S.Sos.' },
    { role: 'Lead Developer & IT Systems', name: 'Mulia Rizki' },
  ];

  let identitasList = defaultIdentitasList;
  let misiList = defaultMisiList;
  let visiText =
    'Unggul dalam Bahasa Internasional (Inggris dan Arab), Hafal Al-Qur’an dan Menguasai Teknologi Informatika.';

  try {
    const school = await prisma.school.findUnique({
      where: { slug: 'smp' },
      include: { cmsSections: true },
    });
    const cmsSec = school?.cmsSections.find((s) => s.sectionKey === 'smp_profil');
    if (cmsSec?.payload) {
      const parsed = JSON.parse(cmsSec.payload);
      if (Array.isArray(parsed.legalitas) && parsed.legalitas.length > 0) {
        identitasList = parsed.legalitas;
      }
      if (Array.isArray(parsed.misi) && parsed.misi.length > 0) {
        misiList = parsed.misi;
      }
      if (parsed.visi) {
        visiText = parsed.visi;
      }
    }
  } catch (err) {
    console.error('Error fetching SMP profil data from CMS:', err);
  }

  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-800 font-sans">
      <Navbar schoolSlug="smp" transparentAtTop={false} />
      <main className="flex-1 pt-16 sm:pt-20">
        {/* Header Minimalis Al-Hidayah Style */}
        <section className="bg-[#030164] text-white py-8 sm:py-10 border-b-4 border-[#ffd51e]">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-1.5 text-xs text-blue-200/80 mb-1.5">
              <Link href="/smp" className="hover:text-[#ffd51e] transition-colors">
                Beranda SMP IT
              </Link>
              <ChevronRight className="w-3.5 h-3.5 text-[#ffd51e]" />
              <span className="text-[#ffd51e] font-semibold">Profil</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Profil SMP IT Al-Afiyah Majalengka
            </h1>
          </div>
        </section>

        {/* Konten Utama: Tentang, Identitas, Visi Misi & Pimpinan */}
        <section className="py-10 sm:py-14">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
            {/* 1. Tentang & Foto Sekolah */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              <div className="lg:col-span-7 space-y-4">
                <h2 className="text-xl sm:text-2xl font-extrabold text-[#030164]">
                  Tentang Sekolah
                </h2>
                <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                  <strong>SMP IT Al-Afiyah Majalengka</strong> adalah Sekolah Menengah Pertama Islam Terpadu formal di bawah naungan <strong>Yayasan Pendidikan Imam Bonjol (YPIB)</strong> yang telah meraih predikat <strong>Terakreditasi A (Unggul)</strong> berdasarkan SK BAN-PDM No. 012/BAN-PDM/SK/2025. Dengan semboyan <em>&ldquo;Be Smart &amp; Religious&rdquo;</em>, kami memadukan Kurikulum Nasional dengan Kurikulum Khas Pesantren Terpadu (Tahfidz 3–5+ Juz Mutqin, Bahasa Arab Aktif, Student Character Development, serta Mutaba&apos;ah Digital).
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
                    src="/images/smp-kelulusan-angkatan-3.jpg"
                    alt="SMP IT Al-Afiyah Majalengka"
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 420px"
                  />
                </div>
                <div className="p-4 bg-[#FAF6EC] border border-[#E5D5B2] rounded-sm space-y-2">
                  <p className="text-xs font-extrabold uppercase tracking-wider text-[#030164]">
                    Prakata Kepala Sekolah
                  </p>
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                    &ldquo;Kami berkomitmen membimbing santri di usia remaja agar memiliki akidah yang lurus, adab mulia, hafalan Al-Qur&apos;an yang terjaga, kemahiran bahasa Arab, serta kesiapan akademik dan teknologi untuk berkompetisi di masa depan.&rdquo;
                  </p>
                  <p className="text-xs font-bold text-[#030164] pt-1">
                    — Ust. Jaja Madhuri, S.Pd., M.Pd.
                  </p>
                </div>
              </div>
            </div>

            {/* 2. Visi & Misi (Teks Bersih Minimalis) */}
            <div className="pt-8 border-t border-slate-200 grid grid-cols-1 md:grid-cols-12 gap-8">
              <div className="md:col-span-5 space-y-2">
                <h2 className="text-lg sm:text-xl font-extrabold text-[#030164]">
                  Visi
                </h2>
                <p className="text-sm sm:text-base font-semibold text-slate-800 leading-relaxed">
                  &ldquo;{visiText}&rdquo;
                </p>
              </div>

              <div className="md:col-span-7 space-y-2">
                <h2 className="text-lg sm:text-xl font-extrabold text-[#030164]">
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
                <h2 className="text-lg sm:text-xl font-extrabold text-[#030164]">
                  Pimpinan &amp; Pengelola Sekolah
                </h2>
                <Link
                  href="/smp/guru"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#030164] hover:text-blue-900"
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
      <Footer schoolSlug="smp" />
      <StickyMobileBar schoolSlug="smp" />
    </div>
  );
}
