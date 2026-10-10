import { prisma } from '../src/lib/prisma';
import bcrypt from 'bcryptjs';

async function setupSimpleRoleAccounts() {
  console.log('Setting up simple role accounts in database...');

  const tk = await prisma.school.findUnique({ where: { slug: 'tk' } });
  const sd = await prisma.school.findUnique({ where: { slug: 'sd' } });
  const smp = await prisma.school.findUnique({ where: { slug: 'smp' } });

  const accounts = [
    {
      email: 'admin@alafiyah.sch.id',
      fullName: 'Super Admin Yayasan',
      role: 'SUPERADMIN',
      schoolId: null,
      passwordPlain: 'admin123',
    },
    {
      email: 'smp@alafiyah.sch.id',
      fullName: 'Admin SMP IT Al-Afiyah',
      role: 'ADMIN_SMP',
      schoolId: smp?.id || null,
      passwordPlain: 'smp123',
    },
    {
      email: 'sd@alafiyah.sch.id',
      fullName: 'Admin SDIT Al-Afiyah',
      role: 'ADMIN_SD',
      schoolId: sd?.id || null,
      passwordPlain: 'sd123',
    },
    {
      email: 'tk@alafiyah.sch.id',
      fullName: 'Admin TK IT Al-Afiyah',
      role: 'ADMIN_TK',
      schoolId: tk?.id || null,
      passwordPlain: 'tk123',
    },
    {
      email: 'panitia@alafiyah.sch.id',
      fullName: 'Panitia SPMB SMP IT',
      role: 'PPDB_OFFICER',
      schoolId: smp?.id || null,
      passwordPlain: 'panitia123',
    },
    {
      email: 'keuangan@alafiyah.sch.id',
      fullName: 'Bendahara SMP IT',
      role: 'FINANCE',
      schoolId: smp?.id || null,
      passwordPlain: 'keuangan123',
    },
    {
      email: 'afiliasi@alafiyah.sch.id',
      fullName: 'Mitra Afiliasi Resmi',
      role: 'AFFILIATE',
      schoolId: null,
      passwordPlain: 'afiliasi123',
    },
  ];

  for (const acc of accounts) {
    const passwordHash = bcrypt.hashSync(acc.passwordPlain, 10);
    await prisma.user.upsert({
      where: { email: acc.email },
      update: {
        fullName: acc.fullName,
        role: acc.role,
        schoolId: acc.schoolId,
        passwordHash,
        isActive: true,
      },
      create: {
        email: acc.email,
        fullName: acc.fullName,
        role: acc.role,
        schoolId: acc.schoolId,
        passwordHash,
        isActive: true,
      },
    });
    console.log(`✅ ${acc.role}: ${acc.email} / ${acc.passwordPlain}`);
  }

  // Also update existing standard emails with password 'admin123'
  const legacyEmails = [
    'superadmin@alafiyah.sch.id',
    'admin.smp@alafiyah.sch.id',
    'admin.sd@alafiyah.sch.id',
    'admin.tk@alafiyah.sch.id',
    'ppdb@alafiyah.sch.id',
    'bendahara.smp@alafiyah.sch.id',
    'bendahara.sd@alafiyah.sch.id',
    'bendahara.tk@alafiyah.sch.id',
  ];

  const genericHash = bcrypt.hashSync('admin123', 10);
  for (const legEmail of legacyEmails) {
    await prisma.user.updateMany({
      where: { email: legEmail },
      data: { passwordHash: genericHash },
    });
  }

  console.log('All simple role accounts configured successfully!');
}

setupSimpleRoleAccounts()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
