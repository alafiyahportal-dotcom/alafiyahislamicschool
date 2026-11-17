/**
 * ============================================================================
 * SCRIPT 1: BACKUP PENUH DATABASE SUPABASE KE FILE LOKAL (.backups/supabase-full-backup.json)
 * ============================================================================
 * Cara menjalankan (di laptop sebelum/saat pindah ke VPS):
 *   node --env-file=.env scripts/backup-supabase.js
 */

const fs = require('fs');
const path = require('path');
const zlib = require('zlib');
const { PrismaClient } = require('@prisma/client');

let prisma = new PrismaClient();

async function withRetry(fn, label, maxRetries = 4) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (err) {
      console.warn(`   ⚠️ Percobaan ${attempt}/${maxRetries} gagal pada ${label}: ${err.code || err.message}`);
      try {
        await prisma.$disconnect();
      } catch {}
      await new Promise((r) => setTimeout(r, 1500 * attempt));
      prisma = new PrismaClient();
      if (attempt === maxRetries) throw err;
    }
  }
}

async function fetchOneByOne(modelName, getDelegate, label) {
  const allRows = [];
  const idList = await withRetry(
    () => getDelegate().findMany({ select: { id: true }, orderBy: { id: 'asc' } }),
    `${label}.ids`
  );
  console.log(`   ↳ ${label}: ditemukan ${idList.length} baris, mengunduh satu per satu...`);

  for (let i = 0; i < idList.length; i++) {
    const id = idList[i].id;
    const row = await withRetry(
      () => getDelegate().findUnique({ where: { id } }),
      `${label}[${i + 1}/${idList.length}] (${id})`
    );
    if (row) allRows.push(row);
    if ((i + 1) % 5 === 0 || i + 1 === idList.length) {
      console.log(`     • ${label}: ${i + 1}/${idList.length} terunduh`);
    }
  }
  return allRows;
}

async function main() {
  console.log('⏳ Memulai proses backup seluruh tabel dari database Supabase...');

  const schools = await withRetry(() => prisma.school.findMany(), 'School');
  console.log(`✅ School: ${schools.length}`);

  const users = await withRetry(() => prisma.user.findMany(), 'User');
  console.log(`✅ User: ${users.length}`);

  const affiliateProfiles = await withRetry(() => prisma.affiliateProfile.findMany(), 'AffiliateProfile');
  console.log(`✅ AffiliateProfile: ${affiliateProfiles.length}`);

  const cmsSections = await fetchOneByOne('cMSSection', () => prisma.cMSSection, 'CMSSection');
  console.log(`✅ CMSSection: ${cmsSections.length}`);

  const teachers = await withRetry(() => prisma.teacher.findMany(), 'Teacher');
  console.log(`✅ Teacher: ${teachers.length}`);

  const newsPosts = await fetchOneByOne('newsPost', () => prisma.newsPost, 'NewsPost');
  console.log(`✅ NewsPost: ${newsPosts.length}`);

  const studentAchievements = await withRetry(() => prisma.studentAchievement.findMany(), 'StudentAchievement');
  console.log(`✅ StudentAchievement: ${studentAchievements.length}`);

  const ppdbRegistrations = await withRetry(() => prisma.pPDBRegistration.findMany(), 'PPDBRegistration');
  console.log(`✅ PPDBRegistration: ${ppdbRegistrations.length}`);

  const ppdbDocuments = await fetchOneByOne('pPDBDocument', () => prisma.pPDBDocument, 'PPDBDocument');
  console.log(`✅ PPDBDocument: ${ppdbDocuments.length}`);

  const invoices = await withRetry(() => prisma.invoice.findMany(), 'Invoice');
  console.log(`✅ Invoice: ${invoices.length}`);

  const affiliateConversions = await withRetry(() => prisma.affiliateConversion.findMany(), 'AffiliateConversion');
  console.log(`✅ AffiliateConversion: ${affiliateConversions.length}`);

  const reRegistrations = await withRetry(() => prisma.reRegistration.findMany(), 'ReRegistration');
  console.log(`✅ ReRegistration: ${reRegistrations.length}`);

  const ppdbAssessments = await withRetry(() => prisma.pPDBAssessment.findMany(), 'PPDBAssessment');
  console.log(`✅ PPDBAssessment: ${ppdbAssessments.length}`);

  const students = await withRetry(() => prisma.student.findMany(), 'Student');
  console.log(`✅ Student: ${students.length}`);

  const tuitionBills = await withRetry(() => prisma.tuitionBill.findMany(), 'TuitionBill');
  console.log(`✅ TuitionBill: ${tuitionBills.length}`);

  const reportCards = await withRetry(() => prisma.reportCard.findMany(), 'ReportCard');
  console.log(`✅ ReportCard: ${reportCards.length}`);

  const tahfidzProgress = await withRetry(() => prisma.tahfidzProgress.findMany(), 'TahfidzProgress');
  console.log(`✅ TahfidzProgress: ${tahfidzProgress.length}`);

  const notificationLogs = await withRetry(() => prisma.notificationLog.findMany(), 'NotificationLog');
  console.log(`✅ NotificationLog: ${notificationLogs.length}`);

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
  const jsonStr = JSON.stringify(backupData, null, 2);
  fs.writeFileSync(backupPath, jsonStr, 'utf8');

  const gzPath = path.join(backupDir, 'supabase-full-backup.json.gz');
  fs.writeFileSync(gzPath, zlib.gzipSync(Buffer.from(jsonStr, 'utf8')));

  const sizeMb = (fs.statSync(backupPath).size / (1024 * 1024)).toFixed(2);
  const gzSizeMb = (fs.statSync(gzPath).size / (1024 * 1024)).toFixed(2);
  console.log('\n✅ Backup Database Supabase Berhasil!');
  console.log(`📁 Lokasi File JSON : ${backupPath} (${sizeMb} MB)`);
  console.log(`📦 Lokasi File GZIP : ${gzPath} (${gzSizeMb} MB - siap di-upload cepat ke VPS)`);
  console.log('📊 Ringkasan Data:', backupData.counts);
}

main()
  .catch((err) => {
    console.error('❌ Gagal melakukan backup:', err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
