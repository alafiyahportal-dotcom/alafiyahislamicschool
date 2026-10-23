import React from 'react';

export default function GoogleStructuredData() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.alafiyah.id';

  const structuredData = [
    // 1. WebSite Schemas for Google Site Names (Google Search Result Site Name per unit)
    {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      '@id': 'https://sdit.alafiyah.id/#website',
      url: 'https://sdit.alafiyah.id/',
      name: 'SDIT Al-Afiyah',
      alternateName: [
        'SDIT Al-Afiyah Majalengka',
        'SD IT Al-Afiyah',
        'SDIT Al Afiyah',
        'SD IT Al-Afiyah Majalengka'
      ],
      description: 'Portal Resmi Sistem Penerimaan Murid Baru (SPMB) dan Informasi Terpadu SDIT Al-Afiyah Majalengka.',
      inLanguage: 'id-ID',
      publisher: {
        '@id': 'https://sdit.alafiyah.id/#organization'
      }
    },
    {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      '@id': 'https://smpit.alafiyah.id/#website',
      url: 'https://smpit.alafiyah.id/',
      name: 'SMP IT Al-Afiyah',
      alternateName: [
        'SMP IT Al-Afiyah Majalengka',
        'SMPIT Al-Afiyah',
        'SMP IT Al Afiyah',
        'SMPIT Al-Afiyah Majalengka'
      ],
      description: 'Sekolah Menengah Pertama Islam Terpadu (SMP IT) Al-Afiyah Majalengka Terakreditasi A (SK No. 012/BAN-PDM/SK/2025).',
      inLanguage: 'id-ID',
      publisher: {
        '@id': 'https://smpit.alafiyah.id/#organization'
      }
    },
    {
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
      publisher: {
        '@id': 'https://tkit.alafiyah.id/#organization'
      }
    },
    {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      '@id': 'https://alafiyah.id/#website',
      url: 'https://alafiyah.id/',
      name: 'Al-Afiyah Islamic School',
      alternateName: [
        'Yayasan Pendidikan Imam Bonjol',
        'Al-Afiyah Majalengka',
        'YPIB Majalengka',
        'YPIB Al-Afiyah'
      ],
      description: 'Ekosistem Pendidikan Islam Terpadu Al-Afiyah Majalengka di bawah naungan Yayasan Pendidikan Imam Bonjol.',
      inLanguage: 'id-ID',
      publisher: {
        '@id': 'https://alafiyah.id/#organization'
      }
    },

    // 2. EducationalOrganization / School Schema (Powers Google Knowledge Panel)
    {
      '@context': 'https://schema.org',
      '@type': ['EducationalOrganization', 'School', 'ElementarySchool'],
      '@id': `${siteUrl}/#organization`,
      name: 'SDIT Al-Afiyah Majalengka',
      alternateName: [
        'Sekolah Dasar Islam Terpadu Al-Afiyah',
        'SDIT Al-Afiyah',
        'Yayasan Pendidikan Imam Bonjol Al-Afiyah'
      ],
      url: `${siteUrl}/sd`,
      logo: {
        '@type': 'ImageObject',
        url: `${siteUrl}/images/sd-logo.png`,
        width: '512',
        height: '512'
      },
      image: [
        `${siteUrl}/images/sd-hero-greenhouse.jpg`,
        `${siteUrl}/images/sd-activity-classroom-6b.jpg`,
        `${siteUrl}/images/sd-activity-shalat-berjamaah.jpg`
      ],
      description: 'Sekolah Dasar Islam Terpadu (SDIT) Al-Afiyah di Lingkungan Giri Asih Majalengka. Terakreditasi B resmi oleh BAN-SM, mengusung kurikulum terpadu Smart Akhlak Fitrah dan Tahfidz Juz 30 Mutqin.',
      telephone: '+62-813-1013-9001',
      email: 'sditalafiyahmjl@gmail.com',
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Lingkungan Giri Asih - Jl. Gerakan Koperasi, Kel. Majalengka Kulon',
        addressLocality: 'Majalengka',
        addressRegion: 'Jawa Barat',
        postalCode: '45411',
        addressCountry: 'ID'
      },
      geo: {
        '@type': 'GeoCoordinates',
        latitude: -6.8367783,
        longitude: 108.237785
      },
      hasCredential: {
        '@type': 'EducationalOccupationalCredential',
        credentialCategory: 'Akreditasi Sekolah',
        recognizedBy: {
          '@type': 'Organization',
          name: 'Badan Akreditasi Nasional Sekolah/Madrasah (BAN-SM)'
        },
        name: 'Terakreditasi B Resmi BAN-SM'
      },
      parentOrganization: {
        '@type': 'EducationalOrganization',
        name: 'Yayasan Pendidikan Imam Bonjol (YPIB) Majalengka',
        url: siteUrl,
        logo: `${siteUrl}/images/ypib-logo.png`,
      },
      sameAs: [
        'https://maps.google.com/?q=-6.8367783,108.237785'
      ]
    },

    // 3. SiteNavigationElement (Tells Google crawler which sub-links to display as Sitelinks)
    {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'SiteNavigationElement',
          name: 'Masuk ke Akun',
          description: 'Masuk ke Akun Portal SPMB & Sistem Informasi SDIT Al-Afiyah. Cek status pendaftaran dan kelulusan.',
          url: `${siteUrl}/login`
        },
        {
          '@type': 'SiteNavigationElement',
          name: 'SPMB SDIT Al-Afiyah',
          description: 'Pendaftaran Murid Baru (SPMB) SDIT Al-Afiyah Majalengka Tahun Ajaran 2027/2028. Kuota 2 rombel terbatas.',
          url: `${siteUrl}/sd/spmb`
        },
        {
          '@type': 'SiteNavigationElement',
          name: 'Affiliate Al-Afiyah',
          description: 'Program Affiliate Al-Afiyah terbuka untuk umum, wali murid, dan alumni.',
          url: `${siteUrl}/affiliate`
        },
        {
          '@type': 'SiteNavigationElement',
          name: 'Profil Lengkap SDIT',
          description: 'Visi, misi, status akreditasi B, dan profil resmi satuan pendidikan SDIT Al-Afiyah.',
          url: `${siteUrl}/sd/profil`
        },
        {
          '@type': 'SiteNavigationElement',
          name: 'Pilar Karakter Nabawiyah',
          description: 'Kurikulum pendidikan karakter nabawiyah, adab islami, dan program unggulan tahfidz.',
          url: `${siteUrl}/sd/karakter`
        },
        {
          '@type': 'SiteNavigationElement',
          name: 'Layanan Kontak & Lokasi',
          description: 'Alamat lengkap Lingkungan Giri Asih Majalengka Kulon dan WhatsApp resmi Tata Usaha.',
          url: `${siteUrl}/sd/kontak`
        }
      ]
    }
  ];

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}
