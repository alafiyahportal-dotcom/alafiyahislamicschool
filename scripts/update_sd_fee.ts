import { prisma } from '../src/lib/prisma';

async function run() {
  const updated = await prisma.school.update({
    where: { slug: 'sd' },
    data: {
      registrationFee: 175000,
      waveName: 'Gelombang 1 (Biaya Pendaftaran Rp 175.000)',
      address: 'Lingkungan Giri Asih - Jl. Gerakan Koperasi Majalengka Wetan 45411',
    },
  });
  console.log('Updated SD:', updated);
  await prisma.$disconnect();
}

run().catch(console.error);
