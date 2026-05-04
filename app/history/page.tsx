import Link from 'next/link';
import { getAllSearches } from '@/lib/store';

export const dynamic = 'force-dynamic';

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
  const searches = getAllSearches();

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

      {searches.length === 0 ? (
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
          {searches.map((search) => (
            <Link
              key={search.id}
              href={`/results/${search.id}`}
              className="block bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md hover:border-indigo-200 transition-all"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-gray-900 font-medium leading-snug truncate">
                    {search.idea}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(search.timestamp).toLocaleString()} ·{' '}
                    {search.competitors.length} competitor
                    {search.competitors.length !== 1 ? 's' : ''} found
                  </p>
                </div>
                <span
                  className={`shrink-0 text-xs font-medium px-2.5 py-1 rounded-full ${
                    verdictBadge[search.market_verdict] ?? verdictBadge.moderate
                  }`}
                >
                  {verdictLabel[search.market_verdict] ?? 'Moderate'}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
