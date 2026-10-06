import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

import { DEFAULT_AFFILIATE_CONTENT } from '@/types/affiliate-cms';

export async function GET() {
  try {
    const school = await prisma.school.findUnique({
      where: { slug: 'foundation' },
      include: {
        cmsSections: {
          where: { sectionKey: 'affiliate' },
        },
      },
    });

    let customContent = {};
    if (school?.cmsSections?.[0]?.payload) {
      try {
        customContent = JSON.parse(school.cmsSections[0].payload);
      } catch (err) {
        console.error('Failed to parse affiliate CMS payload:', err);
      }
    }

    return NextResponse.json({
      success: true,
      content: {
        ...DEFAULT_AFFILIATE_CONTENT,
        ...customContent,
      },
    });
  } catch (error) {
    console.error('Error fetching affiliate CMS content:', error);
    return NextResponse.json({
      success: true,
      content: DEFAULT_AFFILIATE_CONTENT,
    });
  }
}
