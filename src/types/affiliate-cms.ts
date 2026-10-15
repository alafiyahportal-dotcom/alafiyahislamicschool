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
  heroBadge: 'Program Affiliate Al-Afiyah',
  heroHeadline: 'Sebar Kebaikan Pendidikan,',
  heroHighlight: 'Raih Apresiasi Berkah Nyata',
  heroDescription:
    'Program rujukan resmi Yayasan Pendidikan Al-Afiyah (Fokus SDIT & SMP IT, TK IT segera hadir). Dapatkan komisi apresiasi yang transparan, mudah, dan terpercaya cukup dengan membagikan link rekomendasi pendaftaran sekolah.',
  // Real school photos only
  heroPhoto1: '/images/sd-activity-halaqah-tahfidz.jpg',
  heroPhoto2: '/images/sd-activity-classroom-6b.jpg',
  heroPhoto3: '/images/smp-outing-1.jpg',
  marqueeKeywords: [
    'Komisi Transparan & Jelas',
    'Komisi Hingga Rp 150.000 / Peserta Didik',
    '100% Gratis Tanpa Biaya Pendaftaran',
    'Pencairan Cepat ke Rekening Bank',
    'Dashboard Real-Time 24/7',
    'Multi-Unit SDIT & SMP IT (TK Segera Hadir)',
    'Materi Promosi Resmi Disediakan',
    'Transparan Tanpa Potongan',
  ],
  aboutBadge: 'Mengenal Program Affiliate',
  aboutTitle: 'Membangun Generasi Qurani Melalui Sinergi & Amanah',
  aboutDescription:
    'Yayasan Pendidikan Imam Bonjol Al-Afiyah Majalengka membuka program affiliate resmi untuk mengajak seluruh elemen masyarakat—mulai dari wali murid, dewan guru, alumni peserta didik, hingga simpatisan pendidikan—menjadi bagian dari syiar pendidikan Islam terpadu yang berkualitas.',
  aboutPhotoTop: '/images/sd-planting-guidance.jpg',
  aboutPhotoBottom: '/images/sd-field-fish-feeding.jpg',
  // SDIT: Formulir Rp 50.000 + Daftar Ulang Rp 100.000 = Rp 150.000
  commissionFormSd: 50000,
  commissionReRegSd: 100000,
  // TK IT: belum ada data / menunggu penetapan panitia
  commissionFormTk: 0,
  commissionReRegTk: 0,
  // SMP IT: Formulir Rp 50.000 + Daftar Ulang Rp 100.000 = Rp 150.000
  commissionFormSmp: 50000,
  commissionReRegSmp: 100000,
  // Legacy alias
  commissionFormFee: 50000,
  // Real school activity photos only
  formCardImage: '/images/sd-activity-multimedia-learning.jpg',
  reRegCardImage: '/images/smp-outing-2.jpg',
  ctaHeadline: 'Mulai Sebarkan Kebaikan, Raih Manfaat Berkah.',
  ctaSubheadline:
    'Daftarkan diri Anda hari ini. Akun Anda langsung aktif seketika dan tautan rujukan personal siap digunakan untuk membantu generasi muslim masa depan.',
};
