import mongoose from 'mongoose';
import { guard,jsonBody,apiError } from '@/lib/api';
import { connectDb,ProductModel } from '@/lib/db';
import { serialize } from '@/lib/catalog';
import { productSchema } from '@/lib/validation';
type Context={params:Promise<{id:string}>};
export async function PUT(request:Request,{params}:Context){const denied=await guard(request,true);if(denied)return denied;const {id}=await params;if(!mongoose.isValidObjectId(id))return Response.json({error:'Invalid product ID'},{status:400});try{let body;try{body=await jsonBody(request);}catch{return Response.json({error:'Invalid JSON or request too large'},{status:400});}const parsed=productSchema.safeParse(body);if(!parsed.success)return Response.json({error:parsed.error.issues.map(i=>`${i.path.join('.')}: ${i.message}`).join('; ')},{status:400});await connectDb();const doc=await ProductModel.findByIdAndUpdate(id,parsed.data,{new:true});if(!doc)return Response.json({error:'Product not found'},{status:404});return Response.json({product:serialize(doc.toObject())});}catch(e){return apiError(e);}}
export async function DELETE(request:Request,{params}:Context){const denied=await guard(request,true);if(denied)return denied;const {id}=await params;if(!mongoose.isValidObjectId(id))return Response.json({error:'Invalid product ID'},{status:400});try{await connectDb();const doc=await ProductModel.findByIdAndDelete(id);return doc?Response.json({ok:true}):Response.json({error:'Product not found'},{status:404});}catch(e){return apiError(e);}}
