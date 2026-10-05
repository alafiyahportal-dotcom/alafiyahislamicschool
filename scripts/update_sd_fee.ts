import { prisma } from '../src/lib/prisma';

/**
 * Sinkronisasi data SPMB SD IT Al-Afiyah T.A. 2027/2028 (poster resmi).
 * Rekening bank sengaja TIDAK diubah.
 */
const PROGRAMS_2027 = [
  { title: 'Mendidik dengan Sunnah', desc: 'Menggunakan metode Pendidikan Karakter Nabawiyah dan keteladanan sunnah Rasulullah ﷺ.', badge: 'Karakter Nabawi' },
  { title: 'Akhlaq dan Ilmu', desc: "Menanamkan iman sebelum Al-Qur'an serta adab sebelum ilmu agar berkah dan berakhlak mulia.", badge: 'Iman & Adab' },
  { title: 'Lingkungan Nyaman & Asri', desc: 'Suasana sekolah yang bersih, sejuk, rindang, dan membahagiakan anak dalam belajar.', badge: 'Ramah Anak' },
  { title: 'Basic Literasi & Numerasi', desc: 'Penguatan fondasi calistung kontekstual, nalar sains, dan logika matematika sejak dini.', badge: 'Literasi Numerasi' },
  { title: 'Outdoor Learning', desc: 'Pembelajaran aktif di alam terbuka, sains tanaman di greenhouse bambu, dan observasi kebun sekolah.', badge: 'Outdoor Learning' },
  { title: 'Pelatihan Aqil-Baligh', desc: 'Pembinaan agar murid mandiri, terampil, dan beradab dalam menyambut fase aqil-baligh.', badge: 'Kemandirian' },
  { title: 'Pemetaan Potensi Bakat & Skill', desc: 'Identifikasi dan pengembangan potensi bakat, skill, dan kemandirian tiap murid.', badge: 'Talent Mapping' },
  { title: "Tahfidz Qur'an", desc: "Bimbingan tahsin tartil dan hafalan Al-Qur'an intensif juz 30 mutqin ramah anak.", badge: 'Tahfidz Mutqin' },
  { title: 'Penumbuhan Karakter Bakat', desc: 'Menumbuhkan karakter positif melalui penyaluran minat dan bakat murid secara terarah.', badge: 'Karakter Bakat' },
  { title: 'Pembelajaran Berfokus pada Proses', desc: 'Menghargai proses belajar tiap anak, bukan sekadar hasil akhir.', badge: 'Proses Belajar' },
];

async function run() {
  const before = await prisma.school.findUniqueOrThrow({
    where: { slug: 'sd' },
    include: { cmsSections: { where: { sectionKey: 'programs' } } },
  });
  console.log('BEFORE:', JSON.stringify({
    registrationFee: before.registrationFee,
    waveName: before.waveName,
    waCenterPhone: before.waCenterPhone,
    address: before.address,
    programs: before.cmsSections[0]?.payload ?? null,
  }));

  const updated = await prisma.school.update({
    where: { slug: 'sd' },
    data: {
      registrationFee: 250000,
      waveName: 'Gelombang 1 (1 Okt - 30 Des 2026)',
      waCenterPhone: '6281310139001',
      address: 'Lingkungan Giri Asih - Jl. Gerakan Koperasi Majalengka Wetan 45411',
    },
  });

  await prisma.cMSSection.upsert({
    where: { schoolId_sectionKey: { schoolId: updated.id, sectionKey: 'programs' } },
    update: { payload: JSON.stringify(PROGRAMS_2027) },
    create: { schoolId: updated.id, sectionKey: 'programs', payload: JSON.stringify(PROGRAMS_2027) },
  });

  console.log('AFTER:', JSON.stringify({
    registrationFee: updated.registrationFee,
    waveName: updated.waveName,
    waCenterPhone: updated.waCenterPhone,
    address: updated.address,
    programs: PROGRAMS_2027.length,
  }));
  await prisma.$disconnect();
}

run().catch(async (e) => {
  console.error(e);
  await prisma.$disconnect();
  process.exit(1);
});
