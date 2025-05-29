import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator
} from '@/components/ui/breadcrumb'
import { auth } from '@/lib/auth'
import { integralCf } from '@/lib/fonts'
import Link from 'next/link'
import CartContents from './cart-contents'

export default async function CartPage() {
	const session = await auth()
	const isSignedIn = !!session

	return (
		<main className='container pt-6'>
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
						<BreadcrumbPage>Cart</BreadcrumbPage>
					</BreadcrumbItem>
				</BreadcrumbList>
			</Breadcrumb>

			<h1
				className={`${integralCf.className} text-4xl uppercase font-bold mt-6`}
			>
				Your cart
			</h1>

			<CartContents isSignedIn={isSignedIn} />
		</main>
	)
}
