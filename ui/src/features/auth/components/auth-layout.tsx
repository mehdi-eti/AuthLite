/** @format */

import type { ReactNode } from "react";

export function AuthLayout({ children }: { children: ReactNode }) {
	return (
		<div className='flex min-h-svh w-full items-center justify-center p-6 md:p-10'>
			<div className='w-full max-w-sm'>{children}</div>
		</div>
	);
}
