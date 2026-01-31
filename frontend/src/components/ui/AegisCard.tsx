import React from 'react';
import clsx from 'clsx';

interface AegisCardProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
    className?: string;
    glow?: boolean;
}

export default function AegisCard({ children, className, glow = false, ...props }: AegisCardProps) {
    return (
        <div
            className={clsx(
                'glass-panel',
                'rounded-xl p-6 transition-all duration-300',
                glow && 'hover:shadow-[0_0_20px_var(--accent-glow)] hover:border-[var(--accent-primary)]',
                className
            )}
            style={{
                background: 'var(--bg-glass)',
                border: '1px solid var(--glass-border)',
            }}
            {...props}
        >
            {children}
        </div>
    );
}
