import fs from 'node:fs/promises';
import { createHash } from 'node:crypto';
import mongoose from 'mongoose';
import { connectDb, ProductModel } from '../src/lib/db';
import { importSchema } from '../src/lib/validation';

// The owner approved these two additions and their selling prices on 28 October.
// Before deployment, use the actual supplier photo so public cards never point
// to an unpublished asset. Rerunning after deployment adopts the styled gallery.
const origin = 'https://homeable.vercel.app';
try {
  const { products } = importSchema.parse(JSON.parse(await fs.readFile(new URL('../data/product-additions-2026-10-28.json', import.meta.url), 'utf8')));
  const provenance = JSON.parse(await fs.readFile(new URL('../data/supplier-provenance.json', import.meta.url), 'utf8')) as Array<{slug:string;originalImageUrl?:string}>;
  const rows = products.map(product => {
    const original = provenance.find(p => p.slug === product.slug)?.originalImageUrl;
    if (!original?.startsWith('https://images.meesho.com/images/products/')) throw new Error('Missing reviewed supplier image');
    return {product, fallback:[original]};
  });
  const checks = await Promise.allSettled(products.flatMap(p => p.images).map(async image => {
    const response = await fetch(new URL(image, origin), {cache:'no-store', signal:AbortSignal.timeout(10000)});
    if (!response.ok || !response.headers.get('content-type')?.startsWith('image/')) return false;
    const local = await fs.readFile(new URL('../public'+image, import.meta.url));
    const remote = Buffer.from(await response.arrayBuffer());
    return createHash('sha256').update(local).digest('hex') === createHash('sha256').update(remote).digest('hex');
  }));
  const styledAssetsDeployed = checks.every(r => r.status === 'fulfilled' && r.value === true);
  await connectDb();
  const result = await ProductModel.bulkWrite(rows.map(({product,fallback}) => ({updateOne:{filter:{slug:product.slug},update:{$setOnInsert:{...product,images:styledAssetsDeployed?product.images:fallback}},upsert:true}})));
  let upgradedGalleries = 0;
  if (styledAssetsDeployed) {
    for (const {product,fallback} of rows) {
      // Exact match preserves any gallery subsequently edited by the owner.
      const update = await ProductModel.updateOne({slug:product.slug,images:fallback},{$set:{images:product.images}});
      upgradedGalleries += update.modifiedCount;
    }
  }
  const added = await ProductModel.find({slug:{$in:products.map(p=>p.slug)}}).select('slug price active images -_id').lean();
  console.log(JSON.stringify({inserted:result.upsertedCount,preservedExisting:result.matchedCount,styledAssetsDeployed,upgradedGalleries,totalPublished:await ProductModel.countDocuments({active:true}),products:added}));
} catch(error) {
  console.error(JSON.stringify({error:'Product addition import failed',type:error instanceof Error?error.name:'UnknownError'}));
  process.exitCode=1;
} finally { await mongoose.disconnect(); }
