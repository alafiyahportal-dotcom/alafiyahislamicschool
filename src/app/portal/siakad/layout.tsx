import type { Metadata, Viewport } from 'next';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
  themeColor: '#10B981',
};

export const metadata: Metadata = {
  title: 'SIAKAD Al-Afiyah | Portal Akademik Mobile',
  description:
    "Portal Sistem Informasi Akademik (SIAKAD) Mobile Al-Afiyah Majalengka. Pantau kehadiran presensi gerbang, mutaba'ah tahfidz Al-Qur'an, rapor digital, dan SPP murid secara real-time.",
  manifest: '/siakad-manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'SIAKAD Al-Afiyah',
    startupImage: '/icons/siakad-icon-512.png',
  },
  icons: {
    icon: [
      { url: '/icons/siakad-icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icons/siakad-icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [
      { url: '/icons/siakad-icon-apple-180.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  other: {
    // Ensure PWA "Add to Home Screen" banner is triggered on Android
    'mobile-web-app-capable': 'yes',
    // Prevent browser from suggesting phone number detection
    'format-detection': 'telephone=no',
  },
};

export default function SiakadLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
