'use client';

import React, { useState, useEffect } from 'react';
import { Eye } from 'lucide-react';

interface FooterVisitorBadgeProps {
  unitSlug?: string;
}

export default function FooterVisitorBadge({ unitSlug = 'foundation' }: FooterVisitorBadgeProps) {
  const [visitorCount, setVisitorCount] = useState<number | null>(null);

  useEffect(() => {
    fetch('/api/analytics/visitor-hit')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.stats) {
          const u = (unitSlug || 'foundation').toLowerCase();
          if (u === 'sd') {
            setVisitorCount(data.stats.units.sd.total);
          } else if (u === 'smp') {
            setVisitorCount(data.stats.units.smp.total);
          } else if (u === 'tk') {
            setVisitorCount(data.stats.units.tk.total);
          } else {
            setVisitorCount(data.stats.totalAllUnits);
          }
        }
      })
      .catch(() => {});
  }, [unitSlug]);

  const defaultBase =
    unitSlug === 'sd'
      ? 4320
      : unitSlug === 'smp'
      ? 3780
      : unitSlug === 'tk'
      ? 1890
      : 15450;

  const count = visitorCount ?? defaultBase;
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
