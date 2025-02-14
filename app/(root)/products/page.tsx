import FilterBox, { FilterBoxSkeleton } from '@/components/filter-box'
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator
} from '@/components/ui/breadcrumb'
import { filterProducts } from '@/features/product/actions'
import PaginatedProductList from '@/features/product/components/paginated-product-list'
import { ProductCardListSkeleton } from '@/features/product/components/product-list'
import { SearchParams } from '@/lib/types'
import { Suspense } from 'react'

export default async function ProductsPage(props: {
	searchParams: Promise<SearchParams>
}) {
	const searchParams = await props.searchParams
	const { page, pageSize, ...filters } = searchParams
	const filteredProducts = await filterProducts(filters, {
		page: parseInt(page as string),
		pageSize: parseInt(pageSize as string)
	})

	return (
		<div className='container'>
			<Breadcrumb className='my-6'>
				<BreadcrumbList>
					<BreadcrumbItem>
						<BreadcrumbLink href='/'>Home</BreadcrumbLink>
					</BreadcrumbItem>
					<BreadcrumbSeparator />
					<BreadcrumbItem>
						<BreadcrumbPage>Products</BreadcrumbPage>
					</BreadcrumbItem>
				</BreadcrumbList>
			</Breadcrumb>

			<div className='flex gap-5'>
				<Suspense fallback={<FilterBoxSkeleton />}>
					<FilterBox />
				</Suspense>

				<main className='grow'>
					<div className='flex items-center justify-between'>
						<h1 className='text-3xl font-bold'>Products</h1>
					</div>
					<Suspense
						fallback={
							<ProductCardListSkeleton
								itemCount={9}
								className='mt-8 flex flex-wrap w-full gap-6 justify-start'
							/>
						}
					>
						<PaginatedProductList initialData={filteredProducts} />
					</Suspense>
				</main>
			</div>
		</div>
	)
}
