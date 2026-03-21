# OTOS Ripple Effect Diagram (Premium)

This folder contains a premium, concentric ripple-effect “cost to society” diagram with:
- Conservative vs Upper Bound toggle
- Animated vs Static Export mode
- Hover tooltip (with linked sources)
- Click-to-expand breakdown panel
- Export-ready SVG generator (including a 16:9 variant)

## How to view (interactive)
- **Canonical:** `otos-ripple-effect-premium/otos-ripple-effect-premium.html` — full cost-ring diagram (site links use this).
- `index.html` — redirects to `otos-ripple-effect-premium.html` so folder URLs open the diagram on static hosts.
- `ripple-cascade.html` — separate canvas cascade animation (optional demo).

## Static SVG exports (developer)
The repo’s shared SVG generator lives at:
- `rippleSvgExport.js`

It provides:
- `exportRippleSvg({ view, mode })` (1200×1200)
- `exportRippleSvg16x9({ view, mode })` (1200×675)

## React / TypeScript deliverables
React component + tooltip + TS export wrapper:
- `react/RippleCostDiagram.tsx`
- `react/TooltipWithSource.tsx`
- `react/rippleSvgExport.ts`

## Generated export assets (checked in)
Run `node generateSvgExports.js` to regenerate these:
- `exports/ripple-premium-conservative-1200x1200-static.svg`
- `exports/ripple-premium-upper-1200x1200-static.svg`
- `exports/ripple-premium-conservative-1200x675-static.svg`
- `exports/ripple-premium-upper-1200x675-static.svg`

## Source URLs (verification)

Footer sources required by the prompt:
- King’s Fund — NHS Key Facts and Figures (2025/26 page): https://www.kingsfund.org.uk/insight-and-analysis/data-and-charts/key-facts-figures-nhs
- GOV.UK — Addiction: https://www.gov.uk/government/publications/life-sciences-healthcare-goals/addiction-healthcare-goals
- Carol Black Review (independent review of drugs): https://www.gov.uk/government/collections/independent-review-of-drugs-by-professor-dame-carol-black
- NAO — Reducing the harm from illegal drugs: https://www.nao.org.uk/reports/reducing-the-harm-from-illegal-drugs/
- NHS ADHD Taskforce: https://www.england.nhs.uk/mental-health/adhd/
- Faraone et al (2021): https://pubmed.ncbi.nlm.nih.gov/38388701/

Additional ring-detail links used in the tooltip / expanded panel:
- NHS Reference Costs (collection landing): https://www.gov.uk/government/collections/nhs-reference-costs
- DWP administrative costs (collection landing): https://www.gov.uk/government/collections/dwp-administrative-costs
- Supported housing (collection landing): https://www.gov.uk/government/collections/supported-housing
- Temporary accommodation statistics (collection landing): https://www.gov.uk/government/collections/temporary-accommodation-statistics
- Hidden Harm (next-generation risk context): https://assets.publishing.service.gov.uk/media/5a756e6be5274a3edd9a4dcb/hidden-harm-full.pdf
- Local Government Association (street cleansing context): https://www.local.gov.uk/
- Community Life Survey (volunteering context): https://www.gov.uk/government/statistics/community-life-survey-202425-annual-publication/community-life-survey-202425-volunteering-and-charitable-giving
- GOV.UK statistics landing (neighbourhood disruption context): https://www.gov.uk/government/statistics
- NHS children / young people mental health services page (family impact context): https://www.nhs.uk/nhs-services/mental-health-services/mental-health-services-for-children-and-young-people/

