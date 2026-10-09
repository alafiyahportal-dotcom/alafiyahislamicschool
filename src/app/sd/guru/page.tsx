import React from 'react';
import type { Metadata } from 'next';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import StickyMobileBar from '@/components/layout/StickyMobileBar';
import { prisma } from '@/lib/prisma';
import SdGuruClient, { TeacherItem } from '@/app/sd/guru/SdGuruClient';

export const metadata: Metadata = {
  title: 'Dewan Guru & Asatidzah SDIT',
  description: 'Profil dewan asatidzah, guru tahfidz Al-Qur\'an, pendidik kurikulum nasional, dan pembina karakter murid SDIT Al-Afiyah Majalengka.',
  icons: {
    icon: [
      { url: '/images/sd-logo.png', type: 'image/png' },
      { url: '/favicon.ico' },
    ],
    shortcut: '/images/sd-logo.png',
    apple: '/images/sd-logo.png',
  },
};

export const revalidate = 60; // Cache 60 detik untuk navigasi kilat & otomatis revalidasi latar belakang

function inferCategory(role: string = '', specialization: string = ''): string {
  const text = `${role} ${specialization}`.toLowerCase();
  if (text.includes('yayasan') || text.includes('kepala') || text.includes('komite') || text.includes('pimpinan')) {
    return 'Pimpinan & Komite';
  }
  if (text.includes('tahfidz') || text.includes('kurikulum') || text.includes('qur') || text.includes('diniyyah') || text.includes('arab') || text.includes('agama')) {
    return 'Kurikulum & Tahfidz';
  }
  return 'Kesiswaan & Operasional';
}

function inferDegrees(name: string, fallbackDegree: string = 'Pendidik Resmi'): string {
  if (name.includes(',')) {
    const parts = name.split(',');
    return parts.slice(1).join(',').trim() || fallbackDegree;
  }
  return fallbackDegree;
}

export default async function SdGuruPage() {
  let teachers: TeacherItem[] = [];

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
        degrees: inferDegrees(t.name, t.specialization || 'Pendidik Profesional'),
        category: inferCategory(t.role, t.specialization || ''),
      }));
    }
  } catch (err) {
    console.error('Error fetching SD teachers from DB, falling back to curated list in client:', err);
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

