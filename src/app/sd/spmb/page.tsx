import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import StickyMobileBar from '@/components/layout/StickyMobileBar';
import { ChevronRight, ArrowRight, ExternalLink } from 'lucide-react';
import { prisma } from '@/lib/prisma';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Informasi SPMB | SDIT Al-Afiyah Majalengka',
  description:
    'Alur dan syarat pendaftaran peserta didik baru (SPMB) SDIT Al-Afiyah Majalengka Tahun Ajaran 2027/2028.',
};

export default async function SdSpmbInfoPage() {
  let quotaText = '56 Murid (2 Rombel)';
  let regFeeText = 'Rp 250.000';
  let waveName = 'Gelombang 1';
  let waNumber = '0813-1013-9001';

  try {
    const school = await prisma.school.findUnique({
      where: { slug: 'sd' },
      include: {
        cmsSections: {
          where: { sectionKey: { in: ['tuition', 'identity'] } },
        },
      },
    });
    if (school) {
      const tuitionSection = school.cmsSections.find((s) => s.sectionKey === 'tuition');
      const identitySection = school.cmsSections.find((s) => s.sectionKey === 'identity');

      if (tuitionSection?.payload) {
        try {
          const t = JSON.parse(tuitionSection.payload);
          if (t && typeof t === 'object') {
            if (t.quota) quotaText = `${t.quota} Murid (${Math.ceil(t.quota / 30)} Rombel)`;
            if (t.registrationFee) {
              regFeeText = `Rp ${Number(t.registrationFee).toLocaleString('id-ID')}`;
            }
            if (t.waveName) waveName = t.waveName;
          }
        } catch {}
      }

      if (identitySection?.payload) {
        try {
          const id = JSON.parse(identitySection.payload);
          if (id && typeof id === 'object') {
            if (id.whatsappNumber) {
              waNumber = id.whatsappNumber.startsWith('62')
                ? '0' + id.whatsappNumber.slice(2)
                : id.whatsappNumber;
            }
          }
        } catch {}
      }
    }
  } catch (err) {
    console.error('Failed to load dynamic SPMB info:', err);
  }

  const cleanWa = waNumber.replace(/[^0-9]/g, '');
  const waForLink = cleanWa.startsWith('0') ? '62' + cleanWa.slice(1) : cleanWa || '6281310139001';

  const steps = [
    {
      title: 'Pengisian Formulir Online',
      desc: 'Mengisi data calon murid dan orang tua/wali melalui halaman pendaftaran online SDIT Al-Afiyah.',
    },
    {
      title: 'Infaq Pendaftaran & Verifikasi Berkas',
      desc: `Menyelesaikan infaq formulir (${regFeeText}) dan mengunggah dokumen Kartu Keluarga serta Akta Kelahiran.`,
    },
    {
      title: 'Observasi Fitrah Anak & Ta’aruf Orang Tua',
      desc: 'Observasi kesiapan belajar anak secara ramah (tanpa tes tulis calistung) dan silaturahmi keselarasan visi bersama orang tua.',
    },
    {
      title: 'Pengumuman & Daftar Ulang',
      desc: 'Hasil seleksi dapat dilihat pada halaman Cek Status & Pengumuman, dilanjutkan dengan daftar ulang dan pengukuran seragam.',
    },
  ];

  const requirements = [
    'Usia minimal 6 tahun pada tanggal 1 Juli 2027 (usia 5 tahun 8 bulan dapat dipertimbangkan sesuai kesiapan psikologis).',
    'Scan / Fotokopi Akta Kelahiran.',
    'Scan / Fotokopi Kartu Keluarga (KK) dan KTP kedua Orang Tua.',
    'Pas foto berwarna ukuran 3x4.',
    'Komitmen sinergi orang tua dalam mendampingi pembiasaan ibadah dan muraja’ah di rumah.',
  ];

  return (
    <div className="min-h-screen bg-white text-slate-800 flex flex-col font-sans">
      <Navbar schoolSlug="sd" transparentAtTop={false} />
      <main className="flex-1 pt-16 sm:pt-20">
        {/* Compact Header Al-Hidayah Style */}
        <section className="bg-[#00594f] text-white py-8 sm:py-10 border-b-4 border-[#e5a93b]">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs text-emerald-100/80 mb-1.5">
                <Link href="/sd" className="hover:text-[#e5a93b] transition-colors">
                  Beranda SDIT
                </Link>
                <ChevronRight className="w-3.5 h-3.5 text-[#e5a93b]" />
                <span className="text-[#e5a93b] font-semibold">SPMB</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                Informasi SPMB SDIT Al-Afiyah T.A. 2027/2028
              </h1>
            </div>

            <div className="flex flex-wrap items-center gap-2.5 shrink-0">
              <Link
                href="/sd/spmb/daftar"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xs bg-[#e5a93b] hover:bg-[#d4962a] text-white font-bold text-xs transition-colors"
              >
                <span>Isi Formulir</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <Link
                href="/sd/spmb/cek-status"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xs bg-white/10 hover:bg-white/20 border border-white/30 text-white font-bold text-xs transition-colors"
              >
                <span>Cek Status</span>
              </Link>
              <Link
                href="/sd/spmb/pengumuman"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xs bg-white/10 hover:bg-white/20 border border-white/30 text-white font-bold text-xs transition-colors"
              >
                <span>Pengumuman</span>
              </Link>
            </div>
          </div>
        </section>

        {/* Info Ringkas Kuota & Gelombang */}
        <section className="py-6 bg-[#FAF6EC] border-b border-[#E5D5B2]">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs sm:text-sm">
            <div>
              <span className="text-slate-500 block text-xs">Gelombang Aktif</span>
              <strong className="text-[#003831] font-extrabold">{waveName}</strong>
            </div>
            <div>
              <span className="text-slate-500 block text-xs">Kuota Penerimaan</span>
              <strong className="text-[#003831] font-extrabold">{quotaText}</strong>
            </div>
            <div>
              <span className="text-slate-500 block text-xs">Infaq Formulir Pendaftaran</span>
              <strong className="text-[#00594f] font-extrabold">{regFeeText}</strong>
            </div>
          </div>
        </section>

        {/* Clean 2-Column Info: Alur & Syarat */}
        <section className="py-10 sm:py-12">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* Left: Alur Pendaftaran */}
            <div className="space-y-4">
              <h2 className="text-lg font-extrabold text-[#003831]">
                Alur Pendaftaran
              </h2>
              <ol className="divide-y divide-slate-200 border-t border-b border-slate-200">
                {steps.map((s, idx) => (
                  <li key={idx} className="py-3.5 flex items-start gap-3.5">
                    <span className="text-xs font-extrabold text-[#00594f] mt-0.5 tabular-nums">
                      {idx + 1}.
                    </span>
                    <div className="space-y-0.5">
                      <h3 className="text-sm font-bold text-[#003831]">
                        {s.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                        {s.desc}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>

            {/* Right: Persyaratan Berkas */}
            <div className="space-y-5">
              <h2 className="text-lg font-extrabold text-[#003831]">
                Persyaratan Dokumen
              </h2>
              <ul className="divide-y divide-slate-200 border-t border-b border-slate-200 text-xs sm:text-sm text-slate-700">
                {requirements.map((req, idx) => (
                  <li key={idx} className="py-3 flex items-start gap-2.5">
                    <span className="text-[#00594f] font-bold">•</span>
                    <span>{req}</span>
                  </li>
                ))}
              </ul>

              <div className="pt-2 flex flex-wrap gap-3">
                <Link
                  href="/sd/spmb/daftar"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xs bg-[#00594f] hover:bg-[#003831] text-white font-bold text-xs transition-colors"
                >
                  <span>Lanjut ke Formulir Pendaftaran</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
                <a
                  href={`https://wa.me/${waForLink}?text=Assalamu%27alaikum%20Panitia%20SPMB%20SDIT%20Al-Afiyah,%20saya%20ingin%20berkonsultasi%20pendaftaran`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xs border border-slate-300 hover:border-[#00594f] text-[#003831] font-bold text-xs transition-colors"
                >
                  <span>Hubungi Panitia ({waNumber})</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
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
