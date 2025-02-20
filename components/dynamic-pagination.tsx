'use client'

import {
	Pagination,
	PaginationContent,
	PaginationEllipsis,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious
} from '@/components/ui/pagination'
import { useSearchParams } from 'next/navigation'

type DynamicPaginationProps = {
	totalPages: number
	paramName?: string
}

export default function DynamicPagination({
	totalPages,
	paramName = 'page'
}: DynamicPaginationProps) {
	const searchParams = useSearchParams()
	const currentPage = parseInt(searchParams.get(paramName) ?? '1')

	const createPageURL = (pageNumber: number | string) => {
		const params = new URLSearchParams(searchParams)
		params.set(paramName, pageNumber.toString())
		return `?${params.toString()}`
	}

	const renderPageNumbers = () => {
		const items: React.ReactNode[] = []

		if (currentPage > 1) {
			items.push(
				<PaginationItem key='prev'>
					<PaginationPrevious href={createPageURL(currentPage - 1)} />
				</PaginationItem>
			)
		}

		if (currentPage > 2) {
			items.push(
				<PaginationItem key='first'>
					<PaginationLink href={createPageURL(1)}>1</PaginationLink>
				</PaginationItem>
			)
		}

		if (currentPage > 3) {
			items.push(
				<PaginationItem key='ellipsis-start'>
					<PaginationEllipsis />
				</PaginationItem>
			)
		}

		if (currentPage > 1) {
			items.push(
				<PaginationItem key='prev-page'>
					<PaginationLink href={createPageURL(currentPage - 1)}>
						{currentPage - 1}
					</PaginationLink>
				</PaginationItem>
			)
		}

		items.push(
			<PaginationItem key='current'>
				<PaginationLink
					href={createPageURL(currentPage)}
					isActive
				>
					{currentPage}
				</PaginationLink>
			</PaginationItem>
		)

		if (currentPage < totalPages) {
			items.push(
				<PaginationItem key='next-page'>
					<PaginationLink href={createPageURL(currentPage + 1)}>
						{currentPage + 1}
					</PaginationLink>
				</PaginationItem>
			)
		}

		if (currentPage < totalPages - 2) {
			items.push(
				<PaginationItem key='ellipsis-end'>
					<PaginationEllipsis />
				</PaginationItem>
			)
		}

		if (currentPage < totalPages - 1) {
			items.push(
				<PaginationItem key='last'>
					<PaginationLink href={createPageURL(totalPages)}>
						{totalPages}
					</PaginationLink>
				</PaginationItem>
			)
		}

		if (currentPage < totalPages) {
			items.push(
				<PaginationItem key='next'>
					<PaginationNext href={createPageURL(currentPage + 1)} />
				</PaginationItem>
			)
		}

		return items
	}

	return (
		<Pagination>
			<PaginationContent>{renderPageNumbers()}</PaginationContent>
		</Pagination>
	)
}
