import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

async function runRestore() {
  const backupDir = path.join(process.cwd(), '.backups');

  if (!fs.existsSync(backupDir)) {
    console.error('❌ Folder .backups tidak ditemukan!');
    process.exit(1);
  }

  const targetFileArg = process.argv[2];
  let backupFile = '';

  if (targetFileArg) {
    backupFile = path.isAbsolute(targetFileArg) ? targetFileArg : path.join(process.cwd(), targetFileArg);
  } else {
    const files = fs.readdirSync(backupDir).filter((f) => f.endsWith('.json')).sort().reverse();
    if (files.length === 0) {
      console.error('❌ Tidak ditemukan file backup JSON di dalam folder .backups!');
      process.exit(1);
    }
    backupFile = path.join(backupDir, files[0]);
  }

  console.log(`🔄 Memulihkan database dari snapshot: ${backupFile}...`);
  const rawContent = fs.readFileSync(backupFile, 'utf-8');
  const backup = JSON.parse(rawContent);

  try {
    // 1. Restore Schools
    if (backup.data?.schools?.length) {
      for (const s of backup.data.schools) {
        await prisma.school.upsert({
          where: { slug: s.slug },
          update: s,
          create: s,
        });
      }
      console.log(`✓ Dipulihkan: ${backup.data.schools.length} Data Sekolah`);
    }

    // 2. Restore Users
    if (backup.data?.users?.length) {
      for (const u of backup.data.users) {
        await prisma.user.upsert({
          where: { email: u.email },
          update: u,
          create: u,
        });
      }
      console.log(`✓ Dipulihkan: ${backup.data.users.length} Akun Pengguna`);
    }

    // 3. Restore CMS Sections
    if (backup.data?.cmsSections?.length) {
      for (const cs of backup.data.cmsSections) {
        await prisma.cMSSection.upsert({
          where: { schoolId_sectionKey: { schoolId: cs.schoolId, sectionKey: cs.sectionKey } },
          update: cs,
          create: cs,
        });
      }
      console.log(`✓ Dipulihkan: ${backup.data.cmsSections.length} Konten CMS Website`);
    }

    console.log(`\n🎉 Pemulihan data pokok database sukses diselesaikan!`);
  } catch (error) {
    console.error('❌ Gagal memulihkan database:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

runRestore();
