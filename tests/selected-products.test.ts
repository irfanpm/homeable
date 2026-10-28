import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import catalog from '../data/selected-products.json';
import { productSchema } from '../src/lib/validation';

test('all 13 unique owner-selected products have complete valid translations', () => {
  assert.equal(catalog.products.length, 13);
  assert.equal(new Set(catalog.products.map(p => p.slug)).size, 13);
  assert.equal(new Set(catalog.products.map(p => p.meeshoUrl)).size, 13);
  for (const p of catalog.products) assert.equal(productSchema.safeParse(p).success, true, p.slug);
});

test('every selected product has a styled image and original supplier gallery image', () => {
  for (const p of catalog.products) {
    assert.equal(p.images.length, 2);
    assert.ok(p.images[0].endsWith('-styled.webp'));
    assert.ok(p.images[1].endsWith('-original.webp'));
    for (const image of p.images) assert.ok(fs.statSync(new URL('../public'+image, import.meta.url)).size > 1000, image);
  }
});

test('selected catalog prices match the reviewed supplier snapshot without invented discounts', () => {
  const expected = [239,156,460,390,140,130,296,188,95,147,392,195,122];
  assert.deepEqual(catalog.products.map(p=>p.price), expected);
  assert.ok(catalog.products.every(p=>p.compareAt===0 && p.badge===''));
  assert.equal(new Set(catalog.products.map(p=>p.category)).size, 6);
});
