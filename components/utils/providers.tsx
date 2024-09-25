import { ThemeProvider } from '@/components/theme-provider'
import { TooltipProvider } from '@/components/ui/tooltip'
import { EdgeStoreProvider } from '@/lib/edgestore'
import NextTopLoader from 'nextjs-toploader'
import { ClientOnly } from './client-only'

export default function Providers({ children }: { children: React.ReactNode }) {
	return (
		<EdgeStoreProvider>
			<TooltipProvider>
				<ThemeProvider
					attribute='class'
					defaultTheme='system'
					enableSystem
					disableTransitionOnChange
				>
					{children}
					<ClientOnly>
						<NextTopLoader showSpinner={false} />
					</ClientOnly>
				</ThemeProvider>
			</TooltipProvider>
		</EdgeStoreProvider>
	)
}
