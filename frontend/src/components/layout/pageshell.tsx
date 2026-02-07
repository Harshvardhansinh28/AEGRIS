'use client';

import { motion } from 'framer-motion';

type Props = {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
};

export default function PageShell({ title, subtitle, children }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="p-8 space-y-6 max-w-[1600px]"
    >
      <div>
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">
          {title}
        </h1>
        {subtitle && (
          <p className="text-sm text-[var(--text-secondary)] mt-1">
            {subtitle}
          </p>
        )}
      </div>

      <div className="space-y-6">{children}</div>
    </motion.div>
  );
}
