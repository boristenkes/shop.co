import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator
} from '@/components/ui/breadcrumb'
import { Button } from '@/components/ui/button'
import { auth } from '@/lib/auth'
import { hasPermission } from '@/lib/permissions'
import { unslugify } from '@/lib/utils'
import { EditIcon } from 'lucide-react'
import Link from 'next/link'
import { Suspense } from 'react'
import ProductPageDetails, {
	ProductPageDetailsSkeleton
} from './_components/product-page-details'

export default async function ProductLayout({
	params,
	children
}: {
	params: Promise<{ slug: string }>
	children: React.ReactNode
}) {
	const session = await auth()
	const currentUser = session?.user
	const slug = (await params).slug

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
				<ProductPageDetails slug={slug} />
			</Suspense>

			{children}
		</div>
	)
}
