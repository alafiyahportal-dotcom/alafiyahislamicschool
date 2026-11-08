#!/usr/bin/env bash
# ==============================================================================
# SCRIPT 3: AUTO-SETUP CLOUD VPS DOMAINESIA (UBUNTU 22.04 / 24.04 LTS)
# Ekosistem Pendidikan Terpadu Al-Afiyah (alafiyah.id, sdit, smpit, tkit)
# ==============================================================================
set -e

echo "=================================================================="
echo "🚀 Memulai Setup Server VPS Al-Afiyah (Ubuntu + PostgreSQL + Nginx)"
echo "=================================================================="

# 1. Buat Swap RAM 2 GB (agar build Next.js aman di VPS 2 GB RAM)
if [ ! -f /swapfile ]; then
  echo "⏳ [1/6] Membuat Swap Memory 2 GB..."
  sudo fallocate -l 2G /swapfile
  sudo chmod 600 /swapfile
  sudo mkswap /swapfile
  sudo swapon /swapfile
  echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
else
  echo "✅ [1/6] Swapfile sudah aktif."
fi

# 2. Update paket & install dependensi dasar + Nginx + Certbot + PostgreSQL
echo "⏳ [2/6] Menginstal PostgreSQL, Nginx, Certbot SSL, dan Git..."
sudo apt-get update -y
sudo apt-get install -y curl git unzip nginx postgresql postgresql-contrib certbot python3-certbot-nginx

# 3. Install Node.js 20 LTS & PM2
if ! command -v node &> /dev/null; then
  echo "⏳ [3/6] Menginstal Node.js 20 LTS..."
  curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
  sudo apt-get install -y nodejs
fi
sudo npm install -g pm2

# 4. Buat user & database PostgreSQL lokal
DB_USER="alafiyah_user"
DB_PASS="AlAfiyahBerkah2027_DbPass"
DB_NAME="alafiyah_db"

echo "⏳ [4/6] Menyiapkan Database PostgreSQL lokal (${DB_NAME})..."
sudo -u postgres psql -tc "SELECT 1 FROM pg_roles WHERE rolname='${DB_USER}'" | grep -q 1 || \
  sudo -u postgres psql -c "CREATE USER ${DB_USER} WITH PASSWORD '${DB_PASS}';"

sudo -u postgres psql -tc "SELECT 1 FROM pg_database WHERE datname='${DB_NAME}'" | grep -q 1 || \
  sudo -u postgres psql -c "CREATE DATABASE ${DB_NAME} OWNER ${DB_USER};"

sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE ${DB_NAME} TO ${DB_USER};"

# 5. Pasang Konfigurasi Nginx Multi-Domain (alafiyah.id, sdit, smpit, tkit)
echo "⏳ [5/6] Mengonfigurasi Nginx Reverse Proxy (Support Upload Video s.d 250 MB)..."
sudo tee /etc/nginx/sites-available/alafiyah > /dev/null << 'EOF'
server {
    listen 80;
    server_name alafiyah.id www.alafiyah.id sdit.alafiyah.id smpit.alafiyah.id tkit.alafiyah.id;

    # Izinkan unggahan foto & video hingga 250 MB (bebas limit 4.5MB Vercel)
    client_max_body_size 250M;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 300s;
        proxy_send_timeout 300s;
    }
}
EOF

sudo ln -sf /etc/nginx/sites-available/alafiyah /etc/nginx/sites-enabled/alafiyah
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t && sudo systemctl reload nginx

echo ""
echo "=================================================================="
echo "✅ SETUP DASAR VPS SELESAI!"
echo "=================================================================="
echo "Database URL lokal untuk file .env di VPS:"
echo "DATABASE_URL=\"postgresql://${DB_USER}:${DB_PASS}@127.0.0.1:5432/${DB_NAME}?schema=public\""
echo "DIRECT_URL=\"postgresql://${DB_USER}:${DB_PASS}@127.0.0.1:5432/${DB_NAME}?schema=public\""
echo ""
echo "Langkah selanjutnya setelah DNS diarahkan ke IP VPS ini:"
echo "sudo certbot --nginx -d alafiyah.id -d www.alafiyah.id -d sdit.alafiyah.id -d smpit.alafiyah.id -d tkit.alafiyah.id"
echo "=================================================================="
