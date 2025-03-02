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
	paramKey?: string
}

export default function DynamicPagination({
	totalPages,
	paramKey = 'page'
}: DynamicPaginationProps) {
	const searchParams = useSearchParams()
	const currentPage = parseInt(searchParams.get(paramKey) ?? '1')

	const createPageURL = (pageNumber: number | string) => {
		const params = new URLSearchParams(searchParams)
		params.set(paramKey, pageNumber.toString())
		return `?${params.toString()}`
	}

	return (
		<Pagination>
			<PaginationContent>
				{currentPage > 1 && (
					<PaginationItem key='prev'>
						<PaginationPrevious href={createPageURL(currentPage - 1)} />
					</PaginationItem>
				)}

				{currentPage > 2 && (
					<PaginationItem key='first'>
						<PaginationLink href={createPageURL(1)}>1</PaginationLink>
					</PaginationItem>
				)}

				{currentPage > 3 && (
					<PaginationItem key='ellipsis-start'>
						<PaginationEllipsis />
					</PaginationItem>
				)}

				{currentPage > 1 && (
					<PaginationItem key='prev-page'>
						<PaginationLink href={createPageURL(currentPage - 1)}>
							{currentPage - 1}
						</PaginationLink>
					</PaginationItem>
				)}

				<PaginationItem key='current'>
					<PaginationLink
						href={createPageURL(currentPage)}
						isActive
					>
						{currentPage}
					</PaginationLink>
				</PaginationItem>

				{currentPage < totalPages && (
					<PaginationItem key='next-page'>
						<PaginationLink href={createPageURL(currentPage + 1)}>
							{currentPage + 1}
						</PaginationLink>
					</PaginationItem>
				)}

				{currentPage < totalPages - 2 && (
					<PaginationItem key='ellipsis-end'>
						<PaginationEllipsis />
					</PaginationItem>
				)}

				{currentPage < totalPages - 1 && (
					<PaginationItem key='last'>
						<PaginationLink href={createPageURL(totalPages)}>
							{totalPages}
						</PaginationLink>
					</PaginationItem>
				)}

				{currentPage < totalPages && (
					<PaginationItem key='next'>
						<PaginationNext href={createPageURL(currentPage + 1)} />
					</PaginationItem>
				)}
			</PaginationContent>
		</Pagination>
	)
}
