# Homebele

A locally built, premium home essentials enquiry catalog using Next.js App Router, TypeScript, Tailwind CSS 4, shadcn/ui-style source components (Radix Dialog and Slot), Next.js Route Handlers and MongoDB/Mongoose. No deployment has been performed.

## Start on Windows

Requires Node.js 20.9+ (Node 22 LTS recommended) and npm. Open PowerShell:

```powershell
cd D:\homebele
npm ci
npm run dev
```

Open **http://127.0.0.1:3000/en**. For a portable copy, extract the ZIP anywhere and run the same commands in that folder.

Without `.env.local`, the storefront displays the reviewed snapshot of 13 owner-selected Meesho products. With MongoDB configured, published database products are authoritative. Admin stays locked until its email and password hash are configured. No default credentials or fake WhatsApp number are included.

## Connect your store

1. Copy `.env.example` to `.env.local`.
2. Set `MONGODB_URI` to your local MongoDB or Atlas connection string. Use a dedicated database user with access only to the Homebele database. Keep the file private.
3. Set `ADMIN_EMAIL` to your admin email.
4. Run `npm run admin:password` in an interactive terminal. Enter and confirm a unique password (14–256 characters; input is hidden). Paste the generated `ADMIN_PASSWORD_HASH` and `SESSION_SECRET` into `.env.local`. Do not put the plaintext password in the file.
5. Set `NEXT_PUBLIC_WHATSAPP_NUMBER` to the store's real international number, digits only, e.g. country code + number. Do not include spaces or `+`.
6. Set `NEXT_PUBLIC_SITE_URL=http://127.0.0.1:3000` for the local preview. This exact origin is used for write-request validation. If you use `localhost` instead, change this value and use that same address consistently.
7. Restart the development server. Open **http://127.0.0.1:3000/admin** and sign in.

Once MongoDB is configured, only published database products are shown. An empty database shows an empty collection; database failures show an unavailable message rather than silently serving a local snapshot. Run `npm run import:selected` to insert the reviewed selection into your configured database. It inserts only missing slugs and preserves existing administrator edits.

`npm run import:selected` inserts the 13 owner-selected products as published catalog entries, as authorized for this collection. The generic admin JSON importer still forces drafts for future unreviewed imports. `npm run seed` is a separate optional command that inserts the old illustrative sample products as drafts; it is not needed for the selected collection.

## Included

- Responsive home page, six occupied category tiles with the original layout, multilingual product names/descriptions, EN/ML/HI/TA language URLs and language switching that preserves catalog state. Categories for cleaning, personal care and accessories support the selected inventory; old categories remain supported in admin.
- Text search across all language names/descriptions; category and price filters; featured, new and price sorting; clear filters and empty states.
- Product details, image gallery, related pieces, shareable `?product=slug` links and browser-local saved products.
- Localized WhatsApp enquiry messages with product name, slug, price and share link. Contact remains disabled with an explanatory message until a real number is configured. The site never sends a WhatsApp message automatically.
- Admin sign-in, sign-out, product creation/editing/deletion, draft/published state, homepage featuring, badges, galleries, private Meesho links and supplier notes.
- Agent-assisted JSON imports with template download, upload/paste, validation, database-backed duplicate checks, preview and explicit commit. Imports always become drafts. See `IMPORT_GUIDE.md`.
- Localized story, enquiry guidance, delivery/returns guidance and privacy dialogs.

Admin UI is English. Storefront interface and product names/descriptions support all four languages. Free-text material/dimension fields are entered by the administrator and shown as provided. Have a native speaker review translations and final business copy before launch.

## Verify

```powershell
npm run typecheck
npm test
npm run build
npm run test:integration
```

The integration check starts a temporary real MongoDB and a separate production server on port 3100, exercises auth and catalog operations, and removes its disposable database. It does not use or change your configured MongoDB. `mongodb-memory-server` may download an official MongoDB binary on its first run. Override the test port with `TEST_PORT` if needed.

`npm run build` and `npm start` provide a production preview. The development and production scripts bind to loopback only. Webpack is selected explicitly for reliable Windows builds.

## Security and operational notes

- Admin secrets are server-only environment variables. Passwords use randomly salted Node scrypt hashes and constant-time comparison.
- Signed HS256 session tokens expire after eight hours. Cookies are HttpOnly, SameSite=Strict and Secure in production. Production use requires HTTPS. Logout clears the browser cookie; a copied token stays valid until expiration. Rotating the password hash or session secret invalidates existing tokens.
- All admin reads and writes require a verified session. Writes require an exact allowed origin. Login is limited in MongoDB to 10 attempts per 15-minute window for the single admin account, across application instances.
- Request bodies and batch size are bounded; Zod validates all write data; slug indexes prevent duplicates; supplier URL hostnames are allowlisted. The importer never fetches arbitrary links or scrapes third-party sites.
- Public responses omit Meesho URLs and supplier notes. MongoDB data is dynamic and not baked into a static build.
- Basic security headers and a production Content Security Policy are included. Before public hosting, use HTTPS, configure the exact origin, backups, monitoring, strong credentials and database network restrictions. Do not expose the development server publicly.
- This is an **enquiry catalog**, without checkout, payment processing, stock synchronization or automatic Meesho ordering. Supplier import is an agent-prepared, administrator-reviewed JSON workflow, not an autonomous scraping service.
- Image inputs support HTTPS URLs and local `/images/` files. Remote images are loaded directly by the visitor's browser, so use trusted licensed hosts. To use your own photography, copy it into `public/images/` and enter the local path. Binary image upload/storage is not configured.

## Design reference and remaining store inputs

The referenced conversation exposed only user messages and placeholder references for assistant replies; the original desktop/mobile mockup could not be recovered. This implementation uses an original warm cream/olive editorial design and cannot claim an exact visual match. Supply that mockup for a faithful refinement.

Before real enquiries or publication: add your MongoDB connection, admin account, WhatsApp number, verified product data and licensed matching photography; confirm business-specific delivery, returns and privacy copy. `IMAGE_CREDITS.md` lists sample photo sources.

## Main files

`src/components/storefront.tsx` — storefront; `src/components/admin-panel.tsx` — admin; `src/lib/i18n.ts` — translations; `src/lib/validation.ts` — product/import validation; `src/lib/auth.ts` — authentication; `src/app/api/` — backend Route Handlers; `src/app/globals.css` — visual system. Secrets belong only in `.env.local`.

## Selected Meesho collection — 27 October 2026

The 14 supplied links contained one duplicate (`77k55v`), giving 13 unique products. Current listed Meesho prices were used without markup at the owner’s request. `data/selected-products.json` contains the four-language reviewed catalog; `data/supplier-provenance.json` records source links and data inconsistencies. No unverified medical, food-safety, warranty or temperature claims were added. Confirm colour variants, uncertain dimensions and current availability before accepting an order.

Thirteen lead images were generated with built-in ImageGen from the actual supplier photo references, using cream stone backgrounds and soft lighting. Each gallery also includes the original supplier photo and labels the two image types. Actual product colours were preserved. `PRODUCT_IMAGE_PROMPTS.md` records the final prompts. Image files are in `public/images/products/`. The original hero, page layout, spacing and card dimensions remain in place.

MongoDB settings were stored only in the installed project’s private `.env.local`; they are deliberately excluded from the portable archive. Admin email/password and the store WhatsApp number are still separate settings.

## WhatsApp contact and local catalog review

WhatsApp enquiries use **+91 77360 36583**. Product buttons prepare a message with the product name, price and link; the visitor still chooses whether to send it. The public default is in `src/lib/store-contact.ts`, and `NEXT_PUBLIC_WHATSAPP_NUMBER` overrides it. No private database settings are included in the portable project.

For a local review while Atlas is unavailable, run `npm run build` followed by `npm run preview:snapshot`. This explicitly uses the reviewed 13-product local snapshot and labels the preview. It does not write to MongoDB or silently replace the normal database catalog. The public products API reports `source: "snapshot"` or `source: "database"`.

The 13 products were successfully inserted in the dedicated `homebele` database and verified again on 28 October 2026. A temporary Atlas TLS connection failure during an earlier idle session recovered; certificate verification was never disabled. Normal `npm run dev` / `npm start` use MongoDB. The explicit snapshot command is available for local review if Atlas is unreachable; it is labelled and is not proof of a healthy live connection. Atlas connection troubleshooting: https://www.mongodb.com/docs/atlas/troubleshoot-connection/.
