import { connectDb, ProductModel } from './db';
import { selectedProducts } from './selected-products';
import type { Product } from './types';
export function serialize(doc: Record<string, unknown>): Product { const { _id, __v, createdAt, updatedAt, ...rest }=doc; void __v; void createdAt; void updatedAt; return {...rest,id:String(_id)} as Product; }
export function publicProduct(p:Product) { const {meeshoUrl,sourceNote,...visible}=p; void meeshoUrl; void sourceNote; return visible; }
export async function getCatalog(): Promise<{products:Product[];demo:boolean;error:boolean;source:'snapshot'|'database'}> { if(process.env.HOMEBELE_CATALOG_MODE==='snapshot'||!process.env.MONGODB_URI) return {products:selectedProducts,demo:false,error:false,source:'snapshot'}; try {await connectDb(); const docs=await ProductModel.find({active:true}).sort({createdAt:-1}).lean(); return {products:docs.map(d=>serialize(d as unknown as Record<string,unknown>)),demo:false,error:false,source:'database'};} catch(e) {console.error('Catalog database unavailable',e instanceof Error?e.message:'Unknown error');return {products:[],demo:false,error:true,source:'database'};} }
