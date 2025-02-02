import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator
} from '@/components/ui/breadcrumb'
import { Button } from '@/components/ui/button'
import { getProductById } from '@/features/product/actions'
import { auth } from '@/lib/auth'
import { hasPermission } from '@/lib/permissions'
import { absoluteUrl, limitTextLength, unslugify } from '@/lib/utils'
import { EditIcon } from 'lucide-react'
import { Metadata } from 'next'
import Link from 'next/link'
import { Suspense } from 'react'
import ProductPageDetails, {
	ProductPageDetailsSkeleton
} from './_components/product-page-details'
import ProductPageTabs from './_components/tabs'
import RelatedProducts, {
	RelatedProductsSkeleton
} from './reviews/related-products'

export async function generateMetadata(props: {
	params: Promise<{ slug: string; id: string }>
}): Promise<Metadata> {
	const { slug, id } = await props.params
	const response = await getProductById(Number(id))

	if (!response.success) return {}

	const { product } = response

	const title = limitTextLength(product.name, 50)
	const description = limitTextLength(product.description ?? '', 150)

	return {
		title,
		description,
		openGraph: {
			title,
			description,
			url: absoluteUrl(`/products/${slug}/${id}`),
			images: product.images.map(image => image.url)
		}
	}
}

export default async function ProductLayout({
	params,
	children
}: {
	params: Promise<{ slug: string; id: string }>
	children: React.ReactNode
}) {
	const session = await auth()
	const currentUser = session?.user
	const { slug, id } = await params

	return (
		<div>
			<div className='flex items-center justify-between container pt-6'>
				<Breadcrumb>
					<BreadcrumbList>
						<BreadcrumbItem>
							<BreadcrumbLink asChild>
								<Link
									href='/'
									className='text-base'
								>
									Home
								</Link>
							</BreadcrumbLink>
						</BreadcrumbItem>
						<BreadcrumbSeparator />
						<BreadcrumbItem>
							<BreadcrumbLink asChild>
								<Link
									href='/products'
									className='text-base'
								>
									Products
								</Link>
							</BreadcrumbLink>
						</BreadcrumbItem>
						<BreadcrumbSeparator />
						<BreadcrumbItem>
							<BreadcrumbPage className='text-base'>
								{unslugify(slug)}
							</BreadcrumbPage>
						</BreadcrumbItem>
					</BreadcrumbList>
				</Breadcrumb>

				{hasPermission(currentUser?.role!, 'products', ['update']) && (
					<Button
						variant='secondary'
						asChild
					>
						<Link href={`/dashboard/products/edit/${slug}`}>
							Edit product
							<EditIcon />
						</Link>
					</Button>
				)}
			</div>

			<Suspense fallback={<ProductPageDetailsSkeleton />}>
				<ProductPageDetails id={parseInt(id)} />
			</Suspense>

			<ProductPageTabs
				slug={slug}
				id={id}
			/>

			{children}

			<Suspense fallback={<RelatedProductsSkeleton />}>
				<RelatedProducts productId={parseInt(id)} />
			</Suspense>
		</div>
	)
}
