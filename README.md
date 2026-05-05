# AlreadyBuilt?

**Client:** Sijia Shao
**Developer:** Yuang Liu

A web app that helps aspiring founders and builders quickly discover whether their product idea already exists. Enter a plain-language description of your idea, and AI will find similar existing products, compare them to your concept, and suggest how to differentiate.

---

## Problem

Validating a new product idea is time-consuming. Founders and students often spend hours manually searching for competitors, only to discover their idea already exists, or miss key competitors entirely. There's no simple tool that takes a plain-language idea and instantly returns a structured competitive landscape.

## Solution

AlreadyBuilt? automates early-stage competitive research:

1. User describes their idea in plain language
2. AI identifies 3–8 similar existing products
3. Each result includes a similarity / difference breakdown
4. A gap analysis summary and differentiation suggestions help the user decide how to proceed

## Tech Stack

| Layer | Choice | Rationale |
|---|---|---|
| Frontend + API | Next.js 14 (App Router) | UI and API routes in one repo; deploys cleanly to Vercel |
| Database + Auth | Supabase *(planned — not yet integrated, see Bug #3 in `BUG_REPORTS.md`)* | Postgres + Auth out of the box |
| AI | Claude API (`claude-sonnet-4-20250514`) with `web_search` tool | Real-time competitor discovery without a separate search API |
| Hosting | Vercel | Zero-config Next.js deployment |

---

## Timeline (Updated 2026-05-04 — Mid-point Check)

### Branch / PR State (verified against `git log` on 2026-05-04)

- **Merged into `main`:** PRs #1–#5 (setup, input form, Claude API + in-memory store, results page, similarities/differences + history)
- **Open PR — pending client feedback:** PR #6 (`feature/issue-6-differentiation`) — adds the "How to Differentiate" section. Blocked on client feedback to convert competitor comparison into a visual chart (see Bug #1)
- **In progress:** PR #7 (`feature/issue-7-polish`) — env config example + `web_search` tool fix. Does *not* yet add Supabase persistence

### Checkpoints

| Checkpoint | Date | Required Progress | Status |
|---|---|---|---|
| Check-in 1 | Apr 20 | Project setup, Claude API tested, app runs locally, deploys to Vercel | ✅ Done — PR #1 covers this. ⚠️ Supabase **not** initialized yet |
| Check-in 2 | **May 4 (today)** | Core feature working end-to-end: idea input → Claude → similar products + comparisons (Issues #1–#4) | ✅ **Done.** PRs #1–#5 are merged on `main` and the full input → analysis → results flow works locally with real Claude responses |
| Check-in 3 | May 18 | Full MVP: gap analysis, differentiation suggestions, search history saved to Supabase, error handling, responsive design (Issues #5–#7) | 🟡 Partially done. Issue #5 (similarities/differences + history page) is already merged. Issue #6 (differentiation suggestions) is implemented on its branch but blocked on the visual-chart feedback (Bug #1). Issue #7 (Supabase persistence + polish) is the largest remaining task (Bugs #3, #4) |
| Final Delivery | May 30 | All issues closed, demo-ready, polish + bug fixes | ⏳ Pending |

### Mid-point Evaluation

**On track — and ahead of schedule on feature breadth.** PRs #1–#5 are merged early (Issue #5 was originally scoped for Check-in 3). The full input → Claude search → results flow is verified working with real Claude responses (8 competitors + Crowded Market verdict + gap analysis). Issue #6 is implemented on its branch and only awaits the redesign to address client feedback.

The two real risks for Check-in 3 are:

1. **PR #6 visual-chart redesign** — current text-bullet layout is the largest unaddressed UX gap. This is the one piece of work that will most affect the demo. Recommend deciding on a chart library this week (e.g. `react-flow`, `d3`, or a hand-rolled SVG cluster) and shipping a v1 by May 14, with polish through May 18. See Bug #1.

2. **Supabase persistence missing** — original spec specified Supabase, but `lib/store.ts` is an in-memory array. This causes silent data loss on every restart and breaks shareable `/results/[id]` URLs in serverless deployment. Should be wired up before Check-in 3. See Bugs #3 and #4.

### Revised Plan for Check-in 3 (May 18)

Priority order:

1. **PR #6 visual chart redesign** (largest task — 4–6 days). Add `similarity_score` to `Competitor`. Build node/cluster chart with hover tooltips and click-to-expand panel. Update API prompt to request scores
2. **Supabase wiring** for history + result persistence (1–2 days). Add `@supabase/supabase-js`, schema for `searches` table, swap `lib/store.ts` for a Supabase client
3. **Counter UX cleanup** (Bug #2) and any other polish (0.5 days)
4. **Responsive design pass** + error-state polish (1 day)

If the visual chart cannot be completed by May 18, ship a v1 (basic SVG / CSS grid layout) and iterate before May 30.

---

## Team

| Role | Name |
|---|---|
| Client / Proposer | Sijia Shao |
| Developer | Yuang Liu |

## Development Fee

15 GIX Bucks

## Documents

- [`SPEC.md`](./SPEC.md) — User stories, specifications, acceptance criteria (on `architecture` branch)
- [`ARCHITECTURE.md`](./ARCHITECTURE.md) — Architecture document (on `architecture` branch)
- [`BUG_REPORTS.md`](./BUG_REPORTS.md) — Mid-point check bug reports (filed 2026-05-04)
- [`issues/`](./issues) — Each bug pre-formatted as a GitHub issue, ready to copy-paste

## Labels

| Label | Value |
|---|---|
| Stack | `stack:negotiable` |
| AI | `ai:yes` |
| Complexity | `complexity:medium` |
