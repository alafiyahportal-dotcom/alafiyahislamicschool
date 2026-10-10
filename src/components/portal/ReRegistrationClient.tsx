'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Shirt,
  Ruler,
  CheckCircle2,
  Calendar,
  CreditCard,
  Building2,
  ArrowRight,
  ArrowLeft,
  Printer,
  FileCheck,
  ChevronRight,
  Home,
  Info,
  Scale,
  HelpCircle,
  Clock,
  QrCode,
  ShieldCheck,
  AlertCircle,
} from 'lucide-react';

export interface StudentRegData {
  id: string;
  registrationNo: string;
  studentName: string;
  nik: string;
  gender: string;
  pob: string;
  dob: string | Date;
  address: string;
  status: string;
  schoolSpecificData?: string;
  parentData?: string;
  school: {
    id: string;
    slug: string;
    name: string;
    badgeText: string;
    primaryColor: string;
    accentColor: string;
  };
  reRegistration?: {
    id: string;
    uniformSize: string;
    uniformType: string | null;
    heightCm: number | null;
    weightKg: number | null;
    shoeSize: number | null;
    boardingPreference: string | null;
    roommatePreference: string | null;
    paymentPlan: string;
    notes: string | null;
    isUniformTaken: boolean;
    status: string;
    createdAt: string | Date;
  } | null;
}

interface ReRegistrationClientProps {
  registration: StudentRegData;
}

const SIZE_CHART = [
  { size: 'S', ld: '76 cm', pb: '54 cm', pc: '68 cm', age: 'TK / SD Kecil (4-7 thn)', reco: 'Tinggi 100-115 cm' },
  { size: 'M', ld: '82 cm', pb: '58 cm', pc: '74 cm', age: 'SD Sedang (7-10 thn)', reco: 'Tinggi 115-130 cm' },
  { size: 'L', ld: '88 cm', pb: '64 cm', pc: '82 cm', age: 'SD Besar / SMP (10-13 thn)', reco: 'Tinggi 130-145 cm' },
  { size: 'XL', ld: '94 cm', pb: '70 cm', pc: '90 cm', age: 'SMP / Remaja (13-16 thn)', reco: 'Tinggi 145-160 cm' },
  { size: 'XXL', ld: '102 cm', pb: '75 cm', pc: '96 cm', age: 'Postur Tinggi / Jumbo', reco: 'Tinggi >160 cm' },
  { size: 'CUSTOM', ld: 'Khusus', pb: 'Khusus', pc: 'Khusus', age: 'Jahit Khusus Tailor', reco: 'Sesuai catatan' },
];

export default function ReRegistrationClient({ registration }: ReRegistrationClientProps) {
  const existing = registration.reRegistration;

  // Form State
  const [uniformSize, setUniformSize] = useState(existing?.uniformSize || 'M');
  const [uniformType, setUniformType] = useState(
    existing?.uniformType ||
      (registration.gender === 'L'
        ? 'Kemeja & Celana Formal Panjang'
        : "Gamis Syar'i & Kerudung Bergo Instan")
  );
  const [heightCm, setHeightCm] = useState(existing?.heightCm?.toString() || '125');
  const [weightKg, setWeightKg] = useState(existing?.weightKg?.toString() || '26');
  const [shoeSize, setShoeSize] = useState(existing?.shoeSize?.toString() || '34');
  const [boardingPreference, setBoardingPreference] = useState(
    existing?.boardingPreference || 'REGULER'
  );
  const [roommatePreference, setRoommatePreference] = useState(
    existing?.roommatePreference || ''
  );
  const [paymentPlan, setPaymentPlan] = useState(existing?.paymentPlan || 'FULL');
  const [notes, setNotes] = useState(existing?.notes || '');
  const [agreementChecked, setAgreementChecked] = useState(Boolean(existing));

  // UI Flow State
  const [activeStep, setActiveStep] = useState<number>(existing ? 4 : 1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(Boolean(existing));
  const [showSizeModal, setShowSizeModal] = useState(false);
  const [showPrintProof, setShowPrintProof] = useState(false);

  const isSMP = registration.school.slug === 'smp';

  // Format Date
  const formatDateIndo = (dateInput?: string | Date) => {
    if (!dateInput) return '-';
    const d = new Date(dateInput);
    return d.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  // Handle Form Submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreementChecked) {
      alert('Silakan centang persetujuan keabsahan data daftar ulang terlebih dahulu.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/portal/re-registration', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          registrationNo: registration.registrationNo,
          uniformSize,
          uniformType,
          heightCm: Number(heightCm),
          weightKg: Number(weightKg),
          shoeSize: Number(shoeSize),
          boardingPreference: isSMP ? boardingPreference : undefined,
          roommatePreference: isSMP ? roommatePreference : undefined,
          paymentPlan,
          notes,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Gagal menyimpan konfirmasi daftar ulang');
      }

      setSubmitSuccess(true);
      setActiveStep(4);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Terjadi kesalahan sistem';
      alert(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Top Breadcrumb & Hero */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-[#D4EBE7] relative overflow-hidden">
        <div className="absolute -right-20 -top-20 w-64 h-64 rounded-full bg-[#E8F3F1]/80 pointer-events-none blur-3xl" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center space-x-2 text-xs font-semibold text-slate-500 mb-2">
              <Link href={`/portal/ppdb/${registration.registrationNo}`} className="hover:text-[#2D7A70] flex items-center space-x-1">
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Kembali ke Portal Utama</span>
              </Link>
              <span>•</span>
              <span className="text-[#184F48] font-bold">Daftar Ulang &amp; Seragam</span>
            </div>

            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-xs font-extrabold text-emerald-800 mb-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Status: Murid Diterima (Lulus Seleksi)</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Konfirmasi Daftar Ulang &amp; Pengukuran Seragam
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
              Selamat bergabung ananda <strong className="text-slate-900">{registration.studentName}</strong> di {registration.school.name}. Silakan lengkapi spesifikasi seragam sekolah dan preferensi pendaftaran ulang berikut.
            </p>
          </div>

          {/* Registration Mini Card */}
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80 min-w-[240px]">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">No. Registrasi Murid</div>
            <div className="text-base font-extrabold text-[#184F48] tracking-tight">{registration.registrationNo}</div>
            <div className="mt-2 pt-2 border-t border-slate-200 flex items-center justify-between text-xs">
              <span className="text-slate-500">Unit Pendidikan:</span>
              <span className="font-bold text-slate-800">{registration.school.badgeText}</span>
            </div>
          </div>
        </div>

        {/* Step Indicator Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-8 pt-6 border-t border-slate-100">
          {[
            { step: 1, title: 'Ukuran Seragam', icon: Shirt, desc: 'Size & Postur' },
            { step: 2, title: isSMP ? 'Program Peminatan' : 'Data Pendukung', icon: Building2, desc: isSMP ? 'Kelas & Tahfidz' : 'Kelengkapan' },
            { step: 3, title: 'Rencana Biaya', icon: CreditCard, desc: 'Skema Pelunasan' },
            { step: 4, title: 'Tanda Terima', icon: FileCheck, desc: 'Cetak Bukti Resmi' },
          ].map((item) => {
            const Icon = item.icon;
            const isCurrent = activeStep === item.step;
            const isCompleted = activeStep > item.step || submitSuccess;

            return (
              <button
                key={item.step}
                type="button"
                onClick={() => {
                  // Only allow clicking previous or current steps
                  if (item.step <= activeStep || submitSuccess) {
                    setActiveStep(item.step);
                  }
                }}
                className={`p-3 rounded-2xl border text-left transition-all flex items-center space-x-3 cursor-pointer ${
                  isCurrent
                    ? 'border-[#2D7A70] bg-[#E8F3F1]/60 ring-2 ring-[#2D7A70]/20'
                    : isCompleted
                    ? 'border-emerald-200 bg-emerald-50/40 text-emerald-800'
                    : 'border-slate-100 bg-white opacity-60'
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 text-xs font-bold ${
                    isCurrent
                      ? 'bg-[#184F48] text-white'
                      : isCompleted
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-100 text-slate-400'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <div className="overflow-hidden">
                  <div className="text-xs font-bold text-slate-800 truncate">{item.title}</div>
                  <div className="text-[10px] text-slate-500 truncate">{item.desc}</div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Multi-Step Interactive Form */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-[#D4EBE7]">
        {/* STEP 1: UKURAN SERAGAM & POSTUR TUBUH */}
        {activeStep === 1 && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
              <div>
                <h2 className="text-lg font-extrabold text-slate-900 flex items-center space-x-2">
                  <Shirt className="w-5 h-5 text-[#2D7A70]" />
                  <span>Langkah 1: Spesifikasi &amp; Ukuran Paket Seragam Murid</span>
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Paket seragam mencakup 5 stel lengkap (Putih-Hijau, Batik Yayasan, Pramuka, Olahraga, Koko/Gamis) + Dasi &amp; Tas.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowSizeModal(true)}
                className="px-3 py-1.5 rounded-xl bg-[#E8F3F1] hover:bg-[#D4EBE7] text-[#184F48] text-xs font-bold transition-colors inline-flex items-center space-x-1.5 self-start"
              >
                <Ruler className="w-3.5 h-3.5 text-[#2D7A70]" />
                <span>Lihat Tabel Ukuran (Size Chart)</span>
              </button>
            </div>

            {/* Size Selector Grid */}
            <div>
              <label className="block text-xs font-extrabold text-slate-800 mb-2">
                Pilih Ukuran Utama Seragam Murid:
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                {SIZE_CHART.map((c) => {
                  const isSelected = uniformSize === c.size;
                  return (
                    <div
                      key={c.size}
                      onClick={() => setUniformSize(c.size)}
                      className={`p-3.5 rounded-2xl border text-center transition-all cursor-pointer flex flex-col justify-between ${
                        isSelected
                          ? 'border-[#2D7A70] bg-[#184F48] text-white shadow-md scale-102 ring-2 ring-[#2D7A70]/30'
                          : 'border-slate-200 bg-white hover:border-[#2D7A70]/60 hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <div>
                        <div className={`text-xl font-extrabold ${isSelected ? 'text-white' : 'text-slate-900'}`}>
                          {c.size}
                        </div>
                        <div className={`text-[10px] mt-1 ${isSelected ? 'text-[#E8F3F1]' : 'text-slate-500'}`}>
                          {c.age}
                        </div>
                      </div>
                      <div className={`text-[10px] font-semibold mt-2 pt-2 border-t ${isSelected ? 'border-white/20 text-amber-300' : 'border-slate-100 text-[#2D7A70]'}`}>
                        {c.reco}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Posture Measurements Inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
                <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center space-x-1.5">
                  <Ruler className="w-3.5 h-3.5 text-[#2D7A70]" />
                  <span>Tinggi Badan (cm)</span>
                </label>
                <input
                  type="number"
                  min="80"
                  max="195"
                  value={heightCm}
                  onChange={(e) => setHeightCm(e.target.value)}
                  placeholder="Contoh: 125"
                  className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#2D7A70]/30"
                  required
                />
                <span className="text-[10px] text-slate-400 mt-1 block">Untuk penyesuaian panjang celana/rok</span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
                <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center space-x-1.5">
                  <Scale className="w-3.5 h-3.5 text-[#2D7A70]" />
                  <span>Berat Badan (kg)</span>
                </label>
                <input
                  type="number"
                  min="12"
                  max="120"
                  value={weightKg}
                  onChange={(e) => setWeightKg(e.target.value)}
                  placeholder="Contoh: 28"
                  className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#2D7A70]/30"
                  required
                />
                <span className="text-[10px] text-slate-400 mt-1 block">Untuk penyesuaian lingkar pinggang karet</span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
                <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center space-x-1.5">
                  <Shirt className="w-3.5 h-3.5 text-[#2D7A70]" />
                  <span>Ukuran Sepatu (No.)</span>
                </label>
                <input
                  type="number"
                  min="26"
                  max="46"
                  value={shoeSize}
                  onChange={(e) => setShoeSize(e.target.value)}
                  placeholder="Contoh: 34"
                  className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#2D7A70]/30"
                  required
                />
                <span className="text-[10px] text-slate-400 mt-1 block">Bonus kaos kaki &amp; sepatu resmi</span>
              </div>
            </div>

            {/* Uniform Style Model Description */}
            <div className="p-4 rounded-2xl bg-[#E8F3F1]/40 border border-[#D4EBE7] flex items-start space-x-3">
              <Info className="w-4 h-4 text-[#2D7A70] flex-shrink-0 mt-0.5" />
              <div className="text-xs text-slate-700 leading-relaxed">
                <strong>Model Standar Busana:</strong> Untuk murid {registration.gender === 'L' ? 'Ikhwan' : 'Akhwat'} jenjang {registration.school.badgeText}, seragam menggunakan model <em>{uniformType}</em> berbahan katun oxford premium yang adem, menyerap keringat, dan jahitan rapi berstandar sekolah terpadu unggulan.
              </div>
            </div>

            {/* Special Tailor Notes */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Catatan Khusus untuk Konveksi / Penjahit (Opsional):
              </label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Contoh: Lengan minta dilebihkan 2 cm, pinggang celana dibuat agak longgar, dll."
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#2D7A70]/30"
              />
            </div>

            <div className="flex justify-end pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setActiveStep(2)}
                className="px-6 py-2.5 rounded-xl bg-[#184F48] hover:bg-[#133f3a] text-white text-xs font-bold inline-flex items-center space-x-1.5 transition-all shadow-sm"
              >
                <span>Lanjut ke Langkah 2</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: PROGRAM PEMINATAN (SMP) / DATA PENDUKUNG */}
        {activeStep === 2 && (
          <div className="space-y-6">
            <div className="pb-4 border-b border-slate-100">
              <h2 className="text-lg font-extrabold text-slate-900 flex items-center space-x-2">
                <Building2 className="w-5 h-5 text-[#2D7A70]" />
                <span>{isSMP ? 'Langkah 2: Pilihan Program Kelas & Peminatan Murid' : 'Langkah 2: Konfirmasi Data Pendukung'}</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                {isSMP
                  ? 'Pengaturan peminatan kelas akademik dan bimbingan bakat murid baru SMP IT Al-Afiyah.'
                  : 'Pemberitahuan program orientasi murid baru dan kelengkapan administrasi sekolah.'}
              </p>
            </div>

            {isSMP ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-extrabold text-slate-800 mb-2">
                    Pilihan Program Kelas Belajar Murid:
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {[
                      {
                        id: 'REGULER',
                        title: 'Kelas Fullday Reguler (SIT & Sains)',
                        desc: 'Mengikuti kurikulum SMP IT terpadu nasional, pembinaan adab nabawiyah, tahfidz target 3-5 Juz, dan sains aplikatif.',
                      },
                      {
                        id: 'TAHFIDZ_INTENSIF',
                        title: 'Kelas Peminatan Tahfidz & Bahasa',
                        desc: 'Fokus penguatan akselerasi hafalan Al-Qur\'an mutqin & tartil serta pembiasaan percakapan Bahasa Arab-Inggris aktif.',
                      },
                    ].map((opt) => {
                      const isSelected = boardingPreference === opt.id;
                      return (
                        <div
                          key={opt.id}
                          onClick={() => setBoardingPreference(opt.id)}
                          className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                            isSelected
                              ? 'border-[#2D7A70] bg-[#E8F3F1]/70 ring-2 ring-[#2D7A70]/20'
                              : 'border-slate-200 bg-white hover:bg-slate-50'
                          }`}
                        >
                          <div className="flex items-center space-x-2">
                            <input
                              type="radio"
                              checked={isSelected}
                              onChange={() => setBoardingPreference(opt.id)}
                              className="text-[#2D7A70] focus:ring-[#2D7A70]"
                            />
                            <div className="font-extrabold text-slate-900 text-sm">{opt.title}</div>
                          </div>
                          <p className="text-xs text-slate-600 mt-2 pl-5 leading-relaxed">{opt.desc}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Catatan Khusus Peminatan &amp; Minat Bakat Murid:
                  </label>
                  <input
                    type="text"
                    value={roommatePreference}
                    onChange={(e) => setRoommatePreference(e.target.value)}
                    placeholder="Contoh: Minat klub robotika/sains, riwayat kesehatan, atau ekstrakurikuler pilihan (panahan, pramuka SIT, dll)"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#2D7A70]/30"
                  />
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    Panitia akan memfasilitasi minat dan bakat ananda secara optimal dalam proses pembelajaran.
                  </span>
                </div>
              </div>
            ) : (
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 text-xs text-slate-700">
                <div className="font-bold text-slate-900 text-sm">Ketentuan Masa Orientasi Murid ({registration.school.badgeText}):</div>
                <p>
                  1. Murid baru TK IT &amp; SDIT wajib mengikuti Masa Pengenalan Lingkungan Sekolah (MPLS) ceria yang dijadwalkan pada awal Juli 2027.
                </p>
                <p>
                  2. Paket seragam yang telah dipesan akan dibagikan saat sesi pengukuran ulang dan pengambilan di ruang Tata Usaha pada tanggal 20-25 Juni 2026.
                </p>
                <p>
                  3. Buku paket dan modul diniyah akan langsung didistribusikan ke kelas masing-masing murid pada hari pertama sekolah.
                </p>
              </div>
            )}

            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setActiveStep(1)}
                className="px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold inline-flex items-center space-x-1.5 transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Kembali</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveStep(3)}
                className="px-6 py-2.5 rounded-xl bg-[#184F48] hover:bg-[#133f3a] text-white text-xs font-bold inline-flex items-center space-x-1.5 transition-all shadow-sm"
              >
                <span>Lanjut ke Langkah 3</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: RENCANA BIAYA & SKEMA PEMBAYARAN */}
        {activeStep === 3 && (
          <div className="space-y-6">
            <div className="pb-4 border-b border-slate-100">
              <h2 className="text-lg font-extrabold text-slate-900 flex items-center space-x-2">
                <CreditCard className="w-5 h-5 text-[#2D7A70]" />
                <span>Langkah 3: Rincian Biaya &amp; Skema Pembayaran Daftar Ulang</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Pilih opsi pembayaran biaya pangkal dan paket seragam yang paling nyaman bagi keluarga Anda.
              </p>
            </div>

            {/* Cost Breakdown Table */}
            <div className="rounded-2xl border border-slate-200 overflow-hidden text-xs">
              <div className="bg-slate-50 p-3 font-bold text-slate-800 border-b border-slate-200 flex justify-between">
                <span>Komponen Biaya Daftar Ulang Resmi</span>
                <span>Estimasi Tarif</span>
              </div>
              <div className="divide-y divide-slate-100 p-2 space-y-1">
                <div className="flex justify-between p-2">
                  <div>
                    <div className="font-semibold text-slate-800">Paket 5 Stel Seragam Lengkap + Aksesoris</div>
                    <div className="text-[10px] text-slate-500">Putih-Hijau, Pramuka, Batik, Olahraga, Koko/Gamis + Dasi/Jilbab</div>
                  </div>
                  <span className="font-bold text-slate-800">Rp 1.250.000</span>
                </div>
                <div className="flex justify-between p-2">
                  <div>
                    <div className="font-semibold text-slate-800">Buku Modul Diniyah, Iqro &amp; Mushaf Al-Qur&apos;an</div>
                    <div className="text-[10px] text-slate-500">Bahan ajar kurikulum Islam terpadu 1 tahun penuh</div>
                  </div>
                  <span className="font-bold text-slate-800">Rp 450.000</span>
                </div>
                <div className="flex justify-between p-2">
                  <div>
                    <div className="font-semibold text-slate-800">Infaq Sarana Prasarana &amp; Fasilitas Belajar</div>
                    <div className="text-[10px] text-slate-500">Pengembangan laboratorium, masjid, dan perpustakaan</div>
                  </div>
                  <span className="font-bold text-slate-800">Rp 2.000.000</span>
                </div>
                <div className="flex justify-between p-2">
                  <div>
                    <div className="font-semibold text-slate-800">Iuran Syahriyah / SPP Bulan Pertama (Juli 2027)</div>
                    <div className="text-[10px] text-slate-500">Operasional pendidikan bulan pertama</div>
                  </div>
                  <span className="font-bold text-slate-800">Rp 400.000</span>
                </div>
              </div>
              <div className="bg-[#E8F3F1] p-3.5 border-t border-[#D4EBE7] flex justify-between items-center text-sm font-extrabold text-[#184F48]">
                <span>Total Biaya Daftar Ulang Resmi</span>
                <span>Rp 4.100.000</span>
              </div>
            </div>

            {/* Payment Plan Options */}
            <div>
              <label className="block text-xs font-extrabold text-slate-800 mb-2">
                Pilih Skema Pelunasan yang Diinginkan:
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  {
                    id: 'FULL',
                    title: 'Skema Lunas (100%)',
                    desc: 'Pelunasan penuh saat daftar ulang (Okt 2026). Mendapatkan tas murid eksklusif & potongan infaq Rp 100.000.',
                    tag: 'Paling Populer',
                  },
                  {
                    id: 'INSTALLMENT_2X',
                    title: 'Cicilan 2x (50% : 50%)',
                    desc: 'Tahap 1: Rp 2.050.000 saat daftar ulang. Tahap 2: Rp 2.050.000 sebelum masuk sekolah (Desember 2026).',
                    tag: 'Cicilan 2 Tahap',
                  },
                  {
                    id: 'INSTALLMENT_3X',
                    title: 'Cicilan 3x Bertahap',
                    desc: 'Tahap 1: Rp 1.500.000, Tahap 2: Rp 1.300.000, Tahap 3: Rp 1.300.000 dengan tempo fleksibel.',
                    tag: 'Cicilan 3 Tahap',
                  },
                ].map((plan) => {
                  const isSelected = paymentPlan === plan.id;
                  return (
                    <div
                      key={plan.id}
                      onClick={() => setPaymentPlan(plan.id)}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                        isSelected
                          ? 'border-[#2D7A70] bg-[#184F48] text-white shadow-md ring-2 ring-[#2D7A70]/30'
                          : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-800'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold ${
                              isSelected ? 'bg-amber-300 text-slate-900' : 'bg-[#E8F3F1] text-[#184F48]'
                            }`}
                          >
                            {plan.tag}
                          </span>
                        </div>
                        <div className="font-extrabold text-sm">{plan.title}</div>
                        <p className={`text-[11px] mt-2 leading-relaxed ${isSelected ? 'text-[#E8F3F1]' : 'text-slate-600'}`}>
                          {plan.desc}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Legal Parent Consent Checkbox */}
            <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200">
              <label className="flex items-start space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreementChecked}
                  onChange={(e) => setAgreementChecked(e.target.checked)}
                  className="w-4 h-4 rounded text-[#2D7A70] focus:ring-[#2D7A70] mt-0.5 flex-shrink-0"
                />
                <span className="text-xs text-amber-900 leading-relaxed">
                  Saya menyatakan bahwa spesifikasi ukuran seragam murid dan pilihan skema daftar ulang di atas telah diperiksa dengan benar dan disetujui oleh orang tua/wali murid baru Yayasan Pendidikan Imam Bonjol Majalengka.
                </span>
              </label>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setActiveStep(2)}
                className="px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold inline-flex items-center space-x-1.5 transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Kembali</span>
              </button>

              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting || !agreementChecked}
                className={`px-6 py-2.5 rounded-xl text-xs font-bold inline-flex items-center space-x-2 transition-all shadow-sm ${
                  isSubmitting || !agreementChecked
                    ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                    : 'bg-gradient-to-r from-[#184F48] to-[#2D7A70] hover:from-[#133f3a] hover:to-[#24635a] text-white cursor-pointer'
                }`}
              >
                {isSubmitting ? (
                  <span>Menyimpan Konfirmasi...</span>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-amber-300" />
                    <span>Konfirmasi &amp; Simpan Daftar Ulang</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: TANDA TERIMA & BUKTI KONFIRMASI */}
        {activeStep === 4 && (
          <div className="space-y-6">
            <div className="text-center max-w-xl mx-auto py-4">
              <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-3">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h2 className="text-xl font-extrabold text-slate-900">
                Pendaftaran Ulang &amp; Pemesanan Seragam Berhasil Terkonfirmasi!
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">
                Data spesifikasi seragam ananda <strong>{registration.studentName}</strong> telah diteruskan ke bagian logistik sekolah. Silakan simpan dan cetak bukti tanda terima resmi di bawah ini.
              </p>
            </div>

            {/* Receipt Summary Card */}
            <div className="bg-slate-50 rounded-2xl p-5 sm:p-6 border border-slate-200 space-y-4 max-w-2xl mx-auto">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Status Dokumen</span>
                  <div className="text-sm font-extrabold text-emerald-800 flex items-center space-x-1">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>TERKONFIRMASI RESMI</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Tanggal Konfirmasi</span>
                  <div className="text-xs font-bold text-slate-700">
                    {formatDateIndo(existing?.createdAt || new Date())}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="p-3 bg-white rounded-xl border border-slate-100">
                  <span className="text-slate-400 text-[10px] block">Ukuran Seragam</span>
                  <span className="font-extrabold text-base text-[#184F48]">{uniformSize}</span>
                </div>
                <div className="p-3 bg-white rounded-xl border border-slate-100">
                  <span className="text-slate-400 text-[10px] block">Tinggi / Berat</span>
                  <span className="font-bold text-slate-800">{heightCm} cm / {weightKg} kg</span>
                </div>
                <div className="p-3 bg-white rounded-xl border border-slate-100">
                  <span className="text-slate-400 text-[10px] block">Ukuran Sepatu</span>
                  <span className="font-bold text-slate-800">No. {shoeSize}</span>
                </div>
                <div className="p-3 bg-white rounded-xl border border-slate-100">
                  <span className="text-slate-400 text-[10px] block">Skema Bayar</span>
                  <span className="font-bold text-slate-800">{paymentPlan}</span>
                </div>
              </div>

              {notes && (
                <div className="p-3 bg-white rounded-xl border border-slate-100 text-xs">
                  <span className="text-slate-400 text-[10px] block font-bold">Catatan Penjahit:</span>
                  <span className="text-slate-700">{notes}</span>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowPrintProof(true)}
                  className="flex-1 py-3 rounded-xl bg-[#184F48] hover:bg-[#133f3a] text-white text-xs font-bold inline-flex items-center justify-center space-x-2 shadow-sm transition-all cursor-pointer"
                >
                  <Printer className="w-4 h-4 text-amber-300" />
                  <span>Cetak Tanda Terima Resmi A4</span>
                </button>

                <Link
                  href={`/portal/ppdb/${registration.registrationNo}`}
                  className="px-5 py-3 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold inline-flex items-center justify-center space-x-1 transition-colors"
                >
                  <span>Portal Murid</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => setActiveStep(1)}
                className="text-xs font-semibold text-[#2D7A70] hover:underline"
              >
                Ubah atau sesuaikan kembali ukuran seragam &rarr;
              </button>
            </div>
          </div>
        )}
      </div>

      {/* MODAL 1: SIZE CHART TABLE POPUP */}
      {showSizeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-[#D4EBE7]">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                <Ruler className="w-5 h-5 text-[#2D7A70]" />
                <h3 className="font-extrabold text-slate-900 text-base">Panduan Standar Ukuran Seragam Al-Afiyah</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowSizeModal(false)}
                className="text-slate-400 hover:text-slate-700 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <div className="overflow-x-auto my-4 text-xs">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-100 text-slate-700 font-extrabold">
                    <th className="p-2.5 border border-slate-200">Size</th>
                    <th className="p-2.5 border border-slate-200">Lebar Dada (LD)</th>
                    <th className="p-2.5 border border-slate-200">Panjang Baju (PB)</th>
                    <th className="p-2.5 border border-slate-200">Panjang Celana/Rok</th>
                    <th className="p-2.5 border border-slate-200">Kisaran Tinggi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-800 font-medium">
                  {SIZE_CHART.map((r) => (
                    <tr key={r.size} className={uniformSize === r.size ? 'bg-[#E8F3F1]/70 font-bold' : ''}>
                      <td className="p-2.5 border border-slate-200 font-extrabold text-[#184F48]">{r.size}</td>
                      <td className="p-2.5 border border-slate-200">{r.ld}</td>
                      <td className="p-2.5 border border-slate-200">{r.pb}</td>
                      <td className="p-2.5 border border-slate-200">{r.pc}</td>
                      <td className="p-2.5 border border-slate-200 text-slate-600">{r.reco}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <p className="text-[11px] text-slate-500 italic">
              * Tips Pengukuran: Untuk mengantisipasi pertumbuhan anak dalam 1 tahun pertama sekolah, kami merekomendasikan memilih 1 ukuran di atas ukuran pas saat ini.
            </p>

            <div className="mt-5 flex justify-end">
              <button
                type="button"
                onClick={() => setShowSizeModal(false)}
                className="px-5 py-2 rounded-xl bg-[#184F48] text-white text-xs font-bold"
              >
                Tutup Panduan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: PRINTABLE A4 TANDA TERIMA DAFTAR ULANG */}
      {showPrintProof && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs overflow-y-auto print:p-0 print:static print:bg-white">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-10 shadow-2xl border border-slate-200 relative my-8 print:border-none print:shadow-none print:p-0 print:m-0 print:max-w-none">
            {/* Screen Close & Print Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 print:hidden">
              <div className="flex items-center space-x-2">
                <Printer className="w-5 h-5 text-[#2D7A70]" />
                <span className="font-extrabold text-slate-900 text-sm">Pratinjau Tanda Terima Daftar Ulang A4</span>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-4 py-2 rounded-xl bg-[#184F48] hover:bg-[#133f3a] text-white text-xs font-bold inline-flex items-center space-x-1.5"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Cetak Dokumen</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowPrintProof(false)}
                  className="px-3 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-bold"
                >
                  Tutup
                </button>
              </div>
            </div>

            {/* A4 PRINT CONTENT */}
            <div className="pt-4 text-slate-900 font-sans text-xs">
              {/* Kop Surat */}
              <div className="flex items-center justify-between pb-3 border-b-2 border-slate-900">
                {registration.school.slug === 'smp' ? (
                  <div className="w-14 h-14 flex items-center justify-center shrink-0">
                    <img
                      src="/images/smp-logo.png"
                      alt="Logo SMP IT Al-Afiyah"
                      className="w-full h-full object-contain"
                    />
                  </div>
                ) : registration.school.slug === 'sd' ? (
                  <div className="w-14 h-14 flex items-center justify-center shrink-0">
                    <img
                      src="/images/sd-logo.png"
                      alt="Logo SDIT Al-Afiyah"
                      className="w-full h-full object-contain"
                    />
                  </div>
                ) : (
                  <div className="w-14 h-14 flex items-center justify-center shrink-0">
                    <img
                      src="/images/sd-logo.png"
                      alt="Logo Al-Afiyah"
                      className="w-full h-full object-contain"
                    />
                  </div>
                )}
                <div className="text-center flex-1 px-4">
                  <div className="font-bold text-[11px] tracking-wider uppercase text-slate-600">Yayasan Pendidikan Imam Bonjol Majalengka</div>
                  <div className="font-extrabold text-base tracking-tight uppercase text-slate-900">{registration.school.name}</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">
                    Jl. Gerakan Koperasi No. 110, Kecamatan Majalengka, Kabupaten Majalengka, Jawa Barat 45411 • Hotline: 0813-1013-9001
                  </div>
                </div>
                <div className="w-14 flex-shrink-0 text-center">
                  <QrCode className="w-12 h-12 text-slate-800 mx-auto" />
                  <span className="text-[8px] text-slate-400 font-mono">VERIFIED</span>
                </div>
              </div>

              {/* Document Title */}
              <div className="text-center my-4">
                <h3 className="font-extrabold text-sm uppercase tracking-wider underline">
                  TANDA TERIMA KONFIRMASI DAFTAR ULANG &amp; LOGISTIK SERAGAM
                </h3>
                <span className="text-[11px] text-slate-500">
                  Tahun Ajaran 2027/2028 • Nomor Berkas: TT-DU/{registration.registrationNo}
                </span>
              </div>

              {/* Student Biodata Table */}
              <table className="w-full border-collapse border border-slate-300 text-[11px] mb-4">
                <tbody>
                  <tr className="border-b border-slate-200">
                    <td className="p-2 bg-slate-50 font-bold w-1/3 border-r border-slate-200">Nomor Registrasi PPDB</td>
                    <td className="p-2 font-extrabold text-[#184F48]">{registration.registrationNo}</td>
                  </tr>
                  <tr className="border-b border-slate-200">
                    <td className="p-2 bg-slate-50 font-bold border-r border-slate-200">Nama Lengkap Murid</td>
                    <td className="p-2 font-bold">{registration.studentName}</td>
                  </tr>
                  <tr className="border-b border-slate-200">
                    <td className="p-2 bg-slate-50 font-bold border-r border-slate-200">Jenjang Pendidikan</td>
                    <td className="p-2">{registration.school.name} ({registration.school.badgeText})</td>
                  </tr>
                  <tr className="border-b border-slate-200">
                    <td className="p-2 bg-slate-50 font-bold border-r border-slate-200">Jenis Kelamin</td>
                    <td className="p-2">{registration.gender === 'L' ? 'Laki-laki (Ikhwan)' : 'Perempuan (Akhwat)'}</td>
                  </tr>
                  <tr>
                    <td className="p-2 bg-slate-50 font-bold border-r border-slate-200">Status Seleksi</td>
                    <td className="p-2 font-bold text-emerald-800">DITERIMA RESMI (LULUS SELEKSI GELOMBANG 1)</td>
                  </tr>
                </tbody>
              </table>

              {/* Sizing & Uniform Details Table */}
              <div className="font-bold text-xs mb-1">Rincian Spesifikasi Seragam &amp; Postur Tubuh:</div>
              <table className="w-full border-collapse border border-slate-300 text-[11px] mb-4">
                <tbody>
                  <tr className="border-b border-slate-200">
                    <td className="p-2 bg-slate-50 font-bold w-1/3 border-r border-slate-200">Ukuran Seragam Utama</td>
                    <td className="p-2 font-extrabold text-base text-[#184F48]">{uniformSize}</td>
                  </tr>
                  <tr className="border-b border-slate-200">
                    <td className="p-2 bg-slate-50 font-bold border-r border-slate-200">Model Paket Busana</td>
                    <td className="p-2">{uniformType}</td>
                  </tr>
                  <tr className="border-b border-slate-200">
                    <td className="p-2 bg-slate-50 font-bold border-r border-slate-200">Postur Fisik Murid</td>
                    <td className="p-2">Tinggi: {heightCm} cm • Berat: {weightKg} kg • Sepatu: No. {shoeSize}</td>
                  </tr>
                  <tr className="border-b border-slate-200">
                    <td className="p-2 bg-slate-50 font-bold border-r border-slate-200">Skema Pelunasan</td>
                    <td className="p-2 font-semibold">{paymentPlan}</td>
                  </tr>
                  {notes && (
                    <tr>
                      <td className="p-2 bg-slate-50 font-bold border-r border-slate-200">Catatan Khusus</td>
                      <td className="p-2 italic">{notes}</td>
                    </tr>
                  )}
                </tbody>
              </table>

              {/* Instructions */}
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-[10px] text-slate-600 leading-relaxed mb-6">
                <strong>Catatan Tata Usaha:</strong> Lembar tanda terima ini merupakan bukti sah pendaftaran ulang. Pengambilan paket seragam fisik dapat dilakukan pada tanggal <strong>20 - 25 Juni 2026</strong> di kantor Tata Usaha masing-masing unit dengan menunjukkan lembar ini.
              </div>

              {/* Signatures */}
              <div className="grid grid-cols-2 text-center text-xs mt-6 pt-4 border-t border-slate-200">
                <div>
                  <div className="text-[10px] text-slate-500">Orang Tua / Wali Murid,</div>
                  <div className="h-16 flex items-end justify-center font-bold">
                    ( .................................................. )
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-500">Petugas Tata Usaha &amp; Logistik,</div>
                  <div className="h-16 flex items-end justify-center font-bold text-[#184F48]">
                    Hj. Siti Aminah, S.Pd.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
