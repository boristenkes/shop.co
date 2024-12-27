import { Toaster } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import NextTopLoader from 'nextjs-toploader'
import { ClientOnly } from './client-only'

export default function Providers({ children }: { children: React.ReactNode }) {
	return (
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
	)
}
