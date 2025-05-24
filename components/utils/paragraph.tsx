import { cn } from '@/lib/utils'
import { ComponentProps } from 'react'

export default function Paragraph({
	className,
	...props
}: ComponentProps<'p'>) {
	return (
		<p
			className={cn('text-gray-600 max-w-[70ch] text-pretty', className)}
			{...props}
		/>
	)
}
