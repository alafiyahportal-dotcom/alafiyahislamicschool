/**
 * Social share (Open Graph) images per unit.
 * Keep each file < 300 KB and 1200x630 — WhatsApp silently drops larger images
 * and falls back to twitter:image, which leaks another unit's photo.
 */
export const SMP_OG_IMAGE = {
  url: '/images/smp-og.jpg',
  width: 1200,
  height: 630,
  alt: 'Halaqah Tahfidz Santri Ikhwan SMP IT Al-Afiyah Majalengka',
};

export const SD_OG_IMAGE = {
  url: '/images/sd-og.jpg',
  width: 1200,
  height: 630,
  alt: 'SDIT Al-Afiyah Majalengka — Outdoor Learning di Greenhouse',
};
