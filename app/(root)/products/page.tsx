import FilterBox from '@/components/filter-box'
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
import { SearchParams } from '@/lib/types'

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
				<FilterBox />
				<main className='grow'>
					<div className='flex items-center justify-between gap-4'>
						<h1 className='text-3xl font-bold'>Products</h1>
					</div>
					<PaginatedProductList initialData={filteredProducts} />
				</main>
			</div>
		</div>
	)
}
