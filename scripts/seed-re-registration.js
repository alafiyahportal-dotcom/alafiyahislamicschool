const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Menyiapkan Data Konfirmasi Daftar Ulang & Seragam Peserta Didik...');

  const acceptedStudents = await prisma.pPDBRegistration.findMany({
    where: { status: 'ACCEPTED' },
    include: { school: true, reRegistration: true },
  });

  console.log(`Ditemukan ${acceptedStudents.length} peserta didik berstatus ACCEPTED.`);

  // Sample Re-registrations to seed
  const sampleReRegs = [
    {
      regNo: 'REG-TK-2026-0101',
      uniformSize: 'S',
      uniformType: "Gamis Syar'i & Kerudung Bergo Instan",
      heightCm: 108,
      weightKg: 18,
      shoeSize: 29,
      boardingPreference: null,
      roommatePreference: null,
      paymentPlan: 'FULL',
      notes: 'Jilbab mohon yang bahan adem & pet busa',
      isUniformTaken: true,
    },
    {
      regNo: 'REG-SD-2026-0001',
      uniformSize: 'M',
      uniformType: 'Kemeja & Celana Formal Panjang',
      heightCm: 126,
      weightKg: 27,
      shoeSize: 34,
      boardingPreference: null,
      roommatePreference: null,
      paymentPlan: 'FULL',
      notes: 'Celana panjang mohon pakai karet samping elastis',
      isUniformTaken: false,
    },
    {
      regNo: 'REG-SMP-2026-0301',
      uniformSize: 'L',
      uniformType: 'Kemeja & Celana Formal Panjang',
      heightCm: 145,
      weightKg: 40,
      shoeSize: 38,
      boardingPreference: 'TAHFIDZ_INTENSIF',
      roommatePreference: 'Ingin teman kamar yang santun & disiplin tahfidz',
      paymentPlan: 'INSTALLMENT_2X',
      notes: 'Mohon seragam olahraga ukuran L agak longgar',
      isUniformTaken: false,
    },
    {
      regNo: 'REG-SD-2026-0201',
      uniformSize: 'M',
      uniformType: 'Kemeja & Celana Formal Panjang',
      heightCm: 122,
      weightKg: 25,
      shoeSize: 33,
      boardingPreference: null,
      roommatePreference: null,
      paymentPlan: 'FULL',
      notes: null,
      isUniformTaken: true,
    },
    {
      regNo: 'REG-SMP-2026-0302',
      uniformSize: 'XL',
      uniformType: "Gamis Syar'i & Kerudung Bergo Instan",
      heightCm: 154,
      weightKg: 46,
      shoeSize: 39,
      boardingPreference: 'REGULER',
      roommatePreference: 'Satu kamar dengan sesama peserta didik putri asal Majalengka/Kuningan',
      paymentPlan: 'INSTALLMENT_3X',
      notes: 'Rok gamis mohon panjang menutupi mata kaki',
      isUniformTaken: false,
    },
  ];

  for (const item of sampleReRegs) {
    const student = acceptedStudents.find((s) => s.registrationNo === item.regNo);
    if (student) {
      await prisma.reRegistration.upsert({
        where: { registrationId: student.id },
        create: {
          registrationId: student.id,
          uniformSize: item.uniformSize,
          uniformType: item.uniformType,
          heightCm: item.heightCm,
          weightKg: item.weightKg,
          shoeSize: item.shoeSize,
          boardingPreference: item.boardingPreference,
          roommatePreference: item.roommatePreference,
          paymentPlan: item.paymentPlan,
          notes: item.notes,
          isUniformTaken: item.isUniformTaken,
          uniformTakenAt: item.isUniformTaken ? new Date() : null,
          status: 'CONFIRMED',
        },
        update: {
          uniformSize: item.uniformSize,
          uniformType: item.uniformType,
          heightCm: item.heightCm,
          weightKg: item.weightKg,
          shoeSize: item.shoeSize,
          boardingPreference: item.boardingPreference,
          roommatePreference: item.roommatePreference,
          paymentPlan: item.paymentPlan,
          notes: item.notes,
          isUniformTaken: item.isUniformTaken,
          uniformTakenAt: item.isUniformTaken ? new Date() : null,
          status: 'CONFIRMED',
        },
      });
      console.log(`✅ Konfirmasi DU untuk ${student.studentName} (${item.regNo}) berhasil dibuat.`);
    }
  }

  console.log('✨ Selesai menyiapkan data konfirmasi daftar ulang.');
}

main()
  .catch((e) => {
    console.error('Error saat seeding re-registration:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
