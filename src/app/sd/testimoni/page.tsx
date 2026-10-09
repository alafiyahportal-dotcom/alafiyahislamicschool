import React from 'react';
import type { Metadata } from 'next';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import StickyMobileBar from '@/components/layout/StickyMobileBar';
import Link from 'next/link';
import ScrollReveal from '@/components/landing/ScrollReveal';
import { prisma } from '@/lib/prisma';
import { 
  HeartHandshake, 
  ArrowLeft, 
  ChevronRight, 
  Star, 
  Quote, 
  CheckCircle2, 
  ArrowRight,
  MessageSquareHeart
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Testimoni Orang Tua Murid SDIT',
  description: 'Pengalaman tulus, ulasan, dan testimoni Ayah Bunda wali murid mempercayakan pendidikan ananda di SDIT Al-Afiyah Majalengka.',
  icons: {
    icon: [
      { url: '/images/sd-logo.png', type: 'image/png' },
      { url: '/favicon.ico' },
    ],
    shortcut: '/images/sd-logo.png',
    apple: '/images/sd-logo.png',
  },
};

const TESTIMONIALS = [
  {
    name: 'Ibu Nani Mulyani, S.Pd.',
    role: 'Wali Murid Kelas 5 SDIT Al-Afiyah',
    quote: 'Menumbuhkan kesadaran beribadah, adab, serta empati anak secara alami tanpa paksaan. Pembelajarannya yang menyenangkan dan selaras dengan tumbuh kembang anak didukung sinergi yang kuat antara sekolah dan orang tua benar-benar membentuk karakter anak yang berakhlak mulia dan mencintai ajaran Islam.',
    rating: 5,
    tag: 'Pembentukan Karakter Nabawiyah'
  },
  {
    name: 'dr. H. Asep Irawan, Sp.A',
    role: 'Wali Murid SDIT Al-Afiyah',
    quote: 'Alhamdulillah, semenjak sekolah di SDIT Al-Afiyah, ananda menjadi sangat mandiri, tertib shalat berjamaah 5 waktu, dan hafalan Al-Qur\'an Juz 30-nya sangat tartil fashihah makhraj hurufnya. Guru-gurunya luar biasa sabar.',
    rating: 5,
    tag: 'Tahfidz Juz 30 & Kemandirian'
  },
  {
    name: 'Ibu Hj. Rina Nurhasanah, S.Pd.',
    role: 'Wali Murid SDIT Al-Afiyah',
    quote: 'Lingkungan belajar islami yang hangat dan asatidzah yang mendidik dengan sepenuh hati. Lingkungan Giri Asih sangat asri, rindang, sejuk, dan aman bagi anak-anak. Pilihan terbaik di Majalengka.',
    rating: 5,
    tag: 'Lingkungan Asri & Ramah Anak'
  },
  {
    name: 'Ayahanda Farhan Pratama, S.T.',
    role: 'Wali Murid Kelas 2 SDIT',
    quote: 'Sangat terkesan dengan program outdoor learning dan field study di P4S An-Nabawiyah. Murid tidak hanya duduk di kelas, tetapi praktik langsung semai sayur di polybag dan pengenalan biofloc. Rasa syukur anak terhadap alam tumbuh pesat.',
    rating: 5,
    tag: 'Outdoor Learning & Agro-Sains'
  },
  {
    name: 'Bunda Aisyah Zahra',
    role: 'Wali Murid Kelas 1 SDIT',
    quote: 'Transisi anak saya dari PAUD/TK menuju SD sangat membahagiakan. Guru kelas mendampingi dengan pendekatan kasih sayang tanpa membebani mental. Sekarang ananda berani tampil berbicara kultum di hadapan teman-temannya.',
    rating: 5,
    tag: 'Da\'i Cilik & Percaya Diri'
  },
  {
    name: 'Bapak Dedi Suhendar',
    role: 'Wali Murid Kelas 4 SDIT',
    quote: 'Apresiasi tinggi atas dukungan sekolah terhadap bakat minat anak. Tim Futsal SDIT berhasil menyabet Juara 2 tingkat daerah, anak kami dilatih sportivitas dan mental juara islami yang luar biasa.',
    rating: 5,
    tag: 'Prestasi Minat & Bakat'
  }
];

export const revalidate = 60;

export default async function SdTestimoniPage() {
  let displayTestimonials = TESTIMONIALS;

  try {
    const school = await prisma.school.findUnique({
      where: { slug: 'sd' },
      include: { cmsSections: true },
    });
    const cmsSec = school?.cmsSections.find((s) => s.sectionKey === 'testimonials');
    if (cmsSec?.payload) {
      const parsed = JSON.parse(cmsSec.payload);
      if (Array.isArray(parsed) && parsed.length > 0) {
        displayTestimonials = parsed.map((item: any, idx: number) => ({
          name: item.name,
          role: item.role,
          quote: item.quote,
          rating: item.rating || 5,
          tag: item.tag || TESTIMONIALS[idx % TESTIMONIALS.length]?.tag || 'Keluarga Besar Al-Afiyah',
        }));
      }
    }
  } catch (err) {
    console.error('Error fetching SD testimonials from CMS, using default list:', err);
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navbar schoolSlug="sd" />
      <main className="flex-1">
        {/* Hero Banner */}
        <section className="bg-gradient-to-br from-[#064e3b] via-[#047857] to-[#00A651] text-white pt-24 sm:pt-28 pb-14 sm:pb-18 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1.5px,transparent_1.5px)] [background-size:20px_20px] pointer-events-none" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-1.5 text-xs text-emerald-200/90 mb-5" aria-label="Breadcrumb">
              <Link href="/sd" className="hover:text-white transition-colors inline-flex items-center gap-1">
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Beranda SDIT</span>
              </Link>
              <ChevronRight className="w-3 h-3 text-emerald-300/50" />
              <span className="text-white font-medium">Testimoni</span>
            </nav>

            <div className="max-w-3xl">
              <div className="text-xs font-bold text-emerald-200 uppercase tracking-widest inline-flex items-center gap-1.5 mb-3">
                <MessageSquareHeart className="w-3.5 h-3.5 text-emerald-300" />
                <span>KATA MEREKA TENTANG AL-AFIYAH</span>
              </div>

              <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
                Testimoni Orang Tua Murid SDIT Al-Afiyah
              </h1>

              <p className="mt-3.5 text-xs sm:text-sm lg:text-base text-emerald-100/90 leading-relaxed font-normal">
                Kepercayaan tulus Ayah dan Bunda mempercayakan proses tumbuh kembang, adab nabawiyah, dan prestasi pendidikan ananda di SDIT Al-Afiyah Majalengka.
              </p>
            </div>
          </div>
        </section>

        {/* Testimonials Grid */}
        <section className="py-12 sm:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <ScrollReveal yOffset={24} duration={500} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {displayTestimonials.map((testi, idx) => (
                <div
                  key={idx}
                  className="p-6 sm:p-7 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:border-emerald-500/40 hover:shadow-md transition-all flex flex-col justify-between relative group"
                >
                  <Quote className="w-10 h-10 text-emerald-100 absolute top-5 right-5 pointer-events-none" />

                  <div>
                    {/* Stars & Tag */}
                    <div className="flex items-center justify-between gap-2 mb-4 relative z-10">
                      <div className="flex items-center gap-1">
                        {Array.from({ length: testi.rating }).map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                        ))}
                      </div>
                      <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                        {testi.tag}
                      </span>
                    </div>

                    <p className="text-xs sm:text-[13px] text-slate-700 leading-relaxed italic relative z-10">
                      &ldquo;{testi.quote}&rdquo;
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <h3 className="text-xs sm:text-sm font-bold text-slate-900">
                        {testi.name}
                      </h3>
                      <p className="text-[11px] text-slate-500 font-medium">
                        {testi.role}
                      </p>
                    </div>
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      <span>Terverifikasi</span>
                    </span>
                  </div>
                </div>
              ))}
            </ScrollReveal>
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="bg-gradient-to-r from-emerald-900 to-[#064e3b] text-white py-12 sm:py-16">
          <ScrollReveal yOffset={24} duration={500} className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Bergabunglah Bersama Keluarga Besar SDIT Al-Afiyah
            </h2>
            <p className="mt-3 text-xs sm:text-sm text-emerald-100 max-w-xl mx-auto leading-relaxed">
              Kuota SPMB T.A. 2027/2028 terbatas hanya 2 Rombel. Segera daftarkan putra-putri tercinta untuk mendapatkan pendidikan terbaik.
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/sd/spmb/daftar"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#00A651] hover:bg-emerald-600 text-white font-bold text-xs sm:text-sm shadow-md transition-all active:scale-95"
              >
                <span>Daftar SPMB SDIT Online</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/sd/spmb"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/25 text-white font-bold text-xs sm:text-sm transition-all"
              >
                <span>Informasi SPMB SDIT</span>
              </Link>
            </div>
          </ScrollReveal>
        </section>
      </main>
      <Footer schoolSlug="sd" />
      <StickyMobileBar schoolSlug="sd" />
    </div>
  );
}
