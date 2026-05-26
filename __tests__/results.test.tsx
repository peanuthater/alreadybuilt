import { render, screen } from '@testing-library/react';
import ResultsPage from '@/app/results/[id]/page';
import type { SearchResult } from '@/lib/types';

// notFound() throws a special Next.js error — keep it as a throw so tests
// that expect missing-data behaviour can assert with expect(...).toThrow().
jest.mock('next/navigation', () => ({
  notFound: jest.fn(() => {
    throw new Error('NEXT_NOT_FOUND');
  }),
}));

const mockResult: SearchResult = {
  id: 'test-id-123',
  idea: 'A mobile app for tracking async daily standups with AI summaries',
  timestamp: '2026-01-01T12:00:00.000Z',
  market_verdict: 'moderate',
  gap_analysis: 'There is a meaningful gap in the market for lightweight async standup tools.',
  differentiation_angles: [
    'Focus on async-first remote teams',
    'AI-generated blocker detection',
  ],
  competitors: [
    {
      name: 'Standuply',
      url: 'https://standuply.com',
      description: 'A Slack-based standup bot for remote teams.',
      similarities: ['Async standups', 'Team activity tracking'],
      differences: ['Slack-only', 'No built-in AI summaries'],
    },
    {
      name: 'Geekbot',
      url: 'https://geekbot.com',
      description: 'Automated standup reports inside Slack.',
      similarities: ['Standup automation', 'Remote-friendly'],
      differences: ['No video', 'Limited integrations outside Slack'],
    },
  ],
};

// Encode exactly the same way the API route does (Node Buffer → base64).
const encodedData = Buffer.from(JSON.stringify(mockResult)).toString('base64');

// Always passes a { data } searchParams so the default works for valid-data tests.
// Tests that want to omit 'data' entirely build the props inline (see notFound tests).
function renderResults(data: string = encodedData) {
  return render(
    <ResultsPage
      params={{ id: mockResult.id }}
      searchParams={{ data }}
    />,
  );
}

describe('ResultsPage', () => {
  // React logs caught errors to console.error; suppress that noise for the
  // notFound tests so the output stays clean.
  let consoleErrorSpy: jest.SpyInstance;
  beforeEach(() => {
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  });
  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  it('renders the idea text in the page heading', () => {
    renderResults();
    expect(
      screen.getByText(/A mobile app for tracking async daily standups/i),
    ).toBeInTheDocument();
  });

  it('renders all competitor names', () => {
    renderResults();
    expect(screen.getByText('Standuply')).toBeInTheDocument();
    expect(screen.getByText('Geekbot')).toBeInTheDocument();
  });

  it('renders competitor descriptions', () => {
    renderResults();
    expect(screen.getByText(/Slack-based standup bot/i)).toBeInTheDocument();
    expect(screen.getByText(/Automated standup reports/i)).toBeInTheDocument();
  });

  it('renders similarity and difference bullet points for a competitor', () => {
    renderResults();
    expect(screen.getByText('Async standups')).toBeInTheDocument();
    expect(screen.getByText('Slack-only')).toBeInTheDocument();
  });

  it('renders the gap analysis text', () => {
    renderResults();
    expect(
      screen.getByText(/meaningful gap in the market/i),
    ).toBeInTheDocument();
  });

  it('renders differentiation angles', () => {
    renderResults();
    expect(screen.getByText(/Focus on async-first remote teams/i)).toBeInTheDocument();
    expect(screen.getByText(/AI-generated blocker detection/i)).toBeInTheDocument();
  });

  it('renders the correct market verdict badge', () => {
    renderResults();
    expect(screen.getByText('Moderate Competition')).toBeInTheDocument();
  });

  it('renders the competitor count', () => {
    renderResults();
    expect(screen.getByText(/2 competitors found/i)).toBeInTheDocument();
  });

  it('renders Visit links for each competitor', () => {
    renderResults();
    const links = screen.getAllByRole('link', { name: /visit/i });
    expect(links).toHaveLength(2);
    expect(links[0]).toHaveAttribute('href', 'https://standuply.com');
    expect(links[1]).toHaveAttribute('href', 'https://geekbot.com');
  });

  it('calls notFound when the data param is missing', () => {
    // Render without any searchParams.data — must not use the helper since
    // passing `undefined` to a default-param function still uses the default.
    expect(() =>
      render(<ResultsPage params={{ id: mockResult.id }} searchParams={{}} />),
    ).toThrow('NEXT_NOT_FOUND');
  });

  it('calls notFound when the data param is not valid base64 JSON', () => {
    expect(() => renderResults('not-valid-base64!!')).toThrow('NEXT_NOT_FOUND');
  });
});
