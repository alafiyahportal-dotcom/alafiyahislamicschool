import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    template: '%s | TK IT Al-Afiyah Majalengka',
    default: 'TK IT Al-Afiyah Majalengka | PAUD & TK Islam Terpadu Ceria & Shalih',
  },
  description: 'Penerimaan Peserta Didik Baru (PPDB) TK IT Al-Afiyah Majalengka. Membentuk generasi cerdas, mandiri, dan berakhlakul karimah sejak usia dini.',
  icons: {
    icon: [
      { url: '/images/sd-logo.png', type: 'image/png' },
      { url: '/favicon.ico', sizes: 'any' },
    ],
    shortcut: '/images/sd-logo.png',
    apple: '/images/sd-logo.png',
  },
  openGraph: {
    title: 'TK IT Al-Afiyah Majalengka | PAUD & TK Islam Terpadu',
    description: 'Pendidikan Anak Usia Dini dan TK Islam Terpadu Al-Afiyah Majalengka di bawah naungan Yayasan Pendidikan Imam Bonjol.',
    siteName: 'TK IT Al-Afiyah',
    locale: 'id_ID',
    type: 'website',
  },
};

const tkWebSiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': 'https://tkit.alafiyah.id/#website',
  url: 'https://tkit.alafiyah.id/',
  name: 'TK IT Al-Afiyah',
  alternateName: [
    'TK IT Al-Afiyah Majalengka',
    'TKIT Al-Afiyah',
    'TKIT Al-Afiyah Majalengka',
    'PAUD IT Al-Afiyah'
  ],
  description: 'Pendidikan Anak Usia Dini & TK Islam Terpadu Al-Afiyah Majalengka.',
  inLanguage: 'id-ID',
};

export default function TkLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(tkWebSiteSchema) }}
      />
      {children}
    </>
  );
}
