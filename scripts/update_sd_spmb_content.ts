import { prisma } from '../src/lib/prisma';

/**
 * Sinkronisasi konten DB SPMB SD IT T.A. 2027/2028:
 * - Artikel pengumuman SPMB (slug lama dipertahankan agar link tetap hidup).
 * - Referensi poster lama di CMS → file berversi (hindari cache browser 7 hari).
 */
const OLD_POSTER = '/images/sd-spmb-poster.jpg';
const NEW_POSTER = '/images/sd-spmb-poster-2027.jpg';

const fix = (s: string) =>
  s
    .split('2026/2027').join('2027/2028')
    .split(OLD_POSTER).join(NEW_POSTER)
    .split('0895-3222-26104').join('0813-1013-9001')
    .split('62895322226104').join('6281310139001');

async function main() {
  const posts = await prisma.newsPost.findMany({ where: { slug: { contains: 'spmb' } } });
  for (const p of posts) {
    const data = {
      title: fix(p.title),
      excerpt: fix(p.excerpt),
      content: fix(p.content),
      author: fix(p.author),
      coverImage: p.coverImage ? fix(p.coverImage) : p.coverImage,
    };
    await prisma.newsPost.update({ where: { id: p.id }, data });
    console.log('NEWS', p.slug, '|', p.title, '=>', data.title, '|', data.coverImage);
  }

  const sections = await prisma.cMSSection.findMany({ where: { payload: { contains: OLD_POSTER } } });
  for (const s of sections) {
    await prisma.cMSSection.update({ where: { id: s.id }, data: { payload: s.payload.split(OLD_POSTER).join(NEW_POSTER) } });
    console.log('CMS', s.schoolId, s.sectionKey, 'poster ref updated');
  }
  console.log(`done: ${posts.length} news, ${sections.length} cms sections`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
