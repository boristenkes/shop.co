import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'
import { forwardRef } from 'react'

const alertVariants = cva(
	'relative w-full rounded-lg border border-zinc-200 p-4 [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-zinc-950 dark:border-zinc-800 dark:[&>svg]:text-zinc-50',
	{
		variants: {
			variant: {
				default: 'bg-white text-zinc-950 dark:bg-zinc-950 dark:text-zinc-50',
				destructive:
					'border-red-500/50 bg-red-500/10 text-red-500 dark:border-red-500 [&>svg]:text-red-500 dark:border-red-900/50 dark:text-red-900 dark:dark:border-red-900 dark:[&>svg]:text-red-900',
				warning:
					'border-yellow-500/50 bg-yellow-500/10 text-yellow-600 dark:border-yellow-500 [&>svg]:text-yellow-600 dark:border-yellow-900/50 dark:text-yellow-900 dark:dark:border-yellow-900 dark:[&>svg]:text-yellow-900'
			}
		},
		defaultVariants: {
			variant: 'default'
		}
	}
)

const Alert = forwardRef<
	HTMLDivElement,
	React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof alertVariants>
>(({ className, variant, ...props }, ref) => (
	<div
		ref={ref}
		role='alert'
		className={cn(alertVariants({ variant }), className)}
		{...props}
	/>
))
Alert.displayName = 'Alert'

const AlertTitle = forwardRef<
	HTMLParagraphElement,
	React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
	<h5
		ref={ref}
		className={cn('mb-1 font-medium leading-none tracking-tight', className)}
		{...props}
	/>
))
AlertTitle.displayName = 'AlertTitle'

const AlertDescription = forwardRef<
	HTMLParagraphElement,
	React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
	<div
		ref={ref}
		className={cn('text-sm [&_p]:leading-relaxed', className)}
		{...props}
	/>
))
AlertDescription.displayName = 'AlertDescription'

export { Alert, AlertDescription, AlertTitle }
