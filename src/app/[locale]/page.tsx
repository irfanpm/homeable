import { notFound } from 'next/navigation';
import { getCatalog,publicProduct } from '@/lib/catalog';
import { Storefront } from '@/components/storefront';
import { locales } from '@/lib/types';
import { getLocale } from '@/lib/i18n';
export const dynamic='force-dynamic';
export default async function Page({params}:{params:Promise<{locale:string}>}){const {locale}=await params;if(!locales.includes(locale as typeof locales[number]))notFound();const {products,demo,error,source}=await getCatalog();return <Storefront locale={getLocale(locale)} products={products.map(p=>({...publicProduct(p),meeshoUrl:'',sourceNote:''}))} demo={demo} error={error} snapshot={source==='snapshot'}/>;}
