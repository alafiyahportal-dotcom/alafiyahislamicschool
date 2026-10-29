import { prisma } from '@/lib/prisma';
import {
  DEFAULT_NEWS_CATEGORIES,
  getDefaultNewsAuthors,
  mergeUniqueStrings,
} from '@/lib/news-media';

export interface SchoolNewsConfig {
  categories: string[];
  authors: string[];
}

export async function getSchoolNewsConfig(
  schoolId: string,
  schoolName?: string
): Promise<SchoolNewsConfig> {
  const defaultAuthors = getDefaultNewsAuthors(schoolName);

  try {
    const [cmsConfig, posts] = await Promise.all([
      prisma.cMSSection.findUnique({
        where: {
          schoolId_sectionKey: {
            schoolId,
            sectionKey: 'news_config',
          },
        },
      }),
      prisma.newsPost.findMany({
        where: { schoolId },
        select: { category: true, author: true },
      }),
    ]);

    let savedCategories: string[] | null = null;
    let savedAuthors: string[] | null = null;

    if (cmsConfig?.payload) {
      try {
        const parsed = JSON.parse(cmsConfig.payload);
        if (Array.isArray(parsed.categories)) {
          savedCategories = parsed.categories
            .filter((c: unknown): c is string => typeof c === 'string' && c.trim().length > 0)
            .map((c: string) => c.trim());
        }
        if (Array.isArray(parsed.authors)) {
          savedAuthors = parsed.authors
            .filter((a: unknown): a is string => typeof a === 'string' && a.trim().length > 0)
            .map((a: string) => a.trim());
        }
      } catch {
        // Ignore malformed payload
      }
    }

    const postCategories = posts
      .map((p) => (p.category || '').trim())
      .filter(Boolean);
    const postAuthors = posts
      .map((p) => (p.author || '').trim())
      .filter(Boolean);

    const baseCategories = savedCategories && savedCategories.length > 0
      ? savedCategories
      : DEFAULT_NEWS_CATEGORIES;
    const baseAuthors = savedAuthors && savedAuthors.length > 0
      ? savedAuthors
      : defaultAuthors;

    // Always merge with categories/authors actually used by existing posts so nothing is ever orphaned
    const categories = mergeUniqueStrings(baseCategories, postCategories);
    const authors = mergeUniqueStrings(baseAuthors, postAuthors);

    return { categories, authors };
  } catch (error) {
    console.error('Error loading school news config:', error);
    return {
      categories: DEFAULT_NEWS_CATEGORIES,
      authors: defaultAuthors,
    };
  }
}

export async function getGlobalNewsCategories(): Promise<string[]> {
  try {
    const [configs, posts] = await Promise.all([
      prisma.cMSSection.findMany({
        where: { sectionKey: 'news_config' },
        select: { payload: true },
      }),
      prisma.newsPost.findMany({
        where: { isPublished: true },
        select: { category: true },
      }),
    ]);

    const configuredCategories: string[] = [];
    for (const cfg of configs) {
      try {
        const parsed = JSON.parse(cfg.payload);
        if (Array.isArray(parsed.categories)) {
          for (const cat of parsed.categories) {
            if (typeof cat === 'string' && cat.trim()) {
              configuredCategories.push(cat.trim());
            }
          }
        }
      } catch {
        // Ignore
      }
    }

    const postCategories = posts
      .map((p) => (p.category || '').trim())
      .filter(Boolean);

    const primary = configuredCategories.length > 0
      ? mergeUniqueStrings(configuredCategories, DEFAULT_NEWS_CATEGORIES)
      : DEFAULT_NEWS_CATEGORIES;

    return mergeUniqueStrings(primary, postCategories);
  } catch {
    return DEFAULT_NEWS_CATEGORIES;
  }
}

