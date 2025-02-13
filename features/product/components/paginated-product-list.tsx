'use client'

import ErrorMessage from '@/components/error-message'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { TSize } from '@/db/schema/enums'
import { filterProducts } from '@/features/product/actions'
import { ProductCard } from '@/features/product/types'
import useUpdateEffect from '@/hooks/use-update-effect'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { useSearchParams } from 'next/navigation'
import { useState } from 'react'
import ProductCardList, { ProductCardListSkeleton } from './product-list'

type PaginatedProductListProps = {
	initialData: ProductCard[]
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
		max: parseInt(searchParams.get('max')!)
	}
	const query = useQuery({
		queryKey: ['products:get', page],
		queryFn: () => filterProducts(filters, { page }),
		initialData,
		placeholderData: keepPreviousData,
		refetchOnMount: false,
		refetchOnWindowFocus: false
	})

	useUpdateEffect(() => {
		query.refetch()
	}, [searchParams])

	const updatePage = (newPage: number) => {
		setPage(newPage)

		const updated = new URLSearchParams(searchParams)
		updated.set('page', newPage.toString())
		history.replaceState(null, '', `?${updated}`)
	}

	if (query.isLoading || query.isFetching)
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

	if (query.data.length === 0)
		return <p className='py-16 text-center'>No results</p>

	return (
		<div>
			<ProductCardList
				products={query.data}
				className='mt-8 flex flex-wrap w-full gap-6 justify-start'
			/>
			<Separator className='my-8' />
			<div className='flex items-center gap-4'>
				<Button
					variant='outline'
					onClick={() => updatePage(Math.max(page - 1, 1))}
				>
					Previous
				</Button>
				<Button
					variant='outline'
					onClick={() => updatePage(Math.min(page + 1, 10))}
				>
					Next
				</Button>
			</div>
		</div>
	)
}
