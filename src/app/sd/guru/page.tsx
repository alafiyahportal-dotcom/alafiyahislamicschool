import React from 'react';
import type { Metadata } from 'next';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import StickyMobileBar from '@/components/layout/StickyMobileBar';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import SdGuruClient from './SdGuruClient';

export const metadata: Metadata = {
  title: 'Dewan Guru & Asatidzah SD IT',
  description: 'Profil dewan asatidzah, guru tahfidz Al-Qur\'an, pendidik kurikulum nasional, dan pembina karakter murid SD IT Al-Afiyah Majalengka.',
  icons: {
    icon: [
      { url: '/images/sd-logo.png', type: 'image/png' },
      { url: '/favicon.ico' },
    ],
    shortcut: '/images/sd-logo.png',
    apple: '/images/sd-logo.png',
  },
};

export const revalidate = 60;

export default async function SdGuruPage() {
  let teachers: any[] = [];

  try {
    const dbTeachers = await prisma.teacher.findMany({
      where: {
        school: { slug: 'sd' },
        isActive: true,
      },
      orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
    });

    if (dbTeachers && dbTeachers.length > 0) {
      teachers = dbTeachers.map((t) => ({
        id: t.id,
        name: t.name,
        role: t.role,
        bio: t.bio || '',
        imageUrl: t.photoUrl || '/images/teacher-avatar-placeholder.jpg',
        specialization: t.specialization || 'Pendidik Karakter Nabawiyah',
        degrees: (t as Record<string, any>).degrees || 'Pendidik Resmi',
      }));
    }
  } catch (err) {
    console.error('Error fetching SD teachers from DB, using curated list:', err);
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navbar schoolSlug="sd" />
      <main className="flex-1">
        <SdGuruClient initialTeachers={teachers} />
      </main>
      <Footer schoolSlug="sd" />
      <StickyMobileBar schoolSlug="sd" />
    </div>
  );
}
