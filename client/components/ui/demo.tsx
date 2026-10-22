'use client';
import React from 'react';
import { cn } from '@/lib/utils';
import { AuthModal } from "@/components/ui/auth-modal";
import { Button } from '@/components/ui/button';

export default function DefaultDemo() {
	const [open, setAuthOpen] = React.useState(false);

	return (
		<div className="relative flex min-h-screen w-full flex-col items-center justify-center">
			<div
				aria-hidden="true"
				className={cn(
					'pointer-events-none absolute -top-10 left-1/2 size-full -translate-x-1/2 rounded-full',
					'bg-[radial-gradient(ellipse_at_center,--theme(--color-foreground/.1),transparent_50%)]',
					'blur-[30px]',
				)}
			/>

			<Button onClick={() => setAuthOpen(true)}>Open Modal</Button>

			<AuthModal open={open} onOpenChange={setAuthOpen} />
		</div>
	);
}
