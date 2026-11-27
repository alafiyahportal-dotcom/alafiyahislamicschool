import React from 'react';
import { Metadata } from 'next';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import StickyMobileBar from '@/components/layout/StickyMobileBar';
import { ChevronRight, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Kontak & Lokasi | SDIT Al-Afiyah Majalengka',
  description:
    'Alamat lengkap, nomor WhatsApp resmi Tata Usaha & SPMB SDIT Al-Afiyah Majalengka, jam layanan kantor dan peta lokasi.',
  icons: {
    icon: [
      { url: '/images/sd-logo.png', type: 'image/png' },
      { url: '/favicon.ico' },
    ],
    shortcut: '/images/sd-logo.png',
    apple: '/images/sd-logo.png',
  },
};

export default async function SdKontakPage() {
  let address =
    'Lingkungan Giri Asih - Jl. Gerakan Koperasi, Kel. Majalengka Wetan, Kec. Majalengka, Kab. Majalengka, Jawa Barat 45411';
  let email = 'sditalafiyahmjl@gmail.com';
  let whatsappNumber = '0813-1013-9001';
  let consultationHours = 'Senin – Jumat: 07.30 – 15.00 WIB • Sabtu: 08.00 – 12.00 WIB';

  try {
    const school = await prisma.school.findUnique({
      where: { slug: 'sd' },
      include: {
        cmsSections: {
          where: { sectionKey: 'identity' },
        },
      },
    });
    const section = school?.cmsSections?.[0];
    if (section?.payload) {
      try {
        const c = JSON.parse(section.payload);
        if (c && typeof c === 'object') {
          if (c.schoolAddress || c.address) address = c.schoolAddress || c.address;
          if (c.email) email = c.email;
          if (c.consultationHours) consultationHours = c.consultationHours;
          if (c.whatsappNumber) {
            whatsappNumber = c.whatsappNumber.startsWith('62')
              ? '0' + c.whatsappNumber.slice(2)
              : c.whatsappNumber;
          }
        }
      } catch {}
    }
  } catch (err) {
    console.error('Failed to load dynamic SD contact info:', err);
  }

  const cleanWa = whatsappNumber.replace(/[^0-9]/g, '');
  const waForLink = cleanWa.startsWith('0') ? '62' + cleanWa.slice(1) : cleanWa || '6281310139001';

  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-800 font-sans">
      <Navbar schoolSlug="sd" transparentAtTop={false} />

      <main className="flex-1 pt-16 sm:pt-20">
        {/* Compact Header Al-Hidayah Style */}
        <section className="bg-[#00594f] text-white py-8 sm:py-10 border-b-4 border-[#e5a93b]">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-2 text-xs text-emerald-100/80 mb-1.5">
              <Link href="/sd" className="hover:text-[#e5a93b] transition-colors">
                Beranda SDIT
              </Link>
              <ChevronRight className="w-3.5 h-3.5 text-[#e5a93b]" />
              <span className="text-[#e5a93b] font-semibold">Kontak</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Kontak &amp; Lokasi SDIT Al-Afiyah
            </h1>
          </div>
        </section>

        {/* Contact Info Table + Map */}
        <section className="py-10 sm:py-12">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left: Clean Contact Table */}
            <div className="lg:col-span-5 space-y-5">
              <h2 className="text-lg font-extrabold text-[#003831]">
                Sekretariat &amp; Tata Usaha SDIT
              </h2>

              <div className="border-t border-slate-200 divide-y divide-slate-200 text-xs sm:text-sm">
                <div className="py-3.5 space-y-1">
                  <span className="text-slate-500 block text-xs">Alamat</span>
                  <p className="font-semibold text-[#003831] leading-relaxed">
                    {address}
                  </p>
                </div>

                <div className="py-3.5 space-y-1">
                  <span className="text-slate-500 block text-xs">WhatsApp Resmi</span>
                  <p className="font-bold text-[#00594f] tabular-nums">
                    {whatsappNumber}
                  </p>
                </div>

                <div className="py-3.5 space-y-1">
                  <span className="text-slate-500 block text-xs">Email</span>
                  <p className="font-semibold text-[#003831] break-all">
                    {email}
                  </p>
                </div>

                <div className="py-3.5 space-y-1">
                  <span className="text-slate-500 block text-xs">
                    Jam Pelayanan Tata Usaha
                  </span>
                  <p className="font-semibold text-[#003831]">
                    {consultationHours}
                  </p>
                </div>
              </div>

              <a
                href={`https://wa.me/${waForLink}?text=Assalamu%27alaikum%20Panitia%20SPMB%20SDIT%20Al-Afiyah,%20saya%20ingin%20konsultasi%20pendaftaran`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xs bg-[#00594f] hover:bg-[#003831] text-white text-xs font-bold transition-colors"
              >
                <span>Hubungi via WhatsApp</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* Right: Google Maps */}
            <div className="lg:col-span-7">
              <div className="border border-slate-200 rounded-xs overflow-hidden bg-slate-100 h-[360px] sm:h-[420px] relative">
                <iframe
                  title="Peta Lokasi SDIT Al-Afiyah Majalengka"
                  src="https://www.google.com/maps?q=-6.8367783,108.237785&hl=id&z=16&output=embed"
                  className="w-full h-full border-0 absolute inset-0"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer schoolSlug="sd" />
      <StickyMobileBar schoolSlug="sd" />
    </div>
  );
}
