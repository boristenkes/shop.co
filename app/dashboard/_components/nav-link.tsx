'use client'

import { cn } from '@/lib/utils'
import Link, { LinkProps } from 'next/link'
import { usePathname } from 'next/navigation'

type NavLinkProps = LinkProps & {
	className?: string
	children: React.ReactNode
}

export default function NavLink({ className, ...props }: NavLinkProps) {
	const pathname = usePathname()

	return (
		<Link
			className={cn(
				'text-muted-foreground transition-colors hover:text-foreground',
				{
					'text-foreground': pathname === props.href
				},
				className
			)}
			{...props}
		/>
	)
}
