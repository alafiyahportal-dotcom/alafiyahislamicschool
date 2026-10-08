import React from 'react';

export default function GoogleStructuredData() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.alafiyah.id';

  const structuredData = [
    // 1. WebSite Schema with Google Sitelinks Searchbox
    {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      '@id': `${siteUrl}/#website`,
      url: siteUrl,
      name: 'SD IT & Yayasan Al-Afiyah Majalengka',
      alternateName: [
        'Al-Afiyah Islamic School',
        'SDIT Al Afiyah',
        'SD IT Al-Afiyah Majalengka',
        'SPMB SD IT Al-Afiyah',
        'PMB Al-Afiyah Majalengka',
        'YPIB Majalengka'
      ],
      description: 'Portal Resmi Sistem Penerimaan Murid Baru (SPMB), Profil Satuan Pendidikan, dan Informasi Terpadu SD IT Al-Afiyah Majalengka.',
      inLanguage: 'id-ID',
      publisher: {
        '@id': `${siteUrl}/#organization`
      }
    },

    // 2. EducationalOrganization / School Schema (Powers Google Knowledge Panel)
    {
      '@context': 'https://schema.org',
      '@type': ['EducationalOrganization', 'School', 'ElementarySchool'],
      '@id': `${siteUrl}/#organization`,
      name: 'SD IT Al-Afiyah Majalengka',
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
      description: 'Sekolah Dasar Islam Terpadu (SD IT) Al-Afiyah di Lingkungan Giri Asih Majalengka. Terakreditasi B resmi oleh BAN-SM, mengusung kurikulum terpadu Smart Akhlaq Fitrah dan Tahfidz Juz 30 Mutqin.',
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
        name: 'Yayasan Pendidikan Imam Bonjol (YPIB) Majalengka'
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
          description: 'Masuk ke Akun Portal SPMB & Sistem Informasi SD IT Al-Afiyah. Cek status pendaftaran dan kelulusan.',
          url: `${siteUrl}/login`
        },
        {
          '@type': 'SiteNavigationElement',
          name: 'SPMB SD IT Al-Afiyah',
          description: 'Pendaftaran Murid Baru (SPMB) SD IT Al-Afiyah Majalengka Tahun Ajaran 2027/2028. Kuota 2 rombel terbatas.',
          url: `${siteUrl}/sd/spmb`
        },
        {
          '@type': 'SiteNavigationElement',
          name: 'Program Afiliasi',
          description: 'Program kemitraan dakwah syariah Al-Afiyah terbuka untuk umum, wali murid, dan alumni.',
          url: `${siteUrl}/affiliate`
        },
        {
          '@type': 'SiteNavigationElement',
          name: 'Profil Lengkap SD IT',
          description: 'Visi, misi, status akreditasi B, dan profil resmi satuan pendidikan SD IT Al-Afiyah.',
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
