'use client';

import React from 'react';
import { ArrowUpRight, ArrowDownRight, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';

interface MetricWidgetProps {
    title: string;
    value: string;
    change: number;
    icon?: React.ElementType;
    trend?: number[];
}

export default function MetricWidget({ title, value, change, icon: Icon = TrendingUp, trend }: MetricWidgetProps) {
    const isPositive = change >= 0;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -2, transition: { duration: 0.2 } }}
            className="bg-[var(--bg-card)] border border-[var(--border-primary)] rounded-xl p-5 hover:border-[var(--border-elevated)] transition-all group relative overflow-hidden"
        >
            {/* Background Gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-[var(--accent-primary)] to-transparent opacity-0 group-hover:opacity-[0.04] transition-opacity" />

            <div className="relative z-10">
                <div className="flex justify-between items-start mb-4">
                    <div className="p-2.5 bg-[var(--bg-elevated)] rounded-lg border border-[var(--border-primary)]">
                        <Icon size={20} className="text-[var(--accent-primary)]" strokeWidth={2} />
                    </div>
                    <div className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold ${isPositive
                            ? 'bg-[var(--accent-success)]/10 text-[var(--accent-success)]'
                            : 'bg-[var(--accent-danger)]/10 text-[var(--accent-danger)]'
                        }`}>
                        {isPositive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                        {Math.abs(change).toFixed(1)}%
                    </div>
                </div>

                <h3 className="text-[var(--text-secondary)] text-sm font-medium mb-2">{title}</h3>

                <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-[var(--accent-primary)] tracking-tight">
                        {value}
                    </span>
                </div>

                {/* Mini Trend Line */}
                {trend && (
                    <div className="mt-4 h-8 flex items-end gap-0.5">
                        {trend.map((val, i) => (
                            <div
                                key={i}
                                className={`flex-1 rounded-sm ${isPositive ? 'bg-[var(--accent-success)]/20' : 'bg-[var(--accent-danger)]/20'}`}
                                style={{ height: `${val}%` }}
                            />
                        ))}
                    </div>
                )}
            </div>
        </motion.div>
    );
}
