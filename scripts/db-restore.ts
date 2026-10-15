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

    // 4. Restore PPDB Registrations
    if (backup.data?.registrations?.length) {
      for (const reg of backup.data.registrations) {
        const { documents, invoices, reRegistration, student, assessment, ...regData } = reg;
        if (regData.dob) regData.dob = new Date(regData.dob);
        if (regData.createdAt) regData.createdAt = new Date(regData.createdAt);
        if (regData.updatedAt) regData.updatedAt = new Date(regData.updatedAt);

        await prisma.pPDBRegistration.upsert({
          where: { id: regData.id },
          update: regData,
          create: regData,
        });

        // Restore child documents
        if (Array.isArray(documents)) {
          for (const doc of documents) {
            await prisma.pPDBDocument.upsert({
              where: { id: doc.id },
              update: doc,
              create: doc,
            });
          }
        }

        // Restore child invoices
        if (Array.isArray(invoices)) {
          for (const inv of invoices) {
            if (inv.paidAt) inv.paidAt = new Date(inv.paidAt);
            await prisma.invoice.upsert({
              where: { id: inv.id },
              update: inv,
              create: inv,
            });
          }
        }

        // Restore re-registration
        if (reRegistration) {
          await prisma.reRegistration.upsert({
            where: { registrationId: reRegistration.registrationId },
            update: reRegistration,
            create: reRegistration,
          });
        }
      }
      console.log(`✓ Dipulihkan: ${backup.data.registrations.length} Data Pendaftaran PPDB Beserta Berkas & Tagihan`);
    }

    // 5. Restore Students
    if (backup.data?.students?.length) {
      for (const st of backup.data.students) {
        if (st.dob) st.dob = new Date(st.dob);
        await prisma.student.upsert({
          where: { id: st.id },
          update: st,
          create: st,
        });
      }
      console.log(`✓ Dipulihkan: ${backup.data.students.length} Data Siswa Induk`);
    }

    // 6. Restore Teachers
    if (backup.data?.teachers?.length) {
      for (const t of backup.data.teachers) {
        await prisma.teacher.upsert({
          where: { id: t.id },
          update: t,
          create: t,
        });
      }
      console.log(`✓ Dipulihkan: ${backup.data.teachers.length} Data Dewan Guru`);
    }

    // 7. Restore Achievements
    if (backup.data?.achievements?.length) {
      for (const ach of backup.data.achievements) {
        await prisma.studentAchievement.upsert({
          where: { id: ach.id },
          update: ach,
          create: ach,
        });
      }
      console.log(`✓ Dipulihkan: ${backup.data.achievements.length} Prestasi Murid`);
    }

    // 8. Restore News Posts
    if (backup.data?.newsPosts?.length) {
      for (const n of backup.data.newsPosts) {
        if (n.publishedAt) n.publishedAt = new Date(n.publishedAt);
        await prisma.newsPost.upsert({
          where: { id: n.id },
          update: n,
          create: n,
        });
      }
      console.log(`✓ Dipulihkan: ${backup.data.newsPosts.length} Berita & Artikel`);
    }

    console.log(`\n🎉 Pemulihan lengkap seluruh entitas database sukses diselesaikan!`);
  } catch (error) {
    console.error('❌ Gagal memulihkan database:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

runRestore();
