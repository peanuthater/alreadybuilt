import Anthropic from '@anthropic-ai/sdk';
import { NextRequest, NextResponse } from 'next/server';
import { randomUUID } from 'crypto';
import { addSearch } from '@/lib/store';
import type { SearchResult } from '@/lib/types';

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

function extractJSON(text: string): string {
  // Strip markdown code blocks
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (fenced) return fenced[1].trim();

  // Extract first {...} block
  const start = text.indexOf('{');
  const end = text.lastIndexOf('}');
  if (start !== -1 && end > start) return text.slice(start, end + 1);

  return text.trim();
}

const SYSTEM_PROMPT = `You are a market research analyst. Given a business idea, you:
1. Use web search to find 3–8 real, existing products or companies that are similar
2. Analyze how they compare to the described idea
3. Identify gaps in the current market
4. Suggest differentiation strategies

You MUST respond with ONLY a valid JSON object — no markdown, no preamble, no explanation. The exact schema:

{
  "competitors": [
    {
      "name": "Product or Company Name",
      "url": "https://example.com",
      "description": "One or two sentence description of what they do",
      "similarities": ["similarity 1", "similarity 2"],
      "differences": ["difference 1", "difference 2"]
    }
  ],
  "gap_analysis": "2–4 sentence analysis of gaps in the market and what is currently underserved",
  "differentiation_angles": [
    "Specific angle 1 to differentiate",
    "Specific angle 2",
    "Specific angle 3"
  ],
  "market_verdict": "crowded"
}

market_verdict must be exactly one of: "crowded", "moderate", or "open".
Always include real URLs that actually exist. Find 3–8 competitors.`;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const idea: string = body?.idea ?? '';

    if (!idea || idea.trim().length < 20) {
      return NextResponse.json(
        { error: 'Idea must be at least 20 characters.' },
        { status: 400 },
      );
    }

    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json(
        { error: 'Server is not configured with an API key.' },
        { status: 500 },
      );
    }

    const userMessage = `Find existing products and companies similar to this idea, then return your analysis as JSON:\n\n"${idea.trim()}"`;

    let messages: Anthropic.MessageParam[] = [
      { role: 'user', content: userMessage },
    ];

    let response!: Anthropic.Message;
    const maxContinuations = 5;

    for (let i = 0; i < maxContinuations; i++) {
      response = await client.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 4096,
        system: SYSTEM_PROMPT,
        // web_search_20260209 is a server-side tool; cast to bypass SDK 0.40 type gap
        tools: [{ type: 'web_search_20260209', name: 'web_search', allowed_callers: ['direct'] }] as Anthropic.ToolUnion[],
        messages,
      });

      if (response.stop_reason === 'end_turn') break;

      // pause_turn: server-side tool loop hit its 10-iteration limit; re-send to continue
      // Cast string because pause_turn was added after SDK 0.40 was released
      if ((response.stop_reason as string) === 'pause_turn') {
        // Server-side tool loop hit its iteration limit; re-send to continue
        messages = [
          { role: 'user', content: userMessage },
          { role: 'assistant', content: response.content },
        ];
        continue;
      }

      // Any other stop reason (e.g. max_tokens) — stop looping
      break;
    }

    // Extract the text block from Claude's final response
    const textBlock = response.content.find(
      (b): b is Anthropic.TextBlock => b.type === 'text',
    );

    if (!textBlock?.text) {
      return NextResponse.json(
        { error: 'No text response from AI. Please try again.' },
        { status: 500 },
      );
    }

    let parsed: Partial<SearchResult>;
    try {
      parsed = JSON.parse(extractJSON(textBlock.text));
    } catch {
      console.error('JSON parse failed. Raw response:\n', textBlock.text);
      return NextResponse.json(
        { error: 'AI returned an unexpected format. Please try again.' },
        { status: 500 },
      );
    }

    const id = randomUUID();

    const result: SearchResult = {
      id,
      idea: idea.trim(),
      timestamp: new Date().toISOString(),
      competitors: Array.isArray(parsed.competitors) ? parsed.competitors : [],
      gap_analysis: typeof parsed.gap_analysis === 'string' ? parsed.gap_analysis : '',
      differentiation_angles: Array.isArray(parsed.differentiation_angles)
        ? parsed.differentiation_angles
        : [],
      market_verdict:
        parsed.market_verdict === 'crowded' ||
        parsed.market_verdict === 'moderate' ||
        parsed.market_verdict === 'open'
          ? parsed.market_verdict
          : 'moderate',
    };

    addSearch(result);

    return NextResponse.json({ id });
  } catch (err) {
    console.error('Search API error:', err);
    const message =
      err instanceof Error ? err.message : 'Unexpected error occurred.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
