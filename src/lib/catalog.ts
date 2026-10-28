import { connectDb, ProductModel } from './db';
import { selectedProducts } from './selected-products';
import additions from '../../data/product-additions-2026-10-28.json';
import provenance from '../../data/supplier-provenance.json';
import type { Product } from './types';
export function serialize(doc: Record<string, unknown>): Product { const { _id, __v, createdAt, updatedAt, ...rest }=doc; void __v; void createdAt; void updatedAt; return {...rest,id:String(_id)} as Product; }
export function publicProduct(p:Product) {
  const {meeshoUrl,sourceNote,...visible}=p;
  void meeshoUrl; void sourceNote;
  const addition=additions.products.find(item=>item.slug===p.slug);
  const supplier=provenance.find(item=>item.slug===p.slug);
  // Use the photos bundled with this source version for the two initial
  // supplier-photo records. Preserve later galleries edited by the owner.
  if(addition && supplier && 'originalImageUrl' in supplier && p.images.length===1 && p.images[0]===supplier.originalImageUrl) {
    return {...visible,images:[...addition.images]};
  }
  return visible;
}
export async function getCatalog(): Promise<{products:Product[];demo:boolean;error:boolean;source:'snapshot'|'database'}> { if(process.env.HOMEBELE_CATALOG_MODE==='snapshot'||!process.env.MONGODB_URI) return {products:selectedProducts,demo:false,error:false,source:'snapshot'}; try {await connectDb(); const docs=await ProductModel.find({active:true}).sort({createdAt:-1}).lean(); return {products:docs.map(d=>serialize(d as unknown as Record<string,unknown>)),demo:false,error:false,source:'database'};} catch(e) {console.error('Catalog database unavailable',e instanceof Error?e.message:'Unknown error');return {products:[],demo:false,error:true,source:'database'};} }
