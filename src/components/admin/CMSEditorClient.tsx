'use client';

import React, { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  Save,
  Check,
  ExternalLink,
  Building,
  Phone,
  Layers,
  AlertCircle,
  Eye,
  Edit3,
  Image as ImageIcon,
  Plus,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Award,
  BookOpen,
  GraduationCap,
  ShieldCheck,
  CheckCircle2,
  Users,
  Calendar,
  MessageSquare,
  MapPin,
  Clock,
  Mail,
  Sliders,
  Upload,
  Newspaper,
  X,
  Share2,
  HeartHandshake,
  Building2,
  Compass,
  ArrowRight,
  Sun,
  CreditCard,
  Tag,
  Percent,
  MessageCircle,
  FileText,
  Download,
  ZoomIn,
  Copy,
  Sparkles
} from 'lucide-react';
import { UnitSlideData } from '@/components/landing/UnitHeroSlider';
import { compressImageClient } from '@/lib/image-compress';
import { AffiliateCMSData, DEFAULT_AFFILIATE_CONTENT } from '@/types/affiliate-cms';

export interface SDKarakterPillar {
  number: string;
  title: string;
  tagline: string;
  desc: string;
  points: string[];
}

export interface SDKarakterHabit {
  title: string;
  sub: string;
  desc: string;
}

export interface SDKarakterData {
  heroHeadline?: string;
  heroDescription?: string;
  threePillars: SDKarakterPillar[];
  sevenHabits: SDKarakterHabit[];
}

export interface SDProfilData {
  visiText: string;
  misiList: string[];
  identitasList: Array<{ label: string; value: string }>;
}

export interface SMPKarakterPillar {
  number: string;
  title: string;
  subtitle: string;
  desc: string;
  points: string[];
}

export interface SMPKarakterData {
  heroTitle?: string;
  heroSubtitle?: string;
  pillars: SMPKarakterPillar[];
}

export interface SMPProfilData {
  visi: string;
  misi: string[];
  legalitas: Array<{ label: string; value: string }>;
}

export interface CMSInitialData {
  hero: {
    headline?: string;
    subheadline?: string;
    academicYear?: string;
    quotaRemaining?: number;
    slides?: UnitSlideData[];
  };
  identity: {
    name: string;
    badgeText: string;
    tagline: string;
    schoolAddress: string;
    mapsUrl?: string;
    whatsappNumber: string;
    officerName?: string;
    email?: string;
    consultationHours?: string;
  };
  stats: Array<{ label: string; value: string; subtext?: string; badge?: string }>;
  values: Array<{ title: string; description: string; icon?: string }>;
  programs: Array<{ title: string; desc: string; badge: string }>;
  facilities: Array<{ name: string; image: string; desc: string; category?: string }>;
  testimonials: Array<{ name: string; role: string; quote: string }>;
  tuition: {
    registrationFee: number;
    monthlyTuition: number;
    developmentFee: number;
    buildingFee?: number;
    learningFacilities?: number;
    uniformIkhwan?: number;
    uniformAkhwat?: number;
    bookPackage?: number;
    studentActivities?: number;
    totalIkhwan?: number;
    totalAkhwat?: number;
    quota?: number;
    waveName?: string;
    discounts?: Array<{
      title: string;
      target: string;
      saving: number;
      finalBuildingFee?: number;
    }>;
    waves?: Array<{
      name: string;
      period: string;
      status: string;
    }>;
  };
  affiliate?: AffiliateCMSData;
  presetImages?: PresetImage[];
  sdKarakter?: SDKarakterData;
  sdProfil?: SDProfilData;
  smpKarakter?: SMPKarakterData;
  smpProfil?: SMPProfilData;
}

interface CMSEditorClientProps {
  schoolSlug: string;
  schoolName: string;
  badgeText: string;
  initialData: CMSInitialData;
  isSuperAdmin?: boolean;
  userRole?: string;
}

interface PresetImage {
  label: string;
  url: string;
  forUnits?: string[];
}

const PRESET_IMAGES_DEFAULT: PresetImage[] = [
  // Foto Asli Kegiatan Murid & Guru Al-Afiyah (Dokumentasi Lapangan Nyata)
  { label: 'Halaqah Tahfidz SDIT', url: '/images/sd-activity-halaqah-tahfidz.jpg', forUnits: ['sd', 'foundation'] },
  { label: 'Belajar Kelas 6B SDIT', url: '/images/sd-activity-classroom-6b.jpg', forUnits: ['sd', 'foundation'] },
  { label: 'Outing Rafting SMP IT Majalengka', url: '/images/smp-outing-1.jpg', forUnits: ['smp', 'foundation'] },
  { label: 'Outing Bersama SMP IT', url: '/images/smp-outing-2.jpg', forUnits: ['smp', 'foundation'] },
  { label: 'Praktik Menanam Bibit SDIT', url: '/images/sd-planting-guidance.jpg', forUnits: ['sd', 'foundation'] },
  { label: 'Edukasi Kolam Ikan SDIT', url: '/images/sd-field-fish-feeding.jpg', forUnits: ['sd', 'foundation'] },
  { label: 'Juara Turnamen Futsal SDIT', url: '/images/sd-futsal-champion.jpg', forUnits: ['sd', 'foundation'] },
  { label: 'Shalat Berjamaah Murid SDIT', url: '/images/sd-activity-shalat-berjamaah.jpg', forUnits: ['sd', 'foundation'] },
  { label: 'Praktik Multimedia SDIT', url: '/images/sd-activity-multimedia-learning.jpg', forUnits: ['sd', 'foundation'] },
  { label: 'Brosur Resmi SPMB SDIT', url: '/images/sd-spmb-brosur.jpg', forUnits: ['sd', 'foundation'] },
];

export const DEFAULT_SD_KARAKTER: SDKarakterData = {
  heroHeadline: 'Pilar Karakter & Nilai Islami SDIT Al-Afiyah',
  heroDescription: 'Mendidik murid di SDIT Al-Afiyah tidak hanya unggul dalam kognitif sains, tetapi berakar kuat pada nilai-nilai adab nabawiyah, fitrah kemandirian, dan cinta Al-Qur\'an.',
  threePillars: [
    {
      number: '01',
      title: 'Mendidik dengan Sunnah & Karakter Nabawiyah',
      tagline: 'Iman Sebelum Al-Qur\'an • Adab Sebelum Ilmu',
      desc: 'Mendidik murid dengan keteladanan sunnah Rasulullah ﷺ, menanamkan akhlak mahmudah dan adab mulia sejak dini. Pembiasaan shalat berjamaah tepat waktu, hafalan doa harian, serta kultum da\'i cilik melatih generasi yang beriman kokoh dan beradab luhur.',
      points: [
        'Pembiasaan shalat berjamaah fardhu dan adab di masjid',
        'Pelatihan muhadharah & da\'i cilik berani tampil',
        'Keteladanan adab birrul walidain kepada orang tua dan guru'
      ]
    },
    {
      number: '02',
      title: 'Smart, Literasi & Tahfidz Al-Qur\'an',
      tagline: 'Fashihah Bacaan • Mutqin Hafalan • Logika Tajam',
      desc: 'Pembelajaran terpadu yang memadukan kurikulum nasional dan penguatan literasi numerasi modern dengan bimbingan tahfidz Al-Qur\'an Juz 30 mutqin. Menggunakan metode talaqqi tartil yang ramah anak dan membahagiakan murid.',
      points: [
        'Target kelulusan Tahfidz Juz 30 Mutqin',
        'Basic literasi, numerasi kontekstual, dan logika sains',
        'Suasana kelas multimedia yang asri, hangat, dan menyenangkan'
      ]
    },
    {
      number: '03',
      title: 'Outdoor Learning & Pelatihan Kemandirian',
      tagline: 'Agro-Sains Kontekstual • Tangguh & Berwawasan Alam',
      desc: 'Eksplorasi kontekstual di alam terbuka dan greenhouse bambu P4S An-Nabawiyah. Murid mempraktikkan langsung budidaya perikanan biofloc, semai bibit sayur, pemetaan bakat pribadi (talent mapping), serta pembinaan karakter mandiri menyambut fase aqil-baligh.',
      points: [
        'Field study edukasi pertanian & perikanan di P4S An-Nabawiyah',
        'Pelatihan kemandirian praktis menyambut fase aqil-baligh',
        'Penyaluran minat bakat (Futsal juara 2, pidato, seni islami)'
      ]
    }
  ],
  sevenHabits: [
    { title: 'Salimul Aqidah', sub: 'Aqidah yang Bersih & Lurus', desc: 'Menanamkan tauhidullah murni sejak dini, mencintai Allah dan Rasul-Nya di atas segalanya.' },
    { title: 'Shahihul Ibadah', sub: 'Ibadah yang Benar Sesuai Sunnah', desc: 'Membimbing tata cara wudhu, shalat berjamaah, dan doa harian sesuai tuntunan Rasulullah ﷺ.' },
    { title: 'Matinul Khuluq', sub: 'Akhlak yang Kokoh & Santun', desc: 'Beradab kepada orang tua, menghormati ustadz/ustadzah, serta berkasih sayang kepada sesama.' },
    { title: 'Qadirun \'alal Kasbi', sub: 'Mandiri & Terampil', desc: 'Mampu merapikan perlengkapan sendiri, berjiwa wirausaha islami, dan tidak bergantung pada orang lain.' },
    { title: 'Mutsaqqoful Fikri', sub: 'Cerdas & Berwawasan Luas', desc: 'Gemar membaca buku, bernalar kritis dalam sains, serta fasih dalam literasi kontekstual.' },
    { title: 'Qawiyyul Jismi', sub: 'Jasmani yang Sehat & Tangguh', desc: 'Menjaga kebersihan fisik, pola makan halal-thayyib, dan aktif berolahraga (futsal & beladiri).' },
    { title: 'Nafi\'un Lighairihi', sub: 'Bermanfaat Bagi Sesama', desc: 'Suka menolong teman, berinfak sedekah subuh, dan menyebarkan kebaikan di lingkungan sekitar.' }
  ]
};

export const DEFAULT_SD_PROFIL: SDProfilData = {
  visiText: 'Mendidik generasi sholeh, cerdas, mandiri, berwawasan luas, dan berakhlakul islami.',
  misiList: [
    'Menumbuhkan nilai-nilai tauhid dalam seluruh aspek pembelajaran dan pembiasaan.',
    'Mengajarkan aqidah dan ibadah yang sohihah sesuai dengan Al-Qur’an dan As-Sunnah sesuai dengan pemahaman salafus sholih.',
    'Membiasakan anak dengan akhlak Islami dalam keseharian.',
    'Mendidik anak agar kreatif dan inovatif.',
    'Menanamkan rasa cinta yang mendalam kepada Allah ﷻ dan Rasul-Nya ﷺ.',
    'Berusaha mendidik murid-murid agar menguasai semua mata pelajaran baik umum maupun agama secara komprehensif.'
  ],
  identitasList: [
    { label: 'Nama Sekolah', value: 'SDIT Al-Afiyah Majalengka' },
    { label: 'Status Akreditasi', value: 'Terakreditasi B (BAN-SM)' },
    { label: 'Yayasan Penyelenggara', value: 'Yayasan Pendidikan Imam Bonjol (YPIB) Majalengka' },
    { label: 'Gugus Sekolah', value: 'Sekolah Imbas dari 7 Sekolah di Gugus 3 Nusa Indah, Kec. Majalengka' },
    { label: 'Kurikulum Pembelajaran', value: 'Perpaduan Kurikulum Diknas (K-13) & Kurikulum Yayasan berpijak pada Iman dan Taqwa' },
    { label: 'Program Unggulan', value: 'Tahsin dan Tahfidz Al-Qur\'an' },
    { label: 'Jenjang Pendidikan', value: 'Sekolah Dasar Islam Terpadu (Kelas 1 - 6)' },
    { label: 'Alamat Sekolah', value: 'Lingkungan Giri Asih - Jl. Gerakan Koperasi, Kel. Majalengka Kulon, Kec. Majalengka, Kab. Majalengka, Jawa Barat 45411' },
    { label: 'Telepon / WhatsApp', value: '0813-1013-9001 (Layanan Terpadu Tata Usaha & SPMB)' },
    { label: 'Email Resmi', value: 'sditalafiyahmjl@gmail.com' }
  ]
};

export const DEFAULT_SMP_KARAKTER: SMPKarakterData = {
  heroTitle: 'SCD (Student Character Development) & Mutaba\'ah Digital',
  heroSubtitle: 'Program pembinaan karakter murid remaja SMP IT Al-Afiyah: Penanaman adab nabawiyah, kepemimpinan (leadership), kemandirian, dan monitoring ibadah harian berbasis Mutaba\'ah Digital.',
  pillars: [
    {
      number: '01',
      title: 'Akidah Shahihah & Disiplin Ibadah',
      subtitle: 'Shalat Berjamaah • Dzikir Pagi Petang • Mutaba\'ah Digital',
      desc: 'Menancapkan keyakinan tauhid yang murni serta membiasakan shalat fardhu 5 waktu tepat waktu berjamaah. Setiap murid mencatat dan merefleksikan ibadah harian mereka melalui aplikasi Mutaba\'ah Digital yang terpantau langsung oleh wali murid dan asatidz.',
      points: [
        'Pembiasaan shalat berjamaah di masjid sekolah',
        'Dzikir pagi dan petang Al-Ma\'tsurat sebagai benteng ruhiyah',
        'Target tilawah mandiri One Day Half/One Juz',
        'Pemantauan digital terintegrasi antara rumah dan sekolah'
      ]
    },
    {
      number: '02',
      title: 'Adab Sebelum Ilmu & Etika Pergaulan',
      subtitle: 'Birrul Walidain • Santun Bertutur • Anti-Bullying',
      desc: 'Usia remaja adalah masa pencarian identitas diri. SMP IT Al-Afiyah menanamkan adab penuntut ilmu, rasa hormat kepada orang tua dan guru, serta membangun kultur persaudaraan islami (ukhuwah) yang bersih dari bullying dan kekerasan verbal.',
      points: [
        'Keteladanan adab harian murid bersama dewan asatidz',
        'Etika bergaul syar\'i sesuai bimbingan Al-Qur\'an dan Sunnah',
        'Kultur saling menghargai, tolong-menolong, dan empati sosial',
        'Edukasi literasi digital dan adab bermedia sosial yang bijak'
      ]
    },
    {
      number: '03',
      title: 'Leadership & Jiwa Kepemimpinan',
      subtitle: 'Organisasi Murid • LDKS • Keberanian Berpendapat',
      desc: 'Mencetak calon pemimpin masa depan yang berani berbicara, berjiwa solutif, dan mampu mengelola tanggung jawab. Murid dilatih berorganisasi, memimpin halaqah kultum, dan menyelenggarakan event sekolah.',
      points: [
        'Latihan Dasar Kepemimpinan Murid (LDKS)',
        'Organisasi Murid Intra Sekolah (OSIS SMP IT)',
        'Khitabah (latihan orasi/pidato) 3 bahasa: Arab, Inggris, Indonesia',
        'Manajemen proyek bakti sosial murid untuk masyarakat'
      ]
    },
    {
      number: '04',
      title: 'Kemandirian & Ketangguhan Fisik',
      subtitle: 'Kedisiplinan Diri • Futsal Development • Ekskul Terarah',
      desc: 'Murid remaja diajarkan merawat kebersihan diri, merapikan sarana belajar, serta melatih ketahanan fisik melalui Futsal Development Program dan kepanduan Pramuka SIT.',
      points: [
        'Kemandirian mengelola waktu dan jadwal belajar mandiri',
        'Pembinaan stamina dan ketangkasan fisik lewat olahraga terprogram',
        'Keterampilan hidup praktis (life skills) tata boga & wirausaha',
        'Ketangguhan mental dalam menghadapi tantangan zaman'
      ]
    }
  ]
};

export const DEFAULT_SMP_PROFIL: SMPProfilData = {
  visi: 'Menjadi Sekolah Menengah Pertama Islam Terpadu Unggul dalam Mencetak Generasi Smart & Religious yang Berakhlak Qur\'ani, Berwawasan Global, dan Mandiri.',
  misi: [
    'Menanamkan pondasi akidah yang lurus dan pembiasaan adab nabawiyah dalam kehidupan sehari-hari murid.',
    'Membimbing murid menuntaskan target hafalan 3 hingga 5+ juz dengan kaidah tajwid makharijul huruf yang kokoh.',
    'Menciptakan bi\'ah lughawiyyah (lingkungan berbahasa) agar murid fasih bertutur dan memahami literatur Arab.',
    'Membangun kepemimpinan, kemandirian, kedisiplinan, dan tanggung jawab sosial murid remaja islami.',
    'Memantau keteraturan ibadah harian melalui aplikasi digital yang menghubungkan siswa, orang tua, dan asatidz.',
    'Mewadahi talenta murid melalui Futsal Development Program, tata boga, pramuka, dan karya sains.'
  ],
  legalitas: [
    { label: 'Nama Sekolah Resmi', value: 'SMP IT Al-Afiyah Majalengka' },
    { label: 'Status Akreditasi', value: 'Terakreditasi A (BAN-S/M Resmi)' },
    { label: 'Tagline & Semboyan', value: 'Be Smart & Religious' },
    { label: 'Yayasan Penyelenggara', value: 'Yayasan Pendidikan Imam Bonjol (YPIB) Majalengka' },
    { label: 'Jenjang Pendidikan', value: 'Sekolah Menengah Pertama Islam Terpadu (Kelas VII – IX)' },
    { label: 'Kurikulum Utama', value: 'Integrasi Kurikulum Nasional & Kurikulum Pesantren Terpadu Al-Afiyah' },
    { label: 'Target Capaian Tahfidz', value: '3 Juz Dasar (Juz 28, 29, 30) & Kelas Unggulan 5+ Juz Mutqin' },
    { label: 'Penguasaan Bahasa', value: 'Bahasa Arab Aktif (Lisan & Tulisan) & Penguatan Bahasa Inggris' },
    { label: 'Alamat Sekolah', value: 'Lingkungan Giri Asih - Jl. Gerakan Koperasi No. 110, Majalengka Wetan, Kec. Majalengka, Kab. Majalengka 45411' },
    { label: 'Hotline Resmi / WhatsApp', value: '0822-4935-7893' },
    { label: 'Rekening Resmi SPMB', value: 'Bank Muamalat 1360012405 a.n SMP IT Al Afiyah' }
  ]
};

export default function CMSEditorClient({
  schoolSlug,
  schoolName,
  badgeText,
  initialData,
  isSuperAdmin = false,
  userRole = 'ADMIN_TK'
}: CMSEditorClientProps) {
  const router = useRouter();

  const isFoundation = schoolSlug === 'foundation';
  // Only Superadmin on Foundation CMS can switch scopes; unit accounts are strictly locked to their own school
  const canSwitchUnit = isSuperAdmin && isFoundation;

  // Preset images — persisted in database backend & localStorage per schoolSlug
  const STORAGE_KEY = `cms_preset_images_${schoolSlug}`;
  const DELETED_KEY = `cms_deleted_presets_${schoolSlug}`;

  const getInitialPresets = (): PresetImage[] => {
    let deletedUrls: string[] = [];
    if (typeof window !== 'undefined') {
      try {
        deletedUrls = JSON.parse(localStorage.getItem(DELETED_KEY) || '[]');
      } catch {}
    }
    const deletedSet = new Set<string>(deletedUrls);
    // Explicit blacklist of AI images so they NEVER reappear
    deletedSet.add('/images/sd-hero-activity.jpg');
    deletedSet.add('/images/arc-tahfidz.jpg');
    deletedSet.add('/images/arc-ustadz.jpg');
    deletedSet.add('/images/smp-hero-bilingual.jpg');
    deletedSet.add('/images/tk-hero-kids.jpg');
    deletedSet.add('/images/tk-hero-garden.jpg');
    deletedSet.add('/images/smp-hero-fullday.jpg');
    deletedSet.add('/images/smp-hero-pesantren.jpg');
    deletedSet.add('/images/eduka-hero-campus.jpg');
    deletedSet.add('/images/affiliate-hero-youth.jpg');
    deletedSet.add('/images/hero-student.jpg');
    deletedSet.add('/images/student-girl.jpg');

    // 1. If backend database has saved preset images, use as source of truth
    if (initialData.presetImages && Array.isArray(initialData.presetImages)) {
      const filteredDb = initialData.presetImages.filter((p) => !deletedSet.has(p.url));
      if (filteredDb.length > 0) return filteredDb;
    }

    const defaults = PRESET_IMAGES_DEFAULT.filter(
      (img) => (!img.forUnits || img.forUnits.includes(schoolSlug)) && !deletedSet.has(img.url)
    );
    if (typeof window === 'undefined') return defaults;
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed: PresetImage[] = JSON.parse(stored);
        return parsed.filter((p) => !deletedSet.has(p.url));
      }
      return defaults;
    } catch {}
    return defaults;
  };

  const [presetImages, setPresetImages] = useState<PresetImage[]>(getInitialPresets);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync presets to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(presetImages));
    } catch {}
  }, [presetImages, STORAGE_KEY]);

  const handleRemovePresetImage = async (urlToRemove: string) => {
    const updated = presetImages.filter((img) => img.url !== urlToRemove);
    setPresetImages(updated);
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        const deletedArr: string[] = JSON.parse(localStorage.getItem(DELETED_KEY) || '[]');
        if (!deletedArr.includes(urlToRemove)) {
          deletedArr.push(urlToRemove);
          localStorage.setItem(DELETED_KEY, JSON.stringify(deletedArr));
        }
      } catch {}
    }

    // Persist mutation directly to database backend so re-render/fetch never resurrects it
    try {
      await fetch('/api/admin/cms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          schoolSlug,
          sectionKey: 'preset_images',
          contentJson: updated,
        }),
      });
    } catch (err) {
      console.warn('Gagal menyimpan perubahan galeri ke server:', err);
    }
  };

  const handleUploadImage = useCallback(async (file: File): Promise<string | null> => {
    setIsUploading(true);
    setUploadError(null);
    try {
      // 1. Compress image client-side to prevent HTTP 413 "Request Entity Too Large"
      const compressed = await compressImageClient(file, 1600, 1200, 0.82);

      const fd = new FormData();
      fd.append('file', compressed.file);
      fd.append('schoolSlug', schoolSlug);

      let finalUrl = compressed.dataUrl; // Ultra-safe fallback: instant base64 data URL
      let finalLabel = file.name.replace(/\.[^/.]+$/, '');

      try {
        const res = await fetch('/api/admin/upload', { method: 'POST', body: fd });
        const text = await res.text();
        let data: any = {};
        try {
          data = JSON.parse(text);
        } catch {
          if (res.status === 413 || text.includes('Request Entity Too Large')) {
            console.warn('Vercel 413 encountered, using client-compressed Data URL fallback.');
          }
        }

        if (res.ok && data.success && data.url) {
          finalUrl = data.url;
          if (data.label) finalLabel = data.label;
        }
      } catch (uploadErr) {
        console.warn('API upload fallback to client data URL:', uploadErr);
        // Seamless fallback to finalUrl = compressed.dataUrl
      }

      // Add uploaded image to preset list (appears first)
      const newPreset: PresetImage = {
        label: finalLabel,
        url: finalUrl,
        forUnits: [schoolSlug],
      };
      const updated = [newPreset, ...presetImages.filter(p => p.url !== finalUrl)];
      setPresetImages(updated);
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        } catch {}
      }

      // Persist to database backend
      try {
        await fetch('/api/admin/cms', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            schoolSlug,
            sectionKey: 'preset_images',
            contentJson: updated,
          }),
        });
      } catch {}

      return finalUrl;
    } catch (err: unknown) {
      setUploadError(err instanceof Error ? err.message : 'Gagal memproses unggahan foto.');
      return null;
    } finally {
      setIsUploading(false);
    }
  }, [schoolSlug, presetImages, STORAGE_KEY]);

  const availablePresetImages = presetImages;


  type TabType =
    | 'hero'
    | 'identity'
    | 'stats'
    | 'values'
    | 'programs'
    | 'facilities'
    | 'testimonials'
    | 'tuition'
    | 'affiliate'
    | 'sd_karakter'
    | 'sd_profil'
    | 'smp_karakter'
    | 'smp_profil';

  const [activeTab, setActiveTab] = useState<TabType>('hero');
  const [viewMode, setViewMode] = useState<'editor' | 'preview'>('editor');
  const [formData, setFormData] = useState<CMSInitialData>({
    ...initialData,
    affiliate: initialData.affiliate || DEFAULT_AFFILIATE_CONTENT,
    sdKarakter: initialData.sdKarakter || DEFAULT_SD_KARAKTER,
    sdProfil: initialData.sdProfil || DEFAULT_SD_PROFIL,
    smpKarakter: initialData.smpKarakter || DEFAULT_SMP_KARAKTER,
    smpProfil: initialData.smpProfil || DEFAULT_SMP_PROFIL,
  });

  // Active slide index for hero slider manager
  const [selectedSlideIndex, setSelectedSlideIndex] = useState<number>(0);

  // Status state
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Simulator state for SMP tuition preview
  const [smpPreviewGender, setSmpPreviewGender] = useState<'ikhwan' | 'akhwat'>('ikhwan');
  const [smpPreviewDiscount, setSmpPreviewDiscount] = useState<'sdit' | 'umum' | 'normal'>('sdit');
  const [smpActivePoster, setSmpActivePoster] = useState<string>('/images/smp-spmb-biaya.png');
  const [copiedBankAcc, setCopiedBankAcc] = useState<boolean>(false);

  // Fallback slides if empty
  const defaultSdSlides: UnitSlideData[] = [
    {
      id: 1,
      badge: 'SPMB T.A. 2027/2028 • TELAH DIBUKA',
      titlePart1: 'Bukan Sekedar Tempat Belajar, Namun Juga ',
      titleHighlight: 'Tempat Bertumbuh',
      titlePart2: '',
      description: 'Mencetak generasi sholeh, cerdas, mandiri, berwawasan, dan berakhlakul islami dengan prinsip Smart Akhlak Fitrah serta bimbingan metode karakter nabawiyah.',
      primaryCtaText: 'Daftar SPMB SDIT',
      primaryCtaLink: '/ppdb/daftar?school=sd',
      secondaryCtaText: 'WhatsApp (0813-1013-9001)',
      secondaryCtaLink: `https://wa.me/${formData.identity.whatsappNumber || '6281310139001'}`,
      image: '/images/sd-hero-greenhouse.jpg',
      trustItems: [
        { icon: 'shield' as const, text: 'Kurikulum Terpadu & Karakter Nabawiyah' },
        { icon: 'check' as const, text: 'Lingkungan Asri & Ramah Anak' },
        { icon: 'award' as const, text: 'Iman Sebelum Qur’an & Tahfidz' },
        { icon: 'calendar' as const, text: 'Formulir: Rp 250.000' }
      ]
    },
    {
      id: 2,
      badge: 'SPMB T.A. 2027/2028 • TELAH DIBUKA',
      titlePart1: 'Bukan Sekedar Tempat Belajar, Namun Juga ',
      titleHighlight: 'Tempat Bertumbuh',
      titlePart2: '',
      description: 'Mencetak generasi sholeh, cerdas, mandiri, berwawasan, dan berakhlakul islami dengan prinsip Smart Akhlak Fitrah serta bimbingan metode karakter nabawiyah.',
      primaryCtaText: 'Daftar SPMB SDIT',
      primaryCtaLink: '/ppdb/daftar?school=sd',
      secondaryCtaText: 'WhatsApp (0813-1013-9001)',
      secondaryCtaLink: `https://wa.me/${formData.identity.whatsappNumber || '6281310139001'}`,
      image: '/images/sd-hero-garden.jpg',
      trustItems: [
        { icon: 'shield' as const, text: 'Kurikulum Terpadu & Karakter Nabawiyah' },
        { icon: 'check' as const, text: 'Lingkungan Asri & Ramah Anak' },
        { icon: 'award' as const, text: 'Iman Sebelum Qur’an & Tahfidz' },
        { icon: 'calendar' as const, text: 'Formulir: Rp 250.000' }
      ]
    },
    {
      id: 3,
      badge: 'SPMB T.A. 2027/2028 • TELAH DIBUKA',
      titlePart1: 'Bukan Sekedar Tempat Belajar, Namun Juga ',
      titleHighlight: 'Tempat Bertumbuh',
      titlePart2: '',
      description: 'Mencetak generasi sholeh, cerdas, mandiri, berwawasan, dan berakhlakul islami dengan prinsip Smart Akhlak Fitrah serta bimbingan metode karakter nabawiyah.',
      primaryCtaText: 'Daftar SPMB SDIT',
      primaryCtaLink: '/ppdb/daftar?school=sd',
      secondaryCtaText: 'WhatsApp (0813-1013-9001)',
      secondaryCtaLink: `https://wa.me/${formData.identity.whatsappNumber || '6281310139001'}`,
      image: '/images/sd-hero-greenhouse.jpg',
      trustItems: [
        { icon: 'shield' as const, text: 'Kurikulum Terpadu & Karakter Nabawiyah' },
        { icon: 'check' as const, text: 'Lingkungan Asri & Ramah Anak' },
        { icon: 'award' as const, text: 'Iman Sebelum Qur’an & Tahfidz' },
        { icon: 'calendar' as const, text: 'Formulir: Rp 250.000' }
      ]
    }
  ];

  const slides = formData.hero.slides && formData.hero.slides.length > 0
    ? formData.hero.slides
    : schoolSlug === 'sd'
    ? defaultSdSlides
    : [
        {
          id: 1,
          badge: badgeText,
          titlePart1: 'Membangun Generasi ',
          titleHighlight: "Qur'ani & Unggul",
          titlePart2: ' di Majalengka',
          description: 'Pendidikan Islam terpadu dengan integrasi kurikulum nasional, tahfidz Al-Qur’an tartil, dan sains modern.',
          primaryCtaText: 'Daftar PPDB Sekarang',
          primaryCtaLink: schoolSlug === 'foundation' ? '/ppdb/daftar' : `/ppdb/daftar?school=${schoolSlug}`,
          secondaryCtaText: 'Konsultasi WhatsApp',
          secondaryCtaLink: `https://wa.me/${formData.identity.whatsappNumber}`,
          image: schoolSlug === 'tk' ? '/images/tk-hero-kids.jpg' : schoolSlug === 'sd' ? '/images/sd-hero-greenhouse.jpg' : schoolSlug === 'smp' ? '/images/smp-hero-fullday.jpg' : '/images/eduka-hero-campus.jpg',
          trustItems: [
            { icon: 'shield' as const, text: 'Terakreditasi A Resmi' },
            { icon: 'award' as const, text: 'Tahfidz Tartil & Mutqin' },
            { icon: 'calendar' as const, text: 'T.A. 2027/2028' },
            { icon: 'check' as const, text: 'Kurikulum Islam Terpadu' }
          ]
        }
      ];

  const currentSlide = slides[selectedSlideIndex] || slides[0];

  // Helper to update current slide
  const updateCurrentSlide = (field: keyof UnitSlideData, value: any) => {
    let cleanVal = value;
    if (field === 'titlePart2' && typeof cleanVal === 'string') {
      cleanVal = cleanVal.replace(/ananda/gi, '').trim();
    }
    const newSlides = [...slides];
    if (schoolSlug === 'sd' && field !== 'image' && field !== 'id') {
      // For SDIT, headline, badge, subtitle, and CTA are universal across all carousel slides
      newSlides.forEach((s, idx) => {
        newSlides[idx] = {
          ...newSlides[idx],
          [field]: cleanVal
        };
      });
    } else {
      newSlides[selectedSlideIndex] = {
        ...newSlides[selectedSlideIndex],
        [field]: cleanVal
      };
    }
    setFormData({
      ...formData,
      hero: {
        ...formData.hero,
        slides: newSlides
      }
    });
  };

  // Helper to add slide
  const handleAddSlide = () => {
    const newId = slides.length + 1;
    const newSlide: UnitSlideData = {
      id: newId,
      badge: `${badgeText} - SLIDE ${newId}`,
      titlePart1: 'Judul Bagian Awal ',
      titleHighlight: 'Teks Highlight',
      titlePart2: ' Bagian Penutup',
      description: 'Deskripsi pengantar slide banner yang menerangkan keunggulan atau agenda terbaru.',
      primaryCtaText: 'Daftar Online',
      primaryCtaLink: schoolSlug === 'foundation' ? '/ppdb/daftar' : `/ppdb/daftar?school=${schoolSlug}`,
      secondaryCtaText: 'Hubungi Panitia',
      secondaryCtaLink: `https://wa.me/${formData.identity.whatsappNumber}`,
      image: '/images/eduka-hero-campus.jpg',
      trustItems: [
        { icon: 'shield', text: 'Terakreditasi A' },
        { icon: 'award', text: 'Target Prestasi' },
        { icon: 'calendar', text: 'T.A. 2027/2028' },
        { icon: 'check', text: 'Bebas Biaya Tes' }
      ]
    };
    const newSlides = [...slides, newSlide];
    setFormData({
      ...formData,
      hero: {
        ...formData.hero,
        slides: newSlides
      }
    });
    setSelectedSlideIndex(newSlides.length - 1);
  };

  // Helper to remove slide
  const handleRemoveSlide = (idx: number) => {
    if (slides.length <= 1) {
      alert('Minimal harus terdapat 1 slide banner aktif.');
      return;
    }
    const newSlides = slides.filter((_, i) => i !== idx);
    setFormData({
      ...formData,
      hero: {
        ...formData.hero,
        slides: newSlides
      }
    });
    setSelectedSlideIndex(0);
  };

  // Save active section
  const handleSave = async () => {
    setIsSaving(true);
    setSaveSuccess(false);
    setErrorMessage('');

    try {
      let payloadToSave: any;
      if (activeTab === 'hero') {
        payloadToSave = {
          ...formData.hero,
          slides: slides
        };
      } else if (activeTab === 'identity') {
        payloadToSave = formData.identity;
      } else if (activeTab === 'stats') {
        payloadToSave = formData.stats;
      } else if (activeTab === 'values') {
        payloadToSave = formData.values;
      } else if (activeTab === 'programs') {
        payloadToSave = formData.programs;
      } else if (activeTab === 'facilities') {
        payloadToSave = formData.facilities;
      } else if (activeTab === 'testimonials') {
        payloadToSave = formData.testimonials;
      } else if (activeTab === 'tuition') {
        const devFee = formData.tuition.buildingFee || formData.tuition.developmentFee || 2500000;
        payloadToSave = {
          ...formData.tuition,
          developmentFee: devFee,
          buildingFee: devFee,
        };
      } else if (activeTab === 'affiliate') {
        payloadToSave = formData.affiliate || DEFAULT_AFFILIATE_CONTENT;
      } else if (activeTab === 'sd_karakter') {
        payloadToSave = formData.sdKarakter || DEFAULT_SD_KARAKTER;
      } else if (activeTab === 'sd_profil') {
        payloadToSave = formData.sdProfil || DEFAULT_SD_PROFIL;
      } else if (activeTab === 'smp_karakter') {
        payloadToSave = formData.smpKarakter || DEFAULT_SMP_KARAKTER;
      } else if (activeTab === 'smp_profil') {
        payloadToSave = formData.smpProfil || DEFAULT_SMP_PROFIL;
      }

      const res = await fetch('/api/admin/cms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          schoolSlug,
          sectionKey: activeTab,
          contentJson: payloadToSave
        })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        // Also persist current gallery preset images state
        try {
          await fetch('/api/admin/cms', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              schoolSlug,
              sectionKey: 'preset_images',
              contentJson: presetImages,
            }),
          });
        } catch {}

        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3500);
      } else {
        setErrorMessage(data.error || 'Gagal menyimpan perubahan ke server');
      }
    } catch (e) {
      console.error('Error saving CMS:', e);
      setErrorMessage('Terjadi kendala jaringan saat menyimpan');
    } finally {
      setIsSaving(false);
    }
  };

  const publicUrl = schoolSlug === 'foundation' ? '/' : `/${schoolSlug}`;
  const activePublicUrl =
    activeTab === 'affiliate'
      ? '/affiliate'
      : activeTab === 'sd_karakter'
      ? '/sd/karakter'
      : activeTab === 'sd_profil'
      ? '/sd/profil'
      : activeTab === 'smp_karakter'
      ? '/smp/karakter'
      : activeTab === 'smp_profil'
      ? '/smp/profil'
      : publicUrl;

  const [newKeywordInput, setNewKeywordInput] = useState('');

  const updateAffiliate = (key: keyof AffiliateCMSData, value: any) => {
    setFormData((prev) => ({
      ...prev,
      affiliate: {
        ...(prev.affiliate || DEFAULT_AFFILIATE_CONTENT),
        [key]: value,
      },
    }));
  };

  const updateSdKarakter = (updater: (prev: SDKarakterData) => SDKarakterData) => {
    setFormData((prev) => ({
      ...prev,
      sdKarakter: updater(prev.sdKarakter || DEFAULT_SD_KARAKTER),
    }));
  };

  const updateSdProfil = (updater: (prev: SDProfilData) => SDProfilData) => {
    setFormData((prev) => ({
      ...prev,
      sdProfil: updater(prev.sdProfil || DEFAULT_SD_PROFIL),
    }));
  };

  const updateSmpKarakter = (updater: (prev: SMPKarakterData) => SMPKarakterData) => {
    setFormData((prev) => ({
      ...prev,
      smpKarakter: updater(prev.smpKarakter || DEFAULT_SMP_KARAKTER),
    }));
  };

  const updateSmpProfil = (updater: (prev: SMPProfilData) => SMPProfilData) => {
    setFormData((prev) => ({
      ...prev,
      smpProfil: updater(prev.smpProfil || DEFAULT_SMP_PROFIL),
    }));
  };

  const handleAddKeyword = () => {
    if (!newKeywordInput.trim()) return;
    const current = formData.affiliate?.marqueeKeywords || DEFAULT_AFFILIATE_CONTENT.marqueeKeywords;
    updateAffiliate('marqueeKeywords', [...current, newKeywordInput.trim()]);
    setNewKeywordInput('');
  };

  const handleRemoveKeyword = (index: number) => {
    const current = formData.affiliate?.marqueeKeywords || DEFAULT_AFFILIATE_CONTENT.marqueeKeywords;
    updateAffiliate('marqueeKeywords', current.filter((_, i) => i !== index));
  };

  const renderAffiliateImagePicker = (
    label: string,
    subtext: string,
    currentUrl: string,
    onUpdate: (url: string) => void
  ) => {
    return (
      <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/90 space-y-3 min-w-0 w-full overflow-hidden">
        <div className="min-w-0">
          <h4 className="text-xs font-bold text-slate-800 truncate">{label}</h4>
          <p className="text-[11px] text-slate-500 line-clamp-1">{subtext}</p>
        </div>

        <div className="space-y-2.5 min-w-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="relative w-24 h-16 rounded-xl overflow-hidden border border-slate-200 bg-white shrink-0 shadow-2xs">
              {currentUrl ? (
                <Image
                  src={currentUrl}
                  alt={label}
                  fill
                  sizes="100px"
                  className="object-cover"
                  unoptimized={currentUrl.startsWith('data:')}
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-[10px] text-slate-400 bg-slate-100 p-1 text-center font-medium">
                  <span>(Kosong)</span>
                  <span className="text-[9px] text-slate-400">Tanpa Foto</span>
                </div>
              )}
            </div>

            <div className="flex-1 min-w-0 space-y-1.5">
              <input
                type="text"
                value={currentUrl}
                onChange={(e) => onUpdate(e.target.value)}
                placeholder="/images/... atau https://..."
                className="w-full min-w-0 text-xs font-mono text-slate-800 border border-slate-300 rounded-lg p-2 bg-white focus:outline-none focus:ring-2 focus:ring-[#2D7A70]/30 truncate"
              />
              <div className="flex items-center gap-1.5 flex-wrap">
                <label className="px-2.5 py-1.5 rounded-lg bg-[#184F48] hover:bg-[#123e38] text-white font-bold text-[11px] shadow-2xs flex items-center gap-1.5 cursor-pointer shrink-0">
                  <Upload className="w-3 h-3" />
                  <span>{isUploading ? 'Unggah...' : 'Unggah Foto'}</span>
                  <input
                    type="file"
                    accept="image/*"
                    disabled={isUploading}
                    className="hidden"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const url = await handleUploadImage(file);
                        if (url) onUpdate(url);
                      }
                    }}
                  />
                </label>

                {currentUrl && (
                  <button
                    type="button"
                    onClick={() => onUpdate('')}
                    className="px-2 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 text-[11px] font-bold border border-rose-200 shrink-0 cursor-pointer"
                    title="Kosongkan foto ini agar tidak ada foto AI"
                  >
                    Kosongkan
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Preset list as compact horizontal row */}
          {availablePresetImages.length > 0 && (
            <div className="pt-2 border-t border-slate-200/70 min-w-0">
              <div className="flex items-center gap-1 overflow-x-auto py-1 no-scrollbar">
                <span className="text-[10px] text-slate-400 font-semibold shrink-0">Preset:</span>
                {availablePresetImages.map((preset) => (
                  <button
                    key={preset.url}
                    type="button"
                    onClick={() => onUpdate(preset.url)}
                    className="text-[10px] font-medium px-2 py-0.5 rounded border border-slate-200 bg-white hover:bg-emerald-50 hover:border-emerald-300 text-slate-600 shrink-0 whitespace-nowrap cursor-pointer"
                    title={preset.label}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Top Header: Unit Switcher & Live Preview Toggles */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs flex flex-wrap items-center justify-between gap-4">
        {/* Unit Selector / Tenant Badge */}
        <div className="flex items-center space-x-3">
          {schoolSlug === 'smp' ? (
            <img
              src="/images/smp-logo.png"
              alt="Logo SMP IT Al-Afiyah"
              className="w-10 h-10 object-contain shrink-0"
            />
          ) : schoolSlug === 'sd' ? (
            <img
              src="/images/sd-logo.png"
              alt="Logo SDIT Al-Afiyah"
              className="w-10 h-10 object-contain shrink-0"
            />
          ) : (
            <div className="w-10 h-10 rounded-xl bg-[#184F48] text-white flex items-center justify-center font-bold text-sm shadow-xs shrink-0">
              {schoolSlug === 'foundation' ? 'YP' : schoolSlug.toUpperCase()}
            </div>
          )}
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">
              {canSwitchUnit ? 'Pilih Unit Sekolah' : 'Unit Pengelolaan'}
            </span>
            {canSwitchUnit ? (
              <select
                value={schoolSlug}
                onChange={(e) => {
                  const targetSlug = e.target.value;
                  if (targetSlug === 'foundation') {
                    router.push('/admin/foundation/cms');
                  } else {
                    router.push(`/admin/${targetSlug}/cms`);
                  }
                }}
                aria-label="Pilih Unit Sekolah"
                className="text-xs sm:text-sm font-bold text-slate-900 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg px-2.5 py-1 focus:outline-none focus:ring-2 focus:ring-[#2D7A70]/30 cursor-pointer"
              >
                <option value="foundation">Yayasan Pendidikan Imam Bonjol (Beranda Pusat)</option>
                <option value="tk">TK IT Al-Afiyah Majalengka</option>
                <option value="sd">SDIT Al-Afiyah Majalengka</option>
                <option value="smp">SMP IT Al-Afiyah Majalengka</option>
              </select>
            ) : (
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-xs sm:text-sm font-bold text-slate-800">
                  {schoolSlug === 'tk'
                    ? 'TK IT Al-Afiyah'
                    : schoolSlug === 'sd'
                    ? 'SDIT Al-Afiyah'
                    : schoolSlug === 'smp'
                    ? 'SMP IT Al-Afiyah'
                    : schoolName}
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold inline-block">
                  Aktif
                </span>
                {isSuperAdmin && (
                  <Link
                    href="/admin/foundation/cms"
                    className="text-[11px] font-semibold text-[#2D7A70] hover:text-[#184F48] hover:underline"
                  >
                    ← Kembali ke Yayasan
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>

        {/* View Mode & Save Actions */}
        <div className="flex items-center gap-2.5 ml-auto flex-wrap">
          {/* Mode Toggle */}
          <div className="bg-slate-100 p-1 rounded-xl flex items-center space-x-1 border border-slate-200">
            <button
              type="button"
              onClick={() => setViewMode('editor')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                viewMode === 'editor'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Edit3 className="w-3.5 h-3.5 text-[#2D7A70]" />
              <span>Formulir Editor</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('preview')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                viewMode === 'preview'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Eye className="w-3.5 h-3.5 text-[#2D7A70]" />
              <span>Pratinjau Live</span>
            </button>
          </div>

          <Link
            href={activePublicUrl}
            target="_blank"
            className="inline-flex items-center space-x-1.5 px-3 py-2 text-xs font-bold text-slate-700 bg-slate-50 hover:bg-slate-100 rounded-xl transition-colors border border-slate-200"
          >
            <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
            <span>{activeTab === 'affiliate' ? 'Buka Halaman /affiliate' : 'Buka Halaman Publik'}</span>
          </Link>

          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="inline-flex items-center space-x-2 px-5 py-2 text-xs font-bold text-white bg-[#184F48] hover:bg-[#123E38] disabled:opacity-50 rounded-xl transition-all shadow-sm cursor-pointer"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{isSaving ? 'Menyimpan...' : 'Simpan Perubahan'}</span>
          </button>
        </div>
      </div>

      {/* Alerts */}
      {saveSuccess && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center space-x-2 animate-fadeIn">
          <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>Perubahan berhasil disimpan! Data CMS dan profil unit telah tersinkronisasi di cloud.</span>
        </div>
      )}

      {errorMessage && (
        <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center space-x-2 animate-fadeIn">
          <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="bg-white border border-slate-200 rounded-xl p-2 shadow-2xs flex items-center gap-1.5 overflow-x-auto">
        {[
          { id: 'hero', label: '1. Banner & Slide Hero', icon: ImageIcon },
          { id: 'identity', label: '2. Profil, Alamat & Kontak', icon: Building },
          { id: 'stats', label: '3. Counter Angka Statistik', icon: Award },
          { id: 'values', label: '4. Nilai Keunggulan', icon: ShieldCheck },
          { id: 'programs', label: '5. Program Pilihan', icon: BookOpen },
          { id: 'facilities', label: '6. Galeri & Fasilitas', icon: Layers },
          { id: 'testimonials', label: '7. Testimoni Wali Murid', icon: MessageSquare },
          { id: 'tuition', label: '8. Biaya PPDB & Kuota', icon: Sliders },
          ...(schoolSlug === 'foundation'
            ? [{ id: 'affiliate', label: '9. Landing Page Afiliasi', icon: Share2 }]
            : []),
          ...(schoolSlug === 'sd'
            ? [
                { id: 'sd_karakter', label: '9. Pilar Karakter (/sd/karakter)', icon: HeartHandshake },
                { id: 'sd_profil', label: '10. Profil & Visi Misi (/sd/profil)', icon: Building2 },
              ]
            : []),
          ...(schoolSlug === 'smp'
            ? [
                { id: 'smp_karakter', label: '9. Karakter & SCD (/smp/karakter)', icon: HeartHandshake },
                { id: 'smp_profil', label: '10. Profil & Legalitas (/smp/profil)', icon: Building2 },
              ]
            : []),
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as TabType)}
              className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-colors cursor-pointer ${
                isActive
                  ? 'bg-[#184F48] text-white shadow-2xs'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
        {/* Direct Action Links to Dedicated Managers */}
        <div className="flex items-center gap-1.5 ml-auto pl-2 border-l border-slate-200">
          <Link
            href={schoolSlug === 'foundation' ? '/admin/foundation/users' : `/admin/${schoolSlug}/teachers`}
            className="flex items-center space-x-1.5 px-3 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-colors bg-emerald-50 text-emerald-900 hover:bg-emerald-100 border border-emerald-300 shadow-2xs cursor-pointer"
            title="Kelola Daftar Dewan Guru & Tenaga Kependidikan"
          >
            <GraduationCap className="w-3.5 h-3.5 text-emerald-700" />
            <span>Kelola Guru ↗</span>
          </Link>
          <Link
            href={schoolSlug === 'foundation' ? '/admin/foundation/cms' : `/admin/${schoolSlug}/news`}
            className="flex items-center space-x-1.5 px-3 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-colors bg-amber-50 text-amber-900 hover:bg-amber-100 border border-amber-300 shadow-2xs cursor-pointer"
            title="Kelola Warta, Artikel & Kajian Berita Sekolah"
          >
            <Newspaper className="w-3.5 h-3.5 text-amber-700" />
            <span>Kelola Berita ↗</span>
          </Link>
          <Link
            href={schoolSlug === 'foundation' ? '/admin/foundation/achievements' : `/admin/${schoolSlug}/achievements`}
            className="flex items-center space-x-1.5 px-3 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-colors bg-indigo-50 text-indigo-900 hover:bg-indigo-100 border border-indigo-300 shadow-2xs cursor-pointer"
            title="Kelola Data Piagam & Prestasi Juara Murid"
          >
            <Award className="w-3.5 h-3.5 text-indigo-700" />
            <span>Prestasi ↗</span>
          </Link>
        </div>
      </div>

      {/* LOCATION ANNOTATION HELPER BAR */}
      <div className="p-4 rounded-xl bg-amber-50/90 border border-amber-200/80 flex items-start space-x-3">
        <MapPin className="w-5 h-5 text-amber-700 flex-shrink-0 mt-0.5" />
        <div className="text-xs text-amber-900 leading-relaxed">
          <strong className="font-bold uppercase tracking-wider block text-amber-950 mb-0.5">
            📍 Lokasi Tampilan di Halaman Publik Website ({schoolName}):
          </strong>
          {activeTab === 'hero' && (
            <span>
              <strong>Bagian Paling Atas (Hero Banner Slider):</strong> Pengunjung pertama kali membuka beranda akan disambut oleh banner berganti otomatis ini. Judul highlight, deskripsi, gambar latar, tombol PPDB &amp; WhatsApp, serta 4 badge kecil di bawah deskripsi tampil persis di sini.
            </span>
          )}
          {activeTab === 'identity' && (
            <span>
              <strong>Identitas, Header &amp; Footer:</strong> Nama resmi unit, slogan, alamat lengkap sekolah, link Google Maps, email resmi, dan nomor kontak WhatsApp Panitia/CS tampil di logo pojok kiri atas, floating widget helpdesk, formulir pendaftaran resmi, serta seluruh footer halaman website.
            </span>
          )}
          {activeTab === 'stats' && (
            <span>
              <strong>Bar Counter Statistik Capaian:</strong> Tampil tepat di bawah banner beranda dengan kartu angka pencapaian penting ({schoolSlug === 'smp' ? 'Akreditasi A, Target Tahfidz 3-5 Juz, Diskon 70%, Smart & Religious' : schoolSlug === 'tk' ? 'Metode Sentra, Adab Nabawiyah, Rasio Kelas, Juz 30 Ceria' : 'Jumlah Murid, Guru Berpengalaman, Akreditasi, dan Target Tahfidz'}).
            </span>
          )}
          {activeTab === 'values' && (
            <span>
              <strong>Pilar Karakter &amp; Keunggulan Utama:</strong> Menampilkan pilar nilai pendidikan Islam terpadu yang meyakinkan orang tua calon murid.
            </span>
          )}
          {activeTab === 'programs' && (
            <span>
              <strong>Kartu Program Pilihan &amp; Peminatan:</strong> Tampil pada bagian kurikulum beranda, menjelaskan program tahfidz, kelas reguler, bahasa Arab, SCD, mutaba&apos;ah, dan kegiatan unggulan unit.
            </span>
          )}
          {activeTab === 'facilities' && (
            <span>
              <strong>Galeri Fasilitas &amp; Sarana Belajar:</strong> Tampil sebagai kartu foto ruang kelas, perpustakaan, masjid, lab komputer/sains, lapangan olahraga, serta area representatif sekolah.
            </span>
          )}
          {activeTab === 'testimonials' && (
            <span>
              <strong>Testimoni Orang Tua &amp; Wali Murid:</strong> Tampil di dekat bagian bawah beranda sebelum banner ajakan mendaftar (CTA), memuat kepuasan dan apresiasi wali murid terhadap adab dan prestasi anak.
            </span>
          )}
          {activeTab === 'tuition' && (
            <span>
              <strong>Rincian Biaya PPDB &amp; Kuota Penerimaan:</strong> Tampil pada halaman pendaftaran PPDB online, kalkulator simulasi kuitansi pendaftaran, diskon Uang Bangunan, dan status sisa kuota penerimaan murid baru.
            </span>
          )}
          {activeTab === 'affiliate' && (
            <span>
              <strong>Landing Page Kemitraan Afiliasi:</strong> Tampil pada halaman publik <strong>/affiliate</strong>. Anda dapat mengedit headline, 3 kolase foto hero, running text pita, narasi program, dan nominal tarif bagi hasil komisi.
            </span>
          )}
          {activeTab === 'sd_karakter' && (
            <span>
              <strong>Halaman Pilar Karakter (/sd/karakter):</strong> Kelola judul headline, 3 Pilar Karakter Nabawiyah (*Mendidik dengan Sunnah*, *Smart Literasi Tahfidz*, *Outdoor Learning* beserta poin-poinnya), dan 7 Karakter Profil Murid (*Salimul Aqidah*, *Shahihul Ibadah*, dll). Perubahan langsung tampil seketika di web!
            </span>
          )}
          {activeTab === 'sd_profil' && (
            <span>
              <strong>Halaman Profil Lengkap (/sd/profil):</strong> Kelola visi resmi sekolah, butir-butir misi pembinaan murid, serta daftar data satuan pendidikan resmi (akreditasi, yayasan, kurikulum, alamat, dll).
            </span>
          )}
          {activeTab === 'smp_karakter' && (
            <span>
              <strong>Halaman SCD &amp; Mutaba&apos;ah Digital (/smp/karakter):</strong> Kelola 4 Pilar Pembinaan Karakter Santri SMP IT (*Akidah Shahihah &amp; Disiplin Ibadah*, *Adab Sebelum Ilmu*, *Leadership &amp; Jiwa Kepemimpinan*, *Kemandirian &amp; Ketangguhan Fisik* beserta butir pembinaannya).
            </span>
          )}
          {activeTab === 'smp_profil' && (
            <span>
              <strong>Halaman Profil Lengkap (/smp/profil):</strong> Kelola Visi resmi (*Be Smart &amp; Religious*), 6 butir Misi strategis, dan data legalitas BAN-S/M Terakreditasi A SMP IT Al-Afiyah Majalengka.
            </span>
          )}
        </div>
      </div>

      {/* MAIN CONTENT AREA: FORM OR PREVIEW */}
      {viewMode === 'preview' ? (
        /* LIVE INTERACTIVE PREVIEW — per-tab */
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          {/* Browser chrome bar */}
          <div className="p-3 bg-slate-900 text-white flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="w-3 h-3 rounded-full bg-rose-500 inline-block" />
              <span className="w-3 h-3 rounded-full bg-amber-500 inline-block" />
              <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block" />
              <span className="text-xs font-mono text-slate-300 ml-2">
                Pratinjau: {publicUrl} — {activeTab === 'hero' ? 'Hero Banner' : activeTab === 'identity' ? 'Profil & Kontak' : activeTab === 'stats' ? 'Counter Statistik' : activeTab === 'values' ? 'Nilai Keunggulan' : activeTab === 'programs' ? 'Program Pilihan' : activeTab === 'facilities' ? 'Fasilitas Sekolah' : activeTab === 'testimonials' ? 'Testimoni Wali Murid' : activeTab === 'tuition' ? 'Biaya PPDB' : activeTab === 'affiliate' ? 'Kemitraan Afiliasi' : activeTab === 'sd_karakter' ? 'Pilar Karakter & Nilai Islami SDIT' : activeTab === 'sd_profil' ? 'Profil, Visi Misi & Legalitas SDIT' : 'Pratinjau'}
              </span>
            </div>
            <span className="text-[11px] font-bold bg-white/10 px-2.5 py-1 rounded text-emerald-400">Live Interactive</span>
          </div>

          {/* === TAB 1: HERO PREVIEW === */}
          {activeTab === 'hero' && (
            <div className="relative bg-slate-950 text-white min-h-[480px] sm:min-h-[520px] flex items-center p-6 sm:p-12 overflow-hidden select-none">
              <div className="absolute inset-0 z-0">
                <Image src={currentSlide.image || (schoolSlug === 'sd' ? '/images/sd-hero-greenhouse.jpg' : '/images/arc-tahfidz.jpg')} alt="Banner Preview" fill sizes="(max-width: 768px) 100vw, 1200px" className="w-full h-full object-cover opacity-35 scale-105 transition-all duration-1000" />
                <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-transparent" />
              </div>
              <div className="relative z-10 max-w-2xl space-y-4">
                <div className="inline-flex items-center px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-amber-300 text-xs font-bold uppercase tracking-wider">
                  {currentSlide.badge}
                </div>
                {schoolSlug === 'sd' ? (
                  <div className="space-y-1">
                    <span className="font-hero-accent italic text-xl sm:text-2xl text-neutral-200 block drop-shadow">
                      Bukan Sekedar
                    </span>
                    <span className="block text-2xl sm:text-4xl font-extrabold text-white leading-tight">
                      Tempat Belajar,
                    </span>
                    <span className="block text-2xl sm:text-4xl font-extrabold text-white leading-tight">
                      Namun Juga
                    </span>
                    <span className="block text-2xl sm:text-4xl font-extrabold text-[#00A651] leading-tight drop-shadow">
                      {currentSlide.titleHighlight || 'Tempat Bertumbuh 🌱'}
                    </span>
                  </div>
                ) : schoolSlug === 'smp' ? (
                  <div className="space-y-2">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#030164] border border-[#ffd51e]/40 text-[#ffd51e] text-[11px] font-black uppercase tracking-wider">
                      TERAKREDITASI A • BE SMART &amp; RELIGIOUS
                    </div>
                    <h1 className="text-2xl sm:text-4xl font-black text-white leading-tight">
                      {currentSlide.titlePart1}
                      {currentSlide.titlePart1 && !currentSlide.titlePart1.endsWith(' ') ? ' ' : ''}
                      <span className="text-[#ffd51e] underline decoration-[#ffd51e]/50 underline-offset-4">{currentSlide.titleHighlight}</span>
                      {currentSlide.titlePart2 ? (currentSlide.titlePart2.startsWith(' ') ? currentSlide.titlePart2 : ` ${currentSlide.titlePart2}`) : ''}
                    </h1>
                  </div>
                ) : schoolSlug === 'tk' ? (
                  <div className="space-y-2">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-600/80 border border-sky-300 text-white text-[11px] font-bold uppercase tracking-wider">
                      PAUD &amp; TK IT AL-AFIYAH MAJALENGKA
                    </div>
                    <h1 className="text-2xl sm:text-4xl font-extrabold text-white leading-tight">
                      {currentSlide.titlePart1}
                      {currentSlide.titlePart1 && !currentSlide.titlePart1.endsWith(' ') ? ' ' : ''}
                      <span className="text-amber-300 underline decoration-amber-300/40 underline-offset-4">{currentSlide.titleHighlight}</span>
                      {currentSlide.titlePart2 ? (currentSlide.titlePart2.startsWith(' ') ? currentSlide.titlePart2 : ` ${currentSlide.titlePart2}`) : ''}
                    </h1>
                  </div>
                ) : (
                  <h1 className="text-2xl sm:text-4xl font-extrabold text-white leading-tight">
                    {currentSlide.titlePart1}
                    {currentSlide.titlePart1 && !currentSlide.titlePart1.endsWith(' ') ? ' ' : ''}
                    <span className="text-amber-400 underline decoration-amber-400/40 underline-offset-4">{currentSlide.titleHighlight}</span>
                    {currentSlide.titlePart2 ? (currentSlide.titlePart2.startsWith(' ') ? currentSlide.titlePart2 : ` ${currentSlide.titlePart2}`) : ''}
                  </h1>
                )}
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-xl">{currentSlide.description}</p>
                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <span className={`px-5 py-2.5 rounded-xl font-extrabold text-xs shadow-lg inline-flex items-center space-x-1.5 ${
                    schoolSlug === 'smp'
                      ? 'bg-[#ffd51e] text-[#030164] hover:bg-yellow-400'
                      : schoolSlug === 'sd'
                      ? 'bg-[#00A651] text-white hover:bg-[#008f45]'
                      : schoolSlug === 'tk'
                      ? 'bg-sky-500 text-white hover:bg-sky-600'
                      : 'bg-amber-500 text-slate-950'
                  }`}>
                    <span>{currentSlide.primaryCtaText || (schoolSlug === 'smp' ? 'Daftar SPMB SMP IT' : schoolSlug === 'sd' ? 'Daftar SPMB SDIT' : schoolSlug === 'tk' ? 'Daftar SPMB TK' : 'Daftar Sekarang')}</span><ChevronRight className="w-4 h-4" />
                  </span>
                  <span className="px-4 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white font-bold text-xs">
                    {currentSlide.secondaryCtaText || (schoolSlug === 'smp' ? 'WhatsApp Panitia (0822-4935-7893)' : schoolSlug === 'sd' ? 'WhatsApp Panitia SPMB' : 'Konsultasi')}
                  </span>
                </div>
                {currentSlide.trustItems && currentSlide.trustItems.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-4 border-t border-white/15">
                    {currentSlide.trustItems.map((item, i) => (
                      <div key={i} className="flex items-center space-x-1.5 text-[11px] text-slate-300 font-semibold">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                        <span className="truncate">{item.text}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="absolute bottom-4 right-4 z-20 flex items-center space-x-2 bg-slate-900/80 backdrop-blur-md p-1.5 rounded-xl border border-white/10">
                <span className="text-xs font-mono text-slate-300 px-2">Slide {selectedSlideIndex + 1} dari {slides.length}</span>
                <button type="button" onClick={() => setSelectedSlideIndex((prev) => (prev - 1 + slides.length) % slides.length)} className="w-7 h-7 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center text-white"><ChevronLeft className="w-4 h-4" /></button>
                <button type="button" onClick={() => setSelectedSlideIndex((prev) => (prev + 1) % slides.length)} className="w-7 h-7 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center text-white"><ChevronRight className="w-4 h-4" /></button>
              </div>
            </div>
          )}

          {/* === TAB 2: IDENTITY / PROFIL PREVIEW === */}
          {activeTab === 'identity' && (
            <div className="p-6 sm:p-10 bg-slate-50 min-h-[400px] space-y-6">
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs max-w-2xl mx-auto space-y-4">
                <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
                  {schoolSlug === 'smp' ? (
                    <img
                      src="/images/smp-logo.png"
                      alt="Logo SMP IT Al-Afiyah"
                      className="w-12 h-12 object-contain shrink-0"
                    />
                  ) : schoolSlug === 'sd' ? (
                    <img
                      src="/images/sd-logo.png"
                      alt="Logo SDIT Al-Afiyah"
                      className="w-12 h-12 object-contain shrink-0"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-xl bg-[#184F48] text-white flex items-center justify-center font-black text-lg shrink-0">
                      {schoolSlug === 'foundation' ? 'YP' : schoolSlug.toUpperCase()}
                    </div>
                  )}
                  <div>
                    <p className="text-[10px] font-extrabold uppercase tracking-widest text-[#2D7A70]">{formData.identity.badgeText}</p>
                    <h2 className="text-base font-black text-slate-900">{formData.identity.name}</h2>
                    <p className="text-xs text-slate-500 italic">&ldquo;{formData.identity.tagline}&rdquo;</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-[#2D7A70] flex-shrink-0 mt-0.5" />
                    <div><p className="font-bold text-slate-700">Alamat Sekolah</p><p className="text-slate-500 leading-relaxed">{formData.identity.schoolAddress}</p></div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Phone className="w-4 h-4 text-[#2D7A70] flex-shrink-0 mt-0.5" />
                    <div><p className="font-bold text-slate-700">WhatsApp Panitia</p><p className="text-slate-500 font-mono">+{formData.identity.whatsappNumber}</p><p className="text-slate-400">{formData.identity.officerName}</p></div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Mail className="w-4 h-4 text-[#2D7A70] flex-shrink-0 mt-0.5" />
                    <div><p className="font-bold text-slate-700">Email Resmi</p><p className="text-slate-500">{formData.identity.email || 'info@alafiyah.id'}</p></div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Clock className="w-4 h-4 text-[#2D7A70] flex-shrink-0 mt-0.5" />
                    <div><p className="font-bold text-slate-700">Jam Layanan</p><p className="text-slate-500">{formData.identity.consultationHours}</p></div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* === TAB 3: STATS COUNTER PREVIEW === */}
          {activeTab === 'stats' && (
            schoolSlug === 'sd' ? (
              <div className="p-6 sm:p-10 bg-neutral-50 min-h-[300px]">
                <div className="max-w-4xl mx-auto">
                  <div className="text-center mb-6">
                    <span className="text-xs font-bold text-emerald-700 uppercase tracking-widest bg-emerald-50 px-3.5 py-1.5 rounded-full border border-emerald-200 inline-block shadow-2xs">
                      Bento Grid Statistik &amp; Keunggulan SDIT (Tampilan Website /sd)
                    </span>
                  </div>
                  <ul className="w-full grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                    {(formData.stats || []).map((stat, idx) => {
                      const icons = [
                        <Users key="users" className="w-4 h-4 text-emerald-600 shrink-0" />,
                        <Compass key="comp" className="w-4 h-4 text-emerald-600 shrink-0" />,
                        <Award key="award" className="w-4 h-4 text-emerald-600 shrink-0" />,
                        <BookOpen key="book" className="w-4 h-4 text-emerald-600 shrink-0" />
                      ];
                      const subtexts = [
                        'Fasilitas & Pendampingan',
                        'Pertanian & Perikanan',
                        'Futsal & Da\'i Cilik',
                        'Kurikulum Terpadu'
                      ];
                      return (
                        <li
                          key={idx}
                          className="bg-white rounded-2xl border border-neutral-200/80 shadow-[0_2px_8px_rgba(0,0,0,0.04)] p-3.5 sm:p-5 transition-all duration-200 hover:border-neutral-300"
                        >
                          <p className="flex items-start gap-1.5 text-[10px] font-semibold tracking-wider uppercase text-neutral-500 leading-tight">
                            <span className="mt-px">{icons[idx % icons.length]}</span>
                            <span>{stat.label}</span>
                          </p>
                          <p className="mt-1.5 text-base sm:text-lg font-bold text-neutral-900 leading-snug">
                            {stat.value}
                          </p>
                          <p className="mt-1 text-[11px] text-neutral-400 line-clamp-1">
                            {(stat as any).subtext || subtexts[idx % subtexts.length]}
                          </p>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>
            ) : schoolSlug === 'smp' ? (
              <div className="p-6 sm:p-10 bg-slate-900 min-h-[300px]">
                <div className="max-w-4xl mx-auto">
                  <div className="text-center mb-6">
                    <span className="text-xs font-bold text-[#ffd51e] uppercase tracking-widest bg-[#030164] px-3.5 py-1.5 rounded-full border border-[#ffd51e]/30 inline-block shadow-2xs">
                      Counter Prestasi &amp; Statistik SMP IT Al-Afiyah (/smp)
                    </span>
                  </div>
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {(formData.stats || []).map((stat, idx) => (
                      <div
                        key={idx}
                        className="bg-white rounded-2xl border border-slate-200 shadow-md p-4 sm:p-5 flex flex-col justify-between hover:border-[#030164] transition-all"
                      >
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{stat.label}</span>
                            <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase bg-blue-50 text-[#030164]">
                              {(stat as any).badge || 'SMP IT'}
                            </span>
                          </div>
                          <p className="text-lg sm:text-xl font-black text-[#030164] leading-snug">
                            {stat.value}
                          </p>
                        </div>
                        <p className="mt-2 text-[11px] text-slate-500 font-medium">
                          {(stat as any).subtext || 'Terpadu & Berkarakter'}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : schoolSlug === 'tk' ? (
              <div className="p-6 sm:p-10 bg-sky-50 min-h-[280px]">
                <div className="max-w-4xl mx-auto">
                  <div className="text-center mb-6">
                    <span className="text-xs font-bold text-sky-800 uppercase tracking-widest bg-sky-100 px-3.5 py-1.5 rounded-full border border-sky-200 inline-block shadow-2xs">
                      Statistik &amp; Capaian TK IT Al-Afiyah (/tk)
                    </span>
                  </div>
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {(formData.stats || []).map((stat, idx) => (
                      <div
                        key={idx}
                        className="bg-white rounded-2xl border border-sky-100 shadow-xs p-4 sm:p-5 flex flex-col justify-between"
                      >
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1">{stat.label}</span>
                          <p className="text-lg sm:text-xl font-black text-sky-900 leading-snug">
                            {stat.value}
                          </p>
                        </div>
                        <p className="mt-2 text-[11px] text-sky-700 font-medium">
                          {(stat as any).subtext || 'Ceria & Berakhlak'}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-6 sm:p-10 bg-slate-50 min-h-[280px] flex items-center justify-center">
                <div className="w-full max-w-3xl bg-gradient-to-r from-[#071D1A] via-[#0D3330] to-[#184F48] rounded-2xl p-6 sm:p-8">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {(formData.stats || []).map((st, i) => (
                      <div key={i} className="text-center space-y-1">
                        <p className="text-2xl sm:text-3xl font-black text-amber-400">{st.value}</p>
                        <p className="text-[11px] font-bold text-emerald-300 leading-tight">{st.label}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )
          )}

          {/* === TAB 4: VALUES PREVIEW === */}
          {activeTab === 'values' && (
            schoolSlug === 'sd' ? (
              <div className="p-6 sm:p-10 bg-slate-50 min-h-[360px]">
                <div className="text-center max-w-2xl mx-auto mb-8">
                  <span className="text-xs font-bold text-emerald-700 uppercase tracking-widest bg-emerald-50 px-3.5 py-1.5 rounded-full border border-emerald-200 inline-block shadow-2xs mb-2">
                    Nilai Utama &amp; Character Building
                  </span>
                  <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                    Tiga Pilar Karakter SDIT Al-Afiyah
                  </h3>
                  <p className="text-xs text-slate-600 mt-2 max-w-xl mx-auto leading-relaxed">
                    Mendidik murid di SDIT Al-Afiyah tidak hanya unggul dalam kognitif sains, tetapi berakar kuat pada nilai-nilai adab nabawiyah, fitrah kemandirian, dan cinta Al-Qur&apos;an.
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-4xl mx-auto">
                  {(formData.values || []).map((val, idx) => (
                    <div
                      key={idx}
                      className="rounded-3xl p-6 bg-white border border-slate-200/90 shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between"
                    >
                      <div className="pb-4">
                        <div className="flex items-center justify-between mb-4">
                          <div className={idx === 0 ? 'text-emerald-700' : idx === 1 ? 'text-amber-700' : 'text-teal-700'}>
                            {idx === 0 ? <HeartHandshake className="w-7 h-7" /> : idx === 1 ? <BookOpen className="w-7 h-7" /> : <GraduationCap className="w-7 h-7" />}
                          </div>
                          <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border shadow-2xs ${idx === 0 ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : idx === 1 ? 'bg-amber-50 text-amber-800 border-amber-200' : 'bg-teal-50 text-teal-800 border-teal-200'}`}>
                            Pilar 0{idx + 1}
                          </span>
                        </div>
                        <h4 className="text-base font-bold text-slate-900 mb-2 leading-snug">
                          {val.title}
                        </h4>
                        <p className="text-xs text-slate-600 leading-relaxed font-normal">
                          {val.description}
                        </p>
                      </div>
                      <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] font-semibold text-emerald-800">
                        <span className="flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                          <span>Prinsip Smart Akhlak Fitrah</span>
                        </span>
                        <ArrowRight className="w-3.5 h-3.5 text-emerald-700" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : schoolSlug === 'smp' ? (
              <div className="p-6 sm:p-10 bg-slate-50 min-h-[360px]">
                <div className="text-center max-w-2xl mx-auto mb-8">
                  <span className="text-xs font-bold text-[#030164] uppercase tracking-widest bg-blue-50 px-3.5 py-1.5 rounded-full border border-blue-200 inline-block shadow-2xs mb-2">
                    Fondasi &amp; Nilai Unggulan SMP IT
                  </span>
                  <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                    Pilar Keunggulan SMP IT Al-Afiyah
                  </h3>
                  <p className="text-xs text-slate-600 mt-2 max-w-xl mx-auto leading-relaxed">
                    Membentuk generasi pemimpin Qur&apos;ani yang cerdas, berwawasan luas, dan berakhlak mulia melalui sistem terpadu.
                  </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto">
                  {(formData.values || []).map((val, idx) => (
                    <div
                      key={idx}
                      className="rounded-2xl p-5 bg-white border border-slate-200 shadow-xs hover:border-[#030164] hover:shadow-md transition-all flex flex-col justify-between"
                    >
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="w-8 h-8 rounded-xl bg-[#030164] text-[#ffd51e] text-xs font-black flex items-center justify-center">
                            0{idx + 1}
                          </span>
                          <span className="text-[10px] font-bold text-[#030164] bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200">
                            Keunggulan
                          </span>
                        </div>
                        <h4 className="text-sm font-bold text-slate-900 leading-snug">
                          {val.title}
                        </h4>
                        <p className="text-xs text-slate-600 leading-relaxed font-normal">
                          {val.description}
                        </p>
                      </div>
                      <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between text-[11px] font-bold text-[#030164]">
                        <span>Smart &amp; Religious</span>
                        <ArrowRight className="w-3.5 h-3.5 text-[#030164]" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : schoolSlug === 'tk' ? (
              <div className="p-6 sm:p-10 bg-sky-50/60 min-h-[360px]">
                <div className="text-center max-w-2xl mx-auto mb-8">
                  <span className="text-xs font-bold text-sky-800 uppercase tracking-widest bg-sky-100 px-3.5 py-1.5 rounded-full border border-sky-200 inline-block shadow-2xs mb-2">
                    Nilai Karakter Usia Emas
                  </span>
                  <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                    Pilar Karakter &amp; Kemandirian TK IT
                  </h3>
                  <p className="text-xs text-slate-600 mt-2 max-w-xl mx-auto leading-relaxed">
                    Menumbuhkan akhlak shalih dan kemandirian sejak dini melalui pendekatan sentra bermain bermakna.
                  </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 max-w-4xl mx-auto">
                  {(formData.values || []).map((val, idx) => (
                    <div
                      key={idx}
                      className="rounded-3xl p-6 bg-white border border-sky-100 shadow-xs flex flex-col justify-between"
                    >
                      <div className="space-y-3">
                        <span className="w-8 h-8 rounded-full bg-sky-100 text-sky-800 text-xs font-black flex items-center justify-center">
                          0{idx + 1}
                        </span>
                        <h4 className="text-base font-bold text-slate-900 leading-snug">
                          {val.title}
                        </h4>
                        <p className="text-xs text-slate-600 leading-relaxed">
                          {val.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="p-6 sm:p-10 bg-slate-50 min-h-[360px]">
                <p className="text-xs font-bold text-center text-slate-400 uppercase tracking-widest mb-6">Pilar Nilai &amp; Keunggulan</p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto">
                  {(formData.values || []).map((val, i) => (
                    <div key={i} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs text-center space-y-2">
                      <div className="w-10 h-10 rounded-xl bg-[#E8F3F1] mx-auto flex items-center justify-center">
                        <GraduationCap className="w-5 h-5 text-[#184F48]" />
                      </div>
                      <p className="text-sm font-bold text-slate-900">{val.title}</p>
                      <p className="text-xs text-slate-500 leading-relaxed">{val.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )
          )}

          {/* === TAB 5: PROGRAMS PREVIEW === */}
          {activeTab === 'programs' && (
            schoolSlug === 'smp' ? (
              <div className="p-6 sm:p-10 bg-[#030164] text-white min-h-[420px]">
                <div className="max-w-5xl mx-auto">
                  <div className="text-center mb-8">
                    <span className="text-xs font-bold text-[#ffd51e] uppercase tracking-widest bg-white/10 px-3.5 py-1.5 rounded-full border border-white/20 inline-block mb-2">
                      Kurikulum &amp; Peminatan (/smp#programs)
                    </span>
                    <h3 className="text-xl sm:text-2xl font-black text-white">
                      6 Program Unggulan SMP IT Al-Afiyah
                    </h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {(formData.programs || []).map((prog, idx) => (
                      <div
                        key={idx}
                        className="bg-white rounded-2xl p-5 text-slate-900 shadow-md border border-slate-200 flex flex-col justify-between"
                      >
                        <div>
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-xs font-black font-mono px-2.5 py-0.5 rounded-lg bg-blue-50 text-[#030164] border border-blue-200">
                              0{idx + 1}
                            </span>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#030164] text-[#ffd51e] uppercase">
                              {prog.badge}
                            </span>
                          </div>
                          <h4 className="text-sm font-black text-slate-900 mb-1 leading-snug">
                            {prog.title}
                          </h4>
                          <p className="text-xs text-slate-600 leading-relaxed">
                            {prog.desc}
                          </p>
                        </div>
                        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-[#030164]">
                          <span>Pelajari Program</span>
                          <ArrowRight className="w-3.5 h-3.5 text-[#030164]" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : schoolSlug === 'tk' ? (
              <div className="p-6 sm:p-10 bg-sky-50 min-h-[360px]">
                <div className="max-w-4xl mx-auto">
                  <div className="text-center mb-8">
                    <span className="text-xs font-bold text-sky-800 uppercase tracking-widest bg-sky-100 px-3.5 py-1.5 rounded-full border border-sky-200 inline-block mb-2">
                      Program Sentra Edukatif (/tk#programs)
                    </span>
                    <h3 className="text-xl sm:text-2xl font-black text-slate-900">
                      Program Pembelajaran TK IT Al-Afiyah
                    </h3>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {(formData.programs || []).map((prog, idx) => (
                      <div key={idx} className="bg-white rounded-2xl border border-sky-100 p-5 shadow-xs space-y-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-sky-100 text-sky-800">
                          {prog.badge}
                        </span>
                        <h4 className="text-sm font-bold text-slate-900">{prog.title}</h4>
                        <p className="text-xs text-slate-600 leading-relaxed">{prog.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-6 sm:p-10 bg-slate-50 min-h-[360px]">
                <p className="text-xs font-bold text-center text-slate-400 uppercase tracking-widest mb-6">Program Pilihan &amp; Unggulan</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-3xl mx-auto">
                  {(formData.programs || []).map((prog, i) => (
                    <div key={i} className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex items-start gap-3">
                      <div className="w-8 h-8 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <BookOpen className="w-4 h-4 text-amber-600" />
                      </div>
                      <div className="min-w-0">
                        <span className="text-[10px] font-black text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">{prog.badge}</span>
                        <p className="text-sm font-bold text-slate-900 mt-1">{prog.title}</p>
                        <p className="text-xs text-slate-500 leading-relaxed mt-0.5">{prog.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )
          )}

          {/* === TAB 6: FACILITIES PREVIEW === */}
          {activeTab === 'facilities' && (
            schoolSlug === 'smp' ? (
              <div className="p-6 sm:p-10 bg-slate-50 min-h-[420px]">
                <div className="max-w-5xl mx-auto">
                  <div className="text-center mb-8">
                    <span className="text-xs font-bold text-[#030164] uppercase tracking-widest bg-blue-50 px-3.5 py-1.5 rounded-full border border-blue-200 inline-block mb-2">
                      Sarana Kampus Giri Asih (/smp#fasilitas)
                    </span>
                    <h3 className="text-xl sm:text-2xl font-black text-slate-900">
                      Galeri Fasilitas SMP IT Al-Afiyah
                    </h3>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {(formData.facilities || []).map((fac, idx) => (
                      <div key={idx} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:border-[#030164] transition-all flex flex-col justify-between">
                        <div className="relative aspect-[4/3] bg-slate-100">
                          <img
                            src={fac.image || '/images/smp-kelas-literasi.jpg'}
                            alt={fac.name}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute top-2 left-2">
                            <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-[#030164] text-[#ffd51e]">
                              {fac.category || 'Fasilitas'}
                            </span>
                          </div>
                        </div>
                        <div className="p-3.5 space-y-1">
                          <h4 className="text-xs font-bold text-slate-900 leading-snug">{fac.name}</h4>
                          <p className="text-[11px] text-slate-500 leading-relaxed line-clamp-2">{fac.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-6 sm:p-10 bg-slate-50 min-h-[400px]">
                <p className="text-xs font-bold text-center text-slate-400 uppercase tracking-widest mb-6">Galeri Fasilitas &amp; Sarana Sekolah</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-3xl mx-auto">
                  {(formData.facilities || []).map((fac, i) => (
                    <div key={i} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
                      <div className="relative h-36">
                        <Image src={fac.image || '/images/arc-tahfidz.jpg'} alt={fac.name} fill sizes="400px" className="object-cover" />
                      </div>
                      <div className="p-3">
                        <p className="text-xs font-bold text-slate-900">{fac.name}</p>
                        <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">{fac.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )
          )}

          {/* === TAB 7: TESTIMONIALS PREVIEW === */}
          {activeTab === 'testimonials' && (
            schoolSlug === 'smp' ? (
              <div className="p-6 sm:p-10 bg-slate-50 min-h-[360px]">
                <div className="max-w-4xl mx-auto">
                  <div className="text-center mb-8">
                    <span className="text-xs font-bold text-[#030164] uppercase tracking-widest bg-blue-50 px-3.5 py-1.5 rounded-full border border-blue-200 inline-block mb-2">
                      Testimoni Orang Tua Murid SMP IT (/smp)
                    </span>
                    <h3 className="text-xl sm:text-2xl font-black text-slate-900">
                      Apresiasi &amp; Pengalaman Wali Santri
                    </h3>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {(formData.testimonials || []).map((t, idx) => (
                      <div key={idx} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3 flex flex-col justify-between">
                        <div className="space-y-2">
                          <div className="flex items-center gap-1 text-amber-400">
                            {[1, 2, 3, 4, 5].map((s) => (
                              <Award key={s} className="w-3.5 h-3.5 fill-amber-400" />
                            ))}
                          </div>
                          <p className="text-xs text-slate-600 italic leading-relaxed">&ldquo;{t.quote}&rdquo;</p>
                        </div>
                        <div className="pt-3 border-t border-slate-100">
                          <p className="text-xs font-bold text-slate-900">{t.name}</p>
                          <p className="text-[11px] text-[#030164] font-semibold">{t.role}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-6 sm:p-10 bg-slate-50 min-h-[360px]">
                <p className="text-xs font-bold text-center text-slate-400 uppercase tracking-widest mb-6">Testimoni Orang Tua &amp; Wali Murid</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-3xl mx-auto">
                  {(formData.testimonials || []).map((t, i) => (
                    <div key={i} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
                      <div className="flex items-center gap-1 text-amber-400">
                        {[1,2,3,4,5].map(s => <Award key={s} className="w-3.5 h-3.5 fill-amber-400" />)}
                      </div>
                      <p className="text-xs text-slate-600 italic leading-relaxed">&ldquo;{t.quote}&rdquo;</p>
                      <div className="pt-2 border-t border-slate-100">
                        <p className="text-xs font-bold text-slate-900">{t.name}</p>
                        <p className="text-[11px] text-slate-400">{t.role}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )
          )}

          {/* === TAB 8: TUITION PREVIEW === */}
          {activeTab === 'tuition' && (
            schoolSlug === 'sd' ? (
              <div className="p-6 sm:p-10 bg-slate-50 min-h-[400px]">
                <div className="max-w-4xl mx-auto space-y-6">
                  <div className="text-center">
                    <span className="text-xs font-bold text-emerald-800 uppercase tracking-widest bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 inline-flex items-center gap-1.5">
                      <Tag className="w-3.5 h-3.5 text-[#00A651]" />
                      <span>Rincian Investasi &amp; Rekening Resmi SPMB SDIT T.A. 2027/2028</span>
                    </span>
                  </div>
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                    {/* Left: SPMB Poster Box */}
                    <div className="lg:col-span-5 flex flex-col items-center">
                      <div className="relative group rounded-2xl overflow-hidden border border-slate-200 shadow-md bg-white max-w-xs w-full">
                        <img
                          src="/images/sd-spmb-story.jpg"
                          alt="Poster SPMB SDIT Al-Afiyah"
                          className="w-full h-auto object-cover max-h-[380px]"
                        />
                        <div className="p-3 text-center bg-slate-900 text-white text-[11px] font-bold">
                          Story SPMB Resmi SDIT 2027/2028
                        </div>
                      </div>
                    </div>
                    {/* Right: Bank Muamalat & Fees */}
                    <div className="lg:col-span-7 space-y-4">
                      {/* Bank Card */}
                      <div className="rounded-2xl p-5 text-white shadow-md relative overflow-hidden bg-gradient-to-br from-emerald-900 via-emerald-800 to-emerald-950 border border-emerald-600/40">
                        <div className="flex items-center justify-between pb-3 border-b border-white/15">
                          <div className="flex items-center gap-2">
                            <CreditCard className="w-4 h-4 text-amber-300" />
                            <span className="text-[11px] font-bold tracking-wider uppercase text-emerald-100">
                              Rekening Resmi Pembayaran SPMB
                            </span>
                          </div>
                          <span className="px-2 py-0.5 rounded-full text-[9px] font-extrabold bg-amber-400 text-slate-950 uppercase">
                            Terverifikasi
                          </span>
                        </div>
                        <div className="py-4 space-y-2">
                          <span className="text-[10px] text-emerald-200 block uppercase font-medium">Bank Penerima:</span>
                          <h4 className="text-lg font-black text-white">Bank Muamalat</h4>
                          <div className="bg-black/25 p-3 rounded-xl border border-white/15 flex items-center justify-between">
                            <div>
                              <span className="text-[9px] text-emerald-200 block font-medium uppercase">Nomor Rekening:</span>
                              <span className="text-xl font-black font-mono text-amber-300">1360012405</span>
                            </div>
                            <span className="text-xs font-bold text-white/90">A.n SMP / SDIT Al Afiyah</span>
                          </div>
                        </div>
                        <p className="text-[10px] text-emerald-100/80 pt-2 border-t border-white/15">
                          Seluruh pembayaran formulir pendaftaran dan daftar ulang SPMB hanya disalurkan melalui rekening resmi di atas.
                        </p>
                      </div>

                      {/* Tuition Breakdown Card */}
                      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
                        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                          <span className="text-xs font-bold text-slate-900">{formData.tuition.waveName || 'Gelombang 1 (T.A. 2027/2028)'}</span>
                          <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                            Sisa Kuota: {formData.tuition.quota ?? 60} murid
                          </span>
                        </div>
                        <div className="space-y-2 text-xs">
                          <div className="flex justify-between py-1 border-b border-slate-100">
                            <span className="text-slate-600">Biaya Formulir Pendaftaran</span>
                            <span className="font-bold text-slate-900">Rp {(formData.tuition.registrationFee || 250000).toLocaleString('id-ID')}</span>
                          </div>
                          <div className="flex justify-between py-1 border-b border-slate-100">
                            <span className="text-slate-600">SPP Bulanan</span>
                            <span className="font-bold text-slate-900">Rp {(formData.tuition.monthlyTuition || 450000).toLocaleString('id-ID')}</span>
                          </div>
                          <div className="flex justify-between py-1 border-b border-slate-100">
                            <span className="text-slate-600">Uang Pengembangan (Pangkal)</span>
                            <span className="font-bold text-slate-900">Rp {(formData.tuition.developmentFee || 3500000).toLocaleString('id-ID')}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 pt-2">
                          <span className="px-4 py-2.5 rounded-xl bg-[#00A651] text-white font-bold text-xs shadow-xs inline-flex items-center gap-1.5">
                            <span>Daftar SPMB SDIT Online</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </span>
                          <span className="px-4 py-2.5 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs inline-flex items-center gap-1.5">
                            <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                            <span>WhatsApp Panitia SPMB</span>
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : schoolSlug === 'smp' ? (
              <div className="p-6 sm:p-10 bg-slate-50 min-h-[400px]">
                <div className="max-w-5xl mx-auto space-y-6">
                  <div className="text-center">
                    <span className="text-xs font-bold text-[#030164] uppercase tracking-widest bg-blue-50 px-3.5 py-1 rounded-full border border-blue-200 inline-flex items-center gap-1.5 shadow-2xs">
                      <CreditCard className="w-3.5 h-3.5 text-[#030164]" />
                      <span>Rincian Investasi Pendidikan &amp; Brosur Resmi SPMB SMP IT 2027/2028</span>
                    </span>
                  </div>

                  {/* Simulator Container */}
                  <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-5 sm:p-7 space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                      <div>
                        <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-[#030164]">
                          <span className="w-4 h-[2px] bg-[#030164] rounded-full inline-block" />
                          <span>Simulasi Biaya Masuk &amp; Diskon Gelombang 1</span>
                        </div>
                        <h4 className="text-lg font-black text-slate-900 mt-1">
                          Tabel Biaya Pendidikan SPMB SMP IT Al-Afiyah
                        </h4>
                      </div>

                      {/* Gender Selector */}
                      <div className="grid grid-cols-2 gap-1.5 p-1 bg-slate-100 rounded-xl border border-slate-200 self-start sm:self-auto">
                        <button
                          type="button"
                          onClick={() => setSmpPreviewGender('ikhwan')}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                            smpPreviewGender === 'ikhwan'
                              ? 'bg-[#030164] text-white shadow-xs'
                              : 'text-slate-600 hover:text-slate-900'
                          }`}
                        >
                          Ikhwan (Putra)
                        </button>
                        <button
                          type="button"
                          onClick={() => setSmpPreviewGender('akhwat')}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                            smpPreviewGender === 'akhwat'
                              ? 'bg-[#030164] text-white shadow-xs'
                              : 'text-slate-600 hover:text-slate-900'
                          }`}
                        >
                          Akhwat (Putri)
                        </button>
                      </div>
                    </div>

                    {/* Discount Category Selector */}
                    <div>
                      <label className="text-[11px] font-bold text-slate-700 block mb-2 uppercase tracking-wider">
                        Kategori Pendaftar (Simulasi Diskon Uang Bangunan):
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <button
                          type="button"
                          onClick={() => setSmpPreviewDiscount('sdit')}
                          className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                            smpPreviewDiscount === 'sdit'
                              ? 'bg-blue-50/90 border-[#030164] ring-2 ring-[#030164]/20'
                              : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-bold text-[#030164]">Alumni SDIT Al Afiyah</span>
                            <span className="text-[9px] font-black px-1.5 py-0.5 rounded-full bg-[#030164] text-[#ffd51e]">
                              Diskon 70%
                            </span>
                          </div>
                          <p className="text-[11px] text-blue-900 font-semibold">Hemat Rp 1.750.000 Uang Bangunan</p>
                        </button>

                        <button
                          type="button"
                          onClick={() => setSmpPreviewDiscount('umum')}
                          className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                            smpPreviewDiscount === 'umum'
                              ? 'bg-amber-50/90 border-amber-500 ring-2 ring-amber-500/20'
                              : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-bold text-amber-950">Luar SDIT / Umum</span>
                            <span className="text-[9px] font-black px-1.5 py-0.5 rounded-full bg-amber-500 text-slate-950">
                              Diskon 50%
                            </span>
                          </div>
                          <p className="text-[11px] text-amber-900 font-semibold">Hemat Rp 1.250.000 Uang Bangunan</p>
                        </button>

                        <button
                          type="button"
                          onClick={() => setSmpPreviewDiscount('normal')}
                          className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                            smpPreviewDiscount === 'normal'
                              ? 'bg-slate-200 border-slate-600 ring-2 ring-slate-400'
                              : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-bold text-slate-800">Biaya Normal (Gelombang 2)</span>
                            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-slate-300 text-slate-800">
                              No Diskon
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-600">Tarif standar tanpa potongan</p>
                        </button>
                      </div>
                    </div>

                    {/* Table Breakdown */}
                    {(() => {
                      const regFee = formData.tuition.registrationFee || 200000;
                      const baseBuilding = formData.tuition.buildingFee || formData.tuition.developmentFee || 2500000;
                      const discount = smpPreviewDiscount === 'sdit' ? Math.round(baseBuilding * 0.7) : smpPreviewDiscount === 'umum' ? Math.round(baseBuilding * 0.5) : 0;
                      const finalBuilding = baseBuilding - discount;
                      const facilitiesFee = formData.tuition.learningFacilities || 500000;
                      const uniformFee = smpPreviewGender === 'ikhwan' ? (formData.tuition.uniformIkhwan || 1100000) : (formData.tuition.uniformAkhwat || 1400000);
                      const bookFee = formData.tuition.bookPackage || 1000000;
                      const activityFee = formData.tuition.studentActivities || 1700000;
                      const sppFee = formData.tuition.monthlyTuition || 300000;
                      const baseTotal = regFee + baseBuilding + facilitiesFee + uniformFee + bookFee + activityFee + sppFee;
                      const finalTotal = baseTotal - discount;

                      return (
                        <div className="border border-slate-200 rounded-2xl overflow-hidden text-xs">
                          <div className="divide-y divide-slate-100">
                            <div className="flex items-center justify-between p-3 bg-slate-50">
                              <span className="font-semibold text-slate-700">1. Infaq Formulir Pendaftaran</span>
                              <span className="font-mono font-bold text-slate-900">Rp {regFee.toLocaleString('id-ID')}</span>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-white">
                              <div>
                                <span className="font-semibold text-slate-700 block">2. Infaq Pengembangan Sarana (Uang Bangunan)</span>
                                {discount > 0 && (
                                  <span className="text-[10px] text-[#030164] font-bold">
                                    Potongan {smpPreviewDiscount === 'sdit' ? '70% (SDIT)' : '50% (Umum)'}: -Rp {discount.toLocaleString('id-ID')}
                                  </span>
                                )}
                              </div>
                              <div className="text-right flex items-center gap-2">
                                {discount > 0 && (
                                  <span className="line-through text-slate-400 font-mono text-[11px]">Rp {baseBuilding.toLocaleString('id-ID')}</span>
                                )}
                                <span className="font-mono font-bold text-[#030164]">Rp {finalBuilding.toLocaleString('id-ID')}</span>
                              </div>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-slate-50">
                              <span className="font-semibold text-slate-700">3. Fasilitas Pembelajaran Modern</span>
                              <span className="font-mono font-bold text-slate-900">Rp {facilitiesFee.toLocaleString('id-ID')}</span>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-white">
                              <span className="font-semibold text-slate-700">4. Paket Seragam Sekolah Lengkap ({smpPreviewGender === 'ikhwan' ? 'Ikhwan' : 'Akhwat Syar\'i'})</span>
                              <span className="font-mono font-bold text-slate-900">Rp {uniformFee.toLocaleString('id-ID')}</span>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-slate-50">
                              <span className="font-semibold text-slate-700">5. Paket Buku Pelajaran &amp; Modul</span>
                              <span className="font-mono font-bold text-slate-900">Rp {bookFee.toLocaleString('id-ID')}</span>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-white">
                              <span className="font-semibold text-slate-700">6. Program Kegiatan Murid (SCD, Outing, Mutaba&apos;ah)</span>
                              <span className="font-mono font-bold text-slate-900">Rp {activityFee.toLocaleString('id-ID')}</span>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-slate-50">
                              <span className="font-semibold text-slate-700">7. SPP Pendidikan (Bulan Pertama)</span>
                              <span className="font-mono font-bold text-slate-900">Rp {sppFee.toLocaleString('id-ID')}</span>
                            </div>
                            {/* Grand Total Bar */}
                            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-[#030164] to-[#090566] text-white">
                              <div>
                                <span className="text-[11px] uppercase tracking-wider text-[#ffd51e] font-black block">
                                  Total Biaya Masuk ({smpPreviewGender === 'ikhwan' ? 'Ikhwan' : 'Akhwat'})
                                </span>
                                <span className="text-[10px] text-slate-300">
                                  {discount > 0 ? `Hemat Rp ${discount.toLocaleString('id-ID')} pada Gelombang 1` : 'Tarif Biaya Normal'}
                                </span>
                              </div>
                              <div className="text-right">
                                {discount > 0 && (
                                  <span className="text-[11px] line-through text-slate-400 font-mono block">
                                    Rp {baseTotal.toLocaleString('id-ID')}
                                  </span>
                                )}
                                <span className="text-xl font-black font-mono text-[#ffd51e]">
                                  Rp {finalTotal.toLocaleString('id-ID')}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })()}
                  </div>

                  {/* Grid: Bank Muamalat Card & Poster SPMB SMP */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-start">
                    {/* Bank Muamalat Card */}
                    <div className="rounded-2xl p-5 text-white shadow-md relative overflow-hidden bg-gradient-to-br from-[#030164] via-[#080554] to-[#01002e] border border-[#ffd51e]/30 space-y-3">
                      <div className="flex items-center justify-between pb-3 border-b border-white/15">
                        <div className="flex items-center gap-2">
                          <CreditCard className="w-4 h-4 text-[#ffd51e]" />
                          <span className="text-[11px] font-bold tracking-wider uppercase text-slate-200">
                            Rekening Resmi Pembayaran SPMB
                          </span>
                        </div>
                        <span className="px-2 py-0.5 rounded-full text-[9px] font-extrabold bg-[#ffd51e] text-slate-950 uppercase">
                          Terverifikasi
                        </span>
                      </div>
                      <div className="space-y-2">
                        <span className="text-[10px] text-slate-300 block uppercase font-medium">Bank Penerima:</span>
                        <h4 className="text-lg font-black text-white">Bank Muamalat Indonesia</h4>
                        <div className="bg-black/35 p-3 rounded-xl border border-white/15 flex items-center justify-between">
                          <div>
                            <span className="text-[9px] text-slate-300 block font-medium uppercase">Nomor Rekening:</span>
                            <span className="text-xl font-black font-mono text-[#ffd51e]">1360012405</span>
                          </div>
                          <span className="text-xs font-bold text-white/90">A.n SMP IT Al Afiyah</span>
                        </div>
                      </div>
                      <div className="pt-2 border-t border-white/15 flex items-center justify-between text-[10px] text-slate-300">
                        <span>Sisa Kuota: <strong>{formData.tuition.quota ?? 60} murid</strong></span>
                        <span className="text-[#ffd51e] font-bold">{formData.tuition.waveName || 'Gelombang 1 (2027/2028)'}</span>
                      </div>
                    </div>

                    {/* Poster Brosur SMP IT */}
                    <div className="rounded-2xl p-4 bg-white border border-slate-200 shadow-xs flex items-center gap-4">
                      <div className="w-24 shrink-0 rounded-xl overflow-hidden border border-slate-200 bg-slate-100 aspect-[3/4] flex items-center justify-center">
                        <img
                          src={smpActivePoster}
                          alt="Poster Brosur SMP IT"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="space-y-2 flex-1 min-w-0">
                        <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-blue-50 text-[#030164] border border-blue-200 inline-block uppercase">
                          Brosur Resmi SMP IT
                        </span>
                        <h5 className="text-xs font-bold text-slate-900 truncate">
                          {smpActivePoster.includes('biaya') ? 'Poster Biaya & Diskon Gelombang 1' : 'Poster Resmi SPMB SMP IT'}
                        </h5>
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => setSmpActivePoster('/images/smp-spmb-biaya.png')}
                            className={`px-2 py-1 rounded text-[10px] font-bold cursor-pointer transition-colors ${
                              smpActivePoster === '/images/smp-spmb-biaya.png'
                                ? 'bg-[#030164] text-white'
                                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                            }`}
                          >
                            Biaya &amp; Diskon
                          </button>
                          <button
                            type="button"
                            onClick={() => setSmpActivePoster('/images/smp-spmb-poster.png')}
                            className={`px-2 py-1 rounded text-[10px] font-bold cursor-pointer transition-colors ${
                              smpActivePoster === '/images/smp-spmb-poster.png'
                                ? 'bg-[#030164] text-white'
                                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                            }`}
                          >
                            Poster Utama
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : schoolSlug === 'tk' ? (
              <div className="p-6 sm:p-10 bg-slate-50 min-h-[360px] flex items-center justify-center">
                <div className="w-full max-w-md bg-white rounded-2xl border border-sky-200 shadow-sm overflow-hidden">
                  <div className="bg-gradient-to-r from-sky-700 to-sky-900 text-white p-4 text-center">
                    <p className="text-[11px] font-bold uppercase tracking-widest text-sky-200">{formData.tuition.waveName || 'Gelombang 1 (2027/2028)'}</p>
                    <p className="text-lg font-black mt-0.5">Rincian Investasi Pendidikan TK IT</p>
                    <p className="text-xs text-sky-100">{schoolName}</p>
                  </div>
                  <div className="p-5 space-y-3 text-sm">
                    {[
                      { label: 'Infaq Formulir Pendaftaran', value: formData.tuition.registrationFee || 150000 },
                      { label: 'SPP Bulanan', value: formData.tuition.monthlyTuition || 250000 },
                      { label: 'Uang Pengembangan (Pangkal)', value: formData.tuition.developmentFee || 2500000 },
                    ].map((item, i) => (
                      <div key={i} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
                        <span className="text-xs text-slate-600">{item.label}</span>
                        <span className="text-xs font-black text-sky-900">
                          Rp {(item.value || 0).toLocaleString('id-ID')}
                        </span>
                      </div>
                    ))}
                    <div className="bg-sky-50 border border-sky-200 rounded-xl p-3 flex items-center justify-between mt-2">
                      <span className="text-xs font-bold text-sky-900">Sisa Kuota Penerimaan</span>
                      <span className="text-xl font-black text-sky-900">{formData.tuition.quota ?? 30} murid</span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-6 sm:p-10 bg-slate-50 min-h-[360px] flex items-center justify-center">
                <div className="w-full max-w-sm bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
                  <div className="bg-[#184F48] text-white p-4 text-center">
                    <p className="text-[11px] font-bold uppercase tracking-widest text-emerald-300">{formData.tuition.waveName || 'Gelombang 1 (2027/2028)'}</p>
                    <p className="text-lg font-black mt-0.5">Rincian Biaya PPDB</p>
                    <p className="text-xs text-emerald-200">{schoolName}</p>
                  </div>
                  <div className="p-5 space-y-3 text-sm">
                    {[
                      { label: 'Biaya Formulir Pendaftaran', value: formData.tuition.registrationFee },
                      { label: 'SPP Bulanan', value: formData.tuition.monthlyTuition },
                      { label: 'Uang Pengembangan (Pangkal)', value: formData.tuition.developmentFee || formData.tuition.buildingFee || 0 },
                    ].map((item, i) => (
                      <div key={i} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
                        <span className="text-xs text-slate-600">{item.label}</span>
                        <span className="text-xs font-black text-[#184F48]">
                          Rp {(item.value || 0).toLocaleString('id-ID')}
                        </span>
                      </div>
                    ))}
                    <div className="bg-[#E8F3F1] rounded-xl p-3 flex items-center justify-between mt-2">
                      <span className="text-xs font-bold text-[#184F48]">Sisa Kuota</span>
                      <span className="text-xl font-black text-[#184F48]">{formData.tuition.quota ?? 60} murid</span>
                    </div>
                  </div>
                </div>
              </div>
            )
          )}

          {/* === TAB 9: AFFILIATE PREVIEW === */}
          {activeTab === 'affiliate' && (
            <div className="p-8 text-center space-y-4">
              <div className="max-w-md mx-auto p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-3">
                <Share2 className="w-10 h-10 text-emerald-800 mx-auto" />
                <h4 className="font-extrabold text-slate-900 text-base">Halaman Publik Kemitraan Afiliasi</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Pratinjau lengkap dengan seluruh simulator interaktif, kalkulator komisi, dan formulir kemitraan dapat dilihat langsung pada rute publik.
                </p>
                <a
                  href="/affiliate"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-full bg-[#184F48] hover:bg-[#123e38] text-white font-bold text-xs shadow-sm transition-all"
                >
                  <span>Buka Halaman /affiliate di Tab Baru</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          )}

          {/* === TAB 9 (SD): SD KARAKTER & 7 HABITS PREVIEW === */}
          {activeTab === 'sd_karakter' && (
            <div className="p-6 sm:p-10 bg-slate-50 min-h-[500px] space-y-8">
              {/* Hero Banner Header */}
              <div className="bg-gradient-to-br from-[#064e3b] via-[#047857] to-[#00A651] text-white rounded-3xl p-6 sm:p-8 text-center space-y-3 shadow-md relative overflow-hidden">
                <span className="text-xs font-bold text-emerald-950 uppercase tracking-widest bg-amber-400 px-3.5 py-1.5 rounded-full inline-block font-mono">
                  Character Building • Smart Akhlak Fitrah
                </span>
                <h3 className="text-xl sm:text-3xl font-extrabold text-white tracking-tight">
                  {formData.sdKarakter?.heroHeadline || DEFAULT_SD_KARAKTER.heroHeadline}
                </h3>
                <p className="text-xs sm:text-sm text-emerald-100 max-w-2xl mx-auto leading-relaxed">
                  {formData.sdKarakter?.heroDescription || DEFAULT_SD_KARAKTER.heroDescription}
                </p>
              </div>

              {/* 3 Pillars */}
              <div className="space-y-4">
                <div className="text-center">
                  <span className="text-xs font-bold text-emerald-700 uppercase tracking-widest bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                    Tiga Pilar Karakter Nabawiyah
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                  {((formData.sdKarakter?.threePillars && formData.sdKarakter.threePillars.length > 0)
                    ? formData.sdKarakter.threePillars
                    : DEFAULT_SD_KARAKTER.threePillars
                  ).map((pillar, idx) => (
                    <div
                      key={idx}
                      className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between"
                    >
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="w-9 h-9 rounded-2xl bg-emerald-50 text-emerald-800 font-black text-sm flex items-center justify-center border border-emerald-200">
                            {pillar.number || `0${idx + 1}`}
                          </span>
                          <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                            Pilar Utama
                          </span>
                        </div>
                        <h4 className="text-base font-bold text-slate-900 leading-snug">
                          {pillar.title}
                        </h4>
                        <p className="text-[11px] font-semibold text-emerald-700">
                          {pillar.tagline}
                        </p>
                        <p className="text-xs text-slate-600 leading-relaxed">
                          {pillar.desc}
                        </p>
                        {Array.isArray(pillar.points) && pillar.points.length > 0 && (
                          <div className="pt-3 border-t border-slate-100 space-y-1.5">
                            {pillar.points.map((pt, pIdx) => (
                              <div key={pIdx} className="flex items-start gap-2 text-xs text-slate-700">
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                                <span>{pt}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 7 Habits */}
              <div className="space-y-4 pt-4 border-t border-slate-200">
                <div className="text-center">
                  <span className="text-xs font-bold text-emerald-800 uppercase tracking-widest bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                    7 Kebiasaan Anak Sholeh SDIT Al-Afiyah
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 max-w-5xl mx-auto">
                  {((formData.sdKarakter?.sevenHabits && formData.sdKarakter.sevenHabits.length > 0)
                    ? formData.sdKarakter.sevenHabits
                    : DEFAULT_SD_KARAKTER.sevenHabits
                  ).map((habit, hIdx) => (
                    <div
                      key={hIdx}
                      className="bg-white rounded-2xl border border-slate-200 p-4 shadow-2xs space-y-1.5"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono font-bold text-[#00A651]">0{hIdx + 1}</span>
                        <Sun className="w-3.5 h-3.5 text-amber-500" />
                      </div>
                      <h5 className="text-sm font-bold text-slate-900">{habit.title}</h5>
                      <p className="text-[11px] font-semibold text-emerald-700 leading-tight">{habit.sub}</p>
                      <p className="text-xs text-slate-500 leading-relaxed pt-1">{habit.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* === TAB 10 (SD): SD PROFIL & IDENTITAS PREVIEW === */}
          {activeTab === 'sd_profil' && (
            <div className="p-6 sm:p-10 bg-slate-50 min-h-[500px] space-y-8">
              {/* Header */}
              <div className="bg-gradient-to-br from-[#064e3b] via-[#047857] to-[#00A651] text-white rounded-3xl p-6 sm:p-8 text-center space-y-2 shadow-md">
                <span className="text-xs font-bold text-emerald-950 uppercase tracking-widest bg-amber-400 px-3.5 py-1.5 rounded-full inline-block font-mono">
                  Profil Resmi &amp; Legalitas Sekolah
                </span>
                <h3 className="text-xl sm:text-3xl font-extrabold text-white tracking-tight">
                  SDIT Al-Afiyah Majalengka
                </h3>
                <p className="text-xs sm:text-sm text-emerald-100 max-w-2xl mx-auto">
                  Sekolah Dasar Islam Terpadu berlandaskan Al-Qur&apos;an dan Sunnah di Lingkungan Giri Asih
                </p>
              </div>

              {/* Visi */}
              <div className="max-w-3xl mx-auto bg-white rounded-3xl border border-emerald-200 p-6 sm:p-8 shadow-xs text-center space-y-3 relative overflow-hidden">
                <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-700 mx-auto flex items-center justify-center font-bold">
                  <Compass className="w-5 h-5 text-emerald-700" />
                </div>
                <span className="text-xs font-extrabold uppercase tracking-widest text-[#00A651] block">
                  Visi SDIT Al-Afiyah
                </span>
                <p className="text-base sm:text-lg font-bold text-slate-900 italic leading-relaxed">
                  &ldquo;{formData.sdProfil?.visiText || DEFAULT_SD_PROFIL.visiText}&rdquo;
                </p>
              </div>

              {/* Misi */}
              <div className="max-w-4xl mx-auto space-y-4">
                <div className="text-center">
                  <span className="text-xs font-bold text-emerald-800 uppercase tracking-widest bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                    Misi Pendidikan Terpadu
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {((formData.sdProfil?.misiList && formData.sdProfil.misiList.length > 0)
                    ? formData.sdProfil.misiList
                    : DEFAULT_SD_PROFIL.misiList
                  ).map((misi, mIdx) => (
                    <div
                      key={mIdx}
                      className="bg-white rounded-2xl border border-slate-200 p-4 shadow-2xs flex items-start gap-3"
                    >
                      <span className="w-7 h-7 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-black flex items-center justify-center shrink-0 mt-0.5 border border-emerald-200">
                        0{mIdx + 1}
                      </span>
                      <p className="text-xs text-slate-700 leading-relaxed font-medium">
                        {misi}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Identitas Satuan Pendidikan & Legalitas */}
              <div className="max-w-4xl mx-auto space-y-4 pt-4 border-t border-slate-200">
                <div className="text-center">
                  <span className="text-xs font-bold text-emerald-800 uppercase tracking-widest bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                    Data Satuan Pendidikan &amp; Legalitas Resmi BAN-SM
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {((formData.sdProfil?.identitasList && formData.sdProfil.identitasList.length > 0)
                    ? formData.sdProfil.identitasList
                    : DEFAULT_SD_PROFIL.identitasList
                  ).map((item, idIdx) => (
                    <div
                      key={idIdx}
                      className="bg-white rounded-2xl border border-slate-200 p-4 shadow-2xs flex flex-col justify-between"
                    >
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                        {item.label}
                      </span>
                      <p className="text-xs font-bold text-slate-800 leading-snug">
                        {item.value}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* === TAB 9 (SMP): SMP KARAKTER (SCD & MUTABA'AH) PREVIEW === */}
          {activeTab === 'smp_karakter' && (
            <div className="p-6 sm:p-10 bg-slate-50 min-h-[500px] space-y-8">
              {/* Hero Banner Header */}
              <div className="bg-gradient-to-br from-[#030164] via-[#090580] to-[#01003d] text-white rounded-3xl p-6 sm:p-8 text-center space-y-3 shadow-md relative overflow-hidden">
                <span className="text-xs font-bold text-[#030164] uppercase tracking-widest bg-[#ffd51e] px-3.5 py-1.5 rounded-full inline-block font-mono">
                  Student Character Development (SCD) • SMP IT
                </span>
                <h3 className="text-xl sm:text-3xl font-black text-white tracking-tight">
                  {formData.smpKarakter?.heroTitle || DEFAULT_SMP_KARAKTER.heroTitle}
                </h3>
                <p className="text-xs sm:text-sm text-slate-200 max-w-2xl mx-auto leading-relaxed">
                  {formData.smpKarakter?.heroSubtitle || DEFAULT_SMP_KARAKTER.heroSubtitle}
                </p>
              </div>

              {/* 4 Pillars Grid */}
              <div className="space-y-4">
                <div className="text-center">
                  <span className="text-xs font-bold text-[#030164] uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
                    4 Pilar Karakter &amp; Kepemimpinan Santri
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
                  {((formData.smpKarakter?.pillars && formData.smpKarakter.pillars.length > 0)
                    ? formData.smpKarakter.pillars
                    : DEFAULT_SMP_KARAKTER.pillars
                  ).map((pillar, idx) => (
                    <div
                      key={idx}
                      className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between hover:border-[#030164] transition-all"
                    >
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="w-9 h-9 rounded-2xl bg-[#030164] text-[#ffd51e] font-black text-sm flex items-center justify-center">
                            {pillar.number || `0${idx + 1}`}
                          </span>
                          <span className="text-[10px] font-bold text-[#030164] bg-blue-50 px-2.5 py-0.5 rounded-md border border-blue-200">
                            Pilar Utama
                          </span>
                        </div>
                        <h4 className="text-base font-bold text-slate-900 leading-snug">
                          {pillar.title}
                        </h4>
                        <p className="text-[11px] font-semibold text-[#030164]">
                          {pillar.subtitle}
                        </p>
                        <p className="text-xs text-slate-600 leading-relaxed">
                          {pillar.desc}
                        </p>
                        {Array.isArray(pillar.points) && pillar.points.length > 0 && (
                          <div className="pt-3 border-t border-slate-100 space-y-1.5">
                            {pillar.points.map((pt, pIdx) => (
                              <div key={pIdx} className="flex items-start gap-2 text-xs text-slate-700">
                                <CheckCircle2 className="w-3.5 h-3.5 text-[#030164] shrink-0 mt-0.5" />
                                <span>{pt}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* === TAB 10 (SMP): SMP PROFIL & LEGALITAS PREVIEW === */}
          {activeTab === 'smp_profil' && (
            <div className="p-6 sm:p-10 bg-slate-50 min-h-[500px] space-y-8">
              {/* Header */}
              <div className="bg-gradient-to-br from-[#030164] via-[#090580] to-[#01003d] text-white rounded-3xl p-6 sm:p-8 text-center space-y-2 shadow-md">
                <span className="text-xs font-bold text-[#030164] uppercase tracking-widest bg-[#ffd51e] px-3.5 py-1.5 rounded-full inline-block font-mono">
                  Profil Resmi &amp; Legalitas BAN-S/M Terakreditasi A
                </span>
                <h3 className="text-xl sm:text-3xl font-black text-white tracking-tight">
                  SMP IT Al-Afiyah Majalengka
                </h3>
                <p className="text-xs sm:text-sm text-slate-200 max-w-2xl mx-auto">
                  Sekolah Menengah Pertama Islam Terpadu berakhlak Qur&apos;ani di Lingkungan Giri Asih (Be Smart &amp; Religious)
                </p>
              </div>

              {/* Visi */}
              <div className="max-w-3xl mx-auto bg-white rounded-3xl border border-blue-200 p-6 sm:p-8 shadow-xs text-center space-y-3 relative overflow-hidden">
                <div className="w-10 h-10 rounded-2xl bg-blue-50 text-[#030164] mx-auto flex items-center justify-center font-bold">
                  <Compass className="w-5 h-5 text-[#030164]" />
                </div>
                <span className="text-xs font-extrabold uppercase tracking-widest text-[#030164] block">
                  Visi SMP IT Al-Afiyah
                </span>
                <p className="text-base sm:text-lg font-bold text-slate-900 italic leading-relaxed">
                  &ldquo;{formData.smpProfil?.visi || DEFAULT_SMP_PROFIL.visi}&rdquo;
                </p>
              </div>

              {/* Misi */}
              <div className="max-w-4xl mx-auto space-y-4">
                <div className="text-center">
                  <span className="text-xs font-bold text-[#030164] uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
                    6 Misi Strategis SMP IT Al-Afiyah
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {((formData.smpProfil?.misi && formData.smpProfil.misi.length > 0)
                    ? formData.smpProfil.misi
                    : DEFAULT_SMP_PROFIL.misi
                  ).map((misi, mIdx) => (
                    <div
                      key={mIdx}
                      className="bg-white rounded-2xl border border-slate-200 p-4 shadow-2xs flex items-start gap-3"
                    >
                      <span className="w-7 h-7 rounded-xl bg-[#030164] text-[#ffd51e] text-xs font-black flex items-center justify-center shrink-0 mt-0.5 font-mono">
                        0{mIdx + 1}
                      </span>
                      <p className="text-xs text-slate-700 leading-relaxed font-medium">
                        {misi}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Identitas Satuan Pendidikan & Legalitas BAN-S/M */}
              <div className="max-w-4xl mx-auto space-y-4 pt-4 border-t border-slate-200">
                <div className="text-center">
                  <span className="text-xs font-bold text-[#030164] uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
                    Data Satuan Pendidikan &amp; Legalitas BAN-S/M Terakreditasi A
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {((formData.smpProfil?.legalitas && formData.smpProfil.legalitas.length > 0)
                    ? formData.smpProfil.legalitas
                    : DEFAULT_SMP_PROFIL.legalitas
                  ).map((item, idIdx) => (
                    <div
                      key={idIdx}
                      className="bg-white rounded-2xl border border-slate-200 p-4 shadow-2xs flex flex-col justify-between"
                    >
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                        {item.label}
                      </span>
                      <p className="text-xs font-bold text-slate-800 leading-snug">
                        {item.value}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* FORMULIR EDITOR CANVAS */
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-10 min-h-[550px]">
          {/* TAB 1: HERO BANNER & SLIDES */}
          {activeTab === 'hero' && (
            <div className="space-y-8">
              {/* Slide Selector Header */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-200">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">
                    Kelola Slide Banner Carousel
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Pilih slide yang ingin disunting atau tambahkan slide baru untuk banner beranda.
                  </p>
                </div>

                <div className="flex items-center space-x-2">
                  {slides.map((s, idx) => (
                    <button
                      key={s.id || idx}
                      type="button"
                      onClick={() => setSelectedSlideIndex(idx)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                        selectedSlideIndex === idx
                          ? 'bg-[#184F48] text-white shadow-xs'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      Slide {idx + 1}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={handleAddSlide}
                    className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-xl text-xs font-bold bg-amber-50 text-amber-800 border border-amber-300 hover:bg-amber-100"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Tambah Slide</span>
                  </button>
                  {slides.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveSlide(selectedSlideIndex)}
                      className="inline-flex items-center space-x-1 px-2.5 py-1.5 rounded-xl text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100"
                      title="Hapus Slide Ini"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Editing Form for Selected Slide */}
              <div className="space-y-6 bg-slate-50/70 p-6 rounded-2xl border border-slate-200">
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-extrabold">
                    Mengedit: Slide {selectedSlideIndex + 1} dari {slides.length}
                  </span>
                  <span className="text-xs text-slate-400 font-mono">ID: {currentSlide.id}</span>
                </div>

                {/* Badge Text */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
                    Label Badge Atas
                  </label>
                  <input
                    type="text"
                    value={currentSlide.badge}
                    onChange={(e) => updateCurrentSlide('badge', e.target.value)}
                    placeholder="Contoh: SMP IT AL-AFIYAH MAJALENGKA"
                    className="w-full text-xs font-bold text-slate-900 border border-slate-300 rounded-xl p-3 bg-white focus:outline-none focus:ring-2 focus:ring-[#2D7A70]/30"
                  />
                  <span className="text-[11px] text-slate-400 mt-1 block">
                    Teks kecil berbingkai di atas judul utama.
                  </span>
                </div>

                {/* 3-Part Title Editor */}
                {schoolSlug === 'sd' && (
                  <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-950 flex items-start gap-2.5">
                    <span className="text-base flex-shrink-0">💡</span>
                    <div className="leading-relaxed">
                      <strong className="font-bold text-emerald-900 block mb-0.5">Konsep Carousel Hero SDIT:</strong>
                      Teks headline, subjudul, badge, dan tombol bersifat <strong>universal</strong> untuk seluruh carousel. Mengubah teks di sini akan diterapkan seragam ke seluruh slide, dan carousel di halaman publik hanya akan memutar 3 foto latar belakang (Slide 1, Slide 2, Slide 3) secara halus.
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
                      Judul Bagian 1 (Awal)
                    </label>
                    <input
                      type="text"
                      value={currentSlide.titlePart1}
                      onChange={(e) => updateCurrentSlide('titlePart1', e.target.value)}
                      placeholder={schoolSlug === 'sd' ? 'Bukan Sekedar Tempat Belajar, Namun Juga ' : 'Mencetak Pemimpin '}
                      className="w-full text-xs font-semibold text-slate-900 border border-slate-300 rounded-xl p-3 bg-white focus:outline-none focus:ring-2 focus:ring-[#2D7A70]/30"
                    />
                    <span className="text-[10px] text-slate-400 mt-1 block">
                      {schoolSlug === 'sd' ? 'Contoh: Bukan Sekedar Tempat Belajar, Namun Juga ' : 'Beri spasi di akhir agar tidak dempet dengan teks highlight.'}
                    </span>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-amber-800 uppercase tracking-wide mb-1.5">
                      Teks Highlight (Warna Kuning/Aksen)
                    </label>
                    <input
                      type="text"
                      value={currentSlide.titleHighlight}
                      onChange={(e) => updateCurrentSlide('titleHighlight', e.target.value)}
                      placeholder={schoolSlug === 'sd' ? 'Tempat Bertumbuh' : 'Qur’ani Berakhlak'}
                      className="w-full text-xs font-bold text-amber-900 border-2 border-amber-400 rounded-xl p-3 bg-amber-50/50 focus:outline-none focus:ring-2 focus:ring-amber-500/30"
                    />
                    <span className="text-[10px] text-amber-700/80 mt-1 block">
                      Kata kunci utama yang ingin ditonjolkan.
                    </span>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
                      Judul Bagian 2 (Penutup)
                    </label>
                    <input
                      type="text"
                      value={currentSlide.titlePart2}
                      onChange={(e) => updateCurrentSlide('titlePart2', e.target.value)}
                      placeholder={schoolSlug === 'sd' ? '(Kosongkan untuk SDIT)' : ' & Berwawasan Global'}
                      className="w-full text-xs font-semibold text-slate-900 border border-slate-300 rounded-xl p-3 bg-white focus:outline-none focus:ring-2 focus:ring-[#2D7A70]/30"
                    />
                    <span className="text-[10px] text-slate-400 mt-1 block">
                      {schoolSlug === 'sd' ? 'Untuk SDIT dikosongkan (tanpa kata Ananda).' : 'Teks penutup setelah highlight (opsional).'}
                    </span>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
                    Deskripsi Lengkap Slide
                  </label>
                  <textarea
                    rows={3}
                    value={currentSlide.description}
                    onChange={(e) => updateCurrentSlide('description', e.target.value)}
                    placeholder="Tuliskan penjelasan keunggulan, visi, atau kemudahan pendaftaran..."
                    className="w-full text-xs text-slate-800 border border-slate-300 rounded-xl p-3 bg-white focus:outline-none focus:ring-2 focus:ring-[#2D7A70]/30 leading-relaxed"
                  />
                </div>

                {/* Banner Image URL & Presets */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5 flex items-center space-x-1.5">
                    <ImageIcon className="w-3.5 h-3.5 text-[#2D7A70]" />
                    <span>Gambar Latar Banner</span>
                  </label>

                  {/* Preset quick selector */}
                  <div className="mb-3">
                    <span className="text-[11px] font-bold text-slate-500 block mb-1.5">
                      Pilih dari Galeri Foto Sekolah:
                      <span className="ml-2 text-slate-400 font-normal">(klik ✕ untuk hapus dari daftar)</span>
                    </span>
                    {/* Upload button — unggah foto baru langsung */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-2">
                      {availablePresetImages.map((preset) => (
                        <div
                          key={preset.url}
                          className={`relative p-1.5 rounded-xl border text-left transition-all group ${
                            currentSlide.image === preset.url
                              ? 'border-[#184F48] bg-[#E8F3F1] ring-2 ring-[#2D7A70]/20'
                              : 'border-slate-200 bg-white hover:bg-slate-100'
                          }`}
                        >
                          {/* Hapus dari daftar preset */}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRemovePresetImage(preset.url);
                            }}
                            className="absolute top-1 right-1 z-10 w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] font-bold flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-rose-600"
                            title="Hapus dari daftar galeri"
                          >
                            <X className="w-2.5 h-2.5" />
                          </button>
                          {/* Pilih gambar */}
                          <div
                            onClick={() => updateCurrentSlide('image', preset.url)}
                            className="cursor-pointer"
                          >
                            <div className="h-14 rounded-lg overflow-hidden relative mb-1">
                              <Image
                                src={preset.url}
                                alt={preset.label}
                                fill
                                sizes="120px"
                                className="w-full h-full object-cover"
                                unoptimized={preset.url.startsWith('data:')}
                              />
                            </div>
                            <span className="text-[10px] font-semibold text-slate-700 line-clamp-1 block">
                              {preset.label}
                            </span>
                          </div>
                        </div>
                      ))}

                      {/* Tombol Unggah Foto Baru */}
                      <div
                        className="relative p-1.5 rounded-xl border-2 border-dashed border-[#2D7A70]/40 bg-[#F0FAF8] hover:bg-[#E0F5F0] hover:border-[#2D7A70] transition-all cursor-pointer flex flex-col items-center justify-center gap-1 min-h-[82px] group"
                        onClick={() => !isUploading && fileInputRef.current?.click()}
                        title="Klik untuk unggah foto dari komputer"
                      >
                        {isUploading ? (
                          <>
                            <div className="w-5 h-5 border-2 border-[#2D7A70] border-t-transparent rounded-full animate-spin" />
                            <span className="text-[9px] font-bold text-[#2D7A70] text-center">Mengupload...</span>
                          </>
                        ) : (
                          <>
                            <Upload className="w-4 h-4 text-[#2D7A70] group-hover:scale-110 transition-transform" />
                            <span className="text-[10px] font-bold text-[#2D7A70] text-center leading-tight">Unggah<br/>Foto Baru</span>
                            <span className="text-[9px] text-slate-400 text-center">JPG/PNG/WebP<br/>maks 5MB</span>
                          </>
                        )}
                      </div>

                      {availablePresetImages.length === 0 && !isUploading && (
                        <div className="col-span-full text-center py-2 text-xs text-slate-400 italic">
                          Galeri kosong — unggah foto pertama via tombol di atas.
                        </div>
                      )}
                    </div>

                    {/* Hidden file input */}
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
                      className="hidden"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        const uploadedUrl = await handleUploadImage(file);
                        // Auto-select gambar yang baru diupload ke slide aktif
                        if (uploadedUrl) {
                          updateCurrentSlide('image', uploadedUrl);
                        }
                        e.target.value = '';
                      }}
                    />

                    {/* Upload error message */}
                    {uploadError && (
                      <div className="mt-2 flex items-center gap-1.5 text-[11px] text-rose-600 bg-rose-50 border border-rose-200 rounded-lg px-3 py-2">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                        <span>{uploadError}</span>
                        <button
                          type="button"
                          onClick={() => setUploadError(null)}
                          className="ml-auto text-rose-400 hover:text-rose-600"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    )}

                  </div>{/* end preset quick selector */}

                  <input
                    type="text"
                    value={currentSlide.image}
                    onChange={(e) => updateCurrentSlide('image', e.target.value)}
                    placeholder="Contoh: /images/smp-hero-fullday.jpg atau URL HTTPS..."
                    className="w-full text-xs font-mono text-slate-900 border border-slate-300 rounded-xl p-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-[#2D7A70]/30"
                  />
                </div>

                {/* CTA Buttons */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-2">
                    <span className="text-xs font-extrabold text-amber-700 block">
                      Tombol Utama (CTA 1)
                    </span>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-500 mb-1">Teks Tombol</label>
                      <input
                        type="text"
                        value={currentSlide.primaryCtaText}
                        onChange={(e) => updateCurrentSlide('primaryCtaText', e.target.value)}
                        className="w-full text-xs font-bold text-slate-800 border border-slate-200 rounded-lg p-2"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-500 mb-1">Link Tujuan</label>
                      <input
                        type="text"
                        value={currentSlide.primaryCtaLink}
                        onChange={(e) => updateCurrentSlide('primaryCtaLink', e.target.value)}
                        className="w-full text-xs font-mono text-slate-800 border border-slate-200 rounded-lg p-2"
                      />
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-2">
                    <span className="text-xs font-extrabold text-[#184F48] block">
                      Tombol Sekunder (CTA 2)
                    </span>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-500 mb-1">Teks Tombol</label>
                      <input
                        type="text"
                        value={currentSlide.secondaryCtaText}
                        onChange={(e) => updateCurrentSlide('secondaryCtaText', e.target.value)}
                        className="w-full text-xs font-bold text-slate-800 border border-slate-200 rounded-lg p-2"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-500 mb-1">Link Tujuan</label>
                      <input
                        type="text"
                        value={currentSlide.secondaryCtaLink}
                        onChange={(e) => updateCurrentSlide('secondaryCtaLink', e.target.value)}
                        className="w-full text-xs font-mono text-slate-800 border border-slate-200 rounded-lg p-2"
                      />
                    </div>
                  </div>
                </div>

                {/* Trust Badges Editor */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-2">
                    4 Badge Penjamin Mutu (Trust Items di Bawah Deskripsi)
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
                    {(currentSlide.trustItems || [
                      { icon: 'shield', text: 'Terakreditasi A' },
                      { icon: 'award', text: 'Target Prestasi' },
                      { icon: 'calendar', text: 'T.A. 2027/2028' },
                      { icon: 'check', text: 'Formulir Resmi' }
                    ]).map((tItem, tIdx) => (
                      <div key={tIdx} className="p-2.5 rounded-xl bg-white border border-slate-200 flex items-center space-x-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                        <input
                          type="text"
                          value={tItem.text}
                          onChange={(e) => {
                            const newTrust = [...(currentSlide.trustItems || [])];
                            newTrust[tIdx] = { ...newTrust[tIdx], text: e.target.value };
                            updateCurrentSlide('trustItems', newTrust);
                          }}
                          placeholder={`Badge ${tIdx + 1}`}
                          className="w-full text-xs font-semibold text-slate-800 border-none bg-transparent focus:outline-none"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: PROFIL, IDENTITAS, ALAMAT & KONTAK */}
          {activeTab === 'identity' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
                    Nama Resmi Unit / Yayasan
                  </label>
                  <input
                    type="text"
                    value={formData.identity.name}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        identity: { ...formData.identity, name: e.target.value }
                      })
                    }
                    className="w-full text-sm font-bold text-slate-900 border border-slate-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-[#2D7A70]/30"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
                    Badge Resmi Sekolah
                  </label>
                  <input
                    type="text"
                    value={formData.identity.badgeText}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        identity: { ...formData.identity, badgeText: e.target.value }
                      })
                    }
                    className="w-full text-xs font-bold text-slate-900 border border-slate-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-[#2D7A70]/30"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
                  Slogan / Tagline Visi
                </label>
                <input
                  type="text"
                  value={formData.identity.tagline}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      identity: { ...formData.identity, tagline: e.target.value }
                    })
                  }
                  className="w-full text-xs font-semibold text-slate-900 border border-slate-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-[#2D7A70]/30"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5 flex items-center space-x-1">
                  <MapPin className="w-3.5 h-3.5 text-[#2D7A70]" />
                  <span>Alamat Sekolah Lengkap</span>
                </label>
                <textarea
                  rows={2}
                  value={formData.identity.schoolAddress}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      identity: { ...formData.identity, schoolAddress: e.target.value }
                    })
                  }
                  className="w-full text-xs text-slate-800 border border-slate-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-[#2D7A70]/30 leading-relaxed"
                />
                <span className="text-[11px] text-slate-400 mt-1 block">
                  Alamat ini otomatis diperbarui ke footer web, kop formulir pendaftaran, dan cetak berkas induk murid.
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5 flex items-center space-x-1">
                    <Phone className="w-3.5 h-3.5 text-[#2D7A70]" />
                    <span>Nomor WhatsApp Panitia/CS</span>
                  </label>
                  <input
                    type="text"
                    value={formData.identity.whatsappNumber}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        identity: { ...formData.identity, whatsappNumber: e.target.value }
                      })
                    }
                    placeholder="6281234567890"
                    className="w-full text-xs font-mono font-bold text-slate-900 border border-slate-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-[#2D7A70]/30"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5 flex items-center space-x-1">
                    <Users className="w-3.5 h-3.5 text-[#2D7A70]" />
                    <span>Nama Petugas CS / Kontak</span>
                  </label>
                  <input
                    type="text"
                    value={formData.identity.officerName || 'Panitia PPDB Al-Afiyah'}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        identity: { ...formData.identity, officerName: e.target.value }
                      })
                    }
                    className="w-full text-xs font-semibold text-slate-900 border border-slate-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-[#2D7A70]/30"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5 flex items-center space-x-1">
                    <Mail className="w-3.5 h-3.5 text-[#2D7A70]" />
                    <span>Email Resmi Unit</span>
                  </label>
                  <input
                    type="email"
                    value={formData.identity.email || 'info@alafiyah.id'}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        identity: { ...formData.identity, email: e.target.value }
                      })
                    }
                    className="w-full text-xs font-mono text-slate-900 border border-slate-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-[#2D7A70]/30"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5 flex items-center space-x-1">
                    <Clock className="w-3.5 h-3.5 text-[#2D7A70]" />
                    <span>Jam Layanan Konsultasi</span>
                  </label>
                  <input
                    type="text"
                    value={formData.identity.consultationHours || 'Senin - Sabtu: 07.30 - 15.00 WIB'}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        identity: { ...formData.identity, consultationHours: e.target.value }
                      })
                    }
                    className="w-full text-xs font-semibold text-slate-900 border border-slate-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-[#2D7A70]/30"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: STATS COUNTER */}
          {activeTab === 'stats' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  4 Angka Pencapaian &amp; Statistik Utama
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Tampil pada counter bar hijau di beranda untuk menunjukkan kredibilitas sekolah.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {(formData.stats && formData.stats.length > 0 ? formData.stats : (
                  schoolSlug === 'sd' ? [
                    { label: 'Kuota Penerimaan', value: 'Hanya 2 Rombel' },
                    { label: 'Pilar Pendidikan', value: 'Smart Akhlak Fitrah' },
                    { label: 'Akreditasi Sekolah', value: 'Terakreditasi B' },
                    { label: 'Bimbingan Tahfidz', value: 'Juz 30 Mutqin' }
                  ] : [
                    { label: 'Murid Aktif', value: '450+' },
                    { label: 'Dewan Guru Berpengalaman', value: '38 Guru' },
                    { label: 'Akreditasi Lembaga', value: 'Terakreditasi B' },
                    { label: 'Target Tahfidz', value: 'Tartil & Mutqin' }
                  ]
                )).map((st, i) => (
                  <div key={i} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                    <span className="text-xs font-extrabold text-[#184F48]">
                      Statistik #{i + 1}
                    </span>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-500 mb-1">Label / Keterangan</label>
                      <input
                        type="text"
                        value={st.label}
                        onChange={(e) => {
                          const newStats = [...(formData.stats || [])];
                          newStats[i] = { ...newStats[i], label: e.target.value };
                          setFormData({ ...formData, stats: newStats });
                        }}
                        className="w-full text-xs font-bold text-slate-800 border border-slate-200 rounded-lg p-2.5 bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-500 mb-1">Nilai Angka / Capaian</label>
                      <input
                        type="text"
                        value={st.value}
                        onChange={(e) => {
                          const newStats = [...(formData.stats || [])];
                          newStats[i] = { ...newStats[i], value: e.target.value };
                          setFormData({ ...formData, stats: newStats });
                        }}
                        className="w-full text-xs font-bold text-emerald-800 border border-slate-200 rounded-lg p-2.5 bg-white"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: VALUES */}
          {activeTab === 'values' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  3 Nilai &amp; Pilar Karakter Keunggulan
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Tampil pada kartu keistimewaan sekolah di beranda.
                </p>
              </div>

              <div className="space-y-4">
                {(formData.values && formData.values.length > 0 ? formData.values : (
                  schoolSlug === 'sd' ? [
                    {
                      title: 'Mendidik dengan Sunnah & Karakter Nabawiyah',
                      description: 'Mendidik dengan sunnah, menggunakan metode Pendidikan Karakter Nabawiyah, menanamkan akhlak dan ilmu, serta iman sebelum Al-Qur\'an.'
                    },
                    {
                      title: 'Smart, Literasi & Tahfidz Qur\'an',
                      description: 'Pembelajaran terpadu penguatan basic literasi dan numerasi serta bimbingan tahfidz Juz 30 mutqin dengan suasana asri yang membahagiakan murid.'
                    },
                    {
                      title: 'Outdoor Learning & Pelatihan Aqil-Baligh',
                      description: 'Eksplorasi kontekstual di alam dan kebun pertanian terbuka, pelatihan kemandirian aqil-baligh, serta pemetaan potensi bakat dan skill murid.'
                    }
                  ] : [
                    { title: 'Akidah & Akhlakul Karimah', description: 'Penanaman adab nabawiyah, pembiasaan shalat berjamaah, dan birrul walidain.' },
                    { title: 'Tahsin & Tahfidz Al-Qur\'an', description: 'Bimbingan talaqqi ramah anak dengan target hafalan mutqin dan tartil.' },
                    { title: 'Sains & Teknologi Unggulan', description: 'Pembelajaran sains terpadu, literasi digital dan bilingual aplikatif.' }
                  ]
                )).map((val, i) => (
                  <div key={i} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                    <span className="text-xs font-extrabold text-[#184F48]">
                      Pilar Keunggulan #{i + 1}
                    </span>
                    <input
                      type="text"
                      value={val.title}
                      onChange={(e) => {
                        const newVals = [...(formData.values || [])];
                        newVals[i] = { ...newVals[i], title: e.target.value };
                        setFormData({ ...formData, values: newVals });
                      }}
                      placeholder="Judul Pilar"
                      className="w-full text-xs font-bold text-slate-800 border border-slate-200 rounded-lg p-2.5 bg-white"
                    />
                    <textarea
                      rows={2}
                      value={val.description}
                      onChange={(e) => {
                        const newVals = [...(formData.values || [])];
                        newVals[i] = { ...newVals[i], description: e.target.value };
                        setFormData({ ...formData, values: newVals });
                      }}
                      placeholder="Deskripsi keunggulan..."
                      className="w-full text-xs text-slate-700 border border-slate-200 rounded-lg p-2.5 bg-white leading-relaxed"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: PROGRAMS */}
          {activeTab === 'programs' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Daftar Program Pilihan &amp; Unggulan
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Kartu program yang ditampilkan pada tab kurikulum dan akademik unit.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const newProg = {
                      title: 'Program Baru',
                      desc: 'Deskripsi kurikulum atau bimbingan khusus...',
                      badge: 'Unggulan'
                    };
                    setFormData({
                      ...formData,
                      programs: [...(formData.programs || []), newProg]
                    });
                  }}
                  className="px-3 py-1.5 rounded-lg text-xs font-bold bg-[#184F48] text-white flex items-center space-x-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Tambah Program</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {(formData.programs || []).map((prog, i) => (
                  <div key={i} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 relative">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-extrabold text-[#184F48]">
                        Program #{i + 1}
                      </span>
                      {formData.programs.length > 1 && (
                        <button
                          type="button"
                          onClick={() => {
                            const newP = formData.programs.filter((_, idx) => idx !== i);
                            setFormData({ ...formData, programs: newP });
                          }}
                          className="text-rose-500 hover:text-rose-700 text-xs"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        value={prog.badge}
                        onChange={(e) => {
                          const newP = [...formData.programs];
                          newP[i] = { ...newP[i], badge: e.target.value };
                          setFormData({ ...formData, programs: newP });
                        }}
                        placeholder="Badge (cth: Unggulan)"
                        className="w-1/3 text-xs font-semibold text-amber-800 border border-slate-200 rounded-lg p-2 bg-white"
                      />
                      <input
                        type="text"
                        value={prog.title}
                        onChange={(e) => {
                          const newP = [...formData.programs];
                          newP[i] = { ...newP[i], title: e.target.value };
                          setFormData({ ...formData, programs: newP });
                        }}
                        placeholder="Nama Program"
                        className="w-2/3 text-xs font-bold text-slate-800 border border-slate-200 rounded-lg p-2 bg-white"
                      />
                    </div>
                    <textarea
                      rows={2}
                      value={prog.desc}
                      onChange={(e) => {
                        const newP = [...formData.programs];
                        newP[i] = { ...newP[i], desc: e.target.value };
                        setFormData({ ...formData, programs: newP });
                      }}
                      placeholder="Deskripsi kegiatan atau target capaian..."
                      className="w-full text-xs text-slate-700 border border-slate-200 rounded-lg p-2 bg-white"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 6: FACILITIES & GALLERY DOKUMENTASI */}
          {activeTab === 'facilities' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Galeri Dokumentasi &amp; Fasilitas Belajar ({formData.facilities?.length || 0} Item)
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Kelola foto kegiatan, aktivitas belajar, sarana sekolah, dan kategori filter galeri publik.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const newF = {
                      name: 'Dokumentasi / Fasilitas Baru',
                      image: '/images/sd-activity-shalat-berjamaah.jpg',
                      desc: 'Deskripsi singkat mengenai aktivitas atau fasilitas ini...',
                      category: 'Aktivitas Kelas'
                    };
                    setFormData({
                      ...formData,
                      facilities: [...(formData.facilities || []), newF]
                    });
                  }}
                  className="px-3 py-1.5 rounded-lg text-xs font-bold bg-[#184F48] text-white flex items-center space-x-1 cursor-pointer hover:bg-[#123e38] transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Tambah Item Galeri</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {(formData.facilities || []).map((fac: any, i: number) => (
                  <div key={i} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3 shadow-2xs">
                    <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                      <span className="text-xs font-extrabold text-[#184F48]">
                        Item Galeri #{i + 1}
                      </span>
                      {formData.facilities && formData.facilities.length > 1 && (
                        <button
                          type="button"
                          onClick={() => {
                            const newF = formData.facilities.filter((_, idx) => idx !== i);
                            setFormData({ ...formData, facilities: newF });
                          }}
                          className="text-rose-500 hover:text-rose-700 text-xs flex items-center space-x-1 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Hapus</span>
                        </button>
                      )}
                    </div>

                    {/* Image Thumbnail Preview */}
                    <div className="relative w-full h-32 rounded-lg overflow-hidden border border-slate-200 bg-slate-100 group">
                      <img
                        src={fac.image || '/images/sd-hero-greenhouse.jpg'}
                        alt={fac.name || 'Dokumentasi'}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <span className="text-[11px] font-bold text-white bg-black/60 px-2.5 py-1 rounded-md">Pratinjau Foto</span>
                      </div>
                    </div>

                    {/* Inputs */}
                    <div className="space-y-2">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 mb-0.5">Nama / Judul Kegiatan</label>
                        <input
                          type="text"
                          value={fac.name}
                          onChange={(e) => {
                            const newF = [...(formData.facilities || [])];
                            newF[i] = { ...newF[i], name: e.target.value };
                            setFormData({ ...formData, facilities: newF });
                          }}
                          placeholder="Nama Fasilitas / Kegiatan"
                          className="w-full text-xs font-bold text-slate-800 border border-slate-200 rounded-lg p-2 bg-white"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 mb-0.5">Kategori Filter Galeri</label>
                        <input
                          type="text"
                          value={fac.category || 'Aktivitas Kelas'}
                          onChange={(e) => {
                            const newF = [...(formData.facilities || [])];
                            newF[i] = { ...newF[i], category: e.target.value };
                            setFormData({ ...formData, facilities: newF });
                          }}
                          placeholder="Cth: Ibadah & Karakter, Agro-Sains & Alam, Karakter & Da'i, Aktivitas Kelas, Prestasi & Bakat"
                          className="w-full text-xs font-semibold text-emerald-800 border border-slate-200 rounded-lg p-2 bg-white"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 mb-0.5">URL / Path Foto</label>
                        <input
                          type="text"
                          value={fac.image}
                          onChange={(e) => {
                            const newF = [...(formData.facilities || [])];
                            newF[i] = { ...newF[i], image: e.target.value };
                            setFormData({ ...formData, facilities: newF });
                          }}
                          placeholder="URL Foto /images/..."
                          className="w-full text-xs font-mono text-slate-700 border border-slate-200 rounded-lg p-2 bg-white"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 mb-0.5">Deskripsi Ringkas</label>
                        <textarea
                          rows={2}
                          value={fac.desc}
                          onChange={(e) => {
                            const newF = [...(formData.facilities || [])];
                            newF[i] = { ...newF[i], desc: e.target.value };
                            setFormData({ ...formData, facilities: newF });
                          }}
                          placeholder="Deskripsi singkat kegiatan atau sarana..."
                          className="w-full text-xs text-slate-700 border border-slate-200 rounded-lg p-2 bg-white"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 7: TESTIMONIALS */}
          {activeTab === 'testimonials' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Testimoni Wali Murid
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Kutipan apresiasi dari orang tua murid untuk menginspirasi pendaftar baru.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const newT = {
                      name: 'Nama Orang Tua Baru',
                      role: `Wali Murid ${badgeText}`,
                      quote: 'Alhamdulillah, ananda mengalami peningkatan adab dan hafalan yang luar biasa...'
                    };
                    setFormData({
                      ...formData,
                      testimonials: [...(formData.testimonials || []), newT]
                    });
                  }}
                  className="px-3 py-1.5 rounded-lg text-xs font-bold bg-[#184F48] text-white flex items-center space-x-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Tambah Testimoni</span>
                </button>
              </div>

              <div className="space-y-4">
                {(formData.testimonials || []).map((t, i) => (
                  <div key={i} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-extrabold text-[#184F48]">
                        Testimoni #{i + 1}
                      </span>
                      {formData.testimonials.length > 1 && (
                        <button
                          type="button"
                          onClick={() => {
                            const newT = formData.testimonials.filter((_, idx) => idx !== i);
                            setFormData({ ...formData, testimonials: newT });
                          }}
                          className="text-rose-500 hover:text-rose-700 text-xs"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <input
                        type="text"
                        value={t.name}
                        onChange={(e) => {
                          const newT = [...formData.testimonials];
                          newT[i] = { ...newT[i], name: e.target.value };
                          setFormData({ ...formData, testimonials: newT });
                        }}
                        placeholder="Nama Lengkap Wali Murid"
                        className="w-full text-xs font-bold text-slate-800 border border-slate-200 rounded-lg p-2 bg-white"
                      />
                      <input
                        type="text"
                        value={t.role}
                        onChange={(e) => {
                          const newT = [...formData.testimonials];
                          newT[i] = { ...newT[i], role: e.target.value };
                          setFormData({ ...formData, testimonials: newT });
                        }}
                        placeholder="Peran (cth: Wali Murid Kelas 7)"
                        className="w-full text-xs font-semibold text-slate-600 border border-slate-200 rounded-lg p-2 bg-white"
                      />
                    </div>
                    <textarea
                      rows={2}
                      value={t.quote}
                      onChange={(e) => {
                        const newT = [...formData.testimonials];
                        newT[i] = { ...newT[i], quote: e.target.value };
                        setFormData({ ...formData, testimonials: newT });
                      }}
                      placeholder="Kutipan testimoni..."
                      className="w-full text-xs text-slate-700 border border-slate-200 rounded-lg p-2 bg-white leading-relaxed"
                    />
                  </div>
                ))}
              </div>

              {/* Bottom Action & Sync Bar specifically for Testimonials */}
              <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50/80 p-4 rounded-2xl border">
                <div>
                  <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-[#00A651]" />
                    <span>Lokasi Tayang: Halaman Profil &amp; Beranda ({publicUrl}#testimonials)</span>
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Klik tombol di samping untuk menyimpan dan menerbitkan testimoni terbaru ini secara instan.
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Link
                    href={`${publicUrl}#testimonials`}
                    target="_blank"
                    className="px-3.5 py-2 rounded-xl text-xs font-bold text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 transition-all flex items-center gap-1.5 shadow-2xs"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Lihat di Halaman</span>
                  </Link>
                  <button
                    type="button"
                    onClick={handleSave}
                    disabled={isSaving}
                    className="px-5 py-2.5 rounded-xl text-xs font-extrabold text-white bg-[#00A651] hover:bg-[#008f45] disabled:opacity-50 transition-all flex items-center gap-2 shadow-sm cursor-pointer"
                  >
                    <Save className="w-4 h-4" />
                    <span>{isSaving ? 'Menyimpan...' : 'Simpan Testimoni'}</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 8: TUITION */}
          {activeTab === 'tuition' && (
            schoolSlug === 'smp' ? (
              <div className="space-y-6">
                {/* Notice banner */}
                <div className="p-4 rounded-2xl bg-blue-50/80 border border-blue-200 flex items-start gap-3">
                  <CreditCard className="w-5 h-5 text-[#030164] shrink-0 mt-0.5" />
                  <div className="text-xs space-y-1">
                    <p className="font-bold text-slate-900">
                      Rincian Biaya SPMB Terpadu SMP IT Al-Afiyah
                    </p>
                    <p className="text-slate-600 leading-relaxed">
                      Komponen di bawah ini tampil transparan di tabel biaya publik dan simulator kalkulator pendaftaran. Nominal uang bangunan otomatis menjadi acuan diskon 70% alumni SDIT dan 50% pendaftar umum.
                    </p>
                  </div>
                </div>

                {/* Section 1: Biaya Formulir, Sarana & SPP */}
                <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-4">
                  <h4 className="text-xs font-black uppercase tracking-wider text-[#030164] flex items-center gap-1.5 pb-2 border-b border-slate-100">
                    <Tag className="w-3.5 h-3.5" />
                    <span>1. Biaya Pendaftaran, Sarana &amp; SPP Bulanan</span>
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
                        Infaq Formulir PPDB (Rp)
                      </label>
                      <input
                        type="number"
                        value={formData.tuition.registrationFee}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            tuition: {
                              ...formData.tuition,
                              registrationFee: parseInt(e.target.value) || 0
                            }
                          })
                        }
                        className="w-full text-xs font-mono font-bold text-slate-900 border border-slate-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-[#030164]/30"
                      />
                      <span className="text-[10px] text-slate-400 mt-1 block">Default: Rp 200.000</span>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
                        Uang Bangunan / Sarana (Rp)
                      </label>
                      <input
                        type="number"
                        value={formData.tuition.buildingFee || formData.tuition.developmentFee || 2500000}
                        onChange={(e) => {
                          const val = parseInt(e.target.value) || 0;
                          setFormData({
                            ...formData,
                            tuition: {
                              ...formData.tuition,
                              buildingFee: val,
                              developmentFee: val
                            }
                          });
                        }}
                        className="w-full text-xs font-mono font-bold text-slate-900 border border-slate-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-[#030164]/30"
                      />
                      <span className="text-[10px] text-slate-400 mt-1 block">Default: Rp 2.500.000 (tarif normal)</span>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
                        SPP Bulanan (Rp)
                      </label>
                      <input
                        type="number"
                        value={formData.tuition.monthlyTuition}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            tuition: {
                              ...formData.tuition,
                              monthlyTuition: parseInt(e.target.value) || 0
                            }
                          })
                        }
                        className="w-full text-xs font-mono font-bold text-slate-900 border border-slate-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-[#030164]/30"
                      />
                      <span className="text-[10px] text-slate-400 mt-1 block">Default: Rp 300.000 / bulan</span>
                    </div>
                  </div>
                </div>

                {/* Section 2: Perlengkapan, Fasilitas & Kegiatan */}
                <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-4">
                  <h4 className="text-xs font-black uppercase tracking-wider text-[#030164] flex items-center gap-1.5 pb-2 border-b border-slate-100">
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>2. Fasilitas, Perlengkapan, Seragam &amp; Kegiatan</span>
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
                        Fasilitas Pembelajaran Modern (Rp)
                      </label>
                      <input
                        type="number"
                        value={formData.tuition.learningFacilities ?? 500000}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            tuition: {
                              ...formData.tuition,
                              learningFacilities: parseInt(e.target.value) || 0
                            }
                          })
                        }
                        className="w-full text-xs font-mono font-bold text-slate-900 border border-slate-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-[#030164]/30"
                      />
                      <span className="text-[10px] text-slate-400 mt-1 block">Default: Rp 500.000</span>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
                        Paket Seragam Ikhwan / Putra (Rp)
                      </label>
                      <input
                        type="number"
                        value={formData.tuition.uniformIkhwan ?? 1100000}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            tuition: {
                              ...formData.tuition,
                              uniformIkhwan: parseInt(e.target.value) || 0
                            }
                          })
                        }
                        className="w-full text-xs font-mono font-bold text-slate-900 border border-slate-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-[#030164]/30"
                      />
                      <span className="text-[10px] text-slate-400 mt-1 block">Default: Rp 1.100.000</span>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
                        Paket Seragam Akhwat / Putri Syar&apos;i (Rp)
                      </label>
                      <input
                        type="number"
                        value={formData.tuition.uniformAkhwat ?? 1400000}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            tuition: {
                              ...formData.tuition,
                              uniformAkhwat: parseInt(e.target.value) || 0
                            }
                          })
                        }
                        className="w-full text-xs font-mono font-bold text-slate-900 border border-slate-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-[#030164]/30"
                      />
                      <span className="text-[10px] text-slate-400 mt-1 block">Default: Rp 1.400.000</span>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
                        Paket Buku Pelajaran &amp; Modul (Rp)
                      </label>
                      <input
                        type="number"
                        value={formData.tuition.bookPackage ?? 1000000}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            tuition: {
                              ...formData.tuition,
                              bookPackage: parseInt(e.target.value) || 0
                            }
                          })
                        }
                        className="w-full text-xs font-mono font-bold text-slate-900 border border-slate-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-[#030164]/30"
                      />
                      <span className="text-[10px] text-slate-400 mt-1 block">Default: Rp 1.000.000</span>
                    </div>

                    <div className="sm:col-span-2 lg:col-span-2">
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
                        Program Kegiatan Murid (SCD, Outing, Mutaba&apos;ah) (Rp)
                      </label>
                      <input
                        type="number"
                        value={formData.tuition.studentActivities ?? 1700000}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            tuition: {
                              ...formData.tuition,
                              studentActivities: parseInt(e.target.value) || 0
                            }
                          })
                        }
                        className="w-full text-xs font-mono font-bold text-slate-900 border border-slate-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-[#030164]/30"
                      />
                      <span className="text-[10px] text-slate-400 mt-1 block">Default: Rp 1.700.000</span>
                    </div>
                  </div>
                </div>

                {/* Section 3: Kuota & Periode Gelombang */}
                <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-4">
                  <h4 className="text-xs font-black uppercase tracking-wider text-[#030164] flex items-center gap-1.5 pb-2 border-b border-slate-100">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>3. Kuota Penerimaan &amp; Gelombang PPDB</span>
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
                        Sisa Kuota Penerimaan Murid
                      </label>
                      <input
                        type="number"
                        value={formData.tuition.quota ?? 60}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            tuition: {
                              ...formData.tuition,
                              quota: parseInt(e.target.value) || 0
                            }
                          })
                        }
                        className="w-full text-xs font-bold text-slate-900 border border-slate-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-[#030164]/30"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
                        Nama Gelombang PPDB Aktif
                      </label>
                      <input
                        type="text"
                        value={formData.tuition.waveName || 'Gelombang 1 (2027/2028)'}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            tuition: {
                              ...formData.tuition,
                              waveName: e.target.value
                            }
                          })
                        }
                        className="w-full text-xs font-semibold text-slate-900 border border-slate-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-[#030164]/30"
                      />
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
                      Biaya Formulir PPDB (Rp)
                    </label>
                    <input
                      type="number"
                      value={formData.tuition.registrationFee}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          tuition: {
                            ...formData.tuition,
                            registrationFee: parseInt(e.target.value) || 0
                          }
                        })
                      }
                      className="w-full text-xs font-mono font-bold text-slate-900 border border-slate-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-[#2D7A70]/30"
                    />
                    <span className="text-[10px] text-slate-400 mt-1 block">
                      Diperbarui langsung ke invoice PPDB online.
                    </span>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
                      SPP Bulanan (Rp)
                    </label>
                    <input
                      type="number"
                      value={formData.tuition.monthlyTuition}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          tuition: {
                            ...formData.tuition,
                            monthlyTuition: parseInt(e.target.value) || 0
                          }
                        })
                      }
                      className="w-full text-xs font-mono font-bold text-slate-900 border border-slate-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-[#2D7A70]/30"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
                      Uang Pengembangan / Pangkal (Rp)
                    </label>
                    <input
                      type="number"
                      value={formData.tuition.developmentFee || formData.tuition.buildingFee || 0}
                      onChange={(e) => {
                        const val = parseInt(e.target.value) || 0;
                        setFormData({
                          ...formData,
                          tuition: {
                            ...formData.tuition,
                            developmentFee: val,
                            buildingFee: val
                          }
                        });
                      }}
                      className="w-full text-xs font-mono font-bold text-slate-900 border border-slate-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-[#2D7A70]/30"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
                      Sisa Kuota Penerimaan
                    </label>
                    <input
                      type="number"
                      value={formData.tuition.quota ?? 60}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          tuition: {
                            ...formData.tuition,
                            quota: parseInt(e.target.value) || 0
                          }
                        })
                      }
                      className="w-full text-xs font-bold text-slate-900 border border-slate-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-[#2D7A70]/30"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
                      Nama Gelombang PPDB
                    </label>
                    <input
                      type="text"
                      value={formData.tuition.waveName || 'Gelombang 1 (2027/2028)'}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          tuition: {
                            ...formData.tuition,
                            waveName: e.target.value
                          }
                        })
                      }
                      className="w-full text-xs font-semibold text-slate-900 border border-slate-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-[#2D7A70]/30"
                    />
                  </div>
                </div>
              </div>
            )
          )}

          {/* TAB 9: AFFILIATE LANDING PAGE EDITOR (FOUNDATION ONLY) */}
          {activeTab === 'affiliate' && schoolSlug === 'foundation' && (
            <div className="space-y-8 animate-fadeIn">
              {/* Header Banner */}
              <div className="p-5 rounded-2xl bg-[#E8F3F1] border border-[#2D7A70]/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-[#184F48] text-white flex items-center justify-center shrink-0 shadow-xs">
                    <Share2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-extrabold text-slate-900">
                      Editor Landing Page Kemitraan Afiliasi (/affiliate)
                    </h3>
                    <p className="text-xs text-slate-600 mt-0.5">
                      Kelola 3 foto bento hero, teks berjalan (marquee ticker), foto seksi pengenalan, dan tarif bagi hasil komisi syirkah.
                    </p>
                  </div>
                </div>

                <a
                  href="/affiliate"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-800 font-bold text-xs border border-slate-200 shadow-2xs transition-all shrink-0"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
                  <span>Lihat Halaman /affiliate</span>
                </a>
              </div>

              {/* CARD 1: HERO COPYWRITING & BENTO PHOTO COLLAGE */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
                <div className="border-b border-slate-100 pb-4">
                  <h4 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                    <ImageIcon className="w-4 h-4 text-[#184F48]" />
                    <span>1. Kolase Foto &amp; Teks Hero (/affiliate)</span>
                  </h4>
                  <p className="text-xs text-slate-500 mt-1">
                    Atur copywriting headline utama dan 3 foto kolase bento yang tampil di bagian atas landing page afiliasi.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
                      Badge Kapsul Atas
                    </label>
                    <input
                      type="text"
                      value={formData.affiliate?.heroBadge || ''}
                      onChange={(e) => updateAffiliate('heroBadge', e.target.value)}
                      placeholder="Program Kemitraan Dakwah & Kebaikan"
                      className="w-full text-xs font-semibold text-slate-900 border border-slate-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-[#2D7A70]/30"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
                      Aksen Teks Berwarna Hijau
                    </label>
                    <input
                      type="text"
                      value={formData.affiliate?.heroHighlight || ''}
                      onChange={(e) => updateAffiliate('heroHighlight', e.target.value)}
                      placeholder="Raih Apresiasi Berkah Nyata"
                      className="w-full text-xs font-bold text-slate-900 border border-slate-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-[#2D7A70]/30"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
                      Judul Utama Headline
                    </label>
                    <input
                      type="text"
                      value={formData.affiliate?.heroHeadline || ''}
                      onChange={(e) => updateAffiliate('heroHeadline', e.target.value)}
                      placeholder="Sebar Kebaikan Pendidikan,"
                      className="w-full text-xs font-bold text-slate-900 border border-slate-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-[#2D7A70]/30"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
                      Deskripsi Pengantar Subheadline
                    </label>
                    <textarea
                      rows={3}
                      value={formData.affiliate?.heroDescription || ''}
                      onChange={(e) => updateAffiliate('heroDescription', e.target.value)}
                      className="w-full text-xs text-slate-900 border border-slate-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-[#2D7A70]/30 leading-relaxed"
                    />
                  </div>
                </div>

                {/* 3 Bento Photos */}
                <div className="pt-4 border-t border-slate-100 space-y-4">
                  <h5 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    3 Foto Kolase Bento Hero (Ganti / Unggah Foto)
                  </h5>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                    {renderAffiliateImagePicker(
                      'Foto 1 (Kiri Atas - Tahfidz)',
                      'Foto vertikal/kotak kegiatan halaqah atau keagamaan',
                      formData.affiliate?.heroPhoto1 || '/images/sd-activity-halaqah-tahfidz.jpg',
                      (url) => updateAffiliate('heroPhoto1', url)
                    )}

                    {renderAffiliateImagePicker(
                      'Foto 2 (Kanan Atas - Kelas)',
                      'Foto suasana interaksi belajar mengajar di ruang kelas',
                      formData.affiliate?.heroPhoto2 || '/images/sd-activity-classroom-6b.jpg',
                      (url) => updateAffiliate('heroPhoto2', url)
                    )}

                    {renderAffiliateImagePicker(
                      'Foto 3 (Bawah Lebar - Outing)',
                      'Foto lanskap kegiatan outing / santri lapangan',
                      formData.affiliate?.heroPhoto3 || '/images/smp-outing-1.jpg',
                      (url) => updateAffiliate('heroPhoto3', url)
                    )}
                  </div>
                </div>
              </div>

              {/* CARD 2: RUNNING MARQUEE TICKER BANNER */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5">
                <div className="border-b border-slate-100 pb-4">
                  <h4 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                    <Sliders className="w-4 h-4 text-[#184F48]" />
                    <span>2. Pita Teks Berjalan (Running Marquee Ticker)</span>
                  </h4>
                  <p className="text-xs text-slate-500 mt-1">
                    Kelola kata-kata dan poin kunci yang bergeser ke samping secara horizontal pada pita hijau tua.
                  </p>
                </div>

                {/* Chips of current keywords */}
                <div className="flex flex-wrap gap-2 items-center p-3 bg-slate-50 rounded-xl border border-slate-200 min-h-[50px]">
                  {(formData.affiliate?.marqueeKeywords || DEFAULT_AFFILIATE_CONTENT.marqueeKeywords).map(
                    (kw, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#153424] text-white text-xs font-bold shadow-2xs group"
                      >
                        <span>{kw}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveKeyword(idx)}
                          className="w-4 h-4 rounded-full bg-white/20 hover:bg-rose-500 text-white flex items-center justify-center text-[10px] cursor-pointer transition-colors"
                          title="Hapus kata ini"
                        >
                          ×
                        </button>
                      </span>
                    )
                  )}
                </div>

                {/* Add new keyword */}
                <div className="flex items-center gap-2 max-w-lg">
                  <input
                    type="text"
                    value={newKeywordInput}
                    onChange={(e) => setNewKeywordInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddKeyword();
                      }
                    }}
                    placeholder="Ketik kata baru lalu klik Tambah..."
                    className="flex-1 text-xs font-semibold text-slate-900 border border-slate-300 rounded-xl p-2.5 focus:outline-none focus:ring-2 focus:ring-[#2D7A70]/30 bg-white"
                  />
                  <button
                    type="button"
                    onClick={handleAddKeyword}
                    className="px-4 py-2.5 rounded-xl bg-[#184F48] hover:bg-[#123e38] text-white font-bold text-xs shadow-2xs cursor-pointer shrink-0"
                  >
                    Tambah Poin
                  </button>
                </div>
              </div>

              {/* CARD 3: ABOUT SECTION ("MENGENAL PROGRAM KEMITRAAN") */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
                <div className="border-b border-slate-100 pb-4">
                  <h4 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-[#184F48]" />
                    <span>3. Seksi "Mengenal Kemitraan" (About &amp; Narasi)</span>
                  </h4>
                  <p className="text-xs text-slate-500 mt-1">
                    Atur narasi sinergi dakwah dan 2 foto bertumpuk di sebelah kiri seksi kedua.
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
                      Judul Seksi
                    </label>
                    <input
                      type="text"
                      value={formData.affiliate?.aboutTitle || ''}
                      onChange={(e) => updateAffiliate('aboutTitle', e.target.value)}
                      placeholder="Membangun Generasi Qurani Melalui Sinergi & Amanah"
                      className="w-full text-xs font-bold text-slate-900 border border-slate-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-[#2D7A70]/30"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
                      Paragraf Narasi Pengantar
                    </label>
                    <textarea
                      rows={3}
                      value={formData.affiliate?.aboutDescription || ''}
                      onChange={(e) => updateAffiliate('aboutDescription', e.target.value)}
                      className="w-full text-xs text-slate-900 border border-slate-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-[#2D7A70]/30 leading-relaxed"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                    {renderAffiliateImagePicker(
                      'Foto Atas (About)',
                      'Foto kegiatan sains / kebun murid Al-Afiyah',
                      formData.affiliate?.aboutPhotoTop || '/images/sd-planting-guidance.jpg',
                      (url) => updateAffiliate('aboutPhotoTop', url)
                    )}

                    {renderAffiliateImagePicker(
                      'Foto Bawah (About)',
                      'Foto kegiatan edukasi lapangan peserta didik',
                      formData.affiliate?.aboutPhotoBottom || '/images/sd-field-fish-feeding.jpg',
                      (url) => updateAffiliate('aboutPhotoBottom', url)
                    )}
                  </div>
                </div>
              </div>

              {/* CARD 4: SKEMA KOMISI & KARTU TAHAP */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
                <div className="border-b border-slate-100 pb-4">
                  <h4 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                    <Sliders className="w-4 h-4 text-[#184F48]" />
                    <span>4. Nominal Komisi Ujrah per Unit Sekolah (TK, SD, SMP)</span>
                  </h4>
                  <p className="text-xs text-slate-500 mt-1">
                    Atur besaran komisi pendaftaran (formulir) dan komisi daftar ulang untuk masing-masing unit sekolah secara terpisah.
                  </p>
                </div>

                {/* 3 Unit Commission Cards */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                  {/* Unit 1: SDIT Al-Afiyah */}
                  <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200 space-y-3.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-extrabold text-emerald-950 uppercase tracking-wide">
                        1. Unit SDIT Al-Afiyah
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-200 text-emerald-900 font-bold">
                        Total Rp {((formData.affiliate?.commissionFormSd ?? 50000) + (formData.affiliate?.commissionReRegSd ?? 100000)).toLocaleString('id-ID')}
                      </span>
                    </div>

                    <div className="space-y-2.5">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">
                          Komisi Formulir (Pendaftaran)
                        </label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">Rp</span>
                          <input
                            type="number"
                            value={formData.affiliate?.commissionFormSd ?? 50000}
                            onChange={(e) => {
                              const val = parseInt(e.target.value) || 0;
                              updateAffiliate('commissionFormSd', val);
                              updateAffiliate('commissionFormFee', val);
                            }}
                            className="w-full text-xs font-bold text-slate-900 border border-emerald-300 rounded-xl p-2.5 pl-9 bg-white focus:outline-none focus:ring-2 focus:ring-[#2D7A70]/30"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">
                          Komisi Daftar Ulang
                        </label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">Rp</span>
                          <input
                            type="number"
                            value={formData.affiliate?.commissionReRegSd ?? 100000}
                            onChange={(e) => updateAffiliate('commissionReRegSd', parseInt(e.target.value) || 0)}
                            className="w-full text-xs font-bold text-slate-900 border border-emerald-300 rounded-xl p-2.5 pl-9 bg-white focus:outline-none focus:ring-2 focus:ring-[#2D7A70]/30"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Unit 2: TK IT Al-Afiyah */}
                  <div className="p-4 rounded-2xl bg-teal-50/60 border border-teal-200 space-y-3.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-extrabold text-teal-950 uppercase tracking-wide">
                        2. Unit TK IT Al-Afiyah
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-teal-200 text-teal-900 font-bold">
                        Total Rp {((formData.affiliate?.commissionFormTk ?? 25000) + (formData.affiliate?.commissionReRegTk ?? 50000)).toLocaleString('id-ID')}
                      </span>
                    </div>

                    <div className="space-y-2.5">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">
                          Komisi Formulir (Pendaftaran)
                        </label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">Rp</span>
                          <input
                            type="number"
                            value={formData.affiliate?.commissionFormTk ?? 25000}
                            onChange={(e) => updateAffiliate('commissionFormTk', parseInt(e.target.value) || 0)}
                            className="w-full text-xs font-bold text-slate-900 border border-teal-300 rounded-xl p-2.5 pl-9 bg-white focus:outline-none focus:ring-2 focus:ring-[#2D7A70]/30"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">
                          Komisi Daftar Ulang
                        </label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">Rp</span>
                          <input
                            type="number"
                            value={formData.affiliate?.commissionReRegTk ?? 50000}
                            onChange={(e) => updateAffiliate('commissionReRegTk', parseInt(e.target.value) || 0)}
                            className="w-full text-xs font-bold text-slate-900 border border-teal-300 rounded-xl p-2.5 pl-9 bg-white focus:outline-none focus:ring-2 focus:ring-[#2D7A70]/30"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Unit 3: SMP IT Al-Afiyah */}
                  <div className="p-4 rounded-2xl bg-cyan-50/60 border border-cyan-200 space-y-3.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-extrabold text-cyan-950 uppercase tracking-wide">
                        3. Unit SMP IT Al-Afiyah
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-200 text-cyan-900 font-bold">
                        Total Rp {((formData.affiliate?.commissionFormSmp ?? 35000) + (formData.affiliate?.commissionReRegSmp ?? 65000)).toLocaleString('id-ID')}
                      </span>
                    </div>

                    <div className="space-y-2.5">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">
                          Komisi Formulir (Pendaftaran)
                        </label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">Rp</span>
                          <input
                            type="number"
                            value={formData.affiliate?.commissionFormSmp ?? 35000}
                            onChange={(e) => updateAffiliate('commissionFormSmp', parseInt(e.target.value) || 0)}
                            className="w-full text-xs font-bold text-slate-900 border border-cyan-300 rounded-xl p-2.5 pl-9 bg-white focus:outline-none focus:ring-2 focus:ring-[#2D7A70]/30"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">
                          Komisi Daftar Ulang
                        </label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">Rp</span>
                          <input
                            type="number"
                            value={formData.affiliate?.commissionReRegSmp ?? 65000}
                            onChange={(e) => updateAffiliate('commissionReRegSmp', parseInt(e.target.value) || 0)}
                            className="w-full text-xs font-bold text-slate-900 border border-cyan-300 rounded-xl p-2.5 pl-9 bg-white focus:outline-none focus:ring-2 focus:ring-[#2D7A70]/30"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  {renderAffiliateImagePicker(
                    'Foto Kartu Komisi Formulir (Kiri)',
                    'Foto kartu tahap 1 di seksi kalkulator hijau',
                    formData.affiliate?.formCardImage || '/images/sd-activity-multimedia-learning.jpg',
                    (url) => updateAffiliate('formCardImage', url)
                  )}

                  {renderAffiliateImagePicker(
                    'Foto Kartu Komisi Daftar Ulang (Kanan)',
                    'Foto kartu tahap 2 di seksi kalkulator hijau',
                    formData.affiliate?.reRegCardImage || '/images/tk-activity-blocks-play.jpg',
                    (url) => updateAffiliate('reRegCardImage', url)
                  )}
                </div>
              </div>

              {/* CARD 5: CTA PENDAFTARAN BAWAH */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
                <div className="border-b border-slate-100 pb-4">
                  <h4 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                    <Share2 className="w-4 h-4 text-[#184F48]" />
                    <span>5. Banner Ajakan Pendaftaran (CTA Bawah)</span>
                  </h4>
                  <p className="text-xs text-slate-500 mt-1">
                    Teks judul dan subjudul pada form registrasi cepat di bagian bawah halaman.
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
                      Judul CTA
                    </label>
                    <input
                      type="text"
                      value={formData.affiliate?.ctaHeadline || ''}
                      onChange={(e) => updateAffiliate('ctaHeadline', e.target.value)}
                      placeholder="Mulai Sebarkan Kebaikan, Raih Manfaat Berkah."
                      className="w-full text-xs font-bold text-slate-900 border border-slate-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-[#2D7A70]/30"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
                      Subjudul CTA
                    </label>
                    <textarea
                      rows={2}
                      value={formData.affiliate?.ctaSubheadline || ''}
                      onChange={(e) => updateAffiliate('ctaSubheadline', e.target.value)}
                      className="w-full text-xs text-slate-900 border border-slate-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-[#2D7A70]/30 leading-relaxed"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 10: SD KARAKTER EDITOR */}
          {activeTab === 'sd_karakter' && (
            <div className="space-y-6">
              {/* Header Box */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
                <div className="border-b border-slate-100 pb-4 flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                      <HeartHandshake className="w-5 h-5 text-[#184F48]" />
                      <span>Editor Pilar Karakter &amp; Nilai Islami SDIT</span>
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">
                      Konten ini tampil langsung pada halaman publik <strong>/sd/karakter</strong>.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleSave}
                    disabled={isSaving}
                    className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-[#184F48] hover:bg-[#123e38] text-white text-xs font-bold shadow-xs transition-all cursor-pointer"
                  >
                    <Save className="w-4 h-4" />
                    <span>{isSaving ? 'Menyimpan...' : 'Simpan Pilar Karakter'}</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
                      Judul Banner Utama (Headline)
                    </label>
                    <input
                      type="text"
                      value={formData.sdKarakter?.heroHeadline || ''}
                      onChange={(e) => updateSdKarakter((prev) => ({ ...prev, heroHeadline: e.target.value }))}
                      className="w-full text-xs font-bold text-slate-900 border border-slate-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-[#2D7A70]/30"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
                      Deskripsi Pengantar Karakter
                    </label>
                    <textarea
                      rows={3}
                      value={formData.sdKarakter?.heroDescription || ''}
                      onChange={(e) => updateSdKarakter((prev) => ({ ...prev, heroDescription: e.target.value }))}
                      className="w-full text-xs text-slate-900 border border-slate-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-[#2D7A70]/30 leading-relaxed"
                    />
                  </div>
                </div>
              </div>

              {/* Card 2: 3 Pilar Utama */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5">
                <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-extrabold text-slate-900">
                      Tiga Pilar Utama Smart Akhlak Fitrah
                    </h4>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Tiga pilar kurikulum terpadu SDIT Al-Afiyah beserta rincian poin pembiasaannya.
                    </p>
                  </div>
                </div>

                <div className="space-y-6">
                  {(formData.sdKarakter?.threePillars || DEFAULT_SD_KARAKTER.threePillars).map((pillar, pIdx) => (
                    <div key={pIdx} className="p-5 rounded-2xl bg-slate-50/70 border border-slate-200/90 space-y-4">
                      <div className="flex items-center justify-between border-b border-slate-200/60 pb-3">
                        <span className="px-2.5 py-1 rounded-full text-xs font-black bg-emerald-100 text-emerald-800">
                          Pilar {pillar.number}
                        </span>
                        <span className="text-xs font-semibold text-slate-400">Pilar #{pIdx + 1}</span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[11px] font-bold text-slate-700 mb-1">
                            Judul Pilar
                          </label>
                          <input
                            type="text"
                            value={pillar.title}
                            onChange={(e) => {
                              const newPillars = [...(formData.sdKarakter?.threePillars || DEFAULT_SD_KARAKTER.threePillars)];
                              newPillars[pIdx] = { ...newPillars[pIdx], title: e.target.value };
                              updateSdKarakter((prev) => ({ ...prev, threePillars: newPillars }));
                            }}
                            className="w-full text-xs font-bold text-slate-900 border border-slate-300 rounded-xl p-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-[#2D7A70]/30"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-slate-700 mb-1">
                            Slogan / Tagline Pilar
                          </label>
                          <input
                            type="text"
                            value={pillar.tagline}
                            onChange={(e) => {
                              const newPillars = [...(formData.sdKarakter?.threePillars || DEFAULT_SD_KARAKTER.threePillars)];
                              newPillars[pIdx] = { ...newPillars[pIdx], tagline: e.target.value };
                              updateSdKarakter((prev) => ({ ...prev, threePillars: newPillars }));
                            }}
                            className="w-full text-xs font-semibold text-emerald-700 border border-slate-300 rounded-xl p-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-[#2D7A70]/30"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">
                          Deskripsi Lengkap Pilar
                        </label>
                        <textarea
                          rows={2}
                          value={pillar.desc}
                          onChange={(e) => {
                            const newPillars = [...(formData.sdKarakter?.threePillars || DEFAULT_SD_KARAKTER.threePillars)];
                            newPillars[pIdx] = { ...newPillars[pIdx], desc: e.target.value };
                            updateSdKarakter((prev) => ({ ...prev, threePillars: newPillars }));
                          }}
                          className="w-full text-xs text-slate-800 border border-slate-300 rounded-xl p-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-[#2D7A70]/30 leading-relaxed"
                        />
                      </div>

                      {/* Points list */}
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <label className="text-[11px] font-bold text-slate-700">
                            Poin Praktik Pembiasaan
                          </label>
                          <button
                            type="button"
                            onClick={() => {
                              const newPillars = [...(formData.sdKarakter?.threePillars || DEFAULT_SD_KARAKTER.threePillars)];
                              newPillars[pIdx] = {
                                ...newPillars[pIdx],
                                points: [...(newPillars[pIdx].points || []), 'Poin pembiasaan baru']
                              };
                              updateSdKarakter((prev) => ({ ...prev, threePillars: newPillars }));
                            }}
                            className="text-[10px] font-bold text-[#184F48] hover:underline flex items-center gap-1 cursor-pointer"
                          >
                            <Plus className="w-3 h-3" />
                            <span>Tambah Poin</span>
                          </button>
                        </div>

                        <div className="space-y-2">
                          {pillar.points.map((pt, ptIdx) => (
                            <div key={ptIdx} className="flex items-center gap-2">
                              <input
                                type="text"
                                value={pt}
                                onChange={(e) => {
                                  const newPillars = [...(formData.sdKarakter?.threePillars || DEFAULT_SD_KARAKTER.threePillars)];
                                  const newPts = [...newPillars[pIdx].points];
                                  newPts[ptIdx] = e.target.value;
                                  newPillars[pIdx] = { ...newPillars[pIdx], points: newPts };
                                  updateSdKarakter((prev) => ({ ...prev, threePillars: newPillars }));
                                }}
                                className="flex-1 text-xs text-slate-800 border border-slate-300 rounded-lg p-2 bg-white focus:outline-none focus:ring-2 focus:ring-[#2D7A70]/30"
                              />
                              <button
                                type="button"
                                onClick={() => {
                                  const newPillars = [...(formData.sdKarakter?.threePillars || DEFAULT_SD_KARAKTER.threePillars)];
                                  newPillars[pIdx] = {
                                    ...newPillars[pIdx],
                                    points: newPillars[pIdx].points.filter((_, i) => i !== ptIdx)
                                  };
                                  updateSdKarakter((prev) => ({ ...prev, threePillars: newPillars }));
                                }}
                                className="p-2 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                                title="Hapus Poin"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Card 3: 7 Karakter Profil Murid */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5">
                <div className="border-b border-slate-100 pb-3">
                  <h4 className="text-sm font-extrabold text-slate-900">
                    7 Karakter Profil Murid Nabawiyah
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Standar pembinaan karakter pribadi murid harian (Salimul Aqidah, Shahihul Ibadah, dll).
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {(formData.sdKarakter?.sevenHabits || DEFAULT_SD_KARAKTER.sevenHabits).map((habit, hIdx) => (
                    <div key={hIdx} className="p-4 rounded-xl bg-slate-50/80 border border-slate-200/90 space-y-2.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black text-[#184F48] font-mono">0{hIdx + 1}</span>
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-600 mb-0.5">
                          Nama Karakter
                        </label>
                        <input
                          type="text"
                          value={habit.title}
                          onChange={(e) => {
                            const newHabits = [...(formData.sdKarakter?.sevenHabits || DEFAULT_SD_KARAKTER.sevenHabits)];
                            newHabits[hIdx] = { ...newHabits[hIdx], title: e.target.value };
                            updateSdKarakter((prev) => ({ ...prev, sevenHabits: newHabits }));
                          }}
                          className="w-full text-xs font-bold text-slate-900 border border-slate-300 rounded-lg p-2 bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-600 mb-0.5">
                          Subjudul / Makna
                        </label>
                        <input
                          type="text"
                          value={habit.sub}
                          onChange={(e) => {
                            const newHabits = [...(formData.sdKarakter?.sevenHabits || DEFAULT_SD_KARAKTER.sevenHabits)];
                            newHabits[hIdx] = { ...newHabits[hIdx], sub: e.target.value };
                            updateSdKarakter((prev) => ({ ...prev, sevenHabits: newHabits }));
                          }}
                          className="w-full text-xs text-emerald-700 font-semibold border border-slate-300 rounded-lg p-2 bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-600 mb-0.5">
                          Deskripsi Pembiasaan
                        </label>
                        <textarea
                          rows={2}
                          value={habit.desc}
                          onChange={(e) => {
                            const newHabits = [...(formData.sdKarakter?.sevenHabits || DEFAULT_SD_KARAKTER.sevenHabits)];
                            newHabits[hIdx] = { ...newHabits[hIdx], desc: e.target.value };
                            updateSdKarakter((prev) => ({ ...prev, sevenHabits: newHabits }));
                          }}
                          className="w-full text-xs text-slate-700 border border-slate-300 rounded-lg p-2 bg-white leading-relaxed"
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-4 border-t border-slate-100 flex justify-end">
                  <button
                    type="button"
                    onClick={handleSave}
                    disabled={isSaving}
                    className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-[#184F48] hover:bg-[#123e38] text-white text-xs font-bold shadow-md transition-all cursor-pointer"
                  >
                    <Save className="w-4 h-4" />
                    <span>{isSaving ? 'Menyimpan...' : 'Simpan Semua Perubahan Karakter'}</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 11: SD PROFIL EDITOR */}
          {activeTab === 'sd_profil' && (
            <div className="space-y-6">
              {/* Header Box */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
                <div className="border-b border-slate-100 pb-4 flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                      <Building2 className="w-5 h-5 text-[#184F48]" />
                      <span>Editor Profil, Visi, Misi &amp; Identitas SDIT</span>
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">
                      Konten ini tampil langsung pada halaman publik <strong>/sd/profil</strong>.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleSave}
                    disabled={isSaving}
                    className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-[#184F48] hover:bg-[#123e38] text-white text-xs font-bold shadow-xs transition-all cursor-pointer"
                  >
                    <Save className="w-4 h-4" />
                    <span>{isSaving ? 'Menyimpan...' : 'Simpan Profil Sekolah'}</span>
                  </button>
                </div>

                {/* Visi Sekolah */}
                <div className="space-y-4 pt-2">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
                      Teks Visi Resmi SDIT Al-Afiyah
                    </label>
                    <textarea
                      rows={3}
                      value={formData.sdProfil?.visiText || ''}
                      onChange={(e) => updateSdProfil((prev) => ({ ...prev, visiText: e.target.value }))}
                      className="w-full text-xs font-semibold text-slate-900 border border-slate-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-[#2D7A70]/30 leading-relaxed"
                    />
                  </div>
                </div>
              </div>

              {/* Misi Pendidikan Sekolah */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5">
                <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-extrabold text-slate-900">
                      Misi Pendidikan Sekolah (Daftar Butir Poin)
                    </h4>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Langkah strategis pembinaan murid yang tampil di halaman profil.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const currentMisi = formData.sdProfil?.misiList || DEFAULT_SD_PROFIL.misiList;
                      updateSdProfil((prev) => ({
                        ...prev,
                        misiList: [...currentMisi, 'Menumbuhkan potensi dan akhlak islami murid secara berkelanjutan.']
                      }));
                    }}
                    className="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100 text-xs font-bold cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Tambah Misi</span>
                  </button>
                </div>

                <div className="space-y-3">
                  {(formData.sdProfil?.misiList || DEFAULT_SD_PROFIL.misiList).map((misi, mIdx) => (
                    <div key={mIdx} className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-lg bg-emerald-50 text-emerald-800 text-xs font-black flex items-center justify-center shrink-0 border border-emerald-200 font-mono">
                        {mIdx + 1}
                      </span>
                      <input
                        type="text"
                        value={misi}
                        onChange={(e) => {
                          const currentMisi = [...(formData.sdProfil?.misiList || DEFAULT_SD_PROFIL.misiList)];
                          currentMisi[mIdx] = e.target.value;
                          updateSdProfil((prev) => ({ ...prev, misiList: currentMisi }));
                        }}
                        className="flex-1 text-xs text-slate-800 border border-slate-300 rounded-xl p-2.5 focus:outline-none focus:ring-2 focus:ring-[#2D7A70]/30"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const currentMisi = [...(formData.sdProfil?.misiList || DEFAULT_SD_PROFIL.misiList)];
                          if (currentMisi.length <= 1) {
                            alert('Minimal harus ada 1 butir misi.');
                            return;
                          }
                          updateSdProfil((prev) => ({
                            ...prev,
                            misiList: currentMisi.filter((_, i) => i !== mIdx)
                          }));
                        }}
                        className="p-2 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                        title="Hapus Misi"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Data Satuan Pendidikan (Tabel Identitas) */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5">
                <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-extrabold text-slate-900">
                      Tabel Data Satuan Pendidikan &amp; Legalitas
                    </h4>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Informasi resmi sekolah seperti Akreditasi, Gugus, Kurikulum, Alamat, dan Kontak Resmi.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const currentList = formData.sdProfil?.identitasList || DEFAULT_SD_PROFIL.identitasList;
                      updateSdProfil((prev) => ({
                        ...prev,
                        identitasList: [...currentList, { label: 'Keterangan Tambahan', value: '-' }]
                      }));
                    }}
                    className="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100 text-xs font-bold cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Tambah Baris</span>
                  </button>
                </div>

                <div className="space-y-3">
                  {(formData.sdProfil?.identitasList || DEFAULT_SD_PROFIL.identitasList).map((item, idIdx) => (
                    <div key={idIdx} className="grid grid-cols-1 sm:grid-cols-12 gap-2.5 p-3 rounded-xl bg-slate-50/70 border border-slate-200 items-center">
                      <div className="sm:col-span-4">
                        <input
                          type="text"
                          value={item.label}
                          onChange={(e) => {
                            const currentList = [...(formData.sdProfil?.identitasList || DEFAULT_SD_PROFIL.identitasList)];
                            currentList[idIdx] = { ...currentList[idIdx], label: e.target.value };
                            updateSdProfil((prev) => ({ ...prev, identitasList: currentList }));
                          }}
                          placeholder="Label (misal: Status Akreditasi)"
                          className="w-full text-xs font-bold text-slate-700 border border-slate-300 rounded-lg p-2 bg-white"
                        />
                      </div>
                      <div className="sm:col-span-7">
                        <input
                          type="text"
                          value={item.value}
                          onChange={(e) => {
                            const currentList = [...(formData.sdProfil?.identitasList || DEFAULT_SD_PROFIL.identitasList)];
                            currentList[idIdx] = { ...currentList[idIdx], value: e.target.value };
                            updateSdProfil((prev) => ({ ...prev, identitasList: currentList }));
                          }}
                          placeholder="Nilai (misal: Terakreditasi B (BAN-SM))"
                          className="w-full text-xs text-slate-900 border border-slate-300 rounded-lg p-2 bg-white"
                        />
                      </div>
                      <div className="sm:col-span-1 flex justify-end">
                        <button
                          type="button"
                          onClick={() => {
                            const currentList = [...(formData.sdProfil?.identitasList || DEFAULT_SD_PROFIL.identitasList)];
                            updateSdProfil((prev) => ({
                              ...prev,
                              identitasList: currentList.filter((_, i) => i !== idIdx)
                            }));
                          }}
                          className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                          title="Hapus Baris"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-4 border-t border-slate-100 flex justify-end">
                  <button
                    type="button"
                    onClick={handleSave}
                    disabled={isSaving}
                    className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-[#184F48] hover:bg-[#123e38] text-white text-xs font-bold shadow-md transition-all cursor-pointer"
                  >
                    <Save className="w-4 h-4" />
                    <span>{isSaving ? 'Menyimpan...' : 'Simpan Semua Data Profil'}</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 9: SMP KARAKTER & SCD EDITOR */}
          {activeTab === 'smp_karakter' && (
            <div className="space-y-6">
              {/* Header Box */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
                <div className="border-b border-slate-100 pb-4 flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                      <GraduationCap className="w-5 h-5 text-[#030164]" />
                      <span>Editor SCD (Student Character Development) &amp; Mutaba'ah Digital (/smp/karakter)</span>
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">
                      Halaman pembinaan karakter murid SMP IT Al-Afiyah: adab nabawiyah, leadership, kemandirian, dan monitoring ibadah harian.
                    </p>
                  </div>
                  <a
                    href="/smp/karakter"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 text-[#030164] text-xs font-semibold hover:bg-blue-100 transition-colors"
                  >
                    <span>Buka Halaman Live</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Judul Banner Halaman Karakter
                    </label>
                    <input
                      type="text"
                      value={formData.smpKarakter?.heroTitle || DEFAULT_SMP_KARAKTER.heroTitle}
                      onChange={(e) =>
                        updateSmpKarakter((prev) => ({ ...prev, heroTitle: e.target.value }))
                      }
                      className="w-full text-xs font-medium text-slate-900 border border-slate-300 rounded-lg p-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-[#030164]/30"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Deskripsi Pengantar Halaman Karakter
                    </label>
                    <textarea
                      rows={3}
                      value={formData.smpKarakter?.heroSubtitle || DEFAULT_SMP_KARAKTER.heroSubtitle}
                      onChange={(e) =>
                        updateSmpKarakter((prev) => ({ ...prev, heroSubtitle: e.target.value }))
                      }
                      className="w-full text-xs text-slate-900 border border-slate-300 rounded-lg p-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-[#030164]/30 leading-relaxed"
                    />
                  </div>
                </div>
              </div>

              {/* 4 Pilar SCD Box */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5">
                <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-amber-500" />
                      <span>4 Pilar Pembinaan Karakter &amp; Kedisiplinan Remaja</span>
                    </h4>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Pilar pembinaan akidah, adab sebelum ilmu, kepemimpinan (leadership), dan kemandirian murid SMP IT.
                    </p>
                  </div>
                </div>

                <div className="space-y-6">
                  {(formData.smpKarakter?.pillars || DEFAULT_SMP_KARAKTER.pillars).map((pillar, pIdx) => (
                    <div key={pIdx} className="p-4 sm:p-5 rounded-2xl bg-slate-50/70 border border-slate-200 space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="inline-flex items-center justify-center px-3 py-1 rounded-lg bg-[#030164] text-[#ffd51e] text-xs font-black font-mono">
                          PILAR {pillar.number}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[10px] font-bold text-slate-600 mb-1">
                            Judul Pilar
                          </label>
                          <input
                            type="text"
                            value={pillar.title}
                            onChange={(e) => {
                              const newPillars = [...(formData.smpKarakter?.pillars || DEFAULT_SMP_KARAKTER.pillars)];
                              newPillars[pIdx] = { ...newPillars[pIdx], title: e.target.value };
                              updateSmpKarakter((prev) => ({ ...prev, pillars: newPillars }));
                            }}
                            className="w-full text-xs font-bold text-slate-900 border border-slate-300 rounded-lg p-2 bg-white"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-slate-600 mb-1">
                            Subjudul / Kata Kunci
                          </label>
                          <input
                            type="text"
                            value={pillar.subtitle}
                            onChange={(e) => {
                              const newPillars = [...(formData.smpKarakter?.pillars || DEFAULT_SMP_KARAKTER.pillars)];
                              newPillars[pIdx] = { ...newPillars[pIdx], subtitle: e.target.value };
                              updateSmpKarakter((prev) => ({ ...prev, pillars: newPillars }));
                            }}
                            className="w-full text-xs text-blue-800 font-semibold border border-slate-300 rounded-lg p-2 bg-white"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-slate-600 mb-1">
                          Deskripsi Lengkap Pilar
                        </label>
                        <textarea
                          rows={2}
                          value={pillar.desc}
                          onChange={(e) => {
                            const newPillars = [...(formData.smpKarakter?.pillars || DEFAULT_SMP_KARAKTER.pillars)];
                            newPillars[pIdx] = { ...newPillars[pIdx], desc: e.target.value };
                            updateSmpKarakter((prev) => ({ ...prev, pillars: newPillars }));
                          }}
                          className="w-full text-xs text-slate-700 border border-slate-300 rounded-lg p-2 bg-white leading-relaxed"
                        />
                      </div>

                      {/* Points array */}
                      <div className="space-y-2 pt-2 border-t border-slate-200/60">
                        <div className="flex items-center justify-between">
                          <label className="text-[11px] font-bold text-slate-700">
                            Poin-Poin Indikator Capaian Murid
                          </label>
                          <button
                            type="button"
                            onClick={() => {
                              const newPillars = [...(formData.smpKarakter?.pillars || DEFAULT_SMP_KARAKTER.pillars)];
                              newPillars[pIdx] = {
                                ...newPillars[pIdx],
                                points: [...newPillars[pIdx].points, 'Poin capaian baru']
                              };
                              updateSmpKarakter((prev) => ({ ...prev, pillars: newPillars }));
                            }}
                            className="inline-flex items-center gap-1 text-[11px] font-bold text-[#030164] hover:text-blue-700 cursor-pointer"
                          >
                            <Plus className="w-3 h-3" />
                            <span>Tambah Poin</span>
                          </button>
                        </div>

                        <div className="space-y-1.5">
                          {pillar.points.map((pt, ptIdx) => (
                            <div key={ptIdx} className="flex items-center gap-2">
                              <input
                                type="text"
                                value={pt}
                                onChange={(e) => {
                                  const newPillars = [...(formData.smpKarakter?.pillars || DEFAULT_SMP_KARAKTER.pillars)];
                                  const newPts = [...newPillars[pIdx].points];
                                  newPts[ptIdx] = e.target.value;
                                  newPillars[pIdx] = { ...newPillars[pIdx], points: newPts };
                                  updateSmpKarakter((prev) => ({ ...prev, pillars: newPillars }));
                                }}
                                className="flex-1 text-xs text-slate-800 border border-slate-300 rounded-lg p-2 bg-white focus:outline-none focus:ring-2 focus:ring-[#030164]/30"
                              />
                              <button
                                type="button"
                                onClick={() => {
                                  const newPillars = [...(formData.smpKarakter?.pillars || DEFAULT_SMP_KARAKTER.pillars)];
                                  newPillars[pIdx] = {
                                    ...newPillars[pIdx],
                                    points: newPillars[pIdx].points.filter((_, i) => i !== ptIdx)
                                  };
                                  updateSmpKarakter((prev) => ({ ...prev, pillars: newPillars }));
                                }}
                                className="p-2 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                                title="Hapus Poin"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-4 border-t border-slate-100 flex justify-end">
                  <button
                    type="button"
                    onClick={handleSave}
                    disabled={isSaving}
                    className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-[#030164] hover:bg-[#020148] text-white text-xs font-bold shadow-md transition-all cursor-pointer"
                  >
                    <Save className="w-4 h-4 text-[#ffd51e]" />
                    <span>{isSaving ? 'Menyimpan...' : 'Simpan Semua Karakter & SCD SMP IT'}</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 10: SMP PROFIL & LEGALITAS EDITOR */}
          {activeTab === 'smp_profil' && (
            <div className="space-y-6">
              {/* Header Box */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
                <div className="border-b border-slate-100 pb-4 flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                      <Building2 className="w-5 h-5 text-[#030164]" />
                      <span>Editor Profil, Visi, Misi &amp; Legalitas SMP IT (/smp/profil)</span>
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">
                      Data profil resmi, visi misi institusi, kurikulum terpadu, dan legalitas akreditasi BAN-S/M SMP IT Al-Afiyah.
                    </p>
                  </div>
                  <a
                    href="/smp/profil"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 text-[#030164] text-xs font-semibold hover:bg-blue-100 transition-colors"
                  >
                    <span>Buka Halaman Live</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Visi SMP IT Al-Afiyah Majalengka
                  </label>
                  <textarea
                    rows={3}
                    value={formData.smpProfil?.visi || DEFAULT_SMP_PROFIL.visi}
                    onChange={(e) =>
                      updateSmpProfil((prev) => ({ ...prev, visi: e.target.value }))
                    }
                    className="w-full text-xs font-medium text-slate-900 border border-slate-300 rounded-lg p-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-[#030164]/30 leading-relaxed"
                  />
                </div>
              </div>

              {/* Misi Box */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
                <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-extrabold text-slate-900">
                      Misi Sekolah Menengah Pertama (SMP IT)
                    </h4>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Poin-poin misi institusi dalam mencetak generasi Qur'ani, beradab, berwawasan global, dan mandiri.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const currentMisi = [...(formData.smpProfil?.misi || DEFAULT_SMP_PROFIL.misi)];
                      updateSmpProfil((prev) => ({
                        ...prev,
                        misi: [...currentMisi, 'Misi baru institusi SMP IT Al-Afiyah']
                      }));
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 text-[#030164] hover:bg-blue-100 text-xs font-bold transition-colors cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Tambah Misi</span>
                  </button>
                </div>

                <div className="space-y-3">
                  {(formData.smpProfil?.misi || DEFAULT_SMP_PROFIL.misi).map((m, mIdx) => (
                    <div key={mIdx} className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50/70 border border-slate-200">
                      <span className="inline-flex items-center justify-center w-6 h-6 rounded-lg bg-[#030164] text-[#ffd51e] text-[11px] font-black shrink-0 mt-1 font-mono">
                        {mIdx + 1}
                      </span>
                      <textarea
                        rows={2}
                        value={m}
                        onChange={(e) => {
                          const currentMisi = [...(formData.smpProfil?.misi || DEFAULT_SMP_PROFIL.misi)];
                          currentMisi[mIdx] = e.target.value;
                          updateSmpProfil((prev) => ({ ...prev, misi: currentMisi }));
                        }}
                        className="flex-1 text-xs text-slate-800 border border-slate-300 rounded-lg p-2 bg-white focus:outline-none focus:ring-2 focus:ring-[#030164]/30 leading-relaxed"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const currentMisi = [...(formData.smpProfil?.misi || DEFAULT_SMP_PROFIL.misi)];
                          updateSmpProfil((prev) => ({
                            ...prev,
                            misi: currentMisi.filter((_, i) => i !== mIdx)
                          }));
                        }}
                        className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer mt-1"
                        title="Hapus Misi"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Legalitas Box */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
                <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-extrabold text-slate-900">
                      Tabel Identitas Sekolah &amp; Legalitas BAN-S/M
                    </h4>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Informasi legalitas, status akreditasi A resmi, kurikulum terpadu, alamat, dan narahubung SMP IT.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const currentLeg = [...(formData.smpProfil?.legalitas || DEFAULT_SMP_PROFIL.legalitas)];
                      updateSmpProfil((prev) => ({
                        ...prev,
                        legalitas: [...currentLeg, { label: 'Label Baru', value: 'Keterangan' }]
                      }));
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 text-[#030164] hover:bg-blue-100 text-xs font-bold transition-colors cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Tambah Baris</span>
                  </button>
                </div>

                <div className="space-y-3">
                  {(formData.smpProfil?.legalitas || DEFAULT_SMP_PROFIL.legalitas).map((item, idIdx) => (
                    <div key={idIdx} className="grid grid-cols-1 sm:grid-cols-12 gap-2.5 p-3 rounded-xl bg-slate-50/70 border border-slate-200 items-center">
                      <div className="sm:col-span-4">
                        <input
                          type="text"
                          value={item.label}
                          onChange={(e) => {
                            const currentLeg = [...(formData.smpProfil?.legalitas || DEFAULT_SMP_PROFIL.legalitas)];
                            currentLeg[idIdx] = { ...currentLeg[idIdx], label: e.target.value };
                            updateSmpProfil((prev) => ({ ...prev, legalitas: currentLeg }));
                          }}
                          placeholder="Label (misal: Status Akreditasi)"
                          className="w-full text-xs font-bold text-slate-700 border border-slate-300 rounded-lg p-2 bg-white"
                        />
                      </div>
                      <div className="sm:col-span-7">
                        <input
                          type="text"
                          value={item.value}
                          onChange={(e) => {
                            const currentLeg = [...(formData.smpProfil?.legalitas || DEFAULT_SMP_PROFIL.legalitas)];
                            currentLeg[idIdx] = { ...currentLeg[idIdx], value: e.target.value };
                            updateSmpProfil((prev) => ({ ...prev, legalitas: currentLeg }));
                          }}
                          placeholder="Nilai (misal: Terakreditasi A (BAN-S/M))"
                          className="w-full text-xs text-slate-900 border border-slate-300 rounded-lg p-2 bg-white"
                        />
                      </div>
                      <div className="sm:col-span-1 flex justify-end">
                        <button
                          type="button"
                          onClick={() => {
                            const currentLeg = [...(formData.smpProfil?.legalitas || DEFAULT_SMP_PROFIL.legalitas)];
                            updateSmpProfil((prev) => ({
                              ...prev,
                              legalitas: currentLeg.filter((_, i) => i !== idIdx)
                            }));
                          }}
                          className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                          title="Hapus Baris"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-4 border-t border-slate-100 flex justify-end">
                  <button
                    type="button"
                    onClick={handleSave}
                    disabled={isSaving}
                    className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-[#030164] hover:bg-[#020148] text-white text-xs font-bold shadow-md transition-all cursor-pointer"
                  >
                    <Save className="w-4 h-4 text-[#ffd51e]" />
                    <span>{isSaving ? 'Menyimpan...' : 'Simpan Semua Data Profil SMP IT'}</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
