# Vitals — custom Shopify theme

A custom Shopify theme built from scratch for a supplements brand. No Dawn fork, no
third-party CSS or JS libraries. Everything here is theme code you own.

## Getting started

The Shopify CLI is installed locally as a dev dependency, so every command is prefixed
with `npx`.

Connect the theme to a store and start a local dev server with live reload:

```bash
npx shopify theme dev --store your-store.myshopify.com
```

The first run opens a browser to authenticate. After that, the CLI prints a local preview
URL and a shareable preview link. Edits to files are pushed live as you save.

Push the theme to the store as a new unpublished theme:

```bash
npx shopify theme push --unpublished --theme "Vitals"
```

Run the linter across every file:

```bash
npx shopify theme check
```

## Structure

```
assets/      base.css (design system) and customer-addresses.js
config/      theme settings schema and saved values
layout/      theme.liquid — the HTML shell for every page
locales/     en.default.json — all customer-facing strings
sections/    page building blocks, each with its own schema, CSS and JS
snippets/    reusable fragments (product-card, price, icon, pagination, meta-tags)
templates/   JSON files mapping sections onto each page type
```

### Design system

All colour, typography, spacing and corner values come from theme settings and are exposed
as CSS custom properties in `layout/theme.liquid`. `assets/base.css` holds shared primitives
(buttons, fields, media, product card, accordion, pagination). Section-specific CSS lives in
each section's `{% stylesheet %}` block.

Colour is handled through Shopify colour schemes, so any section can be recoloured in the
theme editor without touching code. Five schemes ship by default: white, warm off-white,
deep forest, near-black, and soft sage. Note that Liquid is **not** rendered inside
`{% stylesheet %}` or `{% javascript %}` blocks — dynamic values are passed in through
inline `style="--custom-property: value"` attributes.

Anything shared between two or more sections belongs in `base.css`, not in a section
stylesheet — section CSS is only served when that section renders on the page.

### Sections

Commerce: `main-product`, `main-collection`, `main-cart`, `main-search`, `main-page`,
`main-blog`, `main-article`, `main-list-collections`, `main-404`, `contact-form`.

Marketing: `hero`, `featured-collection`, `benefits`, `ingredients`, `testimonials`, `faq`,
`newsletter`, `image-with-text`, `rich-text`.

Global: `header`, `footer`, `announcement-bar` (wired up via `header-group.json` and
`footer-group.json`).

`ingredients` is the supplements-specific one — a per-serving breakdown of each active with
its dose, built for brands that publish full formulas rather than proprietary blends.

The product page is block-based, so the order of vendor, title, price, variant picker, buy
buttons, trust badges and collapsible rows is rearrangeable in the theme editor.

## Before launch

These need a real store and cannot be done from the codebase alone:

1. **Create the menus.** The header expects a menu with the handle `main-menu` and the
   footer expects `footer`. Create them under Navigation in the Shopify admin.
2. **Set the collection** on the Featured collection sections (homepage and product page).
3. **Upload a logo and favicon** in theme settings. Without a logo the shop name renders as
   text, which is a deliberate fallback rather than a placeholder.
4. **Replace the placeholder copy.** Product benefit claims, ingredient doses, testimonials
   and FAQ answers are all realistic filler and must be replaced with your own.
5. **Check your market's supplement labelling rules.** Health claims on supplements are
   regulated in most territories. Nothing in this theme has been reviewed for compliance.
