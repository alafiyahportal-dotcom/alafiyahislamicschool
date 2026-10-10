import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

async function runBackup() {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupDir = path.join(process.cwd(), '.backups');

  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true });
  }

  const backupFilePath = path.join(backupDir, `db-backup-${timestamp}.json`);
  console.log(`📦 Memulai backup database Al-Afiyah ke: ${backupFilePath}...`);

  try {
    const [
      schools,
      users,
      registrations,
      students,
      invoices,
      cmsSections,
      notificationLogs,
      achievements,
      teachers,
      newsPosts,
    ] = await Promise.all([
      prisma.school.findMany(),
      prisma.user.findMany(),
      prisma.pPDBRegistration.findMany({ include: { documents: true, invoices: true, reRegistration: true, student: true, assessment: true } }),
      prisma.student.findMany(),
      prisma.invoice.findMany(),
      prisma.cMSSection.findMany(),
      prisma.notificationLog.findMany(),
      prisma.studentAchievement.findMany(),
      prisma.teacher.findMany(),
      prisma.newsPost.findMany(),
    ]);

    const backupData = {
      createdAt: new Date().toISOString(),
      version: '1.0',
      totalRecords: {
        schools: schools.length,
        users: users.length,
        registrations: registrations.length,
        students: students.length,
        invoices: invoices.length,
        cmsSections: cmsSections.length,
        notificationLogs: notificationLogs.length,
        achievements: achievements.length,
        teachers: teachers.length,
        newsPosts: newsPosts.length,
      },
      data: {
        schools,
        users,
        registrations,
        students,
        invoices,
        cmsSections,
        notificationLogs,
        achievements,
        teachers,
        newsPosts,
      },
    };

    fs.writeFileSync(backupFilePath, JSON.stringify(backupData, null, 2), 'utf-8');

    console.log(`✅ Backup selesai dan tersimpan dengan aman!`);
    console.log(`📊 Ringkasan Data:`);
    console.table(backupData.totalRecords);
    console.log(`\n💡 File backup tersimpan di: ${backupFilePath}`);
  } catch (error) {
    console.error('❌ Gagal melakukan backup database:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

runBackup();
