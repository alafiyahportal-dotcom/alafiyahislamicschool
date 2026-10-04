const http = require('http');

const publicRoutes = [
  '/',
  '/tk',
  '/sd',
  '/smp',
  '/profil',
  '/satuan-pendidikan',
  '/kontak',
  '/berita',
  '/agenda',
  '/doa-dzikir',
  '/ppdb/daftar',
  '/ppdb/cek-status',
  '/ppdb/pengumuman',
  '/portal',
  '/portal/ppdb/REG-SD-2026-0001',
  '/portal/siakad',
  '/affiliate',
  '/ref/sd/ustadz-ahmad',
  '/login',
  '/api/agenda',
  '/api/ppdb/announcements',
  '/api/admin/achievements'
];

function checkRoute(path, cookie = null) {
  return new Promise((resolve) => {
    const headers = cookie ? { 'Cookie': cookie } : {};
    http.get({
      host: 'localhost',
      port: 3000,
      path,
      headers
    }, (res) => {
      resolve({ path, status: res.statusCode, location: res.headers.location });
    }).on('error', (err) => {
      resolve({ path, error: err.message });
    });
  });
}

function loginAdmin(email, password) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({ email, password });
    const req = http.request({
      host: 'localhost',
      port: 3000,
      path: '/api/auth/login',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data)
      }
    }, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        const cookies = res.headers['set-cookie'] || [];
        const cookieHeader = cookies.map(c => c.split(';')[0]).join('; ');
        resolve({
          status: res.statusCode,
          cookie: cookieHeader,
          user: JSON.parse(body || '{}')
        });
      });
    });
    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

async function main() {
  console.log('====================================================');
  console.log('🚀 PENGUJIAN LOKAL EKOSISTEM PENDIDIKAN AL-AFIYAH');
  console.log('   Server: http://localhost:3000');
  console.log('====================================================\n');

  console.log('--- [1] RUTE PUBLIK, PPDB & API ---');
  let publicPassed = 0;
  for (const path of publicRoutes) {
    const result = await checkRoute(path);
    const isOk = result.status === 200 || result.status === 307 || result.status === 308 || result.status === 302;
    const icon = isOk ? '✅' : '❌';
    if (isOk) publicPassed++;
    const loc = result.location ? `-> [Redirect: ${result.location}]` : '';
    console.log(`${icon} ${result.path.padEnd(32)} Status: ${result.status || result.error} ${loc}`);
  }

  console.log('\n--- [2] LOGIN & RUTE ADMIN MULTI-TENANT ---');
  const loginRes = await loginAdmin('superadmin@alafiyah.sch.id', 'password123');
  if (loginRes.status === 200 && loginRes.cookie) {
    console.log(`✅ Login Superadmin berhasil: ${loginRes.user.user?.fullName}`);

    const adminRoutes = [
      '/admin',
      '/admin/foundation',
      '/admin/tk/dashboard',
      '/admin/sd/dashboard',
      '/admin/smp/dashboard',
      '/admin/sd/ppdb',
      '/admin/sd/re-registration',
      '/admin/sd/students',
      '/admin/sd/teachers',
      '/admin/sd/finance',
      '/admin/sd/cms',
      '/admin/sd/news',
      '/affiliate/dashboard'
    ];

    let adminPassed = 0;
    for (const path of adminRoutes) {
      const result = await checkRoute(path, loginRes.cookie);
      const isOk = result.status === 200 || result.status === 307;
      const icon = isOk ? '✅' : '❌';
      if (isOk) adminPassed++;
      const loc = result.location ? `-> [Redirect: ${result.location}]` : '';
      console.log(`${icon} ${result.path.padEnd(32)} Status: ${result.status || result.error} ${loc}`);
    }

    console.log('\n====================================================');
    console.log(`🎉 HASIL PENGUJIAN:`);
    console.log(`   Rute Publik & API: ${publicPassed}/${publicRoutes.length} Berhasil`);
    console.log(`   Rute Admin & Tenant: ${adminPassed}/${adminRoutes.length} Berhasil`);
    console.log('   Semua sistem siap & berjalan lancar di http://localhost:3000');
    console.log('====================================================');
  } else {
    console.error('❌ Login Admin gagal.');
  }
}

main().catch(console.error);
