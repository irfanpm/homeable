import { guard,jsonBody,apiError } from '@/lib/api';
import { connectDb,ProductModel } from '@/lib/db';
import { serialize } from '@/lib/catalog';
import { productSchema } from '@/lib/validation';
export async function GET(request:Request){const denied=await guard(request);if(denied)return denied;try{await connectDb();return Response.json({products:(await ProductModel.find().sort({createdAt:-1}).lean()).map(d=>serialize(d as unknown as Record<string,unknown>))});}catch(e){return apiError(e);}}
export async function POST(request:Request){const denied=await guard(request,true);if(denied)return denied;try{let body;try{body=await jsonBody(request);}catch{return Response.json({error:'Invalid JSON or request too large'},{status:400});}const parsed=productSchema.safeParse(body);if(!parsed.success)return Response.json({error:parsed.error.issues.map(i=>`${i.path.join('.')}: ${i.message}`).join('; ')},{status:400});await connectDb();const doc=await ProductModel.create(parsed.data);return Response.json({product:serialize(doc.toObject())},{status:201});}catch(e){return apiError(e);}}
