'use client';
import React, { useState } from 'react';
import {
	Modal,
	ModalBody,
	ModalContent,
	ModalHeader,
	ModalTitle,
} from '@/components/ui/modal';
import Link from 'next/link';
import { Button } from './button';
import { Input } from './input';
import { AtSignIcon, Lock, Eye, EyeOff } from 'lucide-react';

type AuthModalProps = Omit<React.ComponentProps<typeof Modal>, 'children'> & {
	onSuccess?: (email?: string, password?: string) => void;
	onGoogleLogin?: () => void;
};

export function AuthModal({ onSuccess, onGoogleLogin, ...props }: AuthModalProps) {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [showPassword, setShowPassword] = useState(false);

	const handleGoogle = () => {
		if (onGoogleLogin) {
			onGoogleLogin();
		} else if (onSuccess) {
			onSuccess('google.user@gmail.com', 'demo123');
		}
	};

	const handleEmail = (e: React.FormEvent) => {
		e.preventDefault();
		if (onSuccess) {
			onSuccess(email || 'demo.user@gmail.com', password);
		}
	};

	return (
		<Modal {...props}>
			<ModalContent className="bg-white border border-slate-200 shadow-2xl">
				<ModalHeader>
					<ModalTitle>Sign In</ModalTitle>
				</ModalHeader>
				<ModalBody>
					<Button
						type="button"
						variant="outline"
						className="animate-in fade-in w-full duration-300 flex items-center justify-center gap-2 font-medium border-slate-300 bg-white hover:bg-slate-50 text-slate-800"
						onClick={handleGoogle}
					>
						<GoogleIcon className="w-4 h-4 me-2 shrink-0" />
						<span>Continue With Google</span>
					</Button>

					<div className="relative my-5">
						<div className="absolute inset-0 flex items-center">
							<span className="w-full border-t border-slate-200" />
						</div>
						<div className="relative flex justify-center text-xs uppercase">
							<span className="bg-white text-slate-500 px-4 text-xs font-semibold tracking-wider">
								OR
							</span>
						</div>
					</div>
					<p className="text-slate-500 mb-2 text-start text-xs">
						Enter your email address and password to sign in or create an account
					</p>
					<form onSubmit={handleEmail} className="space-y-3">
						{/* Email Field */}
						<div className="space-y-1 text-left">
							<label className="text-[11px] font-semibold text-slate-600 block">
								Email Address
							</label>
							<div className="relative h-max">
								<Input
									placeholder="your.email@example.com"
									className="peer ps-9 bg-white border-slate-300 text-slate-900"
									type="email"
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									required
								/>
								<div className="text-slate-400 pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 peer-disabled:opacity-50">
									<AtSignIcon className="size-4" aria-hidden="true" />
								</div>
							</div>
						</div>

						{/* Password Field (Below Email Login) */}
						<div className="space-y-1 text-left">
							<div className="flex items-center justify-between">
								<label className="text-[11px] font-semibold text-slate-600 block">
									Password
								</label>
								<button
									type="button"
									className="text-[11px] text-blue-600 hover:underline font-medium"
								>
									Forgot?
								</button>
							</div>
							<div className="relative h-max">
								<Input
									placeholder="Enter your password"
									className="peer ps-9 pe-9 bg-white border-slate-300 text-slate-900"
									type={showPassword ? 'text' : 'password'}
									value={password}
									onChange={(e) => setPassword(e.target.value)}
									required
								/>
								<div className="text-slate-400 pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 peer-disabled:opacity-50">
									<Lock className="size-4" aria-hidden="true" />
								</div>
								<button
									type="button"
									onClick={() => setShowPassword(!showPassword)}
									className="text-slate-400 hover:text-slate-600 absolute inset-y-0 end-0 flex items-center justify-center pe-3 cursor-pointer"
								>
									{showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
								</button>
							</div>
						</div>

						<Button
							type="submit"
							variant="outline"
							className="animate-in fade-in mt-4 w-full duration-300 font-medium border-slate-300 bg-white hover:bg-slate-50 text-slate-800"
						>
							<span>Sign In</span>
						</Button>
					</form>
				</ModalBody>
				<div className="p-4 border-t border-slate-100 mt-2">
					<p className="text-slate-500 text-center text-xs">
						By clicking Continue, you agree to our{' '}
						<Link className="text-blue-600 hover:underline font-medium" href="/policy">
							Privacy Policy
						</Link>
						.
					</p>
				</div>
			</ModalContent>
		</Modal>
	);
}

const GoogleIcon = (props: React.ComponentProps<'svg'>) => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		viewBox="0 0 24 24"
		fill="currentColor"
		{...props}
	>
		<g>
			<path d="M12.479,14.265v-3.279h11.049c0.108,0.571,0.164,1.247,0.164,1.979c0,2.46-0.672,5.502-2.84,7.669   C18.744,22.829,16.051,24,12.483,24C5.869,24,0.308,18.613,0.308,12S5.869,0,12.483,0c3.659,0,6.265,1.436,8.223,3.307L18.392,5.62   c-1.404-1.317-3.307-2.341-5.913-2.341C7.65,3.279,3.873,7.171,3.873,12s3.777,8.721,8.606,8.721c3.132,0,4.916-1.258,6.059-2.401   c0.927-0.927,1.537-2.251,1.777-4.059L12.479,14.265z" />
		</g>
	</svg>
);
