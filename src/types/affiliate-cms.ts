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
  commissionFormFee?: number;
  commissionReRegTk?: number;
  commissionReRegSd?: number;
  commissionReRegSmp?: number;
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
  heroPhoto1: '/images/sd-activity-halaqah-tahfidz.jpg',
  heroPhoto2: '/images/sd-activity-classroom-6b.jpg',
  heroPhoto3: '/images/smp-outing-1.jpg',
  marqueeKeywords: [
    'Akad Syariah Wakalah bil Ujrah',
    'Komisi Hingga Rp 550.000 / Peserta Didik',
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
  aboutPhotoTop: '/images/sd-hero-greenhouse.jpg',
  aboutPhotoBottom: '/images/smp-hero-bilingual.jpg',
  commissionFormFee: 50000,
  commissionReRegTk: 250000,
  commissionReRegSd: 100000,
  commissionReRegSmp: 500000,
  formCardImage: '/images/sd-activity-multimedia-learning.jpg',
  reRegCardImage: '/images/tk-activity-blocks-play.jpg',
  ctaHeadline: 'Mulai Sebarkan Kebaikan, Raih Manfaat Berkah.',
  ctaSubheadline:
    'Daftarkan diri Anda hari ini. Akun Anda langsung aktif seketika dan tautan rujukan personal siap digunakan untuk membantu generasi muslim masa depan.',
};
