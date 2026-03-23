# OTOS Continuity — Cambridge Pilot wireframes

UI wireframe concepts for the Cambridge Pilot interface. **Four distinct views**, each right-sized for the person using it.

## Audiences

| View | Who uses it | Device | Complexity |
|------|-------------|--------|-------------|
| 1. Participant onboarding | Person in recovery / cohort member | Mobile (QR → web) | Ultra-minimal |
| 2. Bedside / rapid handoff (alcohol liaison) | CPFT on-site alcohol liaison, A&E, bedside staff | Mobile-first | Low — 3 actions max |
| 3. Coordinator dashboard (CGL / CRS view) | Keyworker, coordinator, reviewer | Desktop / tablet | Medium — overview + review queue |
| 4. Commissioner reporting (Scott view) | Commissioner, sponsor | Desktop | Read-only — metrics only |

## Design system

- **Colours:** White background, OTOS blue `#0066CC`, light grey for secondary panels, amber/orange for alerts only
- **Typography:** Inter (clean sans-serif)
- **Desktop:** 1440px wide
- **Mobile:** iPhone 14 Pro frame (393×852 logical)
- **Accessibility:** Large tap targets (ADHD-safe, ND-first), calm colours, no red unless escalation

## Screens (by wireframe)

### Wireframe 1 — Participant onboarding
- Welcome → Consent → Anonymous ID (XXXX-XXXX) → First check-in (😔/😐/😊) → Next step → Done
- Progress indicator (Step 1 of 5). "I need help" visible but not prominent.

### Wireframe 2 — Bedside / alcohol liaison
- Scan QR or enter 8-digit code → Participant found → Record touchpoint (Attended / Referred / Fast-track ADHD) → Receipt
- Fast-track ADHD = single toggle; RTC / QbTest as one-tap referral. Receipt automatic.

### Wireframe 3 — Coordinator dashboard
- Overview: Active participants, check-ins, follow-through %, drift alerts, reviews pending
- Drift / escalation queue (prominent) with Review / Mark resolved / Escalate
- Human review panel: decision, outcome, next step — timestamped automatically
- Export: "Download this week's snapshot (CSV)". No clinical info — codes only.

### Wireframe 4 — Commissioner report
- One-page: Week 8 of 12, participants vs target, On track
- Core metrics: follow-through rate, median drift, human reviews, **ADHD fast-track (8 → 6 RTC, 2 QbTest)**
- Follow-through trend chart (bar chart weeks 1–8)
- Open items, Download full snapshot. Aggregates only — no participant data.

## Export as PDF

**Easiest (no Node/Puppeteer):** Open **print-all.html** in Chrome → **File → Print → Destination: Save as PDF** → Save. You get one PDF with all 13 wireframe screens (one page per screen). Use this for Notion or sharing.

**Script (if Puppeteer works):** `npm install` then `npm run export-pdf`. Writes individual PDFs and `wireframes-all.pdf` to `exports/`.

## Export as PNG at 2× resolution

1. `npm install`
2. `npm run export`
3. PNGs in `exports/` (desktop 2880px wide, mobile 2× device frame).

**Manual:** Open each HTML, use DevTools device toolbar for mobile, then capture or zoom 200% and screenshot.

## RFP technical flow (Wireframe 5)

The full system data flow (tokenised ID, check-in engine, drift timer, escalation, human review, handoff receipts, ADHD referral path, commissioner reporting) is for the developer brief — see the Notion/spec for the Mermaid diagram. All flows are token-based; no PII in the system.

## 6 Demo routes

Each demo route maps to Wireframe 2 (bedside) or 3 (coordinator), adapted per context — see the spec table for Demo 1–6 differences.
