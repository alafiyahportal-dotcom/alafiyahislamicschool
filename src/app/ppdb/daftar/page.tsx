'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import confetti from 'canvas-confetti';
import { 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle2, 
  Upload, 
  CreditCard, 
  Tag, 
  ShieldCheck, 
  School as SchoolIcon, 
  User, 
  FileText, 
  Phone, 
  Loader2, 
  Check, 
  AlertCircle,
  ChevronDown,
  ChevronUp,
  FileCheck,
  Heart,
  Calendar,
  Users,
  Sparkles,
  Copy
} from 'lucide-react';
import { calculateAgePerJuly2027, SDIT_OFFICIAL_METADATA } from '@/types/sdit-form';
import { extractSubdomain, getSchoolUrl } from '@/lib/domain';

interface SchoolOption {
  slug: 'tk' | 'sd' | 'smp';
  name: string;
  badge: string;
  fee: number;
  color: string;
  accent: string;
  desc: string;
  isPpdbOpen?: boolean;
  waveName?: string;
  quota?: number;
  bankName?: string;
  bankAccountNumber?: string;
  bankAccountHolder?: string;
}

const SCHOOLS: SchoolOption[] = [
  {
    slug: 'tk',
    name: 'TK IT Al-Afiyah',
    badge: 'PAUD / TK IT',
    fee: 150000,
    color: 'border-emerald-500 bg-emerald-50/40 text-emerald-900',
    accent: '#10B981',
    desc: 'Sentra bermain bermakna, kemandirian anak, dan adab sejak usia dini.',
    waveName: 'Gelombang 1 (2027/2028)',
  },
  {
    slug: 'sd',
    name: 'SD IT Al-Afiyah',
    badge: 'SD IT UNGGULAN',
    fee: 250000,
    color: 'border-emerald-600 bg-emerald-50/40 text-emerald-900',
    accent: '#059669',
    desc: 'Kurikulum terpadu nasional & JSIT, tahfidz juz 30 mutqin, sains, dan pembinaan karakter.',
    waveName: 'Gelombang 1 (1 Okt - 30 Des 2026)',
  },
  {
    slug: 'smp',
    name: 'SMP IT Al-Afiyah',
    badge: 'SMP ISLAM TERPADU',
    fee: 200000,
    color: 'border-emerald-800 bg-emerald-50/40 text-emerald-900',
    accent: '#064E3B',
    desc: 'Tahfidz 3-5 juz, wawasan global, bilingual, sains modern & fullday school.',
    waveName: 'Gelombang 1 (1 Okt 2026 - 28 Feb 2027)',
    bankName: 'Bank Muamalat',
    bankAccountNumber: '1360012405',
    bankAccountHolder: 'SMP IT Al Afiyah',
  },
];

function PPDBFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const querySchool = searchParams.get('school') as 'tk' | 'sd' | 'smp' | null;
  const initialRef = searchParams.get('ref') || '';

  // Detect subdomain if on sd.localhost:3000, tk.localhost:3000, etc.
  const [subdomainSchool, setSubdomainSchool] = useState<'tk' | 'sd' | 'smp' | null>(null);

  const [autoDetectedRef, setAutoDetectedRef] = useState<string>('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const sub = extractSubdomain(window.location.host);
      if (sub) {
        setSubdomainSchool(sub);
      }

      // Check URL query param, Cookie, or localStorage for referral code
      let foundRef = initialRef || searchParams.get('referral') || '';

      if (!foundRef) {
        const match = document.cookie.match(/alafiyah_ref=([^;]+)/);
        if (match) {
          try {
            const parsed = JSON.parse(decodeURIComponent(match[1]));
            if (parsed.referralCode) {
              foundRef = parsed.referralCode;
            }
          } catch {}
        }
      }

      if (!foundRef) {
        try {
          const stored = localStorage.getItem('alafiyah_ref_code');
          if (stored) {
            foundRef = stored;
          }
        } catch {}
      }

      if (foundRef) {
        const cleanCode = foundRef.trim().toUpperCase();
        setAutoDetectedRef(cleanCode);
        setFormData((prev) => ({
          ...prev,
          referralCode: prev.referralCode || cleanCode,
        }));
      }
    }
  }, [initialRef, searchParams]);

  const lockedSchool = querySchool || subdomainSchool || null;
  const isUnitLocked = Boolean(lockedSchool);

  // Form Step (1 to 6)
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [copiedBankAcc, setCopiedBankAcc] = useState(false);

  // Detailed Form Accordion State (Bisa disusulkan atau diisi langsung)
  const [showDetailed28Poin, setShowDetailed28Poin] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    schoolSlug: querySchool || 'sd',
    admissionTrack: 'REGULER',
    referralCode: initialRef,

    // Step 2: Student (A. Keterangan Anak - Poin 1 s/d 17)
    studentName: '', // 1. Nama lengkap
    nik: '', // NIK Murid (16 Digit)
    nickname: '', // 2. Nama panggilan
    gender: 'L', // 3. Jenis kelamin
    pob: 'Majalengka', // 4. Tempat lahir
    dob: '2021-05-14', // 4. Tanggal lahir (Default min. 6 th per 1 Juli 2027)
    religion: 'Islam', // 5. Agama
    citizenship: 'WNI', // 6. Kewarganegaraan
    childOrder: '1', // 7. Anak ke
    siblingsCount: '2', // 8. Jml saudara kandung
    stepSiblingsCount: '0', // 9. Jml saudara tiri/angkat
    dailyLanguage: 'Bahasa Indonesia / Sunda', // 10. Bahasa sehari-hari
    heightCm: '', // 11. Tinggi badan
    weightKg: '', // 12. Berat badan
    diseaseHistory: 'Tidak ada riwayat penyakit berat', // 13. Riwayat penyakit
    bloodType: 'Belum Tahu', // 14. Golongan darah
    distanceToSchoolKm: '2', // 15. Jarak ke sekolah (km)
    livingWith: 'Keduanya', // 16. Tinggal dengan (Ayah / Ibu / Keduanya / Wali / Sendiri)
    address: '', // 17. Alamat lengkap
    studentPhone: '', // Telp / Hp

    // Step 3: Specific & Keterangan Lain-Lain (Poin 21 s/d 28)
    tkToiletReady: 'Sudah Mandiri',
    tkEatingReady: 'Makan Sendiri',
    sdIqroLevel: 'Jilid 3 - 4',
    sdReadingReady: 'Sudah Lancar Kata',
    smpTahfidzTarget: '3 Juz Mutqin',
    smpProgramChoice: 'REGULER',
    transportation: 'diantar', // 21. Berangkat sekolah: diantar / sendiri / jemputan
    admissionAs: 'Murid kelas 1', // 22. Masuk sekolah sebagai: Murid kelas 1 / pindahan
    originSchoolName: '', // 23. Asal TK/BA/RA/DA
    originSchoolAddress: '',
    originSchoolPhone: '',
    transferSchoolName: '', // 24. Pindahan SD/MI
    transferSchoolAddress: '',
    transferSchoolPhone: '',
    transferLeaveDate: '', // 25. Tgl meninggalkan sekolah
    otherNotes: '', // 26. Lain-lain yang perlu
    firstKnownSource: 'Media Sosial / Rekomendasi Saudara', // 27. Info pertama mengenal SDIT
    mainReason: 'Pembinaan Karakter Islami & Tahfidz Al-Qur\'an', // 28. Alasan utama masuk SDIT

    // Step 4: Parent (B. Keterangan Orang Tua / Wali - Poin 18 s/d 20)
    // 18. Ayah
    fatherName: '',
    fatherNik: '',
    fatherBirthYear: '1985',
    fatherEducation: 'S1',
    fatherJob: '',
    fatherCompany: '',
    fatherPosition: '',
    fatherOfficeAddress: '',
    fatherHomeAddress: '',
    fatherPhone: '',
    // 19. Ibu
    motherName: '',
    motherNik: '',
    motherBirthYear: '1988',
    motherEducation: 'S1',
    motherJob: '',
    motherCompany: '',
    motherPosition: '',
    motherOfficeAddress: '',
    motherHomeAddress: '',
    motherPhone: '', // WhatsApp Utama
    incomeRange: 'Rp 3.000.000 - Rp 5.000.000',
    // 20. Wali
    hasGuardian: false,
    guardianName: '',
    guardianBirthYear: '',
    guardianEducation: '',
    guardianJob: '',
    guardianCompany: '',
    guardianPosition: '',
    guardianOfficeAddress: '',
    guardianHomeAddress: '',
    guardianPhone: '',

    // Step 5: Docs
    kkUploaded: true,
    aktaUploaded: true,
    fotoUploaded: true,
  });

  // Real Uploaded Files State
  const [uploadedFiles, setUploadedFiles] = useState<{
    KK?: { fileName: string; fileUrl: string; size: number };
    AKTA?: { fileName: string; fileUrl: string; size: number };
    FOTO?: { fileName: string; fileUrl: string; size: number };
  }>({});
  const [uploadingDocType, setUploadingDocType] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Created Result & Payment State
  const [createdResult, setCreatedResult] = useState<{
    registrationNo: string;
    invoiceId: string;
    amount: number;
    schoolName: string;
  } | null>(null);
  const [selectedPayment, setSelectedPayment] = useState('QRIS');
  const [isPaying, setIsPaying] = useState(false);
  const [isPaid, setIsPaid] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, docType: 'KK' | 'AKTA' | 'FOTO') => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingDocType(docType);
    setUploadError(null);

    const body = new FormData();
    body.append('file', file);
    body.append('docType', docType);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body,
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setUploadedFiles((prev) => ({
          ...prev,
          [docType]: {
            fileName: data.fileName,
            fileUrl: data.fileUrl,
            size: data.fileSize,
          },
        }));
      } else {
        setUploadError(data.error || 'Gagal mengunggah berkas');
      }
    } catch {
      setUploadError('Terjadi gangguan jaringan saat mengunggah berkas');
    } finally {
      setUploadingDocType(null);
    }
  };

  // Synchronize schoolSlug when lockedSchool is detected
  useEffect(() => {
    if (lockedSchool) {
      setFormData((prev) => ({ ...prev, schoolSlug: lockedSchool }));
    }
  }, [lockedSchool]);

  // Dynamic browser tab title & favicon based on selected school
  useEffect(() => {
    if (typeof document !== 'undefined') {
      const activeSchoolName =
        formData.schoolSlug === 'sd'
          ? 'SD IT Al-Afiyah'
          : formData.schoolSlug === 'smp'
          ? 'SMP IT Al-Afiyah'
          : formData.schoolSlug === 'tk'
          ? 'TK IT Al-Afiyah'
          : 'Sekolah IT Al-Afiyah';
      document.title = `Formulir Pendaftaran Murid Baru (${activeSchoolName}) | PPDB T.A. 2027/2028`;

      if (formData.schoolSlug === 'sd') {
        let link: HTMLLinkElement | null = document.querySelector("link[rel*='icon']");
        if (!link) {
          link = document.createElement('link');
          link.rel = 'icon';
          document.getElementsByTagName('head')[0].appendChild(link);
        }
        link.type = 'image/png';
        link.href = '/images/sd-logo.png';
      }
    }
  }, [formData.schoolSlug]);

  // Load from local storage draft
  useEffect(() => {
    const saved = localStorage.getItem('alafiyah_ppdb_draft');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setFormData((prev) => ({
          ...prev,
          ...parsed,
          referralCode: prev.referralCode || parsed.referralCode || autoDetectedRef || initialRef || '',
          ...(lockedSchool ? { schoolSlug: lockedSchool } : {}),
        }));
      } catch {
        // ignore
      }
    }
  }, [lockedSchool, autoDetectedRef, initialRef]);

  // Save to local storage on change
  useEffect(() => {
    localStorage.setItem('alafiyah_ppdb_draft', JSON.stringify(formData));
  }, [formData]);

  const [schoolsList, setSchoolsList] = useState<SchoolOption[]>(SCHOOLS);

  // Load dynamic settings (fees, waves, open/closed status) from central database
  useEffect(() => {
    async function loadDynamicSchoolSettings() {
      try {
        const res = await fetch('/api/admin/settings');
        const data = await res.json();
        if (data.success && Array.isArray(data.schools)) {
          setSchoolsList((prev) =>
            prev.map((s) => {
              const matched = data.schools.find(
                (sch: {
                  slug: string;
                  name: string;
                  registrationFee: number;
                  badgeText?: string;
                  isPpdbOpen: boolean;
                  waveName: string;
                  quota: number;
                }) => sch.slug === s.slug
              );
              if (matched) {
                return {
                  ...s,
                  name: matched.name,
                  fee: matched.registrationFee,
                  badge: matched.badgeText || s.badge,
                  isPpdbOpen: matched.isPpdbOpen,
                  waveName: matched.waveName,
                  quota: matched.quota,
                };
              }
              return s;
            })
          );
        }
      } catch {
        // use fallback static SCHOOLS
      }
    }
    loadDynamicSchoolSettings();
  }, []);

  const activeSchool = schoolsList.find((s) => s.slug === formData.schoolSlug) || schoolsList[1];

  const updateField = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };



  // Helper: Buat NIK Sementara jika belum hafal NIK 16 digit anak
  const handleGenerateTempNik = () => {
    const randomSuffix = Math.floor(1000000000 + Math.random() * 9000000000);
    const tempNik = `321026${randomSuffix}`;
    updateField('nik', tempNik);
    setErrorMessage('');
  };

  // Helper: Lewati Berkas & Lanjutkan (Bisa disusulkan via Portal Murid)
  const handleSkipDocumentsAndSubmit = () => {
    handleSubmitRegistration(true);
  };

  const handleNextStep = () => {
    setErrorMessage('');
    if (currentStep === 1) {
      if (activeSchool.isPpdbOpen === false) {
        setErrorMessage(
          `Mohon maaf, pendaftaran murid baru untuk ${activeSchool.name} saat ini sedang ditutup atau kuota telah terpenuhi.`
        );
        return;
      }
    }
    if (currentStep === 2) {
      if (!formData.studentName.trim()) {
        setErrorMessage('Nama lengkap calon murid wajib diisi.');
        return;
      }
      // Jika NIK belum diisi, otomatis buatkan NIK sementara agar tidak ribet
      if (!formData.nik.trim()) {
        const randomSuffix = Math.floor(1000000000 + Math.random() * 9000000000);
        formData.nik = `321026${randomSuffix}`;
      }
    }
    if (currentStep === 4) {
      if (!formData.fatherName.trim() && !formData.motherName.trim()) {
        setErrorMessage('Mohon isi nama orang tua / wali murid.');
        return;
      }
      if (!formData.motherPhone.trim()) {
        setErrorMessage('Nomor WhatsApp aktif orang tua wajib diisi untuk menerima bukti pendaftaran resmi.');
        return;
      }
    }
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
    } else if (currentStep === 5) {
      // Submit registration to API
      handleSubmitRegistration(false);
    }
  };

  const handleSubmitRegistration = async (isSkippingDocs: boolean = false) => {
    setIsLoading(true);
    setErrorMessage('');

    const docsPayload = [
      {
        docType: 'KK',
        fileName: uploadedFiles.KK?.fileName || (isSkippingDocs ? 'Disusulkan via Portal Murid (KK)' : 'Kartu_Keluarga.pdf'),
        fileUrl: uploadedFiles.KK?.fileUrl || '/uploads/sample.pdf',
      },
      {
        docType: 'AKTA',
        fileName: uploadedFiles.AKTA?.fileName || (isSkippingDocs ? 'Disusulkan via Portal Murid (Akta)' : 'Akta_Kelahiran.pdf'),
        fileUrl: uploadedFiles.AKTA?.fileUrl || '/uploads/sample.pdf',
      },
      {
        docType: 'FOTO',
        fileName: uploadedFiles.FOTO?.fileName || (isSkippingDocs ? 'Disusulkan via Portal Murid (Foto)' : 'Pas_Foto_3x4.jpg'),
        fileUrl: uploadedFiles.FOTO?.fileUrl || '/uploads/sample.pdf',
      },
    ];

    try {
      const res = await fetch('/api/ppdb/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          schoolSlug: formData.schoolSlug,
          studentName: formData.studentName,
          nik: formData.nik,
          gender: formData.gender,
          pob: formData.pob,
          dob: formData.dob,
          address: formData.address,
          schoolSpecificData: {
            toilet: formData.tkToiletReady,
            eating: formData.tkEatingReady,
            iqro: formData.sdIqroLevel,
            reading: formData.sdReadingReady,
            tahfidz: formData.smpTahfidzTarget,
            program: formData.smpProgramChoice,
            track: formData.admissionTrack,
            // 28 Poin SDIT
            nickname: formData.nickname,
            religion: formData.religion,
            citizenship: formData.citizenship,
            childOrder: formData.childOrder,
            siblingsCount: formData.siblingsCount,
            stepSiblingsCount: formData.stepSiblingsCount,
            dailyLanguage: formData.dailyLanguage,
            heightCm: formData.heightCm,
            weightKg: formData.weightKg,
            diseaseHistory: formData.diseaseHistory,
            bloodType: formData.bloodType,
            distanceToSchoolKm: formData.distanceToSchoolKm,
            livingWith: formData.livingWith,
            transportation: formData.transportation,
            admissionAs: formData.admissionAs,
            originSchoolName: formData.originSchoolName,
            originSchoolAddress: formData.originSchoolAddress,
            originSchoolPhone: formData.originSchoolPhone,
            transferSchoolName: formData.transferSchoolName,
            transferSchoolAddress: formData.transferSchoolAddress,
            transferSchoolPhone: formData.transferSchoolPhone,
            transferLeaveDate: formData.transferLeaveDate,
            otherNotes: formData.otherNotes,
            firstKnownSource: formData.firstKnownSource,
            mainReason: formData.mainReason,
          },
          parentData: {
            // Ayah
            fatherName: formData.fatherName,
            fatherNik: formData.fatherNik,
            fatherBirthYear: formData.fatherBirthYear,
            fatherEducation: formData.fatherEducation,
            fatherJob: formData.fatherJob,
            fatherCompany: formData.fatherCompany,
            fatherPosition: formData.fatherPosition,
            fatherOfficeAddress: formData.fatherOfficeAddress,
            fatherHomeAddress: formData.fatherHomeAddress,
            fatherPhone: formData.fatherPhone,
            // Ibu
            motherName: formData.motherName,
            motherNik: formData.motherNik,
            motherBirthYear: formData.motherBirthYear,
            motherEducation: formData.motherEducation,
            motherJob: formData.motherJob,
            motherCompany: formData.motherCompany,
            motherPosition: formData.motherPosition,
            motherOfficeAddress: formData.motherOfficeAddress,
            motherHomeAddress: formData.motherHomeAddress,
            motherPhone: formData.motherPhone,
            phone: formData.motherPhone,
            // Wali
            hasGuardian: formData.hasGuardian ? 'true' : 'false',
            guardianName: formData.guardianName,
            guardianBirthYear: formData.guardianBirthYear,
            guardianEducation: formData.guardianEducation,
            guardianJob: formData.guardianJob,
            guardianCompany: formData.guardianCompany,
            guardianPosition: formData.guardianPosition,
            guardianOfficeAddress: formData.guardianOfficeAddress,
            guardianHomeAddress: formData.guardianHomeAddress,
            guardianPhone: formData.guardianPhone,
            income: formData.incomeRange,
            incomeRange: formData.incomeRange,
          },
          referralCode: formData.referralCode,
          uploadedDocs: docsPayload,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setErrorMessage(data.error || 'Gagal mengirimkan formulir pendaftaran');
        setIsLoading(false);
        return;
      }

      setCreatedResult({
        registrationNo: data.registration.registrationNo,
        invoiceId: data.invoice.id,
        amount: data.invoice.amount,
        schoolName: activeSchool.name,
      });

      setCurrentStep(6);
      setIsLoading(false);
    } catch {
      setErrorMessage('Terjadi gangguan koneksi internet');
      setIsLoading(false);
    }
  };

  const handleSimulatePayment = async () => {
    if (!createdResult?.invoiceId) return;
    setIsPaying(true);

    try {
      const res = await fetch('/api/payments/simulate-success', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          invoiceId: createdResult.invoiceId,
          paymentMethod: selectedPayment === 'QRIS' ? 'MIDTRANS_QRIS' : 'MIDTRANS_VA',
        }),
      });

      if (!res.ok) throw new Error('Simulasi gagal');

      setIsPaid(true);
      setIsSuccess(true);
      setIsPaying(false);

      // Trigger Confetti
      confetti({
        particleCount: 120,
        spread: 70,
        origin: { y: 0.6 },
      });

      // Clear draft
      localStorage.removeItem('alafiyah_ppdb_draft');
    } catch {
      alert('Simulasi pembayaran gagal diproses');
      setIsPaying(false);
    }
  };

  return (
    <div className="min-h-screen soft-mesh-bg flex flex-col justify-between py-6 px-4 sm:px-6 lg:px-8">
      {/* Top Header - Clean Navigation (No Duplication) */}
      <header className="max-w-4xl mx-auto w-full flex flex-col sm:flex-row items-center justify-between pb-4 border-b border-slate-200/80 gap-3">
        <Link
          href={
            activeSchool.slug === 'sd'
              ? getSchoolUrl('sd')
              : activeSchool.slug === 'tk'
              ? getSchoolUrl('tk')
              : activeSchool.slug === 'smp'
              ? getSchoolUrl('smp')
              : getSchoolUrl('foundation')
          }
          className="flex items-center space-x-3 group"
        >
          {activeSchool.slug === 'sd' ? (
            <img
              src="/images/sd-logo.png"
              alt="Logo SD IT Al-Afiyah"
              className="w-10 h-10 object-contain shrink-0 group-hover:scale-105 transition-transform duration-200"
            />
          ) : (
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-extrabold text-base shadow-xs border border-white/20 group-hover:scale-105 transition-transform duration-200"
              style={{ backgroundColor: activeSchool.accent || '#064E3B' }}
            >
              {activeSchool.slug.toUpperCase()}
            </div>
          )}
          <div>
            <span className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-[#064E3B] transition-colors block">
              {activeSchool.name} Majalengka
            </span>
            <p className="text-[11px] text-slate-500 font-medium">
              Portal Pendaftaran Resmi (PPDB) T.A. 2027/2028
            </p>
          </div>
        </Link>
        <div className="flex items-center gap-2">
          <Link
            href={
              activeSchool.slug === 'sd'
                ? getSchoolUrl('sd')
                : activeSchool.slug === 'tk'
                ? getSchoolUrl('tk')
                : activeSchool.slug === 'smp'
                ? getSchoolUrl('smp')
                : getSchoolUrl('foundation')
            }
            className="text-xs font-semibold text-slate-700 hover:text-[#064E3B] bg-white hover:bg-slate-50 border border-slate-200 px-3.5 py-2 rounded-xl transition-all shadow-2xs flex items-center gap-1.5"
          >
            <span>&larr; Beranda Sekolah</span>
          </Link>
        </div>
      </header>

      {/* Main Multi-Step Card */}
      <div className="max-w-4xl mx-auto w-full my-auto py-6">
        {/* Official School Hero Banner Card (Solid Single Forest Emerald Color - No Gradient, No Duplication) */}
        <div className="rounded-3xl bg-[#064E3B] text-white p-6 sm:p-7 shadow-md border border-emerald-900/60 mb-6">
          {/* Top Row: Official Badges */}
          <div className="flex items-center gap-2 flex-wrap mb-3.5">
            <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-white/15 text-emerald-100 border border-white/20">
              {activeSchool.slug === 'sd' ? 'Formulir 28 Butir Lengkap' : 'Formulir Resmi PPDB'}
            </span>
            <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-white/10 text-emerald-200 border border-white/15">
              {(activeSchool.waveName || 'Gelombang 1').replace(/\(Biaya.*?\)/i, '').trim()} • Biaya Rp {activeSchool.fee.toLocaleString('id-ID')}
            </span>
            {activeSchool.slug === 'sd' && (
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-black/25 text-emerald-200 border border-white/10 hidden sm:inline-block">
                NPSN: 69900910
              </span>
            )}
          </div>

          {/* Middle Row: Title + Consultation CTA */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/15">
            <div className="flex items-center gap-3">
              {activeSchool.slug === 'sd' && (
                <img
                  src="/images/sd-logo.png"
                  alt="Logo SD IT Al-Afiyah"
                  className="w-13 h-13 object-contain shrink-0 drop-shadow-sm hidden sm:block"
                />
              )}
              <div>
                <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white leading-tight">
                  Pendaftaran Murid Baru {activeSchool.name}
                </h1>
                <p className="text-xs text-emerald-100/90 font-medium mt-1">
                  Jalur {formData.admissionTrack} • Tahun Pelajaran 2027/2028
                </p>
              </div>
            </div>

            {/* Right side WhatsApp Consultation link */}
            <div className="flex items-center gap-2 shrink-0">
              <a
                href={`https://wa.me/6281234567890?text=${encodeURIComponent(
                  `Assalamu'alaikum Panitia PPDB ${activeSchool.name}, saya ingin konsultasi seputar pendaftaran murid baru.`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/15 hover:bg-white/25 border border-white/25 text-white text-xs font-bold transition-all tactile-press shadow-2xs cursor-pointer"
              >
                <Phone className="w-3.5 h-3.5 text-emerald-200" />
                <span>Bantuan Panitia PPDB</span>
              </a>
            </div>
          </div>

          {/* Bottom Guidance Note */}
          <div className="pt-3.5 flex items-start gap-2 text-xs text-emerald-100/90 leading-relaxed">
            <ShieldCheck className="w-4 h-4 text-emerald-200 shrink-0 mt-0.5" />
            <p>
              {activeSchool.slug === 'sd' ? (
                <>
                  Pendaftaran awal cukup melengkapi data pokok calon murid dan kontak WhatsApp orang tua. Seluruh <strong>28 butir rincian formulir fisik &amp; berkas administrasi</strong> (KK, Akta, Pas Foto 3x4) <strong>dapat disusulkan</strong> via Portal Murid setelah pengisian ini.
                </>
              ) : (
                `Pendaftaran awal cukup melengkapi biodata pokok calon murid dan kontak WhatsApp orang tua. Berkas administrasi dapat disusulkan kemudian.`
              )}
            </p>
          </div>
        </div>

        {/* Minimalist Progress Stepper (With Emerald Accent) */}
        <div className="bg-white rounded-2xl p-3.5 sm:p-4 border border-emerald-950/10 border-t-2 border-t-[#064E3B] shadow-2xs mb-6">
          {/* Top Row: Current Step Title & Percentage */}
          <div className="flex items-center justify-between gap-3 mb-2.5">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-md bg-[#064E3B] text-white font-extrabold text-[11px] tracking-wide shadow-2xs">
                Langkah {currentStep} dari 6
              </span>
              <span className="text-xs sm:text-sm font-bold text-slate-900">
                {currentStep === 1 && 'Pilihan Jalur Masuk'}
                {currentStep === 2 && 'Biodata Calon Murid'}
                {currentStep === 3 && 'Kesiapan & Formulir Tambahan'}
                {currentStep === 4 && 'Data Orang Tua / Wali'}
                {currentStep === 5 && 'Unggah Berkas Persyaratan'}
                {currentStep === 6 && 'Konfirmasi & Pembayaran'}
              </span>
            </div>
            <span className="text-xs font-bold text-emerald-800 font-mono">
              {Math.round((currentStep / 6) * 100)}%
            </span>
          </div>

          {/* 6-Segment Slim Progress Bar */}
          <div
            className="w-full gap-1.5 sm:gap-2"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(6, minmax(0, 1fr))',
            }}
          >
            {[
              { num: 1, label: 'Jalur', short: 'Jalur' },
              { num: 2, label: 'Biodata', short: 'Murid' },
              { num: 3, label: 'Kesiapan', short: 'Siap' },
              { num: 4, label: 'Orang Tua', short: 'Ortu' },
              { num: 5, label: 'Berkas', short: 'Berkas' },
              { num: 6, label: 'Selesai', short: 'Bayar' },
            ].map((step) => {
              const isCompleted = currentStep > step.num;
              const isActive = currentStep === step.num;
              return (
                <button
                  key={step.num}
                  type="button"
                  disabled={!isCompleted}
                  onClick={() => isCompleted && setCurrentStep(step.num)}
                  className={`group flex flex-col gap-1 text-left transition-all ${
                    isCompleted ? 'cursor-pointer' : 'cursor-default'
                  }`}
                  title={isCompleted ? `Kembali ke langkah ${step.num}` : undefined}
                >
                  {/* Segment Bar Line */}
                  <div
                    className={`h-1.5 sm:h-2 rounded-full transition-all duration-300 w-full ${
                      isCompleted
                        ? 'bg-emerald-600 group-hover:bg-emerald-700'
                        : isActive
                        ? 'bg-[#064E3B] ring-2 ring-emerald-200/80'
                        : 'bg-slate-100'
                    }`}
                  />
                  {/* Step Label */}
                  <div className="flex items-center justify-between pt-0.5">
                    <span
                      className={`text-[10px] truncate transition-colors ${
                        isActive
                          ? 'text-[#064E3B] font-extrabold'
                          : isCompleted
                          ? 'text-slate-600 font-semibold group-hover:text-emerald-800'
                          : 'text-slate-400 font-normal'
                      }`}
                    >
                      <span className="sm:hidden">{step.short}</span>
                      <span className="hidden sm:inline">{step.label}</span>
                    </span>
                    {isCompleted && (
                      <Check className="w-2.5 h-2.5 text-emerald-600 hidden sm:block shrink-0" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Card Body */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/90 shadow-sm">
          {errorMessage && (
            <div className="mb-6 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs font-semibold text-rose-700 flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* STEP 1: Unit & Jalur */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div>
                <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">Langkah 1 dari 6</span>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
                  Pilihan Jalur Pendaftaran
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Silakan tentukan jalur masuk yang sesuai untuk ananda.
                </p>
              </div>

              {/* Notice if selected school is closed */}
              {activeSchool.isPpdbOpen === false && (
                <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-3">
                  <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold">Pendaftaran {activeSchool.name} Sedang Ditutup</p>
                    <p className="mt-0.5 text-amber-800 leading-relaxed">
                      Kuota penerimaan murid baru saat ini sedang ditutup atau telah mencapai kapasitas maksimal ({activeSchool.quota || 60} murid). Hubungi panitia PPDB melalui WhatsApp resmi sekolah untuk informasi pembukaan gelombang berikutnya.
                    </p>
                  </div>
                </div>
              )}

              {/* Notice for SMP IT Gelombang 1 Discounts */}
              {activeSchool.slug === 'smp' && (
                <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-300 text-xs space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-emerald-950 flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-amber-600" />
                      <span>SPMB SMP IT Gelombang 1 Sedang Dibuka</span>
                    </span>
                    <span className="text-[10px] bg-emerald-700 text-white font-bold px-2.5 py-0.5 rounded-full shadow-2xs">
                      1 Okt 2026 &ndash; 28 Feb 2027
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 text-[11px]">
                    <div className="p-2.5 rounded-xl bg-white/90 border border-emerald-200">
                      <strong className="text-emerald-950 block font-bold">Diskon 70% Uang Bangunan</strong>
                      <span className="text-emerald-800">Khusus untuk siswa lulusan SDIT AL Afiyah</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-white/90 border border-amber-200">
                      <strong className="text-amber-950 block font-bold">Diskon 50% Uang Bangunan</strong>
                      <span className="text-amber-800">Untuk siswa pendaftar dari luar SDIT</span>
                    </div>
                  </div>
                  <p className="text-[10px] text-slate-500 italic pt-1 border-t border-emerald-200/60">
                    *Keringanan uang bangunan berlaku pada masa penerimaan Gelombang 1. Gelombang 2 (1 Mar &ndash; 30 Jun 2027) berlaku biaya normal.
                  </p>
                </div>
              )}

              {/* Admission Track */}
              <div className="pt-2">
                <label className="block text-xs font-bold text-slate-700 mb-2">Pilihan Jalur Pendaftaran</label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {['REGULER', 'TAHFIDZ PRESTASI', 'BEASISWA DHUAFA'].map((track) => (
                    <button
                      key={track}
                      type="button"
                      onClick={() => updateField('admissionTrack', track)}
                      className={`py-3 px-4 rounded-xl text-xs font-bold border transition-all text-center ${
                        formData.admissionTrack === track
                          ? 'border-emerald-600 bg-emerald-50 text-emerald-800'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {track}
                    </button>
                  ))}
                </div>
              </div>

              {/* Optional Referral Code */}
              <div className="pt-2">
                <label className="block text-xs font-bold text-slate-700 mb-2">
                  Kode Rujukan / Referral Mitra Afiliasi (Opsional)
                </label>
                <div className="relative max-w-sm">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Tag className="w-4 h-4 text-amber-500" />
                  </div>
                  <input
                    type="text"
                    value={formData.referralCode}
                    onChange={(e) => updateField('referralCode', e.target.value.toUpperCase())}
                    placeholder="Contoh: MITRA-AHMAD"
                    className="w-full pl-10 pr-4 py-3 text-xs sm:text-sm uppercase font-mono bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-600/20 focus:border-[#064E3B] focus:bg-white transition-all shadow-2xs text-slate-900 font-semibold"
                  />
                </div>
                {formData.referralCode && (
                  <p className="mt-2.5 text-[11px] text-emerald-900 font-bold flex items-center gap-1.5 bg-emerald-50 border border-emerald-300 px-3.5 py-2 rounded-xl max-w-sm shadow-2xs">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>
                      {autoDetectedRef && formData.referralCode === autoDetectedRef
                        ? '✨ Terpasang Otomatis dari Link Mitra Afiliasi: '
                        : 'Rujukan Terverifikasi: '}
                      <strong className="font-mono text-emerald-950 underline decoration-emerald-400">{formData.referralCode}</strong>
                    </span>
                  </p>
                )}
              </div>
            </div>
          )}

          {/* STEP 2: Biodata Calon Murid */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="border-b border-slate-100 pb-4">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black tracking-widest text-emerald-800 uppercase px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200">
                    Langkah 2 dari 6
                  </span>
                  <span className="text-xs text-slate-400 font-medium">• Identitas Calon Siswa</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-1.5">
                  Biodata Calon Murid
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Pastikan ejaan nama dan tanggal lahir sesuai dengan Akta Kelahiran dan Kartu Keluarga (KK).
                </p>
              </div>

              {/* Section Header Card: IDENTITAS CALON MURID */}
              <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
                <div className="w-8 h-8 rounded-xl bg-[#064E3B] text-white flex items-center justify-center shadow-xs shrink-0">
                  <User className="w-4 h-4 text-emerald-200" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900 tracking-tight">
                    Identitas Pokok Calon Murid
                  </h3>
                  <p className="text-[11px] text-slate-500 font-medium">
                    Pastikan data sesuai dengan Kartu Keluarga (KK) dan Akta Kelahiran
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 lg:gap-x-12 gap-y-7 pt-2" style={{ columnGap: '2.5rem', rowGap: '1.75rem' }}>
                <div className={`min-w-0 ${formData.schoolSlug === 'sd' ? 'md:col-span-1' : 'md:col-span-2'}`}>
                  <label className="flex items-center gap-2 text-xs font-bold text-slate-800 mb-2">
                    <span className="inline-flex items-center justify-center px-2 py-0.5 rounded-md bg-[#064E3B] text-emerald-100 font-mono text-[10px] font-extrabold tracking-wide shrink-0 shadow-2xs">
                      Poin 01
                    </span>
                    <span className="truncate">Nama Lengkap Calon Murid</span>
                    <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.studentName}
                    onChange={(e) => updateField('studentName', e.target.value)}
                    placeholder="Contoh: Muhammad Rayyan Al-Ghifari"
                    className="w-full px-4 py-3 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-600/20 focus:border-[#064E3B] focus:bg-white transition-all shadow-2xs text-slate-900 font-semibold"
                  />
                  <span className="text-[11px] text-slate-400 mt-1.5 block">Sesuai Akta Kelahiran</span>
                </div>

                {formData.schoolSlug === 'sd' && (
                  <div className="min-w-0">
                    <label className="flex items-center gap-2 text-xs font-bold text-slate-800 mb-2">
                      <span className="inline-flex items-center justify-center px-2 py-0.5 rounded-md bg-[#064E3B] text-emerald-100 font-mono text-[10px] font-extrabold tracking-wide shrink-0 shadow-2xs">
                        Poin 02
                      </span>
                      <span className="truncate">Nama Panggilan Akrab (Opsional)</span>
                    </label>
                    <input
                      type="text"
                      value={formData.nickname}
                      onChange={(e) => updateField('nickname', e.target.value)}
                      placeholder="Contoh: Rayyan"
                      className="w-full px-4 py-3 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-600/20 focus:border-[#064E3B] focus:bg-white transition-all shadow-2xs text-slate-900"
                    />
                    <span className="text-[11px] text-slate-400 mt-1.5 block">Nama panggilan di rumah atau sekolah</span>
                  </div>
                )}

                <div className="min-w-0">
                  <label className="flex items-center gap-2 text-xs font-bold text-slate-800 mb-2">
                    <span className="inline-flex items-center justify-center px-2 py-0.5 rounded-md bg-[#064E3B] text-emerald-100 font-mono text-[10px] font-extrabold tracking-wide shrink-0 shadow-2xs">
                      NIK
                    </span>
                    <span className="truncate">NIK Calon Murid (16 Digit)</span>
                    <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={16}
                    value={formData.nik}
                    onChange={(e) => updateField('nik', e.target.value)}
                    placeholder="3210xxxxxxxxxxxx"
                    className="w-full px-4 py-3 text-xs sm:text-sm font-mono bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-600/20 focus:border-[#064E3B] focus:bg-white transition-all shadow-2xs text-slate-900 font-semibold"
                  />
                  <div className="flex items-center gap-2 mt-2 flex-wrap">
                    <span className="text-[11px] text-slate-400">
                      *Bisa gunakan NIK sementara.
                    </span>
                    <button
                      type="button"
                      onClick={handleGenerateTempNik}
                      className="text-[11px] text-emerald-800 hover:text-emerald-950 font-bold underline cursor-pointer"
                    >
                      Belum Hafal NIK? Buat Otomatis
                    </button>
                  </div>
                </div>

                <div className="min-w-0">
                  <label className="flex items-center gap-2 text-xs font-bold text-slate-800 mb-2">
                    <span className="inline-flex items-center justify-center px-2 py-0.5 rounded-md bg-[#064E3B] text-emerald-100 font-mono text-[10px] font-extrabold tracking-wide shrink-0 shadow-2xs">
                      Poin 03
                    </span>
                    <span className="truncate">Jenis Kelamin</span>
                    <span className="text-rose-500">*</span>
                  </label>
                  <div className="grid grid-cols-2 gap-3.5">
                    <button
                      type="button"
                      onClick={() => updateField('gender', 'L')}
                      className={`py-3 px-3 rounded-xl text-xs sm:text-sm font-bold border transition-all flex items-center justify-center gap-2 cursor-pointer shadow-2xs ${
                        formData.gender === 'L'
                          ? 'border-[#064E3B] bg-emerald-50 text-[#064E3B] ring-2 ring-[#064E3B]/20 font-extrabold'
                          : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-white'
                      }`}
                    >
                      <User className="w-4 h-4 text-emerald-700" />
                      <span>Laki-Laki</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => updateField('gender', 'P')}
                      className={`py-3 px-3 rounded-xl text-xs sm:text-sm font-bold border transition-all flex items-center justify-center gap-2 cursor-pointer shadow-2xs ${
                        formData.gender === 'P'
                          ? 'border-[#064E3B] bg-emerald-50 text-[#064E3B] ring-2 ring-[#064E3B]/20 font-extrabold'
                          : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-white'
                      }`}
                    >
                      <User className="w-4 h-4 text-rose-600" />
                      <span>Perempuan</span>
                    </button>
                  </div>
                  <span className="text-[11px] text-slate-400 mt-2 block">
                    Pilih jenis kelamin sesuai data KK
                  </span>
                </div>

                <div className="min-w-0">
                  <label className="flex items-center gap-2 text-xs font-bold text-slate-800 mb-2">
                    <span className="inline-flex items-center justify-center px-2 py-0.5 rounded-md bg-[#064E3B] text-emerald-100 font-mono text-[10px] font-extrabold tracking-wide shrink-0 shadow-2xs">
                      Poin 04
                    </span>
                    <span className="truncate">Tempat Lahir</span>
                    <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.pob}
                    onChange={(e) => updateField('pob', e.target.value)}
                    placeholder="Contoh: Majalengka"
                    className="w-full px-4 py-3 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-600/20 focus:border-[#064E3B] focus:bg-white transition-all shadow-2xs text-slate-900 font-semibold"
                  />
                  <span className="text-[11px] text-slate-400 mt-1.5 block">Kota / Kabupaten kelahiran</span>
                </div>

                <div className="min-w-0">
                  <label className="flex items-center gap-2 text-xs font-bold text-slate-800 mb-2">
                    <span className="inline-flex items-center justify-center px-2 py-0.5 rounded-md bg-[#064E3B] text-emerald-100 font-mono text-[10px] font-extrabold tracking-wide shrink-0 shadow-2xs">
                      Poin 05
                    </span>
                    <span className="truncate">Tanggal Lahir</span>
                    <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={formData.dob}
                    onChange={(e) => updateField('dob', e.target.value)}
                    className="w-full px-4 py-3 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-600/20 focus:border-[#064E3B] focus:bg-white transition-all shadow-2xs text-slate-900 font-semibold"
                  />
                  <span className="text-[11px] text-slate-400 mt-1.5 block">Sesuai Akta Kelahiran</span>
                </div>

                {formData.schoolSlug === 'sd' && (() => {
                  const age = calculateAgePerJuly2027(formData.dob);
                  return (
                    <div className="md:col-span-2 p-5 sm:p-6 rounded-2xl bg-emerald-50/70 border border-emerald-200/90 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-3.5">
                        <div className="w-10 h-10 rounded-xl bg-[#064E3B] text-white flex items-center justify-center shrink-0 shadow-xs">
                          <Calendar className="w-5 h-5 text-emerald-200" />
                        </div>
                        <div>
                          <p className="text-[11px] font-bold text-emerald-800 uppercase tracking-wide">
                            Kalkulasi Usia per 1 Juli 2027 (Tahun Ajaran Baru):
                          </p>
                          <p className="text-base sm:text-lg font-black text-slate-900 mt-0.5">
                            {age.text}
                          </p>
                        </div>
                      </div>
                      <div>
                        <span
                          className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold shadow-2xs ${
                            age.isEligible
                              ? 'bg-[#064E3B] text-white'
                              : 'bg-amber-600 text-white'
                          }`}
                        >
                          {age.isEligible ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-300" />
                              <span>✓ Memenuhi Syarat (Min. 6 Th)</span>
                            </>
                          ) : (
                            <>
                              <AlertCircle className="w-3.5 h-3.5 text-amber-200" />
                              <span>Perlu Observasi (Di Bawah 6 Th)</span>
                            </>
                          )}
                        </span>
                      </div>
                    </div>
                  );
                })()}

                {formData.schoolSlug === 'sd' && (
                  <>
                    <div className="min-w-0">
                      <label className="flex items-center gap-2 text-xs font-bold text-slate-800 mb-2">
                        <span className="inline-flex items-center justify-center px-2 py-0.5 rounded-md bg-[#064E3B] text-emerald-100 font-mono text-[10px] font-extrabold tracking-wide shrink-0 shadow-2xs">
                          Poin 07
                        </span>
                        <span className="truncate">Anak ke-</span>
                        <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="number"
                        min={1}
                        max={15}
                        value={formData.childOrder}
                        onChange={(e) => updateField('childOrder', e.target.value)}
                        className="w-full px-4 py-3 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-600/20 focus:border-[#064E3B] focus:bg-white transition-all shadow-2xs text-slate-900 font-semibold"
                      />
                      <span className="text-[11px] text-slate-400 mt-1.5 block">Urutan kelahiran ananda</span>
                    </div>
                    <div className="min-w-0">
                      <label className="flex items-center gap-2 text-xs font-bold text-slate-800 mb-2">
                        <span className="inline-flex items-center justify-center px-2 py-0.5 rounded-md bg-[#064E3B] text-emerald-100 font-mono text-[10px] font-extrabold tracking-wide shrink-0 shadow-2xs">
                          Poin 08
                        </span>
                        <span className="truncate">Jumlah Saudara Kandung</span>
                      </label>
                      <input
                        type="number"
                        min={0}
                        max={15}
                        value={formData.siblingsCount}
                        onChange={(e) => updateField('siblingsCount', e.target.value)}
                        className="w-full px-4 py-3 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-600/20 focus:border-[#064E3B] focus:bg-white transition-all shadow-2xs text-slate-900 font-semibold"
                      />
                      <span className="text-[11px] text-slate-400 mt-1.5 block">Jumlah saudara kandung ananda</span>
                    </div>
                  </>
                )}

                <div className="md:col-span-2 min-w-0">
                  <label className="flex items-center gap-2 text-xs font-bold text-slate-800 mb-2">
                    <span className="inline-flex items-center justify-center px-2 py-0.5 rounded-md bg-[#064E3B] text-emerald-100 font-mono text-[10px] font-extrabold tracking-wide shrink-0 shadow-2xs">
                      Poin 17
                    </span>
                    <span className="truncate">Alamat Domisili Lengkap Tempat Tinggal</span>
                    <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    rows={3}
                    value={formData.address}
                    onChange={(e) => updateField('address', e.target.value)}
                    placeholder="Contoh: Perumahan Sindangkasih Asri Blok C-12, RT 02 / RW 05, Kel. Majalengka Kulon, Kec. Majalengka"
                    className="w-full px-4 py-3 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-600/20 focus:border-[#064E3B] focus:bg-white transition-all shadow-2xs text-slate-900 leading-relaxed"
                  />
                  <span className="text-[11px] text-slate-400 mt-1.5 block">
                    Cantumkan nama jalan/perumahan, RT/RW, Kelurahan/Desa, dan Kecamatan tempat tinggal saat ini
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Kuesioner Khusus Jenjang & 28 Butir SDIT */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div className="border-b border-slate-100 pb-4">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black tracking-widest text-emerald-800 uppercase px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200">
                    Langkah 3 dari 6
                  </span>
                  <span className="text-xs text-slate-400 font-medium">• Kesiapan Tumbuh Kembang</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-1.5">
                  Kuesioner Khusus {activeSchool.name}
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Pertanyaan ini diselaraskan dengan kurikulum terpadu dan pembinaan tahfidz di jenjang SDIT.
                </p>
              </div>

              {formData.schoolSlug === 'sd' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 lg:gap-x-12 gap-y-7 pt-1" style={{ columnGap: '2.5rem', rowGap: '1.75rem' }}>
                    <div className="min-w-0">
                      <label className="flex items-center gap-2 text-xs font-bold text-slate-800 mb-2">
                        <span className="inline-flex items-center justify-center px-2 py-0.5 rounded-md bg-[#064E3B] text-emerald-100 font-mono text-[10px] font-extrabold tracking-wide shrink-0 shadow-2xs">
                          Poin 22
                        </span>
                        <span className="truncate">Kategori Pendaftaran Masuk</span>
                        <span className="text-rose-500">*</span>
                      </label>
                      <select
                        value={formData.admissionAs}
                        onChange={(e) => updateField('admissionAs', e.target.value)}
                        className="w-full px-4 py-3 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-600/20 focus:border-[#064E3B] focus:bg-white transition-all shadow-2xs text-slate-900 font-semibold cursor-pointer"
                      >
                        <option value="Murid kelas 1">Murid Kelas 1 (Baru)</option>
                        <option value="Pindahan kelas 2">Pindahan (Kelas 2)</option>
                        <option value="Pindahan kelas 3">Pindahan (Kelas 3)</option>
                        <option value="Pindahan kelas 4">Pindahan (Kelas 4)</option>
                        <option value="Pindahan kelas 5">Pindahan (Kelas 5)</option>
                      </select>
                      <span className="text-[11px] text-slate-400 mt-1.5 block">Pilih tingkatan kelas masuk murid</span>
                    </div>

                    <div className="min-w-0">
                      <label className="flex items-center gap-2 text-xs font-bold text-slate-800 mb-2">
                        <span className="inline-flex items-center justify-center px-2 py-0.5 rounded-md bg-[#064E3B] text-emerald-100 font-mono text-[10px] font-extrabold tracking-wide shrink-0 shadow-2xs">
                          Poin 21
                        </span>
                        <span className="truncate">Moda Transportasi ke Sekolah</span>
                        <span className="text-rose-500">*</span>
                      </label>
                      <select
                        value={formData.transportation}
                        onChange={(e) => updateField('transportation', e.target.value)}
                        className="w-full px-4 py-3 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-600/20 focus:border-[#064E3B] focus:bg-white transition-all shadow-2xs text-slate-900 font-semibold cursor-pointer"
                      >
                        <option value="diantar">Diantar Orang Tua / Keluarga</option>
                        <option value="sendiri">Berangkat Sendiri / Jalan Kaki</option>
                        <option value="jemputan">Antar Jemput / Mobil Sekolah</option>
                      </select>
                      <span className="text-[11px] text-slate-400 mt-1.5 block">Kebiasaan transportasi harian murid</span>
                    </div>

                    <div className="sm:col-span-2 min-w-0">
                      <label className="flex items-center gap-2 text-xs font-bold text-slate-800 mb-2">
                        <span className="inline-flex items-center justify-center px-2 py-0.5 rounded-md bg-[#064E3B] text-emerald-100 font-mono text-[10px] font-extrabold tracking-wide shrink-0 shadow-2xs">
                          Poin 23
                        </span>
                        <span className="truncate">Asal Sekolah Sebelumnya (TK / PAUD / RA / dsb)</span>
                      </label>
                      <input
                        type="text"
                        value={formData.originSchoolName}
                        onChange={(e) => updateField('originSchoolName', e.target.value)}
                        placeholder="Contoh: TK IT Al-Afiyah Majalengka / RA Al-Hidayah"
                        className="w-full px-4 py-3 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-600/20 focus:border-[#064E3B] focus:bg-white transition-all shadow-2xs text-slate-900 font-semibold"
                      />
                      <span className="text-[11px] text-slate-400 mt-1.5 block">Lembaga pendidikan pra-sekolah atau sekolah sebelumnya</span>
                    </div>

                    <div className="min-w-0">
                      <label className="flex items-center gap-2 text-xs font-bold text-slate-800 mb-2">
                        <span className="inline-flex items-center justify-center px-2 py-0.5 rounded-md bg-[#064E3B] text-emerald-100 font-mono text-[10px] font-extrabold tracking-wide shrink-0 shadow-2xs">
                          Qur&apos;an
                        </span>
                        <span className="truncate">Penguasaan Membaca Al-Qur&apos;an / Iqro</span>
                        <span className="text-rose-500">*</span>
                      </label>
                      <select
                        value={formData.sdIqroLevel}
                        onChange={(e) => updateField('sdIqroLevel', e.target.value)}
                        className="w-full px-4 py-3 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-600/20 focus:border-[#064E3B] focus:bg-white transition-all shadow-2xs text-slate-900 font-semibold cursor-pointer"
                      >
                        <option value="Al-Qur'an Lancar">Sudah Masuk Al-Qur&apos;an &amp; Lancar</option>
                        <option value="Jilid 5 - 6">Iqro Jilid 5 - 6</option>
                        <option value="Jilid 3 - 4">Iqro Jilid 3 - 4</option>
                        <option value="Jilid 1 - 2">Iqro Jilid 1 - 2 (Pemula)</option>
                      </select>
                      <span className="text-[11px] text-slate-400 mt-1.5 block">Tingkat capaian tilawah saat ini</span>
                    </div>

                    <div className="min-w-0">
                      <label className="flex items-center gap-2 text-xs font-bold text-slate-800 mb-2">
                        <span className="inline-flex items-center justify-center px-2 py-0.5 rounded-md bg-[#064E3B] text-emerald-100 font-mono text-[10px] font-extrabold tracking-wide shrink-0 shadow-2xs">
                          Kesiapan
                        </span>
                        <span className="truncate">Kesiapan Membaca Huruf Latin (Calistung)</span>
                        <span className="text-rose-500">*</span>
                      </label>
                      <select
                        value={formData.sdReadingReady}
                        onChange={(e) => updateField('sdReadingReady', e.target.value)}
                        className="w-full px-4 py-3 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-600/20 focus:border-[#064E3B] focus:bg-white transition-all shadow-2xs text-slate-900 font-semibold cursor-pointer"
                      >
                        <option value="Sudah Lancar Kata">Sudah Lancar Membaca Kalimat &amp; Berhitung</option>
                        <option value="Mengeja Suku Kata">Masih Mengeja Suku Kata Sederhana</option>
                        <option value="Belum Mengenal Huruf">Baru Mengenal Abjad</option>
                      </select>
                      <span className="text-[11px] text-slate-400 mt-1.5 block">Sebagai bahan pemetaan pendampingan guru</span>
                    </div>
                  </div>

                  {/* Accordion Opsional: Lengkapi 28 Poin Fisik Sekarang vs Susulkan Nanti */}
                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={() => setShowDetailed28Poin(!showDetailed28Poin)}
                      className={`w-full p-5 sm:p-6 rounded-2xl text-left flex items-center justify-between transition-all duration-300 cursor-pointer border shadow-2xs ${
                        showDetailed28Poin
                          ? 'bg-slate-50 border-slate-300 ring-2 ring-slate-200'
                          : 'bg-white hover:bg-slate-50 border-slate-200'
                      }`}
                    >
                      <div className="flex items-center space-x-4">
                        <div
                          className="w-11 h-11 rounded-xl flex items-center justify-center text-white shrink-0 shadow-xs"
                          style={{ backgroundColor: '#064E3B' }}
                        >
                          <FileText className="w-5 h-5 text-emerald-200" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-xs sm:text-sm font-extrabold text-slate-900">
                              Lengkapi Rincian Formulir Fisik 28 Poin Sekarang?
                            </span>
                            <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-800 border border-slate-200">
                              Opsional • Bisa Disusulkan Nanti
                            </span>
                          </div>
                          <span className="text-[11px] text-slate-500 block mt-1 leading-relaxed">
                            Tinggi &amp; berat badan, golongan darah, riwayat kesehatan, tinggal bersama, dan alasan memilih sekolah.
                          </span>
                        </div>
                      </div>
                      <div className="pl-3">
                        <span className={`p-2 rounded-xl border flex items-center justify-center transition-all ${
                          showDetailed28Poin ? 'bg-[#064E3B] text-white border-[#064E3B]' : 'bg-slate-50 text-slate-600 border-slate-200'
                        }`}>
                          {showDetailed28Poin ? (
                            <ChevronUp className="w-4 h-4 shrink-0" />
                          ) : (
                            <ChevronDown className="w-4 h-4 shrink-0" />
                          )}
                        </span>
                      </div>
                    </button>

                    {showDetailed28Poin && (
                      <div className="mt-4 p-6 sm:p-7 bg-slate-50 border border-slate-200 rounded-2xl space-y-6 animate-in fade-in duration-300 shadow-xs">
                        <div className="p-4 rounded-xl bg-white border border-slate-200 text-xs text-slate-700 font-medium flex items-center gap-3">
                          <FileCheck className="w-5 h-5 text-[#064E3B] shrink-0" />
                          <span>
                            Data di bawah ini diselaraskan 100% dengan lembar formulir fisik resmi SDIT Al-Afiyah. Boleh Anda lengkapi sekarang atau disusulkan via Portal Murid kapan saja.
                          </span>
                        </div>

                        {/* Keadaan Jasmani */}
                        <div className="space-y-3">
                          <span className="text-xs font-black text-slate-800 uppercase tracking-wider block">
                            Keadaan Jasmani &amp; Kesehatan Murid:
                          </span>
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-6 gap-y-5">
                            <div>
                              <label className="flex items-center gap-2 text-xs font-bold text-slate-700 mb-2">
                                <span className="inline-flex items-center justify-center px-2 py-0.5 rounded-md bg-[#064E3B] text-emerald-100 font-mono text-[10px] font-extrabold tracking-wide shrink-0 shadow-2xs">
                                  Poin 11
                                </span>
                                <span className="truncate">Tinggi Badan</span>
                              </label>
                              <div className="relative">
                                <input
                                  type="number"
                                  placeholder="Contoh: 115"
                                  value={formData.heightCm}
                                  onChange={(e) => updateField('heightCm', e.target.value)}
                                  className="w-full px-4 py-3 pr-10 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl focus:border-[#064E3B] focus:ring-2 focus:ring-emerald-600/20 focus:outline-hidden font-semibold shadow-2xs"
                                />
                                <span className="absolute right-3.5 top-3.5 text-xs text-slate-400 font-bold">cm</span>
                              </div>
                            </div>
                            <div>
                              <label className="flex items-center gap-2 text-xs font-bold text-slate-700 mb-2">
                                <span className="inline-flex items-center justify-center px-2 py-0.5 rounded-md bg-[#064E3B] text-emerald-100 font-mono text-[10px] font-extrabold tracking-wide shrink-0 shadow-2xs">
                                  Poin 12
                                </span>
                                <span className="truncate">Berat Badan</span>
                              </label>
                              <div className="relative">
                                <input
                                  type="number"
                                  placeholder="Contoh: 20"
                                  value={formData.weightKg}
                                  onChange={(e) => updateField('weightKg', e.target.value)}
                                  className="w-full px-4 py-3 pr-10 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl focus:border-[#064E3B] focus:ring-2 focus:ring-emerald-600/20 focus:outline-hidden font-semibold shadow-2xs"
                                />
                                <span className="absolute right-3.5 top-3.5 text-xs text-slate-400 font-bold">kg</span>
                              </div>
                            </div>
                            <div>
                              <label className="flex items-center gap-2 text-xs font-bold text-slate-700 mb-2">
                                <span className="inline-flex items-center justify-center px-2 py-0.5 rounded-md bg-[#064E3B] text-emerald-100 font-mono text-[10px] font-extrabold tracking-wide shrink-0 shadow-2xs">
                                  Poin 14
                                </span>
                                <span className="truncate">Golongan Darah</span>
                              </label>
                              <div className="grid grid-cols-5 gap-1.5 h-[48px]">
                                {['Belum Tahu', 'A', 'B', 'AB', 'O'].map((type) => (
                                  <button
                                    key={type}
                                    type="button"
                                    onClick={() => updateField('bloodType', type)}
                                    className={`h-full text-[10px] font-extrabold rounded-xl border transition-all cursor-pointer flex items-center justify-center ${
                                      formData.bloodType === type
                                        ? 'bg-[#064E3B] text-white border-[#064E3B] shadow-2xs ring-2 ring-[#064E3B]/20'
                                        : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                                    }`}
                                  >
                                    {type}
                                  </button>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Jarak & Tinggal Bersama */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5">
                          <div>
                            <label className="flex items-center gap-2 text-xs font-bold text-slate-700 mb-2">
                              <span className="inline-flex items-center justify-center px-2 py-0.5 rounded-md bg-[#064E3B] text-emerald-100 font-mono text-[10px] font-extrabold tracking-wide shrink-0 shadow-2xs">
                                Poin 15
                              </span>
                              <span className="truncate">Jarak Rumah ke Sekolah (km)</span>
                            </label>
                            <div className="relative">
                              <input
                                type="number"
                                step="0.5"
                                value={formData.distanceToSchoolKm}
                                onChange={(e) => updateField('distanceToSchoolKm', e.target.value)}
                                className="w-full px-4 py-3 pr-10 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl focus:border-[#064E3B] focus:ring-2 focus:ring-emerald-600/20 focus:outline-hidden font-semibold shadow-2xs"
                              />
                              <span className="absolute right-3.5 top-3.5 text-xs text-slate-400 font-bold">km</span>
                            </div>
                          </div>
                          <div>
                            <label className="flex items-center gap-2 text-xs font-bold text-slate-700 mb-2">
                              <span className="inline-flex items-center justify-center px-2 py-0.5 rounded-md bg-[#064E3B] text-emerald-100 font-mono text-[10px] font-extrabold tracking-wide shrink-0 shadow-2xs">
                                Poin 16
                              </span>
                              <span className="truncate">Bertempat Tinggal Bersama</span>
                            </label>
                            <select
                              value={formData.livingWith}
                              onChange={(e) => updateField('livingWith', e.target.value)}
                              className="w-full px-4 py-3 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl focus:border-[#064E3B] focus:ring-2 focus:ring-emerald-600/20 focus:outline-hidden font-semibold shadow-2xs cursor-pointer"
                            >
                              <option value="Keduanya">Kedua Orang Tua (Ayah &amp; Ibu)</option>
                              <option value="Ayah">Ayah</option>
                              <option value="Ibu">Ibu</option>
                              <option value="Wali">Wali / Kakek / Nenek</option>
                              <option value="Sendiri">Lainnya</option>
                            </select>
                          </div>
                        </div>

                        <div>
                          <label className="flex items-center gap-2 text-xs font-bold text-slate-700 mb-2">
                            <span className="inline-flex items-center justify-center px-2 py-0.5 rounded-md bg-[#064E3B] text-emerald-100 font-mono text-[10px] font-extrabold tracking-wide shrink-0 shadow-2xs">
                              Poin 13
                            </span>
                            <span className="truncate">Riwayat Penyakit yang Pernah Diderita / Alergi</span>
                          </label>
                          <input
                            type="text"
                            value={formData.diseaseHistory}
                            onChange={(e) => updateField('diseaseHistory', e.target.value)}
                            placeholder="Contoh: Asma ringan, alergi dingin (atau isi 'Tidak ada riwayat penyakit')"
                            className="w-full px-4 py-3 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl focus:border-[#064E3B] focus:ring-2 focus:ring-emerald-600/20 focus:outline-hidden shadow-2xs"
                          />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5">
                          <div>
                            <label className="flex items-center gap-2 text-xs font-bold text-slate-700 mb-2">
                              <span className="inline-flex items-center justify-center px-2 py-0.5 rounded-md bg-[#064E3B] text-emerald-100 font-mono text-[10px] font-extrabold tracking-wide shrink-0 shadow-2xs">
                                Poin 27
                              </span>
                              <span className="truncate">Pertama Kali Mengetahui Informasi Sekolah Dari</span>
                            </label>
                            <input
                              type="text"
                              value={formData.firstKnownSource}
                              onChange={(e) => updateField('firstKnownSource', e.target.value)}
                              placeholder="Media sosial / Rekomendasi tetangga / Brosur"
                              className="w-full px-4 py-3 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl focus:border-[#064E3B] focus:ring-2 focus:ring-emerald-600/20 focus:outline-hidden shadow-2xs"
                            />
                          </div>
                          <div>
                            <label className="flex items-center gap-2 text-xs font-bold text-slate-700 mb-2">
                              <span className="inline-flex items-center justify-center px-2 py-0.5 rounded-md bg-[#064E3B] text-emerald-100 font-mono text-[10px] font-extrabold tracking-wide shrink-0 shadow-2xs">
                                Poin 28
                              </span>
                              <span className="truncate">Alasan Utama Memilih Sekolah Ini</span>
                            </label>
                            <input
                              type="text"
                              value={formData.mainReason}
                              onChange={(e) => updateField('mainReason', e.target.value)}
                              placeholder="Pembinaan karakter islami & hafalan tahfidz juz 30 mutqin"
                              className="w-full px-4 py-3 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl focus:border-[#064E3B] focus:ring-2 focus:ring-emerald-600/20 focus:outline-hidden shadow-2xs"
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {formData.schoolSlug === 'smp' && (
                <div className="space-y-6 pt-1">
                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-2">Target Hafalan Al-Qur&apos;an di SMP</label>
                    <select
                      value={formData.smpTahfidzTarget}
                      onChange={(e) => updateField('smpTahfidzTarget', e.target.value)}
                      className="w-full px-4 py-3 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-600/20 focus:border-[#064E3B] focus:bg-white transition-all shadow-2xs text-slate-900 font-semibold"
                    >
                      <option value="5 Juz Mutqin">Program 5 Juz Mutqin (Intensif)</option>
                      <option value="3 Juz Mutqin">Program 3 Juz Mutqin (Standar)</option>
                      <option value="30 Juz Takhossus">Program Takhossus Tahfidz (Murid Khusus)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-2">Pilihan Program Kelas Belajar</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <button
                        type="button"
                        onClick={() => updateField('smpProgramChoice', 'REGULER')}
                        className={`py-3.5 px-4 rounded-xl text-xs sm:text-sm font-bold border transition-all cursor-pointer ${
                          formData.smpProgramChoice === 'REGULER'
                            ? 'border-[#064E3B] bg-emerald-50 text-[#064E3B] ring-2 ring-[#064E3B]/20 font-extrabold shadow-2xs'
                            : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-white'
                        }`}
                      >
                        Fullday Reguler (Kurikulum SIT)
                      </button>
                      <button
                        type="button"
                        onClick={() => updateField('smpProgramChoice', 'TAHFIDZ_SAINS')}
                        className={`py-3.5 px-4 rounded-xl text-xs sm:text-sm font-bold border transition-all cursor-pointer ${
                          formData.smpProgramChoice === 'TAHFIDZ_SAINS'
                            ? 'border-[#064E3B] bg-emerald-50 text-[#064E3B] ring-2 ring-[#064E3B]/20 font-extrabold shadow-2xs'
                            : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-white'
                        }`}
                      >
                        Fullday Peminatan Tahfidz & Sains
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* STEP 4: Data Orang Tua / Wali */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div className="border-b border-slate-100 pb-4">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black tracking-widest text-emerald-800 uppercase px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200">
                    Langkah 4 dari 6
                  </span>
                  <span className="text-xs text-slate-400 font-medium">• Identitas Orang Tua &amp; Kontak</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-1.5">
                  Data Orang Tua / Wali Murid
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Nomor WhatsApp aktif digunakan untuk pengiriman surat bukti pendaftaran resmi dan konfirmasi observasi.
                </p>
              </div>

              {/* Section Header */}
              <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
                <div className="w-8 h-8 rounded-xl bg-[#064E3B] text-white flex items-center justify-center shadow-xs shrink-0">
                  <Users className="w-4 h-4 text-emerald-200" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900 tracking-tight">
                    Identitas Orang Tua / Wali Murid
                  </h3>
                  <p className="text-[11px] text-slate-500 font-medium">
                    Data ayah dan ibu kandung atau wali untuk keperluan komunikasi dan kesiswaan
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-10 lg:gap-x-12 gap-y-7 pt-1" style={{ columnGap: '2.5rem', rowGap: '1.75rem' }}>
                {/* Data Ayah Kandung */}
                <div className="min-w-0 p-6 rounded-2xl bg-white border border-slate-200 space-y-4 shadow-2xs">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <span className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                      <span className="inline-flex items-center justify-center px-2 py-0.5 rounded-md bg-[#064E3B] text-emerald-100 font-mono text-[10px] font-extrabold tracking-wide shrink-0 shadow-2xs">
                        Poin 18
                      </span>
                      <User className="w-4 h-4 text-emerald-800" />
                      <span>Data Ayah Kandung</span>
                    </span>
                    <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                      Ayah
                    </span>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-2">
                      Nama Lengkap Ayah
                    </label>
                    <input
                      type="text"
                      value={formData.fatherName}
                      onChange={(e) => updateField('fatherName', e.target.value)}
                      placeholder="Contoh: Hendra Gunawan S.T."
                      className="w-full px-4 py-3 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:border-[#064E3B] focus:ring-2 focus:ring-emerald-600/20 focus:bg-white focus:outline-hidden font-semibold text-slate-900 shadow-2xs"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-800 mb-2">Pekerjaan Ayah</label>
                      <input
                        type="text"
                        value={formData.fatherJob}
                        onChange={(e) => updateField('fatherJob', e.target.value)}
                        placeholder="PNS / Wiraswasta"
                        className="w-full px-4 py-3 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:border-[#064E3B] focus:bg-white focus:outline-hidden text-slate-900"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-800 mb-2">No. HP / WA Ayah</label>
                      <input
                        type="text"
                        value={formData.fatherPhone}
                        onChange={(e) => updateField('fatherPhone', e.target.value)}
                        placeholder="0812xxxxxxxx"
                        className="w-full px-4 py-3 text-xs sm:text-sm font-mono bg-slate-50 border border-slate-200 rounded-xl focus:border-[#064E3B] focus:bg-white focus:outline-hidden text-slate-900 font-semibold"
                      />
                    </div>
                  </div>
                </div>

                {/* Data Ibu Kandung */}
                <div className="min-w-0 p-6 rounded-2xl bg-white border border-slate-200 space-y-4 shadow-2xs">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <span className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                      <span className="inline-flex items-center justify-center px-2 py-0.5 rounded-md bg-[#064E3B] text-emerald-100 font-mono text-[10px] font-extrabold tracking-wide shrink-0 shadow-2xs">
                        Poin 19
                      </span>
                      <Heart className="w-4 h-4 text-rose-600" />
                      <span>Data Ibu Kandung</span>
                    </span>
                    <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
                      Ibu
                    </span>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-2">
                      Nama Lengkap Ibu
                    </label>
                    <input
                      type="text"
                      value={formData.motherName}
                      onChange={(e) => updateField('motherName', e.target.value)}
                      placeholder="Contoh: Nur Hasanah S.Pd."
                      className="w-full px-4 py-3 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:border-[#064E3B] focus:ring-2 focus:ring-emerald-600/20 focus:bg-white focus:outline-hidden font-semibold text-slate-900 shadow-2xs"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-800 mb-2">Pekerjaan Ibu</label>
                      <input
                        type="text"
                        value={formData.motherJob}
                        onChange={(e) => updateField('motherJob', e.target.value)}
                        placeholder="Guru / Ibu Rumah Tangga"
                        className="w-full px-4 py-3 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:border-[#064E3B] focus:bg-white focus:outline-hidden text-slate-900"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-800 mb-2">
                        No. WhatsApp Aktif <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.motherPhone}
                        onChange={(e) => updateField('motherPhone', e.target.value)}
                        placeholder="0812xxxxxxxx"
                        className="w-full px-4 py-3 text-xs sm:text-sm font-mono font-bold bg-slate-50 border border-slate-200 rounded-xl focus:border-[#064E3B] focus:bg-white focus:outline-hidden text-slate-900"
                      />
                    </div>
                  </div>
                </div>

                {/* Penghasilan Orang Tua */}
                <div className="lg:col-span-2 min-w-0 p-6 rounded-2xl bg-white border border-slate-200 shadow-2xs">
                  <label className="flex items-center gap-2 text-xs font-bold text-slate-900 mb-3">
                    <span className="inline-flex items-center justify-center px-2 py-0.5 rounded-md bg-[#064E3B] text-emerald-100 font-mono text-[10px] font-extrabold tracking-wide shrink-0 shadow-2xs">
                      Poin 20
                    </span>
                    <span>Rentang Penghasilan Gabungan Orang Tua Bulanan</span>
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                    {[
                      'Di bawah Rp 3.000.000',
                      'Rp 3.000.000 - Rp 5.000.000',
                      'Rp 5.000.000 - Rp 10.000.000',
                      'Di atas Rp 10.000.000',
                    ].map((inc) => (
                      <button
                        key={inc}
                        type="button"
                        onClick={() => updateField('incomeRange', inc)}
                        className={`py-3 px-3 rounded-xl text-xs sm:text-sm font-bold border transition-all cursor-pointer text-center ${
                          formData.incomeRange === inc
                            ? 'bg-[#064E3B] text-white border-[#064E3B] shadow-2xs ring-2 ring-[#064E3B]/20'
                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {inc}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 5: Unggah Dokumen */}
          {currentStep === 5 && (
            <div className="space-y-6">
              <div className="border-b border-slate-100 pb-4">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black tracking-widest text-emerald-800 uppercase px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200">
                    Langkah 5 dari 6
                  </span>
                  <span className="text-xs text-slate-400 font-medium">• Berkas Administrasi</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-1.5">
                  Unggah Berkas Persyaratan
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Unggah dokumen format PDF atau JPG/PNG (Maks. 5 MB per file).
                </p>
              </div>

              {/* Section Header Card */}
              <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
                <div className="w-8 h-8 rounded-xl bg-[#064E3B] text-white flex items-center justify-center shadow-xs shrink-0">
                  <FileText className="w-4 h-4 text-emerald-200" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900 tracking-tight">
                    Unggah Berkas Persyaratan Administrasi
                  </h3>
                  <p className="text-[11px] text-slate-500 font-medium">
                    Dokumen dapat diunggah langsung sekarang atau disusulkan via Portal Murid
                  </p>
                </div>
              </div>

              {uploadError && (
                <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center space-x-2">
                  <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
                  <span>{uploadError}</span>
                </div>
              )}

              {/* Card Opsi Susulkan Berkas Nanti (Resmi & Tertib) */}
              <div className="p-5 sm:p-6 rounded-2xl bg-emerald-50/80 border border-emerald-200/90 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-2xs">
                <div className="flex items-start space-x-3.5">
                  <div className="w-10 h-10 rounded-xl bg-[#064E3B] text-white flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                    <FileCheck className="w-5 h-5 text-emerald-200" />
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900">
                      Belum Memegang Berkas Fisik (KK / Akta) Saat Ini?
                    </h4>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                      Ayah/Bunda tetap dapat melanjutkan pendaftaran dan mengunci nomor registrasi murid terlebih dahulu. Berkas dokumen dapat diunggah kemudian melalui <span className="font-bold text-emerald-800 underline">Portal Murid</span> atau diserahkan langsung saat verifikasi di sekolah.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleSkipDocumentsAndSubmit}
                  disabled={isLoading}
                  className="w-full sm:w-auto px-5 py-3 rounded-xl bg-[#064E3B] hover:bg-emerald-900 text-white text-xs sm:text-sm font-bold shrink-0 transition-colors flex items-center justify-center space-x-2 shadow-xs cursor-pointer tactile-press"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Menyimpan...</span>
                    </>
                  ) : (
                    <>
                      <span>Susulkan Berkas &amp; Lanjut</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 pt-1">
                {/* 1. KK */}
                <div className={`border-2 border-dashed rounded-2xl p-6 text-center transition-all ${
                  uploadedFiles.KK ? 'border-emerald-500 bg-emerald-50/40' : 'border-slate-200 bg-slate-50/50 hover:bg-slate-50'
                }`}>
                  <input
                    type="file"
                    id="upload-kk"
                    accept=".pdf,.jpg,.jpeg,.png,.webp"
                    className="hidden"
                    onChange={(e) => handleFileUpload(e, 'KK')}
                  />
                  <label htmlFor="upload-kk" className="cursor-pointer block">
                    <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto mb-3 shadow-2xs">
                      {uploadingDocType === 'KK' ? (
                        <Loader2 className="w-6 h-6 animate-spin" />
                      ) : (
                        <FileText className="w-6 h-6" />
                      )}
                    </div>
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900">Kartu Keluarga (KK)</h4>
                    {uploadedFiles.KK ? (
                      <div className="mt-2.5">
                        <p className="text-xs text-slate-700 font-semibold truncate max-w-[180px] mx-auto">
                          {uploadedFiles.KK.fileName}
                        </p>
                        <span className="mt-2 inline-flex items-center space-x-1 text-[11px] font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Berhasil Diunggah</span>
                        </span>
                        <p className="text-[11px] text-slate-400 mt-1.5">Klik untuk mengganti berkas</p>
                      </div>
                    ) : (
                      <>
                        <p className="text-xs text-slate-400 mt-1">Format PDF / Foto (Maks 5MB)</p>
                        <span className="mt-4 inline-flex items-center space-x-1.5 text-xs font-semibold text-emerald-800 bg-white border border-emerald-300 px-3.5 py-1.5 rounded-xl shadow-2xs hover:bg-emerald-50 transition-colors">
                          <Upload className="w-3.5 h-3.5" />
                          <span>Pilih Berkas</span>
                        </span>
                      </>
                    )}
                  </label>
                </div>

                {/* 2. Akta Kelahiran */}
                <div className={`border-2 border-dashed rounded-2xl p-6 text-center transition-all ${
                  uploadedFiles.AKTA ? 'border-emerald-500 bg-emerald-50/40' : 'border-slate-200 bg-slate-50/50 hover:bg-slate-50'
                }`}>
                  <input
                    type="file"
                    id="upload-akta"
                    accept=".pdf,.jpg,.jpeg,.png,.webp"
                    className="hidden"
                    onChange={(e) => handleFileUpload(e, 'AKTA')}
                  />
                  <label htmlFor="upload-akta" className="cursor-pointer block">
                    <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center mx-auto mb-3 shadow-2xs">
                      {uploadingDocType === 'AKTA' ? (
                        <Loader2 className="w-6 h-6 animate-spin" />
                      ) : (
                        <FileText className="w-6 h-6" />
                      )}
                    </div>
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900">Akta Kelahiran</h4>
                    {uploadedFiles.AKTA ? (
                      <div className="mt-2.5">
                        <p className="text-xs text-slate-700 font-semibold truncate max-w-[180px] mx-auto">
                          {uploadedFiles.AKTA.fileName}
                        </p>
                        <span className="mt-2 inline-flex items-center space-x-1 text-[11px] font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Berhasil Diunggah</span>
                        </span>
                        <p className="text-[11px] text-slate-400 mt-1.5">Klik untuk mengganti berkas</p>
                      </div>
                    ) : (
                      <>
                        <p className="text-xs text-slate-400 mt-1">Format PDF / Foto (Maks 5MB)</p>
                        <span className="mt-4 inline-flex items-center space-x-1.5 text-xs font-semibold text-emerald-800 bg-white border border-emerald-300 px-3.5 py-1.5 rounded-xl shadow-2xs hover:bg-emerald-50 transition-colors">
                          <Upload className="w-3.5 h-3.5" />
                          <span>Pilih Berkas</span>
                        </span>
                      </>
                    )}
                  </label>
                </div>

                {/* 3. Pas Foto */}
                <div className={`border-2 border-dashed rounded-2xl p-6 text-center transition-all ${
                  uploadedFiles.FOTO ? 'border-emerald-500 bg-emerald-50/40' : 'border-slate-200 bg-slate-50/50 hover:bg-slate-50'
                }`}>
                  <input
                    type="file"
                    id="upload-foto"
                    accept=".pdf,.jpg,.jpeg,.png,.webp"
                    className="hidden"
                    onChange={(e) => handleFileUpload(e, 'FOTO')}
                  />
                  <label htmlFor="upload-foto" className="cursor-pointer block">
                    <div className="w-12 h-12 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center mx-auto mb-3 shadow-2xs">
                      {uploadingDocType === 'FOTO' ? (
                        <Loader2 className="w-6 h-6 animate-spin" />
                      ) : (
                        <Upload className="w-6 h-6" />
                      )}
                    </div>
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900">Pas Foto Murid</h4>
                    {uploadedFiles.FOTO ? (
                      <div className="mt-2.5">
                        <p className="text-xs text-slate-700 font-semibold truncate max-w-[180px] mx-auto">
                          {uploadedFiles.FOTO.fileName}
                        </p>
                        <span className="mt-2 inline-flex items-center space-x-1 text-[11px] font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Berhasil Diunggah</span>
                        </span>
                        <p className="text-[11px] text-slate-400 mt-1.5">Klik untuk mengganti berkas</p>
                      </div>
                    ) : (
                      <>
                        <p className="text-xs text-slate-400 mt-1">3x4 Latar Biru / Merah</p>
                        <span className="mt-4 inline-flex items-center space-x-1.5 text-xs font-semibold text-emerald-800 bg-white border border-emerald-300 px-3.5 py-1.5 rounded-xl shadow-2xs hover:bg-emerald-50 transition-colors">
                          <Upload className="w-3.5 h-3.5" />
                          <span>Pilih Berkas</span>
                        </span>
                      </>
                    )}
                  </label>
                </div>
              </div>

              {formData.schoolSlug === 'sd' && (
                <div className="p-5 sm:p-6 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-3.5">
                  <div className="flex items-center space-x-2.5">
                    <FileCheck className="w-4 h-4 text-[#064E3B] shrink-0" />
                    <h4 className="font-bold text-slate-900">
                      Rincian Berkas Fisik Lembar Stopmap (Sesuai Formulir Resmi):
                    </h4>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs text-slate-600">
                    <div className="flex items-start space-x-2">
                      <span className="text-emerald-700 font-bold">•</span>
                      <span>Usia minimal 6 tahun per 1 Juli 2027</span>
                    </div>
                    <div className="flex items-start space-x-2">
                      <span className="text-emerald-700 font-bold">•</span>
                      <span>Biaya formulir Rp 175.000 (Gelombang 1)</span>
                    </div>
                    <div className="flex items-start space-x-2">
                      <span className="text-emerald-700 font-bold">•</span>
                      <span>FC Ijazah / Ket. Tamat TK/RA (1 lembar)</span>
                    </div>
                    <div className="flex items-start space-x-2">
                      <span className="text-emerald-700 font-bold">•</span>
                      <span>FC Kartu Keluarga / KK (2 lembar)</span>
                    </div>
                    <div className="flex items-start space-x-2">
                      <span className="text-emerald-700 font-bold">•</span>
                      <span>FC Akta Kelahiran (2 lembar)</span>
                    </div>
                    <div className="flex items-start space-x-2">
                      <span className="text-emerald-700 font-bold">•</span>
                      <span>Pas Foto Berwarna 3x4 (2 lembar)</span>
                    </div>
                  </div>
                  <p className="text-[11px] text-slate-500 italic pt-2 border-t border-slate-200/80 leading-relaxed">
                    *Semua berkas fisik dimasukkan ke dalam <strong>1 stopmap</strong> dan diserahkan saat pengembalian formulir ke sekolah, paling lambat <strong>3 hari sebelum pelaksanaan Tes PPDB 2027/2028</strong>.
                  </p>
                </div>
              )}

              <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200/80 text-xs text-emerald-900 flex items-center space-x-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-700 flex-shrink-0" />
                <span>Dokumen fisik asli dapat dibawa saat jadwal wawancara/observasi berlangsung di lingkungan kampus sekolah.</span>
              </div>
            </div>
          )}

          {/* STEP 6: Pembayaran Midtrans Snap Simulator */}
          {currentStep === 6 && createdResult && (
            <div className="space-y-6">
              <div className="text-center max-w-md mx-auto">
                <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-3 shadow-xs">
                  <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Formulir Berhasil Dibuat!</h2>
                <p className="text-xs text-slate-500 mt-1">
                  Nomor Registrasi Resmi Ananda:
                </p>
                <div className="inline-block mt-2 px-4 py-1.5 rounded-xl bg-slate-900 text-white font-mono font-bold text-sm tracking-wider shadow-sm">
                  {createdResult.registrationNo}
                </div>
              </div>

              {/* Tagihan Summary Card */}
              <div className="bg-emerald-50/70 rounded-2xl p-6 border border-emerald-200/90 space-y-3.5 shadow-2xs">
                <div className="flex items-center justify-between text-xs text-emerald-900">
                  <span className="font-medium">Unit Sekolah:</span>
                  <span className="font-extrabold text-[#064E3B]">{createdResult.schoolName}</span>
                </div>
                <div className="flex items-center justify-between text-xs text-emerald-900">
                  <span className="font-medium">Nama Calon Murid:</span>
                  <span className="font-extrabold text-slate-900">{formData.studentName}</span>
                </div>
                {formData.referralCode && (
                  <div className="flex items-center justify-between text-xs text-emerald-900">
                    <span className="font-medium">Rujukan Mitra Afiliasi:</span>
                    <span className="font-mono font-bold text-amber-800 bg-amber-100/80 px-2 py-0.5 rounded-md border border-amber-200">
                      {formData.referralCode}
                    </span>
                  </div>
                )}
                <div className="pt-3 border-t border-emerald-200/80 flex items-center justify-between text-sm font-bold text-slate-900">
                  <span>Total Biaya Formulir:</span>
                  <span className="text-[#064E3B] text-lg font-black font-mono">
                    Rp {createdResult.amount.toLocaleString('id-ID')}
                  </span>
                </div>
              </div>

              {/* Metode Pembayaran */}
              {!isPaid ? (
                <div className="space-y-4">
                  <label className="block text-xs font-bold text-slate-800">
                    Pilih Metode Pembayaran (Midtrans Sandbox Simulator)
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {['QRIS', 'BNI VA', 'BRI VA', 'MANDIRI'].map((method) => (
                      <button
                        key={method}
                        type="button"
                        onClick={() => setSelectedPayment(method)}
                        className={`p-3 rounded-xl border text-center transition-all ${
                          selectedPayment === method
                            ? 'border-emerald-600 bg-emerald-50 text-emerald-900 font-bold shadow-xs'
                            : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        <span className="text-xs font-semibold block">{method}</span>
                      </button>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={handleSimulatePayment}
                    disabled={isPaying}
                    className="w-full py-3.5 px-6 rounded-xl gold-gradient text-white text-sm font-bold shadow-md hover:opacity-95 transition-all flex items-center justify-center space-x-2 disabled:opacity-70 cursor-pointer"
                  >
                    {isPaying ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Menghubungkan ke Midtrans Simulator...</span>
                      </>
                    ) : (
                      <>
                        <CreditCard className="w-4 h-4" />
                        <span>Bayar Sekarang (Simulasi Instan Rp {createdResult.amount.toLocaleString('id-ID')})</span>
                      </>
                    )}
                  </button>

                  {/* Rekening Resmi Transfer Bank Khusus Unit SMP IT */}
                  {activeSchool.slug === 'smp' && (
                    <div className="p-4 sm:p-5 rounded-2xl bg-emerald-50/90 border border-emerald-300 text-xs space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="font-extrabold text-emerald-950 flex items-center gap-1.5">
                          <CreditCard className="w-4 h-4 text-emerald-700" />
                          <span>Rekening Resmi Pembayaran SPMB SMP IT:</span>
                        </span>
                        <span className="text-[10px] bg-emerald-700 text-white px-2.5 py-0.5 rounded-full font-bold shadow-2xs">
                          Bank Muamalat
                        </span>
                      </div>
                      <div className="flex items-center justify-between bg-white p-3.5 rounded-xl border border-emerald-200 shadow-2xs">
                        <div>
                          <span className="text-[10px] text-slate-500 uppercase font-medium block">Nomor Rekening:</span>
                          <strong className="text-base sm:text-lg font-mono font-bold text-slate-900 tracking-wider">
                            1360012405
                          </strong>
                          <span className="text-xs text-slate-600 block mt-0.5">a.n <strong>SMP IT Al Afiyah</strong></span>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            if (typeof navigator !== 'undefined' && navigator.clipboard) {
                              navigator.clipboard.writeText('1360012405');
                              setCopiedBankAcc(true);
                              setTimeout(() => setCopiedBankAcc(false), 2200);
                            }
                          }}
                          className="px-3.5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-2xs transition-all cursor-pointer flex items-center gap-1.5"
                        >
                          {copiedBankAcc ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-white" />
                              <span>Tersalin!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5 text-white" />
                              <span>Salin No. Rek</span>
                            </>
                          )}
                        </button>
                      </div>
                      <p className="text-[11px] text-slate-600 leading-relaxed">
                        Jika melakukan transfer via ATM / Mobile Banking, sertakan keterangan berita: <strong>{createdResult.registrationNo}</strong> dan simpan struk/bukti transfer untuk konfirmasi ke panitia.
                      </p>
                    </div>
                  )}

                  {/* Opsi Bayar Nanti di Kasir Sekolah / Transfer Manual */}
                  <div className="pt-2 border-t border-slate-200/80">
                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                      <div>
                        <p className="text-xs font-bold text-slate-800 flex items-center space-x-1.5">
                          <SchoolIcon className="w-4 h-4 text-emerald-700" />
                          <span>Ingin Bayar Nanti di Kasir Sekolah / Transfer Bank?</span>
                        </p>
                        <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                          Nomor registrasi ananda sudah aman tersimpan. Pembayaran formulir bisa diselesaikan di kantor tata usaha sekolah.
                        </p>
                      </div>
                      <Link
                        href={`/portal/ppdb/${createdResult.registrationNo}`}
                        className="w-full sm:w-auto px-4 py-2 rounded-xl bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-bold shrink-0 transition-colors flex items-center justify-center space-x-1.5 shadow-2xs"
                      >
                        <span>Buka Portal Murid Saja</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto shadow-sm">
                    <Check className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-bold text-emerald-900">
                    Pembayaran Lunas Terverifikasi!
                  </h3>
                  <p className="text-xs text-emerald-800 max-w-md mx-auto">
                    Kuitansi resmi dan notifikasi telah dikirimkan via WhatsApp ke nomor{' '}
                    <span className="font-bold">{formData.motherPhone}</span>.
                  </p>
                  <div className="pt-3 flex flex-col sm:flex-row items-center justify-center gap-3">
                    <Link
                      href={`/portal/ppdb/${createdResult.registrationNo}`}
                      className="py-2.5 px-5 rounded-xl bg-emerald-700 text-white text-xs font-bold shadow-sm hover:bg-emerald-800 transition-colors"
                    >
                      Buka Portal Murid & Unduh Kartu Tes →
                    </Link>
                    <Link
                      href="/"
                      className="py-2.5 px-4 rounded-xl bg-white border border-emerald-300 text-emerald-800 text-xs font-semibold hover:bg-emerald-50"
                    >
                      Kembali ke Beranda
                    </Link>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Navigation Buttons (Prev & Next) */}
          {currentStep < 6 && (
            <div className="mt-10 pt-6 border-t border-slate-200 flex items-center justify-between">
              {currentStep > 1 ? (
                <button
                  type="button"
                  onClick={() => setCurrentStep(currentStep - 1)}
                  className="py-3 px-5 sm:px-6 rounded-xl border border-slate-200 text-xs sm:text-sm font-bold text-slate-700 hover:bg-slate-50 transition-all flex items-center gap-2 tactile-press cursor-pointer shadow-2xs"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Sebelumnya</span>
                </button>
              ) : (
                <div />
              )}

              <button
                type="button"
                onClick={handleNextStep}
                disabled={isLoading || (currentStep === 1 && activeSchool.isPpdbOpen === false)}
                className={`py-3 px-6 sm:px-8 rounded-xl text-white text-xs sm:text-sm font-bold shadow-sm transition-all flex items-center gap-2 cursor-pointer tactile-press ${
                  currentStep === 1 && activeSchool.isPpdbOpen === false
                    ? 'bg-slate-400 cursor-not-allowed opacity-60'
                    : 'bg-[#064E3B] hover:bg-emerald-800 disabled:opacity-70'
                }`}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Memproses...</span>
                  </>
                ) : (
                  <>
                    <span>
                      {currentStep === 1 && activeSchool.isPpdbOpen === false
                        ? 'Pendaftaran Ditutup'
                        : currentStep === 5
                        ? 'Kirim Formulir & Bayar'
                        : 'Langkah Selanjutnya'}
                    </span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Footer copyright */}
      <div className="max-w-4xl mx-auto w-full text-center text-xs text-slate-400 pt-6">
        © 2026 Yayasan Pendidikan Imam Bonjol Majalengka. Pendaftaran Resmi PPDB Online.
      </div>
    </div>
  );
}

export default function PPDBRegistrationPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Memuat formulir...</div>}>
      <PPDBFormContent />
    </Suspense>
  );
}
