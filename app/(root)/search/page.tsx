import ErrorMessage from '@/components/error-message'
import { Input } from '@/components/ui/input'
import { searchProducts } from '@/features/product/actions/read'
import ProductCardList from '@/features/product/components/product-list'
import { cn } from '@/lib/utils'
import { SearchIcon } from 'lucide-react'
import Form from 'next/form'
import Link from 'next/link'

export type SearchPageProps = {
	searchParams: Promise<{ query?: string }>
}

export default async function SearchPage(props: SearchPageProps) {
	const searchQuery = (await props.searchParams).query ?? ''
	const response = await searchProducts(searchQuery)

	return (
		<main className='container py-16'>
			<div className='text-center'>
				<h1 className='text-4xl font-bold'>Search Products</h1>
				<p className='text-gray-700'>Search products by name or description</p>

				<Form
					action=''
					className='relative max-w-2xl mx-auto mt-6'
				>
					<SearchIcon className='absolute left-4 top-1/2 -translate-y-1/2 size-4' />
					<Input
						className={cn(
							'bg-neutral-100 rounded-full pl-10',
							searchQuery && 'pr-16'
						)}
						placeholder='Enter search term here...'
						name='query'
						defaultValue={searchQuery}
					/>
					{searchQuery && (
						<Link
							href='/search'
							className='absolute right-4 top-1/2 -translate-y-1/2'
						>
							Clear
						</Link>
					)}
				</Form>
			</div>

			{response.success ? (
				response.products.length ? (
					<ProductCardList products={response.products} />
				) : (
					<p className='text-center py-16'>No products match this query</p>
				)
			) : (
				<ErrorMessage
					message='Something went wrong'
					className='container mt-6'
				/>
			)}
		</main>
	)
}
