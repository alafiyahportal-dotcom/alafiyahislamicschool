import React from 'react';
import { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import StickyMobileBar from '@/components/layout/StickyMobileBar';
import ReRegistrationClient from '@/components/portal/ReRegistrationClient';

interface PageProps {
  params: Promise<{ regNo: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { regNo } = await params;
  const decodedRegNo = decodeURIComponent(regNo);

  return {
    title: `Konfirmasi Daftar Ulang & Seragam (${decodedRegNo}) | Ekosistem Al-Afiyah`,
    description: `Formulir online pendaftaran ulang dan pengukuran seragam murid baru Yayasan Pendidikan Imam Bonjol Majalengka.`,
  };
}

export const dynamic = 'force-dynamic';

export default async function ReRegistrationPage({ params }: PageProps) {
  const { regNo } = await params;
  const decodedRegNo = decodeURIComponent(regNo);

  const registration = await prisma.pPDBRegistration.findUnique({
    where: { registrationNo: decodedRegNo },
    include: {
      school: {
        select: {
          id: true,
          slug: true,
          name: true,
          badgeText: true,
          primaryColor: true,
          accentColor: true,
        },
      },
      reRegistration: true,
    },
  });

  if (!registration) {
    notFound();
  }

  // Hanya murid ACCEPTED yang dapat mengakses formulir daftar ulang
  if (registration.status !== 'ACCEPTED') {
    redirect(`/portal/ppdb/${decodedRegNo}`);
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#F7FBFB] text-slate-800">
      <Navbar
        schoolName={registration.school.name}
        badgeText={registration.school.badgeText}
        schoolSlug={registration.school.slug as 'tk' | 'sd' | 'smp'}
      />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <ReRegistrationClient registration={registration} />
      </main>

      <Footer />
      <StickyMobileBar />
    </div>
  );
}
