'use client';

import PageShell from '@/components/layout/pageshell';

export default function ModelsPage() {
  return (
    <PageShell
      title="Models"
      subtitle="Registered AI models and health status"
    >
      <div className="
        bg-[var(--bg-card)]
        border border-[var(--border-primary)]
        rounded-2xl p-6
      ">
        <ul className="space-y-3 text-sm">
          <li>🧠 AEGRIS-RL v1 — Healthy</li>
          <li>🧠 Momentum Agent — Training</li>
          <li>🧠 Risk Sentinel — Idle</li>
        </ul>
      </div>
    </PageShell>
  );
}

