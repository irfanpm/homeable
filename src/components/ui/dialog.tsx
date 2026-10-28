'use client';
import * as React from 'react';
import * as Primitive from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
export const Dialog = Primitive.Root;
export const DialogTitle = Primitive.Title;
export const DialogDescription = Primitive.Description;
export function DialogContent({ children, className }: { children: React.ReactNode; className?: string }) { return <Primitive.Portal><Primitive.Overlay className="fixed inset-0 z-50 bg-black/45 backdrop-blur-sm" /><Primitive.Content className={cn('fixed left-1/2 top-1/2 z-50 max-h-[92dvh] w-[94vw] max-w-3xl -translate-x-1/2 -translate-y-1/2 overflow-auto rounded-2xl bg-background shadow-2xl outline-none', className)}>{children}<Primitive.Close aria-label="Close" className="absolute right-4 top-4 rounded-full bg-white/90 p-2 text-stone-700"><X size={18}/></Primitive.Close></Primitive.Content></Primitive.Portal>; }
