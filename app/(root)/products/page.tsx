import FilterBox, { FilterBoxSkeleton } from '@/components/filter-box'
import SortSelect, { SortSelectItem } from '@/components/sort-select'
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator
} from '@/components/ui/breadcrumb'
import { Button } from '@/components/ui/button'
import {
	DialogDescription,
	DialogHeader,
	DialogTitle
} from '@/components/ui/dialog'
import { Drawer, DrawerContent, DrawerTrigger } from '@/components/ui/drawer'
import { countProducts, filterProducts } from '@/features/product/actions'
import PaginatedProductList from '@/features/product/components/paginated-product-list'
import { ProductCardListSkeleton } from '@/features/product/components/product-list'
import { SearchParams } from '@/lib/types'
import { SlidersHorizontalIcon } from 'lucide-react'
import { Suspense } from 'react'

const sortItems: SortSelectItem[] = [
	{
		label: 'Date',
		value: 'date'
	},
	{
		label: 'Price',
		value: 'price'
	},
	{
		label: 'Rating',
		value: 'rating'
	}
]

export default async function ProductsPage(props: {
	searchParams: Promise<SearchParams>
}) {
	const searchParams = await props.searchParams
	const { page, pageSize = 9, ...filters } = searchParams
	const [filteredProducts, totalProducts] = await Promise.all([
		filterProducts(filters, {
			page: parseInt(page as string),
			pageSize: parseInt(pageSize as string)
		}),
		countProducts()
	])
	const totalPages = Math.ceil(totalProducts / parseInt(pageSize as string))

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
				<div className='max-md:hidden'>
					<Suspense fallback={<FilterBoxSkeleton />}>
						<FilterBox />
					</Suspense>
				</div>

				<main className='grow'>
					<div className='flex items-center justify-between'>
						<h1 className='text-3xl font-bold'>Products</h1>
						<div className='flex items-center gap-4'>
							<SortSelect items={sortItems} />

							<div className='md:hidden'>
								<Drawer>
									<DrawerTrigger asChild>
										<Button
											size='icon'
											variant='secondary'
										>
											<SlidersHorizontalIcon />
										</Button>
									</DrawerTrigger>
									<DrawerContent className='h-full'>
										<DialogHeader className='sr-only'>
											<DialogTitle>Filters</DialogTitle>
											<DialogDescription>
												Apply filters as you like.
											</DialogDescription>
										</DialogHeader>
										<Suspense
											fallback={
												<FilterBoxSkeleton className='w-full overflow-y-auto border-none' />
											}
										>
											<FilterBox className='w-full overflow-y-auto border-none' />
										</Suspense>
									</DrawerContent>
								</Drawer>
							</div>
						</div>
					</div>
					<Suspense
						fallback={
							<ProductCardListSkeleton
								itemCount={9}
								className='mt-8 flex flex-wrap w-full gap-6 justify-start'
							/>
						}
					>
						<PaginatedProductList
							initialData={filteredProducts}
							totalPages={totalPages}
						/>
					</Suspense>
				</main>
			</div>
		</div>
	)
}
