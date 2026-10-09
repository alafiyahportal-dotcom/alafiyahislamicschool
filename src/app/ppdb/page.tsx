'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import StickyMobileBar from '@/components/layout/StickyMobileBar';
import { 
  ClipboardCheck, 
  ArrowRight, 
  CheckCircle2, 
  FileSearch, 
  BellRing, 
  Calendar, 
  CreditCard, 
  HelpCircle,
  Phone,
  ShieldCheck,
  Award,
  GraduationCap,
  BookOpen,
  Users,
  ChevronDown,
  ChevronUp,
  School,
  Clock,
  Check,
  Share2,
  Gift,
  Calculator,
  Download,
  Printer,
  X,
  Star,
  Quote,
  FileText,
  BadgeCheck,
  CheckCheck,
  Copy,
  Percent,
  Tag
} from 'lucide-react';

export default function PPDBHubPage() {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  // Tuition Calculator State
  const [calcUnit, setCalcUnit] = useState<'tk' | 'sd' | 'smp'>('sd');
  const [hasSiblingDiscount, setHasSiblingDiscount] = useState(false);
  const [hasTahfidzDiscount, setHasTahfidzDiscount] = useState(false);
  const [smpDiscountChoice, setSmpDiscountChoice] = useState<'sdit_internal' | 'external' | 'wave2'>('sdit_internal');
  const [studentGender, setStudentGender] = useState<'male' | 'female'>('male');
  const [copiedMuamalat, setCopiedMuamalat] = useState(false);

  const handleCopyMuamalat = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText('1360012405');
      setCopiedMuamalat(true);
      setTimeout(() => setCopiedMuamalat(false), 2200);
    }
  };

  // Brochure Modal State
  const [showBrochureModal, setShowBrochureModal] = useState(false);

  const steps = [
    {
      step: '01',
      title: 'Pengisian Formulir Online',
      desc: 'Orang tua / wali murid mengisi biodata calon murid, NIK 16 digit, data orang tua, dan pilihan jenjang sekolah secara online tanpa antre.',
      badge: 'Langkah Awal',
    },
    {
      step: '02',
      title: 'Infaq Formulir & Berkas Stopmap',
      desc: 'Menyelesaikan infaq pendaftaran via Virtual Account / QRIS Midtrans simulator dan menyiapkan 1 stopmap berkas fisik (KK, Akta, Pas Foto).',
      badge: 'Verifikasi',
    },
    {
      step: '03',
      title: 'Observasi & Pemetaan Tahsin',
      desc: 'Pelaksanaan asesmen pemetaan tahsin Al-Qur’an/Iqro, observasi kemandirian & kesiapan belajar, serta silaturahim komitmen wali murid.',
      badge: 'Seleksi Ramah',
    },
    {
      step: '04',
      title: 'Daftar Ulang & Ukuran Seragam',
      desc: 'Pengumuman hasil kelulusan, penandatanganan akad pendidikan murid, pengukuran seragam resmi secara online, dan orientasi sekolah.',
      badge: 'Resmi Diterima',
    },
  ];

  const units = [
    {
      slug: 'tk',
      name: 'TK IT Al-Afiyah',
      level: 'PAUD / TK Islam Terpadu',
      badge: 'Usia 4 - 6 Tahun',
      target: 'Juz 30 & Pembiasaan Adab',
      fee: 'Rp 150.000',
      quotaTotal: 30,
      quotaFilled: 22,
      hours: '07.30 - 11.00 WIB',
      status: 'Gelombang 1 Dibuka',
      accent: '#10B981',
      desc: 'Stimulasi fitrah keimanan anak usia dini dengan sentra eksplorasi bernilai islami, motorik halus-kasar, dan doa harian.',
      highlights: [
        'Sentra Bermain & Belajar Mandiri',
        'Tahfidz Juz 30 & Doa Harian',
        'Pembiasaan Shalat & Adab Makan',
        'Rasio Guru-Murid Ideal',
      ],
    },
    {
      slug: 'sd',
      name: 'SDIT Al-Afiyah',
      level: 'Sekolah Dasar Islam Terpadu',
      badge: 'Smart Akhlak Fitrah • Hanya 2 Rombel',
      target: 'Tahfidz Juz 30 Mutqin & Karakter Nabawiyah',
      fee: 'Rp 250.000',
      quotaTotal: 56,
      quotaFilled: 44,
      hours: '07.00 - 14.30 WIB',
      status: 'SPMB 2027/2028 Dibuka',
      accent: '#00A651',
      desc: 'Bukan sekadar tempat belajar namun juga tempat bertumbuh. Mendidik dengan sunnah, metode karakter nabawiyah, iman sebelum Qur’an, dan outdoor learning.',
      highlights: [
        'Mendidik dengan Sunnah & Karakter Nabawiyah',
        'Iman Sebelum Qur’an, Akhlak dan Ilmu',
        'Lingkungan Asri, Nyaman & Membahagiakan',
        'Outdoor Learning (Greenhouse & Kebun Terbuka)',
        'Pelatihan Aqil-Baligh & Pemetaan Bakat',
      ],
    },
    {
      slug: 'smp',
      name: 'SMP IT Al-Afiyah',
      level: 'Sekolah Menengah Pertama Islam',
      badge: 'Fullday & Bimbingan Intensif',
      target: 'Mutqin Tahfidz & Bahasa Asing',
      fee: 'Rp 250.000',
      quotaTotal: 60,
      quotaFilled: 42,
      hours: '07.00 - 15.30 WIB',
      status: 'Gelombang 1 Dibuka (1 Okt 2026 - 28 Feb 2027)',
      accent: '#064E3B',
      desc: 'Pendidikan Fullday School membina kepemimpinan pemuda Muslim berwawasan global, bilingual (Arab & Inggris), serta adab mulia.',
      highlights: [
        'Diskon 70% Uang Bangunan (Khusus Siswa SDIT)',
        'Diskon 50% Uang Bangunan (Siswa Luar SDIT)',
        'Tahfidz Intensif 3-5 Juz Bimbingan Bersanad',
        'Bilingual Daily Communication & Fullday School',
      ],
    },
  ];

  const tracks = [
    {
      id: 'reguler',
      title: 'Jalur Reguler Umum',
      tag: 'Semua Calon Murid',
      desc: 'Terbuka untuk seluruh putra-putri yang memenuhi kriteria usia per Juli 2027 dan siap mengikuti observasi kesiapan belajar.',
      benefit: 'Uji observasi berkesempatan memilih jadwal lebih awal.',
      color: 'border-slate-200 bg-white',
    },
    {
      id: 'tahfidz',
      title: 'Jalur Beasiswa Tahfidz Prestasi',
      tag: 'Bebas Infaq s.d. 100%',
      desc: 'Khusus bagi calon murid yang telah memiliki hafalan Al-Qur\'an mutqin minimal 1 Juz (SD) atau 3-5 Juz (SMP) dengan syahadah.',
      benefit: 'Beasiswa SPP bulanan dan pembebasan biaya sarana pendidikan.',
      color: 'border-amber-200 bg-amber-50/50',
    },
    {
      id: 'afiliasi',
      title: 'Jalur Rujukan Mitra Afiliasi',
      tag: 'Kode Referral Khusus',
      desc: 'Pendaftaran melalui tautan Mitra Afiliasi Al-Afiyah (alumni, guru, wali murid). Mempercepat proses verifikasi dan pendampingan formulir.',
      benefit: 'Pendampingan langsung oleh mitra afiliasi resmi sekolah.',
      color: 'border-emerald-200 bg-emerald-50/50',
    },
  ];

  // Tuition rows per unit (SD follows the official SPMB 2027/2028 poster)
  type FeeRow = { label: string; hint?: string; amount: number; original?: number };
  const isMale = studentGender === 'male';
  // Sibling / tahfidz relief on facility fee (TK & SD)
  const applyRelief = (amount: number) =>
    hasTahfidzDiscount ? amount * 0.5 : hasSiblingDiscount ? amount * 0.9 : amount;

  let feeRows: FeeRow[];
  if (calcUnit === 'smp') {
    const buildingFee = 2500000;
    const buildingAfterPromo =
      smpDiscountChoice === 'sdit_internal' ? buildingFee * 0.3 // Diskon 70% (Siswa SDIT Al-Afiyah)
      : smpDiscountChoice === 'external' ? buildingFee * 0.5 // Diskon 50% (Luar SDIT)
      : buildingFee; // Gelombang 2: No Diskon
    feeRows = [
      { label: 'Biaya Pendaftaran', amount: 200000 },
      { label: 'Uang Bangunan', hint: 'Sekali selama masa jenjang pendidikan', amount: buildingAfterPromo, original: buildingFee },
      { label: 'Fasilitas Pembelajaran', hint: 'Pengembangan sarana kelas, lab & IT', amount: 500000 },
      { label: `Seragam (${isMale ? 'Ikhwan' : 'Akhwat'})`, hint: 'Paket seragam lengkap siap pakai', amount: isMale ? 1100000 : 1400000 },
      { label: 'Paket Buku', hint: 'Buku teks kurikulum & modul tahfidz', amount: 1000000 },
      { label: 'Kegiatan Siswa', hint: "SCD, mutaba'ah digital, ekskul & futsal program", amount: 1700000 },
      { label: 'SPP Bulanan', hint: 'Iuran rutin bulanan operasional', amount: 300000 },
    ];
  } else if (calcUnit === 'sd') {
    const facilityFee = 1580000;
    feeRows = [
      { label: 'Biaya Pendaftaran (Gelombang 1)', hint: 'Gelombang 2 Rp 275.000 • Gelombang 3 Rp 300.000', amount: 250000 },
      { label: 'Biaya Pengembangan Pendidikan', amount: 2500000 },
      { label: `Perlengkapan Siswa (${isMale ? 'Putra' : 'Putri'})`, amount: isMale ? 2350000 : 2600000 },
      { label: 'Kegiatan Pembelajaran', amount: 1450000 },
      { label: 'SPP Bulan Juli 2027', hint: 'Iuran rutin bulanan operasional', amount: 300000 },
      { label: 'Sarana dan Prasarana', amount: applyRelief(facilityFee), original: facilityFee },
    ];
  } else {
    const facilityFee = 3500000;
    feeRows = [
      { label: 'Biaya Pendaftaran', amount: 150000 },
      { label: 'Uang Bangunan', hint: 'Sekali selama masa jenjang pendidikan', amount: applyRelief(facilityFee), original: facilityFee },
      { label: 'Seragam Sekolah', hint: 'Paket seragam lengkap siap pakai', amount: 850000 },
      { label: 'Paket Buku & Modul', hint: 'Buku teks kurikulum & modul tahfidz', amount: 600000 },
      { label: 'SPP Bulan Pertama', hint: 'Iuran rutin bulanan operasional', amount: 350000 },
    ];
  }

  const calculatedTotal = feeRows.reduce((sum, row) => sum + row.amount, 0);
  const initialDp = Math.round(calculatedTotal * 0.4);
  const remainingInstallment = Math.round((calculatedTotal - initialDp) / 2);

  const testimonials = [
    {
      quote: 'Alhamdulillah perkembangan adab dan hafalan ananda di SD IT Al-Afiyah sangat membanggakan. Guru-gurunya sabar, penuh perhatian, dan komunikasi dengan orang tua sangat intensif lewat aplikasi.',
      parent: 'Bunda Siti Sarah, S.Pd.',
      child: 'Ibunda dari Farhan (Kelas 3 SD IT)',
      badge: 'Wali Murid SD IT',
      rating: 5,
    },
    {
      quote: 'Anak saya sebelumnya sangat pemalu, tapi setelah 6 bulan di TK IT Al-Afiyah menjadi sangat ceria, mandiri memakai sepatu dan makan sendiri, serta hafal surat An-Naba dan doa-doa harian.',
      parent: 'Ayah Hendra Gunawan',
      child: 'Ayahanda dari Aisyah (Kelompok B TK IT)',
      badge: 'Wali Murid TK IT',
      rating: 5,
    },
    {
      quote: 'Lingkungan SMP IT sangat kondusif membentengi remaja dari pengaruh negatif gadget. Asatidz tidak hanya mengajarkan sains modern, tapi juga membimbing tahfidz mutqin dan adab akhlak mulia.',
      parent: 'Ustadz Rahmat Hidayat, M.Ag.',
      child: 'Ayahanda dari Fatih (Kelas 8 SMP IT)',
      badge: 'Wali Murid SMP IT',
      rating: 5,
    },
  ];

  const faqs = [
    {
      q: 'Berapa usia minimal untuk mendaftar di SD IT Al-Afiyah?',
      a: 'Sesuai ketentuan Permendikbud dan pedoman PPDB 2027/2028, calon murid kelas 1 SD IT berusia minimal 6 tahun pada 1 Juli 2027 (kelahiran sebelum 1 Juli 2021). Anak berusia 5 tahun 6 bulan dapat dipertimbangkan jika memiliki rekomendasi kesiapan psikologis dari psikolog profesional atau dewan guru.',
    },
    {
      q: 'Apakah ada tes baca-tulis-hitung (Calistung) yang menggugurkan di SD IT?',
      a: 'Tidak ada. Sesuai kurikulum transisi PAUD ke SD yang menyenangkan, observasi murid difokuskan pada pemetaan pengenalan huruf hijaiyah/Iqro, kemandirian motorik, sosialisasi, dan kesiapan belajar — bukan tes calistung akademis yang kaku.',
    },
    {
      q: 'Bagaimana jika berkas fisik (KK atau Akta Kelahiran) belum lengkap saat mengisi form?',
      a: 'Ayah/Bunda tetap dapat mengisi formulir online dan mengunci nomor registrasi murid dengan memilih opsi "Susulkan Berkas Nanti" di Langkah 5. Berkas fisik dapat diserahkan paling lambat saat hari wawancara observasi di sekolah.',
    },
    {
      q: 'Bagaimana alur pembayaran infaq formulir pendaftaran?',
      a: 'Pembayaran formulir dilakukan secara transparan melalui sistem Midtrans (Virtual Account BSI, BRI, Mandiri, BCA, atau QRIS instan). Setelah pembayaran berhasil, kuitansi digital dan notifikasi WhatsApp otomatis dikirimkan ke nomor Ayah/Bunda.',
    },
    {
      q: 'Apakah biaya pendidikan dapat diangsur (dicicil)?',
      a: 'Ya, Yayasan menyediakan skema angsuran syariah bebas riba. Uang muka daftar ulang sebesar 40%, dan sisa 60% dapat diangsur dalam 2 termin selama semester pertama.',
    },
    {
      q: 'Apakah wali murid atau alumni bisa menjadi Mitra Afiliasi untuk merekomendasikan murid baru?',
      a: 'Sangat bisa! Yayasan membuka program Mitra Afiliasi Resmi Al-Afiyah di mana setiap rujukan calon murid yang diterima dan lunas akan mendapatkan bagi hasil komisi berkah hingga Rp 500.000/murid yang cair langsung ke rekening bank Anda.',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] text-slate-800 font-sans selection:bg-amber-100 selection:text-amber-900">
      <Navbar />

      {/* Hero Header - Deep Forest Emerald with Gold Accents */}
      <section className="relative bg-[#064E3B] text-white pt-28 sm:pt-36 lg:pt-40 pb-24 px-4 sm:px-6 lg:px-8 overflow-hidden border-b border-emerald-900/60 shadow-lg">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-400/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-96 h-96 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10 text-center">
          <p className="font-arabic text-xl sm:text-2xl text-amber-300 mb-3 tracking-wide drop-shadow-xs">
            بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ • مَرْحَبًا بِكُمْ
          </p>

          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-emerald-100 text-xs font-bold uppercase tracking-wider mb-5">
            <GraduationCap className="w-3.5 h-3.5 text-amber-300" />
            <span>Penerimaan Peserta Didik Baru (PPDB) TP 2026 / 2027</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight max-w-4xl mx-auto">
            Membentuk Generasi Berkarakter Qur&apos;ani, Mandiri, &amp; Berprestasi
          </h1>

          <p className="mt-4 text-xs sm:text-base text-emerald-100/90 max-w-2xl mx-auto leading-relaxed">
            Selamat datang di portal pendaftaran online terpadu Yayasan Pendidikan Imam Bonjol Al-Afiyah Majalengka. Bimbing putra-putri Anda bersama asatidzah berdedikasi dan kurikulum Islam terpadu unggulan.
          </p>

          {/* Quick Action Navigation Buttons */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/ppdb/daftar"
              className="px-6 py-3.5 rounded-2xl bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold text-xs sm:text-sm shadow-md transition-all inline-flex items-center space-x-2 tactile-press cursor-pointer"
            >
              <ClipboardCheck className="w-4 h-4" />
              <span>Daftar Sekarang (Formulir Online)</span>
            </Link>

            <button
              onClick={() => setShowBrochureModal(true)}
              className="px-5 py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold text-xs sm:text-sm transition-colors inline-flex items-center space-x-2 cursor-pointer"
            >
              <Download className="w-4 h-4 text-amber-300" />
              <span>Unduh Rincian &amp; Brosur</span>
            </button>

            <Link
              href="/ppdb/cek-status"
              className="px-5 py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold text-xs sm:text-sm transition-colors inline-flex items-center space-x-2"
            >
              <FileSearch className="w-4 h-4 text-emerald-300" />
              <span>Cek Status Pendaftaran</span>
            </Link>

            <Link
              href="/affiliate"
              className="px-5 py-3.5 rounded-2xl bg-emerald-800/80 hover:bg-emerald-800 border border-emerald-700 text-amber-200 font-semibold text-xs sm:text-sm transition-colors inline-flex items-center space-x-2"
            >
              <Share2 className="w-4 h-4 text-amber-300" />
              <span>Program Mitra Afiliasi</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Main Content Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16 -mt-8 relative z-20">

        {/* 3 School Unit Cards (Solid, Clean, High Contrast with Quota Progress) */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {units.map((u) => {
            const remaining = u.quotaTotal - u.quotaFilled;
            const percentFilled = Math.round((u.quotaFilled / u.quotaTotal) * 100);

            return (
              <div
                key={u.slug}
                className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200/90 flex flex-col justify-between hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group relative overflow-hidden"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-[#E8F3F1] text-[#064E3B]">
                      {u.badge}
                    </span>
                    <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                      {u.status}
                    </span>
                  </div>

                  <h3 className="text-2xl font-black text-slate-900 mb-1 group-hover:text-[#064E3B] transition-colors">
                    {u.name}
                  </h3>
                  <p className="text-xs text-slate-500 font-medium mb-3">
                    {u.level}
                  </p>
                  <p className="text-xs text-slate-600 mb-4 leading-relaxed">
                    {u.desc}
                  </p>

                  {/* Quota Progress Bar */}
                  <div className="mb-4 bg-slate-50 p-3 rounded-2xl border border-slate-200/70">
                    <div className="flex items-center justify-between text-[11px] mb-1.5">
                      <span className="font-semibold text-slate-600">Sisa Kuota Kursi:</span>
                      <span className="font-black text-[#064E3B]">
                        Tersisa <strong className="text-amber-600">{remaining}</strong> dari {u.quotaTotal}
                      </span>
                    </div>
                    <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                      <div 
                        className="bg-[#064E3B] h-full rounded-full transition-all duration-500" 
                        style={{ width: `${percentFilled}%` }} 
                      />
                    </div>
                    <div className="text-[10px] text-right text-slate-400 mt-1">
                      {percentFilled}% Kuota Terisi
                    </div>
                  </div>

                  {/* Key Spec Metrics */}
                  <div className="space-y-2 bg-[#F8FAFC] p-4 rounded-2xl border border-slate-200/70 mb-5 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 font-medium">Target Hafalan:</span>
                      <strong className="text-slate-900 font-bold">{u.target}</strong>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 font-medium">Jam Belajar:</span>
                      <strong className="text-slate-700 font-semibold">{u.hours}</strong>
                    </div>
                    <div className="flex items-center justify-between pt-1 border-t border-slate-200/60">
                      <span className="text-slate-500 font-medium">Infaq Formulir:</span>
                      <strong className="text-amber-700 font-black font-mono text-sm">{u.fee}</strong>
                    </div>
                  </div>

                  {/* Highlights Checklist */}
                  <div className="space-y-2 mb-6">
                    {u.highlights.map((h, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs text-slate-700">
                        <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 font-bold" />
                        <span>{h}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Direct Registration CTA with Unit Lock */}
                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <Link
                    href={`/ppdb/daftar?school=${u.slug}`}
                    className="w-full text-center py-3.5 px-4 rounded-2xl bg-[#064E3B] hover:bg-emerald-900 text-white text-xs sm:text-sm font-bold transition-all shadow-xs flex items-center justify-center space-x-2 cursor-pointer tactile-press"
                  >
                    <span>Daftar {u.name}</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  <Link
                    href={`/${u.slug}`}
                    className="w-full text-center py-2 px-3 text-[11px] font-semibold text-slate-500 hover:text-slate-800 transition-colors block"
                  >
                    Lihat Profil Lengkap {u.name} &rarr;
                  </Link>
                </div>
              </div>
            );
          })}
        </section>

        {/* =========================================================================
            INTERACTIVE TUITION ESTIMATOR / FINANCIAL TRANSPARENCY CALCULATOR
           ========================================================================= */}
        <section className="bg-white rounded-3xl p-6 sm:p-10 shadow-sm border border-slate-200/90 space-y-8">
          <div className="text-center max-w-2xl mx-auto">
            <div className="inline-flex items-center space-x-2 text-xs font-bold text-[#064E3B] uppercase tracking-wider mb-2">
              <Calculator className="w-4 h-4 text-emerald-600" />
              <span>Transparansi Biaya Pendidikan</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Kalkulator Estimasi Biaya Pendidikan TP 2027/2028
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-slate-600">
              Pilih jenjang sekolah dan sesuaikan opsi keringanan (diskon saudara kandung atau beasiswa tahfidz) untuk melihat rincian biaya resmi dan opsi cicilan syariah.
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            {/* Unit Selector Pills */}
            <div className="flex items-center justify-center gap-2 p-1.5 bg-slate-100 rounded-2xl max-w-md mx-auto mb-8">
              {[
                { id: 'tk', label: 'TK IT Al-Afiyah' },
                { id: 'sd', label: 'SD IT Al-Afiyah' },
                { id: 'smp', label: 'SMP IT Al-Afiyah' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setCalcUnit(tab.id as 'tk' | 'sd' | 'smp')}
                  className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    calcUnit === tab.id
                      ? 'bg-[#064E3B] text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left Column: Itemized Breakdown & Toggles */}
              <div className="lg:col-span-7 space-y-5">
                {/* Gender Toggle (SD: Putra/Putri, SMP: Ikhwan/Akhwat) */}
                {calcUnit !== 'tk' && (
                  <div className="flex items-center justify-between p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs mb-3">
                    <span className="font-bold text-emerald-950">Pilih Kategori Murid:</span>
                    <div className="flex items-center gap-1.5 p-1 bg-white rounded-xl border border-emerald-200">
                      {([
                        { id: 'male', label: calcUnit === 'sd' ? '👦 Putra (Rp 8,18 Juta)' : '👦 Ikhwan (Rp 7,3 Juta)' },
                        { id: 'female', label: calcUnit === 'sd' ? '👧 Putri (Rp 8,43 Juta)' : '👧 Akhwat (Rp 7,6 Juta)' },
                      ] as const).map((opt) => (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() => setStudentGender(opt.id)}
                          className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                            studentGender === opt.id
                              ? 'bg-emerald-800 text-white shadow-2xs'
                              : 'text-slate-600 hover:text-slate-900'
                          }`}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="rounded-2xl border border-slate-200 divide-y divide-slate-100 bg-[#F8FAFC]">
                  {feeRows.map((row, idx) => {
                    const isReduced = row.original !== undefined && row.amount < row.original;
                    return (
                      <div key={row.label} className="p-4 flex items-center justify-between gap-3 text-xs sm:text-sm">
                        <div>
                          <span className="text-slate-600 font-medium block">{idx + 1}. {row.label}:</span>
                          {row.hint && <span className="text-[11px] text-slate-400">{row.hint}</span>}
                        </div>
                        <div className="text-right shrink-0">
                          {isReduced && (
                            <span className="text-[11px] line-through text-slate-400 block">
                              Rp {row.original!.toLocaleString('id-ID')}
                            </span>
                          )}
                          <strong className={`font-mono ${isReduced ? 'text-emerald-700 font-bold' : 'text-slate-900'}`}>
                            Rp {Math.round(row.amount).toLocaleString('id-ID')}
                          </strong>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Discount Toggles */}
                <div className="p-4 sm:p-5 rounded-2xl bg-amber-50/70 border border-amber-200/80 space-y-3.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-950 uppercase tracking-wide">
                      Opsi Skema Keringanan &amp; Diskon PPDB:
                    </span>
                    {calcUnit === 'smp' && (
                      <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-emerald-700 text-white shadow-2xs">
                        Promo SPMB Gelombang 1
                      </span>
                    )}
                  </div>

                  {calcUnit === 'smp' ? (
                    <div className="space-y-2.5">
                      <label className={`flex items-start gap-3 p-3 rounded-xl border transition-all cursor-pointer ${
                        smpDiscountChoice === 'sdit_internal'
                          ? 'border-emerald-600 bg-white shadow-xs'
                          : 'border-slate-200 bg-white/60 hover:bg-white'
                      }`}>
                        <input
                          type="radio"
                          name="smpDiscountChoice"
                          checked={smpDiscountChoice === 'sdit_internal'}
                          onChange={() => setSmpDiscountChoice('sdit_internal')}
                          className="w-4 h-4 mt-0.5 text-emerald-700 focus:ring-emerald-500 cursor-pointer"
                        />
                        <div className="text-xs">
                          <strong className="text-emerald-950 font-bold block">
                            Gelombang 1: Diskon 70% Uang Bangunan (Khusus Siswa SDIT AL Afiyah)
                          </strong>
                          <span className="text-[11px] text-emerald-800 block mt-0.5">
                            Okt 2026 &ndash; Feb 2027 • Uang Bangunan Rp 2.500.000 diskon 70% jadi <strong>Rp 750.000</strong> (Hemat Rp 1.750.000)
                          </span>
                        </div>
                      </label>

                      <label className={`flex items-start gap-3 p-3 rounded-xl border transition-all cursor-pointer ${
                        smpDiscountChoice === 'external'
                          ? 'border-amber-600 bg-white shadow-xs'
                          : 'border-slate-200 bg-white/60 hover:bg-white'
                      }`}>
                        <input
                          type="radio"
                          name="smpDiscountChoice"
                          checked={smpDiscountChoice === 'external'}
                          onChange={() => setSmpDiscountChoice('external')}
                          className="w-4 h-4 mt-0.5 text-amber-700 focus:ring-amber-500 cursor-pointer"
                        />
                        <div className="text-xs">
                          <strong className="text-amber-950 font-bold block">
                            Gelombang 1: FREE 50% Uang Bangunan (Umum / Luar SDIT)
                          </strong>
                          <span className="text-[11px] text-amber-800 block mt-0.5">
                            Okt 2026 &ndash; Feb 2027 • Uang Bangunan Rp 2.500.000 diskon 50% jadi <strong>Rp 1.250.000</strong> (Hemat Rp 1.250.000)
                          </span>
                        </div>
                      </label>

                      <label className={`flex items-start gap-3 p-3 rounded-xl border transition-all cursor-pointer ${
                        smpDiscountChoice === 'wave2'
                          ? 'border-slate-400 bg-white shadow-xs'
                          : 'border-slate-200 bg-white/60 hover:bg-white'
                      }`}>
                        <input
                          type="radio"
                          name="smpDiscountChoice"
                          checked={smpDiscountChoice === 'wave2'}
                          onChange={() => setSmpDiscountChoice('wave2')}
                          className="w-4 h-4 mt-0.5 text-slate-700 focus:ring-slate-500 cursor-pointer"
                        />
                        <div className="text-xs">
                          <strong className="text-slate-900 font-bold block">
                            Gelombang 2: No Diskon (Tarif Biaya Normal)
                          </strong>
                          <span className="text-[11px] text-slate-500 block mt-0.5">
                            Periode 1 Mar 2027 &ndash; 30 Jun 2027 • Biaya Sarana Normal Rp 7.000.000
                          </span>
                        </div>
                      </label>

                      <div className="p-3 rounded-xl bg-emerald-100/70 border border-emerald-300 text-[11px] text-emerald-950 flex items-center justify-between">
                        <div className="flex items-center gap-1.5 font-medium">
                          <CreditCard className="w-3.5 h-3.5 text-emerald-800 shrink-0" />
                          <span>Rekening SPMB: <strong>Bank Muamalat 1360012405</strong> an. SMP IT Al Afiyah</span>
                        </div>
                        <button
                          type="button"
                          onClick={handleCopyMuamalat}
                          className="px-2 py-0.5 rounded-md bg-white text-emerald-900 font-bold text-[10px] shadow-2xs hover:bg-emerald-50 cursor-pointer"
                        >
                          {copiedMuamalat ? 'Tersalin!' : 'Salin'}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={hasSiblingDiscount}
                          disabled={hasTahfidzDiscount}
                          onChange={(e) => setHasSiblingDiscount(e.target.checked)}
                          className="w-4 h-4 rounded text-[#064E3B] focus:ring-emerald-500 cursor-pointer"
                        />
                        <span className="text-xs text-slate-700">
                          Diskon Saudara Kandung <strong>(Potongan 10% Uang Sarana)</strong>
                        </span>
                      </label>

                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={hasTahfidzDiscount}
                          disabled={hasSiblingDiscount}
                          onChange={(e) => setHasTahfidzDiscount(e.target.checked)}
                          className="w-4 h-4 rounded text-[#064E3B] focus:ring-emerald-500 cursor-pointer"
                        />
                        <span className="text-xs text-slate-700">
                          Jalur Prestasi Tahfidz Al-Qur&apos;an <strong>(Keringanan 50% Uang Sarana)</strong>
                        </span>
                      </label>
                    </>
                  )}
                </div>
              </div>

              {/* Right Column: Total Card & Installment Plan */}
              <div className="lg:col-span-5 bg-gradient-to-br from-[#064E3B] to-[#043327] rounded-3xl p-6 sm:p-7 text-white shadow-lg space-y-5 border border-emerald-900">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-emerald-200 font-medium">Estimasi Total Masuk:</span>
                  <span className="text-[10px] font-bold bg-amber-400 text-slate-950 px-2 py-0.5 rounded-md">
                    TP 2027/2028
                  </span>
                </div>

                <div>
                  <div className="text-3xl sm:text-4xl font-black text-amber-300 font-mono tracking-tight">
                    Rp {Math.round(calculatedTotal).toLocaleString('id-ID')}
                  </div>
                  <p className="text-[11px] text-emerald-200/80 mt-1">
                    Sudah termasuk infaq formulir, sarana, 4 stel seragam, buku modul, dan SPP bulan pertama.
                  </p>
                </div>

                {/* Installment Simulation */}
                <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 space-y-2 text-xs">
                  <div className="font-bold text-amber-200 flex items-center gap-1.5">
                    <CreditCard className="w-3.5 h-3.5" />
                    <span>Skema Angsuran Syariah Bebas Bunga:</span>
                  </div>
                  <div className="flex justify-between pt-1 border-t border-white/10">
                    <span className="text-emerald-100">DP Daftar Ulang (40%):</span>
                    <strong className="font-mono text-white">Rp {initialDp.toLocaleString('id-ID')}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-emerald-100">Termin 1 (Bulan Ke-2):</span>
                    <strong className="font-mono text-white">Rp {remainingInstallment.toLocaleString('id-ID')}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-emerald-100">Termin 2 (Bulan Ke-4):</span>
                    <strong className="font-mono text-white">Rp {remainingInstallment.toLocaleString('id-ID')}</strong>
                  </div>
                </div>

                <div className="pt-2">
                  <Link
                    href={`/ppdb/daftar?school=${calcUnit}`}
                    className="w-full py-3.5 px-4 rounded-2xl bg-amber-400 hover:bg-amber-500 text-slate-950 text-xs sm:text-sm font-bold transition-all shadow-md flex items-center justify-center space-x-2 cursor-pointer tactile-press"
                  >
                    <span>Daftar {({ tk: 'TK IT Al-Afiyah', sd: 'SD IT Al-Afiyah', smp: 'SMP IT Al-Afiyah' } as const)[calcUnit]} Sekarang</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 3 Jalur Masuk Pendaftaran Showcase */}
        <section className="bg-white rounded-3xl p-6 sm:p-10 shadow-sm border border-slate-200/90 space-y-6">
          <div className="text-center max-w-2xl mx-auto">
            <span className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-50 text-emerald-800 border border-emerald-200 mb-2">
              Jalur Pendaftaran Resmi
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Pilihan Jalur Masuk Sesuai Potensi Ananda
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Yayasan menyediakan berbagai skema penerimaan murid baru untuk mendukung pemerataan pendidikan Al-Qur&apos;an.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
            {tracks.map((t) => (
              <div
                key={t.id}
                className={`p-6 rounded-2xl border ${t.color} shadow-2xs space-y-3 flex flex-col justify-between`}
              >
                <div>
                  <div className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wide bg-slate-900 text-white mb-2">
                    {t.tag}
                  </div>
                  <h3 className="text-base font-bold text-slate-900">
                    {t.title}
                  </h3>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    {t.desc}
                  </p>
                </div>
                <div className="pt-3 border-t border-slate-200/60 text-[11px] text-emerald-900 font-semibold flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>{t.benefit}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 4 Step Registration Flow */}
        <section className="bg-white rounded-3xl p-6 sm:p-10 shadow-sm border border-slate-200/90 space-y-8">
          <div className="text-center max-w-2xl mx-auto">
            <div className="inline-flex items-center space-x-2 text-xs font-bold text-[#064E3B] uppercase tracking-wider mb-2">
              <ClipboardCheck className="w-4 h-4 text-emerald-600" />
              <span>Proses Mudah &amp; Terintegrasi</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Alur 4 Langkah Pendaftaran Murid Baru
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-slate-600">
              Seluruh tahapan mulai dari biodata, verifikasi berkas stopmap fisik, hingga pengukuran seragam dilakukan secara transparan.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((s, idx) => (
              <div key={idx} className="p-6 rounded-2xl bg-[#F8FAFC] border border-slate-200/70 space-y-3 relative flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-2xl font-black text-[#064E3B] font-mono">
                      {s.step}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                      {s.badge}
                    </span>
                  </div>
                  <h3 className="text-sm sm:text-base font-bold text-slate-900">
                    {s.title}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed mt-1">
                    {s.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Parent Testimonials Carousel / Grid */}
        <section className="space-y-6">
          <div className="text-center max-w-2xl mx-auto">
            <span className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-50 text-amber-900 border border-amber-200 mb-2">
              Suara Orang Tua &amp; Wali Murid
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Testimoni Keluarga Besar Al-Afiyah
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Pengalaman nyata orang tua yang telah mempercayakan pendidikan ananda di TK IT, SD IT, dan SMP IT Al-Afiyah.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
            {testimonials.map((t, idx) => (
              <div
                key={idx}
                className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-2xs hover:shadow-md transition-shadow flex flex-col justify-between relative"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#E8F3F1] text-[#064E3B]">
                      {t.badge}
                    </span>
                    <div className="flex items-center text-amber-400">
                      {[...Array(t.rating)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-current" />
                      ))}
                    </div>
                  </div>

                  <p className="text-xs text-slate-700 leading-relaxed italic mb-6">
                    &ldquo;{t.quote}&rdquo;
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-[#064E3B] text-amber-300 font-bold text-xs flex items-center justify-center">
                    {t.parent.charAt(0)}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">{t.parent}</h4>
                    <p className="text-[11px] text-slate-500">{t.child}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Tahfidz Scholarship Banner */}
        <section className="bg-[#064E3B] text-white rounded-3xl p-8 sm:p-10 shadow-lg border border-emerald-900/60 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="space-y-3 max-w-2xl text-left">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/10 text-amber-300 text-xs font-bold uppercase tracking-wider border border-white/15">
                <Award className="w-4 h-4 text-amber-300" />
                <span>Program Beasiswa Prestasi Tahfidz</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white leading-tight">
                Beasiswa Khusus Penghafal Al-Qur&apos;an (Mutqin)
              </h2>
              <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed">
                Tersedia keringanan infaq sarana hingga 100% dan beasiswa SPP bagi calon murid SD IT dan SMP IT Al-Afiyah yang memiliki hafalan mutqin bersanad (dengan uji tasmi&apos; panitia).
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0 w-full sm:w-auto">
              <a
                href="https://wa.me/6281234567890?text=Assalamu'alaikum%20Panitia%20PPDB%20Al-Afiyah,%20saya%20ingin%20konsultasi%20jalur%20beasiswa%20tahfidz."
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold text-xs sm:text-sm shadow-md transition-all inline-flex items-center justify-center space-x-2 cursor-pointer"
              >
                <Phone className="w-4 h-4" />
                <span>Konsultasi Beasiswa Tahfidz</span>
              </a>
            </div>
          </div>
        </section>

        {/* Affiliate Callout Banner */}
        <section className="bg-gradient-to-br from-amber-50 to-emerald-50/60 rounded-3xl p-8 sm:p-10 border border-amber-200/80 shadow-2xs">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="space-y-3 max-w-2xl text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 text-amber-900 text-xs font-bold border border-amber-400/30">
                <Gift className="w-3.5 h-3.5 text-amber-800" />
                <span>Program Mitra Afiliasi Al-Afiyah</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight">
                Ikut Menyiarkan Kebaikan, Raih Komisi Berkah Hingga Rp 500.000 / Murid
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Terbuka bagi wali murid, alumni, guru, maupun masyarakat luas. Dapatkan tautan referral unik, pantau murid yang mendaftar secara transparan, dan cairkan komisi langsung ke rekening Anda setiap bulan.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0 w-full sm:w-auto">
              <Link
                href="/affiliate/register"
                className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-[#064E3B] hover:bg-emerald-900 text-white font-bold text-xs sm:text-sm shadow-md transition-all inline-flex items-center justify-center space-x-2 cursor-pointer"
              >
                <span>Daftar Mitra Afiliasi (Gratis)</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/affiliate"
                className="w-full sm:w-auto px-5 py-3.5 rounded-2xl bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 font-semibold text-xs sm:text-sm transition-colors text-center"
              >
                Pelajari Program Kemitraan
              </Link>
            </div>
          </div>
        </section>

        {/* Interactive FAQ Accordion */}
        <section className="bg-white rounded-3xl p-6 sm:p-10 shadow-sm border border-slate-200/90 space-y-6">
          <div className="text-center max-w-2xl mx-auto">
            <span className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-slate-100 text-slate-700 mb-2">
              Tanya Jawab (FAQ)
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Pertanyaan Sering Diajukan Orang Tua
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Jawaban ringkas seputar syarat masuk, observasi, dan tata cara pendaftaran murid baru.
            </p>
          </div>

          <div className="space-y-3 max-w-3xl mx-auto pt-2">
            {faqs.map((f, idx) => {
              const isOpen = activeFaq === idx;
              return (
                <div
                  key={idx}
                  className="rounded-2xl border border-slate-200 overflow-hidden transition-colors"
                >
                  <button
                    type="button"
                    onClick={() => setActiveFaq(isOpen ? null : idx)}
                    className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 bg-white hover:bg-slate-50 transition-colors cursor-pointer"
                  >
                    <span className="text-xs sm:text-sm font-bold text-slate-900">
                      {f.q}
                    </span>
                    <span className="text-slate-400 shrink-0">
                      {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </span>
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-5 pt-1 text-xs text-slate-600 leading-relaxed border-t border-slate-100 bg-[#F8FAFC]">
                      {f.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

      </main>

      {/* =========================================================================
          BROCHURE & SYARAT PPDB MODAL
         ========================================================================= */}
      {showBrochureModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowBrochureModal(false)}
              className="absolute top-5 right-5 p-2 rounded-full bg-slate-100 text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-5">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-[#064E3B] text-amber-300 flex items-center justify-center">
                  <FileText className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-slate-900">
                    Brosur &amp; Rincian Resmi PPDB 2027/2028
                  </h3>
                  <p className="text-xs text-slate-500">
                    Yayasan Pendidikan Imam Bonjol Al-Afiyah Majalengka
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#F8FAFC] border border-slate-200 text-xs space-y-2.5">
                <div className="font-bold text-slate-900 text-sm">Persyaratan Berkas Administrasi:</div>
                <div className="flex items-start gap-2">
                  <CheckCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>1 Lembar Fotokopi Kartu Keluarga (KK) yang masih berlaku.</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>1 Lembar Fotokopi Akta Kelahiran Calon Murid.</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>2 Lembar Pas Foto Berwarna ukuran 3x4 (Background Merah/Biru).</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Fotokopi KTP kedua orang tua / wali murid.</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Surat Keterangan Lulus / Ijazah jenjang sebelumnya (Khusus SD &amp; SMP).</span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs space-y-2">
                <div className="font-bold text-emerald-900 text-sm">Jadwal Gelombang &amp; Observasi:</div>
                <div className="flex justify-between border-b border-emerald-100 pb-1.5">
                  <span className="text-emerald-800 font-medium">Gelombang 1 (Early Bird):</span>
                  <strong className="text-emerald-950 font-bold">1 Okt 2026 &ndash; 28 Feb 2027</strong>
                </div>
                <div className="flex justify-between border-b border-emerald-100 pb-1.5">
                  <span className="text-emerald-800 font-medium">Gelombang 2 (Reguler):</span>
                  <strong className="text-emerald-950 font-bold">1 Mar 2027 &ndash; 30 Jun 2027</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-emerald-800 font-medium">Observasi Kesiapan:</span>
                  <strong className="text-emerald-950 font-bold">Setiap Sabtu Pekan Berjalan</strong>
                </div>
              </div>

              {/* Highlight SPMB SMP IT 2027/2028 Resmi */}
              <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-300 text-xs space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-bold text-emerald-950 text-sm">
                    <BadgeCheck className="w-4 h-4 text-emerald-700" />
                    <span>SPMB SMP IT Al-Afiyah 2027/2028</span>
                  </div>
                  <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-emerald-700 text-white shadow-2xs">
                    Gelombang 1 Dibuka
                  </span>
                </div>
                <div className="space-y-1.5 text-[11px] text-slate-700">
                  <p>
                    • <strong>Gelombang 1 (1 Okt 2026 &ndash; 28 Feb 2027):</strong> Diskon 70% Uang Bangunan (Khusus siswa SDIT Al-Afiyah) &amp; Diskon 50% Uang Bangunan (Luar SDIT).
                  </p>
                  <p>
                    • <strong>Gelombang 2 (1 Mar 2027 &ndash; 30 Jun 2027):</strong> No Diskon (Tarif Biaya Normal).
                  </p>
                  <div className="pt-2 border-t border-emerald-200/70 flex items-center justify-between bg-white/80 p-2.5 rounded-xl border border-emerald-200">
                    <div>
                      <span className="text-[10px] text-emerald-800 font-medium block">Rekening Resmi SPMB SMP IT:</span>
                      <strong className="text-xs text-slate-900 font-mono font-bold">Bank Muamalat 1360012405</strong>
                      <span className="text-[10px] text-slate-500 block">a.n SMP IT Al Afiyah</span>
                    </div>
                    <button
                      type="button"
                      onClick={handleCopyMuamalat}
                      className="px-2.5 py-1 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-[10px] font-bold shadow-2xs transition-colors cursor-pointer"
                    >
                      {copiedMuamalat ? 'Tersalin!' : 'Salin Rekening'}
                    </button>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <Link
                    href="/ppdb/daftar?school=smp"
                    className="inline-flex items-center gap-1.5 py-1.5 px-3 rounded-lg bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-[11px] transition-colors shadow-2xs"
                  >
                    <span>Daftar SMP IT Online</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                  <a
                    href="https://wa.me/6281223344553?text=Assalamu%27alaikum%20Panitia%20SPMB%20SMP%20IT%20Al-Afiyah%2C%20saya%20ingin%20konsultasi%20pendaftaran%20Gelombang%201"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 py-1.5 px-3 rounded-lg bg-white border border-emerald-300 text-emerald-800 hover:bg-emerald-50 font-bold text-[11px] transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Hotline SMP IT (0812-2334-4553)</span>
                  </a>
                </div>
              </div>

              {/* Highlight Poster Resmi SPMB SDIT 2027/2028 */}
              <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-300 text-xs space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-bold text-amber-950 text-sm">
                    <BadgeCheck className="w-4 h-4 text-amber-600" />
                    <span>Poster Resmi SPMB SDIT 2027/2028</span>
                  </div>
                  <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-amber-200 text-amber-900">
                    Hanya 2 Rombel
                  </span>
                </div>
                <p className="text-slate-600 text-[11px] leading-relaxed">
                  Flyer resmi sistem penerimaan murid baru SDIT Al Afiyah dengan 8 program unggulan terpadu (Smart Akhlak Fitrah).
                </p>
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <a
                    href="/images/sd-spmb-poster-2027.jpg"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 py-1.5 px-3 rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-[11px] transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Lihat / Unduh Poster JPG</span>
                  </a>
                  <a
                    href="https://wa.me/6281310139001?text=Assalamu%27alaikum%20Panitia%20SPMB%20SDIT%20Al-Afiyah%2C%20saya%20ingin%20konsultasi%20pendaftaran"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 py-1.5 px-3 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-[11px] transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Hotline SDIT (0813-1013-9001)</span>
                  </a>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                <button
                  onClick={() => window.print()}
                  className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Printer className="w-4 h-4" />
                  <span>Cetak Ringkasan (Print)</span>
                </button>
                <Link
                  href="/ppdb/daftar"
                  className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-amber-400 hover:bg-amber-500 text-slate-950 text-xs font-bold transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <ClipboardCheck className="w-4 h-4" />
                  <span>Lanjut Daftar Online</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
      <StickyMobileBar />
    </div>
  );
}
