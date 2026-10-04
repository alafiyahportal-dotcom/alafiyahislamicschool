const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Menyiapkan Data Santri Tambahan (ACCEPTED, VERIFIED, PAYMENT_PENDING)...');

  const tk = await prisma.school.findUnique({ where: { slug: 'tk' } });
  const sd = await prisma.school.findUnique({ where: { slug: 'sd' } });
  const smp = await prisma.school.findUnique({ where: { slug: 'smp' } });

  if (!tk || !sd || !smp) {
    console.error('Sekolah tidak ditemukan');
    return;
  }

  // Update existing SD santri to ACCEPTED so there's an immediate accepted student
  await prisma.pPDBRegistration.updateMany({
    where: { registrationNo: 'REG-SD-2026-0001' },
    data: { status: 'ACCEPTED' },
  });

  const students = [
    // TK IT - ACCEPTED
    {
      registrationNo: 'REG-TK-2026-0101',
      schoolId: tk.id,
      studentName: 'Aisyah Zahra Khairunnisa',
      nik: '3210126504200001',
      gender: 'P',
      pob: 'Majalengka',
      dob: new Date('2021-04-15'),
      address: 'Jl. KH Abdul Halim No. 45, Majalengka Wetan',
      schoolSpecificData: JSON.stringify({
        track: 'Reguler',
        pottyTrained: true,
        allergies: 'Tidak ada',
        favoriteActivity: 'Mewarnai & Mendengarkan Kisah Nabi'
      }),
      parentData: JSON.stringify({
        fatherName: 'dr. H. Ridwan Mansyur Sp.A',
        motherName: 'Hj. Siti Maemunah S.Pd',
        motherPhone: '6281234567801',
        incomeRange: '> Rp 10.000.000'
      }),
      status: 'ACCEPTED',
      registrationFee: 150000,
    },
    // TK IT - ACCEPTED
    {
      registrationNo: 'REG-TK-2026-0102',
      schoolId: tk.id,
      studentName: 'Fatih Khalid Al-Ayyubi',
      nik: '3210121208200002',
      gender: 'L',
      pob: 'Majalengka',
      dob: new Date('2021-08-12'),
      address: 'Perum Grand Mutiara No. B-4, Cigasong, Majalengka',
      schoolSpecificData: JSON.stringify({
        track: 'Reguler',
        pottyTrained: true,
        allergies: 'Alergi dingin',
        favoriteActivity: 'Bermain Balok & Gerak Lagu Islami'
      }),
      parentData: JSON.stringify({
        fatherName: 'Ir. Danang Prasetyo',
        motherName: 'Ratna Dewi S.E',
        motherPhone: '6281234567802',
        incomeRange: 'Rp 5.000.000 - Rp 10.000.000'
      }),
      status: 'ACCEPTED',
      registrationFee: 150000,
    },
    // SD IT - ACCEPTED (Tahfidz Track)
    {
      registrationNo: 'REG-SD-2026-0201',
      schoolId: sd.id,
      studentName: 'Khansa Alifah Salsabila',
      nik: '3210125809190003',
      gender: 'P',
      pob: 'Bandung',
      dob: new Date('2019-09-18'),
      address: 'Jl. Pemuda No. 28, Majalengka Kulon',
      schoolSpecificData: JSON.stringify({
        track: 'Tahfidz & Prestasi',
        iqroLevel: 'Al-Qur\'an Juz 30 Mutqin',
        memorizedSurahs: 'An-Naba s/d An-Nas (1 Juz Lengkap)',
        readingReadiness: 'Sangat Lancar Membaca & Menulis'
      }),
      parentData: JSON.stringify({
        fatherName: 'Ust. H. Dedi Kurniawan Lc.',
        motherName: 'Ustadzah Fatimah Azzahra S.Ag',
        motherPhone: '6281234567803',
        incomeRange: 'Rp 5.000.000 - Rp 10.000.000'
      }),
      status: 'ACCEPTED',
      registrationFee: 200000,
    },
    // SD IT - ACCEPTED (Beasiswa Dhuafa)
    {
      registrationNo: 'REG-SD-2026-0202',
      schoolId: sd.id,
      studentName: 'Ahmad Bilal Al-Habasyi',
      nik: '3210120501190004',
      gender: 'L',
      pob: 'Majalengka',
      dob: new Date('2019-01-05'),
      address: 'Desa Panyingkiran RT 03/RW 02, Kec. Panyingkiran',
      schoolSpecificData: JSON.stringify({
        track: 'Beasiswa Dhuafa Berprestasi',
        iqroLevel: 'Jilid 5',
        memorizedSurahs: 'Ad-Dhuha s/d An-Nas',
        readingReadiness: 'Lancar Membaca'
      }),
      parentData: JSON.stringify({
        fatherName: 'Pak Sukardi (Almarhum)',
        motherName: 'Ibu Aminah',
        motherPhone: '6281234567804',
        incomeRange: '< Rp 2.000.000'
      }),
      status: 'ACCEPTED',
      registrationFee: 200000,
    },
    // SMP IT - ACCEPTED (Boarding / Tahfidz)
    {
      registrationNo: 'REG-SMP-2026-0301',
      schoolId: smp.id,
      studentName: 'Salman Al-Farisi',
      nik: '3210121503130005',
      gender: 'L',
      pob: 'Majalengka',
      dob: new Date('2013-03-15'),
      address: 'Kompleks Asri No. 18, Kadipaten, Majalengka',
      schoolSpecificData: JSON.stringify({
        track: 'Tahfidz & Prestasi',
        programType: 'Boarding Pesantren Tahfidz',
        hafalanQuran: '3 Juz (Juz 30, 29, 28)',
        previousSchool: 'SD IT Al-Afiyah Majalengka'
      }),
      parentData: JSON.stringify({
        fatherName: 'Drs. H. Mulyadi M.M.',
        motherName: 'Hj. Endang Sumarni S.Pd.',
        motherPhone: '6281234567805',
        incomeRange: '> Rp 10.000.000'
      }),
      status: 'ACCEPTED',
      registrationFee: 250000,
    },
    // SMP IT - ACCEPTED (Reguler)
    {
      registrationNo: 'REG-SMP-2026-0302',
      schoolId: smp.id,
      studentName: 'Syifa Nurul Izzah',
      nik: '3210124210130006',
      gender: 'P',
      pob: 'Cirebon',
      dob: new Date('2013-10-02'),
      address: 'Jl. Raya KH Abdul Halim No. 112, Majalengka',
      schoolSpecificData: JSON.stringify({
        track: 'Reguler',
        programType: 'Fullday Islamic School',
        hafalanQuran: '1 Juz (Juz 30)',
        previousSchool: 'SD Negeri 1 Majalengka'
      }),
      parentData: JSON.stringify({
        fatherName: 'Bambang Sudarsono S.T.',
        motherName: 'Dewi Anggraeni S.Si',
        motherPhone: '6281234567806',
        incomeRange: 'Rp 5.000.000 - Rp 10.000.000'
      }),
      status: 'ACCEPTED',
      registrationFee: 250000,
    },
    // SMP IT - PAYMENT_PENDING
    {
      registrationNo: 'REG-SMP-2026-0303',
      schoolId: smp.id,
      studentName: 'Muhammad Ziyad Ramadhan',
      nik: '3210122206130007',
      gender: 'L',
      pob: 'Majalengka',
      dob: new Date('2013-06-22'),
      address: 'Perumahan Sindangkasih Blok E-3, Majalengka',
      schoolSpecificData: JSON.stringify({
        track: 'Reguler',
        programType: 'Boarding Pesantren',
        hafalanQuran: 'Juz 30',
        previousSchool: 'SDIT Majalengka'
      }),
      parentData: JSON.stringify({
        fatherName: 'Agus Setiawan',
        motherName: 'Yuliana',
        motherPhone: '6281234567807',
        incomeRange: 'Rp 3.000.000 - Rp 5.000.000'
      }),
      status: 'PAYMENT_PENDING',
      registrationFee: 250000,
    },
  ];

  for (const s of students) {
    const existing = await prisma.pPDBRegistration.findUnique({
      where: { registrationNo: s.registrationNo }
    });

    if (!existing) {
      const reg = await prisma.pPDBRegistration.create({ data: s });
      console.log(`✅ Created ${s.registrationNo} - ${s.studentName} (${s.status})`);

      // Create Invoice
      await prisma.invoice.create({
        data: {
          orderId: `INV-2026-${s.registrationNo}`,
          schoolId: s.schoolId,
          registrationId: reg.id,
          amount: s.registrationFee,
          paymentMethod: s.status === 'PAYMENT_PENDING' ? 'MIDTRANS_SNAP' : 'MIDTRANS_QRIS',
          paymentStatus: s.status === 'PAYMENT_PENDING' ? 'UNPAID' : 'PAID',
          paidAt: s.status === 'PAYMENT_PENDING' ? null : new Date(),
        }
      });
    }
  }

  console.log('🎉 Selesai menambahkan data santri.');
}

main().finally(() => prisma.$disconnect());
