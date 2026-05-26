'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getLocalSearchEntries } from '@/lib/store';
import type { StoredEntry } from '@/lib/store';

const verdictBadge = {
  crowded: 'bg-red-100 text-red-700',
  moderate: 'bg-amber-100 text-amber-700',
  open: 'bg-green-100 text-green-700',
};

const verdictLabel = {
  crowded: 'Crowded',
  moderate: 'Moderate',
  open: 'Open',
};

export default function HistoryPage() {
  const [entries, setEntries] = useState<StoredEntry[]>([]);

  useEffect(() => {
    setEntries(getLocalSearchEntries());
  }, []);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Search History</h1>
        <Link
          href="/"
          className="text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-lg transition-colors"
        >
          New Search
        </Link>
      </div>

      {entries.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-xl border border-gray-200">
          <p className="text-gray-400 text-lg mb-4">No searches yet</p>
          <Link
            href="/"
            className="text-indigo-600 hover:text-indigo-800 font-medium transition-colors"
          >
            Analyze your first idea →
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {entries.map(({ result, encodedData }) => (
            <Link
              key={result.id}
              href={`/results/${result.id}?data=${encodeURIComponent(encodedData)}`}
              className="block bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md hover:border-indigo-200 transition-all"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-gray-900 font-medium leading-snug truncate">
                    {result.idea}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(result.timestamp).toLocaleString()} ·{' '}
                    {result.competitors.length} competitor
                    {result.competitors.length !== 1 ? 's' : ''} found
                  </p>
                </div>
                <span
                  className={`shrink-0 text-xs font-medium px-2.5 py-1 rounded-full ${
                    verdictBadge[result.market_verdict] ?? verdictBadge.moderate
                  }`}
                >
                  {verdictLabel[result.market_verdict] ?? 'Moderate'}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
