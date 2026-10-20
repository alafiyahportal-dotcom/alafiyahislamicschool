import { prisma } from '@/lib/prisma';

export type SchoolUnitKey = 'sd' | 'smp' | 'tk' | 'foundation';

export interface UnitVisitorData {
  key: SchoolUnitKey;
  name: string;
  shortName: string;
  total: number;
  today: number;
  thisWeek: number;
  color: string;
  badgeBg: string;
}

export interface WebsiteVisitorStats {
  totalAllUnits: number;
  totalToday: number;
  totalThisWeek: number;
  units: Record<SchoolUnitKey, UnitVisitorData>;
}

/**
 * Record a website visitor hit asynchronously.
 * Saves to prisma.notificationLog with eventType = 'WEBSITE_VISITOR_HIT'.
 * Strictly filters out admin paths, internal APIs, and automated bot user-agents.
 */
export async function recordWebsiteVisit(
  unit: SchoolUnitKey,
  path: string = '/',
  ip?: string,
  userAgent?: string
): Promise<void> {
  try {
    const safePath = (path || '/').slice(0, 100);
    const safeAgent = (userAgent || '').slice(0, 120);

    // Safety checks: never record admin, api, internal routes or bot crawlers
    if (
      safePath.startsWith('/admin') ||
      safePath.startsWith('/api') ||
      safePath.startsWith('/_next') ||
      safePath.startsWith('/auth')
    ) {
      return;
    }

    if (/bot|crawl|spider|headless|lighthouse/i.test(safeAgent)) {
      return;
    }

    // Server-side IP deduplication within 15 minutes per unit to prevent rapid double-counting
    if (ip) {
      const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000);
      const recentSameIpVisit = await prisma.notificationLog.findFirst({
        where: {
          eventType: 'WEBSITE_VISITOR_HIT',
          recipientPhone: unit,
          createdAt: { gte: fifteenMinutesAgo },
          metadata: {
            contains: ip,
          },
        },
        select: { id: true },
      });

      if (recentSameIpVisit) {
        return;
      }
    }

    // Asynchronously insert log without blocking visitor navigation
    await prisma.notificationLog.create({
      data: {
        eventType: 'WEBSITE_VISITOR_HIT',
        recipientPhone: unit,
        recipientName: unit.toUpperCase(),
        messageContent: `Website visit to ${unit} (${safePath})`,
        status: 'RECORDED',
        metadata: JSON.stringify({
          unit,
          path: safePath,
          ip: ip ? ip.slice(0, 45) : undefined,
          ua: safeAgent,
          t: Date.now(),
        }),
      },
    });
  } catch (error) {
    // Fail silently so user experience is never disrupted
    console.error('Failed to log website visit:', error);
  }
}

/**
 * Get real & valid visitor statistics for each unit directly from the database.
 * No mock or baseline numbers are used.
 */
export async function getWebsiteVisitorStats(): Promise<WebsiteVisitorStats> {
  try {
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    // Fetch recorded hits excluding any accidental admin routes
    const hits = await prisma.notificationLog.findMany({
      where: {
        eventType: 'WEBSITE_VISITOR_HIT',
        status: 'RECORDED',
        NOT: {
          messageContent: {
            contains: '/admin',
          },
        },
      },
      select: {
        recipientPhone: true,
        createdAt: true,
        metadata: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    const recordedCounts: Record<SchoolUnitKey, { total: number; today: number; week: number }> = {
      sd: { total: 0, today: 0, week: 0 },
      smp: { total: 0, today: 0, week: 0 },
      tk: { total: 0, today: 0, week: 0 },
      foundation: { total: 0, today: 0, week: 0 },
    };

    for (const hit of hits) {
      // Exclude headless crawler bots if any
      const meta = (hit.metadata || '').toLowerCase();
      if (meta.includes('headlesschrome') || meta.includes('lighthouse') || meta.includes('bot')) {
        continue;
      }

      const u = (hit.recipientPhone?.toLowerCase() as SchoolUnitKey) || 'foundation';
      if (recordedCounts[u]) {
        recordedCounts[u].total += 1;
        if (hit.createdAt >= startOfToday) {
          recordedCounts[u].today += 1;
        }
        if (hit.createdAt >= sevenDaysAgo) {
          recordedCounts[u].week += 1;
        }
      }
    }

    const units: Record<SchoolUnitKey, UnitVisitorData> = {
      sd: {
        key: 'sd',
        name: 'SDIT Al-Afiyah Majalengka',
        shortName: 'SDIT',
        total: recordedCounts.sd.total,
        today: recordedCounts.sd.today,
        thisWeek: recordedCounts.sd.week,
        color: '#064E3B',
        badgeBg: 'bg-emerald-50 text-emerald-800 border-emerald-200',
      },
      smp: {
        key: 'smp',
        name: 'SMP IT Al-Afiyah Majalengka',
        shortName: 'SMP IT',
        total: recordedCounts.smp.total,
        today: recordedCounts.smp.today,
        thisWeek: recordedCounts.smp.week,
        color: '#030164',
        badgeBg: 'bg-blue-50 text-blue-900 border-blue-200',
      },
      tk: {
        key: 'tk',
        name: 'TK IT Al-Afiyah Majalengka',
        shortName: 'TK IT',
        total: recordedCounts.tk.total,
        today: recordedCounts.tk.today,
        thisWeek: recordedCounts.tk.week,
        color: '#0284c7',
        badgeBg: 'bg-sky-50 text-sky-800 border-sky-200',
      },
      foundation: {
        key: 'foundation',
        name: 'Yayasan Pendidikan Imam Bonjol',
        shortName: 'Yayasan',
        total: recordedCounts.foundation.total,
        today: recordedCounts.foundation.today,
        thisWeek: recordedCounts.foundation.week,
        color: '#184F48',
        badgeBg: 'bg-teal-50 text-teal-800 border-teal-200',
      },
    };

    const totalAllUnits = Object.values(units).reduce((acc, curr) => acc + curr.total, 0);
    const totalToday = Object.values(units).reduce((acc, curr) => acc + curr.today, 0);
    const totalThisWeek = Object.values(units).reduce((acc, curr) => acc + curr.thisWeek, 0);

    return {
      totalAllUnits,
      totalToday,
      totalThisWeek,
      units,
    };
  } catch (error) {
    console.error('Error fetching visitor stats:', error);
    const emptyCounts = { total: 0, today: 0, thisWeek: 0 };
    const fallbackUnits: Record<SchoolUnitKey, UnitVisitorData> = {
      sd: {
        key: 'sd',
        name: 'SDIT Al-Afiyah Majalengka',
        shortName: 'SDIT',
        ...emptyCounts,
        color: '#064E3B',
        badgeBg: 'bg-emerald-50 text-emerald-800 border-emerald-200',
      },
      smp: {
        key: 'smp',
        name: 'SMP IT Al-Afiyah Majalengka',
        shortName: 'SMP IT',
        ...emptyCounts,
        color: '#030164',
        badgeBg: 'bg-blue-50 text-blue-900 border-blue-200',
      },
      tk: {
        key: 'tk',
        name: 'TK IT Al-Afiyah Majalengka',
        shortName: 'TK IT',
        ...emptyCounts,
        color: '#0284c7',
        badgeBg: 'bg-sky-50 text-sky-800 border-sky-200',
      },
      foundation: {
        key: 'foundation',
        name: 'Yayasan Pendidikan Imam Bonjol',
        shortName: 'Yayasan',
        ...emptyCounts,
        color: '#184F48',
        badgeBg: 'bg-teal-50 text-teal-800 border-teal-200',
      },
    };

    return {
      totalAllUnits: 0,
      totalToday: 0,
      totalThisWeek: 0,
      units: fallbackUnits,
    };
  }
}
