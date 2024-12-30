'use client'

import { cn } from '@/lib/utils'
import Link, { LinkProps } from 'next/link'
import { usePathname } from 'next/navigation'
import { ComponentProps } from 'react'

type NavLinksProps = LinkProps &
	ComponentProps<'a'> & {
		activeStyles?: string
	}

export default function NavLink({
	href,
	className,
	activeStyles = '',
	...props
}: NavLinksProps) {
	const pathname = usePathname()

	return (
		<Link
			href={href}
			className={cn(className, {
				[activeStyles]: pathname === href
			})}
			{...props}
		/>
	)
}
