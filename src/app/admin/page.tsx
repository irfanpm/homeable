import { isAdmin,configured } from '@/lib/auth';
import { AdminPanel } from '@/components/admin-panel';
export const dynamic='force-dynamic';
export const metadata={title:'Store administration',robots:{index:false,follow:false}};
export default async function AdminPage(){return <AdminPanel signedIn={await isAdmin()} ready={configured()}/>;}
