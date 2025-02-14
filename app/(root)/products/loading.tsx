import { FilterBoxSkeleton } from '@/components/filter-box'
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator
} from '@/components/ui/breadcrumb'
import { ProductCardListSkeleton } from '@/features/product/components/product-list'
import { Suspense } from 'react'

export default function ProductsPageLoading() {
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
				<FilterBoxSkeleton />

				<main className='grow'>
					<div className='flex items-center justify-between'>
						<h1 className='text-3xl font-bold'>Products</h1>
					</div>
					<Suspense
						fallback={
							<ProductCardListSkeleton
								itemCount={9}
								className='mt-8 grid grid-cols-[repeat(auto-fit,minmax(270px,1fr))] w-full gap-4 justify-start'
							/>
						}
					>
						<ProductCardListSkeleton itemCount={9} />
					</Suspense>
				</main>
			</div>
		</div>
	)
}
