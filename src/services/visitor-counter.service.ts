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

// Fast in-memory cache (60 seconds TTL) to prevent repeated full DB scans on every page load
let cachedStats: WebsiteVisitorStats | null = null;
let cachedAt = 0;
const STATS_CACHE_TTL_MS = 60 * 1000;

// Fast in-memory IP deduplication (2 minutes TTL) to avoid slow LIKE '%ip%' database queries
const recentIpVisits = new Map<string, number>();

/**
 * Record a website visitor hit asynchronously without blocking visitor navigation.
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

    const nowMs = Date.now();
    if (ip) {
      const dedupKey = `${unit}:${ip}`;
      const lastHit = recentIpVisits.get(dedupKey);
      if (lastHit && nowMs - lastHit < 2 * 60 * 1000) {
        return;
      }
      recentIpVisits.set(dedupKey, nowMs);
      if (recentIpVisits.size > 2000) {
        recentIpVisits.clear();
      }
    }

    // Optimistically bump in-memory cache immediately if present
    if (cachedStats && cachedStats.units[unit]) {
      cachedStats.units[unit].total += 1;
      cachedStats.units[unit].today += 1;
      cachedStats.units[unit].thisWeek += 1;
      cachedStats.totalAllUnits += 1;
      cachedStats.totalToday += 1;
      cachedStats.totalThisWeek += 1;
    }

    // Fire-and-forget DB insert so API returns in <2ms
    prisma.notificationLog
      .create({
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
            t: nowMs,
          }),
        },
      })
      .catch(() => {});
  } catch {
    // Fail silently so user experience is never disrupted
  }
}

/**
 * Get visitor statistics using SQL GROUP BY + 60-second in-memory cache.
 */
export async function getWebsiteVisitorStats(): Promise<WebsiteVisitorStats> {
  const nowMs = Date.now();
  if (cachedStats && nowMs - cachedAt < STATS_CACHE_TTL_MS) {
    return cachedStats;
  }

  try {
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const baseWhere = {
      eventType: 'WEBSITE_VISITOR_HIT',
      status: 'RECORDED',
    };

    const [totalGroup, todayGroup, weekGroup] = await Promise.all([
      prisma.notificationLog.groupBy({
        by: ['recipientPhone'],
        where: baseWhere,
        _count: { _all: true },
      }),
      prisma.notificationLog.groupBy({
        by: ['recipientPhone'],
        where: { ...baseWhere, createdAt: { gte: startOfToday } },
        _count: { _all: true },
      }),
      prisma.notificationLog.groupBy({
        by: ['recipientPhone'],
        where: { ...baseWhere, createdAt: { gte: sevenDaysAgo } },
        _count: { _all: true },
      }),
    ]);

    const recordedCounts: Record<
      SchoolUnitKey,
      { total: number; today: number; week: number }
    > = {
      sd: { total: 0, today: 0, week: 0 },
      smp: { total: 0, today: 0, week: 0 },
      tk: { total: 0, today: 0, week: 0 },
      foundation: { total: 0, today: 0, week: 0 },
    };

    for (const row of totalGroup) {
      const u = ((row.recipientPhone || '').toLowerCase() as SchoolUnitKey) || 'foundation';
      if (recordedCounts[u]) recordedCounts[u].total += row._count._all;
    }
    for (const row of todayGroup) {
      const u = ((row.recipientPhone || '').toLowerCase() as SchoolUnitKey) || 'foundation';
      if (recordedCounts[u]) recordedCounts[u].today += row._count._all;
    }
    for (const row of weekGroup) {
      const u = ((row.recipientPhone || '').toLowerCase() as SchoolUnitKey) || 'foundation';
      if (recordedCounts[u]) recordedCounts[u].week += row._count._all;
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

    const result: WebsiteVisitorStats = {
      totalAllUnits,
      totalToday,
      totalThisWeek,
      units,
    };

    cachedStats = result;
    cachedAt = nowMs;
    return result;
  } catch (error) {
    console.error('Error fetching visitor stats:', error);
    if (cachedStats) return cachedStats;
    const emptyCounts = { total: 0, today: 0, thisWeek: 0 };
    return {
      totalAllUnits: 0,
      totalToday: 0,
      totalThisWeek: 0,
      units: {
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
      },
    };
  }
}
