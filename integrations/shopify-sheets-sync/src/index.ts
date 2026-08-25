export interface Env {
  SHOPIFY_WEBHOOK_SECRET: string;
  SHOPIFY_STORE_DOMAIN?: string;
  SHOPIFY_ADMIN_ACCESS_TOKEN?: string;
  SHOPIFY_API_VERSION?: string;
  GOOGLE_SERVICE_ACCOUNT_EMAIL: string;
  GOOGLE_PRIVATE_KEY: string;
  GOOGLE_SHEET_ID: string;
  GOOGLE_SHEET_TAB_ORDERS?: string;
  GOOGLE_SHEET_TAB_ORDER_ITEMS?: string;
  GOOGLE_SHEET_TAB_INVENTORY?: string;
  GOOGLE_SHEET_TAB_WEBHOOK_LOG?: string;
}

type JsonRecord = Record<string, unknown>;
type GoogleToken = { token: string; expiresAt: number };
let googleTokenCache: GoogleToken | undefined;

const textEncoder = new TextEncoder();
const GOOGLE_SCOPE = 'https://www.googleapis.com/auth/spreadsheets';
const GOOGLE_TOKEN_URL = 'https://oauth2.googleapis.com/token';

function jsonResponse(data: JsonRecord, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' },
  });
}

function toBase64(bytes: Uint8Array): string {
  let binary = '';
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary);
}

function base64Url(input: string | Uint8Array): string {
  const encoded = typeof input === 'string' ? btoa(unescape(encodeURIComponent(input))) : toBase64(input);
  return encoded.replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
}

function constantTimeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let mismatch = 0;
  for (let index = 0; index < a.length; index += 1) mismatch |= a.charCodeAt(index) ^ b.charCodeAt(index);
  return mismatch === 0;
}

export async function verifyShopifyHmac(rawBody: string, signature: string, secret: string): Promise<boolean> {
  if (!rawBody || !signature || !secret) return false;
  const key = await crypto.subtle.importKey(
    'raw',
    textEncoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );
  const digest = await crypto.subtle.sign('HMAC', key, textEncoder.encode(rawBody));
  const expected = toBase64(new Uint8Array(digest));
  return constantTimeEqual(expected, signature);
}

function parsePrivateKey(pem: string): ArrayBuffer {
  const normalized = pem.replace(/\\n/g, '\n');
  const base64 = normalized
    .replace('-----BEGIN PRIVATE KEY-----', '')
    .replace('-----END PRIVATE KEY-----', '')
    .replace(/\s/g, '');
  const bytes = Uint8Array.from(atob(base64), (character) => character.charCodeAt(0));
  return bytes.buffer;
}

async function getGoogleAccessToken(env: Env): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  if (googleTokenCache && googleTokenCache.expiresAt > now + 60) return googleTokenCache.token;

  const header = base64Url(JSON.stringify({ alg: 'RS256', typ: 'JWT' }));
  const claim = base64Url(JSON.stringify({
    iss: env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    scope: GOOGLE_SCOPE,
    aud: GOOGLE_TOKEN_URL,
    iat: now,
    exp: now + 3600,
  }));
  const unsignedJwt = `${header}.${claim}`;
  const key = await crypto.subtle.importKey(
    'pkcs8',
    parsePrivateKey(env.GOOGLE_PRIVATE_KEY),
    { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
    false,
    ['sign'],
  );
  const signature = await crypto.subtle.sign('RSASSA-PKCS1-v1_5', key, textEncoder.encode(unsignedJwt));
  const jwt = `${unsignedJwt}.${base64Url(new Uint8Array(signature))}`;

  const response = await fetch(GOOGLE_TOKEN_URL, {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: jwt,
    }),
  });
  if (!response.ok) throw new Error(`Google token request failed (${response.status})`);
  const payload = await response.json<{ access_token?: string; expires_in?: number }>();
  if (!payload.access_token) throw new Error('Google token response did not include access_token');

  googleTokenCache = { token: payload.access_token, expiresAt: now + (payload.expires_in ?? 3600) };
  return payload.access_token;
}

function escapedSheetName(name: string): string {
  return `'${name.replace(/'/g, "''")}'`;
}

function sheetRange(tab: string, range: string): string {
  return `${escapedSheetName(tab)}!${range}`;
}

async function sheetsRequest(env: Env, range: string, init: RequestInit, suffix = ''): Promise<Response> {
  const token = await getGoogleAccessToken(env);
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${encodeURIComponent(env.GOOGLE_SHEET_ID)}/values/${encodeURIComponent(range)}${suffix}`;
  const response = await fetch(url, {
    ...init,
    headers: {
      authorization: `Bearer ${token}`,
      'content-type': 'application/json',
      ...(init.headers ?? {}),
    },
  });
  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`Google Sheets request failed (${response.status}): ${detail.slice(0, 300)}`);
  }
  return response;
}

async function getValues(env: Env, range: string): Promise<unknown[][]> {
  const response = await sheetsRequest(env, range, { method: 'GET' });
  const payload = await response.json<{ values?: unknown[][] }>();
  return payload.values ?? [];
}

async function appendValues(env: Env, range: string, rows: unknown[][]): Promise<void> {
  if (rows.length === 0) return;
  await sheetsRequest(
    env,
    range,
    { method: 'POST', body: JSON.stringify({ majorDimension: 'ROWS', values: rows }) },
    ':append?valueInputOption=RAW&insertDataOption=INSERT_ROWS',
  );
}

async function updateValues(env: Env, range: string, rows: unknown[][]): Promise<void> {
  await sheetsRequest(
    env,
    range,
    { method: 'PUT', body: JSON.stringify({ majorDimension: 'ROWS', values: rows }) },
    '?valueInputOption=RAW',
  );
}

function stringValue(value: unknown): string {
  return value == null ? '' : String(value);
}

function moneyValue(value: unknown): string {
  if (value == null || value === '') return '';
  const number = Number(value);
  return Number.isFinite(number) ? number.toFixed(2) : stringValue(value);
}

function nested(record: JsonRecord, path: string[]): unknown {
  let value: unknown = record;
  for (const key of path) {
    if (!value || typeof value !== 'object') return undefined;
    value = (value as JsonRecord)[key];
  }
  return value;
}

export function mapOrderSummaryRow(order: JsonRecord, eventId: string): unknown[] {
  const customerName = [nested(order, ['customer', 'first_name']), nested(order, ['customer', 'last_name'])]
    .filter(Boolean)
    .join(' ');
  const gateways = Array.isArray(order.payment_gateway_names) ? order.payment_gateway_names.join(', ') : '';
  return [
    eventId,
    stringValue(order.id),
    stringValue(order.name),
    stringValue(order.processed_at ?? order.updated_at),
    stringValue(order.created_at),
    stringValue(order.currency),
    moneyValue(order.subtotal_price),
    moneyValue(order.total_discounts),
    moneyValue(nested(order, ['total_shipping_price_set', 'shop_money', 'amount'])),
    moneyValue(order.total_tax),
    moneyValue(order.total_price),
    stringValue(order.financial_status),
    stringValue(order.fulfillment_status ?? 'unfulfilled'),
    gateways,
    customerName,
    stringValue(order.email ?? nested(order, ['customer', 'email'])),
    stringValue(order.phone ?? nested(order, ['customer', 'phone'])),
    stringValue(nested(order, ['shipping_address', 'province'])),
    stringValue(order.note),
    stringValue(order.source_name ?? 'web'),
  ];
}

export function mapOrderItemRows(order: JsonRecord, eventId: string): unknown[][] {
  const lineItems = Array.isArray(order.line_items) ? order.line_items : [];
  return lineItems.map((rawItem) => {
    const item = (rawItem && typeof rawItem === 'object' ? rawItem : {}) as JsonRecord;
    const quantity = Number(item.quantity ?? 0);
    const unitPrice = Number(item.price ?? 0);
    return [
      eventId,
      stringValue(order.id),
      stringValue(order.name),
      stringValue(item.sku),
      stringValue(item.product_id),
      stringValue(item.variant_id),
      stringValue(item.title),
      stringValue(item.variant_title),
      quantity,
      moneyValue(unitPrice),
      moneyValue(quantity * unitPrice),
    ];
  });
}

type InventoryDetails = {
  sku: string;
  productId: string;
  productTitle: string;
  variantId: string;
  variantTitle: string;
};

async function fetchInventoryDetails(env: Env, inventoryItemId: string): Promise<InventoryDetails> {
  if (!env.SHOPIFY_STORE_DOMAIN || !env.SHOPIFY_ADMIN_ACCESS_TOKEN) {
    return { sku: '', productId: '', productTitle: '', variantId: '', variantTitle: '' };
  }
  const version = env.SHOPIFY_API_VERSION ?? '2026-07';
  const response = await fetch(`https://${env.SHOPIFY_STORE_DOMAIN}/admin/api/${version}/graphql.json`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-shopify-access-token': env.SHOPIFY_ADMIN_ACCESS_TOKEN,
    },
    body: JSON.stringify({
      query: `query InventoryItem($id: ID!) {
        inventoryItem(id: $id) {
          id
          sku
          variant {
            id
            title
            product { id title }
          }
        }
      }`,
      variables: { id: `gid://shopify/InventoryItem/${inventoryItemId}` },
    }),
  });
  if (!response.ok) throw new Error(`Shopify Admin GraphQL request failed (${response.status})`);
  const payload = await response.json<{ data?: { inventoryItem?: { sku?: string; variant?: { id?: string; title?: string; product?: { id?: string; title?: string } } } }; errors?: unknown }>();
  if (payload.errors) throw new Error('Shopify Admin GraphQL returned errors');
  const item = payload.data?.inventoryItem;
  return {
    sku: item?.sku ?? '',
    productId: item?.variant?.product?.id?.split('/').pop() ?? '',
    productTitle: item?.variant?.product?.title ?? '',
    variantId: item?.variant?.id?.split('/').pop() ?? '',
    variantTitle: item?.variant?.title ?? '',
  };
}

export function mapInventoryRow(payload: JsonRecord, details: InventoryDetails): unknown[] {
  return [
    stringValue(payload.inventory_item_id),
    details.sku,
    details.productTitle,
    details.variantTitle,
    stringValue(payload.location_id),
    Number(payload.available ?? 0),
    stringValue(payload.updated_at ?? new Date().toISOString()),
    details.productId,
    details.variantId,
  ];
}

async function eventAlreadyProcessed(env: Env, eventId: string): Promise<boolean> {
  const tab = env.GOOGLE_SHEET_TAB_WEBHOOK_LOG ?? 'Webhook_Log';
  const values = await getValues(env, sheetRange(tab, 'A2:A5000'));
  return values.some((row) => stringValue(row[0]) === eventId);
}

async function logWebhook(env: Env, eventId: string, topic: string): Promise<void> {
  const tab = env.GOOGLE_SHEET_TAB_WEBHOOK_LOG ?? 'Webhook_Log';
  await appendValues(env, sheetRange(tab, 'A:D'), [[eventId, topic, new Date().toISOString(), 'processed']]);
}

async function handleOrderPaid(env: Env, order: JsonRecord, eventId: string): Promise<void> {
  const ordersTab = env.GOOGLE_SHEET_TAB_ORDERS ?? 'Orders';
  const itemsTab = env.GOOGLE_SHEET_TAB_ORDER_ITEMS ?? 'Order_Items';
  await appendValues(env, sheetRange(ordersTab, 'A:T'), [mapOrderSummaryRow(order, eventId)]);
  await appendValues(env, sheetRange(itemsTab, 'A:K'), mapOrderItemRows(order, eventId));
}

async function handleInventoryUpdate(env: Env, payload: JsonRecord): Promise<void> {
  const tab = env.GOOGLE_SHEET_TAB_INVENTORY ?? 'Inventory';
  const inventoryItemId = stringValue(payload.inventory_item_id);
  const details = await fetchInventoryDetails(env, inventoryItemId);
  const row = mapInventoryRow(payload, details);
  const existingIds = await getValues(env, sheetRange(tab, 'A2:A5000'));
  const existingIndex = existingIds.findIndex((candidate) => stringValue(candidate[0]) === inventoryItemId);
  if (existingIndex >= 0) {
    const sheetRow = existingIndex + 2;
    await updateValues(env, sheetRange(tab, `A${sheetRow}:I${sheetRow}`), [row]);
  } else {
    await appendValues(env, sheetRange(tab, 'A:I'), [row]);
  }
}

async function handleWebhook(request: Request, env: Env): Promise<Response> {
  const contentLength = Number(request.headers.get('content-length') ?? 0);
  if (contentLength > 2_000_000) return jsonResponse({ ok: false, error: 'payload_too_large' }, 413);

  const rawBody = await request.text();
  const signature = request.headers.get('x-shopify-hmac-sha256') ?? '';
  const verified = await verifyShopifyHmac(rawBody, signature, env.SHOPIFY_WEBHOOK_SECRET);
  if (!verified) return jsonResponse({ ok: false, error: 'invalid_signature' }, 401);

  const topic = request.headers.get('x-shopify-topic') ?? '';
  const eventId = request.headers.get('x-shopify-event-id') ?? request.headers.get('x-shopify-webhook-id') ?? '';
  if (!eventId) return jsonResponse({ ok: false, error: 'missing_event_id' }, 400);
  if (await eventAlreadyProcessed(env, eventId)) return jsonResponse({ ok: true, duplicate: true });

  const payload = JSON.parse(rawBody) as JsonRecord;
  if (topic === 'orders/paid') await handleOrderPaid(env, payload, eventId);
  else if (topic === 'inventory_levels/update') await handleInventoryUpdate(env, payload);
  else return jsonResponse({ ok: true, ignored: true, topic });

  await logWebhook(env, eventId, topic);
  return jsonResponse({ ok: true, topic });
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    if (request.method === 'GET' && url.pathname === '/health') {
      return jsonResponse({ ok: true, service: 'bounce-back-shopify-sheets-sync' });
    }
    if (request.method === 'POST' && url.pathname === '/webhooks/shopify') {
      try {
        return await handleWebhook(request, env);
      } catch (error) {
        console.error('Webhook processing failed without logging payload data', error);
        return jsonResponse({ ok: false, error: 'processing_failed' }, 500);
      }
    }
    return jsonResponse({ ok: false, error: 'not_found' }, 404);
  },
};
