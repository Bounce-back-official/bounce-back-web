# Bounce Back E-commerce — Implementation Specification

**Author:** Manus AI  
**Date:** 25 August 2026

## 1. Product Direction

Bounce Back will be implemented as a Shopify Online Store 2.0 theme maintained in GitHub. Shopify remains the commerce source of truth for products, variants, stock, cart, orders, checkout, discounts, payment methods, and future credit-card support. GitHub stores the custom Liquid theme, static campaign landing page, integration worker, and setup documentation.

The brand experience is **minimal, modern, premium, focused, and resilient**. The visual story uses the “Return Arc” idea: motion that bends back and moves forward. Typography, animation, and composition should feel disciplined rather than decorative.

## 2. Brand System

| Element | Specification |
|---|---|
| Primary background | Obsidian `#0E0E10` |
| Secondary background | Charcoal `#28282E` |
| Surface | Graphite `#3D4046` |
| Warm neutral | Taupe `#8A8276` |
| Accent neutral | Sand `#D9C8B7` |
| Light background | Bone `#F2EEE6` |
| Main display font | Avenir Next when available, with Montserrat/system fallback |
| Thai body font | Noto Sans Thai |
| Shape language | Return arcs, generous negative space, restrained rounded corners |
| Motion | 120–260 ms, transform/opacity only, reduced-motion support |

The primary logo is represented by a compact “Return Arc B” mark plus widely tracked uppercase wordmark. Theme settings allow the merchant to replace the built-in SVG with the final production logo asset without code changes.

## 3. Information Architecture

| Route / Shopify template | Customer purpose |
|---|---|
| Home | Discover new products, campaign activities, brand values, reviews, and editorial content |
| Collections | Browse all products or filter by pants, shirts, and accessories |
| Product | Review imagery, variants, live availability, care highlights, and add to cart |
| Cart | Edit quantity, remove items, proceed to Shopify checkout, view QR/manual-payment guidance, or contact LINE OA |
| Care guide | Learn washing, drying, storage, and performance-fabric care |
| Exchange request | Understand eligibility and submit the exchange form or contact LINE OA |
| Blog | Read exercise, recovery, clothing-care, and performance articles |
| Contact | Find LINE OA, email, business hours, and social links |

## 4. Homepage Composition

The homepage opens with an asymmetric editorial hero. The left side carries the campaign message **“NO MATTER HOW HARD YOU FALL, YOU CAN ALWAYS BOUNCE BACK.”** and the right side shows an athlete in motion. The hero leads into new arrivals, brand values, a campaign/activity banner, category navigation, product reviews, and an educational article strip.

The hierarchy should remain readable on mobile: one primary CTA per section, fixed bottom-safe LINE contact access, no auto-playing video, and no horizontally clipped text.

## 5. Product and Inventory Model

| Shopify field | Usage in storefront | Google Sheets mapping |
|---|---|---|
| Product ID / Variant ID | Stable commerce identifiers | `product_id`, `variant_id` |
| SKU | Human-operational stock key | `sku` |
| Product title | Display and order export | `product_title` |
| Option values | Size, color, fit | `variant_title` |
| Inventory quantity | Live availability and low-stock state | `available_quantity` |
| Price / compare-at price | Current and original price | `unit_price`, `compare_at_price` |
| Order name | Customer-facing order number | `order_name` |
| Financial status | Pending, paid, refunded | `financial_status` |
| Fulfillment status | Unfulfilled, fulfilled, partial | `fulfillment_status` |

Shopify will decrement managed inventory when orders are created according to store configuration. Shopify webhooks will mirror paid orders and inventory-level updates into Google Sheets. The sheet is therefore an operational mirror for accounting and Telegram stock lookup, not the concurrency authority. Shopify documents that webhook subscriptions push event payloads to a configured destination when the subscribed event occurs, avoiding polling.[1] Google Sheets provides an append endpoint for adding rows to the next row of a logical table.[2]

## 6. Payment Flow

The first release uses a **manual QR payment method configured in Shopify Admin**. The theme shows a payment explainer and an optional uploaded PromptPay QR image, but the final order creation still passes through Shopify Checkout. This preserves a valid order record and allows a later credit-card gateway to be added without replacing the storefront.

The QR image and account information must be configured by the merchant; no bank or personal payment data is committed to GitHub.

## 7. Integration Architecture

```text
Customer storefront
  → Shopify Cart / Checkout
  → Shopify Order + Inventory
      → order paid webhook ─┐
      → inventory update ───┼→ Secure webhook worker → Google Sheets
                            └→ optional Telegram workflow reads latest sheet
```

The webhook endpoint verifies Shopify’s HMAC signature before processing. Secrets are held in deployment environment variables. Failed and duplicate webhook deliveries are handled idempotently by writing Shopify event IDs or order/variant keys into the sheet workflow.

## 8. Editable Theme Settings

The merchant can edit logo, announcement text, LINE OA URL, contact email, social links, QR image, PromptPay display name, colors, and typography from Shopify Theme Editor. Homepage sections use JSON templates, which Shopify allows merchants to add, remove, and reorder in the editor.[3]

## 9. References

[1]: https://shopify.dev/docs/api/admin-graphql/latest/objects/WebhookSubscription "Shopify GraphQL Admin API — WebhookSubscription"
[2]: https://developers.google.com/workspace/sheets/api/reference/rest/v4/spreadsheets.values/append "Google Sheets API — spreadsheets.values.append"
[3]: https://shopify.dev/docs/storefronts/themes/architecture/templates/json-templates "Shopify Dev Docs — JSON templates"
