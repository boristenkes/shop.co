import { Column } from '@tanstack/react-table'
import { ChevronDown, ChevronsUpDown, ChevronUp } from 'lucide-react'

import { cn } from '@/lib/utils'

interface DataTableColumnHeaderProps<TData, TValue>
	extends React.HTMLAttributes<HTMLDivElement> {
	column: Column<TData, TValue>
	title: string
}

export function DataTableColumnHeader<TData, TValue>({
	column,
	title,
	className
}: DataTableColumnHeaderProps<TData, TValue>) {
	if (!column.getCanSort()) {
		return <div className={cn(className)}>{title}</div>
	}

	return (
		<div className={cn('flex items-center space-x-2', className)}>
			<button
				onClick={() => column.toggleSorting()}
				className='-ml-3 h-8 data-[state=open]:bg-accent flex items-center gap-1'
			>
				<span>{title}</span>
				{column.getIsSorted() === 'desc' ? (
					<ChevronDown className='size-4' />
				) : column.getIsSorted() === 'asc' ? (
					<ChevronUp className='size-4' />
				) : (
					<ChevronsUpDown className='size-4' />
				)}
			</button>
		</div>
	)
}
