# PANDUAN DEPLOYMENT & MIGRASI PRODUKSI
# Ekosistem Pendidikan Terpadu Multi-Tenant Al-Afiyah
**Institusi:** Yayasan Pendidikan Imam Bonjol Majalengka  
**Unit Sekolah:** TK IT Al-Afiyah | SDIT Al-Afiyah | SMP IT Al-Afiyah  
**Versi Dokumen:** 1.0.0-PROD-RELEASE (Sprint 8 - Milestone 20)

---

## 1. Ikhtisar Arsitektur Sistem

Ekosistem Al-Afiyah dibangun menggunakan kerangka kerja modern **Next.js 16 App Router**, **TypeScript**, **Tailwind CSS**, dan **Prisma ORM**. 

Sistem ini mengadopsi prinsip isolasi multi-tenant terpadu (*logical multi-tenancy*), di mana seluruh data unit sekolah (TK, SD, SMP) dan kantor pusat yayasan dikelola dalam satu basis data relasional dengan indeks performa tinggi `schoolId`.

### Perbedaan Lingkungan Pengembangan vs Produksi:
| Komponen | Lingkungan Pengembangan (Dev / Testing) | Lingkungan Rilis Produksi (Production) |
| :--- | :--- | :--- |
| **Basis Data** | SQLite tersemat lokal (`file:./dev.db`) | PostgreSQL 16+ (Supabase, Neon, atau VPS PostgreSQL) |
| **Penyimpanan Berkas** | Lokal disk (`/public/uploads/ppdb/`) | Persistent Docker Volume atau Object Storage (S3/Supabase) |
| **Payment Gateway** | Simulator Midtrans Snap Sandbox Lokal | Midtrans Production API (QRIS & Virtual Account Real) |
| **WhatsApp Service** | Simulator WhatsApp Engine (`NotificationLog`) | Fonnte / Wablas / Twilio WhatsApp Gateway Resmi |
| **Server Hosting** | `localhost:3000` via Next.js dev server | Docker Compose / Vercel / Nginx Reverse Proxy dengan SSL |

---

## 2. Panduan Migrasi Basis Data: SQLite ke PostgreSQL

Prisma ORM dirancang dengan portabilitas skema tinggi. Untuk mengalihkan basis data dari SQLite lokal ke PostgreSQL cloud, ikuti 4 langkah sederhana berikut:

### Langkah 2.1: Ubah Provider di `prisma/schema.prisma`
Buka file `prisma/schema.prisma` dan ganti blok `datasource db`:

```prisma
// SEBELUMNYA (Pengembangan Lokal):
datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}

// UBAH MENJADI (Produksi PostgreSQL):
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

### Langkah 2.2: Konfigurasi `DATABASE_URL` di File `.env`
Ganti nilai `DATABASE_URL` dengan string koneksi PostgreSQL produksi Anda:

```env
# Contoh Supabase Cloud Database:
DATABASE_URL="postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres?schema=public"

# Contoh Neon Serverless PostgreSQL:
DATABASE_URL="postgresql://[USER]:[PASSWORD]@[ENDPOINT].neon.tech/alafiyah_db?sslmode=require"

# Contoh Server / VPS Mandiri Yayasan:
DATABASE_URL="postgresql://alafiyah_user:password_rahasia_2026@localhost:5432/alafiyah_prod?schema=public"
```

### Langkah 2.3: Eksekusi Migrasi Skema ke Basis Data Baru
Jalankan perintah berikut di terminal:

```bash
# 1. Regenerasi Prisma Client untuk PostgreSQL
npx prisma generate

# 2. Terapkan seluruh skema tabel, relasi, dan indeks ke PostgreSQL
npx prisma db push
```

### Langkah 2.4: Masukkan Data Awal (Seeding Data Resmi)
Isi basis data produksi baru dengan unit sekolah, akun demo panitia, dan pengaturan gelombang awal:

```bash
npx tsx prisma/seed.ts
```

*Seluruh 3 unit sekolah (TK, SD, SMP), akun superadmin yayasan, admin unit, kasir keuangan, dan profil konten awal akan langsung terbuat secara otomatis.*

---

## 3. Opsi Deployment A: Menggunakan Docker & Docker Compose (Rekomendasi VPS Yayasan)

Deployment berbasis kontainer Docker memberikan isolasi penuh, kemudahan pemeliharaan, serta performa maksimal pada server VPS (Ubuntu 22.04 / Debian 12).

### Persyaratan Awal Server VPS:
- Sistem Operasi: Ubuntu 22.04 LTS atau yang lebih baru
- RAM: Minimal 2 GB (Disarankan 4 GB)
- Disk: Minimal 20 GB SSD
- Terpasang: Docker Engine & Docker Compose

### Langkah Instalasi di Server:
```bash
# 1. Clone repositori ke server
git clone https://github.com/yayasan-imambonjol/ekosistem-alafiyah.git /var/www/ekosistem-alafiyah
cd /var/www/ekosistem-alafiyah

# 2. Salin template konfigurasi lingkungan
cp .env.example .env

# 3. Sesuaikan variabel produksi pada file .env
nano .env

# 4. Jalankan aplikasi dan database PostgreSQL via Docker Compose
docker compose up -d --build

# 5. Inisialisasi skema basis data di dalam container
docker compose exec app npx prisma db push
docker compose exec app npx tsx prisma/seed.ts

# 6. Periksa status kontainer
docker compose ps
```

*Aplikasi kini berjalan secara aman di port `3000` dan PostgreSQL di port `5432`.*

---

## 4. Opsi Deployment B: Vercel + Supabase (Serverless Cloud)

Jika yayasan memilih infrastruktur *fully-managed* tanpa perlu merawat server fisik:

1. Buat proyek basis data gratis di [Supabase.com](https://supabase.com).
2. Dapatkan Connection String PostgreSQL (Transaction Mode / Direct).
3. Hubungkan repositori GitHub ke [Vercel.com](https://vercel.com).
4. Masukkan Variabel Lingkungan di Vercel Dashboard (*Project Settings $\rightarrow$ Environment Variables*):
   - `DATABASE_URL`: String koneksi Supabase Anda.
   - `APP_SECRET`: String acak 32 karakter.
   - `NEXT_PUBLIC_APP_URL`: Domain resmi yayasan (misal: `https://alafiyah.sch.id`).
5. Klik **Deploy**. Vercel akan otomatis melakukan kompilasi build produksi.

---

## 5. Konfigurasi Payment Gateway Midtrans Produksi

Untuk menerima pembayaran formulir PPDB secara langsung ke rekening kas yayasan via QRIS otomatis dan Virtual Account bank (BCA, Mandiri, BRI, BNI, BSI):

1. Masuk ke portal [Midtrans Merchant Administration Portal (MAP)](https://dashboard.midtrans.com).
2. Pilih mode **Production** (bukan Sandbox).
3. Salin kredensial dari menu *Settings $\rightarrow$ Access Keys*:
   - `Server Key` $\rightarrow$ Simpan di `.env` sebagai `MIDTRANS_SERVER_KEY`
   - `Client Key` $\rightarrow$ Simpan di `.env` sebagai `MIDTRANS_CLIENT_KEY` dan `NEXT_PUBLIC_MIDTRANS_CLIENT_KEY`
4. Konfigurasi Notifikasi Webhook di menu *Settings $\rightarrow$ Configuration*:
   - **Payment Notification URL:** `https://alafiyah.sch.id/api/payments/midtrans-webhook`
5. Atur `MIDTRANS_IS_PRODUCTION=true` pada file `.env`.

---

## 6. Konfigurasi WhatsApp Notification Gateway

Untuk mengirimkan pesan konfirmasi pendaftaran, tanda terima kuitansi kas masuk, dan jadwal observasi langsung ke nomor WhatsApp calon wali peserta didik:

1. Daftarkan nomor WhatsApp resmi yayasan pada penyedia WhatsApp Gateway (misal: [Fonnte.com](https://fonnte.com) atau Wablas).
2. Dapatkan API Token perangkat.
3. Masukkan ke file `.env`:
   ```env
   WHATSAPP_GATEWAY_URL="https://api.fonnte.com/send"
   WHATSAPP_API_TOKEN="token_resmi_fonnte_yayasan_anda"
   WHATSAPP_SENDER_NUMBER="6281234567890"
   ```
4. Sistem `src/services/whatsapp.service.ts` secara cerdas akan langsung beralih dari mode simulasi ke mode pengiriman HTTP POST live ke WhatsApp Gateway.

---

## 7. Konfigurasi Reverse Proxy Nginx & Sertifikat SSL Gratis (Let's Encrypt)

Untuk mengarahkan domain resmi `alafiyah.sch.id` ke kontainer Docker Next.js di port `3000`:

### Konfigurasi Nginx (`/etc/nginx/sites-available/alafiyah.sch.id`):
```nginx
server {
    listen 80;
    server_name alafiyah.sch.id www.alafiyah.sch.id;

    # Batas ukuran unggah berkas formulir (10 MB)
    client_max_body_size 10M;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### Pasang Sertifikat SSL HTTPS Gratis:
```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d alafiyah.sch.id -d www.alafiyah.sch.id
```

---

## 8. Prosedur Pencadangan Data Harian (Backup & Recovery SOP)

Untuk menjamin keamanan data peserta didik dan tagihan keuangan yayasan dari risiko kehilangan data, pasang script pencadangan otomatis harian via cron job:

```bash
# Buat script backup otomatis di server
cat << 'EOF' > /var/scripts/backup-alafiyah.sh
#!/bin/bash
BACKUP_DIR="/var/backups/alafiyah"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
mkdir -p $BACKUP_DIR

# Backup PostgreSQL Database
docker exec alafiyah_db pg_dump -U alafiyah_user alafiyah_db | gzip > "$BACKUP_DIR/db_$TIMESTAMP.sql.gz"

# Backup Berkas Fisik Unggahan PPDB
tar -czf "$BACKUP_DIR/uploads_$TIMESTAMP.tar.gz" -C /var/www/ekosistem-alafiyah/public uploads

# Hapus backup yang lebih tua dari 30 hari
find $BACKUP_DIR -type f -mtime +30 -delete
EOF

chmod +x /var/scripts/backup-alafiyah.sh
```

Pasang pada Crontab (`crontab -e`) untuk berjalan setiap pukul 02.00 dini hari:
```cron
0 2 * * * /var/scripts/backup-alafiyah.sh > /dev/null 2>&1
```

---

*Disahkan oleh Tim Pengembang & Arsitek Sistem Ekosistem Al-Afiyah untuk Yayasan Pendidikan Imam Bonjol Majalengka.*
