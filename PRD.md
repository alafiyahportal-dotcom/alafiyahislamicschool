# PRODUCT REQUIREMENT DOCUMENT (PRD) EKSEKUTIF & TEKNIS
# Platform Ekosistem Pendidikan Terpadu Multi-Tenant Al-Afiyah
**Institusi Pengelola:** Yayasan Pendidikan Imam Bonjol Majalengka  
**Unit Sekolah:** TK IT Al-Afiyah | SD IT Al-Afiyah | SMP IT Al-Afiyah  
**Prinsip Desain:** *Unified Super Premium Enterprise Design System (Satu Model Tata Letak Mewah Berstandar Dunia dengan Aksen Identitas Khas Tiap Unit)*  
**Gaya Panel Admin & CMS:** *Clean Minimalist Modern ala Google Workspace (Ruang Lapang, Border Subtil 1px, Tipografi Tajam, Bebas Ornamen Artifisial)*  
**Arsitektur Data Dev:** *Multi-Tenant Logical Isolation via Prisma ORM (SQLite lokal tersemat untuk dev instan, 100% siap dialihkan ke PostgreSQL untuk rilis produksi)*  
**Versi Dokumen:** 3.20.0-DEFINITIVE (Penyelarasan Komprehensif Pratinjau Live CMS SD, Desain Otentik Bento Grid & SPMB, serta Eliminasi Kekosongan Tab 9 & 10)  
**Status:** Disetujui sebagai Acuan Baku Pengembangan

---

## Riwayat Perubahan & Revisi Dokumen (Change Log)

| Versi | Tanggal | Inisiator | Ringkasan Revisi & Perubahan Teknis |
| :---: | :---: | :---: | :--- |
| **v1.0.0** | 17 Sep 2026 | User / AI Lead | Inisiasi awal PRD multi-tenant (Playful TK, Vibrant SD, Elegant SMP). |
| **v1.1.0** | 17 Sep 2026 | User Directive | Penyeragaman tata letak: Unified Design System dengan perbedaan aksen subtil. |
| **v1.2.0** | 17 Sep 2026 | User Directive | Penambahan tabel pelacak status Sprint 1 (Belum, Proses, Selesai). |
| **v1.3.0** | 17 Sep 2026 | User Directive | Penetapan standar dasbor admin & CMS Clean Minimalist ala Google Workspace. |
| **v2.0.0** | 17 Sep 2026 | Architecture Lead | Perluasan komprehensif spesifikasi modul, skema ERD Prisma, & RBAC. |
| **v2.1.0** | 17 Sep 2026 | User Directive | Klausul wajib Standar Kualitas Super Premium UI/UX & Mobile Ergonomics. |
| **v2.2.0** | 17 Sep 2026 | User Directive | Arsitektur Corong Konversi, Alur PPDB, Alur Afiliasi, & Matriks Strategi CTA. |
| **v2.3.0** | 17 Sep 2026 | User Directive | Integrasi Gaya Desain Visual EduLearn (Warm Ivory Canvas, Bento Chalk Doodles, Brush Highlights, Student Portraits) & Token Fleksibel. |
| **v2.4.0** | 17 Sep 2026 | User Directive | Implementasi Havenly Luxury Aesthetic (Warm Espresso/Amber Hero Glow, Interactive Mood/Goals Card, & Smooth Animated Radial Arch Carousel dengan Framer Motion). |
| **v2.5.0** | 17 Sep 2026 | User Directive | Spesifikasi Wajib Navigasi Navbar Terhubung Utuh (Semua menu aktif dan berpindah ke rute masing-masing) & Pengujian Warna Hijau Mowilex 1C-5D4 Soft Water. |
| **v2.6.0** | 17 Sep 2026 | User Directive / Lead | Implementasi Penuh Konsol Seleksi PPDB (/admin/:slug/ppdb) & Manajemen Keuangan (/admin/:slug/finance & /admin/foundation/finance), Penyempurnaan Cetak Kartu Ujian & Kelulusan Portal Peserta Didik, serta Verifikasi Build 100% Bebas Error. |
| **v2.7.0** | 17 Sep 2026 | User Directive / Lead | Peluncuran Fitur Ekspor CSV Pendaftar PPDB, Rekonsiliasi Tagihan & Komisi Afiliasi (UTF-8 BOM), serta Konsol Audit Notifikasi WhatsApp Real-Time (/admin/foundation/notifications). |
| **v2.8.0** | 17 Sep 2026 | User Directive / Lead | Peluncuran Modul Dewan Asatidz (/admin/:slug/teachers & TeacherManagerClient), Kanal Berita Kegiatan (/admin/:slug/news & NewsManagerClient), API Route relasional Prisma, dan Showcase Dinamis Super Premium pada Landing Page Unit TK, SD, SMP. |
| **v2.9.0** | 17 Sep 2026 | User Directive / Lead | Peluncuran Panel Sentral Superadmin Yayasan (/admin/foundation/settings & FoundationSettingsClient), Pengaturan Target Kuota & Buka/Tutup Gelombang PPDB, Tarif Formulir Terintegrasi Midtrans, Rekening Kas Yayasan Terpusat, serta Validasi Kapasitas Pendaftaran Peserta Didik. |
| **v2.10.0** | 17 Sep 2026 | User Directive / Lead | Peluncuran Modul Dokumen Resmi Peserta Didik (Milestone 14): Surat Keputusan (SK) Kelulusan Kop Surat Yayasan dengan Stempel Basah Digital, Kartu Tanda Peserta Ujian/Observasi dengan QR Code Verifikasi, Kuitansi Pembayaran Digital Kas Masuk (Lunas), serta Integrasi Cetak Kasir Tata Usaha. |
| **v2.11.0** | 17 Sep 2026 | User Directive / Lead | Peluncuran Dasbor Analitik & Corong Konversi PPDB Terpadu (/admin/foundation/analytics - M15) dan Konsol Manajemen Hak Akses Pengguna Staf RBAC (/admin/foundation/users - M16) dengan cetak laporan eksekutif yayasan A4 serta 40 rute Next.js terkompilasi bersih. |
| **v2.12.0** | 17 Sep 2026 | User Directive / Lead | Peluncuran Sistem Unggah Berkas Fisik Persisten & Viewer Dokumen Panitia PPDB Resolusi Tinggi (/api/upload, /public/uploads/ppdb/, DocumentViewerModal - M17) dan Pusat Konsultasi Cerdas & Helpdesk WhatsApp Multi-Unit Interaktif (/layout.tsx, HelpdeskChatWidget - M18) dengan 42 rute Next.js 16 terkompilasi bersih. |
| **v2.13.0** | 17 Sep 2026 | User Directive / Lead | Peluncuran Portal Perbaikan Berkas Mandiri Wali Peserta Didik (/portal/ppdb/[regNo], PortalDocumentStatusList, /api/portal/documents/[id] - M19) serta Arsitektur Migrasi Cloud PostgreSQL, Docker Compose, .env.example & SOP Rilis Produksi (DEPLOYMENT.md - M20). |
| **v2.14.0** | 17 Sep 2026 | User Directive / Lead | Peluncuran Pelacak Cepat Status PPDB (/ppdb/cek-status, /api/ppdb/check-status - M21), Reduksi Hambatan Formulir Pendaftaran Peserta Didik Anti-Ribet, dan Kartu Tanda Peserta Didik (KTS) Digital Standar ISO/IEC 7810 ID-1 (StudentIdCardModal - M22). |
| **v2.15.0** | 18 Sep 2026 | User Directive / Lead | Peluncuran Papan Pengumuman Hasil Seleksi PPDB Publik (/ppdb/pengumuman, /api/ppdb/announcements - M23) dan Pusat Siaran Notifikasi Massal WhatsApp Broadcast Center (/admin/foundation/broadcast, /api/admin/broadcast - M24). |
| **v2.16.0** | 18 Sep 2026 | User Directive / Lead | Peluncuran Lembar Formulir Pendaftaran Fisik Resmi A4 Cetak (F-PPDB - M25) dan Kalender Agenda Akademik & Jadwal Seleksi Terpadu Multi-Unit (/agenda, /api/agenda, iCalendar .ics export - M26). |
| **v2.17.0** | 18 Sep 2026 | User Directive / Lead | Peluncuran Formulir Daftar Ulang & Pengukuran Seragam Online Peserta Didik (/portal/ppdb/[regNo]/daftar-ulang, /api/portal/re-registration - M27) dan Konsol Monitoring Logistik Seragam & Ekspor Konveksi CSV (/admin/:schoolSlug/re-registration - M28). |
| **v2.18.0** | 18 Sep 2026 | User Directive / Lead | Peluncuran Buku Induk Peserta Didik Digital DAPODIK & EMIS Ready (/admin/:schoolSlug/students, StudentDossierPrintModal - M29) dan Rubrik Asesmen Observasi PPDB Terpadu (AssessmentRubricModal, AssessmentSheetPrintModal - M30). |
| **v2.19.0** | 18 Sep 2026 | User Directive / Lead | Standardisasi menyeluruh istilah Guru & Murid, Pemasangan Havenly Arch Carousel di Beranda Pusat (/), serta Peluncuran Galeri Prestasi & Karya Murid Dinamis (/api/admin/achievements & AchievementShowcaseModal - M31). |
| **v2.20.0** | 18 Sep 2026 | User Directive / Lead | Perluasan Spesifikasi Modul Eksekutif & Teknis: M32 (Konsol Tata Kelola Prestasi Murid & Generator Piagam A4), M33 (Sistem Presensi QR Code KTS Murid), M34 (Buku Rapor Digital & Laporan Capaian Mutabaah Tahfidz), M35 (Tata Kelola SPP Bulanan, Virtual Account Midtrans & Kuitansi Digital). |
| **v2.21.0** | 25 Sep 2026 | User Directive / Lead | **Refinement Super Premium Formulir PPDB Online (/ppdb/daftar):**<br>1. Penyeragaman warna banner & kartu header menjadi **Solid Deep Forest Emerald (#064E3B)**, eliminasi gradasi multi-warna mencolok.<br>2. Pembersihan redundansi deskripsi dan nama unit berulang.<br>3. Penerapan **Strict Multi-Tenant Isolation** pada formulir: peniadaan dropdown/select ganti unit di dalam form pendaftaran aktif.<br>4. Layout grid **Anti-Mepet** dengan pelebaran horizontal gap 40px (`columnGap: 2.5rem`, `rowGap: 1.75rem`) dan penataan ulang flex NIK.<br>5. Standardisasi **Badge Nomor Poin Resmi 28 Butir Berkas Fisik** (`[Poin 01]` s.d. `[Poin 28]`) berdesain monospaced eksekutif berbayang lembut.<br>6. Penyiapan aset standar PWA (`icon-192.png` & `icon-512.png`) dan eliminasi warning console 404. |
| **v3.16.0** | 5 Okt 2026 | User Directive / Lead | **Produksi & SPMB SD IT 2027/2028:** migrasi Supabase PostgreSQL + deploy Vercel dengan routing hybrid path/subdomain; refinement tipografi hero SD (3 baris + aksen serif "Bukan Sekedar"), kartu statistik bento, identitas hijau `theme-sd`, footer kartu program rata bawah; pembaruan data poster SPMB SD IT T.A. 2027/2028 (3 poster, WA 0813-1013-9001, usia per Juli 2027, biaya gelombang 250/275/300 rb, kalkulator Putra/Putri, 10 program unggulan, sinkronisasi DB). Detail: Bagian 23. |
| **v3.18.0** | 7 Okt 2026 | User Directive / Lead | **Tata Kelola Mandiri CMS SD, Pembersihan Redundansi Navbar & Kesiapan Google Search Console:**<br>1. **Isolasi Ketat Multi-Tenant CMS SD:** Penambahan Tab 9 (*Pilar Karakter* - `/sd/karakter`) dan Tab 10 (*Profil & Visi Misi* - `/sd/profil`) yang hanya aktif pada unit SD (`schoolSlug === 'sd'`). Data dijamin tidak menimpa unit TK, SMP, atau Yayasan.<br>2. **Pembersihan Redundansi Navbar (Zero Duplicate):** Mengeliminasi menu ganda Dewan Guru (kini khusus di *Profil*), Dokumentasi (khusus di *Profil*), Pilar Karakter (khusus di *Program & Keunggulan*), dan Tata Usaha.<br>3. **Sinkronisasi Dinamis Halaman SD:** `/sd/guru`, `/sd/karakter`, `/sd/profil`, `/sd/program`, `/sd/testimoni`, `/sd/dokumentasi`, `/sd/kontak`, dan `/sd/spmb` 100% dinamis terhubung ke database `cMSSection` dengan revalidasi instan.<br>4. **Pintasan Cepat Dasbor Admin:** Tombol pintas `Kelola Guru ↗`, `Kelola Berita ↗`, dan `Prestasi ↗` langsung pada bar editor CMS.<br>5. **Optimasi Google Search Console & SEO Browser Indexing:** Pembaruan `sitemap.ts` mencakup seluruh rute dinamis SD untuk perayapan bot Google dan pengindeksan hasil pencarian peramban. Detail: Bagian 23.13. |
| **v3.20.0** | 8 Okt 2026 | User Directive / Lead | **Penyelarasan Komprehensif Pratinjau Live CMS SD & Eliminasi Tampilan Kosong Tab 9 & 10:**<br>1. **Eliminasi Tampilan Kosong Pratinjau:** Menambahkan blok render pratinjau live untuk Tab 9 (`sd_karakter` - Pilar Karakter & 7 Habits) dan Tab 10 (`sd_profil` - Profil, Visi Misi & Legalitas BAN-SM) pada `CMSEditorClient.tsx`. Sebelumnya kedua tab tidak memiliki blok kondisi render pratinjau sehingga muncul blank putih.<br>2. **Penyelarasan Pratinjau dengan Desain Website SD (`/sd`):**<br>- *Tab 1 (Hero):* Menyesuaikan tombol aksi hijau zamrud `#00A651` dan fallback foto greenhouse bambu asli.<br>- *Tab 3 (Stats):* Menggantikan kartu gradasi lama menjadi 2x2 Bento Grid berlatar `neutral-50` dengan ikon Users, Compass, Award, dan BookOpen persis tampilan `/sd`.<br>- *Tab 4 (Values):* Merender Tiga Pilar Karakter otentik dengan badge Pilar 01/02/03 dan footer Prinsip Smart Akhlaq Fitrah.<br>- *Tab 8 (Tuition):* Menampilkan poster resmi SPMB Story, rincian biaya gelombang 1, dan visual Rekening Resmi Bank Muamalat (1360012405).<br>3. **Penyediaan Nilai Fallback Server-Side:** Memastikan `src/app/admin/[schoolSlug]/cms/page.tsx` menyediakan fallback `DEFAULT_SD_KARAKTER` dan `DEFAULT_SD_PROFIL` sehingga data selalu terisi aman dan terisolasi khusus unit SD. Detail: Bagian 23.15. |

---

## 1. Visi, Misi, & Sasaran Strategis

### 1.1 Latar Belakang
Yayasan Pendidikan Imam Bonjol Majalengka mengelola tiga jenjang pendidikan Islam unggulan:
1. **TK IT AL AFIYAH** (Pendidikan Anak Usia Dini & Taman Kanak-Kanak Islam Terpadu)
2. **SD IT AL AFIYAH** (Sekolah Dasar Islam Terpadu)
3. **SMP IT AL AFIYAH** (Sekolah Menengah Pertama Islam Terpadu & Pusat Tahfidz)

### 1.2 Visi Platform
Mewujudkan ekosistem digital terpadu satu pintu (*one-stop integrated education platform*) yang memadukan keunggulan citra lembaga Islam modern, efisiensi pendaftaran murid baru tanpa hambatan, transparansi program rujukan/afiliasi, serta kemandirian pengelolaan konten bagi tiap kepala unit sekolah di bawah pengawasan terpusat pimpinan yayasan.

### 1.3 Key Performance Indicators (KPI)
- **Tingkat Konversi PPDB:** Meningkatkan rasio penyelesaian formulir pendaftaran hingga >= 85%.
- **Pertumbuhan Rujukan Afiliasi:** Mendorong >= 40% pendaftar baru bersumber dari program referral.
- **Waktu Muat Halaman:** Nilai Google Core Web Vitals >= 90 dengan FCP di bawah 1.2 detik.
- **Keamanan Data Multi-Tenant:** Nol toleransi kebocoran data antar unit sekolah.

---

## 2. Analisis Pemangku Kepentingan & Matriks Hak Akses (RBAC)

| Peran | Lingkup Wewenang | Dasbor Tujuan | Deskripsi Tanggung Jawab |
| :--- | :--- | :--- | :--- |
| `SUPERADMIN_YAYASAN` | Seluruh Unit (Cross-Tenant) | `/admin/foundation` | Memantau statistik agregat seluruh sekolah, mengelola akun admin sekolah, dan konfigurasi global. |
| `ADMIN_TK` | Khusus TK IT Al-Afiyah | `/admin/tk/dashboard` | Mengelola konten CMS web TK, memantau pendaftar, profil guru TK, dan pengumuman. |
| `ADMIN_SD` | Khusus SD IT Al-Afiyah | `/admin/sd/dashboard` | Mengelola konten CMS web SD, memantau pendaftar, memvalidasi kuota kelas, dan pengumuman. |
| `ADMIN_SMP` | Khusus SMP IT Al-Afiyah | `/admin/smp/dashboard` | Mengelola konten CMS web SMP, mengelola kuota peserta didik, capaian tahfidz, dan pengumuman. |
| `PETUGAS_PPDB` | Sesuai Unit Sekolah | `/admin/:schoolSlug/ppdb` | Memverifikasi berkas pendaftaran, menentukan jadwal observasi, dan merilis status kelulusan. |
| `PETUGAS_KEUANGAN` | Sesuai Unit Sekolah | `/admin/:schoolSlug/finance` | Memantau pembayaran formulir, melakukan rekonsiliasi kas masuk, dan menerbitkan kuitansi digital. |
| `MITRA_AFILIASI` | Personal Mitra | `/affiliate/dashboard` | Memperoleh tautan referral unik, memantau konversi, melihat buku kas komisi, dan mengajukan payout. |
| `WALI_MURID` | Akun Mandiri Pendaftaran | `/portal/ppdb/:noPendaftaran` | Melengkapi data formulir, mengunggah berkas, membayar biaya formulir, mengunduh kartu tes, dan melihat hasil kelulusan. |

---

## 3. Standar Kualitas Super Premium UI/UX & Unified Design System

### 3.1 Lima Pilar Estetika Super Premium
1. **Tipografi Kelas Dunia:** Kombinasi font Google Fonts **Plus Jakarta Sans** (judul) dan **Inter** (isi).
2. **Palet Warna Mewah Islami:**
   - Deep Royal Emerald `#064E3B`: Kedalaman ilmu agama, marwah, ketenangan.
   - Classic Vibrant Emerald `#059669`: Kesuburan, kecerdasan, kemajuan.
   - Fresh Mint `#10B981`: Aksen segar dan ramah anak.
   - Brushed Gold & Amber `#D97706`, `#F59E0B`, `#FBBF24`: Prestasi tinggi dan kemuliaan akhlak.
   - Pure Slate & Whites `#0F172A`, `#F8FAFC`, `#FFFFFF`: Latar bersih kontras tinggi.
3. **Efek Kedalaman & Pencahayaan Mewah:** Glassmorphism pada header, soft multi-layered shadows.
4. **Mikro-Interaksi Bernyawa:** Framer Motion, smooth card lift on hover, animated transitions.
5. **Ergonomi Mobile-First:** Target sentuh minimal 48px, menu drawer responsif.

### 3.2 Palet Aksen per Unit
| Unit | Warna Primer | Warna Aksen |
| :--- | :--- | :--- |
| TK IT | Emerald Fresh `#10B981` | Gold Soft `#FBBF24` |
| SD IT | Emerald Classic `#059669` | Gold Berkilau `#D97706` |
| SMP IT | Royal Green `#064E3B` | Gold Prestige `#B45309` |
| Yayasan | Deep Teal `#184F48` | Amber `#F59E0B` |

### 3.3 Kerangka Tata Letak Seragam (Wireframe Blueprint)
1. **Top Utility Bar:** Kontak WhatsApp resmi yayasan, tautan portal pendaftaran, tombol login.
2. **Main Navigation Header:** Logo + Lencana Unit, Menu: Beranda, Tentang Kami, Program, Fasilitas, Biaya & Alur PPDB, Kontak + CTA `[Daftar PPDB Sekarang]`.
3. **Hero Section Dinamis:** Lencana Jenjang, Headline, Papan Statistik, Tombol Ganda Daftar & Unduh Brosur.
4. **Pilar Nilai Karakter (3 Core Values):** Akidah & Akhlakul Karimah, Tahfidz & Literasi Al-Quran, Sains Teknologi & Wawasan Global.
5. **Kurikulum & Program Unggulan:** Grid kartu modern.
6. **Dewan Guru & Pendidik:** Showcase profil tenaga pendidik.
7. **Galeri Fasilitas Kampus:** Foto gedung, ruang kelas, lab, masjid.
8. **Testimoni Wali Murid:** Carousel quote.
9. **Berita & Agenda Kegiatan:** Grid artikel terbaru dari DB.
10. **CTA Akhir + Floating Helpdesk Widget WhatsApp.**

---

## 4. Spesifikasi Modul M1–M31 (Sprint 1–18, Selesai & Tervalidasi)

### M1 — Inisialisasi Proyek & Desain Sistem Terpadu ✅
Setup Next.js App Router, TypeScript, Tailwind CSS. Konfigurasi token warna terpadu TK, SD, SMP Al-Afiyah. Instalasi Framer Motion & Lucide React. Standar UI Admin Minimalis Google Workspace. Struktur folder Clean Architecture: `src/app/`, `src/components/`, `src/lib/`, `src/services/`, `src/types/`.

### M2 — Arsitektur Database Multi-Tenant & Seed Data ✅
Perancangan `prisma/schema.prisma` relasional lengkap. Model: School, User, PPDBRegistration, PPDBDocument, Invoice, AffiliateProfile, AffiliateConversion, CMSSection, NotificationLog. Script seed data akun demo & data awal 3 sekolah.

### M3 — Gerbang Login Terpadu & Quick Role Switcher ✅
Halaman `/login` responsif. Tombol Quick Role Switcher uji coba 1-klik peran demo. Auto-redirect sesuai peran dan unit sekolah. Session/Cookie guard proteksi rute.

### M4 — Layanan Simulator (WhatsApp & Midtrans) ✅
Engine pencatat pesan WhatsApp simulasi ke database. Modul simulator pembayaran Midtrans lokal (QRIS & Virtual Account). Webhook sinkronisasi otomatis status tagihan ke VERIFIED.

### M5 — Landing Page Terpadu (Hub, TK, SD, SMP) ✅
Halaman Portal Utama Yayasan (`/`). Halaman TK IT Al-Afiyah (`/tk`) aksen Zamrud Segar. Halaman SD IT Al-Afiyah (`/sd`) aksen Zamrud Klasik & Emas. Halaman SMP IT Al-Afiyah (`/smp`) aksen Hijau Royal Islami. 4 halaman muka publik responsif, berkecepatan tinggi, kaya konten.

### M6 — Formulir PPDB Dinamis Bertahap (Multi-Step) ✅
Form 6 langkah responsif dengan animasi Framer Motion. Kuesioner adaptif (TK: motorik; SD: Iqro; SMP: hafalan Quran). Area unggah berkas (KK, Akta, Foto) dengan pratinjau langsung. Auto-Save Draft dan checkout invoice formulir.

### M7 — Portal Afiliasi & Simulator Komisi Real-Time ✅
Halaman informasi kemitraan rujukan (`/affiliate`). Simulator estimasi komisi interaktif dengan slider. Penautan kode referral dan pencatatan komisi mitra. Dasbor pemantauan konversi & riwayat pencairan.

### M8 — Panel Admin Minimalis Google Style, PPDB & Finance ✅
Dasbor Superadmin Yayasan & Admin Unit (TK, SD, SMP). Editor CMS dinamis untuk mengubah banner, profil & kontak. Panel Seleksi PPDB (`/admin/:slug/ppdb`) & Keuangan (`/admin/:slug/finance`).

### M9 — Fitur Ekspor Data Peserta Didik & Rekonsiliasi Kas (CSV/Excel) ✅
Ekspor data pendaftar PPDB format UTF-8 dengan BOM (aman di Excel). Ekspor pembukuan tagihan kas masuk formulir PPDB. Ekspor rekap komisi mitra afiliasi.

### M10 — Konsol Pemantau Notifikasi WhatsApp Real-Time ✅
Dasbor pemantau riwayat notifikasi (`/admin/foundation/notifications`). Filter jenis pesan (Pendaftaran, Kuitansi, Ujian, Kelulusan, Komisi). Fitur 1-klik salin teks pesan.

### M11 — Manajemen Dewan Guru & Pendidik ✅
Model Prisma relasional `Teacher` multi-tenant & API CRUD. Konsol Google Workspace (`/admin/:slug/teachers`) & modal form. Showcase kartu guru pada landing page TK, SD, SMP.

### M12 — Kanal Publikasi Berita & Agenda Kegiatan Sekolah ✅
Model Prisma relasional `NewsPost` & API CRUD penerbitan. Konsol Newsroom Google style (`/admin/:slug/news`) & filter kategori. Grid berita interaktif & modal baca artikel lengkap pada landing page.

### M13 — Panel Sentral Superadmin (Kuota, Gelombang & Rekening) ✅
Kolom database School: quota, waveName, isPpdbOpen, bankName, bankAcc, bankHolder. API route `/api/admin/settings` (GET & PUT). Konsol `/admin/foundation/settings` (3 tab: Kuota, Biaya, Rekening). Validasi kapasitas kuota & status buka/tutup pada formulir PPDB online publik.

### M14 — Dokumen Resmi Peserta Didik & Surat Keputusan Penerimaan ✅
Modal SK Kelulusan resmi Kop Surat Yayasan dengan stempel basah digital & nomor SK. Kartu Peserta Ujian/Observasi dengan QR Code verifikasi. Kuitansi digital lunas kas PPDB untuk portal wali & panel kasir tata usaha.

### M15 — Dasbor Analitik Inteligensi & Corong Konversi PPDB ✅
API route `/api/admin/analytics` agregasi 5-stage funnel. Dasbor eksekutif `/admin/foundation/analytics`. Cetak laporan eksekutif yayasan A4 (@media print).

### M16 — Konsol Manajemen Hak Akses Pengguna Staf RBAC ✅
API route `/api/admin/users` & `/api/admin/users/[id]`. Konsol `/admin/foundation/users` dengan multi-filter peran. Sakelar status aktif/nonaktif & reset kata sandi staf.

### M17 — Sistem Unggah Berkas Fisik & Lightbox Viewer Dokumen ✅
API route `/api/upload` penyimpanan fisik ke disk `/public/uploads/ppdb/`. API route verifikasi status berkas `/api/admin/documents/[id]`. Dropzone interaktif Langkah 5 PPDB & Modal Lightbox viewer panitia.

### M18 — Pusat Konsultasi Cerdas & Helpdesk WhatsApp Multi-Unit ✅
Floating widget global `HelpdeskChatWidget.tsx`. Hotline WhatsApp cerdas 4 unit & modul Knowledgebase FAQ interaktif. Tersemat pada `layout.tsx` dengan proteksi print.

### M19 — Portal Perbaikan Berkas Mandiri Wali Murid ✅
Komponen `PortalDocumentStatusList.tsx` di `/portal/ppdb/[regNo]`. Lencana status berkas (Sah, Sedang Ditinjau, Perlu Revisi). Dropzone perbaikan berkas mandiri & API `PATCH /api/portal/documents/[id]`.

### M20 — Panduan Migrasi Cloud PostgreSQL & SOP Rilis Produksi ✅
Buku panduan operasional produksi `DEPLOYMENT.md`. Multi-stage production `Dockerfile` Next.js. Orkestrasi kontainer `docker-compose.yml` (App + PostgreSQL + Volumes). Template `.env.example` teranotasi lengkap.

### M21 — Pelacak Cepat Status PPDB & Reduksi Hambatan ✅
API pencarian multi-kriteria `/api/ppdb/check-status`. Halaman pelacak `/ppdb/cek-status`. Optimasi form pendaftaran anti-ribet (Demo Fill, Temp NIK, susulkan berkas).

### M22 — Kartu Tanda Murid (KTS) Digital Standar ISO ID-1 ✅
Komponen `StudentIdCardModal.tsx` berstandar ISO/IEC 7810 ID-1. Visualisasi 3D Card Flip (muka depan chip & hologram; muka belakang magnetik & QR). Optimalisasi cetak fisik presisi 2 sisi berdampingan (@media print).

### M23 — Papan Pengumuman Hasil Seleksi PPDB Publik ✅
Halaman publik `/ppdb/pengumuman` & API route `/api/ppdb/announcements`. Tabel direktori murid lolos seleksi dengan filter unit (TK/SD/SMP) & jalur. Tombol 1-klik buka portal peserta didik untuk unduh SK kelulusan & kartu murid.

### M24 — WhatsApp Broadcast Center di Panel Admin Yayasan ✅
Modul pengiriman notifikasi massal `/admin/foundation/broadcast` & API route. Pustaka canned templates terintegrasi & variabel token dinamis. Live bubble preview WhatsApp otentik & pencatatan ke NotificationLog.

### M25 — Lembar Formulir Pendaftaran Fisik Resmi A4 Cetak (F-PPDB) ✅
Dokumen cetak fisik 2-halaman A4 kop surat yayasan `OfficialRegistrationFormModal.tsx`. Biodata murid, data wali, kuesioner adaptif, tabel verifikasi berkas, surat pernyataan bermaterai. Integrasi tombol cetak di portal resmi murid `/portal/ppdb/[regNo]`.

### M26 — Kalender Agenda Akademik & Jadwal Seleksi Terpadu Multi-Unit ✅
Halaman publik `/agenda` & API route `/api/agenda`. Dual view (Kalender Bulanan Grid & Timeline Kronologis) dengan filter unit & kategori. Fitur ekspor iCalendar `.ics` & direct link Google Calendar.

### M27 — Formulir Daftar Ulang & Pengukuran Seragam Online ✅
Halaman `/portal/ppdb/[regNo]/daftar-ulang` & API `/api/portal/re-registration`. Bagan size chart interaktif, input postur tubuh murid, preferensi asrama (SMP), skema biaya. Bukti cetak resmi A4 Tanda Terima Konfirmasi Daftar Ulang.

### M28 — Konsol Monitoring Daftar Ulang & Logistik Seragam ✅
Panel Tata Usaha `/admin/:slug/re-registration` & `/admin/foundation/re-registration`. Matriks agregasi kebutuhan konveksi (S-XXL), status penyerahan seragam. Ekspor CSV 1-klik siap kirim vendor penjahit.

### M29 — Buku Induk Murid Digital DAPODIK & EMIS Ready ✅
Model relasional `Student` dengan generator NIS sekuensial unik. Konsol `/admin/:schoolSlug/students` & `/admin/foundation/students`. Lembar Arsip Resmi A4 Cetak `StudentDossierPrintModal.tsx`. 1-klik konversi murid PPDB diterima & ekspor CSV DAPODIK/EMIS.

### M30 — Instrumen Penilaian Observasi & Rubrik Asesmen PPDB ✅
Model relasional `PPDBAssessment` & API `/api/admin/assessments`. Rubrik adaptif TK/SD/SMP di `AssessmentRubricModal.tsx` dengan live score. Sinkronisasi status kelulusan 1-klik (ACCEPTED/REJECTED). Lembar Berita Acara Asesmen A4 `AssessmentSheetPrintModal.tsx`.

### M31 — Standardisasi Guru/Murid & Galeri Prestasi Murid ✅
Standardisasi istilah guru/pendidik/murid di seluruh platform. Komponen radial arc carousel `HavenlyArchCarousel` di beranda (`/`). Model `StudentAchievement` & modal interaktif `AchievementShowcaseModal`. Showcase medali/kejuaraan dinamis dengan filter bidang.

### M36 — Refinement Super Premium Formulir PPDB Online & Integritas PWA ✅
Penyempurnaan holistik pengalaman pendaftaran calon wali murid (`/ppdb/daftar`):
1. **Warna Solid Deep Forest Emerald (#064E3B):** Penggantian gradasi multi-warna menjadi satu warna solid yang teduh, berwibawa, dan serasi dengan identitas resmi institusi Al-Afiyah.
2. **Pembersihan Redundansi & Teks Ganda:** Eliminasi pengulangan nama unit dan deskripsi dobel di seluruh tahapan formulir.
3. **Isolasi Mutlak Tenant Unit Sekolah:** Peniadaan dropdown ganti unit di formulir aktif dan pencegahan tautan silang antar-unit agar pendaftar tidak salah mendaftar ke jenjang lain.
4. **Layout Grid Anti-Mepet (40px Gutter):** Pelebaran jarak horizontal kolom menjadi 40px (`columnGap: 2.5rem`, `rowGap: 1.75rem`) dan penataan ulang tombol bantuan NIK (`Belum Hafal NIK? Buat Otomatis`) dengan `min-w-0` agar input tidak berhimpitan.
5. **Sistem Badge Nomor Poin Resmi (28 Butir Berkas Fisik):** Penyelarasan 100% dengan lembar stopmap fisik SDIT Al-Afiyah menggunakan badge monospaced eksekutif berlatar hijau tua solid (`[Poin 01]` s.d. `[Poin 28]`).
6. **Integritas Aset PWA:** Penambahan ikon standar PWA `/icons/icon-192.png` dan `/icons/icon-512.png` serta verifikasi kompilasi Next.js 16 chunk tanpa warning.

---

## 5. Spesifikasi Modul M32–M35 (Sprint 15–18, Sedang Berjalan)

### M32 — Konsol Tata Kelola Prestasi Murid & Generator Piagam A4 🔄
- Konsol Google Workspace `/admin/:schoolSlug/achievements` & yayasan
- Form tambah/edit prestasi murid & upload sertifikat/foto piala
- Generator Piagam Apresiasi A4 Resmi `CertificatePrintModal.tsx` berornamen guilloche
- Ekspor rekapitulasi prestasi format CSV (UTF-8 BOM)
- **DoD:** Panel administrasi prestasi aktif & piagam penghargaan resmi yayasan siap cetak.

### M33 — Sistem Presensi Kehadiran Scan QR Code KTS & Notif WA ⏳
- Konsol Presensi Cepat `/admin/:schoolSlug/attendance`
- Integrasi scanner QR Code KTS Digital M22 & absensi manual rombel
- Pemicu otomatis notifikasi WhatsApp ke wali murid saat check-in di gerbang
- Rekapitulasi presensi bulanan/semester & ekspor CSV kesiswaan
- **DoD:** Sistem check-in gerbang sekolah otomatis via KTS dan transparansi kehadiran real-time.

### M34 — Buku Rapor Digital & Laporan Mutabaah Tahfidz Al-Quran ⏳
- Konsol pengisian capaian `/admin/:schoolSlug/report-cards`
- Penilaian 3 dimensi: Tahfidz Al-Quran, Mutabaah Yaumiyah Adab, & Akademik
- Lembar Buku Rapor Resmi A4 Siap Cetak `ReportCardPrintModal.tsx`
- Portal mandiri orang tua `/portal/rapor/[nis]` untuk unduh rapor digital
- **DoD:** Rapor digital & buku pantau ibadah/tahfidz dapat diakses orang tua 24/7.

### M35 — Modul Pembayaran SPP Bulanan & Kas Masuk Terpadu ⏳
- Panel Tata Usaha & Keuangan SPP `/admin/:schoolSlug/tuition`
- Generator tagihan otomatis per rombel & integrasi Midtrans Simulator (VA & QRIS)
- Portal pembayaran mandiri orang tua `/portal/spp/[nis]`
- Kuitansi Lunas Digital A4 `TuitionReceiptPrintModal.tsx` & ekspor buku kas SPP
- **DoD:** Pembukuan SPP rutin otomatis, opsi bayar daring instan, dan pelaporan kas yayasan rapi.

---

## 6. Arsitektur Teknis & Database

### 6.1 Stack Teknologi
- **Framework:** Next.js App Router (latest)
- **Database ORM:** Prisma (SQLite dev → PostgreSQL prod)
- **Styling:** Tailwind CSS + Custom CSS Variables
- **Animasi:** Framer Motion
- **Icons:** Lucide React
- **Auth:** Session Cookie (custom)
- **Payment:** Midtrans Simulator (dev) → Midtrans Snap (prod)
- **File Upload:** Local `/public/uploads/` (dev) → Cloud Storage (prod)
- **PWA:** manifest.json + service worker

### 6.2 Model Database Prisma
| Model | Fungsi |
| :--- | :--- |
| `School` | Data & konfigurasi per unit sekolah |
| `User` | Akun staf dengan RBAC |
| `PPDBRegistration` | Data pendaftar murid baru |
| `PPDBDocument` | Berkas pendaftaran |
| `Invoice` | Tagihan & pembayaran |
| `Student` | Buku induk murid aktif |
| `Teacher` | Profil dewan guru |
| `NewsPost` | Berita & pengumuman |
| `CMSSection` | Konten website per unit (JSON payload) |
| `AffiliateProfile` | Data mitra afiliasi |
| `AffiliateConversion` | Konversi referral |
| `NotificationLog` | Riwayat notifikasi WhatsApp |
| `AgendaEvent` | Kalender akademik |
| `StudentAchievement` | Galeri prestasi murid |
| `PPDBAssessment` | Rubrik penilaian observasi PPDB |
| `Attendance` | Presensi murid (SIAKAD - M33) |
| `Grade` | Nilai akademik (SIAKAD - M34) |
| `TahfidzProgress` | Progres hafalan (SIAKAD - M34) |
| `TuitionBill` | Tagihan SPP (SIAKAD - M35) |

### 6.3 Struktur Rute Lengkap
```
/ -> Beranda Yayasan (Hub)
/tk /sd /smp -> Halaman Unit Sekolah
/profil -> Profil Yayasan
/satuan-pendidikan -> Overview 3 Jenjang
/kontak -> Halaman Kontak
/berita /berita/[slug] -> Berita & Pengumuman
/agenda -> Kalender Akademik
/doa-dzikir -> Koleksi Doa & Dzikir
/ppdb -> Info PPDB (Tab: Alur, Syarat, Biaya, FAQ)
/ppdb/daftar -> Formulir Pendaftaran Multi-Step
/ppdb/cek-status -> Pelacak Status
/ppdb/pengumuman -> Papan Pengumuman Kelulusan
/affiliate -> Info Program Afiliasi
/affiliate/dashboard -> Dashboard Mitra Afiliasi
/portal/ppdb/[regNo] -> Portal Wali Murid
/portal/ppdb/[regNo]/daftar-ulang -> Form Daftar Ulang
/portal/rapor/[nis] -> Rapor Digital (M34)
/portal/spp/[nis] -> Pembayaran SPP (M35)
/portal/siakad -> Aplikasi SIAKAD PWA (Prioritas 4)
/admin/foundation -> Superadmin Yayasan
/admin/foundation/analytics -> Analitik & Funnel Konversi
/admin/foundation/settings -> Pengaturan Global
/admin/foundation/users -> Manajemen Staf RBAC
/admin/foundation/notifications -> Log Notifikasi WA
/admin/foundation/broadcast -> WhatsApp Broadcast Center
/admin/foundation/finance -> Keuangan Lintas Unit
/admin/foundation/students -> Buku Induk Lintas Unit
/admin/foundation/re-registration -> Daftar Ulang Lintas Unit
/admin/foundation/cms -> CMS Beranda Yayasan
/admin/[schoolSlug]/dashboard -> Dasbor Admin Unit
/admin/[schoolSlug]/ppdb -> Manajemen PPDB
/admin/[schoolSlug]/finance -> Keuangan Unit
/admin/[schoolSlug]/teachers -> Manajemen Guru
/admin/[schoolSlug]/news -> Manajemen Berita
/admin/[schoolSlug]/cms -> CMS Editor Website Unit
/admin/[schoolSlug]/students -> Buku Induk Murid
/admin/[schoolSlug]/re-registration -> Daftar Ulang & Seragam
/admin/[schoolSlug]/achievements -> Prestasi Murid (M32)
/admin/[schoolSlug]/attendance -> Presensi QR (M33)
/admin/[schoolSlug]/report-cards -> Rapor & Tahfidz (M34)
/admin/[schoolSlug]/tuition -> SPP & Keuangan (M35)
/admin/[schoolSlug]/grades -> Input Nilai (SIAKAD)
/admin/[schoolSlug]/tahfidz -> Input Tahfidz (SIAKAD)
/login -> Login Terpadu
```

---

## 7. UPDATE v3.0 — Reprioritisasi & Rencana Pengembangan Lanjutan
*(Ditambahkan 21 Sep 2026 — tidak mengganti, melanjutkan dokumen di atas)*

### 7.1 Latar Belakang Reprioritisasi
Berdasarkan arahan pengguna (21 Sep 2026), urutan pengerjaan direvisi agar **tampilan & UI semua halaman website selesai terlebih dahulu** sebelum data nyata diinput dan sebelum fitur SIAKAD dikerjakan. Prinsip: **bangun dulu, isi data belakangan**.

### 7.2 Urutan Prioritas Pengembangan (v3.0)
```
PRIORITAS 1 => Website Publik: Semua Halaman & Tab (audit, lengkapi, polish)
PRIORITAS 2 => Alur PMB/PPDB End-to-End (semua step, portal, pengumuman)
PRIORITAS 3 => Admin Panel & Dashboard (semua modul, audit kelengkapan)
PRIORITAS 4 => Aplikasi SIAKAD Mobile/PWA (dicicil 6 modul bertahap)
```

### 7.3 Kebijakan Input Data
**PENTING:** Semua data saat ini adalah placeholder/seed yang dibuat selama pengembangan.
Data nyata (nama guru, nomor WhatsApp, rekening bank, berita, data murid, dll.)
akan diinput oleh admin yayasan melalui Admin Panel SETELAH semua fitur & tampilan UI selesai.

| Modul | Status Data Saat Ini | Cara Input Nantinya |
| :--- | :---: | :--- |
| Profil Sekolah & Kontak | Placeholder | CMS > Tab Profil & Kontak |
| Slide Banner | Placeholder | CMS > Tab Banner & Slide |
| Dewan Guru | Placeholder | Admin > Manajemen Guru |
| Berita & Kegiatan | Placeholder | Admin > Manajemen Berita |
| Biaya PPDB | Placeholder | Admin > Pengaturan / CMS Tab Biaya |
| Rekening Bank Yayasan | Placeholder | Admin > Pengaturan Foundation |
| Data Murid & Pendaftar | Diisi wali murid | Form PPDB Online |
| Prestasi Murid | Placeholder | Admin > Prestasi Murid |

---

### 7.4 PRIORITAS 1 — Checklist Kelengkapan Website Publik

#### Beranda Yayasan (/)
- [ ] Hero Slider 3 slide otomatis (dari CMS, animasi Framer Motion)
- [ ] Counter statistik animasi (murid aktif, guru, akreditasi, tahfidz)
- [ ] Section 3 Pilar Nilai (Akidah / Tahfidz / Sains) — kartu interaktif hover
- [ ] Gateway pilihan unit TK/SD/SMP — card dengan ilustrasi & CTA
- [ ] Berita & Pengumuman terbaru (3-4 card dari DB)
- [ ] Galeri Prestasi Murid (carousel foto kejuaraan dari DB)
- [ ] Testimoni Wali Murid (carousel quote)
- [ ] Footer lengkap (logo, alamat, kontak, social media, Google Maps embed)
- [ ] WhatsApp helpdesk widget floating (tampil di semua halaman)

#### Halaman TK IT (/tk) — Section Wajib
- [ ] Hero banner slider 2 slide (CMS) + badge akreditasi + CTA PPDB
- [ ] Tentang TK: sejarah singkat, visi misi, keunggulan
- [ ] Program & Kurikulum: Sentra Bermain Islami, Hijaiyah, Doa Harian, Toilet Training
- [ ] Dewan Guru (kartu foto dari DB, dinamis)
- [ ] Fasilitas: galeri foto ruang kelas, taman bermain, mushola
- [ ] Biaya & Alur PPDB: ringkasan + tombol daftar
- [ ] Testimoni wali murid TK
- [ ] Berita Kegiatan TK (3-4 artikel terbaru dari DB)
- [ ] CTA Final (banner ajak daftar + countdown kuota jika hampir penuh)

#### Halaman SD IT (/sd) — Section Wajib
- [ ] Hero banner slider 2 slide (CMS)
- [ ] Tentang SD: visi misi, keunggulan, target Juz 30 mutqin
- [ ] Kurikulum Terpadu: Kemendikbud + Tahfidz + Bilingual Arab-Inggris
- [ ] Dewan Guru (dari DB)
- [ ] Fasilitas: lab komputer, masjid, lapangan panahan, perpustakaan
- [ ] Biaya & Alur PPDB
- [ ] Prestasi Murid SD (showcase medali dari DB)
- [ ] Testimoni wali murid SD
- [ ] Berita Kegiatan SD (dari DB)
- [ ] CTA Final

#### Halaman SMP IT (/smp) — Section Wajib
- [ ] Hero banner slider 3 slide (CMS)
- [ ] Tentang SMP: fullday school, target 3-5 juz, visi global
- [ ] Kurikulum: Kemendikbud + Tahfidz Intensif + Bilingual + Olimpiade
- [ ] Kepesantrenan & Asrama: info boarding/fullday, pembiasaan harian
- [ ] Dewan Guru (dari DB)
- [ ] Fasilitas: ruang kelas AC, lab sains, lab komputer, lapangan
- [ ] Biaya & Alur PPDB
- [ ] Prestasi: olimpiade, kejuaraan nasional (dari DB)
- [ ] Testimoni
- [ ] Berita SMP (dari DB)
- [ ] CTA Final

#### Halaman Lainnya
- [ ] /profil — Sejarah yayasan, visi misi, struktur organisasi, legalitas, galeri
- [ ] /satuan-pendidikan — Overview 3 jenjang, perbandingan program, infografik alur TK>SD>SMP
- [ ] /kontak — Form kontak, Google Maps embed, jam layanan, tombol WA per unit
- [ ] /berita — Grid card + filter Unit/Kategori, detail artikel (/berita/[slug]), related articles
- [ ] /agenda — Audit: kalender + timeline, filter, export .ics ✅ (M26 selesai)
- [ ] /doa-dzikir — Koleksi doa harian (Arab+Latin+Terjemah), dzikir, surat pendek hafalan

---

### 7.5 PRIORITAS 2 — Checklist Alur PPDB End-to-End

#### Halaman Info PPDB (/ppdb) — Tab Wajib
- [ ] Tab "Informasi Umum": syarat, jadwal gelombang, kuota per unit (real-time)
- [ ] Tab "Alur Pendaftaran": infografik 6 langkah animasi
- [ ] Tab "Persyaratan Berkas": checklist per unit TK/SD/SMP
- [ ] Tab "Biaya PPDB": tabel rincian (formulir, pangkal, SPP) per unit (dari CMS)
- [ ] Tab "FAQ": accordion expandable, pertanyaan umum wali murid
- [ ] Tab "Kontak Panitia": WA per unit, email, jam layanan
- [ ] CTA utama [Daftar Online Sekarang] selalu terlihat

#### Formulir Pendaftaran (/ppdb/daftar) — 7 Step
- [ ] Step 1: Pilih Unit (TK/SD/SMP) + info kuota real-time
- [ ] Step 2: Data Murid (NIK, nama, TTL, JK, asal sekolah)
- [ ] Step 3: Data Orang Tua/Wali (nama ayah-ibu, pekerjaan, HP, alamat)
- [ ] Step 4: Kuesioner Adaptif per unit (TK/SD/SMP berbeda pertanyaan)
- [ ] Step 5: Upload Berkas (foto, KK, Akta, Ijazah) — dropzone interaktif
- [ ] Step 6: Pilih Jalur (Reguler / Prestasi / Afiliasi + kode referral)
- [ ] Step 7: Ringkasan & Bayar (review, invoice, Midtrans VA/QRIS atau tunai)
- [ ] Auto-save draft setiap step
- [ ] Nomor registrasi otomatis + WA konfirmasi ke wali

#### Portal Wali Murid (/portal/ppdb/[regNo]) — Tab Wajib
- [ ] Ringkasan Status (progress bar: Terdaftar > Berkas > Lulus > Daftar Ulang)
- [ ] Data Pendaftaran (tampil semua data, edit jika masih draft)
- [ ] Berkas Dokumen (status tiap berkas: Sah/Diperiksa/Revisi, dropzone perbaikan)
- [ ] Tagihan & Pembayaran (invoice, status lunas, riwayat bayar)
- [ ] Kartu Peserta Ujian (unduh, QR Code)
- [ ] Hasil Seleksi (DITERIMA/TIDAK, unduh SK)
- [ ] Daftar Ulang (form konfirmasi, ukuran seragam, bukti konfirmasi)
- [ ] Kartu Murid KTS (digital ISO ID-1, front+back 3D flip)

#### Halaman Pendukung PPDB
- [ ] /ppdb/cek-status — cari by no reg / NIK / nama, tampil status + panduan ✅ (M21)
- [ ] /ppdb/pengumuman — filter unit + jalur, link ke portal wali ✅ (M23)
- [ ] /affiliate — simulator komisi, cara bergabung, dashboard mitra ✅ (M7)

---

### 7.6 PRIORITAS 3 — Checklist Admin Panel (Audit Kelengkapan)

#### Dashboard
- [ ] Admin Unit: ringkasan PPDB hari ini, grafik tren, status kuota, notifikasi, shortcut, kalender
- [ ] Superadmin Foundation: statistik agregat TK+SD+SMP, perbandingan performa, toggle PPDB, quick access

#### Modul Yang Sudah Ada (Perlu Audit)
- [x] PPDB Manajemen (/admin/[schoolSlug]/ppdb) — M8, M14, M30
- [x] Keuangan (/admin/[schoolSlug]/finance) — M8, M9
- [x] Manajemen Guru (/admin/[schoolSlug]/teachers) — M11
- [x] Manajemen Berita (/admin/[schoolSlug]/news) — M12
- [x] CMS Editor 8 Tab dengan Preview Live (/admin/[schoolSlug]/cms) — BARU diperbarui
- [x] Buku Induk Murid (/admin/[schoolSlug]/students) — M29
- [x] Analitik & Laporan (/admin/foundation/analytics) — M15
- [x] Pengaturan PPDB (/admin/foundation/settings) — M13
- [x] Manajemen Pengguna RBAC (/admin/foundation/users) — M16
- [x] Broadcast WA (/admin/foundation/broadcast) — M24
- [x] Daftar Ulang & Seragam (/admin/[schoolSlug]/re-registration) — M27-M28
- [x] Prestasi Murid (/admin/[schoolSlug]/achievements) — M32 SELESAI

#### Modul Dalam Proses / Belum
- [ ] Presensi QR (/admin/[schoolSlug]/attendance) — M33 BELUM
- [ ] Rapor & Tahfidz (/admin/[schoolSlug]/report-cards) — M34 BELUM
- [ ] SPP & Keuangan (/admin/[schoolSlug]/tuition) — M35 BELUM

---

### 7.7 PRIORITAS 4 — Rencana SIAKAD Mobile/PWA (Dicicil 6 Modul)

CATATAN: Dikerjakan SETELAH prioritas 1-3 selesai semua. Dicicil modul per modul.
Akses via PWA di /portal/siakad. UI mobile-first dengan bottom navigation.

| ID | Nama Modul | Konten | Link Admin |
| :---: | :--- | :--- | :--- |
| M-S1 | Dashboard & Profil | Login NIS+PIN, profil murid, ringkasan, bottom nav | — |
| M-S2 | Presensi | Rekap kehadiran bulanan (Hadir/Izin/Sakit/Alpha), notif push | /attendance (M33) |
| M-S3 | Tahfidz & Mutabaah | Progres hafalan surah/juz, catatan mutabaah, progress bar | /tahfidz (M34) |
| M-S4 | Rapor & Nilai | Nilai per mapel per semester, download rapor PDF, grafik akademik | /report-cards (M34) |
| M-S5 | SPP & Keuangan | Tagihan SPP, riwayat bayar, bayar online Midtrans, kuitansi digital | /tuition (M35) |
| M-S6 | Prestasi & Pengumuman | Galeri prestasi anak, pengumuman sekolah, kalender agenda | /achievements (M32) |

---

*Dokumen ini bersifat akumulatif. Setiap update baru DITAMBAHKAN di bawah,*
*tidak pernah mengganti atau menghapus bagian yang sudah ada di atas.*
*Versi dokumen saat pembaruan bagian 7: 3.0.0 — 21 Sep 2026*

---

## 8. UPDATE v3.1 — Refinement Super Premium Formulir PPDB Online & Integritas PWA
*(Ditambahkan 25 Sep 2026 — tidak mengganti, melanjutkan dokumen di atas)*

### 8.1 Latar Belakang & Arahan User
Penyempurnaan holistik pengalaman pendaftaran calon wali murid pada formulir online `/ppdb/daftar`:
1. **Penyeragaman Warna Solid Deep Forest Emerald (`#064E3B`):**
   - Menghilangkan gradasi multi-warna yang terlalu ramai/mencolok.
   - Menggunakan warna solid Forest Emerald yang berwibawa, teduh, dan elegan di seluruh card header dan banner status.
2. **Pembersihan Redundansi & Teks Ganda:**
   - Menghapus pengulangan nama unit dan deskripsi berulang pada header langkah formulir.
3. **Strict Multi-Tenant Isolation pada Formulir:**
   - Menghilangkan dropdown/select penggantian unit di dalam form pendaftaran yang aktif.
   - Pendaftar yang membuka link pendaftaran suatu unit (misal SD IT) tetap berada pada unit tersebut tanpa risiko salah memilih unit lain.
4. **Ergonomi Grid Anti-Mepet (Layout Spacing 40px):**
   - Pelebaran jarak horizontal antar-kolom menjadi 40px (`columnGap: 2.5rem`, `rowGap: 1.75rem`) pada breakpoint md/lg.
   - Penambahan `min-w-0` pada semua anak kolom agar input tidak meluap.
   - Pengaturan tombol bantuan NIK (`Belum Hafal NIK? Buat Otomatis`) agar tidak berhimpitan atau menabrak kolom data di sebelahnya.
5. **Standardisasi Badge Nomor Poin Resmi 28 Butir Berkas Fisik Lembar Stopmap SDIT:**
   - Penerapan badge nomor poin monospaced eksekutif berlatar hijau tua solid (`bg-[#064E3B] text-emerald-100 font-mono text-[10px] font-extrabold shadow-2xs`):
     - **Tahap 2 (Identitas Pokok Murid):** `[Poin 01]` Nama Lengkap Calon Murid, `[Poin 02]` Nama Panggilan Akrab, `[NIK]` NIK 16-Digit, `[Poin 03]` Jenis Kelamin, `[Poin 04]` Tempat Lahir, `[Poin 05]` Tanggal Lahir, `[Poin 07]` Anak ke-, `[Poin 08]` Jumlah Saudara Kandung, `[Poin 17]` Alamat Domisili Lengkap.
     - **Tahap 3 (Kuesioner Khusus & Akordion Berkas Fisik):** `[Poin 22]` Kategori Pendaftaran Masuk, `[Poin 21]` Moda Transportasi, `[Poin 23]` Asal Sekolah Sebelumnya, `[Qur'an]` Kemampuan Membaca Al-Qur'an/Iqro, `[Kesiapan]` Calistung. Serta akordion berkas fisik opsional: `[Poin 11]` Tinggi Badan, `[Poin 12]` Berat Badan, `[Poin 14]` Golongan Darah, `[Poin 15]` Jarak Rumah ke Sekolah, `[Poin 16]` Tinggal Bersama, `[Poin 13]` Riwayat Penyakit/Alergi, `[Poin 27]` Info Pertama Mengenal Sekolah, `[Poin 28]` Alasan Utama Memilih Sekolah.
     - **Tahap 4 (Data Orang Tua):** `[Poin 18]` Data Ayah Kandung, `[Poin 19]` Data Ibu Kandung, `[Poin 20]` Rentang Penghasilan Gabungan Orang Tua Bulanan.
6. **Integritas Aset PWA & Console Cleanliness:**
   - Menyiapkan aset ikon PWA standar di `public/icons/icon-192.png` dan `public/icons/icon-512.png` sehingga pemanggilan dari `manifest.json` berstatus HTTP 200 (bebas 404).
   - Validasi AST compiler dan seluruh 16 modul client chunk Next.js 16 terkompilasi bersih 100% tanpa error (`npx tsc --noEmit` Exit Code 0).

---

---

## 9. UPDATE v3.2 — Milestone 32: Konsol Tata Kelola Prestasi Murid & Generator Piagam A4 Resmi
*(Ditambahkan 25 Sep 2026 — tidak mengganti, melanjutkan dokumen di atas)*

### 9.1 Latar Belakang & Ruang Lingkup
Pengembangan konsol tata kelola prestasi murid terpadu dan apresiasi pencapaian kejuaraan resmi Yayasan Pendidikan Imam Bonjol Majalengka:
1. **Pusat Tata Kelola Prestasi Murid (Multi-Tenant Admin Console):**
   - Halaman admin unit sekolah: `/admin/[schoolSlug]/achievements`
   - Halaman admin yayasan: `/admin/foundation/achievements`
   - Komponen konsol Google Workspace minimalis: `AchievementManagerClient.tsx`
   - Metrik KPI Prestasi (Total Prestasi, Juara 1 / Medali Emas, Perak / Perunggu, Tingkat Nasional & Internasional).
   - Filter komprehensif: unit sekolah (pada konsol yayasan), kategori lomba (Tahfidz, Sains & Matematika, Olahraga, Seni & Bahasa, Akademik), dan tingkat kejuaraan (Kecamatan, Kabupaten/Kota, Provinsi, Nasional, Internasional).
   - Ekspor data 1-klik berformat CSV dengan UTF-8 BOM (`data-prestasi-murid-alafiyah-YYYY-MM-DD.csv`) ramah Microsoft Excel.
2. **API Route CRUD Prestasi Murid:**
   - Endpoint: `/api/admin/achievements`
   - Metode: `GET` (daftar prestasi dengan multi-filter), `POST` (tambah prestasi baru), `PUT` (perbarui data prestasi yang ada), `DELETE` (hapus entri prestasi).
3. **Dokumen Fisik Landscape A4 Piagam Penghargaan Resmi Siap Cetak (`CertificatePrintModal.tsx`):**
   - Menggunakan standar cetak `@media print { @page { size: A4 landscape; margin: 0; } }`.
   - Bingkai ornamen guilloche klasik kenegaraan beraksen Mowilex Teal & Emas.
   - Kop Surat Resmi Yayasan Pendidikan Imam Bonjol Majalengka.
   - Penomoran piagam unik sekuensial dinamis (`PGM-[SLUG]-[TAHUN]-[ID]`).
   - Tipografi kaligrafi serif elegan untuk nama murid dan predikat kejuaraan.
   - QR Code verifikasi keabsahan dokumen dan stempel basah digital yayasan.
   - Tanda tangan resmi Mudir / Ketua Yayasan dan Kepala Sekolah.
4. **Navigasi Global:**
   - Penambahan entri menu navigasi "Prestasi Murid" berikon `Trophy`/`Award` pada `AdminSidebar.tsx` untuk seluruh unit sekolah dan yayasan.
5. **Verifikasi Kualitas:**
   - Seluruh kode teruji lulus pemeriksaan TypeScript (`npx tsc --noEmit` Exit Code 0) bebas error.

---

---

## 10. UPDATE v3.3 — Prioritas Super Premium: Ekosistem PPDB Terpadu & Akun Duta Syiar Afiliasi
*(Ditambahkan 25 Sep 2026 — tidak mengganti, melanjutkan dokumen di atas)*

### 10.1 Latar Belakang & Arahan User
Penyempurnaan prioritas dan elevasi kualitas visual (*Super Premium Enterprise Design System*) pada dua pilar utama pendaftaran murid baru dan kemitraan syiar:
1. **Ekosistem PPDB (Penerimaan Peserta Didik Baru Terpadu):**
   - **Elevasi Antarmuka Pusat PPDB (`/ppdb`):**
     - Desain visual bernuansa *Deep Forest Emerald (#064E3B)* dengan aksen emas prestise dan Mowilex Soft Water (`#E8F3F1`, `#2D7A70`).
     - Kartu unit sekolah komparatif (TK IT, SD IT, SMP IT Al-Afiyah) dengan kuota live, target hafalan Al-Qur'an bersanad, jam belajar, dan tombol pendaftaran langsung per unit.
     - Penjelasan 3 Jalur Masuk: *Jalur Reguler*, *Jalur Beasiswa Tahfidz Prestasi (Keringanan hingga 100%)*, dan *Jalur Rujukan Duta Syiar Afiliasi*.
     - Alur 4 langkah pendaftaran transparan dan *Interactive FAQ Accordion* untuk pertanyaan krusial wali murid (usia minimal, tes non-calistung ramah anak, opsi susulkan berkas stopmap, dan beasiswa).
   - **Ketahanan Pelacakan Referral pada Formulir (`/ppdb/daftar`):**
     - Integrasi ganda pembacaan kode referral dari URL query (`?ref=...`) dan fallback pembacaan cookie 30 hari (`alafiyah_ref`).
     - Badge verifikasi rujukan real-time di Langkah 1: `Rujukan Terverifikasi: [KODE]`.
     - Penegasan atribusi Duta Syiar di Langkah 6 (Ringkasan Tagihan Formulir).

2. **Tata Kelola Akun Duta Syiar & Mitra Afiliasi (`/affiliate` & `/affiliate/dashboard`):**
   - **Halaman Pendaftaran Khusus Dedicated (`/affiliate/register`):**
     - Halaman registrasi khusus Duta Syiar berestetika premium 2-kolom: kolom edukasi nilai manfaat syiar & rate komisi resmi (TK Rp 250k, SD Rp 350k, SMP Rp 500k per murid diterima), serta kolom formulir registrasi instan dengan validasi kata sandi dan rekening bank penampung.
     - Pendaftaran langsung menerbitkan profil afiliasi unik dan sesi login otomatis.
   - **Dasbor Mitra Afiliasi Live & Dinamis (`/affiliate/dashboard`):**
     - Integrasi data riil database via endpoint `GET /api/affiliate/me` (nama mitra, kode referral, tautan aktif, saldo tersedia, total komisi, jumlah murid terdaftar).
     - Indikator Tingkat Mitra (*Tier Progress Bar*: Bronze -> Silver -> Gold -> Platinum).
     - Modul 1-klik salin tautan khusus TK, SD, SMP, dan pendaftaran umum.
     - Modal generator QR Code personal untuk materi cetak/presentasi langsung.
     - Amunisi Syiar: 3 template pesan promosi WhatsApp siap salin & siap kirim 1-klik ke grup wali murid.
     - Modal interaktif Pengajuan Tarik Saldo Komisi via endpoint `POST /api/affiliate/payout` ke rekening bank mitra.
     - Tabel riwayat konversi murid rujukan real-time dari model `AffiliateConversion`.
3. **Verifikasi Kualitas:**
   - Seluruh kode teruji lulus pemeriksaan TypeScript (`npx tsc --noEmit` Exit Code 0) bebas error dan API endpoints teruji 100% responsif (HTTP 200).

---

## 11. UPDATE v3.4 — Elevasi Visual & Interaktivitas Lanjutan PPDB & Akun Duta Syiar
*(Ditambahkan 25 Sep 2026 — tidak mengganti, melanjutkan dokumen di atas)*

### 11.1 Ruang Lingkup Peningkatan Interaktivitas
1. **Pusat PPDB Terpadu (`/ppdb`):**
   - **Kalkulator Biaya Pendidikan Terpadu TP 2026/2027:**
     - Pemilih jenjang interaktif: TK IT, SD IT, dan SMP IT Al-Afiyah.
     - Rincian itemized resmi: Infaq formulir, uang sarana (pangkal), seragam 4 stel, buku paket modul, dan SPP bulan pertama.
     - Toggle diskon saudara kandung (-10% uang sarana) dan beasiswa prestasi tahfidz (-50% s.d. 100% uang sarana).
     - Kalkulasi total estimasi biaya dan simulasi skema angsuran syariah 3x termin (DP 40% + 2x cicilan bebas bunga).
   - **Live Quota Counters & Urgency Progress Bar:**
     - Penampil kuota terisi dan sisa kursi terbuka (TK sisa 8 kursi, SD sisa 12 kursi, SMP sisa 18 kursi) dengan progress bar emerald untuk mendorong ketepatan waktu pendaftaran.
   - **Modal Brosur & Panduan Pendaftaran Resmi 2026/2027:**
     - Modal pratinjau daftar berkas stopmap fisik (KK, Akta, Pas Foto 3x4, KTP Ortu, Ijazah), jadwal gelombang 1-2, dan tombol 1-klik cetak dokumen resmi (*Print Preview*).
   - **Showcase Testimoni Wali Murid Terverifikasi:**
     - Ulasan asli wali murid jenjang TK, SD, dan SMP Al-Afiyah dengan rating bintang 5 mengenai adab, kemandirian anak, dan target mutqin Al-Qur'an.

2. **Halaman Pendaftaran Duta Syiar (`/affiliate/register`):**
   - **Simulasi Potensi Bagi Hasil Interaktif:** Slider penyesuaian calon murid TK, SD, SMP pada kolom kiri formulir dengan kalkulasi real-time estimasi komisi yang akan masuk ke rekening bank mitra.
   - **Pemberian Panduan & Keamanan Rekening:** Bantuan penjelasan kebutuhan nomor rekening dan garansi privasi data.

3. **Dasbor Duta Syiar (`/affiliate/dashboard`):**
   - **Fitur Filter Tab & Pencarian Real-Time:**
     - Tab filter status konversi: *Semua*, *Siap Cair (Approved)*, *Lunas Ditransfer (Paid)*, dan *Menunggu Bayar (Pending)* dengan hitungan badge live.
     - Kotak pencarian instan nama calon murid atau nomor registrasi rujukan.
     - Penanganan kondisi kosong (*empty state*) yang intuitif dengan panduan sebar link.

4. **Verifikasi Kualitas & Integritas:**
   - Pemeriksaan TypeScript (`npx tsc --noEmit`) berstatus Exit Code 0 (0 error).
   - Pengujian HTTP fetch terhadap seluruh 8 endpoint PPDB dan Affiliate berstatus HTTP 200 OK.

---

## 12. UPDATE v3.5 — Standardisasi Nomenklatur Resmi: "Mitra Afiliasi"

Berdasarkan preferensi pengguna dan penyesuaian terminologi branding yayasan, seluruh sebutan **"Duta Syiar"** secara komprehensif distandardisasi menjadi **"Mitra Afiliasi"** di seluruh ekosistem aplikasi:

1. **Komponen Navigasi & Portal:**
   - Navigasi dropdown: `"Kemitraan Mitra Afiliasi"`.
   - Pencarian global: `"Program Kemitraan Mitra Afiliasi"`.
   - Modal edit biodata peserta didik: Placeholder sumber informasi diperbarui menjadi `"misal: Kerabat, Spanduk, Media Sosial, Mitra Afiliasi"`.

2. **Ekosistem PPDB Terpadu (`/ppdb` & `/ppdb/daftar`):**
   - Jalur masuk resmi: `"Jalur Rujukan Mitra Afiliasi"`.
   - FAQ & CTA Banner: Diperbarui mengacu pada `"Program Mitra Afiliasi"`.
   - Formulir registrasi peserta didik:
     - Input rujukan: `"Kode Rujukan / Referral Mitra Afiliasi (Opsional)"`.
     - Ringkasan tagihan (Langkah 6): `"Rujukan Mitra Afiliasi: [KODE]"`.

3. **Portal Pendaftaran Mitra (`/affiliate/register`):**
   - Header badge: `"Program Mitra Afiliasi 2026/2027"`.
   - Judul & subjudul: `"Gabung Menjadi Mitra Afiliasi Al-Afiyah"`.
   - Formulir profil: `"Lengkapi Data Mitra Afiliasi Anda"`.
   - Kustomisasi kode unik referral: `"Kustomisasi Kode Unik Tautan Referral (Opsional)"` dengan contoh `"MITRA-HENDRA"`.

4. **Dasbor Mitra (`/affiliate/dashboard`):**
   - Header dasbor: `"Dasbor Mitra Afiliasi"`.
   - Tombol modal QR: `"QR Code Mitra Afiliasi"`.
   - Kotak amunisi pesan WhatsApp: `"Materi Promosi Cepat"`.

5. **Konsol Admin & Analitik (`/admin/finance` & `/admin/analytics`):**
   - Judul ekspor Excel pencairan komisi: `"DAFTAR PENCAIRAN KOMISI MITRA AFILIASI"`.
   - Metrik atribusi referral: Diperbarui menjadi `"Didorong oleh {N} Mitra Afiliasi aktif."`.

---

## 13. UPDATE v3.6 — Integrasi Foto Asli Kegiatan Murid SD IT Al-Afiyah sebagai Banner & Showcase Resmi

Sesuai arahan pengguna dengan melampirkan berkas foto asli kegiatan luar kelas dari dewan guru SD IT Al-Afiyah Majalengka, seluruh aset visual dan banner unit SD IT telah disesuaikan dan diintegrasikan:

1. **Aset Foto Asli dari Guru (`/public/images/`):**
   - **`sd-hero-greenhouse.jpg` (Landscape 16:9 - 1024x576):** Foto guru bertopi safari membimbing murid putra menanam bibit tanaman sayur di greenhouse bambu sekolah dengan seragam merah-putih dan kalung ID Card resmi SD IT Al-Afiyah. Menjadi foto utama *hero slider* dan kartu unit SD.
   - **`sd-hero-garden.jpg` (Landscape 16:9 - 1024x576):** Foto barisan rapi murid putri membawa buku observasi di samping bedengan kebun sayur hijau yang asri dan gerbang lengkung bambu. Menjadi slide kedua *outdoor learning & agro-literasi*.
   - **`sd-hero-activity.jpg` (Portrait 9:16 - 576x1024):** Foto keceriaan murid-murid putri berseragam jilbab putih & rok merah dengan kalung identitas bertuliskan *"SDIT AL-AFIYAH MAJALENGKA"* memegang buku mutaba'ah di kebun sekolah. Menjadi slide ketiga *prestasi & karakter*.
   - **`sd-hero-students.jpg`:** Diperbarui secara sinkron untuk menjamin *backward compatibility* pada semua rute legacy.

2. **Pembaruan Komponen & Landing Page:**
   - **`UnitHeroSlider.tsx` (Slide Hero SD IT `/sd`):**
     - Slide 1: Menampilkan `sd-hero-greenhouse.jpg` dengan copy *"Membangun Generasi Emas Qur'ani & Berkarakter Unggul"*.
     - Slide 2: Menampilkan `sd-hero-garden.jpg` dengan badge *"Outdoor Learning & Agro-Literasi Ramah Anak"*.
     - Slide 3: Menampilkan `sd-hero-activity.jpg` dengan copy *"Wujudkan Potensi Akhlak & Prestasi Ananda Tercinta"*.
   - **`EdukaUnitCards.tsx` (Beranda Pusat `/`):**
     - Kartu unit SD IT Al-Afiyah diperbarui menampilkan foto asli greenhouse `sd-hero-greenhouse.jpg`.
   - **`SchoolLandingTemplate.tsx` (Galeri Fasilitas SD IT `/sd`):**
     - Daftar fasilitas bawaan SD IT menambahkan *"Greenhouse & Kebun Edukasi Pertanian"* serta *"Taman Belajar Outdoor Terbuka"*.
   - **`HavenlyArchCarousel.tsx` (Figur Murid Berprestasi):**
     - Menampilkan foto asli kegiatan sains outdoor murid SD IT Al-Afiyah.
   - **Prisma SQLite Database:**
     - Rekor CMS section `hero` untuk unit `sd` diperbarui menggunakan `/images/sd-hero-greenhouse.jpg`.

---

## 14. UPDATE v3.7 — Header Transparan-ke-Putih Dinamis (Gaya Insan Kamil) & Pembersihan Menyeluruh Foto CMS SD IT

Berdasarkan instruksi pengguna untuk menghadirkan header transparan di awal dan berubah menjadi putih saat di-scroll (seperti referensi situs `insankamil.or.id`) serta memastikan panel admin CMS SD IT bersih dari gambar AI:

1. **Pembersihan Menyeluruh Foto Placeholder / AI di Panel Admin CMS SD IT:**
   - **`CMSEditorClient.tsx`:** Preset gambar banner hero kini memprioritaskan 3 foto otentik dewan guru (`/images/sd-hero-greenhouse.jpg`, `/images/sd-hero-garden.jpg`, `/images/sd-hero-activity.jpg`) dan membersihkan seluruh sisa placeholder AI (`havenly-hero.jpg`, `sd-hero-tahfidz.jpg`).
   - **`SchoolLandingTemplate.tsx` & `HavenlyArchCarousel.tsx`:** Galeri fasilitas dan profil murid berprestasi diperbarui menggunakan foto asli kegiatan murid SD IT Al-Afiyah.
   - **Sinkronisasi Database SQLite (`cMSSection`):** Payload hero banner unit SD disinkronkan langsung menggunakan foto asli dewan guru sehingga editor CMS berjalan lancar tanpa kendala.

2. **Implementasi Header Transparan-ke-Putih Dinamis (`Navbar.tsx`):**
   - **Mode Awal (Top of Page / `scrollY <= 36px`):**
     - Mengambang (*fixed overlay*) di atas banner hero dengan latar belakang transparan berpadu scrim gradien halus (`bg-gradient-to-b from-black/75 via-black/40 to-transparent border-white/10`).
     - Tipografi kaligrafi Arab dan nama lembaga beralih ke warna putih jernih (`text-white drop-shadow-sm`).
     - Menu navigasi desktop, link rujukan, dan ikon *chevron* tampil putih terang (`text-white/90 hover:text-white`).
     - Tombol pencarian (*Quick Search*) dan tombol hamburger menu mobile tampil berwarna putih dengan hover melayang.
     - Tombol utama PPDB tampil sebagai *pill* emas amber berkilau (`bg-amber-400 text-stone-950 hover:bg-amber-300 font-bold shadow-xs`).
     - *Micro-bar* kontak dan media sosial di atas header tampil semi-transparan dengan aksen border tipis, memberikan kesan mewah dan lapang.
   - **Mode Scroll (`scrollY > 36px`):**
     - *Micro-bar* atas menciut dan runtuh secara mulus (*smooth collapse* `max-h-0 opacity-0 overflow-hidden py-0`).
     - Header utama bertransformasi secara instan dan halus (*transition 300ms*) menjadi putih bersih dengan efek *glassmorphism* modern (`bg-white/95 backdrop-blur-md shadow-md border-b border-slate-200/90`).
     - Tipografi Arab kembali ke warna hijau zamrud `#184F48`, teks latin menjadi *deep slate* `text-slate-800`, link navigasi menjadi `text-slate-700 hover:text-[#184F48]`, dan tombol PPDB beralih ke desain *outlined emerald* klasik.
   - **Dukungan Halaman Non-Hero:**
     - Pada rute tanpa banner hero gelap (misalnya `/agenda`, `/berita`, `/login`), header secara cerdas tetap berada dalam mode putih solid (*solid white mode*) sejak awal agar teks tetap kontras dan nyaman dibaca.
   - **Kompensasi Padding Konten Hero:**
     - Seluruh komponen banner dan halaman ber-hero (`EdukaHeroSlider.tsx`, `UnitHeroSlider.tsx`, `/ppdb`, `/profil`, `/affiliate`) telah disesuaikan dengan *top padding* proporsional (`pt-28 sm:pt-36 lg:pt-40`) sehingga teks judul, *badge*, dan tombol tidak tertutup bilah header tetap.

---

## 15. UPDATE v3.8 — Integrasi Poster Resmi SPMB SDIT Al-Afiyah T.A. 2026/2027 (Smart Akhlaq Fitrah)
*(Ditambahkan 26 Sep 2026 — tidak mengganti, melanjutkan dokumen di atas)*

### 15.1 Latar Belakang & Amanah Brosur Guru SDIT
Berdasarkan berkas poster/flyer resmi SPMB yang dibagikan oleh tim dewan guru SDIT Al-Afiyah, seluruh landing page, komponen unit, pilar pendidikan, dan hotline WhatsApp disinkronkan secara presisi:
1. **Identitas & Visi Lembaga:**
   - Nama Unit: **SDIT AL AFIYAH** (Yayasan Pendidikan Imam Bonjol Majalengka).
   - Tagline / Motto: **SMART AKHLAQ FITRAH**.
   - Visi Utama: *"Mencetak Generasi Sholeh Cerdas Mandiri Berwawasan dan Berakhlakul Islami"*.
   - Slogan Kampanye: *"BUKAN SEKADAR TEMPAT BELAJAR NAMUN JUGA TEMPAT BERTUMBUH"*.
   - Kuota Penerimaan: **KUOTA TERBATAS — HANYA 2 ROMBEL** (Total 56 murid).
   - Layanan Hotline WhatsApp SPMB Resmi: **`0895322226104`** (`+62 895-3222-26104`).

2. **8 Program Unggulan Resmi SPMB SDIT:**
   - 1. Mendidik dengan sunnah, menggunakan metode Pendidikan Karakter Nabawiyah.
   - 2. Akhlaq dan ilmu, Iman sebelum Qur'an.
   - 3. Lingkungan yang nyaman, Asri, dan membahagiakan Anak.
   - 4. Basic literasi dan numerasi.
   - 5. Outdoor Learning (Greenhouse & Kebun Terbuka).
   - 6. Pelatihan Aqil-Baligh: Mandiri, terampil & beradab.
   - 7. Pemetaan Potensi bakat, Skill dan kemandirian.
   - 8. Tahfidz Qur'an (Juz 30 Mutqin).

3. **Sinkronisasi Kode, Database & Komponen Web:**
   - **`UnitHeroSlider.tsx`:** Slide 1 SDIT mengadopsi tajuk utama *"Bukan Sekadar Tempat Belajar, Namun Juga Tempat Bertumbuh Ananda"*, badge *"SPMB T.A. 2026/2027 • TELAH DIBUKA"*, trust items *"Hanya 2 Rombel"* & *"Smart Akhlaq Fitrah"*, serta tombol WhatsApp ke `0895322226104`.
   - **`src/app/sd/page.tsx` & `SchoolLandingTemplate.tsx`:** Menampilkan 8 program unggulan dan 3 pilar karakter Smart Akhlaq Fitrah secara konsisten, serta menyertakan poster resmi di galeri sarana.
   - **`src/app/ppdb/page.tsx`:** Kartu unit SDIT mengusung status *"SPMB 2026/2027 Dibuka"* dengan kuota 56 murid (Hanya 2 Rombel). Modal brosur menyematkan showcase poster resmi dengan tautan unduh JPG dan tombol hotline langsung.
   - **`EdukaUnitCards.tsx`:** Kartu jenjang SD di beranda pusat menampilkan foto poster resmi, badge *"Smart Akhlaq Fitrah • SDIT"*, dan 4 pilar fitur unggulan.
   - **`Navbar.tsx`:** Subtitle jenjang SD berubah menjadi *"Smart Akhlaq Fitrah • Majalengka"* dan tombol aksi menjadi *"Info SPMB SD IT"*.
   - **`kontak/page.tsx`, `HelpdeskChatWidget.tsx`, `ContactFormClient.tsx`:** Jalur kontak khusus SDIT diarahkan langsung ke nomor WhatsApp resmi `62895322226104`.
   - **`CMSEditorClient.tsx` & `admin/[schoolSlug]/cms/page.tsx`:** Pilihan preset gambar banner hero menambahkan flyer resmi SPMB dan default slides diselaraskan.
   - **Database SQLite:** Rekor tabel `School` (`slug = 'sd'`) dan `cMSSection` (`hero`, `programs`, `values`, `identity`) telah diperbarui.
   - **Verifikasi Kualitas:** Teruji bebas error pada `npx tsc --noEmit` (Exit Code 0).

---

## 16. UPDATE v3.9 — Sistem Animasi Gelembung Halus Interaktif (Smooth Liquid Bubbles) & Penyempurnaan Judul "SD IT Al-Afiyah"
*(Ditambahkan 26 Sep 2026 — tidak mengganti, melanjutkan dokumen di atas)*

### 16.1 Latar Belakang & Arahan User
Berdasarkan arahan pengguna untuk melengkapi penamaan pilar pendidikan menjadi **SD IT Al-Afiyah** serta menambahkan efek animasi gelembung cair yang halus (*smooth liquid bubble effect*) saat mengarahkan kursor dan mengeklik kartu:
1. **Penyempurnaan Nomenklatur Judul & Subjudul:**
   - Judul seksi fondasi pendidikan secara eksplisit disempurnakan menjadi: **"Tiga Pilar Karakter SD IT Al-Afiyah"** (sebelumnya hanya *"Tiga Pilar Karakter Al-Afiyah"*).
   - Lencana seksi diperbarui menjadi: **"Fondasi Pendidikan SD IT Al-Afiyah"** dengan indikator dot bercahaya emerald berdenyut (*pulse*).
   - Subjudul diperkaya: *"Mendidik peserta didik & murid di SD IT Al-Afiyah tidak hanya unggul dalam kognitif sains, tetapi berakar kuat pada nilai-nilai adab nabawiyah, fitrah kemandirian, dan cinta Al-Qur'an."*

2. **Sistem Animasi Gelembung Halus Interaktif (Smooth Liquid Bubble System):**
   - **Komponen Klien `InteractiveBubbleCard.tsx`:**
     - **Efek Pengikut Kursor (Hover Cursor Follower Bubble):** Gelembung kaca transparan berdiameter 48px yang melayang dan meluncur halus mengikuti koordinat kursor mouse `(x, y)` secara real-time dengan kurva easing `cubic-bezier(0.16, 1, 0.3, 1)`. Gelembung memiliki bentuk organik yang bergoyang lembut (`animate-bubble-wobble`), aksen pantulan kilau putih miring 45° (*specular glint*), dan lingkaran cincin pelangi dalam.
     - **Efek Letupan Gelembung saat Klik (Click Bubble Pop Burst):** Ketika pengguna mengeklik di mana saja pada kartu, titik sentuh memicu gelombang cincin gelembung membesar (`scale: 0.15 -> 2.6`, `opacity: 1 -> 0`) berpadu 6 partikel gelembung mikro satelit yang memancar keluar dan meletus halus selama 650ms.
     - **Elevasi & Pendaran Hover (Card Float & Radial Glow):** Kartu terangkat halus (`hover:-translate-y-1.5 hover:shadow-xl`) dengan pendaran cahaya radial lembut di belakang kursor.
   - **Komponen Latar Belakang `FloatingAmbientBubbles.tsx`:**
     - Menghadirkan gelembung-gelembung kaca mengambang melayang perlahan di latar belakang seksi Stats Bar dan seksi Tiga Pilar Karakter dengan durasi float bervariasi (6.8s - 10s), bayangan lembut, dan arah gerak organik bolak-balik (`animate-bubble-float` & `animate-bubble-float-reverse`).
   - **Penerapan Menyeluruh di Halaman SD IT:**
     - 4 kartu stat kuota dan capaian pada bar statistik.
     - 3 kartu pilar karakter Smart Akhlaq Fitrah SD IT Al-Afiyah lengkap dengan lencana ikon gelembung melayang mengkilap.
     - 8 kartu program unggulan terpadu.

3. **Verifikasi Kualitas:**
   - Kompilasi TypeScript (`npx tsc --noEmit`) tuntas 100% bebas error (Exit Code 0).
   - Pengujian HTTP fetch pada `sd.localhost:3000` berhasil (Status 200 OK) dan memvalidasi keberadaan teks *"Tiga Pilar Karakter SD IT Al-Afiyah"*.

---

## 17. UPDATE v3.10 — Redesain Modern Minimalis: Kartu Interaktif Bernyawa, Efek Zoom Dinamis & Animasi Miring Ikon (Anti-Template)
*(Ditambahkan 26 Sep 2026 — tidak mengganti, melanjutkan dokumen di atas)*

### 17.1 Latar Belakang & Masukan Pengguna
Pengguna memberikan koreksi penting terhadap tampilan gelembung sebelumnya yang terasa terlalu ramai/seperti template generik (*"duh, jadi kaya template bnget., bikin aku yang modern minimalis, bukan gelembung itu yang aku maskud, tapi card2nya yang lebih hidup aja, dan pas mau di klik dia ngezoom gitu dan ada animasi gerak atau miring di icon dalam cardnya"*). 

Desain disempurnakan secara menyeluruh menuju standar estetika **Modern Minimalis** (kelas Apple, Linear, dan Vercel) yang bersih, presisi, berkelas, dan interaktif secara elegan tanpa elemen main-main/klise.

### 17.2 Spesifikasi & Implementasi Desain Modern Minimalis
1. **Pembersihan Total Elemen Gelembung Sabun & Teks Template:**
   - Menghapus komponen gelembung mengambang latar belakang (`FloatingAmbientBubbles`), kursor gelembung sabun organik, cincin ledakan gelembung, serta teks pembantu klise (*"✦ Arahkan & klik gelembung"* dan *"Arahkan & Klik ✦"*).
   - Menghilangkan ornamen gelembung mengkilap 45° pada lencana ikon pilar sehingga ikon tampil bersih dengan kontras tinggi.

2. **Kartu Interaktif Modern Minimalis Bernyawa (`InteractiveBubbleCard.tsx`):**
   - **Smooth Hover Elevation & Zoom:** Kartu merespons kursor dengan perbesaran halus (`hover:scale-[1.03] hover:-translate-y-1.5`) dengan kurva elastis modern `cubic-bezier(0.16, 1, 0.3, 1)`.
   - **Tactile Click Feedback (Active Press):** Ketika kartu diklik atau ditekan, kartu memberikan respon pegas taktil membal (`active:scale-[0.98]`) berpadu cincin pendaran cahaya mikro (*clean light ripple*) yang memuaskan dan responsif.
   - **Spotlight Kursor Halus (Subtle Cursor Spotlight):** Pendaran gradien radial sangat halus (opasitas 10-15%, lebar 220px) yang melacak posisi kursor di dalam kartu, menyinari batas 1px (*subtle 1px border highlight*) layaknya material kaca modern berkelas.

3. **Animasi Ikon Bergerak & Miring (Dynamic Icon Tilt & Spring Physics):**
   - **Penambahan Ikon Minimalis pada 4 Kartu Statistik:**
     - Kartu 1 (*Kuota Penerimaan: Hanya 2 Rombel*): Ikon `Users` dengan lencana emerald dan status SPMB SD IT.
     - Kartu 2 (*Pilar Pendidikan: Smart Akhlaq Fitrah*): Ikon `Sparkles` dengan lencana amber dan status Kurikulum.
     - Kartu 3 (*Akreditasi Sekolah: A Unggul*): Ikon `Award` dengan lencana teal dan status Mutu Resmi.
     - Kartu 4 (*Bimbingan Tahfidz: Juz 30 Mutqin*): Ikon `BookOpen` dengan lencana emerald dan status Target Mutqin.
   - **Animasi Miring Ikon (`.icon-tilt-interactive` & `.icon-tilt-reverse`):**
     - Menggunakan kurva pegas elastis `cubic-bezier(0.34, 1.56, 0.64, 1)` di `src/app/globals.css`.
     - Saat kursor diarahkan (*hover*), wadah ikon otomatis membesar dan miring secara dinamis (`rotate(-12deg) scale(1.15) translateY(-2px)`).
     - Untuk kartu genap, ikon miring ke arah berlawanan (`rotate(12deg)`).
     - Saat diklik (*active/press*), ikon berayun ke sudut sebaliknya (`rotate(8deg) scale(0.96)`) memberikan sensasi taktil yang hidup dan interaktif.
   - **3 Pilar Karakter SD IT Al-Afiyah:**
     - Wadah ikon 3 pilar (`HeartHandshake`, `BookOpen`, `GraduationCap`) kini mengadopsi animasi miring yang sama, berpadu zoom kartu dan transisi warna teks judul saat disorot kursor.

### 17.3 Hasil Verifikasi Kualitas
- **Kompilasi TypeScript:** `npx tsc --noEmit` lolos 100% tanpa error (Exit Code 0).
- **HTTP Endpoint Check:** Halaman `/sd` mengembalikan HTTP 200 OK dengan markup modern minimalis dan kelas interaktif yang aktif.

---

## 18. UPDATE v3.11 — Pembersihan Total Ikon Bertema AI/Sparkles Menjadi Google Material Icons Minimalis
*(Ditambahkan 26 Sep 2026 — tidak mengganti, melanjutkan dokumen di atas)*

### 18.1 Latar Belakang & Aspirasi Pengguna
Pengguna menginstruksikan penghapusan tuntas seluruh ikon yang berkesan AI/AI-slop (*"aku mau yang keliatan icon AI/aislop di ganti ya jadi material icon minamalis ala googele mungkin ya, aku gamau ada icon2 AI dmmna pun"*). Ikon bintang berkilau 4-sudut (*Sparkles* ✨) yang selama ini identik dengan fitur kecerdasan buatan (*generative AI*) dieliminasi 100% dari seluruh modul aplikasi dan digantikan dengan simbol-simbol **Google Material Design** yang semantik, formal, dan berorientasi pendidikan islami.

### 18.2 Standardisasi Ikon Google Material Minimalis
1. **Penyempurnaan 4 Kartu Statistik SD IT Al-Afiyah (`SchoolLandingTemplate.tsx`):**
   - **Kartu 1 (Kuota Penerimaan: Hanya 2 Rombel):** Menggunakan ikon `Users` (Material: `groups` 👥) — lencana emerald SPMB SD IT.
   - **Kartu 2 (Pilar Pendidikan: Smart Akhlaq Fitrah):** Ikon AI (*Sparkles*) diganti menjadi `Compass` (Material: `explore` 🧭) — menyimbolkan kompas fitrah, orientasi akhlak nabawiyah, dan arah pembinaan karakter.
   - **Kartu 3 (Akreditasi Sekolah: A Unggul):** Menggunakan ikon `Award` (Material: `workspace_premium` 🏅) — lencana teal standar mutu resmi.
   - **Kartu 4 (Bimbingan Tahfidz: Juz 30 Mutqin):** Menggunakan ikon `BookOpen` (Material: `menu_book` 📖) — lencana emerald target hafalan.
   - Tetap terintegrasi dengan fisika animasi miring (*spring tilt* `icon-tilt-interactive`) dan *smooth card zoom*.

2. **Audit & Penggantian Menyeluruh di Seluruh Modul Web:**
   - **Pusat Informasi PPDB (`src/app/ppdb/page.tsx`):**
     - Ikon lencana tajuk utama diganti dari `Sparkles` menjadi `GraduationCap` (Material: `school` 🎓).
     - Ikon fasilitas & keunggulan 3 Jalur Masuk diganti dari `Sparkles` menjadi `CheckCircle2` (Material: `check_circle` / `verified` ✔️).
   - **Pendaftaran Mitra Afiliasi (`src/app/affiliate/register/page.tsx`):**
     - Lencana tajuk diganti menjadi `Award` (Material: `workspace_premium`).
     - Kartu kalkulator estimasi komisi diganti menjadi `Calculator` (Material: `calculate` 🧮).
   - **Dasbor Mitra Afiliasi (`src/app/affiliate/dashboard/page.tsx`):**
     - Lencana status kemitraan aktif diganti menjadi `CheckCircle2` (Material: `verified` ✔️).
   - **Konsol Verifikasi Pendaftar (`ApplicantDetailBiodataModal.tsx`):**
     - Seksi kesiapan belajar & tahfidz diganti menjadi `Compass` (Material: `explore`).
   - **Generator Piagam Penghargaan (`CertificatePrintModal.tsx`):**
     - Pusat stempel resmi yayasan diganti dari `Sparkles` menjadi `Award` (Material: `military_tech` emblem yayasan).
   - **Pembersihan Import Tak Terpakai:** Dihapus dari `SiakadHomeView.tsx`, `EditBiodataModal.tsx`, dan `AchievementManagerClient.tsx`.
   - **Seed Basis Data (`prisma/seed.ts`):** Seksi nilai CMS SD IT diselaraskan menggunakan `Compass`.

### 18.3 Hasil Verifikasi Kualitas
- **Audit Pencarian Regex:** Pencarian `Sparkles` di seluruh pohon direktori `src/` menghasilkan **0 temuan** (*zero AI icons remaining*).
- **Kompilasi TypeScript:** `npx tsc --noEmit` lolos 100% tanpa error (Exit Code 0).

---

## 19. UPDATE v3.12 — Eliminasi Top Micro-Header Bar & Relokasi Terintegrasi ke Header Utama dan Footer
*(Ditambahkan 26 Sep 2026 — tidak mengganti, melanjutkan dokumen di atas)*

### 19.1 Latar Belakang & Aspirasi Pengguna
Pengguna menginstruksikan penyederhanaan tajuk atas situs web: *"kayanya header yang atas kecil itu gausah aja deh, tinggal header utama aja ya, yang point2 di header yg kecil mungkin bisa di footage atau di dlem navbar menu yg cocok ya"*. 

Berdasarkan arahan ini, bilah mikro atas (*top micro-header bar*) setinggi 36px dieliminasi seluruhnya untuk menghadirkan pengalaman visual yang lebih lega, minimalis, dan modern. Seluruh fitur, tautan, dan ikon media sosial yang sebelumnya berada di bilah atas direlokasi secara presisi dan bermakna ke dalam menu navigasi utama serta kaki halaman (*footer*).

### 19.2 Spesifikasi Relokasi & Implementasi Arsitektur
1. **Pembersihan Total Top Micro-Bar (`Navbar.tsx`):**
   - Menghapus kontainer `top micro-header bar` yang sebelumnya memuat ikon sosial media dan quick links.
   - Header utama (`<header>`) kini langsung menjadi elemen puncak yang bersih dan melayang anggun di atas hero banner (*transparent-to-white on scroll*).
   - Menyesuaikan batas pemicu scroll sticky dari `36px` menjadi `20px` (`setIsScrolled(window.scrollY > 20)`) agar respon transisi ke putih solid terasa lebih instan dan luwes.

2. **Integrasi Tombol "Login Portal" di Header Utama (`Navbar.tsx`):**
   - Pada jajaran aksi desktop di sisi kanan navbar, ditambahkan tombol `Login Portal` berikon `LogIn` tepat sebelum tombol pill PPDB.
   - Tombol ini mengadopsi pewarnaan adaptif: semi-transparan putih dengan aksen amber saat di puncak (`text-white/90 hover:text-amber-300`), dan slate elegan dengan sentuhan zamrud saat di-scroll (`text-slate-700 hover:text-[#184F48]`).
   - Pada mobile drawer navigasi, tombol `Login Portal Layanan & Akademik` disematkan rapi berdampingan dengan tombol pendaftaran dan bantuan WhatsApp.

3. **Pengayaan Menu Navigasi "Lainnya" & Spotlight Search:**
   - Memasukkan tautan langsung *"Tanya Ustadz & Konsultasi"* (langsung menuju hotline WhatsApp syar'i asatidzah) ke dalam dropdown menu *"Lainnya"*.
   - Mendaftarkan entri konsultasi ke dalam indeks *Quick Spotlight Search Modal*.

4. **Restrukturisasi Kaki Halaman (`Footer.tsx`):**
   - **Ikon Media Sosial Resmi (Kolom 1):** Menyematkan 4 ikon media sosial interaktif (Instagram, Facebook, YouTube, dan WhatsApp) dengan animasi hover warna khusus di bawah deskripsi identitas Yayasan.
   - **Kolom Dedicated "Layanan & Kajian Islami" (Kolom 3):** Menampung seluruh tautan yang sebelumnya di bilah atas:
     - `Artikel & Kajian Islam` (`/berita?cat=kajian`)
     - `Doa & Dzikir Harian` (`/doa-dzikir`)
     - `Al-Qur'an & Agenda Kegiatan` (`/agenda`)
     - `Tanya Ustadz (Konsultasi Syar'i)` (Direct WhatsApp chat)
     - `SIAKAD Mobile Murid` (`/portal/siakad`)
     - `Login Portal Layanan & Akademik` (`/login`)
   - **Tautan Cepat Hak Cipta Bawah:** Menyertakan link cepat `Login Portal` dan `Doa & Dzikir` di baris footer terbawah.

### 19.3 Hasil Verifikasi Kualitas
- **Kompilasi TypeScript:** `npx tsc --noEmit` lolos 100% tanpa error (Exit Code 0).
- **HTTP Endpoint Check:** Halaman utama (`http://localhost:3000`) mengembalikan respon HTTP 200 OK.

---

## 20. UPDATE v3.13 — Resolusi Offside Judul Hero Slider & Penyelarasan Tipografi Header Solid Putih
*(Ditambahkan 26 Sep 2026 — tidak mengganti, melanjutkan dokumen di atas)*

### 20.1 Latar Belakang Masalah (Bug Diagnosis)
Pengguna melaporkan dua kendala visual penting:
1. **Banner Offside & Tumpang Tindih:** Judul dan badge di banner hero terdorong terlalu ke atas hingga tertutup oleh header (*"masa ketimpa2 di header sama offside terus ya itu judulnya sama ga rapi malah naik ke atas judul di banneernya"*).
   - **Akar Penyebab (Root Cause):** Pada `UnitHeroSlider.tsx` dan `EdukaHeroSlider.tsx`, kontainer teks dibatasi oleh `min-h-[380px] sm:min-h-[400px]` dengan elemen slide anak `absolute inset-0 flex flex-col justify-center`. Ketika teks slide (badge, h1 multi-baris, deskripsi, 2 tombol, trust items) memiliki tinggi fisik total ~520px, fungsi `justify-center` membagi sisa tinggi negatif ke atas dan ke bawah, sehingga mendorong ujung atas konten naik sebesar ~65px melewati padding dan masuk langsung ke balik header (`y < 72px`). Selain itu, `flex items-center` pada elemen `<section>` membatalkan efek bantalan padding atas.
2. **Inkonsistensi Warna Teks Nama Unit di Header:** Teks Latin nama unit sekolah (seperti `SD IT Al-Afiyah`) di bawah kaligrafi Arab tampak berbeda tingkat keputihannya/redup dibandingkan teks Arab (*"sama tulisan sd it di header kok ga sesuai putihnya pas di awal atau kamu atur ya biar sama"*).
   - **Akar Penyebab:** Teks Latin sebelumnya menggunakan `text-white/95` (opasitas 95%) dengan kelas bayangan `drop-shadow-xs` (yang bukan kelas valid di Tailwind v4, sehingga tidak menghasilkan drop-shadow), sedangkan teks Arab menggunakan `text-white` murni berpadu `drop-shadow-sm`.

### 20.2 Solusi & Implementasi
1. **Perbaikan Layout & Posisi Banner Hero (`UnitHeroSlider.tsx` & `EdukaHeroSlider.tsx`):**
   - Menghapus `flex items-center` pada `<section>` dan menggantinya dengan `flex flex-col justify-start` serta tinggi minimal proporsional (`min-h-[660px] sm:min-h-[700px] lg:min-h-[740px]`).
   - Menetapkan padding atas yang konsisten dan aman di bawah header: `pt-32 sm:pt-36 lg:pt-40 pb-16 sm:pb-20 lg:pb-24`.
   - Mengubah penataan slide anak dari `absolute inset-0 flex flex-col justify-center` menjadi **`absolute inset-x-0 top-0 flex flex-col justify-start`** dengan wadah `min-h-[460px] sm:min-h-[480px] lg:min-h-[500px]`. Hal ini menjamin bahwa titik puncak slide selalu terpancang rapi di bawah header tanpa pernah bergeser ke atas.
   - Menyesuaikan ukuran judul `h1` menjadi `text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight leading-[1.2] sm:leading-[1.22] drop-shadow-md` agar judul multi-baris tampil ringkas, elegan, dan proporsional.

2. **Penyelarasan Tipografi Murni Putih di Header (`Navbar.tsx` & `SchoolLandingTemplate.tsx`):**
   - Menyeragamkan warna teks Latin nama unit (`brandConfig.title`) menjadi `text-white font-extrabold drop-shadow-sm` berpadu efek hover `group-hover:text-amber-300`, persis 100% identik dengan teks kaligrafi Arab.
   - Menambahkan lencana jenjang emas minimalis (`{brandConfig.code}` berlatar `bg-amber-400 text-stone-950 font-black`) di samping nama unit untuk penegasan identitas sekolah dengan kontras tinggi.
   - Memastikan `transparentAtTop={true}` diteruskan secara eksplisit dari `SchoolLandingTemplate.tsx` ke `Navbar` dan memperluas deteksi `isDarkHeroPage` agar mencakup seluruh rute unit sekolah.

### 20.3 Hasil Verifikasi Kualitas
- **Kompilasi TypeScript:** `npx tsc --noEmit` lolos 100% tanpa error (Exit Code 0).
- **HTTP Endpoint Check:** Halaman utama (`/`) dan halaman unit SD IT (`/sd`) mengembalikan status HTTP 200 OK dengan konten banner yang lapang dan tidak terpotong header.

---

## 21. UPDATE v3.14 — Pembersihan Lencana Kuning SD & Pemulihan Tampilan Banner Hero Bebas Tabrakan
*(Ditambahkan 26 Sep 2026 — tidak mengganti, melanjutkan dokumen di atas)*

### 21.1 Latar Belakang & Aspirasi Pengguna
Pengguna menyampaikan koreksi penting terkait tampilan:
1. **Permintaan Penghapusan Badge Kuning "SD":** Pengguna secara eksplisit meminta label kuning "SD" di samping nama unit dihapus (*"sama tulisan SD yang kuning ga usah"*), menginginkan tipografi header yang bersih dan terpadu.
2. **Klarifikasi & Pemulihan Visibilitas Banner Hero:** Pengguna mengamati banner seolah menghilang (*"kok malah hilang bannernya"*).
   - **Analisis Diagnosis:** Ketika pengguna mengeklik tautan dropdown seperti *"Profil & Karakter SD IT Al-Afiyah"* (`/sd#values`), peramban otomatis menggulir (*auto-scroll*) halaman langsung ke jangkar `#values`, sehingga banner hero tergulir ke atas di luar area pandang (*viewport*). Selain itu, tombol navigasi panah kiri (`ChevronLeft`) pada slider sebelumnya diposisikan di `top-1/2 left-4` yang bertabrakan langsung dengan baris kata judul *"Ananda"*, serta Next.js sempat mencatat peringatan `Image fill with height 0` akibat wadah animasi *Ken Burns* menggunakan `relative` alih-alih `absolute inset-0`.

### 21.2 Solusi & Implementasi
1. **Penghapusan Lencana Kuning "SD" di Navbar (`src/components/layout/Navbar.tsx`):**
   - Menghapus elemen `<span className="bg-amber-400 ...">{brandConfig.code}</span>` di samping `brandConfig.title`.
   - Nama sekolah Latin (`SD IT AL-AFIYAH`) kini tampil murni, elegan, berukuran `text-xs sm:text-sm font-extrabold uppercase tracking-wider text-white drop-shadow-sm` saat transparan, dan `text-slate-800` saat bergulir ke bawah, serasi sempurna dengan kaligrafi Arab di atasnya.
   - Menambahkan event handler `onClick` pada logo merek dan tombol menu *"Beranda"* yang memicu `window.scrollTo({ top: 0, behavior: 'smooth' })`, sehingga kapan pun pengguna mengeklik Beranda atau logo dari bagian bawah halaman, peramban selalu mengantarkan pandangan kembali ke puncak banner hero.

2. **Penyempurnaan Wadah Gambar & Eliminasi Tabrakan Teks (`UnitHeroSlider.tsx` & `EdukaHeroSlider.tsx`):**
   - Mengubah wadah animasi *Ken Burns* dari `relative w-full h-full` menjadi **`absolute inset-0 w-full h-full overflow-hidden`** sehingga elemen `Image` dengan atribut `fill` selalu memiliki resolusi tinggi penuh (100% non-zero) tanpa pesan peringatan.
   - Memindahkan kontrol navigasi slider dari tombol panah mengambang di tengah layar yang menabrak teks, menjadi **kapsul kontrol modern minimalis di bagian tengah bawah (`absolute bottom-6 left-1/2 -translate-x-1/2`)** yang menyatukan tombol panah mikro kiri/kanan dengan titik indikator slide progresif (`bg-black/45 backdrop-blur-md border border-white/15`). Teks judul dan tombol aksi kini bebas 100% dari tabrakan visual.
   - Menata ulang baris *trust highlights* menjadi `max-w-4xl` dengan `whitespace-nowrap` sehingga keempat poin keunggulan (*Hanya 2 Rombel, Smart Akhlaq Fitrah, Iman Sebelum Qur'an, T.A. 2026/2027*) tersusun rapi dalam satu baris horizontal tanpa terpotong.

3. **Penyempurnaan Listener Scroll Header (`Navbar.tsx`):**
   - Menambahkan pemantau peristiwa `hashchange` dan `resize` serta *dual timeout check* agar status transisi header (`isScrolled`) langsung mendeteksi pergeseran posisi gulir seketika saat navigasi jangkar hash terjadi.

### 21.3 Hasil Verifikasi Kualitas
- **Kompilasi TypeScript:** `npx tsc --noEmit` lolos 100% tanpa error (Exit Code 0).
- **Verifikasi Visual (Chrome Headless CDP):** 
  - Tangkapan layar pada `y=0` mengonfirmasi banner hero tampil utuh, dramatis, dengan teks judul presisi, tanpa badge kuning SD, dan tanpa tabrakan tombol panah.
  - Tangkapan layar saat bergulir mengonfirmasi header bertransisi mulus ke latar belakang putih solid (`bg-white/95 backdrop-blur-md`).

---

## 22. UPDATE v3.15 — Pemulihan Tuntas Banner SD IT (Zero-Collapse Height Lock & Defensive Crash-Proofing)
*(Ditambahkan 26 Sep 2026 — tidak mengganti, melanjutkan dokumen di atas)*

### 22.1 Latar Belakang & Masukan Pengguna
Pengguna menyampaikan koreksi penting bahwa banner hero pada halaman SD IT Al-Afiyah masih belum muncul (*"mASIH HILANG, tolong kembalikan bannner2 sd"*). Berdasarkan tangkapan layar pengguna pada `sd.localhost:3000`, posisi peramban berada di puncak halaman (`window.scrollY = 0`), namun komponen banner hero (`UnitHeroSlider`) mengalami keruntuhan tinggi (*height collapse to 0px*) di dalam wadah flexbox (`flex flex-col`), sehingga seksi 4 Kartu Statistik langsung melompat ke bawah navbar transparan.

### 22.2 Akar Masalah & Solusi Komprehensif
1. **Penyebab Keruntuhan Tinggi (*Flexbox Zero-Height Collapse*):**
   - Di dalam wadah induk berorientasi flex kolom (`<div className="min-h-screen flex flex-col ...">`), elemen `<section>` yang hanya mengandalkan utilitas kelas dinamis `min-h-[660px]` tanpa `height: 100%` eksplisit dan memiliki seluruh elemen turunan berposisi `absolute` rentan menyusut (*flex-shrink: 1*) menjadi 0px pada *layout pass* awal peramban. Akibatnya, Next.js Image mencatat peringatan `Image with src ... has "fill" and a height value of 0` dan peramban menyembunyikan banner dari tampilan.
2. **Penguncian Ketinggian Mutlak (*Explicit Zero-Collapse Height Lock*):**
   - Menambahkan gaya inline eksplisit `style={{ minHeight: '680px' }}` dan utilitas `w-full flex-shrink-0` pada elemen `<section>` di `UnitHeroSlider.tsx` dan `EdukaHeroSlider.tsx`.
   - Menambahkan `style={{ minHeight: '100%', height: '100%' }}` pada setiap kontainer latar belakang slide individual sehingga elemen `Image fill` selalu memiliki ruang ukur pasti (100% non-zero) di semua mesin rendering peramban.
3. **Optimasi Prioritas Prapemuatan Gambar (*Priority Optimization*):**
   - Mengubah atribut `priority` pada elemen `Image` menjadi selektif `priority={idx === 0}`. Hanya slide pertama yang aktif dimuat dengan prioritas tinggi, mencegah kelebihan beban pemanggilan gambar latar belakang secara bersamaan.
4. **Pertahanan Anti-Crash Ekstrem (*Defensive Crash-Proof Rendering*):**
   - Memberikan fallback aman pada seluruh pemrosesan teks (`(s.titlePart1 || '').trim()`, `(s.titleHighlight || '').trim()`, `(s.titlePart2 || '').trim()`, `(s.badge || '').trim()`, `s.description || ''`).
   - Menyediakan tautan dan label tombol default yang tangguh (`s.primaryCtaLink || ppdbUrl`, `s.secondaryCtaLink || waUrl`), serta menetapkan nilai default `registrationFee = 175000` pada interface props komponen. Komponen dijamin 100% tidak akan pernah mengalami unmount akibat `TypeError`.
5. **Konfirmasi Bebas Lencana Kuning SD:**
   - Memastikan nama sekolah di navbar tetap bersih elegan (`SD IT AL-AFIYAH`) dalam warna putih solid bersinar lembut tanpa badge kuning, memenuhi arahan pengguna *"sama tulisan SD yang kuning ga usah"*.

### 22.3 Hasil Verifikasi Kualitas
- **Kompilasi TypeScript:** `npx tsc --noEmit` lolos 100% tanpa error (Exit Code 0).
- **Pengujian Headless Chrome CDP:**
  - **Slide 1:** Berhasil dimuat sempurna pada puncak halaman menampilkan judul *"Bukan Sekadar Tempat Belajar, Namun Juga Tempat Bertumbuh Ananda"*, lencana SPMB, tombol pendaftaran dan WhatsApp, serta foto greenhouse.
  - **Slide 2:** Berhasil bertransisi mulus menampilkan *"Edukasi Nyata di Alam Terbuka & Kebun Sekolah"* dan foto kebun edukasi.
  - **Slide 3:** Berhasil bertransisi mulus menampilkan *"Membentuk Pribadi Mandiri & Beradab Sejak Dini"* dan foto aktivitas murid.
- **Konsol Peramban:** Bersih dari peringatan `height value of 0` dan tidak ada eksepsi runtime.

---

## 23. UPDATE v3.16 — Rilis Produksi, Refinement Hero SD IT & Data SPMB SD IT T.A. 2027/2028
*(Ditambahkan 5 Okt 2026 — tidak mengganti, melanjutkan dokumen di atas)*

### 23.1 Rilis Produksi (Supabase + Vercel)
- **Database:** produksi berjalan di Supabase PostgreSQL via Prisma.
- **Build:** `prisma generate` di skrip `build` & `postinstall` (`package.json`).
- **Routing hybrid:** `src/lib/domain.ts` + `src/proxy.ts` — path (`/sd`, `/tk`, `/smp`) di `*.vercel.app`, subdomain di domain kustom. `matcher` proxy mengecualikan `_next/static`, `_next/image`, favicon & aset berekstensi.
- **Deploy:** setiap push ke `main` otomatis di-deploy Vercel.
- **Catatan operasional:** error *"MIME type text/plain"* pada CSS saat deploy beruntun adalah *version skew* (hash CSS baru belum tersedia → 404). Solusi: hard refresh; pencegahan: Vercel Skew Protection. Temuan terbuka: `X-Frame-Options` didefinisikan ganda (`DENY` di proxy, `SAMEORIGIN` di `next.config.ts`).

### 23.2 Refinement UI Landing SD IT
- **Judul hero final (SD):** baris aksen *"Bukan Sekedar"* (Playfair italic, `text-2xl sm:text-3xl lg:text-4xl`), lalu *"Tempat Belajar, / Namun Juga / Tempat Bertumbuh"* (`text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-[1.15] tracking-tight`, baris terakhir hijau SD). Kata *"Ananda"* dihapus. Kontainer teks `max-w-xl lg:max-w-2xl text-left`.
- **Hero umum:** satu CTA hijau, badge mengambang minimal, tanpa kontrol slider, deskripsi lebih sempit, font script tak terpakai dihapus.
- **Kartu statistik:** bento 2x2 ringkas dengan umpan balik taktil `:active`; peluncur Helpdesk disembunyikan di mobile.
- **Identitas SD:** scope `theme-sd` (green-600) diterapkan ke Navbar, StickyMobileBar, Footer & landing.
- **Kartu Program & Nilai:** struktur `flex flex-col h-full`, footer *"Terintegrasi Kurikulum"* dikunci di dasar kartu (`mt-auto pt-4`).
- **Program Unggulan:** tombol *"Daftar di Program Ini →"* dihapus.

### 23.3 Data SPMB SD IT Al-Afiyah T.A. 2027/2028 (Poster Resmi)
| Item | Nilai |
| :--- | :--- |
| Kuota | Hanya 2 Rombel |
| Hotline/WA SD | 0813-1013-9001 (`6281310139001`) |
| Alamat | Lingkungan Giri Asih – Jl. Gerakan Koperasi, Majalengka Wetan |
| Syarat usia | 6 tahun per 1 Juli 2027 (`calculateAgePerJuly2027`) |
| Gelombang 1 | 1 Okt – 30 Des 2026 · formulir Rp 250.000 |
| Gelombang 2 | 1 Jan – 3 Apr 2027 · formulir Rp 275.000 |
| Gelombang 3 | 6 Apr – 26 Jun 2027 · formulir Rp 300.000 |

**Investasi Pendidikan (Putra / Putri):** Pengembangan 2.500.000 / 2.500.000 · Perlengkapan 2.350.000 / 2.600.000 · Kegiatan 1.450.000 / 1.450.000 · SPP Juli 300.000 / 300.000 · Sarpras 1.580.000 / 1.580.000 · **Total 8.180.000 / 8.430.000**. Diimplementasikan sebagai `feeRows` per unit + toggle Putra/Putri di kalkulator `/ppdb`.

**10 Program Unggulan:** Mendidik dengan Sunnah · Akhlaq dan Ilmu · Lingkungan Nyaman & Asri · Basic Literasi & Numerasi · Outdoor Learning · Pelatihan Aqil-Baligh · Pemetaan Potensi Bakat & Skill · Tahfidz Qur'an · Penumbuhan Karakter Bakat · Pembelajaran Berfokus pada Proses (dua terakhir: deskripsi ditulis tim, menunggu konfirmasi sekolah).

**Implementasi:**
- 3 poster (`sd-spmb-poster-2027.jpg`, `sd-spmb-brosur.jpg`, `sd-spmb-story.jpg`) dengan switcher thumbnail di `SchoolLandingTemplate.tsx`; preset di `CMSEditorClient.tsx`.
- T.A. 2027/2028 site-wide. **Tetap 2026/2027** (tahun berjalan): SIAKAD, Buku Induk, kalender agenda, berita STS, slug berita SPMB lama.
- Sinkronisasi DB produksi: `scripts/update_sd_fee.ts` (biaya, gelombang, WA, alamat, 10 program CMS) & `scripts/update_sd_spmb_content.ts` (artikel pengumuman SPMB → 2027/2028). **Rekening bank tidak diubah.**
- **Kebijakan aset:** `/images/*` di-cache browser 7 hari (`max-age=604800`). Pembaruan gambar WAJIB memakai nama file baru (berversi), bukan menimpa file lama.

### 23.4 Item Terbuka (Menunggu Data/Keputusan)
- Tanggal tes/observasi SPMB 2027/2028 (masih "Sabtu, 28 Maret 2026").
- Gelombang & biaya SMP; "Maret 2026" di kartu murid.
- Potongan saudara/tahfidz SD di kalkulator (tidak tercantum di poster).
- Ekskul, fasilitas & syarat pendaftaran belum tampil sebagai teks (hanya di brosur).
- Fallback biaya SD di `admin/[schoolSlug]/cms/page.tsx`.
- Nomor yayasan lama 0812-2334-4552 di navbar, footer, kontak TK/SMP, StickyMobileBar & form kontak.
- Resolusi poster ~723px (menunggu file asli).

### 23.5 Hasil Verifikasi Kualitas
- `npm run build` lolos tanpa error.
- Deploy Vercel `1531b37` & `1869a9d`: *Deployment has completed*.
- `/sd` live memuat poster berversi, judul pengumuman T.A. 2027/2028, WA 6281310139001 & alamat Giri Asih.

### 23.6 Revisi — Urutan Galeri Poster SPMB (5 Okt 2026)
- Urutan `SPMB_POSTERS` di `SchoolLandingTemplate.tsx`: **1) Story "Telah Dibuka"** (foto peserta didik putri, default aktif), **2) Brosur Biaya & Syarat**, **3) Poster Kuota Terbatas** (sebelumnya berlabel "Poster Utama").
- Preview, thumbnail, modal, dan tombol "Unduh … (JPG)" mengikuti item terpilih secara reaktif (`activePoster`).

### 23.7 Revisi — Bingkai Poster Penuh (5 Okt 2026)
- Bingkai preview tidak lagi berasio tetap `aspect-[5/7]` + `object-contain` (menyisakan pita kosong pada Story 9:16).
- Gambar kini `block w-full h-auto` dengan `width/height` intrinsik per item di `SPMB_POSTERS`; bingkai mengikuti rasio asli setiap poster, penuh kiri-kanan, tanpa crop. `object-cover` sengaja tidak dipakai agar teks poster (judul & footer sosial media) tidak terpotong.

### 23.8 Revisi — Relokasi Section Poster & Brosur SPMB ke Atas (5 Okt 2026)
- Komponen `<section id="pengumuman">` (Poster & Brosur SPMB) di `SchoolLandingTemplate.tsx` dipindahkan ke bagian atas halaman utama, tepat berada di bawah Hero Section & Bento Stats Bar.
- Urutan tata letak halaman utama kini menjadi: Hero Section → Bento Stats Bar → **Poster & Brosur SPMB** → 3 Pilar Karakter → Program Unggulan → Dewan Guru → Galeri Aktivitas.
- Seluruh fungsionalitas preview poster, tab switcher, dan tombol unduh tetap bekerja responsif dan reaktif.

### 23.9 Revisi — Sistem Tracking Referral Afiliasi Persisten 30 Hari (5 Okt 2026)
- **Modul Utility (`src/lib/referral.ts`):** Menyediakan fungsi `saveReferralCode()` dan `getStoredReferralCode()` yang mengelola Cookie persisten (`alafiyah_ref` & `alafiyah_ref_code`, 30 hari) dan `localStorage` (`alafiyah_ref_code`).
- **Penangkapan Server & Client:** Middleware Next.js (`src/proxy.ts`) dan Root Layout Tracker (`ReferralTracker.tsx`) menangkap parameter `?ref=` / `?referral=`. Jika pengunjung berpindah halaman atau me-refresh peramban tanpa query param, rujukan lama **tidak terhapus**.
- **Pre-fill & Auto-Lock Form (`src/app/ppdb/daftar/page.tsx`):** Input referral pada formulir pendaftaran terisi otomatis dari cookie/storage dan dikunci (`readOnly`) dengan status `"🔒 Terkunci Otomatis dari Link / Cookie Mitra Afiliasi"`.
- **Atribusi Database (`src/app/api/ppdb/register/route.ts`):** Payload pendaftaran membawa `referralCode` yang dikorelasikan dengan `AffiliateProfile` dan disimpan ke `PPDBRegistration.affiliateId`.

### 23.10 Revisi — Standardisasi Navigasi Same-Tab (Anti-Penumpukan Tab Peramban/HP) (5 Okt 2026)
- **Standardisasi Target Navigasi:** Menghapus atribut `target="_blank"` dan properti `openInNewTab` pada seluruh link internal ekosistem (Satuan Pendidikan TK/SD/SMP, Navbar PPDB Online, Kartu Unit Pendidikan, tombol "Daftar Sekarang" di Hero & Footer).
- **Pengalaman Pengguna (Mobile/Desktop Ergonomics):** Seluruh perpindahan halaman di dalam website berjalan di **Tab yang Sama** (`target="_self"`), sehingga pengunjung ponsel/desktop dapat menavigasi dengan mudah memakai tombol Back/Kembali peramban tanpa membanjiri browser dengan puluhan tab terbuka.
- **Pengecualian Link Eksternal:** HANYA link ke platform pihak ketiga (seperti WhatsApp `wa.me`, Google Maps, dan file dokumen unduhan) yang dipertahankan membuka tab baru (`target="_blank"`).

### 23.11 Revisi — Penyelarasan Istilah SPMB, Link New Tab, Referral, & Loading State (5 Okt 2026)
- **Penyelarasan Istilah:** Menyeragamkan seluruh sebutan pendaftaran dari "PPDB" menjadi "SPMB" ("Daftar SPMB SD IT", "Daftar SPMB Online", "Informasi & Alur SPMB", "Formulir SPMB Online", dsb.) pada Navbar, Sticky Mobile Bar, Helpdesk Chat Widget, Hero Slider, dan section landing.
- **Link Pendaftaran & New Tab (`target="_blank"`):** Seluruh tombol CTA pendaftaran SPMB membuka tab baru secara konsisten (`target="_blank"` & `rel="noopener noreferrer"`).
- **Pengekalan Referral:** Menggabungkan `getStoredReferralCode()` ke seluruh pautan pendaftaran SPMB sehingga URL yang dibuka menyertakan `?ref=KODE_MITRA`.
- **Visual Loading State:** Menambahkan state `isOpeningSpmb` / spinner dan teks "Membuka SPMB..." pada saat tombol CTA pendaftaran diklik agar antarmuka memberikan responsivitas visual instan tanpa membeku.

### 23.12 Revisi — Skala Ukuran Font & Tipografi Hero Section Mobile (5 Okt 2026)
- **Subheadline Italic ("Bukan Sekedar"):** Dinaikkan ukurannya ke `text-2xl sm:text-3xl lg:text-4xl italic font-normal tracking-wide` di `UnitHeroSlider.tsx`.
- **Headline Utama ("Tempat Belajar, Namun Juga Tempat Bertumbuh"):** Ditegaskan dengan `text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-[1.15]`.
- **Paragraf Deskripsi:** Dinaikkan dari `text-sm text-neutral-300` menjadi `text-sm sm:text-base lg:text-lg leading-relaxed text-neutral-200` agar terbaca dengan jelas di layar HP.
- **Daftar Poin Informasi (Trust Items):** Dinaikkan ke `text-xs sm:text-sm font-medium text-neutral-200` dengan pembatas aksen hijau `border-l-2 border-emerald-500/60` yang tegas dan rapi.

### 23.13 Revisi — Tata Kelola Mandiri CMS SD, Pembersihan Redundansi Navbar & Kesiapan Google Search Console (7 Okt 2026)
- **Isolasi Mutlak Multi-Tenant CMS SD (`schoolSlug === 'sd'`):**
  1. Penambahan Tab 9 (**Pilar Karakter** - mengelola `/sd/karakter`) dan Tab 10 (**Profil & Visi Misi** - mengelola `/sd/profil`).
  2. Tab 9 & 10 diproteksi ketat hanya tampil dan tersimpan untuk unit SD IT Al-Afiyah Majalengka.
  3. Kunci gabungan database Prisma `@@unique([schoolId, sectionKey])` menjamin bahwa unit TK, SMP, dan Yayasan memiliki rekor data terpisah (UUID berbeda) dan tidak akan pernah tertimpa.
- **Pembersihan Redundansi & Eliminasi Menu Dobel di Navbar (`Navbar.tsx`):**
  1. *Dewan Guru & Asatidzah:* Dihapus dari *Program & Keunggulan*, kini difokuskan secara eksklusif pada menu *Profil* (`/sd/guru`).
  2. *Dokumentasi & Belajar:* Dihapus dari *Program & Keunggulan*, kini berada eksklusif pada menu *Profil* (`/sd/dokumentasi`).
  3. *Pilar Karakter & Nilai Islami:* Dihapus dari *Profil*, kini berada eksklusif pada menu *Program & Keunggulan* (`/sd/karakter`).
  4. *Layanan Tata Usaha:* Dihapus dari *Lainnya*, kini berada eksklusif pada menu *Profil* (`/sd/kontak`). Menu *Lainnya* difokuskan sebagai *Pusat Bantuan WhatsApp SD IT*.
- **Sinkronisasi Dinamis Seluruh Halaman SD:**
  1. Halaman `/sd/guru`, `/sd/karakter`, `/sd/profil`, `/sd/program`, `/sd/testimoni`, `/sd/dokumentasi`, `/sd/kontak`, dan `/sd/spmb` kini dinamis (`revalidate = 0`) membaca langsung dari database `cMSSection`.
  2. API Handler `/api/admin/cms` secara otomatis merevalidasi cache halaman saat admin mengklik "Simpan Perubahan".
- **Akses Pintas Cepat (Quick Actions) di CMS SD (`CMSEditorClient.tsx`):**
  1. Disediakan tombol pintas langsung di header editor CMS: **Kelola Guru ↗** (`/admin/sd/teachers`), **Kelola Berita ↗** (`/admin/sd/news`), dan **Prestasi ↗** (`/admin/sd/achievements`).
- **Kesiapan Google Search Console & SEO Browser Indexing:**
  1. `src/app/sitemap.ts` diperbarui mencakup seluruh rute publik unit SD: `/sd`, `/sd/spmb`, `/sd/spmb/daftar`, `/sd/profil`, `/sd/program`, `/sd/karakter`, `/sd/guru`, `/sd/dokumentasi`, `/sd/testimoni`, `/sd/berita`, `/sd/agenda`, `/sd/doa-dzikir`, dan `/sd/kontak`.
  2. Setiap halaman dilengkapi metadata unik (Title, Description, Canonical URL, OpenGraph) untuk memaksimalkan peringkat pencarian di Google Search dan peramban ponsel.

### 23.14 Revisi — Penyelarasan Total Editor Konten CMS SD dengan Realitas Halaman Publik (8 Okt 2026)
- **Akar Masalah (Root Cause):**
  1. Bagian editor CMS SD (`/admin/sd/cms`) sebelumnya memuat nilai-nilai dummy / umum bawaan template lama (misalnya pada tab *Nilai Keunggulan* memuat "Akidah & Akhlakul Karimah", counter angka statistik memuat angka umum "Murid Aktif 450+", galeri fasilitas di DB terpotong hanya 4 item, dan biaya pendaftaran masih tertulis Rp 200.000).
  2. Slide 3 pada fallback carousel masih merujuk ke file gambar AI lama (`/images/sd-hero-activity.jpg`) yang sudah dihapus.
  3. `SchoolLandingTemplate.tsx` sebelumnya mengabaikan `school.stats` dari database dan hanya merender array statis `defaultStats`.
- **Solusi & Penyelarasan Menyeluruh:**
  1. **Tab 1 (Banner & Slide Hero):** Memperbarui Slide 3 menggunakan foto asli greenhouse bambu (`/images/sd-hero-greenhouse.jpg`) dan memastikan teks judul universal serta badge kuota seragam.
  2. **Tab 2 (Profil, Alamat & Kontak):** Menyelaraskan identitas resmi unit menjadi `SD IT Al-Afiyah Majalengka`, badge `TERAKREDITASI B • YPIB GUGUS 3 NUSA INDAH`, email `sditalafiyahmjl@gmail.com`, dan jam pelayanan TU yang akurat.
  3. **Tab 3 (Counter Angka Statistik):** Menyelaraskan 4 angka capaian SD IT menjadi:
     - `Kuota Penerimaan`: `Hanya 2 Rombel`
     - `Pilar Pendidikan`: `Smart Akhlaq Fitrah`
     - `Akreditasi Sekolah`: `Terakreditasi B`
     - `Bimbingan Tahfidz`: `Juz 30 Mutqin`
     Serta memodifikasi `SchoolLandingTemplate.tsx` agar memanfaatkan `displayStats` reaktif yang bersumber dari database CMS.
  4. **Tab 4 (Nilai & Pilar Keunggulan):** Menyelaraskan 3 pilar karakter otentik SD IT Al-Afiyah:
     - `Mendidik dengan Sunnah & Karakter Nabawiyah`
     - `Smart, Literasi & Tahfidz Qur'an`
     - `Outdoor Learning & Pelatihan Aqil-Baligh`
  5. **Tab 5 (Program Pilihan):** Mengisi 10 program unggulan resmi SPMB SD IT T.A. 2027/2028.
  6. **Tab 6 (Galeri & Fasilitas):** Mengisi 11 foto dokumentasi lapangan nyata aktivitas siswi/murid SD IT (shalat berjamaah, da'i cilik, kelas 6B, greenhouse, kolam biofloc, futsal, halaqah tahfidz).
  7. **Tab 8 (Biaya & Kuota SPMB):** Menyelaraskan formulir pendaftaran Rp 250.000, SPP Rp 400.000, pengembangan Rp 3.500.000, kuota 60 murid (2 rombel), dan gelombang Gelombang 1 (T.A. 2027/2028).
  8. **Sinkronisasi Database Cloud (`cMSSection`):** Mengeksekusi script sinkronisasi database untuk memperbarui dan menyimpan seluruh payload section SD IT secara permanen di Supabase cloud.
- **Hasil Verifikasi:** `npm run build` lolos 100% tanpa error (62/62 rute valid).

### 23.15 Revisi — Penyelarasan Pratinjau Live (Live Preview) CMS SD IT & Eliminasi Kekosongan Tab 9 & 10 (8 Okt 2026)
- **Akar Masalah (Root Cause):**
  1. Pada komponen `CMSEditorClient.tsx`, blok `viewMode === 'preview'` sebelumnya hanya memiliki kondisi rendering untuk tab `hero`, `identity`, `stats`, `values`, `programs`, `facilities`, `testimonials`, `tuition`, dan `affiliate`.
  2. Tab 9 (`sd_karakter`) dan Tab 10 (`sd_profil`) sama sekali tidak memiliki blok render pratinjau (`activeTab === 'sd_karakter'` dan `activeTab === 'sd_profil'`), sehingga saat admin berpindah ke mode Pratinjau Live, area layar bawah menjadi kosong melompong (hanya bilah chrome browser atas yang terlihat).
  3. Pratinjau live untuk tab lain (seperti *Stats*, *Values*, *Tuition*) masih menggunakan kartu template generik (misalnya gradasi gelap untuk statistik, ikon toga polos untuk pilar) yang berbeda jauh dengan estetika visual asli halaman beranda `/sd`.
- **Implementasi Solusi & Rekayasa Komponen:**
  1. **Penambahan Pratinjau Live Tab 9 (`sd_karakter`):**
     - Header Banner bernuansa hijau gradasi `#064e3b` hingga `#00A651` dengan badge *Character Building • Smart Akhlaq Fitrah*, headline dinamis, dan deskripsi.
     - Pratinjau 3 Pilar Karakter Nabawiyah (*Mendidik dengan Sunnah*, *Smart Literasi & Tahfidz*, *Outdoor Learning*) lengkap dengan badge nomor, tagline, deskripsi, dan checklist butir poin dengan ikon `CheckCircle2`.
     - Pratinjau 7 Karakter Profil Murid (*Salimul Aqidah*, *Shahihul Ibadah*, *Matinul Khuluq*, dll) dalam grid kartu interaktif dengan ikon `Sun`.
  2. **Penambahan Pratinjau Live Tab 10 (`sd_profil`):**
     - Header Banner resmi Profil & Legalitas SD IT Al-Afiyah Majalengka.
     - Kartu Visi berbingkai hijau zamrud dengan kutipan terformat elegan.
     - Kartu Misi berpenomoran numerik terpadu (01 s.d. 06).
     - Grid Data Satuan Pendidikan & Legalitas Resmi BAN-SM (NPSN, NSS, Akreditasi B, Gugus 3 Nusa Indah, Yayasan YPIB, Alamat Lingkungan Giri Asih).
  3. **Penyelarasan Pratinjau Live Tab 1 (Hero):**
     - Menggunakan tombol CTA hijau zamrud `#00A651` (Daftar SPMB SD IT Online & WhatsApp Panitia) dan fallback foto greenhouse bambu asli.
  4. **Penyelarasan Pratinjau Live Tab 3 (Stats):**
     - Mengubah tampilan preview unit SD menjadi 2×2 Bento Grid berlatar `neutral-50` dengan ikon Users, Compass, Award, dan BookOpen persis seperti yang tampil di website `/sd`.
  5. **Penyelarasan Pratinjau Live Tab 4 (Values):**
     - Menampilkan 3 kartu pilar karakter otentik dengan badge Pilar 01/02/03 dan footer *Prinsip Smart Akhlaq Fitrah*.
  6. **Penyelarasan Pratinjau Live Tab 8 (Tuition / SPMB):**
     - Menampilkan visual poster resmi Story SPMB, rincian biaya pendaftaran, SPP, dan Uang Pengembangan, serta visual kartu Rekening Resmi Bank Muamalat (1360012405) a.n SMP / SD IT Al Afiyah.
  7. **Integritas Data & Isolasi Multi-Tenant:**
     - Seluruh pratinjau dan tab tambahan ini terisolasi eksklusif untuk `schoolSlug === 'sd'`, memastikan unit TK, SMP, dan Yayasan tidak terpengaruh sedikit pun.
- **Hasil Verifikasi:**
  - Build produksi lolos 100% (62 dari 62 rute Next.js valid, 0 error).

---

*Dokumen ini bersifat akumulatif. Setiap update baru DITAMBAHKAN di bawah,*
*tidak pernah mengganti atau menghapus bagian yang sudah ada di atas.*
*Versi terakhir: 3.20.0 — 8 Okt 2026*





