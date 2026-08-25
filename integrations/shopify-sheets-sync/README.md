# Shopify → Google Sheets Sync

This Cloudflare Worker receives Shopify webhooks, verifies the Shopify HMAC signature, and writes paid orders plus current inventory into Google Sheets. It is designed for Bounce Back's accounting mirror and Telegram stock lookup.

## Data flow

| Shopify event | Sheet action |
|---|---|
| `orders/paid` | Append one order summary row to `Orders` and item rows to `Order_Items` |
| `inventory_levels/update` | Update or insert the current inventory row in `Inventory` |
| Every processed event | Append the event ID to `Webhook_Log` for retry deduplication |

## Required secrets

Secrets must be added using `wrangler secret put`; never commit `.dev.vars` or service-account JSON.

| Secret | Purpose |
|---|---|
| `SHOPIFY_WEBHOOK_SECRET` | Verifies webhook authenticity |
| `SHOPIFY_STORE_DOMAIN` | Your `*.myshopify.com` domain |
| `SHOPIFY_ADMIN_ACCESS_TOKEN` | Reads SKU and product/variant titles for inventory events |
| `GOOGLE_SERVICE_ACCOUNT_EMAIL` | Google service account identity |
| `GOOGLE_PRIVATE_KEY` | Google service account private key |
| `GOOGLE_SHEET_ID` | Target spreadsheet ID |

The Shopify custom app requires `read_inventory` and `read_products`. Share the target spreadsheet with the service-account email as Editor.

## Deploy

```bash
pnpm install
pnpm check
pnpm test
pnpm wrangler secret put SHOPIFY_WEBHOOK_SECRET
pnpm wrangler secret put SHOPIFY_STORE_DOMAIN
pnpm wrangler secret put SHOPIFY_ADMIN_ACCESS_TOKEN
pnpm wrangler secret put GOOGLE_SERVICE_ACCOUNT_EMAIL
pnpm wrangler secret put GOOGLE_PRIVATE_KEY
pnpm wrangler secret put GOOGLE_SHEET_ID
pnpm deploy
```

Create these Shopify webhook subscriptions and point them to `https://YOUR-WORKER.workers.dev/webhooks/shopify`:

1. Order payment (`orders/paid`)
2. Inventory level update (`inventory_levels/update`)

Use JSON format and the API version in `wrangler.toml`. Test each webhook from Shopify Admin before opening the store.

## Google Sheet template

Import the CSV files in `google-sheet-template/` as tabs named exactly `Orders`, `Order_Items`, `Inventory`, and `Webhook_Log`. The worker can use different names through the public variables in `wrangler.toml`.

## Operational notes

The webhook log prevents duplicate writes when Shopify retries a delivery. For a high-volume store, replace the sheet-based event log with a dedicated idempotency store and queue, but the current approach keeps the first release simple and transparent.
