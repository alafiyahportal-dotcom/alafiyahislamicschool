import { unstable_cache } from 'next/cache';
import { prisma } from './prisma';

/**
 * Cached school data — schools rarely change, cache for 5 minutes.
 * Used in public pages (hero, CMS sections, PPDB forms).
 */
export const getSchoolBySlug = unstable_cache(
  async (slug: string) => {
    return prisma.school.findUnique({
      where: { slug },
    });
  },
  ['school-by-slug'],
  { revalidate: 300, tags: ['schools'] } // 5 minutes
);

/**
 * Cached published news posts — cache for 2 minutes.
 * Used on public website news feed and SIAKAD home.
 */
export const getPublishedNews = unstable_cache(
  async (limit = 12) => {
    return prisma.newsPost.findMany({
      where: { isPublished: true },
      orderBy: [{ publishedAt: 'desc' }, { createdAt: 'desc' }],
      take: limit,
      include: {
        school: {
          select: { slug: true, name: true, primaryColor: true },
        },
      },
    });
  },
  ['published-news'],
  { revalidate: 120, tags: ['news'] } // 2 minutes
);

/**
 * Cached news by school — cache for 2 minutes.
 */
export const getNewsBySchool = unstable_cache(
  async (schoolId: string, limit = 20) => {
    return prisma.newsPost.findMany({
      where: { schoolId, isPublished: true },
      orderBy: [{ publishedAt: 'desc' }, { createdAt: 'desc' }],
      take: limit,
    });
  },
  ['news-by-school'],
  { revalidate: 120, tags: ['news'] } // 2 minutes
);

/**
 * Cached teacher list — cache for 5 minutes.
 * Teacher data changes rarely (hiring/profile updates).
 */
export const getTeachersBySchool = unstable_cache(
  async (schoolId: string) => {
    return prisma.teacher.findMany({
      where: { schoolId, isActive: true },
      orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
    });
  },
  ['teachers-by-school'],
  { revalidate: 300, tags: ['teachers'] } // 5 minutes
);

/**
 * Cached CMS section data — cache for 10 minutes.
 * Website content changes infrequently.
 */
export const getCMSSection = unstable_cache(
  async (schoolId: string, sectionKey: string) => {
    return prisma.cMSSection.findUnique({
      where: { schoolId_sectionKey: { schoolId, sectionKey } },
    });
  },
  ['cms-section'],
  { revalidate: 600, tags: ['cms'] } // 10 minutes
);

/**
 * Cached student achievements — cache for 10 minutes.
 */
export const getStudentAchievements = unstable_cache(
  async (schoolId?: string) => {
    return prisma.studentAchievement.findMany({
      where: schoolId ? { schoolId } : undefined,
      orderBy: [{ year: 'desc' }, { createdAt: 'desc' }],
      include: {
        school: { select: { slug: true, name: true } },
      },
    });
  },
  ['student-achievements'],
  { revalidate: 600, tags: ['achievements'] } // 10 minutes
);
