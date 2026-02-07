'use client';

import PageShell from '@/components/layout/pageshell';

export default function DatasetsPage() {
  return (
    <PageShell
      title="Datasets"
      subtitle="Market, feature, and training datasets"
    >
      <div className="
        bg-[var(--bg-card)]
        border border-[var(--border-primary)]
        rounded-2xl overflow-hidden
      ">
        <table className="w-full text-sm">
          <thead className="bg-[var(--bg-elevated)] text-left">
            <tr>
              <th className="p-4">Name</th>
              <th>Status</th>
              <th>Updated</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-t border-[var(--border-primary)]">
              <td className="p-4">Equities OHLCV</td>
              <td>Live</td>
              <td>Today</td>
            </tr>
            <tr className="border-t border-[var(--border-primary)]">
              <td className="p-4">Macro Indicators</td>
              <td>Cached</td>
              <td>Yesterday</td>
            </tr>
          </tbody>
        </table>
      </div>
    </PageShell>
  );
}
