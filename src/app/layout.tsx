import type { Metadata } from 'next';
import './globals.css';
export const metadata:Metadata={title:{default:'Homebele — A little more home.',template:'%s | Homebele'},description:'Thoughtfully chosen home essentials for everyday living. Discover kitchen, living, bedroom, bath, storage and décor in English, Malayalam, Hindi and Tamil.'};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en"><body>{children}</body></html>;}
