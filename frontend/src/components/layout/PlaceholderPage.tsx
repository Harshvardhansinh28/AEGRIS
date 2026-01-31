import React from 'react';
import { Rocket } from 'lucide-react';

export default function PlaceholderPage({ title }: { title: string }) {
    return (
        <div className="max-w-[1600px] mx-auto space-y-8">
            <div className="flex justify-between items-center pb-6 border-b border-[var(--border-primary)]">
                <h1 className="text-2xl font-bold text-[var(--text-primary)]">{title}</h1>
                <span className="px-3 py-1.5 bg-[var(--accent-warning)]/10 rounded-lg text-sm text-[var(--accent-warning)] font-semibold">
                    Coming Soon
                </span>
            </div>

            <div className="bg-[var(--bg-card)] border border-[var(--border-primary)] min-h-[500px] rounded-2xl flex flex-col items-center justify-center p-12 text-center">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[var(--accent-primary)] to-[var(--accent-secondary)] flex items-center justify-center mb-6 shadow-xl">
                    <Rocket size={40} className="text-white" />
                </div>
                <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-3">Feature In Development</h2>
                <p className="text-[var(--text-secondary)] text-sm max-w-md leading-relaxed">
                    The <span className="text-[var(--accent-primary)] font-semibold">{title}</span> module is currently being developed.
                    Advanced AI capabilities will be available soon.
                </p>
            </div>
        </div>
    );
}
