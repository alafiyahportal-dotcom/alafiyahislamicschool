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
  GraduationCap, 
  Baby, 
  School, 
  ExternalLink,
  ShieldCheck,
  Headphones
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Kontak & Sekretariat Lingkungan Sekolah Al-Afiyah | Yayasan Pendidikan Imam Bonjol',
  description: 'Alamat lengkap, nomor telepon, WhatsApp konsultasi PPDB, jam operasional kantor, dan peta lokasi sekolah terpadu Al-Afiyah di Babakan Jawa, Majalengka.',
};

export default function KontakPage() {
  const contactChannels = [
    {
      title: 'Hotline PPDB Terpadu',
      number: '+62 812-2334-4552',
      desc: 'Informasi umum, pendaftaran murid baru, jadwal observasi dan tes.',
      link: 'https://wa.me/6281223344552?text=Bismillah,%20saya%20ingin%20konsultasi%20PPDB%20Al-Afiyah',
      cta: 'Chat WhatsApp',
      badge: 'Respon Cepat',
    },
    {
      title: 'Layanan Unit TK IT',
      number: '+62 853-1122-3341',
      desc: 'Konsultasi kurikulum sentra, trial class usia dini, dan parenting balita.',
      link: 'https://wa.me/6281223344552?text=Bismillah,%20konsultasi%20TK%20IT%20Al-Afiyah',
      cta: 'Hubungi TK IT',
      badge: 'PAUD/TK',
    },
    {
      title: 'Layanan SPMB SD IT',
      number: '+62 895-3222-26104',
      desc: 'Konsultasi kurikulum dasar, Smart Akhlaq Fitrah, dan pendaftaran murid baru (SPMB).',
      link: 'https://wa.me/62895322226104?text=Assalamu%27alaikum%20Panitia%20SPMB%20SDIT%20Al-Afiyah,%20saya%20ingin%20konsultasi%20pendaftaran',
      cta: 'Hubungi SD IT',
      badge: 'Sekolah Dasar',
    },
    {
      title: 'Layanan Unit SMP IT',
      number: '+62 853-1122-3343',
      desc: 'Konsultasi Full Day School, program mutqin tahfidz, dan beasiswa.',
      link: 'https://wa.me/6281223344552?text=Bismillah,%20konsultasi%20SMP%20IT%20Al-Afiyah',
      cta: 'Hubungi SMP IT',
      badge: 'SMP IT',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] text-slate-800 font-sans selection:bg-amber-200 selection:text-amber-950">
      <Navbar />

      {/* Hero Header */}
      <section className="relative bg-gradient-to-br from-[#123E38] via-[#184F48] to-[#256D63] text-white pt-16 pb-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10 text-center">
          <p className="font-arabic text-xl sm:text-2xl text-amber-300 mb-3 tracking-wide drop-shadow-sm">
            التَّوَاصُلُ وَالاسْتِعْلَامَاتُ
          </p>
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-emerald-200 text-xs font-semibold uppercase tracking-wider mb-5">
            <Headphones className="w-3.5 h-3.5 text-amber-300" />
            <span>Pusat Informasi &amp; Layanan Wali Murid</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight max-w-4xl mx-auto">
            Kontak &amp; Sekretariat Lingkungan Sekolah Al-Afiyah
          </h1>
          <p className="mt-4 text-base sm:text-lg text-emerald-100/90 max-w-2xl mx-auto leading-relaxed">
            Kami siap melayani kebutuhan informasi pendaftaran murid baru, jadwal kunjungan survei sekolah, serta konsultasi pendidikan ananda tercinta.
          </p>
        </div>
      </section>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12 -mt-8 relative z-20">

        {/* 4 Directory Cards */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {contactChannels.map((c, idx) => (
            <div
              key={idx}
              className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/80 hover:border-[#184F48]/40 hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <span className="px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-[#E8F3F1] text-[#184F48]">
                  {c.badge}
                </span>
                <h3 className="text-base font-bold text-slate-900 mt-3 mb-1">
                  {c.title}
                </h3>
                <p className="text-xs text-slate-500 mb-3 leading-relaxed">
                  {c.desc}
                </p>
                <div className="text-sm font-black text-slate-800 tracking-tight font-mono mb-4">
                  {c.number}
                </div>
              </div>

              <a
                href={c.link}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full text-center py-2 px-3 rounded-xl bg-[#184F48] hover:bg-[#123E38] text-white text-xs font-bold transition-colors inline-flex items-center justify-center space-x-1.5"
              >
                <span>{c.cta}</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          ))}
        </section>

        {/* Main Grid: Contact Form & Campus Information */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Form Column */}
          <div className="lg:col-span-7">
            <ContactFormClient />
          </div>

          {/* Location & Info Column */}
          <div className="lg:col-span-5 space-y-6">
            {/* Campus Address & Hours Card */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200/80 space-y-6">
              <div>
                <div className="inline-flex items-center space-x-2 text-xs font-bold text-[#184F48] uppercase tracking-wider mb-2">
                  <MapPin className="w-4 h-4 text-[#2D7A70]" />
                  <span>Lokasi Sekolah Terpadu</span>
                </div>
                <h3 className="text-lg font-bold text-slate-900">
                  Sekretariat Pusat Yayasan
                </h3>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  Kompleks Pendidikan Islam Imam Bonjol, Babakan Jawa, Kec. Majalengka, Kabupaten Majalengka, Jawa Barat 45419.
                </p>
              </div>

              {/* Operating Hours */}
              <div className="p-4 rounded-2xl bg-[#F8FAFB] border border-slate-200/70 space-y-2">
                <div className="flex items-center space-x-2 text-xs font-bold text-slate-800">
                  <Clock className="w-4 h-4 text-[#184F48]" />
                  <span>Jam Pelayanan Kantor:</span>
                </div>
                <ul className="text-xs text-slate-600 space-y-1 pl-6 list-disc">
                  <li>Senin – Kamis: 07.30 – 15.30 WIB</li>
                  <li>Jum’at: 07.30 – 11.30 &amp; 13.30 – 15.30 WIB</li>
                  <li>Sabtu: 08.00 – 13.00 WIB</li>
                  <li>Ahad &amp; Hari Libur: Layanan Janji Temu / Online</li>
                </ul>
              </div>

              {/* Quick Details */}
              <div className="space-y-3 text-xs text-slate-600 pt-2 border-t border-slate-100">
                <div className="flex items-center space-x-3">
                  <Mail className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>Email: <strong className="text-slate-800">info@alafiyah.sch.id</strong></span>
                </div>
                <div className="flex items-center space-x-3">
                  <Building2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>Legalitas: <strong className="text-slate-800">SK Kemenkumham RI Terdaftar</strong></span>
                </div>
              </div>
            </div>

            {/* Interactive Direction Link Card */}
            <div className="bg-gradient-to-br from-[#184F48] to-[#0E3530] text-white rounded-3xl p-6 sm:p-8 shadow-md relative overflow-hidden">
              <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full blur-2xl pointer-events-none" />
              <div className="space-y-3 relative z-10">
                <span className="px-3 py-1 rounded-full bg-white/10 text-amber-300 text-xs font-bold uppercase tracking-wider inline-block">
                  Akses Google Maps
                </span>
                <h4 className="text-lg font-bold text-white">
                  Rute Menuju Lingkungan Sekolah Al-Afiyah
                </h4>
                <p className="text-xs text-emerald-100/80 leading-relaxed">
                  Lokasi kampus mudah dijangkau dari pusat kota Majalengka, dekat dengan sarana umum, serta memiliki area parkir luas dan aman bagi penjemputan murid.
                </p>
                <div className="pt-2">
                  <a
                    href="https://maps.google.com/?q=Majalengka+Jawa+Barat"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-white text-[#184F48] text-xs font-bold hover:bg-emerald-50 transition-colors shadow-sm"
                  >
                    <span>Buka Petunjuk Arah</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

      </main>

      <Footer />
      <StickyMobileBar />
    </div>
  );
}
