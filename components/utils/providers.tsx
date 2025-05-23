'use client'

import { Toaster } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import { CartProvider } from '@/context/cart'
import { loadStripe } from '@stripe/stripe-js'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { SessionProvider } from 'next-auth/react'
import NextTopLoader from 'nextjs-toploader'
import { ClientOnly } from './client-only'

export const queryClient = new QueryClient()

export const stripePromise = loadStripe(
	process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
)

export default function Providers({ children }: { children: React.ReactNode }) {
	return (
		<QueryClientProvider client={queryClient}>
			<TooltipProvider>
				<SessionProvider
					refetchOnWindowFocus={false}
					refetchWhenOffline={false}
				>
					<CartProvider>
						{/* <ScrollToTop> */}
						{/* <NextSSRPlugin routerConfig={extractRouterConfig(ourFileRouter)} /> */}
						{children}
						<Toaster
							richColors={true}
							theme='light'
						/>
						<ClientOnly>
							<NextTopLoader showSpinner={false} />
						</ClientOnly>
						{/* </ScrollToTop> */}
					</CartProvider>
				</SessionProvider>
			</TooltipProvider>
		</QueryClientProvider>
	)
}
