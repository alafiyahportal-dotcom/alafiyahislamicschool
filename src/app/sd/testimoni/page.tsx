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
  title: 'Testimoni Orang Tua Murid | SDIT Al-Afiyah Majalengka',
  description:
    'Pengalaman tulus, ulasan, dan testimoni Ayah Bunda wali murid mempercayakan pendidikan ananda di SDIT Al-Afiyah Majalengka.',
  icons: {
    icon: [
      { url: '/images/sd-logo.png', type: 'image/png' },
      { url: '/favicon.ico' },
    ],
    shortcut: '/images/sd-logo.png',
    apple: '/images/sd-logo.png',
  },
};

const REAL_DEFAULT_TESTIMONIALS = [
  {
    name: 'Ibu Nani Mulyani, S.Pd.',
    role: 'Wali Murid Kelas 5 SDIT',
    quote:
      'Sebagai orang tua, kami sangat bersyukur menyekolahkan anak di SDIT Al-Afiyah karena metode berbasis fitrah dan karakter Nabawiyyah berhasil menumbuhkan kesadaran beribadah, adab, serta empati anak secara alami tanpa paksaan. Pembelajarannya yang menyenangkan dan selaras dengan tumbuh kembang anak didukung sinergi yang kuat antara sekolah dan orang tua benar-benar membentuk karakter anak yang berakhlak mulia dan mencintai ajaran Islam.',
  },
  {
    name: 'Guru SDIT Al-Afiyah',
    role: 'Coretan Guru',
    quote:
      'Di SDIT Al-Afiyah, kami tidak sekadar mendidik anak agar pintar, tetapi membersamai mereka agar tumbuh menjadi pribadi yang beriman, berakhlak, dan bermanfaat.',
  },
];

export const revalidate = 60;

export default async function SdTestimoniPage() {
  let displayTestimonials = REAL_DEFAULT_TESTIMONIALS;

  try {
    const school = await prisma.school.findUnique({
      where: { slug: 'sd' },
      include: { cmsSections: true },
    });
    const cmsSec = school?.cmsSections.find((s) => s.sectionKey === 'testimonials');
    if (cmsSec?.payload) {
      const parsed = JSON.parse(cmsSec.payload);
      if (Array.isArray(parsed) && parsed.length > 0) {
        displayTestimonials = parsed.map((item: any) => ({
          name: item.name,
          role: item.role || 'Wali Murid SDIT Al-Afiyah',
          quote: String(item.quote || '').replace(/^[“"']+|[”"']+$/g, ''),
        }));
      }
    }
  } catch (err) {
    console.error('Error fetching SD testimonials from CMS, using default list:', err);
  }

  return (
    <div className="min-h-screen bg-white text-slate-800 flex flex-col font-sans">
      <Navbar schoolSlug="sd" transparentAtTop={false} />
      <main className="flex-1 pt-16 sm:pt-20">
        {/* Compact Header Al-Hidayah Style */}
        <section className="bg-[#00594f] text-white py-8 sm:py-10 border-b-4 border-[#e5a93b]">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-1.5 text-xs text-emerald-100/80 mb-1.5">
              <Link href="/sd" className="hover:text-[#e5a93b] transition-colors">
                Beranda SDIT
              </Link>
              <ChevronRight className="w-3.5 h-3.5 text-[#e5a93b]" />
              <span className="text-[#e5a93b] font-semibold">Testimoni</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Testimoni Wali Murid SDIT Al-Afiyah
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
                  <p className="text-sm sm:text-base text-[#003831] leading-relaxed italic">
                    &ldquo;{testi.quote}&rdquo;
                  </p>
                  <div className="pt-3 border-t border-[#E5D5B2] flex items-center gap-3">
                    <FacelessIslamicAvatar
                      name={testi.name}
                      role={testi.role}
                      unit="sd"
                      className="w-11 h-11"
                    />
                    <div>
                      <h3 className="text-sm font-extrabold text-[#003831]">
                        {testi.name}
                      </h3>
                      <p className="text-xs font-bold text-[#00594f] mt-0.5">
                        {testi.role}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-2">
              <Link
                href="/sd/spmb/daftar"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xs bg-[#00594f] hover:bg-[#003831] text-white font-bold text-xs transition-colors"
              >
                <span>Daftar SPMB SDIT Online</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer schoolSlug="sd" />
      <StickyMobileBar schoolSlug="sd" />
    </div>
  );
}
