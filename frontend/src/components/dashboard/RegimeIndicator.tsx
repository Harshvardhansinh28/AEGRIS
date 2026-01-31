'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Radio } from 'lucide-react';
import AegisCard from '../ui/AegisCard';

export default function RegimeIndicator() {
    return (
        <AegisCard className="flex items-center justify-between !p-4 border-[var(--accent-primary)]" style={{ background: 'color-mix(in srgb, var(--accent-primary) 8%, var(--bg-card))' }}>
            <div className="flex items-center gap-3">
                <div className="relative">
                    <div className="absolute inset-0 bg-[var(--accent-primary)] rounded-full blur animate-pulse-glow opacity-50"></div>
                    <Radio className="text-[var(--accent-primary)] relative z-10" size={24} />
                </div>
                <div>
                    <div className="text-xs uppercase tracking-wider text-[var(--accent-primary)] font-bold mb-0.5">Current Regime</div>
                    <div className="text-lg font-bold text-[var(--text-primary)]">High Volatility (Bull)</div>
                </div>
            </div>

            <div className="flex gap-1">
                {[1, 2, 3, 4].map((i) => (
                    <motion.div
                        key={i}
                        className="w-1 bg-[var(--accent-primary)] rounded-full"
                        animate={{ height: [8, 16, 8] }}
                        transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.1 }}
                    />
                ))}
            </div>
        </AegisCard>
    );
}
