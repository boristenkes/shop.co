import { cn } from '@/lib/utils'
import { forwardRef } from 'react'

const Table = forwardRef<
	HTMLTableElement,
	React.HTMLAttributes<HTMLTableElement>
>(({ className, ...props }, ref) => (
	<div className='relative w-full overflow-x-auto'>
		<table
			ref={ref}
			className={cn('w-full caption-bottom text-sm', className)}
			{...props}
		/>
	</div>
))
Table.displayName = 'Table'

const TableHeader = forwardRef<
	HTMLTableSectionElement,
	React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
	<thead
		ref={ref}
		className={cn('[&_tr]:border-b', className)}
		{...props}
	/>
))
TableHeader.displayName = 'TableHeader'

const TableBody = forwardRef<
	HTMLTableSectionElement,
	React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
	<tbody
		ref={ref}
		className={cn('[&_tr:last-child]:border-0', className)}
		{...props}
	/>
))
TableBody.displayName = 'TableBody'

const TableFooter = forwardRef<
	HTMLTableSectionElement,
	React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
	<tfoot
		ref={ref}
		className={cn(
			'border-t bg-zinc-100/50 font-medium [&>tr]:last:border-b-0 dark:bg-zinc-800/50',
			className
		)}
		{...props}
	/>
))
TableFooter.displayName = 'TableFooter'

const TableRow = forwardRef<
	HTMLTableRowElement,
	React.HTMLAttributes<HTMLTableRowElement>
>(({ className, ...props }, ref) => (
	<tr
		ref={ref}
		className={cn(
			'border-b transition-colors hover:bg-zinc-100/50 data-[state=selected]:bg-zinc-100 dark:hover:bg-zinc-800/50 dark:data-[state=selected]:bg-zinc-800',
			className
		)}
		{...props}
	/>
))
TableRow.displayName = 'TableRow'

const TableHead = forwardRef<
	HTMLTableCellElement,
	React.ThHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
	<th
		ref={ref}
		className={cn(
			'h-12 px-4 text-left align-middle font-medium text-zinc-500 [&:has([role=checkbox])]:pr-0 dark:text-zinc-400',
			className
		)}
		{...props}
	/>
))
TableHead.displayName = 'TableHead'

const TableCell = forwardRef<
	HTMLTableCellElement,
	React.TdHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
	<td
		ref={ref}
		className={cn('p-4 align-middle [&:has([role=checkbox])]:pr-0', className)}
		{...props}
	/>
))
TableCell.displayName = 'TableCell'

const TableCaption = forwardRef<
	HTMLTableCaptionElement,
	React.HTMLAttributes<HTMLTableCaptionElement>
>(({ className, ...props }, ref) => (
	<caption
		ref={ref}
		className={cn('mt-4 text-sm text-zinc-500 dark:text-zinc-400', className)}
		{...props}
	/>
))
TableCaption.displayName = 'TableCaption'

export {
	Table,
	TableBody,
	TableCaption,
	TableCell,
	TableFooter,
	TableHead,
	TableHeader,
	TableRow
}
