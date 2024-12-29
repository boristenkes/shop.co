'use client'

import { Toaster } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import NextTopLoader from 'nextjs-toploader'
import { ClientOnly } from './client-only'

export const queryClient = new QueryClient()

export default function Providers({ children }: { children: React.ReactNode }) {
	return (
		<QueryClientProvider client={queryClient}>
			<TooltipProvider>
				{/* <NextSSRPlugin routerConfig={extractRouterConfig(ourFileRouter)} /> */}
				{children}
				<Toaster
					richColors={true}
					theme='light'
				/>
				<ClientOnly>
					<NextTopLoader showSpinner={false} />
				</ClientOnly>
			</TooltipProvider>
		</QueryClientProvider>
	)
}
