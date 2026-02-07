'use client';

import React from 'react';
import { LucideIcon } from 'lucide-react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface MetricWidgetProps {
  title: string;
  value: string | number;
  change?: number;
  icon: LucideIcon;
}

export default function MetricWidget({
  title,
  value,
  change = 0,
  icon: Icon,
}: MetricWidgetProps) {
  const isPositive = change >= 0;

  return (
    <div className="relative bg-[var(--bg-card)] border border-[var(--border-primary)] rounded-xl p-6 overflow-hidden">

      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[var(--accent-primary)]/5 to-transparent pointer-events-none" />

      <div className="relative z-10">
        <div className="flex justify-between items-start mb-4">
          <div className="p-2.5 bg-[var(--bg-elevated)] rounded-lg border border-[var(--border-primary)]">
            <Icon
              size={20}
              className="text-[var(--accent-primary)]"
              strokeWidth={2}
            />
          </div>

          <div
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold ${
              isPositive
                ? 'bg-[var(--accent-success)]/10 text-[var(--accent-success)]'
                : 'bg-[var(--accent-danger)]/10 text-[var(--accent-danger)]'
            }`}
          >
            {isPositive ? (
              <ArrowUpRight size={14} />
            ) : (
              <ArrowDownRight size={14} />
            )}
            {Math.abs(change).toFixed(2)}%
          </div>
        </div>

        <p className="text-sm text-[var(--text-secondary)] mb-1">
          {title}
        </p>

        <h3 className="text-2xl font-bold text-[var(--text-primary)]">
          {value}
        </h3>
      </div>
    </div>
  );
}
