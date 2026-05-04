import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getSearch } from '@/lib/store';
import type { Competitor } from '@/lib/types';

export const dynamic = 'force-dynamic';

const verdictConfig = {
  crowded: {
    label: 'Crowded Market',
    bg: 'bg-red-100',
    text: 'text-red-700',
    border: 'border-red-200',
    dot: 'bg-red-500',
  },
  moderate: {
    label: 'Moderate Competition',
    bg: 'bg-amber-100',
    text: 'text-amber-700',
    border: 'border-amber-200',
    dot: 'bg-amber-500',
  },
  open: {
    label: 'Open Market',
    bg: 'bg-green-100',
    text: 'text-green-700',
    border: 'border-green-200',
    dot: 'bg-green-500',
  },
};

function CompetitorCard({ competitor }: { competitor: Competitor }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-3 mb-3">
        <h3 className="font-semibold text-gray-900 text-lg leading-snug">
          {competitor.name}
        </h3>
        <a
          href={competitor.url}
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 text-xs font-medium text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 px-2.5 py-1 rounded-full transition-colors whitespace-nowrap"
        >
          Visit ↗
        </a>
      </div>
      <p className="text-sm text-gray-600 mb-4">{competitor.description}</p>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
            Similarities
          </p>
          <ul className="space-y-1.5">
            {competitor.similarities.map((s, i) => (
              <li key={i} className="flex items-start gap-1.5 text-sm text-gray-700">
                <span className="text-amber-500 mt-0.5 shrink-0">•</span>
                {s}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
            Differences
          </p>
          <ul className="space-y-1.5">
            {competitor.differences.map((d, i) => (
              <li key={i} className="flex items-start gap-1.5 text-sm text-gray-700">
                <span className="text-blue-500 mt-0.5 shrink-0">•</span>
                {d}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default function ResultsPage({ params }: { params: { id: string } }) {
  const result = getSearch(params.id);

  if (!result) {
    notFound();
  }

  const verdict = verdictConfig[result.market_verdict] ?? verdictConfig.moderate;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm text-gray-500 mb-1">Analysis for</p>
          <h1 className="text-2xl font-bold text-gray-900 leading-snug max-w-2xl">
            &ldquo;{result.idea}&rdquo;
          </h1>
        </div>
        <Link
          href="/"
          className="shrink-0 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-lg transition-colors"
        >
          New Search
        </Link>
      </div>

      {/* Market verdict + gap analysis */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
        <div className="flex items-center gap-3">
          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium border ${verdict.bg} ${verdict.text} ${verdict.border}`}
          >
            <span className={`w-2 h-2 rounded-full ${verdict.dot}`} />
            {verdict.label}
          </span>
          <span className="text-xs text-gray-400">
            {result.competitors.length} competitor{result.competitors.length !== 1 ? 's' : ''} found
          </span>
        </div>

        <div>
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">
            Gap Analysis
          </h2>
          <p className="text-gray-800 leading-relaxed">{result.gap_analysis}</p>
        </div>
      </div>

      {/* Competitors with comparison */}
      <section>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Similar Products</h2>
        <div className="space-y-4">
          {result.competitors.map((competitor, i) => (
            <CompetitorCard key={i} competitor={competitor} />
          ))}
        </div>
      </section>

      {/* Footer */}
      <div className="flex items-center justify-between pt-2 border-t border-gray-200">
        <p className="text-xs text-gray-400">
          Analyzed on {new Date(result.timestamp).toLocaleString()}
        </p>
        <Link
          href="/"
          className="text-sm font-medium text-indigo-600 hover:text-indigo-800 transition-colors"
        >
          ← New Search
        </Link>
      </div>
    </div>
  );
}
