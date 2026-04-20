export interface Competitor {
  name: string;
  url: string;
  description: string;
  similarities: string[];
  differences: string[];
}

export interface SearchResult {
  id: string;
  idea: string;
  timestamp: string;
  competitors: Competitor[];
  gap_analysis: string;
  differentiation_angles: string[];
  market_verdict: 'crowded' | 'moderate' | 'open';
}
