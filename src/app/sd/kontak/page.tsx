import React from 'react';
import { Metadata } from 'next';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import StickyMobileBar from '@/components/layout/StickyMobileBar';
import ContactFormClient from '@/components/contact/ContactFormClient';
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  Building2, 
  ExternalLink,
  ShieldCheck,
  Headphones,
  ChevronRight,
  MessageCircle,
  ArrowLeft,
  Navigation
} from 'lucide-react';
import Link from 'next/link';
import ScrollReveal from '@/components/landing/ScrollReveal';
import { prisma } from '@/lib/prisma';

export const revalidate = 0;

export const metadata: Metadata = {
  title: 'Kontak Tata Usaha & Lokasi SD IT Al-Afiyah Majalengka',
  description: 'Alamat lengkap, nomor WhatsApp resmi Tata Usaha & SPMB SD IT Al-Afiyah Majalengka, jam layanan kantor dan petunjuk arah.',
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
  let address = 'Lingkungan Giri Asih - Jl. Gerakan Koperasi, Kel. Majalengka Wetan, Kec. Majalengka, Kab. Majalengka, Jawa Barat 45411';
  let email = 'sditalafiyahmjl@gmail.com';
  let whatsappNumber = '0813-1013-9001';
  let mapsUrl = 'https://www.google.com/maps/dir/?api=1&destination=-6.8367783,108.237785';

  try {
    const school = await prisma.school.findUnique({
      where: { slug: 'sd' },
      select: { id: true },
    });
    if (school) {
      const section = await prisma.cMSSection.findUnique({
        where: {
          schoolId_sectionKey: {
            schoolId: school.id,
            sectionKey: 'identity',
          },
        },
      });
      if (section?.payload) {
        try {
          const c = JSON.parse(section.payload);
          if (c && typeof c === 'object') {
            if (c.address) address = c.address;
            if (c.email) email = c.email;
            if (c.whatsappNumber) {
              whatsappNumber = c.whatsappNumber.startsWith('62') 
                ? '0' + c.whatsappNumber.slice(2) 
                : c.whatsappNumber;
            }
            if (c.mapsUrl) mapsUrl = c.mapsUrl;
          }
        } catch {}
      }
    }
  } catch (err) {
    console.error('Failed to load dynamic SD contact info:', err);
  }

  const cleanWa = whatsappNumber.replace(/[^0-9]/g, '');
  const waForLink = cleanWa.startsWith('0') ? '62' + cleanWa.slice(1) : (cleanWa || '6281310139001');

  const contactChannels = [
    {
      title: 'Layanan Utama & Panitia SPMB SD IT',
      number: whatsappNumber,
      desc: 'Konsultasi kurikulum dasar, Smart Akhlaq Fitrah, pendaftaran murid baru (SPMB), dan tata usaha.',
      link: `https://wa.me/${waForLink}?text=Assalamu%27alaikum%20Panitia%20SPMB%20SDIT%20Al-Afiyah,%20saya%20ingin%20konsultasi%20pendaftaran`,
      cta: 'Chat WhatsApp SD IT',
      badge: 'Unit SD IT Resmi',
    },
    {
      title: 'Konsultasi Program Tahfidz SD IT',
      number: whatsappNumber,
      desc: 'Informasi kurikulum tahfidz mutqin juz 30, hafalan hadits, dan target capaian ibadah murid.',
      link: `https://wa.me/${waForLink}?text=Assalamu%27alaikum%20Asatidzah%20SDIT%20Al-Afiyah,%20saya%20ingin%20konsultasi%20tahfidz`,
      cta: 'Konsultasi Tahfidz',
      badge: 'Tahfidz Qur’an',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] text-slate-800 font-sans selection:bg-[#00A651]/20 selection:text-[#00A651]">
      <Navbar schoolSlug="sd" />

      {/* Hero Header Khusus SD IT */}
      <section className="bg-gradient-to-br from-[#064e3b] via-[#047857] to-[#00A651] text-white pt-24 sm:pt-28 pb-14 sm:pb-18 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1.5px,transparent_1.5px)] [background-size:20px_20px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-1.5 text-xs text-emerald-200/90 mb-5" aria-label="Breadcrumb">
            <Link href="/sd" className="hover:text-white transition-colors inline-flex items-center gap-1">
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Beranda SD IT</span>
            </Link>
            <ChevronRight className="w-3 h-3 text-emerald-300/50" />
            <span className="text-white font-medium">Kontak &amp; Lokasi</span>
          </nav>

          <div className="max-w-3xl">
            <div className="text-xs font-bold text-emerald-200 uppercase tracking-widest inline-flex items-center gap-1.5 mb-3">
              <Headphones className="w-3.5 h-3.5 text-emerald-300" />
              <span>LAYANAN TATA USAHA &amp; INFORMASI SD IT</span>
            </div>

            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
              Hubungi Tata Usaha &amp; CS SD IT
            </h1>

            <p className="mt-3.5 text-xs sm:text-sm lg:text-base text-emerald-100/90 leading-relaxed font-normal">
              Silakan hubungi kami untuk informasi kurikulum Smart Akhlaq Fitrah, pendaftaran murid baru SPMB, jadwal temu asatidzah, maupun kunjungan langsung ke SD IT Al-Afiyah Majalengka.
            </p>
          </div>
        </div>
      </section>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 -mt-6 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Kolom Kiri: Info Kontak & WhatsApp */}
          <div className="lg:col-span-5 space-y-6">
            <ScrollReveal yOffset={24} duration={500}>
              <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-xs border border-slate-200/80">
                <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center space-x-2">
                  <Headphones className="w-5 h-5 text-[#00A651]" />
                  <span>Saluran Resmi SD IT</span>
                </h2>

                <div className="space-y-4">
                  {contactChannels.map((channel, idx) => (
                    <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:border-emerald-300 transition-colors">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full uppercase tracking-wider">
                          {channel.badge}
                        </span>
                      </div>
                      <h3 className="font-bold text-slate-800 text-sm">{channel.title}</h3>
                      <p className="text-xs text-slate-500 mt-1">{channel.desc}</p>
                      <div className="mt-3 pt-3 border-t border-slate-200/60 flex items-center justify-between">
                        <span className="font-mono text-xs font-semibold text-slate-700">{channel.number}</span>
                        <a
                          href={channel.link}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center space-x-1.5 text-xs font-bold text-emerald-700 hover:text-emerald-900 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                          <span>{channel.cta}</span>
                        </a>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Info Kantor & Operasional */}
                <div className="mt-6 pt-6 border-t border-slate-100 space-y-4 text-xs text-slate-600">
                  <div className="flex items-start space-x-3">
                    <Clock className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-slate-800 block">Jam Operasional Layanan TU:</strong>
                      <span>Senin - Sabtu: 07.30 - 15.00 WIB (Ahad & Hari Libur Nasional Tutup)</span>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <Mail className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-slate-800 block">Email Resmi:</strong>
                      <a href={`mailto:${email}`} className="font-mono text-emerald-700 hover:underline">
                        {email}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <MapPin className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-slate-800 block">Alamat SD IT Al-Afiyah:</strong>
                      <span>{address}</span>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>

          {/* Kolom Kanan: Form Kirim Pesan & Peta */}
          <div className="lg:col-span-7 space-y-6">
            <ScrollReveal yOffset={24} duration={500} delay={0.1}>
              <div className="space-y-6">
                <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xs border border-slate-200/80">
                  <div className="mb-6">
                    <span className="text-[11px] font-bold text-[#00A651] uppercase tracking-wider bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                      Formulir Konsultasi & Pengaduan
                    </span>
                    <h2 className="text-xl font-bold text-slate-900 mt-2">Kirim Pesan ke Tata Usaha SD IT</h2>
                    <p className="text-xs text-slate-500 mt-1">
                      Pesan Anda akan langsung diteruskan ke tim sekretariat dan dibalas via email atau WhatsApp.
                    </p>
                  </div>

                  <ContactFormClient />
                </div>

                {/* Google Maps SD IT Al-Afiyah */}
                <div className="bg-white rounded-3xl p-6 shadow-xs border border-slate-200/80 overflow-hidden">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-5 h-5 text-[#00A651]" />
                      <h3 className="font-bold text-slate-800 text-sm">Lokasi SD IT Al-Afiyah</h3>
                    </div>
                    <a
                      href={mapsUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs font-semibold text-emerald-700 hover:underline inline-flex items-center space-x-1"
                    >
                      <span>Buka di Google Maps</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>

                  <div className="w-full h-72 rounded-2xl overflow-hidden border border-slate-200 relative bg-slate-100 mb-4">
                    <iframe
                      title="Peta Lokasi SD IT Al-Afiyah"
                      src="https://maps.google.com/maps?q=-6.8367783%2C108.237785&t=&z=18&ie=UTF8&iwloc=&output=embed"
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen={false}
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                    />
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <a
                      href="https://www.google.com/maps/dir/?api=1&destination=-6.8367783,108.237785"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors flex items-center justify-center gap-2 text-center"
                    >
                      <Navigation className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Petunjuk Arah (Google Maps)</span>
                    </a>
                    <a
                      href="https://wa.me/6281310139001?text=Assalamu%27alaikum%20Panitia%20SD%20IT%20Al-Afiyah%2C%20saya%20ingin%20konsultasi%20lokasi%20sekolah"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 py-2.5 px-4 rounded-xl bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 text-xs font-bold transition-colors flex items-center justify-center gap-2 text-center"
                    >
                      <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Hubungi via WhatsApp</span>
                    </a>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>

        </div>
      </main>

      <Footer schoolSlug="sd" />
      <StickyMobileBar schoolSlug="sd" />
    </div>
  );
}
