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
  ArrowLeft
} from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Kontak Tata Usaha & Lokasi Kampus SD IT Al-Afiyah Majalengka',
  description: 'Alamat lengkap Kampus Giri Asih, nomor WhatsApp resmi Tata Usaha & SPMB SD IT Al-Afiyah Majalengka, jam layanan kantor dan petunjuk arah.',
  icons: {
    icon: [
      { url: '/images/sd-logo.png', type: 'image/png' },
      { url: '/favicon.ico' },
    ],
    shortcut: '/images/sd-logo.png',
    apple: '/images/sd-logo.png',
  },
};

export default function SdKontakPage() {
  const contactChannels = [
    {
      title: 'Layanan Utama & Panitia SPMB SD IT',
      number: '+62 813-1013-9001',
      desc: 'Konsultasi kurikulum dasar, Smart Akhlaq Fitrah, pendaftaran murid baru (SPMB), dan tata usaha.',
      link: 'https://wa.me/6281310139001?text=Assalamu%27alaikum%20Panitia%20SPMB%20SDIT%20Al-Afiyah,%20saya%20ingin%20konsultasi%20pendaftaran',
      cta: 'Chat WhatsApp SD IT',
      badge: 'Unit SD IT Resmi',
    },
    {
      title: 'Konsultasi Program Tahfidz SD IT',
      number: '+62 813-1013-9001',
      desc: 'Informasi kurikulum tahfidz mutqin juz 30, hafalan hadits, dan target capaian ibadah santri.',
      link: 'https://wa.me/6281310139001?text=Assalamu%27alaikum%20Asatidzah%20SDIT%20Al-Afiyah,%20saya%20ingin%20konsultasi%20tahfidz',
      cta: 'Konsultasi Tahfidz',
      badge: 'Tahfidz Qur’an',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] text-slate-800 font-sans selection:bg-[#00A651]/20 selection:text-[#00A651]">
      <Navbar schoolSlug="sd" />

      {/* Hero Header */}
      <section className="relative text-white pt-24 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden bg-gradient-to-br from-[#007a3d] via-[#00A651] to-[#005c2e]">
        <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

        <div className="max-w-5xl mx-auto relative z-10 text-center">
          {/* Breadcrumb & Tombol Kembali */}
          <div className="flex items-center justify-center gap-2 mb-4">
            <Link
              href="/sd"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md border border-white/25 text-white text-xs font-semibold transition-all active:scale-95"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Kembali ke Beranda SD IT</span>
            </Link>
          </div>

          <p className="font-arabic text-xl sm:text-2xl text-emerald-200 mb-2 tracking-wide drop-shadow-xs">
            مَدْرَسَةُ العَافِيَةِ الإبْتِدَائِيَّةِ الإسْلَامِيَّةِ
          </p>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Hubungi Tata Usaha & CS SD IT
          </h1>
          <p className="mt-3.5 text-sm sm:text-base text-emerald-100 max-w-2xl mx-auto leading-relaxed">
            Silakan hubungi kami untuk informasi kurikulum, pendaftaran santri baru, jadwal temu asatidzah, maupun kunjungan langsung ke Kampus SD IT Al-Afiyah.
          </p>
        </div>
      </section>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 -mt-6 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Kolom Kiri: Info Kontak & WhatsApp */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xs border border-slate-200/80">
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
                    <span className="font-mono">sdit@alafiyahislamicschool.sch.id</span>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <MapPin className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-800 block">Alamat Kampus SD IT Al-Afiyah:</strong>
                    <span>Lingkungan Giri Asih - Jl. Gerakan Koperasi, Kel. Majalengka Kulon, Kec. Majalengka, Kab. Majalengka, Jawa Barat 45411</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Kolom Kanan: Form Kirim Pesan & Peta */}
          <div className="lg:col-span-7 space-y-6">
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

            {/* Google Maps Kampus SD IT */}
            <div className="bg-white rounded-3xl p-6 shadow-xs border border-slate-200/80 overflow-hidden">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <Building2 className="w-5 h-5 text-[#00A651]" />
                  <h3 className="font-bold text-slate-800 text-sm">Lokasi Kampus SD IT Al-Afiyah</h3>
                </div>
                <a
                  href="https://maps.google.com/?q=SD+IT+Al-Afiyah+Majalengka"
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs font-semibold text-emerald-700 hover:underline inline-flex items-center space-x-1"
                >
                  <span>Buka di Google Maps</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
              <div className="w-full h-64 rounded-2xl overflow-hidden border border-slate-200 relative bg-slate-100">
                <iframe
                  title="Peta Kampus SD IT Al-Afiyah"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3961.737154576774!2d108.2268482!3d-6.8320499!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e6f2f9c3c8c7c9d%3A0x6b8764032d966e31!2sMajalengka%20Kulon!5e0!3m2!1sid!2sid!4v1700000000000!5m2!1sid!2sid"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen={false}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>
          </div>

        </div>
      </main>

      <Footer schoolSlug="sd" />
      <StickyMobileBar schoolSlug="sd" />
    </div>
  );
}
