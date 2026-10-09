# Design System & UI/UX Guidelines: Ekosistem Pendidikan Terpadu Al-Afiyah

Dokumen ini merupakan pedoman resmi (*Single Source of Truth*) untuk seluruh perancangan antarmuka (UI), pengalaman pengguna (UX), serta implementasi frontend di seluruh portal dan sistem **Ekosistem Pendidikan Terpadu Al-Afiyah Majalengka** (Yayasan Pendidikan Imam Bonjol, TK IT, SDIT, SMP IT, Portal SPMB/PPDB, SIAKAD Mobile, dan Panel Admin).

Setiap pengembang dan asisten AI **wajib** mengikuti aturan dalam dokumen ini agar seluruh halaman memiliki estetika konsisten, berkelas (*premium*), islami modern, dan berstandar industri.

---

## 1. Filosofi & Visi Desain

1. **Modern Islamic Elegance (Adab & Kemajuan Sains)**:
   - Menggabungkan ketenangan nilai islami nabawiyah dengan kepraktisan teknologi modern.
   - Menggunakan motif arsitektur islami minimalis (*pointed arches*, *mushaf geometric contours*, *subtle Islamic lattice*) yang halus, bersih, dan kontemporer.
2. **Human-Crafted & High Polish ("Anti AI-Look")**:
   - Menghindari tata letak generik dan membosankan (*boxy*, *flat*, atau *cookie-cutter*).
   - Menggunakan *glassmorphism* elegan (`backdrop-blur`), *micro-interactions* taktil, transisi halus, serta *contrast hierarchy* yang tegas.
3. **Multi-Tenant Identity with Unified Harmony**:
   - Setiap jenjang unit (TK IT, SDIT, SMP IT, Yayasan) memiliki aksen warna dan nuansa khas, tetapi tetap berada di bawah satu bahasa visual (*design language*) yang harmonis.
4. **Mobile-First & Performance-Driven**:
   - Akses pendaftaran wali murid dan pemantauan peserta didik mayoritas dilakukan via smartphone. Semua elemen harus ramah sentuhan (*touch-friendly*), memiliki *Sticky Mobile Action Bar*, dan waktu muat instan (*Core Web Vitals* optimal).

---

## 2. Palet Warna & Identitas Unit (Color Tokens)

Sistem warna diatur melalui variabel Tailwind CSS (`globals.css` & `@theme`):

### 2.1. Warna Inti Ekosistem Al-Afiyah
| Token | Nilai Hex / OKLCH | Peran / Kegunaan |
|---|---|---|
| `--color-softwater-dark` | `#184F48` | Hijau Zamrud Tua (Warna brand resmi yayasan & header) |
| `--color-softwater` | `#2D7A70` | Hijau Teal Mowilex Soft Water (Aksen primer antarmuka) |
| `--color-softwater-light` | `#E8F3F1` | Background subtle kartu & badge terakreditasi |
| `--color-gold` | `#D97706` | Emas Berwibawa (Aksen prestasi & bintang hikmah) |
| `--color-gold-light` | `#F59E0B` | Kuning Emas Cerah (Highlight teks dan tombol peringatan) |
| `--color-gold-subtle` | `#FFFBEB` | Latar belakang notifikasi & kupon referral |

### 2.2. Identitas Khusus Tiap Satuan Pendidikan
Setiap jenjang unit memiliki identitas visual yang terisolasi dan spesifik:

```
┌────────────────────────────────────────────────────────────────────────┐
│  SDIT AL-AFIYAH (Unggulan & Flagship - Smart Akhlaq Fitrah)            │
│  - Warna Aksen/CTA : #00A651 (Hijau Segar Resmi SDIT - Pill, Badge, CTA)│
│  - Dark Foundation : bg-emerald-950 (Seragam utk Dark Section & Banner) │
│  - Larangan Keras  : DILARANG memakai #00A651 sebagai background blok/section!│
│  - Warna Highlight : #D97706 (Amber Emas)                               │
│  - Palette Scope   : .theme-sd (Me-remap seluruh utility teal/emerald)  │
│  - Logo Resmi      : /images/sd-logo.png (Wajib di favicon & navbar)    │
├────────────────────────────────────────────────────────────────────────┤
│  TK IT AL-AFIYAH (Taman Ceria Usia Emas & Sentra Nabawiyah)             │
│  - Warna Utama  : #10B981 (Emerald Ceria)                              │
│  - Warna Aksen  : #FBBF24 (Kuning Ceria Ramah Anak)                    │
│  - Karakter     : Sudut rounded bulat besar, ilustrasi bermain ramah   │
├────────────────────────────────────────────────────────────────────────┤
│  SMP IT AL-AFIYAH (Karakter Pemimpin Qur'ani & Berwawasan Global)      │
│  - Warna Utama  : #064E3B (Deep Forest Emerald)                        │
│  - Warna Aksen  : #B45309 (Deep Gold)                                  │
│  - Karakter     : Tipografi formal, layout berwibawa, prestasi peserta didik  │
├────────────────────────────────────────────────────────────────────────┤
│  SIAKAD MOBILE (Portal Mutaba'ah & Wali Peserta Didik PWA)                    │
│  - Warna Utama  : #10B981 (Teal Hijau Aplikasi)                        │
│  - Karakter     : Bottom Navigation Bar, Card List, Fast Touch UI       │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Standar Tipografi & Penulisan Teks

### 3.1. Font Families
1. **Primary Sans (`var(--font-sans)`)**: **Plus Jakarta Sans**
   - Bobot yang digunakan: `400` (Body), `500` (Medium), `600` (Semi-bold), `700` (Bold), `800` (Extra-bold).
   - Pengaturan default: `letter-spacing: 0.005em`, `word-spacing: 0.06em`.
2. **Editorial Serif Accent (`var(--font-playfair)`)**: **Playfair Display**
   - Digunakan untuk aksen italic pada headline hero (*Contoh: "Bukan Sekedar"*).
3. **Arabic Scripture**: **Scheherazade New** / **Amiri**
   - Digunakan untuk basmalah, hadits, dan ayat Al-Qur'an pada doa-dzikir dan mutaba'ah.

### 3.2. Hierarki Teks & Judul
- **Hero Display**: `text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-[1.15]`
- **Section Heading (H2)**: `text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight`
- **Card Title (H3)**: `text-lg sm:text-xl font-bold text-slate-900 leading-snug`
- **Body Text**: `text-sm sm:text-base text-slate-600 leading-relaxed font-normal`
- **Overline Badge**: `text-[11px] sm:text-xs font-semibold tracking-wider uppercase`

### 3.3. Aturan Spasi Teks (Anti-Dempet Rule)
- Pada seluruh form CMS dan template headline multi-bagian, **wajib menyertakan spasi di akhir bagian awal** atau menggunakan spasi pemisah kondisional:
  ```tsx
  {/* BENAR: Menjamin ada spasi antara Part 1 dan Highlight */}
  {titlePart1}
  {titlePart1 && !titlePart1.endsWith(' ') ? ' ' : ''}
  <span className={highlightClass}>{titleHighlight}</span>
  ```
- **Hindari kata penutup yang redundan** pada headline SDIT (kata *"Ananda"* telah ditiadakan dari Judul Penutup agar struktur headline 3-baris tetap padat dan proporsional).

---

## 4. Komponen & Standar Tata Letak (Layout System)

### 4.1. Kontainer & Grid
- **Lebar Maksimal Halaman**: `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8` (1280px).
- **Lebar Form / Artikel**: `max-w-3xl` atau `max-w-4xl mx-auto`.
- **Lebar Tabel Admin**: `max-w-screen-2xl mx-auto`.
- **Jarak Clearance Navbar**: Hero section di halaman publik wajib memiliki *padding top* aman agar tidak tertutup navbar:
  ```css
  padding-top: clamp(108px, 14vh, 140px);
  ```

### 4.2. Hero Banner Carousel
1. **Konsep 1 Teks Universal + 3 Gambar Berputar**:
   - Seluruh teks headline, badge, deskripsi, dan tombol CTA tetap **statis** (tidak berubah atau berkedip).
   - Hanya **3 gambar latar belakang** yang berputar secara bergantian dengan durasi 4.5 detik.
   - Transisi latar belakang menggunakan **Smooth Crossfade (1000ms)** dipadukan dengan efek **Ken Burns Zoom** (`animate-kenburns`).
2. **Struktur Tipografi Hero SDIT**:
   - Baris 1 (*Accent Italic Serif*): `Bukan Sekedar`
   - Baris 2 (*Bold Sans*): `Tempat Belajar,`
   - Baris 3 (*Bold Sans*): `Namun Juga`
   - Baris 4 (*Bold Highlight Accent*): `Tempat Bertumbuh`

### 4.3. Kartu (*Cards*) & Glassmorphism
- **Kartu Standar (`glass-card`)**:
  ```tsx
  className="bg-white/92 backdrop-blur-md border border-slate-200/80 rounded-2xl p-6 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300"
  ```
- **Kartu Prestasi / Unggulan**:
  Gunakan border gradient halus (`border-emerald-500/20`) dengan aksen bintang hikmah emas.
- **Radius Sudut**:
  - Badge / Tombol Kecil: `rounded-full` atau `rounded-xl`.
  - Kartu & Dialog: `rounded-2xl` (16px) hingga `rounded-3xl` (24px).

### 4.4. Tombol Interaktif (*Buttons & CTAs*)
1. **Primary Button**:
   - Latar belakang penuh kontras tinggi (SDIT: `#00A651` / TK: `#10B981` / Yayasan: `#184F48`).
   - Efek taktil mikro: `hover:-translate-y-0.5 active:scale-95 transition-all duration-200 shadow-md`.
   - Menggunakan ikon pengarah di kanan (`ArrowRight className="w-4 h-4 group-hover:translate-x-1"`).
2. **Secondary / Outline Button**:
   - `bg-white/10 hover:bg-white/20 border border-white/25 text-white backdrop-blur-md`.
3. **Tombol Hapus Galeri (Red Cross X)**:
   - Harus memiliki konfirmasi atau aksi instan yang **menyimpan mutasi ke backend API** serta membersihkan *localStorage*, agar foto yang dihapus tidak muncul kembali (*zero-resurrection*).

### 4.5. Floating Elements
- **Helpdesk WhatsApp Chat Widget**: Melayang di pojok kanan bawah (`fixed bottom-6 right-6 z-40`), memiliki pulse animation dan responsivitas mobile (bersembunyi otomatis jika keyboard aktif).
- **Sticky Mobile Bar**: Melayang di bagian bawah layar smartphone pada halaman landing unit, menyediakan tombol cepat *"Daftar SPMB"* dan *"Konsultasi WA"*.

---

## 5. Ikonografi & Media Grafis

1. **Logo Resmi Sekolah**:
   - Seluruh halaman, browser tab, dan dokumen cetak SDIT wajib menggunakan **Logo Resmi SDIT Al-Afiyah** (`/images/sd-logo.png` & `/favicon.ico`).
   - Dilarang keras memuat logo default Vercel, logo placeholder SVG, atau ikon pihak ketiga yang tidak berhubungan.
2. **Perpustakaan Ikon**:
   - Menggunakan `lucide-react` dengan `strokeWidth={1.75}` atau `2`.
   - Ikon yang umum: `HeartHandshake` (Adab), `BookOpen` (Al-Qur'an), `GraduationCap` (Akademik), `ShieldCheck` (Mutu/Akreditasi), `Users` (Rasio Kelas).
3. **Foto & Dokumentasi Nyata**:
   - Semua foto kegiatan murid dan guru wajib menggunakan dokumentasi asli Al-Afiyah (greenhouse bambu, halaqah tahfidz, kebun sayur, shalat berjamaah, futsal).
   - Gambar harus dimuat menggunakan komponen `next/image` dengan atribut `sizes`, `priority` untuk LCP hero, dan aspek rasio konsisten (`aspect-[4/3]` atau `aspect-[16/9]`).

---

## 6. Aksesibilitas (WCAG 2.1 AA) & Keamanan UI

1. **Rasio Kontras Minimum**:
   - Teks biasa terhadap latar belakang minimal **4.5:1**.
   - Teks judul besar terhadap latar belakang minimal **3:0:1**.
   - Pada hero banner gelap, wajib dilapisi gradien kontras (`from-black/90 via-black/75 to-black/40`) agar teks putih selalu terbaca tajam tanpa silau.
2. **Fokus Keyboard & Navigasi**:
   - Semua elemen interaktif (`<a>`, `<button>`, `<input>`) wajib memiliki indikator fokus yang jelas (`focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:outline-none`).
3. **Tata Letak Bebas Pergeseran (*Zero Cumulative Layout Shift*)**:
   - Banner hero, logo, dan gambar galeri wajib menentukan dimensi eksplisit atau `fill` dengan kontainer berspesifikasi rasio tinggi-lebar pasti.

---

## 7. Checklist Implementasi Frontend Baru

Sebelum menyelesaikan pembuatan halaman atau komponen baru, pastikan:

- [ ] Menggunakan warna dan token sesuai satuan pendidikan yang dituju (misal: `.theme-sd` untuk SDIT).
- [ ] Favicon dan tab browser menampilkan Logo Resmi SDIT Al-Afiyah (`/images/sd-logo.png`).
- [ ] Teks judul tidak ada yang bertabrakan (*dempet*) atau memuat kata usang (*Ananda* pada penutup).
- [ ] Fitur hapus (seperti pada galeri/CMS) telah menyimpan perubahan ke database backend (`/api/admin/cms`).
- [ ] Tombol memiliki *state hover*, *active*, dan *loading indicator*.
- [ ] Responsif dari resolusi mobile (360px) hingga layar desktop ultra-wide (1920px).
- [ ] Lulus uji ketik TypeScript (`npx tsc --noEmit`) dengan 0 error.
