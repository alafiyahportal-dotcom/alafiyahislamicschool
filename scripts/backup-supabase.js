/**
 * ============================================================================
 * SCRIPT 1: BACKUP PENUH DATABASE SUPABASE KE FILE LOKAL (.backups/supabase-full-backup.json)
 * ============================================================================
 * Cara menjalankan (di laptop sebelum/saat pindah ke VPS):
 *   node --env-file=.env scripts/backup-supabase.js
 */

const fs = require('fs');
const path = require('path');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log('⏳ Memulai proses backup seluruh tabel dari database Supabase...');

  const [
    schools,
    users,
    affiliateProfiles,
    cmsSections,
    teachers,
    newsPosts,
    studentAchievements,
    ppdbRegistrations,
    ppdbDocuments,
    invoices,
    affiliateConversions,
    reRegistrations,
    ppdbAssessments,
    students,
    tuitionBills,
    reportCards,
    tahfidzProgress,
    notificationLogs,
  ] = await Promise.all([
    prisma.school.findMany(),
    prisma.user.findMany(),
    prisma.affiliateProfile.findMany(),
    prisma.cMSSection.findMany(),
    prisma.teacher.findMany(),
    prisma.newsPost.findMany(),
    prisma.studentAchievement.findMany(),
    prisma.pPDBRegistration.findMany(),
    prisma.pPDBDocument.findMany(),
    prisma.invoice.findMany(),
    prisma.affiliateConversion.findMany(),
    prisma.reRegistration.findMany(),
    prisma.pPDBAssessment.findMany(),
    prisma.student.findMany(),
    prisma.tuitionBill.findMany(),
    prisma.reportCard.findMany(),
    prisma.tahfidzProgress.findMany(),
    prisma.notificationLog.findMany(),
  ]);

  const backupData = {
    exportedAt: new Date().toISOString(),
    counts: {
      schools: schools.length,
      users: users.length,
      affiliateProfiles: affiliateProfiles.length,
      cmsSections: cmsSections.length,
      teachers: teachers.length,
      newsPosts: newsPosts.length,
      studentAchievements: studentAchievements.length,
      ppdbRegistrations: ppdbRegistrations.length,
      ppdbDocuments: ppdbDocuments.length,
      invoices: invoices.length,
      affiliateConversions: affiliateConversions.length,
      reRegistrations: reRegistrations.length,
      ppdbAssessments: ppdbAssessments.length,
      students: students.length,
      tuitionBills: tuitionBills.length,
      reportCards: reportCards.length,
      tahfidzProgress: tahfidzProgress.length,
      notificationLogs: notificationLogs.length,
    },
    data: {
      schools,
      users,
      affiliateProfiles,
      cmsSections,
      teachers,
      newsPosts,
      studentAchievements,
      ppdbRegistrations,
      ppdbDocuments,
      invoices,
      affiliateConversions,
      reRegistrations,
      ppdbAssessments,
      students,
      tuitionBills,
      reportCards,
      tahfidzProgress,
      notificationLogs,
    },
  };

  const backupDir = path.join(process.cwd(), '.backups');
  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true });
  }

  const backupPath = path.join(backupDir, 'supabase-full-backup.json');
  fs.writeFileSync(backupPath, JSON.stringify(backupData, null, 2), 'utf8');

  console.log('\n✅ Backup Database Supabase Berhasil!');
  console.log('📁 Lokasi File:', backupPath);
  console.log('📊 Ringkasan Data:', backupData.counts);
}

main()
  .catch((err) => {
    console.error('❌ Gagal melakukan backup:', err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
