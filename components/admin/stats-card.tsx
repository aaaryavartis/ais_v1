'use client';

import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: number | string;
  subtitle: string;
  icon: LucideIcon;
  colorClass?: string;
}

export function StatsCard({ title, value, subtitle, icon: Icon, colorClass = 'bg-brand-500/10 text-brand-600' }: StatsCardProps) {
  return (
    <div className="glass-card rounded-3xl p-5 border border-slate-200/80 dark:border-slate-800 flex items-center justify-between">
      <div>
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">
          {title}
        </span>
        <div className="text-2xl font-extrabold text-slate-900 dark:text-white">
          {value}
        </div>
        <p className="text-[11px] text-slate-400 mt-1">{subtitle}</p>
      </div>

      <div className={`p-3.5 rounded-2xl ${colorClass} shrink-0 shadow-sm`}>
        <Icon className="w-6 h-6" />
      </div>
    </div>
  );
}
