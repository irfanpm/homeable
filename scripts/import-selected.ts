import fs from 'node:fs/promises';
import mongoose from 'mongoose';
import { connectDb, ProductModel } from '../src/lib/db';
import { importSchema } from '../src/lib/validation';

try {
  const path = new URL('../data/selected-products.json', import.meta.url);
  const { products } = importSchema.parse(JSON.parse(await fs.readFile(path, 'utf8')));
  await connectDb();
  // Insert only: rerunning this command preserves subsequent administrator edits.
  const result = await ProductModel.bulkWrite(products.map(product => ({
    updateOne: { filter: { slug: product.slug }, update: { $setOnInsert: product }, upsert: true },
  })));
  const published = await ProductModel.countDocuments({ slug: { $in: products.map(p => p.slug) }, active: true });
  console.log(JSON.stringify({ selectedProducts: products.length, inserted: result.upsertedCount, preservedExisting: result.matchedCount, published }));
} catch (error) {
  // Avoid printing database connection strings, credentials or supplier notes.
  console.error(JSON.stringify({ error: 'Selected product import failed', type: error instanceof Error ? error.name : 'UnknownError' }));
  process.exitCode = 1;
} finally {
  await mongoose.disconnect();
}
