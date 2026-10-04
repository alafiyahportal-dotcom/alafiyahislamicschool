import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import StickyMobileBar from '@/components/layout/StickyMobileBar';
import { 
  Building2, 
  Target, 
  Award, 
  CheckCircle2, 
  Users, 
  BookOpen, 
  Compass, 
  ShieldCheck, 
  ArrowRight,
  HeartHandshake,
  Layers,
  GraduationCap
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Profil Yayasan Pendidikan Imam Bonjol | Pesantren Islam Terpadu Al-Afiyah Majalengka',
  description: 'Sejarah, Visi Misi, Dewan Pembina, 7 Karakter Lulusan, Fasilitas Sekolah, dan Legalitas Resmi Yayasan Pendidikan Imam Bonjol & Al-Afiyah Majalengka.',
};

export default function ProfilPage() {
  const milestones = [
    {
      year: '2012',
      title: 'Prakarsa & Pendirian Yayasan',
      desc: 'Yayasan Pendidikan Imam Bonjol didirikan oleh para asatidzah dan tokoh ummat di Majalengka dengan cita-cita mulia menghadirkan pendidikan Islam berbasis adab dan Al-Qur’an yang terjangkau bagi masyarakat.',
    },
    {
      year: '2015',
      title: 'Lahirnya Unit PAUD / TK IT Al-Afiyah',
      desc: 'Pembukaan satuan pendidikan usia dini dengan metode pembelajaran sentra dan tahfidz juz 30 anak, menanamkan kecintaan ibadah sejak usia balita.',
    },
    {
      year: '2018',
      title: 'Pembangunan Kampus & SD IT Al-Afiyah',
      desc: 'Ekspansi pendidikan ke jenjang dasar (SD IT) di lahan terpadu Babakan Jawa Majalengka dengan integrasi kurikulum nasional dan kurikulum keislaman komprehensif.',
    },
    {
      year: '2021',
      title: 'Pembukaan SMP IT Al-Afiyah',
      desc: 'Merespons aspirasi orang tua murid, unit SMP IT Full Day School diresmikan dengan fokus program Mutqin Tahfidz 30 Juz bersanad dan penguasaan sains modern.',
    },
    {
      year: '2024 - 2026',
      title: 'Transformasi Ekosistem Digital Terpadu',
      desc: 'Implementasi platform administrasi terpusat, ujian digital, pelaporan setoran hafalan wali murid real-time, dan kemitraan pendidikan lintas nusantara.',
    },
  ];

  const karakterLulusan = [
    {
      no: '01',
      title: 'Salimul Aqidah',
      sub: 'Aqidah yang Lurus & Murni',
      desc: 'Memahami tauhid dan keimanan berdasarkan Al-Qur’an dan Sunnah shahihah, terbebas dari khurafat, takhayul, dan kesyirikan.',
    },
    {
      no: '02',
      title: 'Shahihul Ibadah',
      sub: 'Ibadah Sesuai Sunnah',
      desc: 'Melaksanakan sholat fardhu berjamaah, tilawah harian, shaum sunnah, dan thaharah dengan tata cara yang dicontohkan Rasulullah ﷺ.',
    },
    {
      no: '03',
      title: 'Matinul Khuluq',
      sub: 'Akhlak yang Kokoh & Santun',
      desc: 'Berbakti kepada orang tua (birrul walidain), tawadhu’ kepada guru, menghargai sesama, dan menjaga tutur kata yang bernilai.',
    },
    {
      no: '04',
      title: 'Qadirun ‘Alal Kasbi',
      sub: 'Mandiri & Berjiwa Wirausaha',
      desc: 'Mampu mengurus diri sendiri, menghargai nilai kerja keras, dan memiliki dasar keterampilan hidup (life skills) serta kemandirian.',
    },
    {
      no: '05',
      title: 'Mutsaqqoful Fikr',
      sub: 'Wawasan Intelektual Luas',
      desc: 'Cerdas dalam penalaran sains, melek teknologi informasi, gemar membaca (iqra’), dan kritis dalam memecahkan persoalan.',
    },
    {
      no: '06',
      title: 'Qawiyyul Jismi',
      sub: 'Fisik Tangguh & Sehat',
      desc: 'Menjaga stamina, pola makan halal-thayyib, kebersihan diri dan lingkungan, serta aktif berolahraga sunnah (memanah, renang, bela diri).',
    },
    {
      no: '07',
      title: 'Nafi’un Lighairihi',
      sub: 'Bermanfaat Bagi Ummat',
      desc: 'Memiliki kepedulian sosial yang tinggi, ringan berbagi zakat/infaq, serta aktif dalam dakwah dan kemaslahatan masyarakat sekitar.',
    },
  ];

  const dewanPengurus = [
    {
      name: 'Ustadz H. Abdul Wahid, Lc., M.Ag.',
      role: 'Ketua Dewan Pembina Yayasan',
      origin: 'Alumni Universitas Islam Madinah KSA',
    },
    {
      name: 'Dr. H. Ahmad Fauzi, M.Pd.',
      role: 'Ketua Umum Yayasan Pendidikan Imam Bonjol',
      origin: 'Pakar Manajemen Pendidikan Islam',
    },
    {
      name: 'Ustadz Muhammad Ridwan, S.Pd.I., Al-Hafizh',
      role: 'Mudir Ma’had & Pengasuh Pesantren Al-Afiyah',
      origin: 'Pemegang Sanad Tahfidz Qira’ah ‘Ashim',
    },
    {
      name: 'Hj. Siti Mariyam, S.Psi., M.Pd.',
      role: 'Koordinator Kurikulum & Mutu Pembelajaran',
      origin: 'Praktisi Parenting & Psikologi Anak',
    },
  ];

  const saranaFasilitas = [
    {
      title: 'Masjid Jami’ Al-Afiyah',
      desc: 'Pusat spiritual berkapasitas 800 jamaah dengan karpet shaf premium, pendingin ruangan, dan tata suara ramah tilawah.',
      tag: 'Spiritual Center',
    },
    {
      title: 'Ruang Belajar & Rest Area Full Day',
      desc: 'Ruang istirahat dan makan siang representatif, loker pribadi murid, serta lingkungan bersih penunjang kenyamanan belajar hingga sore.',
      tag: 'Full Day Facilities',
    },
    {
      title: 'Laboratorium Sains & Komputer',
      desc: 'Dilengkapi perangkat PC modern, koneksi internet serat optik tersaring, serta instrumen praktikum fisika/biologi.',
      tag: 'Smart Lab',
    },
    {
      title: 'Perpustakaan & Pojok Baca Digital',
      desc: 'Koleksi ratusan kitab rujukan Islam klasik, ensiklopedia sains anak, dan akses e-library berbasis tablet pintar.',
      tag: 'Library Center',
    },
    {
      title: 'Sarana Olahraga Terpadu',
      desc: 'Lapangan futsal, area panahan standar perpani, matras bela diri, dan playground ramah anak usia dini.',
      tag: 'Sport Complex',
    },
    {
      title: 'Klinik & Ruang UKS Nyaman',
      desc: 'Pemeriksaan kesehatan preventif berkala, obat-obatan P3K lengkap, dan kerja sama rujukan puskesmas setempat.',
      tag: 'Health Clinic',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] text-slate-800 font-sans selection:bg-amber-200 selection:text-amber-950">
      <Navbar />

      {/* Hero Header */}
      <section className="relative bg-gradient-to-br from-[#123E38] via-[#184F48] to-[#256D63] text-white pt-28 sm:pt-36 lg:pt-40 pb-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10 text-center">
          <p className="font-arabic text-xl sm:text-2xl text-amber-300 mb-3 tracking-wide drop-shadow-sm">
            بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ • تَعْرِيفُ المَعْهَدِ
          </p>
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-emerald-200 text-xs font-semibold uppercase tracking-wider mb-5">
            <GraduationCap className="w-3.5 h-3.5 text-amber-300" />
            <span>Profil Resmi Lembaga</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight max-w-4xl mx-auto">
            Membangun Generasi Qur’ani, Mandiri &amp; Berwawasan Global
          </h1>
          <p className="mt-4 text-base sm:text-lg text-emerald-100/90 max-w-3xl mx-auto leading-relaxed">
            Yayasan Pendidikan Imam Bonjol menaungi TK IT, SD IT, dan SMP IT Al-Afiyah di Kabupaten Majalengka — memadukan kemurnian aqidah, keluhuran adab, dan keunggulan sains masa depan.
          </p>

          {/* Quick Metrics Bar */}
          <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-4 text-center">
              <div className="text-2xl sm:text-3xl font-black text-amber-300">2014</div>
              <div className="text-xs text-emerald-100 mt-1">Tahun Pendirian</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-4 text-center">
              <div className="text-2xl sm:text-3xl font-black text-amber-300">3 Unit</div>
              <div className="text-xs text-emerald-100 mt-1">TK IT, SD IT &amp; SMP IT</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-4 text-center">
              <div className="text-2xl sm:text-3xl font-black text-amber-300">30 Juz</div>
              <div className="text-xs text-emerald-100 mt-1">Target Mutqin Bersanad</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-4 text-center">
              <div className="text-2xl sm:text-3xl font-black text-amber-300">1.200+</div>
              <div className="text-xs text-emerald-100 mt-1">Alumni &amp; Murid Aktif</div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16 -mt-8 relative z-20">

        {/* Section 1: Sejarah & Perjalanan Lembaga */}
        <section className="bg-white rounded-3xl p-6 sm:p-10 shadow-sm border border-slate-200/80">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-8 border-b border-slate-100">
            <div>
              <div className="inline-flex items-center space-x-2 text-xs font-bold text-[#184F48] uppercase tracking-wider mb-2">
                <Compass className="w-4 h-4 text-[#2D7A70]" />
                <span>Kilas Jejak &amp; Latar Belakang</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                Sejarah Perjalanan Yayasan
              </h2>
            </div>
            <p className="text-sm text-slate-500 max-w-md">
              Dari komitmen menghadirkan bimbingan tilawah Al-Qur’an rumah ke rumah hingga bertumbuh menjadi ekosistem pendidikan Islam berizin resmi di Majalengka.
            </p>
          </div>

          <div className="mt-10 relative">
            {/* Vertical timeline line */}
            <div className="absolute left-4 sm:left-8 top-4 bottom-4 w-0.5 bg-gradient-to-b from-[#184F48] via-[#2D7A70] to-emerald-200 hidden sm:block" />

            <div className="space-y-8">
              {milestones.map((m, idx) => (
                <div key={idx} className="relative sm:pl-16 flex flex-col sm:flex-row items-start gap-4">
                  {/* Pin Dot */}
                  <div className="hidden sm:flex absolute left-6 top-1 -translate-x-1/2 w-5 h-5 rounded-full bg-white border-4 border-[#184F48] shadow-sm items-center justify-center" />
                  
                  <div className="bg-[#F8FAFB] hover:bg-emerald-50/50 transition-colors p-5 sm:p-6 rounded-2xl border border-slate-200/70 w-full">
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="px-3 py-1 bg-[#184F48] text-white text-xs font-bold rounded-lg tracking-wider">
                        {m.year}
                      </span>
                      <span className="text-xs text-slate-400 font-medium">Torehan Prestasi</span>
                    </div>
                    <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-1.5">
                      {m.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      {m.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Section 2: Visi & Misi */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Visi Card */}
          <div className="lg:col-span-5 bg-gradient-to-br from-[#184F48] to-[#0F3732] text-white rounded-3xl p-8 sm:p-10 flex flex-col justify-between shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-2xl pointer-events-none" />
            <div>
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/10 text-amber-300 text-xs font-bold uppercase tracking-wider mb-6">
                <Target className="w-4 h-4" />
                <span>Visi Utama Lembaga</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold leading-relaxed mb-4 text-emerald-50">
                “Menjadi Pusat Keunggulan Pendidikan Islam Terpadu yang Melahirkan Generasi Qur’ani, Beradab Mulia, Unggul dalam Sains &amp; Berdaya Saing Global.”
              </h3>
              <p className="text-xs sm:text-sm text-emerald-100/80 leading-relaxed">
                Visi ini menjadi kompas seluruh aktivitas akademik, pembinaan karakter murid, kurikulum pengajaran, serta interaksi harian keluarga besar Yayasan Pendidikan Imam Bonjol Al-Afiyah.
              </p>
            </div>

            <div className="pt-8 border-t border-white/15 flex items-center justify-between text-xs text-emerald-200">
              <span>Kurikulum Terpadu Kemenag &amp; Kemdikbud</span>
              <ShieldCheck className="w-5 h-5 text-amber-300" />
            </div>
          </div>

          {/* Misi Cards */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-10 shadow-sm border border-slate-200/80">
            <div className="inline-flex items-center space-x-2 text-xs font-bold text-[#184F48] uppercase tracking-wider mb-2">
              <Layers className="w-4 h-4 text-[#2D7A70]" />
              <span>Langkah Nyata</span>
            </div>
            <h2 className="text-2xl font-extrabold text-slate-900 mb-6">
              Misi Strategis Pendidikan
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-[#F8FAFB] border border-slate-200/70 space-y-2">
                <div className="w-8 h-8 rounded-lg bg-[#E8F3F1] text-[#184F48] flex items-center justify-center font-bold text-sm">
                  1
                </div>
                <h4 className="text-sm font-bold text-slate-900">Pendidikan Karakter &amp; Adab</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Menanamkan aqidah salimah dan akhlakul karimah melalui keteladanan pendidik dan pembiasaan sunnah harian.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[#F8FAFB] border border-slate-200/70 space-y-2">
                <div className="w-8 h-8 rounded-lg bg-[#E8F3F1] text-[#184F48] flex items-center justify-center font-bold text-sm">
                  2
                </div>
                <h4 className="text-sm font-bold text-slate-900">Tahfidz Al-Qur’an Mutqin</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Membimbing murid menghafal Al-Qur’an dengan kaidah tajwid, makharijul huruf yang fasih, serta pemahaman makna ayat.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[#F8FAFB] border border-slate-200/70 space-y-2">
                <div className="w-8 h-8 rounded-lg bg-[#E8F3F1] text-[#184F48] flex items-center justify-center font-bold text-sm">
                  3
                </div>
                <h4 className="text-sm font-bold text-slate-900">Keunggulan Akademik &amp; Bahasa</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Memadukan penguasaan matematika, sains eksperimen, literasi digital, serta komunikasi aktif Bahasa Arab &amp; Inggris.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[#F8FAFB] border border-slate-200/70 space-y-2">
                <div className="w-8 h-8 rounded-lg bg-[#E8F3F1] text-[#184F48] flex items-center justify-center font-bold text-sm">
                  4
                </div>
                <h4 className="text-sm font-bold text-slate-900">Kemandirian &amp; Jiwa Kepemimpinan</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Melatih kedisiplinan belajar full day, tanggung jawab pribadi, kepedulian sosial, dan jiwa entrepreneurship murid.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Section 3: 7 Karakter Utama Lulusan */}
        <section className="bg-white rounded-3xl p-6 sm:p-10 shadow-sm border border-slate-200/80">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="inline-flex items-center space-x-2 text-xs font-bold text-[#184F48] uppercase tracking-wider mb-2">
              <Award className="w-4 h-4 text-[#2D7A70]" />
              <span>Standar Kompetensi &amp; Output</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              7 Karakter Utama Lulusan Al-Afiyah
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-slate-600">
              Setiap murid dibimbing secara terstruktur agar memiliki profil kepribadian muslim ideal yang siap menghadapi tantangan zaman.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {karakterLulusan.map((k, idx) => (
              <div 
                key={idx} 
                className={`p-6 rounded-2xl border transition-all duration-300 hover:shadow-md ${
                  idx === 0 
                    ? 'bg-gradient-to-br from-[#184F48]/5 to-transparent border-[#184F48]/30' 
                    : 'bg-[#FAFDFD] border-slate-200/70 hover:border-[#184F48]/30'
                }`}
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-black text-[#184F48] bg-[#E8F3F1] px-2.5 py-1 rounded-md">
                    {k.no}
                  </span>
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-1">
                  {k.title}
                </h3>
                <h4 className="text-xs font-semibold text-[#2D7A70] mb-2">
                  {k.sub}
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {k.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Section 4: Pimpinan & Dewan Pembina */}
        <section className="bg-white rounded-3xl p-6 sm:p-10 shadow-sm border border-slate-200/80">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-8 border-b border-slate-100">
            <div>
              <div className="inline-flex items-center space-x-2 text-xs font-bold text-[#184F48] uppercase tracking-wider mb-2">
                <Users className="w-4 h-4 text-[#2D7A70]" />
                <span>Asatidzah &amp; Pengurus</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                Pimpinan &amp; Dewan Pembina
              </h2>
            </div>
            <p className="text-sm text-slate-500 max-w-md">
              Didukung oleh para pendidik bersanad, akademisi berpengalaman, dan praktisi pendidikan yang berdedikasi membimbing para murid.
            </p>
          </div>

          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {dewanPengurus.map((p, idx) => (
              <div key={idx} className="p-5 rounded-2xl bg-[#F8FAFB] border border-slate-200/70 text-center space-y-3">
                <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-tr from-[#184F48] to-[#2D7A70] text-white flex items-center justify-center font-bold text-xl shadow-sm">
                  {p.name.charAt(0)}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 leading-snug">
                    {p.name}
                  </h4>
                  <p className="text-xs font-semibold text-[#184F48] mt-1">
                    {p.role}
                  </p>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    {p.origin}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Section 5: Sarana & Fasilitas Sekolah */}
        <section className="bg-white rounded-3xl p-6 sm:p-10 shadow-sm border border-slate-200/80">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <div className="inline-flex items-center space-x-2 text-xs font-bold text-[#184F48] uppercase tracking-wider mb-2">
              <Building2 className="w-4 h-4 text-[#2D7A70]" />
              <span>Lingkungan Belajar Asri &amp; Nyaman</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Sarana &amp; Fasilitas Sekolah Terpadu
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-slate-600">
              Dirancang untuk menunjang keamanan, kebersihan, kenyamanan konsentrasi hafalan, serta kesehatan murid selama menuntut ilmu.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {saranaFasilitas.map((f, idx) => (
              <div key={idx} className="p-6 rounded-2xl bg-[#F7FBFB] border border-[#D4EBE7]/70 hover:shadow-md transition-all space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#184F48] bg-[#E8F3F1] px-2 py-0.5 rounded">
                  {f.tag}
                </span>
                <h3 className="text-base font-bold text-slate-900 pt-1">
                  {f.title}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Section 6: Legalitas & Akreditasi */}
        <section className="bg-gradient-to-r from-slate-900 to-[#12302C] text-white rounded-3xl p-8 sm:p-10 shadow-lg">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="space-y-4 max-w-2xl">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/10 text-emerald-300 text-xs font-bold uppercase tracking-wider">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Legalitas Resmi &amp; Terpercaya</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold leading-snug text-white">
                Legalitas Badan Hukum &amp; Izin Operasional
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Yayasan Pendidikan Imam Bonjol dan seluruh unit pendidikan (TK IT, SD IT, SMP IT Al-Afiyah) memiliki akta notaris resmi, SK Kemenkumham RI, Nomor Pokok Sekolah Nasional (NPSN), serta izin operasional dari Dinas Pendidikan dan Kemenag Kabupaten Majalengka.
              </p>
              <div className="pt-2 flex flex-wrap gap-3 text-xs text-slate-300">
                <span className="px-3 py-1.5 bg-white/10 rounded-lg border border-white/10">SK Kemenkumham RI Terdaftar</span>
                <span className="px-3 py-1.5 bg-white/10 rounded-lg border border-white/10">NPSN Resmi Kemdikbud</span>
                <span className="px-3 py-1.5 bg-white/10 rounded-lg border border-white/10">Terakreditasi BAN-S/M</span>
              </div>
            </div>

            <div className="flex-shrink-0 text-center lg:text-right space-y-3">
              <Link 
                href="/ppdb" 
                className="inline-flex items-center space-x-2 px-6 py-3.5 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-950 font-bold text-sm shadow-md transition-all"
              >
                <span>Daftar Murid Baru (PPDB)</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <p className="text-[11px] text-slate-400">
                Konsultasi &amp; kunjungan kampus: <Link href="/kontak" className="text-emerald-400 underline hover:text-emerald-300">Hubungi Kami</Link>
              </p>
            </div>
          </div>
        </section>

      </main>

      <Footer />
      <StickyMobileBar />
    </div>
  );
}
