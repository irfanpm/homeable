# Local verification — 27 October 2026

The source was installed and verified in **D:\homebele** on Windows, using Node.js 20.19.0 and Next.js 16.4.3. No deployment was performed.

## Automated checks

- Production build: passed, including TypeScript compilation and route generation.
- Six validation tests: passed. Coverage includes all four translation dictionaries, product/import schemas, hostile supplier URLs and image paths, price constraints, import bounds and scrypt password verification.
- Thirty-two integration checks: passed using an isolated temporary real MongoDB and production server. Covers all four locale pages; unsupported-locale 404; admin access control; origin checks; login success/failure; HttpOnly/Secure/SameSite cookies; MongoDB draft creation, update/publish and deletion; public search/category filtering; private supplier field exclusion from API and page HTML; import preview, draft commit and duplicate protection; invalid IDs; logout; forged tokens; and persistent login throttling.
- Production dependency audit: zero reported vulnerabilities at the time checked.

## Browser checks

Verified the desktop storefront and admin area in Chromium, including temporary admin login, persistence across reload, Malayalam product editing, saving a price change, import validation/preview, committing a disposable import as a draft, and sign-out. Real user store data was not involved.

Responsive browser checks cover desktop and a 390 × 844 mobile viewport. Malayalam exposed a narrow-screen heading overflow, corrected with flexible heading sizing and wrapping before final delivery. Storefront search, filters, saved pieces, product details, language switching and unavailable-contact feedback are checked in the final local preview.

## Configuration still required

- Real MongoDB connection, admin email, password hash and random session secret in `.env.local`.
- Real store WhatsApp number.
- Supplier-verified product data, actual matching licensed product photography and review of all language translations.
- Business-specific delivery, return and privacy terms.

The storefront includes a labelled illustrative catalog when MongoDB is not configured; admin remains locked until setup. The original referenced mockup was not retrievable, so the implementation is an original cream/olive design rather than a verified exact reproduction. Supplier import is a reviewed JSON workflow; it does not scrape Meesho, sync inventory or place orders.
