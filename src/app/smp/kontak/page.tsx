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
  ChevronRight,
  MessageCircle,
  ArrowLeft,
  Navigation,
  CreditCard,
  Copy,
  Sparkles
} from 'lucide-react';
import Link from 'next/link';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Kontak Resmi & Lokasi SMP IT Al-Afiyah Majalengka',
  description: 'Alamat resmi sekolah di Lingkungan Giri Asih, WhatsApp panitia SPMB 0822-4935-7893, rekening Bank Muamalat 1360012405, dan petunjuk rute Google Maps SMP IT Al-Afiyah Majalengka.',
  icons: {
    icon: [
      { url: '/images/smp-logo.png', type: 'image/png' },
      { url: '/smp-favicon.ico', sizes: 'any' },
    ],
    shortcut: '/images/smp-logo.png',
    apple: '/images/smp-logo.png',
  },
  openGraph: {
    title: 'Kontak & Lokasi SMP IT Al-Afiyah Majalengka',
    description: 'Jl. Gerakan Koperasi No. 110, Majalengka Wetan. WhatsApp: 0822-4935-7893.',
    images: ['/images/smp-spmb-poster.png'],
  },
};

export default function SmpKontakPage() {
  const address = 'Jl. Gerakan Koperasi No. 110, Majalengka Wetan, Kec. Majalengka, Kab. Majalengka, Jawa Barat 45411';
  const whatsappNumber = '0822-4935-7893';
  const waClean = '6282249357893';
  const mapsUrl = 'https://www.google.com/maps/search/?api=1&query=Jl.+Gerakan+Koperasi+No.+110+Majalengka+Wetan';

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans selection:bg-[#ffd51e] selection:text-[#030164]">
      <Navbar schoolSlug="smp" />

      {/* Hero Header */}
      <section className="bg-gradient-to-br from-[#030164] via-[#090580] to-[#01003d] text-white pt-24 sm:pt-28 pb-16 sm:pb-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffd51e_1.5px,transparent_1.5px)] [background-size:24px_24px] pointer-events-none" />
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-[#ffd51e]/15 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <nav className="flex items-center gap-1.5 text-xs text-blue-200/90 mb-5" aria-label="Breadcrumb">
            <Link href="/smp" className="hover:text-white transition-colors inline-flex items-center gap-1">
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Beranda SMP IT</span>
            </Link>
            <ChevronRight className="w-3 h-3 text-blue-300/50" />
            <span className="text-[#ffd51e] font-semibold">Kontak &amp; Lokasi</span>
          </nav>

          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-[#ffd51e]/40 text-[#ffd51e] text-xs font-bold tracking-wider uppercase mb-4 backdrop-blur-xs">
              <Phone className="w-3.5 h-3.5" />
              <span>LAYANAN TATA USAHA &amp; PANITIA SPMB</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
              Hubungi SMP IT Al-Afiyah
            </h1>

            <p className="mt-4 text-base sm:text-lg text-slate-200 leading-relaxed font-normal">
              Panitia SPMB dan Tata Usaha siap melayani konsultasi pendaftaran, jadwal observasi calon santri, informasi kurikulum, maupun kunjungan langsung ke sekolah kami di Lingkungan Giri Asih.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Contact Details Column */}
          <div className="lg:col-span-6 space-y-6">
            <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-6">
              <div>
                <span className="text-xs font-bold text-[#030164] uppercase tracking-widest">
                  Informasi Resmi
                </span>
                <h3 className="text-2xl font-bold text-slate-900 mt-1">
                  Saluran Komunikasi Sekolah
                </h3>
              </div>

              {/* WhatsApp Card */}
              <div className="p-5 rounded-2xl bg-blue-50/60 border border-blue-100 flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-[#030164] text-[#ffd51e] flex items-center justify-center shrink-0">
                  <MessageCircle className="w-6 h-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-[11px] font-bold text-[#030164] uppercase tracking-wider block">
                    WhatsApp Center Panitia SPMB
                  </span>
                  <p className="text-base font-extrabold text-slate-900 mt-0.5">
                    {whatsappNumber}
                  </p>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    Respon cepat untuk tanya jawab kuota, diskon gelombang 1, dan alur pendaftaran.
                  </p>
                  <a
                    href={`https://wa.me/${waClean}?text=Assalamu%27alaikum%20Panitia%20SPMB%20SMP%20IT%20Al-Afiyah,%20saya%20ingin%20berkonsultasi%20pendaftaran`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 mt-3 text-xs font-bold text-[#030164] hover:underline"
                  >
                    <span>Chat WhatsApp Sekarang</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

              {/* Address Card */}
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-white text-[#030164] border border-slate-200 flex items-center justify-center shrink-0 shadow-xs">
                  <MapPin className="w-6 h-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                    Alamat Sekolah SMP IT (Lingkungan Giri Asih)
                  </span>
                  <p className="text-sm font-bold text-slate-900 mt-0.5 leading-snug">
                    {address}
                  </p>
                  <a
                    href={mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 mt-3 text-xs font-bold text-[#030164] hover:underline"
                  >
                    <Navigation className="w-3.5 h-3.5" />
                    <span>Buka Rute di Google Maps</span>
                  </a>
                </div>
              </div>

              {/* Jam Operasional Card */}
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-white text-[#030164] border border-slate-200 flex items-center justify-center shrink-0 shadow-xs">
                  <Clock className="w-6 h-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                    Jam Layanan Kantor
                  </span>
                  <p className="text-sm font-bold text-slate-900 mt-0.5">
                    Senin – Sabtu: 07.30 – 14.30 WIB
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Hari Ahad &amp; Libur Nasional: Tutup (Layanan Online via WA tetap aktif)
                  </p>
                </div>
              </div>

              {/* Rekening Resmi Box */}
              <div className="p-5 rounded-2xl bg-gradient-to-r from-[#030164] to-[#0c0879] text-white space-y-2">
                <div className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-[#ffd51e]" />
                  <span className="text-xs font-bold text-[#ffd51e] uppercase tracking-wider">
                    Rekening Resmi Bank Muamalat
                  </span>
                </div>
                <h4 className="text-xl font-extrabold text-white">
                  1360012405
                </h4>
                <p className="text-xs text-blue-200">
                  Atas Nama: <strong className="text-white">SMP IT Al Afiyah</strong>
                </p>
                <p className="text-[11px] text-blue-300 pt-1 border-t border-white/10">
                  Seluruh pembayaran infaq pendaftaran dan daftar ulang hanya valid jika disalurkan ke rekening resmi di atas.
                </p>
              </div>

              {/* Media Sosial */}
              <div className="pt-2 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">Instagram Resmi:</span>
                  <a href="https://instagram.com/smpitalafiyahmjl" target="_blank" rel="noopener noreferrer" className="font-bold text-[#030164] hover:underline">
                    @smpitalafiyahmjl
                  </a>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">Facebook &amp; YouTube:</span>
                  <span className="font-bold text-slate-800">SMP IT Al Afiyah</span>
                </div>
              </div>
            </div>
          </div>

          {/* Form Konsultasi / Pesan Column */}
          <div className="lg:col-span-6 space-y-6">
            <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-sm">
              <div className="mb-6">
                <span className="text-xs font-bold text-[#030164] uppercase tracking-widest">
                  Formulir Konsultasi
                </span>
                <h3 className="text-2xl font-bold text-slate-900 mt-1">
                  Kirim Pesan ke Tata Usaha
                </h3>
                <p className="text-xs text-slate-600 mt-1">
                  Silakan tinggalkan pesan untuk pertanyaan seputar biaya SPMB, observasi santri, atau agenda kunjungan.
                </p>
              </div>

              <ContactFormClient defaultSchoolSlug="smp" />
            </div>
          </div>

        </div>

        {/* Google Maps Embed Section */}
        <section className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-[#030164]" />
              <h4 className="text-base font-bold text-slate-900">
                Peta Lokasi SMP IT Al-Afiyah Majalengka (Lingkungan Giri Asih)
              </h4>
            </div>
            <a
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-bold text-[#030164] hover:underline inline-flex items-center gap-1"
            >
              <span>Buka di Google Maps</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          <div className="rounded-2xl overflow-hidden border border-slate-200 h-[360px] bg-slate-100">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3961.853245465249!2d108.2255767!3d-6.836184!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e6f2f211516e45b%3A0xc3160a0a95ad9457!2sJl.%20Gerakan%20Koperasi%20No.110%2C%20Majalengka%20Wetan%2C%20Kec.%20Majalengka%2C%20Kabupaten%20Majalengka%2C%20Jawa%20Barat%2045411!5e0!3m2!1sid!2sid!4v1700000000000!5m2!1sid!2sid"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen={false}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Peta Lokasi SMP IT Al-Afiyah"
            />
          </div>
        </section>
      </main>

      <Footer schoolSlug="smp" />
      <StickyMobileBar schoolSlug="smp" />
    </div>
  );
}
