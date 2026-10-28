import { NextResponse } from 'next/server';
import { sameOrigin,cookieName } from '@/lib/auth';
export async function POST(request:Request){if(!sameOrigin(request))return NextResponse.json({error:'Request origin is not allowed'},{status:403});const response=NextResponse.json({ok:true});response.cookies.set(cookieName,'',{httpOnly:true,secure:process.env.NODE_ENV==='production',sameSite:'strict',path:'/',maxAge:0});return response;}
