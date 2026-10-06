import type { Metadata } from 'next';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ schoolSlug: string }>;
}): Promise<Metadata> {
  const resolvedParams = await params;
  const { schoolSlug } = resolvedParams;

  const unitName =
    schoolSlug === 'sd'
      ? 'Admin SD IT Al-Afiyah'
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
      icon: [
        { url: '/images/sd-logo.png', type: 'image/png' },
        { url: '/favicon.ico', sizes: 'any' },
      ],
      shortcut: '/images/sd-logo.png',
      apple: '/images/sd-logo.png',
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
