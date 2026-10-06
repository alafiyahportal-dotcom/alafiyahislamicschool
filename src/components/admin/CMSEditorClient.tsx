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
  X
} from 'lucide-react';
import { UnitSlideData } from '@/components/landing/UnitHeroSlider';

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
  stats: Array<{ label: string; value: string }>;
  values: Array<{ title: string; description: string; icon?: string }>;
  programs: Array<{ title: string; desc: string; badge: string }>;
  facilities: Array<{ name: string; image: string; desc: string; category?: string }>;
  testimonials: Array<{ name: string; role: string; quote: string }>;
  tuition: {
    registrationFee: number;
    monthlyTuition: number;
    developmentFee: number;
    quota?: number;
    waveName?: string;
  };
  presetImages?: PresetImage[];
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
  // Foto Asli Kegiatan Murid & Guru SD IT (Dari Dewan Guru)
  { label: 'Halaqah Tahfidz & Adab SD IT (Foto Asli)', url: '/images/sd-activity-halaqah-tahfidz.jpg', forUnits: ['sd', 'foundation'] },
  { label: 'Poster Resmi SPMB SDIT 2027/2028', url: '/images/sd-spmb-poster-2027.jpg', forUnits: ['sd', 'foundation'] },
  { label: 'Brosur Biaya & Syarat SPMB SDIT 2027/2028', url: '/images/sd-spmb-brosur.jpg', forUnits: ['sd', 'foundation'] },
  { label: 'Story "Telah Dibuka" SPMB SDIT 2027/2028', url: '/images/sd-spmb-story.jpg', forUnits: ['sd', 'foundation'] },
  { label: 'Praktik Sains Greenhouse SD IT', url: '/images/sd-hero-greenhouse.jpg', forUnits: ['sd', 'foundation'] },
  { label: 'Observasi Kebun Sayur SD IT', url: '/images/sd-hero-garden.jpg', forUnits: ['sd', 'foundation'] },
  { label: 'Santri Ceria & Karakter SD IT', url: '/images/sd-hero-activity.jpg', forUnits: ['sd', 'foundation'] },
  // Foto asli TK
  { label: 'Murid TK Ceria & Bermain', url: '/images/tk-hero-kids.jpg', forUnits: ['tk', 'foundation'] },
  { label: 'Taman Tumbuh Kembang TK', url: '/images/tk-hero-garden.jpg', forUnits: ['tk', 'foundation'] },
  // Foto asli SMP
  { label: 'Murid SMP IT Fullday School', url: '/images/smp-hero-fullday.jpg', forUnits: ['smp', 'foundation'] },
  { label: 'Bilingual & Laboratorium SMP IT', url: '/images/smp-hero-bilingual.jpg', forUnits: ['smp', 'foundation'] },
  // Foto asli Tahfidz & Keislaman
  { label: 'Halaqah Tahfidz Al-Qur\'an', url: '/images/arc-tahfidz.jpg', forUnits: ['tk', 'sd', 'smp', 'foundation'] },
  { label: 'Dewan Guru Pembina & Pengajar', url: '/images/arc-ustadz.jpg', forUnits: ['tk', 'sd', 'smp', 'foundation'] },
];


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
    // 1. If backend database has saved preset images, use as source of truth
    if (initialData.presetImages && Array.isArray(initialData.presetImages) && initialData.presetImages.length > 0) {
      return initialData.presetImages;
    }

    const defaults = PRESET_IMAGES_DEFAULT.filter(
      (img) => !img.forUnits || img.forUnits.includes(schoolSlug)
    );
    if (typeof window === 'undefined') return defaults;
    try {
      const deletedUrls: string[] = JSON.parse(localStorage.getItem(DELETED_KEY) || '[]');
      const deletedSet = new Set(deletedUrls);
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed: PresetImage[] = JSON.parse(stored);
        // Return stored list directly, respecting explicit user deletions
        return parsed.filter((p) => !deletedSet.has(p.url));
      }
      return defaults.filter((d) => !deletedSet.has(d.url));
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
      const fd = new FormData();
      fd.append('file', file);
      fd.append('schoolSlug', schoolSlug);

      const res = await fetch('/api/admin/upload', { method: 'POST', body: fd });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Upload gagal');

      // Add uploaded image to preset list (appears first)
      const newPreset: PresetImage = {
        label: data.label || file.name,
        url: data.url,
        forUnits: [schoolSlug],
      };
      const updated = [newPreset, ...presetImages];
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

      return data.url as string;
    } catch (err: unknown) {
      setUploadError(err instanceof Error ? err.message : 'Upload gagal');
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
    | 'tuition';

  const [activeTab, setActiveTab] = useState<TabType>('hero');
  const [viewMode, setViewMode] = useState<'editor' | 'preview'>('editor');
  const [formData, setFormData] = useState<CMSInitialData>(initialData);

  // Active slide index for hero slider manager
  const [selectedSlideIndex, setSelectedSlideIndex] = useState<number>(0);

  // Status state
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Fallback slides if empty
  const defaultSdSlides: UnitSlideData[] = [
    {
      id: 1,
      badge: 'SPMB T.A. 2027/2028 • TELAH DIBUKA',
      titlePart1: 'Bukan Sekedar Tempat Belajar, Namun Juga ',
      titleHighlight: 'Tempat Bertumbuh',
      titlePart2: '',
      description: 'Mencetak generasi sholeh, cerdas, mandiri, berwawasan, dan berakhlakul islami dengan prinsip Smart Akhlaq Fitrah serta bimbingan metode karakter nabawiyah.',
      primaryCtaText: 'Daftar SPMB SD IT',
      primaryCtaLink: '/ppdb/daftar?school=sd',
      secondaryCtaText: 'WhatsApp (0813-1013-9001)',
      secondaryCtaLink: `https://wa.me/${formData.identity.whatsappNumber || '6281310139001'}`,
      image: '/images/sd-hero-greenhouse.jpg',
      trustItems: [
        { icon: 'shield' as const, text: 'Kuota Terbatas: Hanya 2 Rombel' },
        { icon: 'check' as const, text: 'Smart Akhlaq Fitrah' },
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
      description: 'Mencetak generasi sholeh, cerdas, mandiri, berwawasan, dan berakhlakul islami dengan prinsip Smart Akhlaq Fitrah serta bimbingan metode karakter nabawiyah.',
      primaryCtaText: 'Daftar SPMB SD IT',
      primaryCtaLink: '/ppdb/daftar?school=sd',
      secondaryCtaText: 'WhatsApp (0813-1013-9001)',
      secondaryCtaLink: `https://wa.me/${formData.identity.whatsappNumber || '6281310139001'}`,
      image: '/images/sd-hero-garden.jpg',
      trustItems: [
        { icon: 'shield' as const, text: 'Kuota Terbatas: Hanya 2 Rombel' },
        { icon: 'check' as const, text: 'Smart Akhlaq Fitrah' },
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
      description: 'Mencetak generasi sholeh, cerdas, mandiri, berwawasan, dan berakhlakul islami dengan prinsip Smart Akhlaq Fitrah serta bimbingan metode karakter nabawiyah.',
      primaryCtaText: 'Daftar SPMB SD IT',
      primaryCtaLink: '/ppdb/daftar?school=sd',
      secondaryCtaText: 'WhatsApp (0813-1013-9001)',
      secondaryCtaLink: `https://wa.me/${formData.identity.whatsappNumber || '6281310139001'}`,
      image: '/images/sd-hero-activity.jpg',
      trustItems: [
        { icon: 'shield' as const, text: 'Kuota Terbatas: Hanya 2 Rombel' },
        { icon: 'check' as const, text: 'Smart Akhlaq Fitrah' },
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
      // For SD IT, headline, badge, subtitle, and CTA are universal across all carousel slides
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
        payloadToSave = formData.tuition;
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

  return (
    <div className="space-y-6">
      {/* Top Header: Unit Switcher & Live Preview Toggles */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs flex flex-wrap items-center justify-between gap-4">
        {/* Unit Selector / Tenant Badge */}
        <div className="flex items-center space-x-3">
          {schoolSlug === 'sd' ? (
            <img
              src="/images/sd-logo.png"
              alt="Logo SD IT Al-Afiyah"
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
                <option value="sd">SD IT Al-Afiyah Majalengka</option>
                <option value="smp">SMP IT Al-Afiyah Majalengka</option>
              </select>
            ) : (
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-xs sm:text-sm font-bold text-slate-800">
                  {schoolSlug === 'tk'
                    ? 'TK IT Al-Afiyah'
                    : schoolSlug === 'sd'
                    ? 'SD IT Al-Afiyah'
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
            href={publicUrl}
            target="_blank"
            className="inline-flex items-center space-x-1.5 px-3 py-2 text-xs font-bold text-slate-700 bg-slate-50 hover:bg-slate-100 rounded-xl transition-colors border border-slate-200"
          >
            <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
            <span>Buka Halaman Publik</span>
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
        {/* Direct Link to News & Articles Editor */}
        <Link
          href={schoolSlug === 'foundation' ? '/admin/foundation/cms' : `/admin/${schoolSlug}/news`}
          className="flex items-center space-x-1.5 px-3.5 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-colors bg-amber-50 text-amber-900 hover:bg-amber-100 border border-amber-300 shadow-2xs cursor-pointer ml-auto"
        >
          <Newspaper className="w-3.5 h-3.5 text-amber-700" />
          <span>9. Kelola Berita &amp; Artikel ↗</span>
        </Link>
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
              <strong>Identitas, Header &amp; Footer:</strong> Nama resmi unit, slogan, alamat lengkap kampus, link Google Maps, email resmi, dan nomor kontak WhatsApp Panitia/CS tampil di logo pojok kiri atas, floating widget helpdesk, formulir pendaftaran resmi, serta seluruh footer halaman website.
            </span>
          )}
          {activeTab === 'stats' && (
            <span>
              <strong>Bar Counter Statistik Capaian:</strong> Tampil tepat di bawah banner beranda dengan bar berwarna hijau zamrud (Teal) yang menampilkan 4 angka pencapaian penting (Jumlah Murid, Guru Berpengalaman, Akreditasi, dan Target Tahfidz).
            </span>
          )}
          {activeTab === 'values' && (
            <span>
              <strong>Pilar Karakter &amp; Keunggulan Utama:</strong> Menampilkan 3 pilar nilai pendidikan Islam terpadu (Akidah/Akhlak, Tahfidz Al-Qur&apos;an, dan Sains Terpadu) yang meyakinkan orang tua calon murid.
            </span>
          )}
          {activeTab === 'programs' && (
            <span>
              <strong>Kartu Program Pilihan &amp; Peminatan:</strong> Tampil pada bagian kurikulum beranda, menjelaskan program tahfidz intensif, kelas reguler, literasi digital, pramuka SIT, dan kegiatan unggulan unit.
            </span>
          )}
          {activeTab === 'facilities' && (
            <span>
              <strong>Galeri Fasilitas &amp; Sarana Belajar:</strong> Tampil sebagai kartu foto ruang kelas ber-AC, masjid, lab komputer/sains, lapangan olahraga, serta perpustakaan ramah anak.
            </span>
          )}
          {activeTab === 'testimonials' && (
            <span>
              <strong>Testimoni Orang Tua &amp; Wali Murid:</strong> Tampil di dekat bagian bawah beranda sebelum banner ajakan mendaftar (CTA), memuat kepuasan dan apresiasi wali murid terhadap adab dan prestasi anak.
            </span>
          )}
          {activeTab === 'tuition' && (
            <span>
              <strong>Rincian Biaya PPDB &amp; Kuota Penerimaan:</strong> Tampil pada halaman pendaftaran PPDB online, kalkulator simulasi kuitansi pendaftaran, dan status sisa kuota penerimaan murid baru.
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
                Pratinjau: {publicUrl} — {activeTab === 'hero' ? 'Hero Banner' : activeTab === 'identity' ? 'Profil & Kontak' : activeTab === 'stats' ? 'Counter Statistik' : activeTab === 'values' ? 'Nilai Keunggulan' : activeTab === 'programs' ? 'Program Pilihan' : activeTab === 'facilities' ? 'Fasilitas Sekolah' : activeTab === 'testimonials' ? 'Testimoni Wali Murid' : 'Biaya PPDB'}
              </span>
            </div>
            <span className="text-[11px] font-bold bg-white/10 px-2.5 py-1 rounded text-emerald-400">Live Interactive</span>
          </div>

          {/* === TAB 1: HERO PREVIEW === */}
          {activeTab === 'hero' && (
            <div className="relative bg-slate-950 text-white min-h-[480px] sm:min-h-[520px] flex items-center p-6 sm:p-12 overflow-hidden select-none">
              <div className="absolute inset-0 z-0">
                <Image src={currentSlide.image || '/images/arc-tahfidz.jpg'} alt="Banner Preview" fill sizes="(max-width: 768px) 100vw, 1200px" className="w-full h-full object-cover opacity-35 scale-105 transition-all duration-1000" />
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
                      {currentSlide.titleHighlight || 'Tempat Bertumbuh'}
                    </span>
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
                  <span className="px-5 py-2.5 rounded-xl bg-amber-500 text-slate-950 font-extrabold text-xs shadow-lg inline-flex items-center space-x-1.5">
                    <span>{currentSlide.primaryCtaText}</span><ChevronRight className="w-4 h-4" />
                  </span>
                  <span className="px-4 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white font-bold text-xs">{currentSlide.secondaryCtaText}</span>
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
                  {schoolSlug === 'sd' ? (
                    <img
                      src="/images/sd-logo.png"
                      alt="Logo SD IT Al-Afiyah"
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
                    <div><p className="font-bold text-slate-700">Email Resmi</p><p className="text-slate-500">{formData.identity.email || 'info@alafiyah.sch.id'}</p></div>
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
          )}

          {/* === TAB 4: VALUES PREVIEW === */}
          {activeTab === 'values' && (
            <div className="p-6 sm:p-10 bg-slate-50 min-h-[360px]">
              <p className="text-xs font-bold text-center text-slate-400 uppercase tracking-widest mb-6">Pilar Nilai & Keunggulan</p>
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
          )}

          {/* === TAB 5: PROGRAMS PREVIEW === */}
          {activeTab === 'programs' && (
            <div className="p-6 sm:p-10 bg-slate-50 min-h-[360px]">
              <p className="text-xs font-bold text-center text-slate-400 uppercase tracking-widest mb-6">Program Pilihan & Unggulan</p>
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
          )}

          {/* === TAB 6: FACILITIES PREVIEW === */}
          {activeTab === 'facilities' && (
            <div className="p-6 sm:p-10 bg-slate-50 min-h-[400px]">
              <p className="text-xs font-bold text-center text-slate-400 uppercase tracking-widest mb-6">Galeri Fasilitas & Sarana Sekolah</p>
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
          )}

          {/* === TAB 7: TESTIMONIALS PREVIEW === */}
          {activeTab === 'testimonials' && (
            <div className="p-6 sm:p-10 bg-slate-50 min-h-[360px]">
              <p className="text-xs font-bold text-center text-slate-400 uppercase tracking-widest mb-6">Testimoni Orang Tua & Wali Murid</p>
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
          )}

          {/* === TAB 8: TUITION PREVIEW === */}
          {activeTab === 'tuition' && (
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
                    { label: 'Uang Pengembangan (Pangkal)', value: formData.tuition.developmentFee },
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
                      <strong className="font-bold text-emerald-900 block mb-0.5">Konsep Carousel Hero SD IT:</strong>
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
                      placeholder={schoolSlug === 'sd' ? '(Kosongkan untuk SD IT)' : ' & Berwawasan Global'}
                      className="w-full text-xs font-semibold text-slate-900 border border-slate-300 rounded-xl p-3 bg-white focus:outline-none focus:ring-2 focus:ring-[#2D7A70]/30"
                    />
                    <span className="text-[10px] text-slate-400 mt-1 block">
                      {schoolSlug === 'sd' ? 'Untuk SD IT dikosongkan (tanpa kata Ananda).' : 'Teks penutup setelah highlight (opsional).'}
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
                    value={formData.identity.email || 'info@alafiyah.sch.id'}
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
                {(formData.stats || [
                  { label: 'Murid Aktif', value: '450+' },
                  { label: 'Dewan Guru Berpengalaman', value: '38 Guru' },
                  { label: 'Akreditasi Lembaga', value: 'A (Unggul)' },
                  { label: 'Target Tahfidz', value: 'Tartil & Mutqin' }
                ]).map((st, i) => (
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
                {(formData.values || [
                  { title: 'Akidah & Akhlakul Karimah', description: 'Penanaman adab nabawiyah, pembiasaan shalat berjamaah, dan birrul walidain.' },
                  { title: 'Tahsin & Tahfidz Al-Qur\'an', description: 'Bimbingan talaqqi ramah anak dengan target hafalan mutqin dan tartil.' },
                  { title: 'Sains & Teknologi Unggulan', description: 'Pembelajaran sains terpadu, literasi digital dan bilingual aplikatif.' }
                ]).map((val, i) => (
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
                    value={formData.tuition.developmentFee}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        tuition: {
                          ...formData.tuition,
                          developmentFee: parseInt(e.target.value) || 0
                        }
                      })
                    }
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
          )}
        </div>
      )}
    </div>
  );
}
