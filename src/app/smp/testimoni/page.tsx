import React from 'react';
import type { Metadata } from 'next';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import StickyMobileBar from '@/components/layout/StickyMobileBar';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { ChevronRight, ArrowRight } from 'lucide-react';
import FacelessIslamicAvatar from '@/components/shared/FacelessIslamicAvatar';

export const metadata: Metadata = {
  title: 'Testimoni & Suara Wali Murid | SMP IT Al-Afiyah Majalengka',
  description:
    'Pengalaman tulus, ulasan, dan apresiasi orang tua murid menyekolahkan putra-putri di SMP IT Al-Afiyah Majalengka.',
  icons: {
    icon: [
      { url: '/images/smp-icon-192.png', type: 'image/png' },
      { url: '/smp-favicon.ico', sizes: 'any' },
    ],
    shortcut: '/images/smp-icon-192.png',
    apple: '/images/smp-icon-192.png',
  },
};

const REAL_DEFAULT_SMP_TESTIMONIALS = [
  {
    name: 'Ust. Jaja Madhuri, S.Pd., M.Pd.',
    role: 'Kepala Sekolah SMP IT Al-Afiyah Majalengka',
    quote:
      'Di SMP IT Al-Afiyah, kami membimbing santri di fase remaja dengan keteladanan adab nabawiyah, kedisiplinan ibadah melalui Mutaba’ah Digital, hafalan Al-Qur’an 3–5+ Juz mutqin, serta kemahiran Bahasa Arab aktif agar lahir generasi pemimpin yang Be Smart & Religious.',
  },
  {
    name: 'Dewan Asatidz & Pembina Tahfidz',
    role: 'Tim Pendidik SMP IT Al-Afiyah',
    quote:
      'Sinergi erat antara pembiasaan shalat berjamaah di masjid sekolah, halaqah Al-Qur’an setiap pagi, dan komunikasi rutin bersama orang tua menjadi kunci tumbuhnya karakter santri yang santun, mandiri, dan berprestasi.',
  },
];

export const revalidate = 60;

export default async function SmpTestimoniPage() {
  let displayTestimonials = REAL_DEFAULT_SMP_TESTIMONIALS;

  try {
    const school = await prisma.school.findUnique({
      where: { slug: 'smp' },
      include: { cmsSections: true },
    });

    const cmsSec = school?.cmsSections.find((s) => s.sectionKey === 'testimonials');
    if (cmsSec?.payload) {
      const parsed = JSON.parse(cmsSec.payload);
      if (Array.isArray(parsed) && parsed.length > 0) {
        const valid = parsed
          .filter((item: any) => Boolean(item && item.name && item.quote))
          .map((item: any) => ({
            name: item.name,
            role: item.role || 'Wali Murid SMP IT Al-Afiyah',
            quote: String(item.quote || '').replace(/^[“"']+|[”"']+$/g, ''),
          }));
        if (valid.length > 0) {
          displayTestimonials = valid;
        }
      }
    }
  } catch (err) {
    console.error('Error fetching SMP testimonials from CMS:', err);
  }

  return (
    <div className="min-h-screen bg-white text-slate-800 flex flex-col font-sans">
      <Navbar schoolSlug="smp" transparentAtTop={false} />
      <main className="flex-1 pt-16 sm:pt-20">
        {/* Compact Header Al-Hidayah Style */}
        <section className="bg-[#030164] text-white py-8 sm:py-10 border-b-4 border-[#ffd51e]">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-1.5 text-xs text-blue-200/80 mb-1.5">
              <Link href="/smp" className="hover:text-[#ffd51e] transition-colors">
                Beranda SMP IT
              </Link>
              <ChevronRight className="w-3.5 h-3.5 text-[#ffd51e]" />
              <span className="text-[#ffd51e] font-semibold">Testimoni</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Testimoni &amp; Suara Sekolah SMP IT Al-Afiyah
            </h1>
          </div>
        </section>

        {/* Testimonials List */}
        <section className="py-10 sm:py-14">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {displayTestimonials.map((testi, idx) => (
                <div
                  key={idx}
                  className="p-6 rounded-sm bg-[#FAF6EC] border border-[#E5D5B2] flex flex-col justify-between space-y-4"
                >
                  <p className="text-sm sm:text-base text-slate-900 leading-relaxed italic">
                    &ldquo;{testi.quote}&rdquo;
                  </p>
                  <div className="pt-3 border-t border-[#E5D5B2] flex items-center gap-3">
                    <FacelessIslamicAvatar
                      name={testi.name}
                      role={testi.role}
                      unit="smp"
                      className="w-11 h-11"
                    />
                    <div>
                      <h3 className="text-sm font-extrabold text-[#030164]">
                        {testi.name}
                      </h3>
                      <p className="text-xs font-bold text-amber-700 mt-0.5">
                        {testi.role}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-2">
              <Link
                href="/smp/spmb/daftar"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xs bg-[#030164] hover:bg-[#090580] text-white font-bold text-xs transition-colors"
              >
                <span>Daftar SPMB SMP IT Online</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer schoolSlug="smp" />
      <StickyMobileBar schoolSlug="smp" />
    </div>
  );
}
