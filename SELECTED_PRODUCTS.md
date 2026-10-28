# Owner-selected product collection

15 unique products: the original 13 from 14 submitted links, plus two additions on 28 October 2026. One original scrub-brush link was deduplicated. The initial 13 prices were checked on 27 October and used without markup; the two later selling prices were explicitly supplied by the owner. Supplier links and notes are excluded from public responses.

| Product | Price (INR) | Category |
| --- | ---: | --- |
| Seven-grid organiser trio | 239 | storage |
| Pivot-head scrub brush | 156 | cleaning |
| Soft-step EVA flip-flops | 460 | accessories |
| Everyday spray mop | 390 | cleaning |
| Flexible-reach duster | 140 | cleaning |
| Tear-away cloth roll · 20 sheets | 130 | kitchen |
| Rechargeable foot-care roller | 296 | care |
| Clear bathroom shelves · Set of 2 | 188 | bath |
| Pivot brush with scraper | 95 | cleaning |
| Waistband straps · Set of 2 | 147 | accessories |
| Silicone mealtime set · 6 pieces | 392 | kitchen |
| Retractable towel clip | 195 | bath |
| Silicone pastry mat | 122 | kitchen |
| Green hanging sink strainer | 230 | kitchen |
| Silicone soap-dispensing bath brush | 180 | bath |

All products have EN/ML/HI/TA names and descriptions, a Homebele styled image, and the original supplier photograph in the gallery. Conflicting supplier metadata was not turned into factual marketing claims. Prices and colour availability require confirmation on enquiry.

Import with `npm run import:selected` after configuring `.env.local`. This inserts missing slugs only; it does not overwrite existing administrator edits. Future unreviewed JSON batches imported through admin continue to enter as drafts.

Images were created using the built-in ImageGen tool. Final prompts: `PRODUCT_IMAGE_PROMPTS.md`. Project assets: `public/images/products/`. No deployment was performed.

For the two latest products, `npm run import:additions` uses actual supplier images until the four new assets have been deployed, then safely adopts the styled galleries. Source files are ready; code deployment needs owner approval.
