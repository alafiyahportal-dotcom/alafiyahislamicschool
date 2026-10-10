import type { Metadata, Viewport } from 'next';

export async function generateViewport({
  params,
}: {
  params: Promise<{ schoolSlug: string }>;
}): Promise<Viewport> {
  const resolvedParams = await params;
  const { schoolSlug } = resolvedParams;

  const color =
    schoolSlug === 'smp'
      ? '#030164'
      : schoolSlug === 'tk'
      ? '#0284c7'
      : schoolSlug === 'sd'
      ? '#00A651'
      : '#184F48';

  return {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
    themeColor: color,
  };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ schoolSlug: string }>;
}): Promise<Metadata> {
  const resolvedParams = await params;
  const { schoolSlug } = resolvedParams;

  const unitName =
    schoolSlug === 'sd'
      ? 'Admin SDIT Al-Afiyah'
      : schoolSlug === 'tk'
      ? 'Admin TK IT Al-Afiyah'
      : schoolSlug === 'smp'
      ? 'Admin SMP IT Al-Afiyah'
      : 'Super Admin Yayasan Al-Afiyah';

  return {
    title: {
      template: `%s | ${unitName}`,
      default: `${unitName} | Majalengka`,
    },
    description: `Panel Pengelolaan & Administrasi Resmi ${unitName}`,
    icons: {
      icon: schoolSlug === 'sd' ? '/images/sd-logo.png' : '/favicon.ico',
    },
  };
}

export default function SchoolAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
