'use client'

import DynamicPagination from '@/components/dynamic-pagination'
import ErrorMessage from '@/components/error-message'
import { Separator } from '@/components/ui/separator'
import { TSize } from '@/db/schema/enums'
import {
	filterProducts,
	FilterProductsReturn
} from '@/features/product/actions'
import useUpdateEffect from '@/hooks/use-update-effect'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { useSearchParams } from 'next/navigation'
import { useState } from 'react'
import ProductCardList, { ProductCardListSkeleton } from './product-list'

type PaginatedProductListProps = {
	initialData: FilterProductsReturn
}

export default function PaginatedProductList({
	initialData
}: PaginatedProductListProps) {
	const searchParams = useSearchParams()
	const [page, setPage] = useState(parseInt(searchParams.get('page') ?? '1'))
	const filters = {
		color: searchParams.getAll('color'),
		size: searchParams.getAll('size') as TSize[],
		category: searchParams.getAll('category'),
		min: parseInt(searchParams.get('min')!),
		max: parseInt(searchParams.get('max')!),
		sortby: searchParams.get('sortby')!
	}
	const query = useQuery({
		queryKey: ['products:get', page],
		queryFn: () => filterProducts(filters, { page }),
		initialData,
		placeholderData: keepPreviousData
	})
	const totalPages = Math.ceil(
		query.data.total / parseInt(searchParams.get('pageSize') ?? '9')
	)

	useUpdateEffect(() => {
		const newPage = parseInt(searchParams.get('page')!)

		if (!isNaN(newPage) && newPage !== page) {
			setPage(newPage)
		} else {
			query.refetch()
		}

		scrollTo({ top: 0, behavior: 'instant' })
	}, [searchParams])

	if (query.isLoading)
		return (
			<ProductCardListSkeleton
				itemCount={9}
				className='mt-8 flex flex-wrap w-full gap-6 justify-start'
			/>
		)

	if (query.isError)
		return (
			<ErrorMessage
				message='Something went wrong'
				className='my-8'
			/>
		)

	if (query.data.products.length === 0)
		return <p className='py-16 text-center'>No results</p>

	return (
		<div>
			<ProductCardList
				products={query.data.products}
				className='mt-8 flex flex-wrap w-full gap-6 justify-start'
			/>

			{totalPages > 1 && (
				<>
					<Separator className='my-8' />
					<DynamicPagination totalPages={totalPages} />
				</>
			)}
		</div>
	)
}
