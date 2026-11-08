/**
 * ============================================================================
 * SCRIPT 2: RESTORE DATA DARI .backups/supabase-full-backup.json KE POSTGRESQL VPS
 * ============================================================================
 * Cara menjalankan di VPS (setelah `npx prisma db push`):
 *   node --env-file=.env scripts/restore-vps.js
 */

const fs = require('fs');
const path = require('path');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function restoreTable(label, items, upsertFn) {
  if (!Array.isArray(items) || items.length === 0) {
    console.log(`⚪ ${label}: 0 baris (dilewati)`);
    return;
  }
  let success = 0;
  for (const item of items) {
    await upsertFn(item);
    success++;
  }
  console.log(`✅ ${label}: ${success} baris berhasil di-restore`);
}

async function main() {
  const backupPath = path.join(process.cwd(), '.backups', 'supabase-full-backup.json');
  if (!fs.existsSync(backupPath)) {
    console.error(`❌ File backup tidak ditemukan di: ${backupPath}`);
    console.error('Jalankan "node --env-file=.env scripts/backup-supabase.js" terlebih dahulu.');
    process.exit(1);
  }

  console.log('⏳ Membaca file backup:', backupPath);
  const parsed = JSON.parse(fs.readFileSync(backupPath, 'utf8'));
  const d = parsed.data || {};

  // Urutan restore mengikuti Foreign Key (Parent -> Child)
  await restoreTable('School', d.schools, (row) =>
    prisma.school.upsert({ where: { id: row.id }, update: row, create: row })
  );

  await restoreTable('User', d.users, (row) =>
    prisma.user.upsert({ where: { id: row.id }, update: row, create: row })
  );

  await restoreTable('AffiliateProfile', d.affiliateProfiles, (row) =>
    prisma.affiliateProfile.upsert({ where: { id: row.id }, update: row, create: row })
  );

  await restoreTable('CMSSection', d.cmsSections, (row) =>
    prisma.cMSSection.upsert({ where: { id: row.id }, update: row, create: row })
  );

  await restoreTable('Teacher', d.teachers, (row) =>
    prisma.teacher.upsert({ where: { id: row.id }, update: row, create: row })
  );

  await restoreTable('NewsPost', d.newsPosts, (row) =>
    prisma.newsPost.upsert({ where: { id: row.id }, update: row, create: row })
  );

  await restoreTable('StudentAchievement', d.studentAchievements, (row) =>
    prisma.studentAchievement.upsert({ where: { id: row.id }, update: row, create: row })
  );

  await restoreTable('PPDBRegistration', d.ppdbRegistrations, (row) =>
    prisma.pPDBRegistration.upsert({ where: { id: row.id }, update: row, create: row })
  );

  await restoreTable('PPDBDocument', d.ppdbDocuments, (row) =>
    prisma.pPDBDocument.upsert({ where: { id: row.id }, update: row, create: row })
  );

  await restoreTable('Invoice', d.invoices, (row) =>
    prisma.invoice.upsert({ where: { id: row.id }, update: row, create: row })
  );

  await restoreTable('AffiliateConversion', d.affiliateConversions, (row) =>
    prisma.affiliateConversion.upsert({ where: { id: row.id }, update: row, create: row })
  );

  await restoreTable('ReRegistration', d.reRegistrations, (row) =>
    prisma.reRegistration.upsert({ where: { id: row.id }, update: row, create: row })
  );

  await restoreTable('PPDBAssessment', d.ppdbAssessments, (row) =>
    prisma.pPDBAssessment.upsert({ where: { id: row.id }, update: row, create: row })
  );

  await restoreTable('Student', d.students, (row) =>
    prisma.student.upsert({ where: { id: row.id }, update: row, create: row })
  );

  await restoreTable('TuitionBill', d.tuitionBills, (row) =>
    prisma.tuitionBill.upsert({ where: { id: row.id }, update: row, create: row })
  );

  await restoreTable('ReportCard', d.reportCards, (row) =>
    prisma.reportCard.upsert({ where: { id: row.id }, update: row, create: row })
  );

  await restoreTable('TahfidzProgress', d.tahfidzProgress, (row) =>
    prisma.tahfidzProgress.upsert({ where: { id: row.id }, update: row, create: row })
  );

  await restoreTable('NotificationLog', d.notificationLogs, (row) =>
    prisma.notificationLog.upsert({ where: { id: row.id }, update: row, create: row })
  );

  console.log('\n🎉 Seluruh data berhasil dipindahkan ke PostgreSQL VPS dengan utuh!');
}

main()
  .catch((err) => {
    console.error('❌ Gagal melakukan restore:', err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
