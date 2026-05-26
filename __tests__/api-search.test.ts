/**
 * @jest-environment node
 */
import { POST } from '@/app/api/search/route';
import { NextRequest } from 'next/server';

// Prevent the Anthropic client from making real network calls.
// __esModule: true is required because the route uses a default import.
jest.mock('@anthropic-ai/sdk', () => ({
  __esModule: true,
  default: jest.fn().mockImplementation(() => ({
    messages: { create: jest.fn() },
  })),
}));

function makeRequest(body: unknown): NextRequest {
  return new NextRequest('http://localhost/api/search', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
}

describe('POST /api/search', () => {
  it('returns 400 when idea is missing', async () => {
    const res = await POST(makeRequest({}));
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toBeTruthy();
  });

  it('returns 400 when idea is an empty string', async () => {
    const res = await POST(makeRequest({ idea: '' }));
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toMatch(/20/);
  });

  it('returns 400 when idea is fewer than 20 characters', async () => {
    const res = await POST(makeRequest({ idea: 'too short' }));
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toMatch(/20/);
  });

  it('returns 400 for an idea that is exactly 19 characters', async () => {
    const res = await POST(makeRequest({ idea: 'a'.repeat(19) }));
    expect(res.status).toBe(400);
  });

  it('returns 500 when ANTHROPIC_API_KEY is not set', async () => {
    const original = process.env.ANTHROPIC_API_KEY;
    delete process.env.ANTHROPIC_API_KEY;

    const res = await POST(makeRequest({ idea: 'a'.repeat(20) }));
    expect(res.status).toBe(500);
    const body = await res.json();
    expect(body.error).toMatch(/API key/i);

    process.env.ANTHROPIC_API_KEY = original;
  });
});
