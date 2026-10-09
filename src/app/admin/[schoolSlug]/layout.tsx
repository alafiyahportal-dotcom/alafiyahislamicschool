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
