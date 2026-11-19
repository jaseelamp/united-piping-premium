# United Piping

Complete static corporate site: 30 content routes plus a 404 page, eight product categories, four service pages, four industry pages, corporate pages, material intelligence, and multi-product enquiry drafts.

## Run and edit

- Preview: `python3 -m http.server 4173 --directory dist`
- Edit structured content in `content/*.json`. Run `python3 build.py` to regenerate the HTML and public JSON.
- Edit reusable page templates in `build.py`; styles and browser behavior in `dist/assets/style.css` and `dist/assets/app.js`.
- Verify: `python3 verify.py` and `node --check dist/assets/app.js`.
- The original brief is retained in `content/brief.md`. No runtime dependency on Python or Node.

## Apache / cPanel

Upload the **contents** of `dist/`, including `.htaccess`, to the domain's document root. No SPA rewrite or server-side framework is required; every route has its own HTML document. Update `BASE` in `build.py` to the final domain and rebuild to regenerate canonicals, structured data, and sitemap. The `.openai/hosting.json` file is only used for Sites publishing.

## Enquiry integration

`dist/data/config.json` contains `rfqEndpoint`, `contactEndpoint`, `maxUploadMB`, and `legalApproved`. It is preserved during rebuilds. Endpoints are intentionally empty: the current forms validate and download explicit **unsent** text drafts. Do not present these as delivered enquiries.

To enable submission, implement HTTPS POST endpoints and approve/replace the privacy content; then set the endpoints and `legalApproved: true`. Requests use multipart/form-data. RFQ includes contact/company/project fields, JSON `items`, consent, and an optional `document`. Each item has id, material, grade, standard, size, quantity, and notes. Successful response must be JSON `{ "success": true, "reference": "SERVER-GENERATED-ID" }` with HTTP 2xx. Errors must use an appropriate non-2xx response. Only the server may establish accepted delivery. Configure same-origin endpoints or explicit origin CORS. A 20-second timeout produces an unconfirmed-delivery state; consider server-side idempotency before production.

Backend responsibilities: validate all fields and allowed category IDs, enforce size/file type limits server-side, scan files, protect stored documents, rate-limit abuse, prevent email/header injection, and configure retention and access controls. No secrets belong in public JSON. No analytics is installed. Contact fields and uploads are not persisted in browser storage; only product selections/specifications are. “Clear enquiry” removes this local draft data.

## Content approval before public launch

- Proposed UNITED PIPING wordmark requires company approval; legal name remains United Piping Solutions.
- Approve company/contact data and supplied technical dataset. In particular, the supplied `904/904L` stainless designation is preserved and flagged rather than silently changed.
- Confirm all grade/product/size combinations, dimensional requirements, and standards editions. No pressure or temperature ratings are invented. No company ISO certification badge is asserted.
- Replace the implementation data notice with approved legal privacy content before live data collection.
- Geographic markets are not depicted as offices; only Dubai is identified as headquarters.
- AI-generated conceptual media does not document company assets, personnel, stock, certified products, or dimensionally verified assemblies.

## Media and dependencies

Built-in imagegen produced `dist/assets/pipe-hero.jpg`, `products.jpg`, and `industries.jpg`. Prompts are recorded in `content/media-prompts.md`. The product/sector contact sheets are displayed with CSS positioning; source generated originals remain in the Codex generation directory, with the hero source also retained in `content/`.

Bootstrap 5.3.3, GSAP 3.12.5, and ScrollTrigger are bundled locally with their source license headers. Manrope, Inter, and IBM Plex Mono are locally hosted font files from Google Fonts (SIL Open Font License). See the relevant upstream license terms before redistribution. The site uses semantic HTML, keyboard-operable tabs/navigation, visible focus, responsive tables, and reduced-motion handling. WCAG and Core Web Vitals certification is not claimed.
