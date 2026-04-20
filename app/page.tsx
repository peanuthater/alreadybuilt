'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const MIN_LENGTH = 20;

export default function HomePage() {
  const router = useRouter();
  const [idea, setIdea] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const isValid = idea.trim().length >= MIN_LENGTH;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!isValid || loading) return;

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idea: idea.trim() }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Something went wrong. Please try again.');
        return;
      }

      router.push(`/results/${data.id}`);
    } catch {
      setError('Network error. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  }

  const remaining = MIN_LENGTH - idea.trim().length;

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-gray-900 mb-3">
          Is your idea already built?
        </h1>
        <p className="text-lg text-gray-500">
          Describe your concept and we'll find existing products — plus help you
          carve out your unique angle.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <label htmlFor="idea" className="block text-sm font-medium text-gray-700 mb-2">
          Describe your idea
        </label>
        <textarea
          id="idea"
          value={idea}
          onChange={(e) => setIdea(e.target.value)}
          rows={5}
          disabled={loading}
          placeholder="e.g. A mobile app that helps remote teams track daily standups asynchronously, with AI summaries and automatic blocker detection..."
          className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-400 resize-none"
        />

        <div className="flex items-center justify-between mt-2 mb-4">
          <span
            className={`text-xs ${
              idea.trim().length === 0
                ? 'text-gray-400'
                : isValid
                ? 'text-green-600'
                : 'text-amber-600'
            }`}
          >
            {idea.trim().length === 0
              ? `Minimum ${MIN_LENGTH} characters required`
              : isValid
              ? `${idea.trim().length} characters`
              : `${remaining} more character${remaining !== 1 ? 's' : ''} needed`}
          </span>
          <span className="text-xs text-gray-400">{idea.length} / ∞</span>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={!isValid || loading}
          className="w-full py-3 px-6 rounded-lg font-semibold text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <svg
                className="animate-spin h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </svg>
              Analyzing… this may take 20–40 seconds
            </>
          ) : (
            'Analyze'
          )}
        </button>
      </form>

      <p className="text-center text-xs text-gray-400 mt-4">
        Powered by Claude with web search · Results are AI-generated and may not be exhaustive
      </p>
    </div>
  );
}
