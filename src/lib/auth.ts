import { randomBytes, scrypt as scryptCallback, timingSafeEqual, createHash } from 'node:crypto';
import { promisify } from 'node:util';
import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { connectDb, LoginLimit } from './db';
const scrypt=promisify(scryptCallback);
export const cookieName='homebele_session';
export function configured() { return !!(process.env.MONGODB_URI && process.env.ADMIN_EMAIL && process.env.ADMIN_PASSWORD_HASH && (process.env.SESSION_SECRET?.length??0)>=32); }
export async function hashPassword(password:string) {const salt=randomBytes(16).toString('hex');const key=await scrypt(password,salt,64) as Buffer;return `scrypt:${salt}:${key.toString('hex')}`;}
export async function verifyPassword(password:string,hash:string) { const [scheme,salt,hex]=hash.split(':');if(scheme!=='scrypt'||!salt||!hex||hex.length!==128)return false;const key=await scrypt(password,salt,64) as Buffer;const stored=Buffer.from(hex,'hex');return stored.length===key.length && timingSafeEqual(key,stored); }
function secret() { if(!configured())throw new Error('Admin is not configured');return new TextEncoder().encode(process.env.SESSION_SECRET!+process.env.ADMIN_PASSWORD_HASH!); }
export async function makeToken() { return new SignJWT({role:'admin'}).setProtectedHeader({alg:'HS256'}).setSubject(process.env.ADMIN_EMAIL!).setIssuedAt().setExpirationTime('8h').setJti(randomBytes(16).toString('hex')).sign(secret()); }
export async function isAdmin() {if(!configured())return false;const token=(await cookies()).get(cookieName)?.value;if(!token)return false;try {const {payload}=await jwtVerify(token,secret(),{algorithms:['HS256']});return payload.role==='admin'&&payload.sub===process.env.ADMIN_EMAIL;}catch{return false;} }
export function sameOrigin(request:Request) {const origin=request.headers.get('origin');if(!origin)return false;try{const expected=new URL(process.env.SITE_ORIGIN||process.env.NEXT_PUBLIC_SITE_URL||request.url);if(!process.env.SITE_ORIGIN&&!process.env.NEXT_PUBLIC_SITE_URL){const host=request.headers.get('host');if(host)expected.host=host;}return origin===expected.origin;}catch{return false;}}
export async function checkLoginRate() { await connectDb();const bucket=Math.floor(Date.now()/(15*60*1000));const key=createHash('sha256').update(`admin:${bucket}`).digest('hex');const row=await LoginLimit.findOneAndUpdate({key},{$inc:{attempts:1},$setOnInsert:{expiresAt:new Date((bucket+2)*15*60*1000)}},{upsert:true,new:true});return row.attempts<=10; }
