export interface AffiliateCMSData {
  heroBadge?: string;
  heroHeadline?: string;
  heroHighlight?: string;
  heroDescription?: string;
  heroPhoto1?: string;
  heroPhoto2?: string;
  heroPhoto3?: string;
  marqueeKeywords?: string[];
  aboutBadge?: string;
  aboutTitle?: string;
  aboutDescription?: string;
  aboutPhotoTop?: string;
  aboutPhotoBottom?: string;
  // Per-unit commissions
  commissionFormTk?: number;
  commissionReRegTk?: number;
  commissionFormSd?: number;
  commissionReRegSd?: number;
  commissionFormSmp?: number;
  commissionReRegSmp?: number;
  // Legacy aliases
  commissionFormFee?: number;
  formCardImage?: string;
  reRegCardImage?: string;
  ctaHeadline?: string;
  ctaSubheadline?: string;
}

export const DEFAULT_AFFILIATE_CONTENT: Required<AffiliateCMSData> = {
  heroBadge: 'Program Kemitraan Dakwah & Kebaikan',
  heroHeadline: 'Sebar Kebaikan Pendidikan,',
  heroHighlight: 'Raih Apresiasi Berkah Nyata',
  heroDescription:
    'Program kemitraan resmi Yayasan Pendidikan Al-Afiyah (TK IT, SD IT, SMP IT). Dapatkan hak ujrah halal, transparan, dan terpercaya berbasis akad syariah Wakalah bil Ujrah cukup dengan berbagi rekomendasi.',
  // Real school photos only
  heroPhoto1: '/images/sd-activity-halaqah-tahfidz.jpg',
  heroPhoto2: '/images/sd-activity-classroom-6b.jpg',
  heroPhoto3: '/images/smp-outing-1.jpg',
  marqueeKeywords: [
    'Akad Syariah Wakalah bil Ujrah',
    'Komisi Hingga Rp 150.000 / Peserta Didik',
    'Tanpa Biaya Pendaftaran',
    'Pencairan Cepat Bank BSI',
    'Dashboard Real-Time 24/7',
    'Multi-Unit TK, SD, SMP IT',
    'Materi Promosi Resmi Disediakan',
    'Transparan Tanpa Potongan',
  ],
  aboutBadge: 'Mengenal Program Kemitraan',
  aboutTitle: 'Membangun Generasi Qurani Melalui Sinergi & Amanah',
  aboutDescription:
    'Yayasan Pendidikan Imam Bonjol Al-Afiyah Majalengka membuka program kemitraan dakwah resmi untuk mengajak seluruh elemen masyarakat—mulai dari wali murid, dewan guru, alumni peserta didik, hingga penggiat majelis taklim—menjadi bagian dari syiar pendidikan Islam terpadu yang berkualitas.',
  aboutPhotoTop: '/images/sd-planting-guidance.jpg',
  aboutPhotoBottom: '/images/sd-field-fish-feeding.jpg',
  // SD IT: Formulir Rp 50.000 + Daftar Ulang Rp 100.000 = Rp 150.000
  commissionFormSd: 50000,
  commissionReRegSd: 100000,
  // TK IT: lebih kecil dari SD (Formulir Rp 25.000 + Daftar Ulang Rp 50.000 = Rp 75.000)
  commissionFormTk: 25000,
  commissionReRegTk: 50000,
  // SMP IT: lebih kecil dari SD (Formulir Rp 35.000 + Daftar Ulang Rp 65.000 = Rp 100.000)
  commissionFormSmp: 35000,
  commissionReRegSmp: 65000,
  // Legacy alias
  commissionFormFee: 50000,
  // Real school activity photos only
  formCardImage: '/images/sd-activity-multimedia-learning.jpg',
  reRegCardImage: '/images/smp-outing-2.jpg',
  ctaHeadline: 'Mulai Sebarkan Kebaikan, Raih Manfaat Berkah.',
  ctaSubheadline:
    'Daftarkan diri Anda hari ini. Akun Anda langsung aktif seketika dan tautan rujukan personal siap digunakan untuk membantu generasi muslim masa depan.',
};
