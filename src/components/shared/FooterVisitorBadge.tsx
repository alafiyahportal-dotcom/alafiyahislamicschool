'use client';

import React, { useState, useEffect } from 'react';
import { Eye } from 'lucide-react';

interface FooterVisitorBadgeProps {
  unitSlug?: string;
}

export default function FooterVisitorBadge({ unitSlug = 'foundation' }: FooterVisitorBadgeProps) {
  const [visitorCount, setVisitorCount] = useState<number | null>(null);

  const applyStats = (stats: any) => {
    if (!stats) return;
    const u = (unitSlug || 'foundation').toLowerCase();
    if (u === 'sd') {
      setVisitorCount(stats.units?.sd?.total ?? null);
    } else if (u === 'smp') {
      setVisitorCount(stats.units?.smp?.total ?? null);
    } else if (u === 'tk') {
      setVisitorCount(stats.units?.tk?.total ?? null);
    } else {
      setVisitorCount(stats.totalAllUnits ?? null);
    }
  };

  useEffect(() => {
    fetch('/api/analytics/visitor-hit', { cache: 'no-store' })
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.stats) {
          applyStats(data.stats);
        }
      })
      .catch(() => {});

    const handleStatsUpdated = (event: Event) => {
      const customEvent = event as CustomEvent<{ stats: any }>;
      if (customEvent.detail?.stats) {
        applyStats(customEvent.detail.stats);
      }
    };

    window.addEventListener('alafiyah_visitor_stats_updated', handleStatsUpdated);
    return () => {
      window.removeEventListener('alafiyah_visitor_stats_updated', handleStatsUpdated);
    };
  }, [unitSlug]);


  const count = visitorCount ?? 0;
  const unitLabel =
    unitSlug === 'sd'
      ? 'SDIT'
      : unitSlug === 'smp'
      ? 'SMP IT'
      : unitSlug === 'tk'
      ? 'TK IT'
      : 'Ekosistem Al-Afiyah';

  return (
    <div className="inline-flex items-center gap-2 bg-slate-800/80 px-3 py-1.5 rounded-full border border-slate-700/60 text-slate-400">
      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
      <span className="text-[11px] font-medium text-slate-400">
        Pengunjung Web {unitLabel}:
      </span>
      <span className="font-mono font-bold text-slate-200 text-xs">
        {count.toLocaleString('id-ID')}
      </span>
      <span className="text-[10px] text-slate-500">orang</span>
    </div>
  );
}
