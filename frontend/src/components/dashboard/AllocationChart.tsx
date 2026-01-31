'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const ASSET_NAMES = [
    'BTC', 'ETH', 'SPY', 'QQQ', 'GLD', 'TLT', 'USD', 'AAPL', 'MSFT', 'GOOGL'
];

const COLORS = [
    '#F59E0B', '#EDB88B', '#FE6F5E', '#6B5B73', '#22C55E',
    '#1B263B', '#B45309', '#E85A4F', '#8B7355', '#F59E0B'
];

interface AllocationChartProps {
    weights?: number[];
}

export default function AllocationChart({ weights }: AllocationChartProps) {
    const data = weights
        ? weights.map((w, i) => ({
            name: ASSET_NAMES[i] || `Asset ${i}`,
            value: w * 100,
            color: COLORS[i % COLORS.length]
        })).filter(d => d.value > 1)
        : [{ name: 'Cash', value: 100, color: '#737373' }];

    return (
        <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="bg-[var(--bg-card)] border border-[var(--border-primary)] rounded-xl p-6 h-[450px] flex flex-col"
        >
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h3 className="text-lg font-bold text-[var(--text-primary)] mb-1">Asset Allocation</h3>
                    <p className="text-sm text-[var(--text-secondary)]">AI-optimized portfolio</p>
                </div>
                <div className="px-3 py-1.5 bg-[var(--accent-primary)]/10 rounded-lg">
                    <span className="text-xs font-semibold text-[var(--accent-primary)]">AI OPTIMIZED</span>
                </div>
            </div>

            <div className="flex-1 w-full min-h-0" style={{ minHeight: 280 }}>
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            innerRadius={70}
                            outerRadius={110}
                            paddingAngle={2}
                            dataKey="value"
                            stroke="none"
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Pie>
                        <Tooltip
                            contentStyle={{
                                background: 'var(--bg-elevated)',
                                border: '1px solid var(--border-primary)',
                                borderRadius: '12px',
                                color: 'var(--text-primary)'
                            }}
                            formatter={(value: any) => `${Number(value).toFixed(1)}%`}
                        />
                        <Legend
                            verticalAlign="bottom"
                            height={36}
                            formatter={(value) => (
                                <span className="text-xs font-medium text-[var(--text-secondary)]">{value}</span>
                            )}
                        />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </motion.div>
    );
}
