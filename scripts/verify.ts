// Runs a disposable real MongoDB and a production Next.js server; never touches configured store data.
import { MongoMemoryServer } from 'mongodb-memory-server';
import { spawn } from 'node:child_process';
import { randomBytes } from 'node:crypto';
import assert from 'node:assert/strict';
import { hashPassword } from '../src/lib/auth';
import { sampleProducts } from '../src/lib/sample-products';
const mongo=await MongoMemoryServer.create();const port=Number(process.env.TEST_PORT||3100);const origin=`http://127.0.0.1:${port}`;const password=randomBytes(24).toString('hex');const email='test-admin@example.invalid';const hash=await hashPassword(password);
const server=spawn(process.execPath,['node_modules/next/dist/bin/next','start','--hostname','127.0.0.1','--port',String(port)],{env:{...process.env,MONGODB_URI:mongo.getUri('homebele-test'),ADMIN_EMAIL:email,ADMIN_PASSWORD_HASH:hash,SESSION_SECRET:randomBytes(48).toString('hex'),SITE_ORIGIN:origin,NEXT_PUBLIC_SITE_URL:origin,NEXT_TELEMETRY_DISABLED:'1'},stdio:['ignore','pipe','pipe'],windowsHide:true});
let output='';server.stdout.on('data',d=>output+=d);server.stderr.on('data',d=>output+=d);let checks=0;
function check(value:unknown,message:string){assert.ok(value,message);checks++;console.log(`PASS ${message}`);}
async function request(path:string,method='GET',body?:unknown,cookie='',requestOrigin=origin){return fetch(origin+path,{method,headers:{...(body?{'Content-Type':'application/json'}:{}),...(method!=='GET'?{Origin:requestOrigin}:{}),...(cookie?{Cookie:cookie}:{})},body:body?JSON.stringify(body):undefined,redirect:'manual'});}
try{
 let ready=false;for(let i=0;i<80;i++){try{if((await request('/en')).ok){ready=true;break;}}catch{}await new Promise(r=>setTimeout(r,500));}check(ready,'production server starts');
 for(const locale of ['en','ml','hi','ta']){const res=await request('/'+locale);check(res.status===200,`${locale} storefront renders`);}
 check((await request('/fr')).status===404,'unsupported locale returns 404');
 check((await request('/api/admin/products')).status===401,'anonymous admin reads blocked');
 check((await request('/api/admin/products','POST',{})).status===401,'anonymous writes blocked');
 check((await request('/api/auth/login','POST',{email,password},'','https://evil.example')).status===403,'cross-origin login blocked');
 check((await request('/api/auth/login','POST',{email,password:'incorrect'})).status===401,'incorrect password rejected');
 const login=await request('/api/auth/login','POST',{email,password});check(login.status===200,'admin login succeeds');const setCookie=login.headers.get('set-cookie')||'';check(setCookie.includes('HttpOnly')&&setCookie.includes('Secure')&&setCookie.includes('SameSite=strict'),'production cookie is HttpOnly, Secure, SameSite=strict');const cookie=setCookie.split(';')[0];
 check((await request('/api/admin/products','GET',undefined,cookie)).status===200,'signed-in admin can read catalog');
 check((await request('/api/admin/products','POST',{},cookie,'https://evil.example')).status===403,'cross-origin product writes blocked');
 const {id,...sample}=sampleProducts[0];void id;const draft={...sample,slug:'verification-vase',active:false,meeshoUrl:'https://www.meesho.com/example/p/test',sourceNote:'Private supplier cost and notes'};
 check((await request('/api/admin/products','POST',{...draft,price:-5},cookie)).status===400,'invalid price rejected');
 const created=await request('/api/admin/products','POST',draft,cookie);check(created.status===201,'create a draft in MongoDB');const product=(await created.json()).product;
 let catalog=await (await request('/api/products')).json();check(catalog.products.length===0&&!catalog.demo,'draft hidden from public catalog');
 check((await request('/api/admin/products','POST',draft,cookie)).status===409,'duplicate product slug rejected');
 check((await request(`/api/admin/products/${product.id}`,'PUT',{...draft,active:true},cookie)).status===200,'publish edited product');
 catalog=await (await request('/api/products?q=ceramic&category=decor')).json();check(catalog.products.length===1,'public search and category query find published product');check(!('meeshoUrl' in catalog.products[0])&&!('sourceNote' in catalog.products[0]),'supplier links and notes excluded from public API');
 const markup=await (await request('/en')).text();check(!markup.includes('Private supplier cost and notes')&&!markup.includes('https://www.meesho.com/example'),'supplier fields excluded from storefront HTML');
 const batch={products:[{...draft,slug:'verification-import',active:true}]};const preview=await request('/api/admin/imports','POST',batch,cookie);check(preview.status===200&&(await preview.json()).preview[0].active===false,'import preview forces draft state');
 let admin=await (await request('/api/admin/products','GET',undefined,cookie)).json();check(admin.products.length===1,'preview makes no database changes');
 check((await request('/api/admin/imports?commit=true','POST',batch,cookie)).status===201,'reviewed import commits');admin=await (await request('/api/admin/products','GET',undefined,cookie)).json();check(admin.products.length===2&&admin.products.find((p:{slug:string})=>p.slug==='verification-import').active===false,'imported product stored as draft');
 check((await request('/api/admin/imports?commit=true','POST',batch,cookie)).status===409,'duplicate import blocked');
 check((await request(`/api/admin/products/${product.id}`,'DELETE',undefined,cookie)).status===200,'admin delete succeeds');
 check((await request('/api/admin/products/not-an-id','PUT',draft,cookie)).status===400,'invalid MongoDB ID rejected');
 const logout=await request('/api/auth/logout','POST',undefined,cookie);check(logout.status===200&&(logout.headers.get('set-cookie')||'').includes('Max-Age=0'),'logout clears session cookie');
 check((await request('/api/admin/products','GET',undefined,'homebele_session=forged')).status===401,'forged session rejected');
 for(let i=0;i<10;i++)await request('/api/auth/login','POST',{email,password:'wrong'});check((await request('/api/auth/login','POST',{email,password})).status===429,'persistent login rate limit enforced');
 console.log(`\n${checks} integration checks passed using disposable MongoDB.`);
}catch(e){console.error(output);throw e;}finally{server.kill();await new Promise(r=>server.once('exit',r));await mongo.stop();}
