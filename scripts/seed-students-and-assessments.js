const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Seeding Student and Assessment data...');

  const schools = await prisma.school.findMany();
  const schoolMap = {};
  for (const s of schools) {
    schoolMap[s.slug] = s.id;
  }

  // 1. Seed Assessments for PPDB Registrations
  const registrations = await prisma.pPDBRegistration.findMany({
    include: { school: true, assessment: true }
  });

  console.log(`Found ${registrations.length} registrations.`);

  for (const reg of registrations) {
    if (!reg.assessment) {
      let aspectScores = {};
      let totalScore = 0;
      let recommendation = 'RECOMMENDED';
      let interviewer = 'Ustadz Salman Al-Farisi, S.Pd.I';

      if (reg.school.slug === 'tk') {
        aspectScores = {
          motorik: 85,
          kemandirian: 90,
          komunikasi: 88,
          wawancaraOrtu: 92
        };
        totalScore = (85 * 0.25) + (90 * 0.25) + (88 * 0.25) + (92 * 0.25); // 88.75
        recommendation = 'RECOMMENDED';
        interviewer = 'Ustadzah Siti Aminah, S.Pd. (Sentra PAUD)';
      } else if (reg.school.slug === 'sd') {
        aspectScores = {
          tahsinIqro: 88,
          calistung: 82,
          suratPendek: 90,
          wawancaraOrtu: 85
        };
        totalScore = (88 * 0.30) + (82 * 0.25) + (90 * 0.25) + (85 * 0.20); // 86.4
        recommendation = 'RECOMMENDED';
        interviewer = 'Ustadz H. Lukman Hakim, M.Pd.';
      } else {
        // SMP
        aspectScores = {
          tahfidzTajwid: 92,
          potensiAkademik: 84,
          kesiapanAsrama: 90,
          wawancaraOrtu: 88
        };
        totalScore = (92 * 0.35) + (84 * 0.25) + (90 * 0.25) + (88 * 0.15); // 88.9
        recommendation = 'RECOMMENDED';
        interviewer = 'Ustadz Dr. H. Ahmad Syauqi, M.Pd.I';
      }

      await prisma.pPDBAssessment.create({
        data: {
          registrationId: reg.id,
          interviewerName: interviewer,
          aspectScores: JSON.stringify(aspectScores),
          totalScore: Math.round(totalScore * 10) / 10,
          recommendation,
          notes: 'Ananda memiliki daya tangkap yang sangat baik, adab sopan, dan orang tua sangat mendukung program pembiasaan ibadah.',
          assessedAt: new Date(Date.now() - 3 * 86400000)
        }
      });
      console.log(`Created assessment for ${reg.studentName} (${reg.registrationNo}): Score ${totalScore}`);
    }
  }

  // 2. Seed Students for Buku Induk Santri (from existing accepted registrations)
  const acceptedRegs = await prisma.pPDBRegistration.findMany({
    where: { status: 'ACCEPTED' },
    include: { school: true, student: true }
  });

  let counter = 1;
  for (const reg of acceptedRegs) {
    if (!reg.student) {
      const year = '2026';
      const unitCode = reg.school.slug.toUpperCase();
      const seq = String(counter).padStart(4, '0');
      const nis = `${year}-${unitCode}-${seq}`;
      const nisn = `00${year.slice(2)}56${seq}`;

      let classGrade = 'TK A';
      if (reg.school.slug === 'sd') classGrade = '1 SD IT';
      if (reg.school.slug === 'smp') classGrade = '7 SMP IT';

      await prisma.student.create({
        data: {
          nis,
          nisn,
          schoolId: reg.schoolId,
          registrationId: reg.id,
          fullName: reg.studentName,
          gender: reg.gender,
          pob: reg.pob,
          dob: reg.dob,
          nik: reg.nik,
          religion: 'Islam',
          address: reg.address,
          classGrade,
          academicYear: '2026/2027',
          parentInfo: reg.parentData,
          status: 'ACTIVE',
          notes: 'Santri Baru Hasil PPDB 2026/2027 Gelombang 1.'
        }
      });
      console.log(`Created Student Buku Induk: ${reg.studentName} -> NIS: ${nis}`);
      counter++;
    }
  }

  // 3. Add existing active senior students across TK, SD, and SMP for realistic roster
  const seniorStudents = [
    {
      schoolSlug: 'tk',
      nis: '2025-TK-0012',
      nisn: '0025781012',
      fullName: 'Muhammad Bilal Al-Banjari',
      gender: 'L',
      pob: 'Majalengka',
      dob: new Date('2021-04-12'),
      nik: '3210121204210001',
      address: 'Jl. Pemuda No. 45, Majalengka',
      classGrade: 'TK B',
      academicYear: '2026/2027',
      parentInfo: JSON.stringify({
        fatherName: 'dr. H. Ilham Fauzi, Sp.A',
        fatherPhone: '081223456789',
        fatherJob: 'Dokter Spesialis Anak',
        motherName: 'Hj. Dewi Rahmawati, S.Farm.',
        motherJob: 'Apoteker'
      }),
      status: 'ACTIVE',
      notes: 'Juara 1 Lomba Tahfidz Balita Tingkat Kabupaten Majalengka 2025.'
    },
    {
      schoolSlug: 'sd',
      nis: '2024-SD-0045',
      nisn: '0024892045',
      fullName: 'Fathimah Azzahra Al-Hafizhah',
      gender: 'P',
      pob: 'Cirebon',
      dob: new Date('2017-08-20'),
      nik: '3210122008170002',
      address: 'Komplek Asri Blok D-14, Kadipaten, Majalengka',
      classGrade: '3 SD IT',
      academicYear: '2026/2027',
      parentInfo: JSON.stringify({
        fatherName: 'Ir. Ahmad Zaki, M.T.',
        fatherPhone: '081334567890',
        fatherJob: 'PNS Bappeda',
        motherName: 'dr. Nurul Hayati',
        motherJob: 'Dokter Umum'
      }),
      status: 'ACTIVE',
      notes: 'Telah mutqin Juz 30 dan Juz 29. Santri berprestasi teladan.'
    },
    {
      schoolSlug: 'smp',
      nis: '2024-SMP-0078',
      nisn: '0024913078',
      fullName: 'Abdullah Rasyid Al-Ghazi',
      gender: 'L',
      pob: 'Bandung',
      dob: new Date('2012-11-05'),
      nik: '3210120511120003',
      address: 'Jl. Pesantren Al-Afiyah No. 7, Majalengka',
      classGrade: '9 SMP IT',
      academicYear: '2026/2027',
      parentInfo: JSON.stringify({
        fatherName: 'Drs. H. Muhammad Ridwan, M.Ag.',
        fatherPhone: '081122334455',
        fatherJob: 'Dosen UIN',
        motherName: 'Hj. Siti Mariam, M.Pd.',
        motherJob: 'Guru Madrasah'
      }),
      status: 'ACTIVE',
      notes: 'Hafalan 10 Juz Mutqin (Juz 1-5, 26-30). Ketua OSIS Pesantren Al-Afiyah.'
    }
  ];

  for (const s of seniorStudents) {
    const schoolId = schoolMap[s.schoolSlug];
    if (schoolId) {
      await prisma.student.upsert({
        where: { nis: s.nis },
        update: {},
        create: {
          nis: s.nis,
          nisn: s.nisn,
          schoolId,
          fullName: s.fullName,
          gender: s.gender,
          pob: s.pob,
          dob: s.dob,
          nik: s.nik,
          religion: 'Islam',
          address: s.address,
          classGrade: s.classGrade,
          academicYear: s.academicYear,
          parentInfo: s.parentInfo,
          status: s.status,
          notes: s.notes
        }
      });
      console.log(`Upserted Senior Student: ${s.fullName} (${s.nis})`);
    }
  }

  const totalStudents = await prisma.student.count();
  const totalAssessments = await prisma.pPDBAssessment.count();
  console.log(`Done! Total Students: ${totalStudents}, Total Assessments: ${totalAssessments}`);
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
