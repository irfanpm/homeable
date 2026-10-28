import { connectDb,ProductModel } from '../src/lib/db';
import { sampleProducts } from '../src/lib/sample-products';
import mongoose from 'mongoose';
await connectDb();for(const p of sampleProducts){const {id,...data}=p;void id;await ProductModel.updateOne({slug:p.slug},{$setOnInsert:{...data,active:false}},{upsert:true});}console.log('Sample products added as DRAFTS only. Verify and replace sample data and photos before publishing.');await mongoose.disconnect();
