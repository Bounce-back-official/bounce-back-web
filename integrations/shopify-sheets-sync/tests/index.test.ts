import { describe, expect, it } from 'vitest';
import { mapInventoryRow, mapOrderItemRows, mapOrderSummaryRow, verifyShopifyHmac } from '../src/index';

function toBase64(bytes: Uint8Array): string {
  let binary = '';
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary);
}

describe('verifyShopifyHmac', () => {
  it('accepts a valid Shopify signature and rejects a modified body', async () => {
    const secret = 'unit-test-secret';
    const body = '{"id":123,"name":"#1001"}';
    const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
    const digest = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(body));
    const signature = toBase64(new Uint8Array(digest));
    await expect(verifyShopifyHmac(body, signature, secret)).resolves.toBe(true);
    await expect(verifyShopifyHmac(`${body} `, signature, secret)).resolves.toBe(false);
  });
});

describe('row mapping', () => {
  const order = {
    id: 101,
    name: '#1001',
    processed_at: '2026-08-25T10:00:00Z',
    created_at: '2026-08-25T09:59:00Z',
    currency: 'THB',
    subtotal_price: '890.00',
    total_discounts: '0.00',
    total_tax: '0.00',
    total_price: '940.00',
    financial_status: 'paid',
    fulfillment_status: null,
    payment_gateway_names: ['manual'],
    customer: { first_name: 'Test', last_name: 'Customer', email: 'test@example.com' },
    shipping_address: { province: 'Bangkok' },
    total_shipping_price_set: { shop_money: { amount: '50.00' } },
    line_items: [{ sku: 'BB-TEE-OBS-M', product_id: 1, variant_id: 2, title: 'Training Tee', variant_title: 'M', quantity: 2, price: '445.00' }],
  };

  it('maps one summary row', () => {
    const row = mapOrderSummaryRow(order, 'evt-1');
    expect(row).toHaveLength(20);
    expect(row[0]).toBe('evt-1');
    expect(row[10]).toBe('940.00');
  });

  it('maps line items with calculated totals', () => {
    const rows = mapOrderItemRows(order, 'evt-1');
    expect(rows).toHaveLength(1);
    expect(rows[0][3]).toBe('BB-TEE-OBS-M');
    expect(rows[0][10]).toBe('890.00');
  });

  it('maps current inventory state', () => {
    const row = mapInventoryRow(
      { inventory_item_id: 777, location_id: 888, available: 12, updated_at: '2026-08-25T10:30:00Z' },
      { sku: 'BB-TEE-OBS-M', productId: '1', productTitle: 'Training Tee', variantId: '2', variantTitle: 'M' },
    );
    expect(row).toEqual([777 .toString(), 'BB-TEE-OBS-M', 'Training Tee', 'M', '888', 12, '2026-08-25T10:30:00Z', '1', '2']);
  });
});
