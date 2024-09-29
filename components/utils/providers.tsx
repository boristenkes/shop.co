import { ThemeProvider } from '@/components/theme-provider'
import { Toaster } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import NextTopLoader from 'nextjs-toploader'
import QueryClientProvider from '../query-client-provider'
import { ClientOnly } from './client-only'

export default function Providers({ children }: { children: React.ReactNode }) {
	return (
		<TooltipProvider>
			<ThemeProvider
				attribute='class'
				defaultTheme='system'
				enableSystem
				disableTransitionOnChange
			>
				<QueryClientProvider>
					{/* <NextSSRPlugin routerConfig={extractRouterConfig(ourFileRouter)} /> */}
					{children}
					<Toaster richColors={true} />
					<ClientOnly>
						<NextTopLoader showSpinner={false} />
					</ClientOnly>
				</QueryClientProvider>
			</ThemeProvider>
		</TooltipProvider>
	)
}
