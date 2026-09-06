# Vitals — custom Shopify theme for Verdvna

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

### Design system — Italian apothecary

The look is derived from the Verdvna packaging (bottle-green glass, cream label, majolica
band, Cormorant small caps) and from the owner's other store, Ornare, whose configuration
this theme mirrors in spirit: serif display type, a geometric sans for everything small,
tracked uppercase labels, hairlines instead of shadows, no rounded corners on images,
pill buttons, and a lot of cream space.

All colour, typography, spacing and corner values come from theme settings and are exposed
as CSS custom properties in `layout/theme.liquid`. `assets/base.css` holds shared primitives
(buttons, fields, media, product card, accordion, pagination, the `.numeral` and
`.frame--double` utilities). Section-specific CSS lives in each section's `{% stylesheet %}`
block. Liquid is **not** rendered inside `{% stylesheet %}` or `{% javascript %}` blocks —
dynamic values are passed in through inline `style="--custom-property: value"` attributes.

**Type.** Headings are Cormorant (`cormorant_n4`); the Light cut is loaded as well and used
for display sizes (`.h0`, the slideshow heading, the quotation style of Rich text). Body is
Jost (`jost_n4`) at 16px/1.7 with 0.02em tracking. `h4`/`.h4`, eyebrows, buttons, badges,
field labels and navigation are small tracked uppercase Jost — the "secondary line" of an
apothecary label. Roman numerals (`.numeral`) are Cormorant semibold.

**Colour.** Five schemes, all measured from the packaging: 1 paper `#FFFCF7`, 2 label cream
`#FFF6F1`, 3 bottle green `#213D0C` with cream type (the box), 4 Ornare deep earth `#3D1F0E`,
5 majolica-tile parchment `#F9EBD2`. Text is the brand green everywhere on light schemes;
the accent is the brass of the jar cap `#A88551`, used for stars and hover underlines only.
The majolica blues and ochres appear solely inside the ornament band.

**Ornament band.** `sections/ornament-band.liquid` repeats a strip cut from the label
(`assets/majolica-band.jpg`, 1800 × 89px) between sections. Replace it with the original
artwork at a tile-period width for a seamless repeat; the crop will show a faint seam on
very wide screens.

**Numbered products.** The product card shows a Roman numeral above the title when the
product has a `custom.numeral` metafield (single line text, e.g. `I`); the degree sign is
added by the theme. Create the metafield definition under Settings → Custom data → Products.

Anything shared between two or more sections belongs in `base.css`, not in a section
stylesheet — section CSS is only served when that section renders on the page.

### Fonts and Cyrillic

Fonts come from the theme editor's font picker (`type_body_font`, `type_header_font`) and
are loaded in `layout/theme.liquid` inside a `<style>` block — the `font_face` filter emits
raw `@font-face` CSS, so it must never sit bare in `<head>`. Bold, italic and bold-italic
faces are loaded via `font_modify` so that `font-weight: 600/700` and `<em>` never fall back
to browser-synthesised faux styles.

**Cyrillic is guaranteed independently of the picker — and has to be.** Shopify's font CDN
(`fonts.shopifycdn.com`) serves Latin-only subsets of every font in the picker. Measured on
2026-09-05: twelve real CDN files across Inter, Source Sans Pro, Roboto, Nunito Sans,
Montserrat and PT Serif — families whose upstream releases all contain full Cyrillic — each
have 0 glyphs in U+0400–04FF. The CDN's Inter file even carries the same build string as the
official Inter 3.19 release, which has 254 Cyrillic codepoints; same build, Cyrillic stripped.
Shopify documents this: font files include "Basic Latin, Latin-1 Supplement, Latin
Extended-A, Currency Symbols… If you need to use a broader range of characters, then you can
use system fonts, Typekit, and other solutions." So no picker choice can render Cyrillic on
its own. The theme therefore self-hosts a
Cyrillic-only subset of **Source Sans 3** — the typeface Assistant was derived from — in
`assets/`:

- `source-sans-3-cyrillic-upright.woff2` (31 KB) and `source-sans-3-cyrillic-italic.woff2` (23 KB)
- declared with `unicode-range: U+0400-04FF, U+2116` (exactly what the files contain), so
  they are only used for Cyrillic glyphs and №, never for Latin
- placed second in every font stack: the picker font renders Latin, this face renders any
  Cyrillic glyph the picker font lacks, then a cross-platform system stack, then Shopify's
  generic fallback
- declared at exactly the weights and styles the picker font has in Shopify's library
  (regular, 600, 700, and italics only when the picker font has italics — Assistant does not),
  so mixed Latin/Cyrillic text stays weight- and style-matched and never pairs a true italic
  with a synthesised one
- preloaded on every page alongside the body font (32 KB, cached after the first page) so
  Bulgarian text never flashes in a system font — a Bulgarian store carries Cyrillic content
  long before Bulgarian is published as a storefront language, so a locale gate would never fire

Because `layout/theme.liquid` sets `<html lang>` from the request locale, Source Sans 3's
Bulgarian localised letterforms (`locl` for `cyrl/BGR`) switch on automatically for a Bulgarian
storefront — the distinctive Bulgarian shapes of д, л, ф, и, т and в rather than the Russian
ones. Those letterforms and the `:lang()` tracking adjustments in `base.css` key off the
request locale, so Bulgarian must be published as a storefront language (Settings →
Languages; the theme does not yet ship a `locales/bg.json`) for them to activate. Choosing a
system font in the picker bypasses the fallback, since system fonts carry their own Cyrillic.

The picker default is **Source Sans Pro** (`source_sans_pro_n4`), Source Sans 3's previous
name, so Latin and Cyrillic come from one design. Assistant — the original default — was
itself derived from Source Sans Pro and measures identically (cap height 657 vs 656 units,
x-height 485 vs 486), so the switch is invisible; what it adds is true italics, which
Assistant does not have in Shopify's library. The heading `letter-spacing` is driven by
`--font-heading-tracking`, which flips positive when the uppercase heading option is on.

Source Sans 3 is © Adobe, licensed under the SIL Open Font License 1.1; the licence text is
retained in the font files' name table. To regenerate the subsets from the upstream variable
fonts (`google/fonts` → `ofl/sourcesans3`):

```bash
pyftsubset SourceSans3[wght].ttf --unicodes="U+0400-052F,U+1C80-1C8F,U+2DE0-2DFF,U+A640-A69F,U+2116" --flavor=woff2 --layout-features='*' --name-IDs='*' --output-file=source-sans-3-cyrillic-upright.woff2
```

### Sections

Commerce: `main-product`, `main-collection`, `main-cart`, `main-search`, `main-page`,
`main-blog`, `main-article`, `main-list-collections`, `main-404`, `contact-form`.

Marketing: `slideshow` (hero carousel modelled on Ornare's — full-viewport height, arrows
with a "1 / 3" counter, per-slide content position and colour scheme, solid / outline /
text-link CTAs, mobile image; fade or drift, autoplay with a pause control, paused on
hover/focus/hidden tab and for reduced-motion visitors, keyboard and swipe, first slide
eager), `hero` (single static banner),
`featured-collection`, `benefits`, `ingredients`, `testimonials`, `faq`, `newsletter`,
`image-with-text` (with hairline or double-rule frame), `rich-text` (standard or ruled
italic quotation), `ornament-band`.

Global: `header`, `footer`, `announcement-bar` (wired up via `header-group.json` and
`footer-group.json`). On the home page, when the first section is a slideshow, the header
sits transparent over the first slide in light type and turns solid once scrolled (the
"Transparent over the homepage hero" setting) — so give that slide a dark image or a dark
colour scheme. Stickiness is applied to Shopify's section wrapper via `:has()`, because a
sticky element cannot stick beyond its own container.

`ingredients` is the supplements-specific one — a per-serving breakdown of each active with
its dose, built for brands that publish full formulas rather than proprietary blends.

The product page is block-based, so the order of vendor, title, price, variant picker, buy
buttons, trust badges and collapsible rows is rearrangeable in the theme editor.

### Language

The storefront ships in Bulgarian. `locales/bg.json` mirrors `en.default.json` key for key
(theme check enforces parity), every template and section-group carries Bulgarian content,
and section schema defaults are Bulgarian so newly added sections match. Merchant-facing
editor labels stay English. Register: polite lowercase "ви" in sentences, short singular
imperatives on buttons ("Добави в количката", "Виж всички"), „…“ quotes, spaced en dash,
euro pricing. Dates use the `date_formats.month_day_year` locale key. For `<html lang="bg">`,
the Bulgarian letterforms and the Cyrillic tracking rules to activate, Bulgarian must be
the store's published language (Settings → Languages).

## Before launch

These need a real store and cannot be done from the codebase alone:

1. **Create the menus.** The header expects a menu with the handle `main-menu` and the
   footer expects `footer`. Create them under Navigation in the Shopify admin.
2. **Set the collection** on the Featured collection sections (homepage and product page).
3. **Upload a logo and favicon** in theme settings. Without a logo the shop name renders as
   text, which is a deliberate fallback rather than a placeholder.
4. **Replace the placeholder copy.** The slideshow, story, ingredient doses (the °I Lumen
   example formula), testimonials and FAQ answers are realistic filler and must be replaced
   with your own. Upload slide images (3200 × 1800, plus optional 1100 × 1500 portrait crops)
   in the theme editor — without images the slides show their colour scheme.
5. **Check health-claim wording.** Supplement claims in the EU are governed by Regulation
   (EC) 1924/2006 and the authorised list in Regulation (EU) 432/2012. The sample copy uses
   authorised wording where a claim is made ("допринася за поддържане на нормално зрение")
   and stays descriptive elsewhere, but nothing here has been reviewed by a regulatory
   professional.
