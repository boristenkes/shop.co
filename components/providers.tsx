import { ThemeProvider } from './theme-provider'
import { TooltipProvider } from './ui/tooltip'

export default function Providers({ children }: { children: React.ReactNode }) {
	return (
		<TooltipProvider>
			<ThemeProvider
				attribute='class'
				defaultTheme='system'
				enableSystem
				disableTransitionOnChange
			>
				{children}
			</ThemeProvider>
		</TooltipProvider>
	)
}
